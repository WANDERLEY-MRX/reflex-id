import { UPLOADTHING_CONFIG } from "@/lib/upload";

const ALLOWED_MIME_TYPES: ReadonlySet<string> = new Set(
  UPLOADTHING_CONFIG.allowedFileTypes
);

const MAX_FILE_SIZE = UPLOADTHING_CONFIG.maxFileSize;

const SLUG_REGEX = /^[a-z0-9-]{3,50}$/;

const HTML_TAG_REGEX = /<[^>]*>/g;
const SCRIPT_TAG_REGEX = /<script[\s\S]*?<\/script>/gi;
const ON_EVENT_REGEX = /\son\w+\s*=\s*["'][^"']*["']/gi;
const JAVASCRIPT_PROTOCOL_REGEX = /javascript:/gi;

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateFileType(mimeType: string): ValidationResult {
  if (!mimeType) {
    return { valid: false, error: "Tipo de arquivo não especificado" };
  }

  if (!ALLOWED_MIME_TYPES.has(mimeType)) {
    return {
      valid: false,
      error: `Tipo de arquivo não permitido: ${mimeType}`,
    };
  }

  return { valid: true };
}

export function validateFileSize(size: number): ValidationResult {
  if (typeof size !== "number" || size < 0) {
    return { valid: false, error: "Tamanho de arquivo inválido" };
  }

  if (size === 0) {
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

export function validateFile(filename: string, mimeType: string, size: number): ValidationResult {
  const typeCheck = validateFileType(mimeType);
  if (!typeCheck.valid) return typeCheck;

  const sizeCheck = validateFileSize(size);
  if (!sizeCheck.valid) return sizeCheck;

  if (!filename || filename.length > 255) {
    return { valid: false, error: "Nome de arquivo inválido" };
  }

  const forbiddenChars = /[<>:"/\\|?*\x00-\x1f]/;
  if (forbiddenChars.test(filename)) {
    return { valid: false, error: "Nome de arquivo contém caracteres inválidos" };
  }

  return { valid: true };
}

export function sanitizeHtml(input: string): string {
  if (!input) return "";

  let sanitized = input
    .replace(SCRIPT_TAG_REGEX, "")
    .replace(ON_EVENT_REGEX, "")
    .replace(JAVASCRIPT_PROTOCOL_REGEX, "")
    .replace(HTML_TAG_REGEX, "");

  sanitized = sanitized
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");

  return sanitized;
}

export function sanitizeHtmlLight(input: string): string {
  if (!input) return "";

  const allowedTags = new Set([
    "b", "i", "em", "strong", "a", "br", "p",
    "ul", "ol", "li", "code", "pre", "blockquote",
  ]);

  return input
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, (tag) => {
      const tagName = tag.replace(/<\/?(\w+).*/, "$1").toLowerCase();
      if (allowedTags.has(tagName)) {
        return tag
          .replace(ON_EVENT_REGEX, "")
          .replace(JAVASCRIPT_PROTOCOL_REGEX, "");
      }
      return "";
    });
}

export function validateSlug(slug: string): ValidationResult {
  if (!slug || typeof slug !== "string") {
    return { valid: false, error: "Slug é obrigatório" };
  }

  if (!SLUG_REGEX.test(slug)) {
    return {
      valid: false,
      error: "Slug deve ter entre 3 e 50 caracteres e conter apenas letras minúsculas, números e hífens",
    };
  }

  if (slug.startsWith("-") || slug.endsWith("-")) {
    return { valid: false, error: "Slug não pode começar ou terminar com hífen" };
  }

  if (slug.includes("--")) {
    return { valid: false, error: "Slug não pode conter hífens consecutivos" };
  }

  return { valid: true };
}

export function validateEmail(email: string): ValidationResult {
  if (!email) {
    return { valid: false, error: "Email é obrigatório" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: "Email inválido" };
  }

  if (email.length > 254) {
    return { valid: false, error: "Email muito longo" };
  }

  return { valid: true };
}

export function validateUrl(url: string): ValidationResult {
  if (!url) {
    return { valid: true };
  }

  try {
    const parsed = new URL(url);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return { valid: false, error: "URL deve usar HTTP ou HTTPS" };
    }
    return { valid: true };
  } catch {
    return { valid: false, error: "URL inválida" };
  }
}

export function validatePasswordStrength(password: string): ValidationResult {
  if (!password) {
    return { valid: false, error: "Senha é obrigatória" };
  }

  if (password.length < 8) {
    return { valid: false, error: "Senha deve ter no mínimo 8 caracteres" };
  }

  if (password.length > 128) {
    return { valid: false, error: "Senha deve ter no máximo 128 caracteres" };
  }

  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: "Senha deve conter pelo menos uma letra maiúscula" };
  }

  if (!/[a-z]/.test(password)) {
    return { valid: false, error: "Senha deve conter pelo menos uma letra minúscula" };
  }

  if (!/\d/.test(password)) {
    return { valid: false, error: "Senha deve conter pelo menos um número" };
  }

  return { valid: true };
}
