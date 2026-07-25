import { GoogleGenAI } from "@google/genai";

let ai: GoogleGenAI | null = null;

export function getGemini() {
  if (!ai) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) throw new Error("GEMINI_API_KEY must be set");
    ai = new GoogleGenAI({ apiKey: key });
  }
  return ai;
}
