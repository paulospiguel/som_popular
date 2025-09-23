"use client";

import { z } from "zod";

export const judgeFormSchema = z.object({
  name: z
    .string()
    .min(1, "Nome é obrigatório")
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome não pode exceder 100 caracteres")
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Nome deve conter apenas letras e espaços"),
  description: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine(
      (val) => !val || val.length <= 500,
      "Descrição não pode exceder 500 caracteres"
    ),
  notes: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine(
      (val) => !val || val.length <= 1000,
      "Notas não podem exceder 1000 caracteres"
    ),
  isActive: z.boolean(),
  photoImageId: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine((val) => {
      if (!val) return true;
      const isValidUrl = /^https?:\/\/.+\.(jpg|jpeg|png|webp)$/i.test(val);
      const isBase64 = /^data:image\/(jpeg|jpg|png|webp);base64,/.test(val);
      const isLocalPath = /^\/uploaded\/judges\/.+\.(jpg|jpeg|png|webp)$/i.test(
        val
      );
      return isValidUrl || isBase64 || isLocalPath;
    }, "Foto deve ser uma imagem válida (JPG, PNG ou WebP)"),
});

export type JudgeFormData = z.infer<typeof judgeFormSchema>;

export const judgeEventAssignmentSchema = z.object({
  eventId: z.string().min(1, "Selecione um evento"),
  judgeIds: z
    .array(z.string())
    .min(1, "Selecione pelo menos um jurado")
    .max(10, "Máximo de 10 jurados por evento"),
});

export type JudgeEventAssignmentData = z.infer<
  typeof judgeEventAssignmentSchema
>;
