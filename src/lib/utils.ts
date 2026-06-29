import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { createHash, randomBytes } from "crypto";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(
  date: Date | string,
  options?: Intl.DateTimeFormatOptions
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    ...options,
  });
}

export function formatDateShort(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "agora";
  if (minutes < 60) return `${minutes}m atrás`;
  if (hours < 24) return `${hours}h atrás`;
  if (days < 30) return `${days}d atrás`;
  if (days < 365) return `${Math.floor(days / 30)}meses atrás`;
  return `${Math.floor(days / 365)}a atrás`;
}

export function slugify(text: string): string {
  return text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function generateHash(
  data: string,
  algorithm: "sha256" | "sha512" = "sha256"
): string {
  return createHash(algorithm).update(data).digest("hex");
}

export function generateRandomString(length: number = 32): string {
  return randomBytes(length).toString("hex");
}

export function generateApiKey(): { key: string; hash: string } {
  const key = `rx_${generateRandomString(32)}`;
  const hash = generateHash(key, "sha512");
  return { key, hash };
}

export async function generateQRCode(
  data: string
): Promise<string> {
  const { default: QRCode } = await import("qrcode");
  const url = await QRCode.toDataURL(data, {
    width: 300,
    margin: 2,
    color: {
      dark: "#7c3aed",
      light: "#ffffff",
    },
  });
  return url;
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length).trimEnd() + "...";
}

export function pluralize(
  count: number,
  singular: string,
  plural?: string
): string {
  if (count === 1) return `${count} ${singular}`;
  return `${count} ${plural ?? `${singular}s`}`;
}

export function maskEmail(email: string): string {
  const [name, domain] = email.split("@");
  const maskedName =
    name.length <= 3
      ? name.slice(0, 1) + "***"
      : name.slice(0, 3) + "***" + name.slice(-1);
  return `${maskedName}@${domain}`;
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function parseError(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Ocorreu um erro inesperado";
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}
