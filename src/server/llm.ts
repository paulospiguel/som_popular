import { OpenAI } from "openai";
import z from "zod";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENROUTER_API_TOKEN,
  baseURL: "https://openrouter.ai/api/v1/",
});

export const generateContentSchema = z.object({
  prompt: z.string(),
  context: z.record(z.string(), z.string().or(z.array(z.string()))),
});

// Serviço genérico de LLM (placeholder). Integre com OpenRouter/OpenAI aqui.
export async function generateWithLLM({
  prompt,
  context,
}: z.infer<typeof generateContentSchema>) {
  // Exemplo de prompt simples
  prompt = prompt.trim();

  const contextString = Object.entries(context)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");

  const response = await openai.chat.completions.create({
    model: "openai/gpt-oss-20b:free",
    metadata: {
      "HTTP-Referer": "https://som-popular.com.br",
      "X-Title": "Som Popular - Plataforma de Gestão de Eventos",
    },
    messages: [
      {
        role: "user",
        content: prompt,
      },
      {
        role: "system",
        content: contextString,
      },
    ],
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    n: 1,
  });

  const script =
    response.choices[0]?.message?.content!.trim() || "No script generated";

  return script;
}
