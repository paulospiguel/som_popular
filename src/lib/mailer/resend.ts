import { Resend } from "resend";

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

  return await resend.emails.send({
    from,
    to,
    subject,
    text,
    react,
    html,
  });
}
