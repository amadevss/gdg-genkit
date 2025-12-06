import { z } from "zod";

// Esquema para la entrada de texto
export const textInputSchema = z.object({
  prompt: z.string(),
  history: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string(),
      mediaUrl: z.string().optional(),
    })
  ),
});

// Esquema para la entrada de imagen
export const imageInputSchema = z.object({
  prompt: z.string(),
  imageBase64: z.string(),
  history: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string(),
      mediaUrl: z.string().optional(),
    })
  ),
});

// Esquema para la entrada de PDF
export const pdfInputSchema = z.object({
  prompt: z.string(),
  pdfContent: z.string(),
  history: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string(),
    })
  ),
});

// Esquema para la entrada de YouTube
export const youtubeInputSchema = z.object({
  videoUrl: z.string().url(),
  prompt: z.string().optional(),
});