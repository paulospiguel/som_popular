import { createId } from "@paralleldrive/cuid2";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import * as schema from "./db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema: {
      user: schema.users,
      session: schema.sessions,
      account: schema.accounts,
      verificationToken: schema.verificationTokens,
    },
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    minPasswordLength: 6,
    maxPasswordLength: 128,
    // Função para enviar email de reset de senha
    sendResetPassword: async ({ user, url, token }) => {
      console.log(`🔑 Reset password para ${user.email}`);
      console.log(`📧 URL: ${url}`);
      console.log(`🎫 Token: ${token}`);
    },
    resetPasswordTokenExpiresIn: 3600,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 dias
    updateAge: 60 * 60 * 24, // 1 dia
  },
  advanced: {
    generateId: () => createId(),
  },
  // Adicionar configuração de campos personalizados
  user: {
    additionalFields: {
      hashedPassword: {
        type: "string",
        required: false,
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
export type User = (typeof auth.$Infer.Session)["user"];
