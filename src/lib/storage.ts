import type { WritingDocument } from "../types/document";

export const STORAGE_KEY = "writeordie_documents";

function readAll(): WritingDocument[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function writeAll(docs: WritingDocument[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
}

export function getDocuments(): WritingDocument[] {
  return readAll();
}

export function getDocument(id: string): WritingDocument | null {
  return readAll().find((doc) => doc.id === id) ?? null;
}

export function saveDocument(doc: WritingDocument): void {
  const docs = readAll();
  const index = docs.findIndex((d) => d.id === doc.id);
  if (index >= 0) {
    docs[index] = doc;
  } else {
    docs.push(doc);
  }
  writeAll(docs);
}

export function deleteDocument(id: string): void {
  const docs = readAll().filter((doc) => doc.id !== id);
  writeAll(docs);
}