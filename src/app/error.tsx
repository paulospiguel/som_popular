"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Sentry SDK will capture this automatically, but we send explicitly as well.
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body className="p-6">
        <h2>Algo deu errado</h2>
        <p style={{ marginTop: 8 }}>{error?.message || "Erro inesperado"}</p>
        <button style={{ marginTop: 16 }} onClick={() => reset()}>
          Tentar novamente
        </button>
      </body>
    </html>
  );
}
