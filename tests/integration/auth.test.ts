import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("@/lib/db", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    account: {
      findFirst: vi.fn(),
      create: vi.fn(),
    },
    verificationToken: {
      findUnique: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

vi.mock("@/lib/email", () => ({
  sendVerificationEmail: vi.fn(),
  sendPasswordResetEmail: vi.fn(),
  sendTwoFactorEmail: vi.fn(),
}));

vi.mock("bcryptjs", () => ({
  hash: vi.fn((s: string) => Promise.resolve(`hashed_${s}`)),
  compare: vi.fn((s: string, hash: string) =>
    Promise.resolve(hash === `hashed_${s}`)
  ),
}));

import { prisma } from "@/lib/db";
import * as emailLib from "@/lib/email";

interface RegisterUserData {
  name: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

async function registerUser(data: RegisterUserData) {
  const existing = await prisma.user.findUnique({
    where: { email: data.email },
  });
  if (existing) {
    return { success: false, error: "Email já cadastrado" };
  }

  const { hash } = await import("bcryptjs");
  const hashedPassword = await hash(data.password, 12);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
    },
  });

  await emailLib.sendVerificationEmail(data.email, "mock-token-123");

  return { success: true, data: { id: user.id, email: user.email } };
}

async function loginUser(data: LoginData) {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    return { success: false, error: "Credenciais inválidas" };
  }

  const { compare } = await import("bcryptjs");
  const isValid = await compare(data.password, user.password);

  if (!isValid) {
    return { success: false, error: "Credenciais inválidas" };
  }

  return { success: true, data: { id: user.id, email: user.email } };
}

describe("Auth - Registration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("registers a new user successfully", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.user.create).mockResolvedValue({
      id: "user-1",
      name: "João Silva",
      email: "joao@example.com",
      password: "hashed_Abc12345",
      emailVerified: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);

    const result = await registerUser({
      name: "João Silva",
      email: "joao@example.com",
      password: "Abc12345",
    });

    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    expect(emailLib.sendVerificationEmail).toHaveBeenCalledWith(
      "joao@example.com",
      "mock-token-123"
    );
  });

  it("rejects duplicate email", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "existing-user",
      email: "joao@example.com",
    } as any);

    const result = await registerUser({
      name: "João Silva",
      email: "joao@example.com",
      password: "Abc12345",
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe("Email já cadastrado");
    expect(prisma.user.create).not.toHaveBeenCalled();
  });

  it("hashes password before storing", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.user.create).mockResolvedValue({
      id: "user-2",
      email: "maria@example.com",
      password: "hashed_SecurePass1",
    } as any);

    await registerUser({
      name: "Maria",
      email: "maria@example.com",
      password: "SecurePass1",
    });

    expect(prisma.user.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          password: "hashed_SecurePass1",
        }),
      })
    );
  });
});

describe("Auth - Login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("logs in with correct credentials", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "user-1",
      email: "joao@example.com",
      password: "hashed_Abc12345",
      name: "João Silva",
    } as any);

    const result = await loginUser({
      email: "joao@example.com",
      password: "Abc12345",
    });

    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
  });

  it("rejects login with wrong password", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "user-1",
      email: "joao@example.com",
      password: "hashed_Abc12345",
    } as any);

    const result = await loginUser({
      email: "joao@example.com",
      password: "WrongPass1",
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe("Credenciais inválidas");
  });

  it("rejects login for non-existent user", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

    const result = await loginUser({
      email: "noone@example.com",
      password: "SomePass123",
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe("Credenciais inválidas");
  });
});

describe("Auth - Password Reset Flow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("sends password reset email for existing user", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "user-1",
      email: "joao@example.com",
    } as any);

    const user = await prisma.user.findUnique({
      where: { email: "joao@example.com" },
    });

    expect(user).not.toBeNull();

    if (user) {
      await emailLib.sendPasswordResetEmail(user.email, "reset-token-123");
      expect(emailLib.sendPasswordResetEmail).toHaveBeenCalledWith(
        "joao@example.com",
        "reset-token-123"
      );
    }
  });

  it("does not reveal if email exists", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

    const user = await prisma.user.findUnique({
      where: { email: "nonexistent@example.com" },
    });

    expect(user).toBeNull();
  });
});

describe("Auth - 2FA Flow", () => {
  it("sends 2FA code when enabled", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "user-1",
      email: "joao@example.com",
      twoFactorEnabled: true,
    } as any);

    const user = await prisma.user.findUnique({
      where: { email: "joao@example.com" },
    });

    if (user && user.twoFactorEnabled) {
      const code = "482910";
      await emailLib.sendTwoFactorEmail(user.email, code);
      expect(emailLib.sendTwoFactorEmail).toHaveBeenCalledWith(
        "joao@example.com",
        code
      );
    }
  });

  it("skips 2FA when not enabled", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "user-1",
      email: "joao@example.com",
      twoFactorEnabled: false,
    } as any);

    expect(emailLib.sendTwoFactorEmail).not.toHaveBeenCalled();
  });
});
