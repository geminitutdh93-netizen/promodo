import { GoogleGenAI } from "@google/genai";
import { Tree, Tag } from "../types";

let aiClient: GoogleGenAI | null = null;

export const initializeGemini = () => {
  if (!process.env.API_KEY) {
    console.warn("Gemini API Key not found.");
    return;
  }
  aiClient = new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateTreeStory = async (tree: Tree, tag: Tag): Promise<string> => {
  if (!aiClient) {
    initializeGemini();
    if (!aiClient) return "A tree grown in silence.";
  }

  try {
    const prompt = `
      I just finished a ${tree.durationMinutes}-minute focus session tagged as "${tag.name}".
      I successfully grew a virtual ${tree.type} tree.
      Write a very short (max 20 words), poetic, and whimsical description of this specific tree reflecting the effort.
      Do not use quotes.
    `;

    const response = await aiClient!.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error("Failed to generate tree story:", error);
    return `A strong ${tree.type} representing your dedication to ${tag.name}.`;
  }
};