export const AID_DOCUMENT_MAX_BYTES = 10 * 1024 * 1024;
export const AID_DOCUMENT_MAX_COUNT = 5;
export const PRIVATE_DOCUMENT_TTL_SECONDS = 60;
export const AID_DOCUMENT_ACCEPT = ".pdf,.jpg,.jpeg,.png";

const extensions: Record<string, readonly string[]> = {
  "application/pdf": ["pdf"],
  "image/jpeg": ["jpg", "jpeg"],
  "image/png": ["png"],
};

export function validateAidDocument(file: Pick<File, "name" | "size" | "type">): void {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (!extensions[file.type]?.includes(ext)) throw new Error("Choose PDF, JPG or PNG documents only.");
  if (file.size <= 0 || file.size > AID_DOCUMENT_MAX_BYTES) throw new Error("Each document must be non-empty and no larger than 10 MB.");
}

export async function validateAidDocumentContents(file: File): Promise<void> {
  validateAidDocument(file);
  const bytes = new Uint8Array(await file.slice(0, 8).arrayBuffer());
  const signatures: Record<string, readonly number[]> = {
    "application/pdf": [0x25, 0x50, 0x44, 0x46, 0x2d],
    "image/jpeg": [0xff, 0xd8, 0xff],
    "image/png": [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a],
  };
  const signature = signatures[file.type];
  if (!signature?.every((byte, index) => bytes[index] === byte)) throw new Error("A document's contents do not match its file type.");
}

export function parseAwardAmount(value: string): number | null {
  if (!value.trim()) return null;
  if (!/^\d+(\.\d{1,2})?$/.test(value.trim())) throw new Error("Enter a non-negative LRD amount with up to two decimal places.");
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount > Number.MAX_SAFE_INTEGER / 100) throw new Error("Enter a valid LRD amount.");
  return amount;
}

export function requireAdmin(isAdmin: boolean): void {
  if (!isAdmin) throw new Error("Administrator authorization required.");
}

export function requireApplicationDocument(paths: unknown, path: string): void {
  if (!Array.isArray(paths) || !paths.includes(path) || !path || path.includes("..")) throw new Error("Document not found on this application.");
}