export function getBaseUrl() {
  // Client: usa a origem atual
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  // Vercel define VERCEL_URL (sem protocolo) no server
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // Server: usa variáveis de ambiente
  // Preferir NEXT_PUBLIC_APP_URL (ou APP_URL) quando fornecido manualmente
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL;
  if (siteUrl) {
    return siteUrl.startsWith("http") ? siteUrl : `https://${siteUrl}`;
  }

  // Dev: usar porta do processo (fallback 3000)
  const port = process.env.PORT || "3000";
  return `http://localhost:${port}`;
}

export function getPublicUrl() {
  const base = getBaseUrl();
  // Mantém http em localhost; força https em domínios públicos
  return base.includes("localhost")
    ? base
    : base.replace("http://", "https://");
}

export function getBaseUri() {
  return getBaseUrl().replace(/^https?:\/\//, "");
}
