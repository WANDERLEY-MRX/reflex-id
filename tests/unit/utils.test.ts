import { describe, it, expect } from "vitest";
import {
  cn,
  slugify,
  formatDate,
  formatDateShort,
  formatRelativeTime,
  generateHash,
  generateRandomString,
  truncate,
  pluralize,
  maskEmail,
  getInitials,
  parseError,
} from "@/lib/utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("px-4", "py-2")).toBe("px-4 py-2");
  });

  it("handles conditional classes", () => {
    expect(cn("base", false && "hidden", "visible")).toBe("base visible");
  });

  it("merges tailwind classes correctly", () => {
    expect(cn("px-4", "px-6")).toBe("px-6");
  });

  it("handles empty inputs", () => {
    expect(cn()).toBe("");
  });

  it("handles undefined values", () => {
    expect(cn("block", undefined, "flex")).toBe("block flex");
  });
});

describe("slugify", () => {
  it("converts text to slug", () => {
    expect(slugify("João Silva")).toBe("joao-silva");
  });

  it("removes accents", () => {
    expect(slugify("àáâãäåèéêëìíîï")).toBe("aaaaaaeeeeiiiiooooouuuuc");
  });

  it("lowercases text", () => {
    expect(slugify("HELLO World")).toBe("hello-world");
  });

  it("replaces spaces with hyphens", () => {
    expect(slugify("a b c")).toBe("a-b-c");
  });

  it("removes special characters", () => {
    expect(slugify("hello@world!")).toBe("helloworld");
  });

  it("collapses multiple hyphens", () => {
    expect(slugify("a---b")).toBe("a-b");
  });

  it("trims leading and trailing hyphens", () => {
    expect(slugify("-hello-")).toBe("hello");
  });

  it("handles empty string", () => {
    expect(slugify("")).toBe("");
  });

  it("handles numbers", () => {
    expect(slugify("Version 2.0")).toBe("version-20");
  });
});

describe("formatDate", () => {
  it("formats date in pt-BR", () => {
    const date = new Date(2025, 0, 15);
    expect(formatDate(date)).toContain("janeiro");
    expect(formatDate(date)).toContain("2025");
  });

  it("accepts date string", () => {
    const result = formatDate("2025-01-15");
    expect(result).toContain("janeiro");
  });

  it("accepts custom options", () => {
    const date = new Date(2025, 0, 15);
    const result = formatDate(date, { month: "numeric" });
    expect(result).toBe("15/01/2025");
  });
});

describe("formatDateShort", () => {
  it("formats as DD/MM/YYYY", () => {
    const date = new Date(2025, 11, 25);
    expect(formatDateShort(date)).toBe("25/12/2025");
  });
});

describe("formatRelativeTime", () => {
  it('returns "agora" for recent dates', () => {
    expect(formatRelativeTime(new Date())).toBe("agora");
  });

  it("returns minutes", () => {
    const date = new Date(Date.now() - 5 * 60 * 1000);
    expect(formatRelativeTime(date)).toBe("5m atrás");
  });

  it("returns hours", () => {
    const date = new Date(Date.now() - 3 * 3600 * 1000);
    expect(formatRelativeTime(date)).toBe("3h atrás");
  });

  it("returns days", () => {
    const date = new Date(Date.now() - 10 * 86400 * 1000);
    expect(formatRelativeTime(date)).toBe("10d atrás");
  });
});

describe("generateHash", () => {
  it("generates SHA-256 hash", () => {
    const hash = generateHash("hello");
    expect(hash).toHaveLength(64);
    expect(hash).toMatch(/^[a-f0-9]+$/);
  });

  it("generates SHA-512 hash", () => {
    const hash = generateHash("hello", "sha512");
    expect(hash).toHaveLength(128);
    expect(hash).toMatch(/^[a-f0-9]+$/);
  });

  it("produces same hash for same input", () => {
    const a = generateHash("test-data");
    const b = generateHash("test-data");
    expect(a).toBe(b);
  });

  it("produces different hash for different input", () => {
    const a = generateHash("data-a");
    const b = generateHash("data-b");
    expect(a).not.toBe(b);
  });
});

describe("generateRandomString", () => {
  it("generates string of specified length (hex)", () => {
    const result = generateRandomString(16);
    expect(result).toHaveLength(32);
  });

  it("defaults to 32 bytes (64 chars)", () => {
    const result = generateRandomString();
    expect(result).toHaveLength(64);
  });

  it("generates unique values", () => {
    const a = generateRandomString(8);
    const b = generateRandomString(8);
    expect(a).not.toBe(b);
  });
});

describe("truncate", () => {
  it("returns string if within length", () => {
    expect(truncate("short", 10)).toBe("short");
  });

  it("truncates long strings", () => {
    expect(truncate("this is a long string", 10)).toBe("this is ...");
  });

  it("trims trailing space before ellipsis", () => {
    expect(truncate("hello world test", 5)).toBe("hello...");
  });
});

describe("pluralize", () => {
  it("uses singular for 1", () => {
    expect(pluralize(1, "item")).toBe("1 item");
  });

  it("uses plural for 0", () => {
    expect(pluralize(0, "item")).toBe("0 items");
  });

  it("uses plural for > 1", () => {
    expect(pluralize(5, "item")).toBe("5 items");
  });

  it("accepts custom plural", () => {
    expect(pluralize(3, "criança", "crianças")).toBe("3 crianças");
  });
});

describe("maskEmail", () => {
  it("masks email username", () => {
    expect(maskEmail("joao.silva@example.com")).toBe("joa***a@example.com");
  });

  it("masks short username", () => {
    expect(maskEmail("ab@test.com")).toBe("a***@test.com");
  });
});

describe("getInitials", () => {
  it("returns initials from full name", () => {
    expect(getInitials("João Silva")).toBe("JS");
  });

  it("returns at most 2 characters", () => {
    expect(getInitials("João Pedro Silva")).toBe("JP");
  });

  it("handles single name", () => {
    expect(getInitials("João")).toBe("J");
  });
});

describe("parseError", () => {
  it("returns error message from Error instance", () => {
    expect(parseError(new Error("Algo deu errado"))).toBe("Algo deu errado");
  });

  it("returns string directly", () => {
    expect(parseError("Error message")).toBe("Error message");
  });

  it('returns generic message for unknown errors', () => {
    expect(parseError(null)).toBe("Ocorreu um erro inesperado");
    expect(parseError(undefined)).toBe("Ocorreu um erro inesperado");
    expect(parseError(42)).toBe("Ocorreu um erro inesperado");
  });
});
