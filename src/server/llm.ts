"use server";

import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { generateText } from "ai";
import z from "zod";

import { generateContentSchema } from "@/validators/ia-generate";

let openAIClient: ReturnType<typeof createOpenRouter> | null = null;

function resolveOpenAIClient() {
  if (openAIClient) {
    return openAIClient;
  }

  const apiKey =
    process.env.OPENROUTER_API_KEY ??
    process.env.NEXT_PUBLIC_OPENROUTER_API_TOKEN;

  if (!apiKey) {
    throw new Error(
      "Missing API key for the AI provider. Set OPENAI_API_KEY or OPENROUTER_API_KEY."
    );
  }

  const baseURL =
    process.env.OPENROUTER_BASE_URL ??
    process.env.NEXT_PUBLIC_OPENROUTER_BASE_URL;

  const config: {
    apiKey: string;
    baseURL?: string;
  } = { apiKey };

  if (baseURL) {
    config.baseURL = baseURL;
  }

  openAIClient = createOpenRouter(config);

  return openAIClient;
}

const resolvedModelId =
  process.env.LLM_MODEL_ID ??
  process.env.OPENROUTER_MODEL_ID ??
  process.env.NEXT_PUBLIC_OPENROUTER_MODEL_ID ??
  "openai/gpt-oss-120b:free";

type GenerateSchema = z.infer<typeof generateContentSchema>;

export async function generateWithLLM({ prompt, context }: GenerateSchema) {
  const trimmedPrompt = prompt.trim();

  const contextString = Object.entries(context)
    .map(([key, value]) => {
      const formattedValue = Array.isArray(value) ? value.join(", ") : value;
      return `${key}: ${formattedValue}`;
    })
    .join("\n");

  const openrouter = resolveOpenAIClient();

  const { text } = await generateText({
    model: openrouter.chat(resolvedModelId),
    system: contextString || "",
    prompt: trimmedPrompt,
    headers: {
      "HTTP-Referer": "https://som-popular.com.br",
      "X-Title": "Som Popular - Plataforma de Gestão de Eventos",
    },
    // temperature: 0.7,
    // topP: 1,
    // frequencyPenalty: 0,
    // presencePenalty: 0,
  });

  return text;
}
