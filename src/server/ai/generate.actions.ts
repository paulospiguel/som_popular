"use server";

import z from "zod";

import { generateWithLLM } from "@/server/llm.actions";
import { generateContentSchema } from "@/validators/ia-generate";

export type GenerateContentSchema = z.infer<typeof generateContentSchema>;

export async function generateContent(inputs: GenerateContentSchema) {
  const { prompt, context } = inputs;

  const result = await generateWithLLM({ prompt, context });

  return result;
}
