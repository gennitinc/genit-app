import { getDocumentPreviewUrl } from "./document-preview.ts";
import assert from "node:assert/strict";
import test from "node:test";

test("previews PDFs from the original file", () => {
  assert.equal(
    getDocumentPreviewUrl({
      format: "pdf",
      fileUrl: "https://files.example.com/contract.pdf",
      fallbackUrl: "https://files.example.com/text-only-preview.html",
    }),
    "https://files.example.com/contract.pdf"
  );
});

test("previews Office documents with their original layout", () => {
  assert.equal(
    getDocumentPreviewUrl({
      format: "docx",
      fileUrl: "https://files.example.com/My Contract.docx",
      fallbackUrl: "https://files.example.com/text-only-preview.html",
    }),
    "https://view.officeapps.live.com/op/embed.aspx?src=https%3A%2F%2Ffiles.example.com%2FMy%20Contract.docx"
  );
});

test("keeps the generated fallback when a remote Office viewer cannot access the file", () => {
  assert.equal(
    getDocumentPreviewUrl({
      format: "xlsx",
      fileUrl: "http://localhost:8000/report.xlsx",
      fallbackUrl: "http://localhost:8000/report-preview.html",
    }),
    "http://localhost:8000/report-preview.html"
  );
});
