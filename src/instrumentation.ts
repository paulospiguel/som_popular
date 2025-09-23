import * as Sentry from "@sentry/nextjs";

export async function register() {
  // Só carregar Sentry em produção
  if (process.env.NODE_ENV === "production") {
    if (process.env.NEXT_RUNTIME === "nodejs") {
      await import("../sentry.server.config");
    }

    if (process.env.NEXT_RUNTIME === "edge") {
      await import("../sentry.edge.config");
    }
  }

  // Sempre inicializar configurações padrão do sistema
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { initDefaultSettings } = await import("./server/init-settings");
    await initDefaultSettings();
  }
}

// Só exportar onRequestError se estivermos em produção
export const onRequestError =
  process.env.NODE_ENV === "production"
    ? Sentry.captureRequestError
    : undefined;
