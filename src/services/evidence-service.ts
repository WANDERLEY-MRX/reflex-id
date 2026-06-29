import { createHash } from "crypto";
import { UPLOADTHING_CONFIG } from "@/lib/upload";

export const ALLOWED_MIME_TYPES: ReadonlySet<string> = new Set(
  UPLOADTHING_CONFIG.allowedFileTypes
);

export const MAX_FILE_SIZE = 10 * 1024 * 1024;
export const ALLOWED_EVIDENCE_EXTENSIONS: ReadonlySet<string> = new Set([
  ".jpg", ".jpeg", ".png", ".webp", ".gif",
  ".pdf",
  ".doc", ".docx",
  ".txt",
]);

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

export class EvidenceService {
  generateFileHash(buffer: Buffer): string {
    return createHash("sha256").update(buffer).digest("hex");
  }

  generateContentHash(content: string): string {
    return createHash("sha256").update(content).digest("hex");
  }

  validateMimeType(mimeType: string): FileValidationResult {
    if (!ALLOWED_MIME_TYPES.has(mimeType)) {
      return {
        valid: false,
        error: `Tipo de arquivo não permitido: ${mimeType}`,
      };
    }
    return { valid: true };
  }

  validateFileSize(size: number): FileValidationResult {
    if (size <= 0) {
      return { valid: false, error: "Arquivo vazio" };
    }
    if (size > MAX_FILE_SIZE) {
      const maxMB = MAX_FILE_SIZE / (1024 * 1024);
      return {
        valid: false,
        error: `Arquivo muito grande. Máximo permitido: ${maxMB}MB`,
      };
    }
    return { valid: true };
  }

  validateFileExtension(filename: string): FileValidationResult {
    const ext = filename.toLowerCase().slice(filename.lastIndexOf("."));
    if (!ALLOWED_EVIDENCE_EXTENSIONS.has(ext)) {
      return {
        valid: false,
        error: `Extensão não permitida: ${ext}`,
      };
    }
    return { valid: true };
  }

  validateFile(filename: string, mimeType: string, size: number): FileValidationResult {
    const extCheck = this.validateFileExtension(filename);
    if (!extCheck.valid) return extCheck;

    const mimeCheck = this.validateMimeType(mimeType);
    if (!mimeCheck.valid) return mimeCheck;

    const sizeCheck = this.validateFileSize(size);
    if (!sizeCheck.valid) return sizeCheck;

    return { valid: true };
  }

  detectDuplicateContent(hash: string, existingHashes: string[]): boolean {
    return existingHashes.includes(hash);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 B";
    const units = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    const size = (bytes / Math.pow(1024, i)).toFixed(i > 0 ? 1 : 0);
    return `${size} ${units[i]}`;
  }
}

export const evidenceService = new EvidenceService();
