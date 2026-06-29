import { describe, it, expect } from "vitest";
import {
  loginSchema,
  registerSchema,
  profileSchema,
  evidenceSchema,
  projectSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  organizationSchema,
  validationSchema,
  skillSchema,
  timelineEventSchema,
} from "@/schemas";

function sanitizeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

function validateSlug(slug: string): boolean {
  return /^[a-z0-9-]+$/.test(slug) && slug.length >= 3 && slug.length <= 50;
}

describe("sanitizeHtml", () => {
  it("escapes HTML tags", () => {
    expect(sanitizeHtml("<script>alert('xss')</script>")).toBe(
      "&lt;script&gt;alert(&#x27;xss&#x27;)&lt;/script&gt;"
    );
  });

  it("escapes ampersands", () => {
    expect(sanitizeHtml("a & b")).toBe("a &amp; b");
  });

  it("returns plain text unchanged", () => {
    expect(sanitizeHtml("Hello world")).toBe("Hello world");
  });

  it("escapes double quotes", () => {
    expect(sanitizeHtml('say "hello"')).toBe("say &quot;hello&quot;");
  });

  it("handles empty string", () => {
    expect(sanitizeHtml("")).toBe("");
  });
});

describe("validateSlug", () => {
  it("accepts valid slugs", () => {
    expect(validateSlug("joao-silva")).toBe(true);
    expect(validateSlug("user123")).toBe(true);
    expect(validateSlug("a-b-c-d")).toBe(true);
  });

  it("rejects slugs with uppercase", () => {
    expect(validateSlug("Joao-Silva")).toBe(false);
  });

  it("rejects slugs with special chars", () => {
    expect(validateSlug("joao_silva")).toBe(false);
    expect(validateSlug("joao.silva")).toBe(false);
    expect(validateSlug("joao@silva")).toBe(false);
  });

  it("rejects slugs shorter than 3 characters", () => {
    expect(validateSlug("ab")).toBe(false);
  });

  it("rejects slugs longer than 50 characters", () => {
    expect(validateSlug("a".repeat(51))).toBe(false);
  });

  it("rejects empty string", () => {
    expect(validateSlug("")).toBe(false);
  });
});

describe("loginSchema", () => {
  it("validates correct login input", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "Abc12345",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = loginSchema.safeParse({
      email: "not-an-email",
      password: "Abc12345",
    });
    expect(result.success).toBe(false);
  });

  it("rejects short password", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "1234567",
    });
    expect(result.success).toBe(false);
  });

  it("accepts optional 2FA code", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "Abc12345",
      code: "123456",
    });
    expect(result.success).toBe(true);
  });

  it("rejects 2FA code with wrong length", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "Abc12345",
      code: "12345",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty email", () => {
    const result = loginSchema.safeParse({
      email: "",
      password: "Abc12345",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty password", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "",
    });
    expect(result.success).toBe(false);
  });
});

describe("registerSchema", () => {
  it("validates correct registration", () => {
    const result = registerSchema.safeParse({
      name: "João Silva",
      email: "joao@example.com",
      password: "Abc12345",
      confirmPassword: "Abc12345",
    });
    expect(result.success).toBe(true);
  });

  it("rejects when passwords do not match", () => {
    const result = registerSchema.safeParse({
      name: "João Silva",
      email: "joao@example.com",
      password: "Abc12345",
      confirmPassword: "Different123",
    });
    expect(result.success).toBe(false);
  });

  it("rejects weak password", () => {
    const result = registerSchema.safeParse({
      name: "João Silva",
      email: "joao@example.com",
      password: "onlylowercase",
      confirmPassword: "onlylowercase",
    });
    expect(result.success).toBe(false);
  });

  it("rejects short name", () => {
    const result = registerSchema.safeParse({
      name: "J",
      email: "joao@example.com",
      password: "Abc12345",
      confirmPassword: "Abc12345",
    });
    expect(result.success).toBe(false);
  });
});

describe("profileSchema", () => {
  it("validates complete profile", () => {
    const result = profileSchema.safeParse({
      slug: "joao-silva",
      bio: "Desenvolvedor full-stack",
      headline: "Software Engineer",
      location: "São Paulo, SP",
      website: "https://joao.dev",
      interests: ["tecnologia", "música"],
      goals: ["Aprender Rust"],
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid slug", () => {
    const result = profileSchema.safeParse({
      slug: "João Silva!",
    });
    expect(result.success).toBe(false);
  });

  it("rejects bio longer than 500 characters", () => {
    const result = profileSchema.safeParse({
      slug: "joao-silva",
      bio: "a".repeat(501),
    });
    expect(result.success).toBe(false);
  });

  it("rejects more than 20 interests", () => {
    const result = profileSchema.safeParse({
      slug: "joao-silva",
      interests: Array(21).fill("item"),
    });
    expect(result.success).toBe(false);
  });

  it("accepts empty optional fields", () => {
    const result = profileSchema.safeParse({
      slug: "joao-silva",
      website: "",
    });
    expect(result.success).toBe(true);
  });
});

describe("evidenceSchema", () => {
  it("validates document evidence", () => {
    const result = evidenceSchema.safeParse({
      title: "Certificado de Conclusão",
      description: "Curso de React Avançado",
      type: "CERTIFICATE",
      url: "https://example.com/cert.pdf",
      source: "Udemy",
    });
    expect(result.success).toBe(true);
  });

  it("rejects short title", () => {
    const result = evidenceSchema.safeParse({
      title: "ab",
      type: "DOCUMENT",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid type", () => {
    const result = evidenceSchema.safeParse({
      title: "Test",
      type: "INVALID_TYPE",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid URL", () => {
    const result = evidenceSchema.safeParse({
      title: "Test",
      type: "LINK",
      url: "not-a-url",
    });
    expect(result.success).toBe(false);
  });

  it("rejects too long description", () => {
    const result = evidenceSchema.safeParse({
      title: "Test",
      type: "DOCUMENT",
      description: "a".repeat(2001),
    });
    expect(result.success).toBe(false);
  });

  it("rejects too long title", () => {
    const result = evidenceSchema.safeParse({
      title: "a".repeat(201),
      type: "DOCUMENT",
    });
    expect(result.success).toBe(false);
  });
});

describe("projectSchema", () => {
  it("validates complete project", () => {
    const result = projectSchema.safeParse({
      name: "Portfólio Pessoal",
      description: "Meu site pessoal",
      technologies: ["React", "Next.js", "TypeScript"],
      results: "Projeto concluído com sucesso",
      skillsAcquired: ["Frontend", "UI/UX"],
    });
    expect(result.success).toBe(true);
  });

  it("rejects short name", () => {
    const result = projectSchema.safeParse({
      name: "ab",
    });
    expect(result.success).toBe(false);
  });

  it("rejects more than 30 technologies", () => {
    const result = projectSchema.safeParse({
      name: "Test",
      technologies: Array(31).fill("tech"),
    });
    expect(result.success).toBe(false);
  });

  it("validates with images and links", () => {
    const result = projectSchema.safeParse({
      name: "Test",
      images: [{ url: "https://example.com/img.png" }],
      links: [{ title: "GitHub", url: "https://github.com/test" }],
    });
    expect(result.success).toBe(true);
  });

  it("rejects too long description", () => {
    const result = projectSchema.safeParse({
      name: "Test",
      description: "a".repeat(5001),
    });
    expect(result.success).toBe(false);
  });
});

describe("forgotPasswordSchema", () => {
  it("validates email", () => {
    expect(
      forgotPasswordSchema.safeParse({ email: "user@example.com" }).success
    ).toBe(true);
  });

  it("rejects invalid email", () => {
    expect(
      forgotPasswordSchema.safeParse({ email: "invalid" }).success
    ).toBe(false);
  });
});

describe("resetPasswordSchema", () => {
  it("validates with matching passwords", () => {
    const result = resetPasswordSchema.safeParse({
      token: "valid-token-123",
      password: "NewPass123",
      confirmPassword: "NewPass123",
    });
    expect(result.success).toBe(true);
  });

  it("rejects non-matching passwords", () => {
    const result = resetPasswordSchema.safeParse({
      token: "token",
      password: "NewPass123",
      confirmPassword: "OtherPass456",
    });
    expect(result.success).toBe(false);
  });

  it("rejects weak password", () => {
    const result = resetPasswordSchema.safeParse({
      token: "token",
      password: "weak",
      confirmPassword: "weak",
    });
    expect(result.success).toBe(false);
  });
});

describe("organizationSchema", () => {
  it("validates school organization", () => {
    const result = organizationSchema.safeParse({
      name: "Escola Exemplo",
      slug: "escola-exemplo",
      type: "SCHOOL",
      description: "Escola de ensino médio",
      website: "https://escolaexemplo.edu.br",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid slug", () => {
    const result = organizationSchema.safeParse({
      name: "Test",
      slug: "INVALID SLUG",
      type: "OTHER",
    });
    expect(result.success).toBe(false);
  });
});

describe("validationSchema", () => {
  it("validates approval", () => {
    const result = validationSchema.safeParse({
      evidenceId: "550e8400-e29b-41d4-a716-446655440000",
      status: "APPROVED",
      comment: "Evidência verificada e autêntica",
      confidenceLevel: "HIGH",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid UUID", () => {
    const result = validationSchema.safeParse({
      evidenceId: "not-a-uuid",
      status: "APPROVED",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid status", () => {
    const result = validationSchema.safeParse({
      evidenceId: "550e8400-e29b-41d4-a716-446655440000",
      status: "INVALID",
    });
    expect(result.success).toBe(false);
  });
});

describe("skillSchema", () => {
  it("validates skill", () => {
    const result = skillSchema.safeParse({
      name: "React",
      category: "HARD",
      level: 4,
    });
    expect(result.success).toBe(true);
  });

  it("rejects level above 5", () => {
    const result = skillSchema.safeParse({
      name: "React",
      category: "HARD",
      level: 6,
    });
    expect(result.success).toBe(false);
  });

  it("rejects level below 1", () => {
    const result = skillSchema.safeParse({
      name: "React",
      category: "HARD",
      level: 0,
    });
    expect(result.success).toBe(false);
  });

  it("defaults level to 1", () => {
    const result = skillSchema.safeParse({
      name: "React",
      category: "HARD",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.level).toBe(1);
    }
  });

  it("rejects short name", () => {
    const result = skillSchema.safeParse({
      name: "R",
      category: "HARD",
    });
    expect(result.success).toBe(false);
  });
});

describe("timelineEventSchema", () => {
  it("validates timeline event", () => {
    const result = timelineEventSchema.safeParse({
      title: "Estágio na Empresa X",
      description: "Trabalhei como desenvolvedor",
      date: new Date().toISOString(),
      category: "PROFESSIONAL",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid category", () => {
    const result = timelineEventSchema.safeParse({
      title: "Test",
      date: new Date().toISOString(),
      category: "INVALID",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid date format", () => {
    const result = timelineEventSchema.safeParse({
      title: "Test",
      date: "not-a-date",
      category: "OTHER",
    });
    expect(result.success).toBe(false);
  });
});
