import { useMutation } from "@tanstack/react-query";

import { generateContent } from "@/server/ai/generate";

const useAIGenerate = () => {
  return useMutation({
    mutationFn: (data: any) => generateContent(data),
  });
};

export { useAIGenerate };
