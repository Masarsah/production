import fs from 'fs/promises';
import pdf from "pdf-parse";
import path from "path";

import dotenv from "dotenv";
dotenv.config();

const PDF_DIR = process.env.PDF_DIR || path.join(process.cwd(), "pdfs");

export class PDFService {
  constructor(pdfDirectory = PDF_DIR) {
    this.pdfDirectory = pdfDirectory;
  }

  async _extractText(filePath) {
    const data = await fs.readFile(filePath);
    const parsed = await pdf(data);
    return parsed.text || "";
  }

  // returns array of { file, snippet } where snippet contains the matched text
  async searchInPDFs(query) {
    const q = (query || "").toLowerCase().trim();
    if (!q) return [];

    const files = await fs.readdir(this.pdfDirectory).catch(() => []);
    const pdfFiles = files.filter((f) => f.toLowerCase().endsWith(".pdf"));
    const results = [];

    for (const file of pdfFiles) {
      const filePath = path.join(this.pdfDirectory, file);
      try {
        const text = await this._extractText(filePath);
        const low = text.toLowerCase();
        if (low.includes(q)) {
          // return a small snippet (e.g., 300 chars around first match)
          const idx = low.indexOf(q);
          const start = Math.max(0, idx - 150);
          const snippet = text.slice(start, Math.min(text.length, idx + q.length + 150));
          results.push({ file, snippet: snippet.replace(/\s+/g, " ").trim() });
        }
      } catch (err) {
        console.warn("Failed to read PDF:", filePath, err.message);
      }
    }

    return results;
  }
}
