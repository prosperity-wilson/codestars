import { describe, expect, it } from "vitest";
import { AID_DOCUMENT_MAX_BYTES, PRIVATE_DOCUMENT_TTL_SECONDS, parseAwardAmount, requireAdmin, requireApplicationDocument, validateAidDocument, validateAidDocumentContents } from "@/lib/phase1-rules";

describe("financial aid document validation", () => {
  it.each([["proof.pdf", "application/pdf"], ["proof.jpg", "image/jpeg"], ["proof.png", "image/png"]])("accepts permitted %s files", (name, type) => {
    expect(() => validateAidDocument({ name, type, size: 1024 })).not.toThrow();
  });
  it("rejects unsupported document types", () => {
    expect(() => validateAidDocument({ name: "proof.exe", type: "application/octet-stream", size: 1024 })).toThrow();
  });
  it("rejects files larger than the existing bucket's 10 MB limit", () => {
    expect(AID_DOCUMENT_MAX_BYTES).toBe(10485760);
    expect(() => validateAidDocument({ name: "proof.pdf", type: "application/pdf", size: 10485761 })).toThrow();
    expect(() => validateAidDocument({ name: "proof.pdf", type: "application/pdf", size: 10485760 })).not.toThrow();
  });
  it("rejects empty files", () => {
    expect(() => validateAidDocument({ name: "proof.pdf", type: "application/pdf", size: 0 })).toThrow();
  });
  it("rejects disguised file contents", async () => {
    const file = { name: "proof.pdf", type: "application/pdf", size: 100, slice: () => ({ arrayBuffer: async () => new Uint8Array([1, 2, 3]).buffer }) } as unknown as File;
    await expect(validateAidDocumentContents(file)).rejects.toThrow("contents");
  });
});

describe("award values", () => {
  it("accepts a non-negative LRD award", () => { expect(parseAwardAmount("1250.50")).toBe(1250.5); });
  it("allows clearing an award without turning it into zero", () => { expect(parseAwardAmount("")).toBeNull(); });
  it("preserves a zero award", () => { expect(parseAwardAmount("0")).toBe(0); });
  it.each(["-1", "NaN", "Infinity", "1.234"])("rejects invalid award %s", (value) => { expect(() => parseAwardAmount(value)).toThrow(); });
});

describe("private document access", () => {
  it("requires an authorized administrator", () => { expect(() => requireAdmin(false)).toThrow(); expect(() => requireAdmin(true)).not.toThrow(); });
  it("limits links to documents attached to the requested application", () => {
    expect(() => requireApplicationDocument(["incoming/a/proof.pdf"], "incoming/b/proof.pdf")).toThrow();
    expect(() => requireApplicationDocument(["incoming/a/proof.pdf"], "incoming/a/proof.pdf")).not.toThrow();
  });
  it("uses short-lived 60-second signed links", () => { expect(PRIVATE_DOCUMENT_TTL_SECONDS).toBe(60); });
});