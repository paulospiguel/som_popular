import { z } from "zod";

export const metadataSchema = z.object({
  outputLaguage: z.enum(["PT-BR", "EN-US"]),
  fieldConfig: z.object({
    limit: z.number(),
    type: z.enum(["Curto", "Longo"]),
  }),
  botInstructions: z.string().optional(),
});

export const generateContentSchema = z.object({
  prompt: z.string(),
  context: z.record(z.string(), z.string().or(z.array(z.string()))),
  metadata: metadataSchema.optional(),
});

export type Metadata = z.infer<typeof metadataSchema>;
export type GenerateContentSchema = z.infer<typeof generateContentSchema>;
