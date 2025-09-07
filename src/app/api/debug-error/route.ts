export const dynamic = "force-dynamic";

export async function GET() {
  // Simula um erro de produção no servidor
  // Ao acessar /api/debug-error em produção, Sentry deve registrar esse erro.
  try {
    throw new Error("Debug error (server)");
  } catch (err) {
    // Re-lança para deixar o SDK de Sentry capturar via unhandled exception
    throw err;
  }
}
