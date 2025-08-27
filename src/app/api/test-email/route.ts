import { sendResetPasswordEmail } from "@/lib/mailer/resend";
import { NextResponse } from "next/server";

export async function GET() {
  console.log("🧪 Iniciando teste de email...");

  try {
    console.log("📧 Variáveis de ambiente:");
    console.log(
      "RESEND_API_KEY:",
      process.env.RESEND_API_KEY ? "Definida ✅" : "Não definida ❌"
    );
    console.log(
      "RESEND_FROM_EMAIL:",
      process.env.RESEND_FROM_EMAIL || "Não definida"
    );

    const result = await sendResetPasswordEmail({
      to: "paulospil@hotmail.com",
      name: "Utilizador Teste",
      resetUrl: "http://localhost:3000/auth/reset-password?token=teste123",
    });

    console.log("✅ Resultado do teste:", result);

    return NextResponse.json({
      success: true,
      message: "Email de teste enviado com sucesso!",
      result,
    });
  } catch (error) {
    console.error("❌ Erro no teste de email:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erro desconhecido",
        details: error,
      },
      { status: 500 }
    );
  }
}
