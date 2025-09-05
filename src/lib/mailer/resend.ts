import { render } from "@react-email/components";
import { Resend } from "resend";

import { ResetPasswordTemplate } from "./templates/reset-password";

const resend = new Resend(process.env.RESEND_API_KEY);

type SendArgs = {
  to: string | string[];
  subject: string;
  text: string;
  react?: React.ReactElement | null;
  html?: string;
};

export async function sendEmail({
  to,
  subject,
  text,
  react,
  html = "",
}: SendArgs) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY não configurado");
  }
  const from = process.env.RESEND_FROM_EMAIL || "no-reply@your-domain.com";

  // Renderizar componente React para HTML se fornecido
  const htmlContent = react ? await render(react) : html;

  return await resend.emails.send({
    from,
    to,
    subject,
    text,
    html: htmlContent,
  });
}

type ResetPasswordEmailArgs = {
  to: string;
  name: string;
  resetUrl: string;
};

export async function sendResetPasswordEmail({
  to,
  name,
  resetUrl,
}: ResetPasswordEmailArgs) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY não configurado");
  }

  const from = process.env.RESEND_FROM_EMAIL || "no-reply@your-domain.com";

  // Renderizar o template React para HTML
  const html = await render(ResetPasswordTemplate({ name, resetUrl }));

  return await resend.emails.send({
    from,
    to,
    subject: "Redefinir Senha - Festival Som Popular",
    html,
  });
}
