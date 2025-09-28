import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { Event, NewEvent } from "@/infra/database/schema";
import { invalidateEventQueries } from "@/lib/query-client";
import {
  cancelEvent,
  completeEvent,
  copyEvent,
  createEvent,
  deleteEvent,
  getEvents,
  publishEvent,
  revertToDraft,
  startEvent,
  updateEvent,
} from "@/server/events/index.actions";

// Query Keys
export const eventKeys = {
  all: ["events"] as const,
  lists: () => [...eventKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...eventKeys.lists(), filters] as const,
  details: () => [...eventKeys.all, "detail"] as const,
  detail: (id: string) => [...eventKeys.details(), id] as const,
};

// Hook para buscar todos os eventos
export function useEvents(filters?: {
  status?: string;
  category?: string;
  type?: string;
  search?: string;
}) {
  return useQuery({
    queryKey: eventKeys.list(filters || {}),
    queryFn: () => getEvents(filters),
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
}

// Hook para buscar um evento específico
export function useEvent(eventId: string) {
  return useQuery({
    queryKey: eventKeys.detail(eventId),
    queryFn: () =>
      getEvents({ id: eventId }).then((result) =>
        result.success && result.data ? result.data[0] : null
      ),
    enabled: !!eventId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

// Hook para criar evento
export function useCreateEvent() {
  return useMutation({
    mutationFn: (data: NewEvent) => createEvent(data),
    onSuccess: () => {
      invalidateEventQueries();
    },
  });
}

// Hook para atualizar evento
export function useUpdateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Event> }) =>
      updateEvent(id, data),
    onSuccess: (result, { id }) => {
      invalidateEventQueries();
      // Atualizar cache específico do evento
      if (result.success && result.data) {
        queryClient.setQueryData(eventKeys.detail(id), result.data);
      }
    },
  });
}

// Hook para deletar evento
export function useDeleteEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteEvent(id),
    onSuccess: (_, id) => {
      invalidateEventQueries();
      // Remover do cache
      queryClient.removeQueries({ queryKey: eventKeys.detail(id) });
    },
  });
}

// Hook para publicar evento
export function usePublishEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => publishEvent(id, "admin"),
    onSuccess: (result, id) => {
      invalidateEventQueries();
      if (result.success && result.data) {
        queryClient.setQueryData(eventKeys.detail(id), result.data);
      }
    },
  });
}

// Hook para iniciar evento
export function useStartEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => startEvent(id, "admin"),
    onSuccess: (result, id) => {
      invalidateEventQueries();
      if (result.success && result.data) {
        queryClient.setQueryData(eventKeys.detail(id), result.data);
      }
    },
  });
}

// Hook para concluir evento
export function useCompleteEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => completeEvent(id, "admin"),
    onSuccess: (result, id) => {
      invalidateEventQueries();
      if (result.success && result.data) {
        queryClient.setQueryData(eventKeys.detail(id), result.data);
      }
    },
  });
}

// Hook para cancelar evento
export function useCancelEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      cancelEvent(id, "admin", reason),
    onSuccess: (result, { id }) => {
      invalidateEventQueries();
      if (result.success && result.data) {
        queryClient.setQueryData(eventKeys.detail(id), result.data);
      }
    },
  });
}

// Hook para reverter para rascunho
export function useRevertToDraft() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => revertToDraft(id, "admin"),
    onSuccess: (result, id) => {
      invalidateEventQueries();
      if (result.success && result.data) {
        queryClient.setQueryData(eventKeys.detail(id), result.data);
      }
    },
  });
}

// Hook para copiar evento
export function useCopyEvent() {
  return useMutation({
    mutationFn: (id: string) => copyEvent(id),
    onSuccess: () => {
      invalidateEventQueries();
    },
  });
}
