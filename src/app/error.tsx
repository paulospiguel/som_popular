"use client";

import * as Sentry from "@sentry/nextjs";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function Error({
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
    <div className="min-h-screen bg-gradient-to-br from-bege-claro via-verde-muito-suave to-dourado-muito-claro flex items-center justify-center p-6">
      <div className="festival-card p-8 max-w-xl w-full text-center">
        <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-vermelho-suave/10 flex items-center justify-center border border-vermelho-suave/20">
          <AlertTriangle className="w-10 h-10 text-vermelho-suave" />
        </div>

        <h1 className="text-3xl font-bold text-cinza-chumbo mb-4">
          Ops! Algo deu errado
        </h1>

        <p className="text-cinza-chumbo/70 mb-2">
          Encontramos um problema inesperado. Nossa equipe foi notificada e está
          trabalhando para resolver.
        </p>

        {error?.message && (
          <div className="bg-vermelho-muito-suave/30 border border-vermelho-suave/20 rounded-lg p-4 mb-6">
            <p className="text-sm text-vermelho-suave font-medium">
              Detalhes: {error.message}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={() => reset()} className="festival-button">
            <RefreshCw className="w-4 h-4 mr-2" />
            Tentar Novamente
          </Button>

          <Link href="/">
            <Button variant="outline" className="gap-2">
              <Home className="w-4 h-4" />
              Voltar para a Home
            </Button>
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-verde-suave/10">
          <p className="text-xs text-cinza-chumbo/50">
            Se o problema persistir, entre em contato conosco através do nosso
            suporte.
          </p>
        </div>
      </div>
    </div>
  );
}
