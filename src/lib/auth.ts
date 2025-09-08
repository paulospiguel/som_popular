import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { admin as adminPlugin } from "better-auth/plugins";

import { ROLES } from "@/constants";
import { db } from "@/server/database";
import * as schema from "@/server/database/auth-schema";

import { sendEmail } from "./mailer/resend";
import ResetPasswordTemplate from "./mailer/templates/reset-password";
import { ac, admin, operator, master } from "./permissions";

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
        subject: "Redefinição de senha",
        text: `Para redefinir a tua senha, abre: ${url}`,
        react: ResetPasswordTemplate({
          name: user.name || "utilizador",
          resetUrl: url,
        }),
      });
    },
  },
  plugins: [nextCookies(), adminPlugin({ ac, roles: { admin, operator, master } })],
  hooks: {},
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: ROLES.OPERATOR,
        input: false,
      },
      isActive: {
        type: "boolean",
        required: false,
        defaultValue: true,
        input: false,
      },
    },
  },
});
