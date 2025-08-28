import { z } from "zod";

export const participantSchema = z
  .object({
    name: z
      .string()
      .min(1, "Nome é obrigatório")
      .min(2, "Nome deve ter pelo menos 2 caracteres")
      .max(100, "Nome não pode exceder 100 caracteres")
      .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Nome deve conter apenas letras e espaços"),

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

    avatar: z
      .string()
      .optional()
      .or(z.literal(""))
      .refine((val) => {
        if (!val) return true;
        const isValidUrl = /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(
          val
        );
        const isBase64 = /^data:image\/(jpeg|jpg|png|gif|webp);base64,/.test(
          val
        );
        return isValidUrl || isBase64;
      }, "Avatar deve ser uma URL válida ou imagem em base64"),

    category: z.string().min(1, "Seleciona uma categoria"),

    experience: z.string().min(1, "Seleciona um nível de experiência"),

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
      path: ["specialNeedsDescription"], // Mostra o erro no campo correto
    }
  );

export type ParticipantFormData = z.infer<typeof participantSchema>;
