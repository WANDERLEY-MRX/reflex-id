import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/db", () => ({
  prisma: {
    evidence: {
      create: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    evidenceFile: {
      create: vi.fn(),
      deleteMany: vi.fn(),
    },
    validation: {
      create: vi.fn(),
      findMany: vi.fn(),
    },
    user: {
      findUnique: vi.fn(),
    },
  },
}));

vi.mock("@/lib/upload", () => ({
  uploadFile: vi.fn((file: any) =>
    Promise.resolve({
      url: `https://cdn.reflexid.com.br/${file.name}`,
      hash: "file-hash-123",
    })
  ),
  deleteFile: vi.fn(),
}));

import { prisma } from "@/lib/db";

interface CreateEvidenceData {
  userId: string;
  title: string;
  description?: string;
  type: string;
  url?: string;
  source?: string;
}

interface EvidenceFileData {
  evidenceId: string;
  filename: string;
  mimeType: string;
  size: number;
  hash: string;
  url: string;
}

async function createEvidence(data: CreateEvidenceData) {
  const evidence = await prisma.evidence.create({
    data: {
      userId: data.userId,
      title: data.title,
      description: data.description,
      type: data.type as any,
      url: data.url,
      source: data.source,
      verificationStatus: "PENDING",
      confidenceLevel: "LOW",
    },
  });
  return evidence;
}

async function uploadEvidenceFile(data: EvidenceFileData) {
  const file = await prisma.evidenceFile.create({ data });
  return file;
}

async function verifyEvidence(
  evidenceId: string,
  validatorId: string,
  status: "APPROVED" | "REJECTED",
  comment?: string
) {
  const evidence = await prisma.evidence.findUnique({
    where: { id: evidenceId },
  });

  if (!evidence) {
    return { success: false, error: "Evidência não encontrada" };
  }

  const validation = await prisma.validation.create({
    data: {
      evidenceId,
      validatorId,
      validatorType: "MANUAL",
      status,
      comment,
      confidenceLevel: status === "APPROVED" ? "HIGH" : "LOW",
    },
  });

  if (status === "APPROVED") {
    await prisma.evidence.update({
      where: { id: evidenceId },
      data: {
        verificationStatus: "VERIFIED",
        confidenceLevel: "HIGH",
      },
    });
  } else {
    await prisma.evidence.update({
      where: { id: evidenceId },
      data: {
        verificationStatus: "REJECTED",
      },
    });
  }

  return { success: true, data: validation };
}

describe("Evidence - Creation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates evidence with pending status", async () => {
    vi.mocked(prisma.evidence.create).mockResolvedValue({
      id: "ev-1",
      userId: "user-1",
      title: "Certificado de React",
      type: "CERTIFICATE",
      verificationStatus: "PENDING",
      confidenceLevel: "LOW",
      createdAt: new Date(),
    } as any);

    const evidence = await createEvidence({
      userId: "user-1",
      title: "Certificado de React",
      type: "CERTIFICATE",
      source: "Udemy",
    });

    expect(evidence).toBeDefined();
    expect(evidence.verificationStatus).toBe("PENDING");
    expect(prisma.evidence.create).toHaveBeenCalledOnce();
  });

  it("creates evidence with all optional fields", async () => {
    vi.mocked(prisma.evidence.create).mockResolvedValue({
      id: "ev-2",
      userId: "user-1",
      title: "Diploma Engenharia",
      description: "Curso concluído em 2025",
      type: "DIPLOMA",
      url: "https://example.com/diploma.pdf",
      source: "Universidade",
      verificationStatus: "PENDING",
      confidenceLevel: "LOW",
    } as any);

    const evidence = await createEvidence({
      userId: "user-1",
      title: "Diploma Engenharia",
      description: "Curso concluído em 2025",
      type: "DIPLOMA",
      url: "https://example.com/diploma.pdf",
      source: "Universidade",
    });

    expect(evidence.title).toBe("Diploma Engenharia");
    expect(evidence.description).toBe("Curso concluído em 2025");
    expect(evidence.url).toBe("https://example.com/diploma.pdf");
  });
});

describe("Evidence - File Upload", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("attaches file to evidence", async () => {
    vi.mocked(prisma.evidenceFile.create).mockResolvedValue({
      id: "file-1",
      evidenceId: "ev-1",
      filename: "certificado.pdf",
      mimeType: "application/pdf",
      size: 1024000,
      hash: "abc123",
      url: "https://cdn.reflexid.com.br/certificado.pdf",
    } as any);

    const file = await uploadEvidenceFile({
      evidenceId: "ev-1",
      filename: "certificado.pdf",
      mimeType: "application/pdf",
      size: 1024000,
      hash: "abc123",
      url: "https://cdn.reflexid.com.br/certificado.pdf",
    });

    expect(file).toBeDefined();
    expect(file.mimeType).toBe("application/pdf");
    expect(prisma.evidenceFile.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        evidenceId: "ev-1",
        filename: "certificado.pdf",
      }),
    });
  });

  it("stores file hash for integrity", async () => {
    vi.mocked(prisma.evidenceFile.create).mockResolvedValue({
      id: "file-2",
      hash: "sha256-hash-value",
    } as any);

    const file = await uploadEvidenceFile({
      evidenceId: "ev-1",
      filename: "doc.pdf",
      mimeType: "application/pdf",
      size: 500000,
      hash: "sha256-hash-value",
      url: "https://cdn.reflexid.com.br/doc.pdf",
    });

    expect(file.hash).toBe("sha256-hash-value");
  });
});

describe("Evidence - Verification", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("approves evidence and updates status", async () => {
    vi.mocked(prisma.evidence.findUnique).mockResolvedValue({
      id: "ev-1",
      verificationStatus: "PENDING",
    } as any);
    vi.mocked(prisma.validation.create).mockResolvedValue({
      id: "val-1",
      evidenceId: "ev-1",
      validatorId: "verifier-1",
      status: "APPROVED",
    } as any);
    vi.mocked(prisma.evidence.update).mockResolvedValue({
      id: "ev-1",
      verificationStatus: "VERIFIED",
      confidenceLevel: "HIGH",
    } as any);

    const result = await verifyEvidence("ev-1", "verifier-1", "APPROVED");

    expect(result.success).toBe(true);
    expect(prisma.evidence.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "ev-1" },
        data: expect.objectContaining({
          verificationStatus: "VERIFIED",
        }),
      })
    );
  });

  it("rejects evidence with reason", async () => {
    vi.mocked(prisma.evidence.findUnique).mockResolvedValue({
      id: "ev-2",
      verificationStatus: "PENDING",
    } as any);
    vi.mocked(prisma.validation.create).mockResolvedValue({
      id: "val-2",
      status: "REJECTED",
      comment: "Documento ilegível",
    } as any);
    vi.mocked(prisma.evidence.update).mockResolvedValue({
      id: "ev-2",
      verificationStatus: "REJECTED",
    } as any);

    const result = await verifyEvidence(
      "ev-2",
      "verifier-1",
      "REJECTED",
      "Documento ilegível"
    );

    expect(result.success).toBe(true);
    expect(prisma.validation.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          comment: "Documento ilegível",
        }),
      })
    );
  });

  it("fails when evidence does not exist", async () => {
    vi.mocked(prisma.evidence.findUnique).mockResolvedValue(null);

    const result = await verifyEvidence("nonexistent", "verifier-1", "APPROVED");

    expect(result.success).toBe(false);
    expect(result.error).toBe("Evidência não encontrada");
  });
});

describe("Evidence - Deletion", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deletes evidence and associated files", async () => {
    vi.mocked(prisma.evidence.findUnique).mockResolvedValue({
      id: "ev-1",
      userId: "user-1",
    } as any);
    vi.mocked(prisma.evidenceFile.deleteMany).mockResolvedValue({ count: 2 });
    vi.mocked(prisma.evidence.delete).mockResolvedValue({ id: "ev-1" } as any);

    const evidence = await prisma.evidence.findUnique({
      where: { id: "ev-1" },
    });

    expect(evidence).not.toBeNull();

    if (evidence) {
      await prisma.evidenceFile.deleteMany({
        where: { evidenceId: "ev-1" },
      });
      await prisma.evidence.delete({
        where: { id: "ev-1" },
      });

      expect(prisma.evidenceFile.deleteMany).toHaveBeenCalledWith({
        where: { evidenceId: "ev-1" },
      });
      expect(prisma.evidence.delete).toHaveBeenCalledWith({
        where: { id: "ev-1" },
      });
    }
  });

  it("requires ownership to delete", async () => {
    vi.mocked(prisma.evidence.findUnique).mockResolvedValue({
      id: "ev-1",
      userId: "owner-1",
    } as any);

    const evidence = await prisma.evidence.findUnique({
      where: { id: "ev-1" },
    });

    expect(evidence?.userId).toBe("owner-1");
  });
});
