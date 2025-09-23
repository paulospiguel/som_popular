import { z } from "zod";

import { APPROVAL_MODES, EVENT_CATEGORIES, EVENT_TYPES } from "@/constants";

const eventTypeValues = EVENT_TYPES.map((type) => type.value) as [
  string,
  ...string[],
];
const eventCategoryValues = EVENT_CATEGORIES.map(
  (category) => category.value
) as [string, ...string[]];
const approvalModeValues = APPROVAL_MODES.map((mode) => mode.value) as [
  string,
  ...string[],
];

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
  rulesText: z
    .string()
    .optional()
    .or(z.literal(""))
    .or(z.null())
    .or(z.undefined()),
  rulesFileId: z
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

export type EventFormData = z.infer<typeof eventFormSchema>;

export const eventCreationSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  description: z.string().optional(),
  type: z.enum(eventTypeValues),
  category: z.enum(eventCategoryValues),
  location: z.string().min(3, "Local é obrigatório"),
  maxParticipants: z.number().min(1).optional(),
  startDate: z.date(),
  endDate: z.date().optional(),
  registrationStartDate: z.date().optional(),
  registrationEndDate: z.date().optional(),
  customRegistrationWindow: z.boolean().default(false),
  isPublic: z.boolean(),
  requiresApproval: z.boolean(),
  approvalMode: z.enum(approvalModeValues),
  rulesText: z.string().optional(),
  rulesFileId: z.any().optional(),
  prizes: z
    .string()
    .optional()
    .refine((val) => {
      if (!val) return true;
      const prizes = val.split(",").filter(Boolean);
      return prizes.length <= 5;
    }, "Máximo de 5 prémios permitidos"),
  notes: z.string().optional(),
});

export type EventCreationFormData = z.infer<typeof eventCreationSchema>;
