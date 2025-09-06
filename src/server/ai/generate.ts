"use server";

import z from "zod";

import { generateContentSchema, generateWithLLM } from "@/server/llm";

export type GenerateContentSchema = z.infer<typeof generateContentSchema>;

export async function generateContent(inputs: GenerateContentSchema) {
  const { prompt, context } = inputs;

  const result = await generateWithLLM({ prompt, context });

  return result;
}
