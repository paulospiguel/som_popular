import { Metadata } from "@/validators/ia-generate";

type CreateDescriptionProps = {
  prompt: string;
  context: Record<string, any>;
  metadata?: Metadata;
};

const createDescription = ({
  prompt,
  context,
  metadata,
}: CreateDescriptionProps) => {
  const botInstructions =
    metadata?.botInstructions ||
    `Você é um especialista em marketing e comunicação para eventos culturais e esportivos.`;

  const fieldConfig = metadata?.fieldConfig || {
    limit: 800,
    type: "Longo",
  };

  const outputLaguage = metadata?.outputLaguage || "PT-BR";

  const enhancedPrompt = `${botInstructions}
        CONTEXTO DO EVENTO:
        ${Object.entries(context || {})
          .filter(([_, value]) => value && value !== "")
          .map(([key, value]) => `• ${key}: ${value}`)
          .join("\n")}

        OBJETIVO: ${prompt}

        INSTRUÇÕES ESPECÍFICAS:
        - Idioma: ${outputLaguage}
        - Formato: ${fieldConfig?.type.toLowerCase()} (máximo ${fieldConfig?.limit} caracteres)
        - Tom: Profissional, atrativo e envolvente
        - Foco: Destacar os pontos únicos e atrativos do evento
        - Público-alvo: Participantes e espectadores interessados em cultura e esporte

        REQUISITOS:
        - Use linguagem clara e direta
        - Inclua informações relevantes do contexto quando apropriado
        - Crie um texto persuasivo que motive a participação
        - Evite jargões excessivos ou linguagem muito técnica
        - Responda APENAS com o texto final, sem explicações ou formatação adicional`;

  return enhancedPrompt;
};

export default createDescription;
