import { QueryClient } from "@tanstack/react-query";

import { judgeKeys } from "@/hooks/use-judges";

// Configuração do QueryClient
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Tempo de cache padrão: 5 minutos
      staleTime: 5 * 60 * 1000,
      // Tempo de garbage collection: 10 minutos
      gcTime: 10 * 60 * 1000,
      // Retry automático em caso de erro
      retry: (failureCount, error) => {
        // Não tentar novamente para erros 4xx (client errors)
        if (error instanceof Error && "status" in error) {
          const status = (error as any).status;
          if (status >= 400 && status < 500) {
            return false;
          }
        }
        // Tentar até 3 vezes para outros erros
        return failureCount < 3;
      },
      // Refetch quando a janela ganha foco
      refetchOnWindowFocus: false,
      // Refetch quando reconecta à internet
      refetchOnReconnect: true,
    },
    mutations: {
      // Retry para mutations
      retry: 1,
    },
  },
});

// Função para invalidar queries relacionadas a eventos
export const invalidateEventQueries = () => {
  queryClient.invalidateQueries({ queryKey: ["events"] });
};

// Função para invalidar queries relacionadas a participantes
export const invalidateParticipantQueries = () => {
  queryClient.invalidateQueries({ queryKey: ["participants"] });
};

// Função para invalidar queries relacionadas a jurados
export const invalidateJudgeQueries = () => {
  queryClient.invalidateQueries({ queryKey: judgeKeys.list({}) });
};

// Função para invalidar queries relacionadas a uploads
export const invalidateUploadQueries = () => {
  console.log("invalidateUploadQueries - Called");
  console.log("invalidateUploadQueries - Stack trace:", new Error().stack);
  queryClient.invalidateQueries({ queryKey: ["uploads"] });
};
