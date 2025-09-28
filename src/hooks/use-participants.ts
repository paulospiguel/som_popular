import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { experienceLevelEnum } from "@/infra/database/enums";
import type {
  NewParticipant,
  Participant,
  participantCategoryEnum,
  participantStatusEnum,
} from "@/infra/database/schema";
import { invalidateParticipantQueries } from "@/lib/query-client";
import {
  approveParticipant,
  checkEmailExists,
  createParticipant,
  createParticipantWithTermsEmail,
  deleteParticipant,
  getAllParticipants,
  getApprovedParticipants,
  getEventParticipants,
  getParticipantDetails,
  registerParticipantInEvent,
  rejectParticipant,
  removeParticipantFromEvent,
  updateParticipant,
} from "@/server/participants.actions";

// Query Keys
export const participantKeys = {
  all: ["participants"] as const,
  lists: () => [...participantKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...participantKeys.lists(), filters] as const,
  details: () => [...participantKeys.all, "detail"] as const,
  detail: (id: string) => [...participantKeys.details(), id] as const,
  eventParticipants: (eventId: string) =>
    [...participantKeys.all, "event", eventId] as const,
  approved: () => [...participantKeys.all, "approved"] as const,
};

// Hook para buscar todos os participantes
export function useParticipants(filters?: {
  status?: (typeof participantStatusEnum.enumValues)[number];
  category?: (typeof participantCategoryEnum.enumValues)[number];
  experience?: (typeof experienceLevelEnum.enumValues)[number];
  eventId?: string;
  search?: string | undefined;
}) {
  return useQuery({
    queryKey: participantKeys.list(filters || {}),
    queryFn: () => getAllParticipants(filters),
    //staleTime: 2 * 60 * 1000, // 2 minutos
  });
}

// Hook para buscar participantes aprovados
export function useApprovedParticipants() {
  return useQuery({
    queryKey: participantKeys.approved(),
    queryFn: () => getApprovedParticipants(),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

// Hook para buscar participantes de um evento
export function useEventParticipants(eventId: string) {
  return useQuery({
    queryKey: participantKeys.eventParticipants(eventId),
    queryFn: () => getEventParticipants(eventId),
    enabled: !!eventId,
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
}

// Hook para buscar um participante específico
export function useParticipant(participantId: string) {
  return useQuery({
    queryKey: participantKeys.detail(participantId),
    queryFn: () =>
      getParticipantDetails(participantId).then((result) =>
        result.success && result.data ? result.data : null
      ),
    enabled: !!participantId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

// Hook para criar participante
export function useCreateParticipant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: NewParticipant) => createParticipant(data),
    onSuccess: () => {
      invalidateParticipantQueries();
      queryClient.invalidateQueries({ queryKey: participantKeys.list({}) });
    },
  });
}

// Hook para criar participante com envio de email de termos
export function useCreateParticipantWithTermsEmail() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: NewParticipant) => createParticipantWithTermsEmail(data),
    onSuccess: () => {
      invalidateParticipantQueries();
      queryClient.invalidateQueries({ queryKey: participantKeys.list({}) });
    },
  });
}

// Hook para atualizar participante
export function useUpdateParticipant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Participant }) =>
      updateParticipant(id, data),
    onSuccess: (result, { id }) => {
      invalidateParticipantQueries();
      if (result.success && result.data) {
        queryClient.setQueryData(participantKeys.detail(id), result.data);
      }
    },
  });
}

// Hook para deletar participante
export function useDeleteParticipant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteParticipant(id),
    onSuccess: (_, id) => {
      invalidateParticipantQueries();
      queryClient.removeQueries({ queryKey: participantKeys.detail(id) });
    },
  });
}

// Hook para aprovar participante
export function useApproveParticipant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => approveParticipant(id),
    onSuccess: (result, id) => {
      invalidateParticipantQueries();
      if (result.success && result.data) {
        queryClient.setQueryData(participantKeys.detail(id), result.data);
      }
    },
  });
}

// Hook para rejeitar participante
export function useRejectParticipant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      rejectParticipant(id, reason),
    onSuccess: (result, { id }) => {
      invalidateParticipantQueries();
      if (result.success && result.data) {
        queryClient.setQueryData(participantKeys.detail(id), result.data);
      }
    },
  });
}

// Hook para registrar participante em evento
export function useRegisterParticipantInEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      eventId,
      participantId,
    }: {
      eventId: string;
      participantId: string;
    }) => registerParticipantInEvent(eventId, participantId),
    onSuccess: (_, { eventId }) => {
      invalidateParticipantQueries();
      // Invalidar também as queries de eventos
      queryClient.invalidateQueries({ queryKey: ["events"] });
      // Invalidar participantes do evento específico
      queryClient.invalidateQueries({
        queryKey: participantKeys.eventParticipants(eventId),
      });
    },
  });
}

// Hook para remover participante de evento
export function useRemoveParticipantFromEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      eventId,
      participantId,
    }: {
      eventId: string;
      participantId: string;
    }) => {
      console.log("Hook: Iniciando remoção de participante", {
        eventId,
        participantId,
      });
      const result = await removeParticipantFromEvent(eventId, participantId);
      console.log("Hook: Resultado da remoção", result);
      return result;
    },
    onSuccess: (_, { eventId }) => {
      console.log("Hook: Remoção bem-sucedida, invalidando queries");
      invalidateParticipantQueries();
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({
        queryKey: participantKeys.eventParticipants(eventId),
      });
    },
    onError: (error) => {
      console.error("Hook: Erro na remoção de participante", error);
    },
  });
}

// Hook para verificar se email já existe
export function useCheckEmailExists() {
  return useMutation({
    mutationFn: checkEmailExists,
  });
}
