import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { Judge, NewJudge } from "@/infra/database/schema";
import { invalidateJudgeQueries } from "@/lib/query-client";
import {
  addJudgeToEvent,
  createJudge,
  deleteJudge,
  getEventJudges,
  getJudges,
  removeJudgeFromEvent,
  updateJudge,
} from "@/server/judges.actions";

// Query Keys
export const judgeKeys = {
  all: ["judges"] as const,
  lists: () => [...judgeKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...judgeKeys.lists(), filters] as const,
  details: () => [...judgeKeys.all, "detail"] as const,
  detail: (id: string) => [...judgeKeys.details(), id] as const,
  eventJudges: (eventId: string) =>
    [...judgeKeys.all, "event", eventId] as const,
};

// Hook para buscar todos os jurados
export function useJudges(filters?: { isActive?: boolean; search?: string }) {
  return useQuery({
    queryKey: judgeKeys.list(filters || {}),
    queryFn: () => getJudges(filters),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

// Hook para buscar jurados de um evento
export function useEventJudges(eventId: string) {
  return useQuery({
    queryKey: judgeKeys.eventJudges(eventId),
    queryFn: () => getEventJudges(eventId),
    enabled: !!eventId,
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
}

// Hook para buscar um jurado específico
export function useJudge(judgeId: string) {
  return useQuery({
    queryKey: judgeKeys.detail(judgeId),
    queryFn: () =>
      getJudges({ id: judgeId }).then((result) =>
        result.success && result.data ? result.data[0] : null
      ),
    enabled: !!judgeId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

// Hook para criar jurado
export function useCreateJudge() {
  return useMutation({
    mutationFn: (data: NewJudge) => createJudge(data),
    onSuccess: () => {
      invalidateJudgeQueries();
    },
  });
}

// Hook para atualizar jurado
export function useUpdateJudge() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Judge> }) =>
      updateJudge(id, data),
    onSuccess: (result, { id }) => {
      invalidateJudgeQueries();
      if (result.success && result.data) {
        queryClient.setQueryData(judgeKeys.detail(id), result.data);
      }
    },
  });
}

// Hook para deletar jurado
export function useDeleteJudge() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteJudge(id),
    onSuccess: (result, id) => {
      invalidateJudgeQueries();
      queryClient.removeQueries({ queryKey: judgeKeys.detail(id) });
    },
  });
}

// Hook para adicionar jurado a evento
export function useAddJudgeToEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, judgeId }: { eventId: string; judgeId: string }) =>
      addJudgeToEvent(eventId, judgeId),
    onSuccess: (result, { eventId }) => {
      invalidateJudgeQueries();
      // Invalidar também as queries de eventos
      queryClient.invalidateQueries({ queryKey: ["events"] });
      // Invalidar jurados do evento específico
      queryClient.invalidateQueries({
        queryKey: judgeKeys.eventJudges(eventId),
      });
    },
  });
}

// Hook para remover jurado de evento
export function useRemoveJudgeFromEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, judgeId }: { eventId: string; judgeId: string }) =>
      removeJudgeFromEvent(eventId, judgeId),
    onSuccess: (result, { eventId }) => {
      invalidateJudgeQueries();
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({
        queryKey: judgeKeys.eventJudges(eventId),
      });
    },
  });
}
