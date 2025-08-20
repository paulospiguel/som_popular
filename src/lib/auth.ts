import { db } from "@/db";
import * as schema from "@/db/auth-schema";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { sendEmail } from "./mailer/resend";
import ResetPasswordTemplate from "./mailer/templates/reset-password";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema: {
      ...schema,
    },
  }),
  emailAndPassword: {
    enabled: true,
    async sendResetPassword({ user, url }) {
      await sendEmail({
        to: user.email,
        subject: "Redefinição de palavra-passe",
        text: `Para redefinir a tua password, abre: ${url}`,
        react: ResetPasswordTemplate({
          name: user.name || "utilizador",
          resetUrl: url,
        }),
      });
    },
  },
  plugins: [nextCookies()],
  hooks: {},
});
