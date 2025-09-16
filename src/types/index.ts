import { createSelectSchema } from "drizzle-zod";
import z from "zod";

import { events, participants } from "@/infra/database/schema";

export const eventSchema = createSelectSchema(events);
export const participantSchema = createSelectSchema(participants);

// Schema específico para formulário de eventos (sem campos obrigatórios do banco)
export const eventFormSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").trim(),
  subtitle: z.string().optional().or(z.literal("")).or(z.null()),
  description: z.string().optional().or(z.literal("")).or(z.null()),
  type: z.string().min(1, "Tipo é obrigatório").trim(),
  category: z.string().min(1, "Categoria é obrigatória").trim(),
  location: z.string().min(1, "Local é obrigatório").trim(),
  maxParticipants: z.number().min(0).optional().or(z.null()).or(z.undefined()),
  startDate: z.date({ message: "Data de início é obrigatória" }),
  endDate: z.date().optional().or(z.null()).or(z.undefined()),
  registrationStartDate: z.date().optional().or(z.null()).or(z.undefined()),
  registrationEndDate: z.date().optional().or(z.null()).or(z.undefined()),
  status: z.string().optional().or(z.undefined()),
  isPublic: z.boolean().optional().or(z.undefined()),
  requiresApproval: z.boolean().optional().or(z.undefined()),
  rules: z.string().optional().or(z.literal("")).or(z.null()).or(z.undefined()),
  rulesFile: z
    .string()
    .optional()
    .or(z.literal(""))
    .or(z.null())
    .or(z.undefined()),
  prizes: z
    .string()
    .optional()
    .or(z.literal(""))
    .or(z.null())
    .or(z.undefined()),
  notes: z.string().optional().or(z.literal("")).or(z.null()).or(z.undefined()),
  customRegistrationWindow: z.boolean().optional().or(z.undefined()),
  approvalMode: z.string().optional().or(z.undefined()),
});

export type ParticipantFormData = z.infer<typeof participantSchema>;
export type Participant = z.infer<typeof participantSchema>;

export type Event = z.infer<typeof eventSchema>;
export type EventFormData = z.infer<typeof eventFormSchema>;
