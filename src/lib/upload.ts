export const UPLOADTHING_CONFIG = {
  maxFileSize: 16 * 1024 * 1024,
  allowedFileTypes: [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "application/pdf",
  ] as const,
};

export function isAllowedFileType(mimeType: string): boolean {
  return UPLOADTHING_CONFIG.allowedFileTypes.includes(mimeType as typeof UPLOADTHING_CONFIG.allowedFileTypes[number]);
}

export function isAllowedFileSize(size: number): boolean {
  return size <= UPLOADTHING_CONFIG.maxFileSize;
}