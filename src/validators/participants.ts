"use client";

import { z } from "zod";

import {
  experienceLevelEnum,
  participantCategoryEnum,
} from "@/infra/database/enums";

export const participantFormSchema = z
  .object({
    name: z
      .string()
      .min(1, "Nome é obrigatório")
      .min(2, "Nome deve ter pelo menos 2 caracteres")
      .max(100, "Nome não pode exceder 100 caracteres")
      .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Nome deve conter apenas letras e espaços"),
    stageName: z
      .string()
      .optional()
      .or(z.literal(""))
      .refine(
        (val) => !val || (typeof val === "string" && val.trim().length >= 2),
        "Nome artístico deve ter pelo menos 2 caracteres"
      )
      .refine(
        (val) => !val || val.length <= 100,
        "Nome artístico não pode exceder 100 caracteres"
      ),
    email: z
      .string()
      .min(1, "Email é obrigatório")
      .email("Email inválido")
      .toLowerCase(),
    phone: z
      .string()
      .optional()
      .or(z.literal(""))
      .refine(
        (val) => !val || /^\+?[1-9]\d{1,14}$/.test(val.replace(/\s/g, "")),
        "Formato de telefone inválido"
      ),
    photoImageId: z
      .string()
      .optional()
      .or(z.literal(""))
      .refine((val) => {
        if (!val) return true;
        const isValidUrl = /^https?:\/\/.+\.(jpg|jpeg|png|webp)$/i.test(val);
        const isBase64 = /^data:image\/(jpeg|jpg|png|webp);base64,/.test(val);
        const isLocalPath =
          /^\/uploaded\/participants\/.+\.(jpg|jpeg|png|webp)$/i.test(val);
        return isValidUrl || isBase64 || isLocalPath;
      }, "Foto para ranking deve ser uma imagem válida (JPG, PNG ou WebP)"),
    category: z.string().optional().or(z.literal("")),
    experience: z.string().optional().or(z.literal("")),
    age: z
      .number()
      .int()
      .min(1, "Idade inválida")
      .max(120, "Idade inválida")
      .optional(),
    additionalInfo: z
      .string()
      .optional()
      .or(z.literal(""))
      .refine(
        (val) => !val || val.length <= 500,
        "Informações adicionais não podem exceder 500 caracteres"
      ),
    hasSpecialNeeds: z.boolean().default(false),
    specialNeedsDescription: z
      .string()
      .optional()
      .or(z.literal(""))
      .refine(
        (val) => !val || val.length <= 300,
        "Descrição das necessidades especiais não pode exceder 300 caracteres"
      ),
    acceptsEmailNotifications: z.boolean().default(true),
    eventId: z.string().min(1, "Selecione um evento para inscrição"),
  })
  .refine(
    (data) => {
      if (
        data.hasSpecialNeeds &&
        (!data.specialNeedsDescription ||
          data.specialNeedsDescription.trim() === "")
      ) {
        return false;
      }
      return true;
    },
    {
      message: "Por favor, especifica qual a necessidade especial",
      path: ["specialNeedsDescription"],
    }
  );

export type ParticipantFormData = z.infer<typeof participantFormSchema>;

export const participantRegistrationSchema = z
  .object({
    name: z
      .string()
      .min(1, "Nome é obrigatório")
      .min(2, "Nome deve ter pelo menos 2 caracteres")
      .max(100, "Nome deve ter no máximo 100 caracteres"),
    stageName: z
      .string()
      .max(100, "Nome artístico deve ter no máximo 100 caracteres")
      .optional(),
    email: z.email("Email inválido"),
    phone: z
      .string()
      .max(20, "Telefone deve ter no máximo 20 caracteres")
      .optional(),
    category: z.enum(participantCategoryEnum.enumValues).optional(),
    experience: z.enum(experienceLevelEnum.enumValues).optional(),
    additionalInfo: z
      .string()
      .max(500, "Informações adicionais devem ter no máximo 500 caracteres")
      .optional(),
    hasSpecialNeeds: z.boolean().default(false),
    specialNeedsDescription: z
      .string()
      .max(
        300,
        "Descrição das necessidades especiais deve ter no máximo 300 caracteres"
      )
      .optional(),
    acceptsEmailNotifications: z.boolean().default(true),
    acceptsTerms: z
      .boolean()
      .refine(
        (val) => val === true,
        "Você deve aceitar o regulamento e os termos de participação"
      ),
    eventId: z.string().min(1, "Selecione um evento para inscrição"),
    photoImageId: z
      .string()
      .max(500, "URL da foto deve ter no máximo 500 caracteres")
      .optional(),
  })
  .refine(
    (data) => {
      if (
        data.hasSpecialNeeds &&
        (!data.specialNeedsDescription ||
          data.specialNeedsDescription.trim() === "")
      ) {
        return false;
      }
      return true;
    },
    {
      message: "Descreva as necessidades especiais",
      path: ["specialNeedsDescription"],
    }
  );

export type ParticipantRegistrationFormData = z.infer<
  typeof participantRegistrationSchema
>;
