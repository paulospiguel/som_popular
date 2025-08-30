"use client";

import { requestPasswordReset } from "@/lib/auth-client";
import { logPasswordReset } from "@/server/logs";
import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isUserNotFound, setIsUserNotFound] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    setError("");
    setIsUserNotFound(false);

    try {
      // Log da tentativa inicial
      await logPasswordReset({
        email,
        status: "pending",
        message: "Tentativa de recuperação de senha iniciada",
        metadata: {},
      });

      const result = await requestPasswordReset({
        email,
        redirectTo: "/auth/reset-password",
      });

      if (result.error) {
        const errorMessage = result.error.message || "Erro desconhecido";

        if (
          errorMessage.toLowerCase().includes("user not found") ||
          errorMessage.toLowerCase().includes("usuário não encontrado")
        ) {
          setIsUserNotFound(true);
          setError("Este e-mail não está registado no sistema.");

          // Log específico para e-mail não encontrado
          await logPasswordReset({
            email,
            status: "failed",
            message: "E-mail não encontrado no sistema",
            metadata: { errorType: "user_not_found" },
          });
        } else {
          setError("Ocorreu um erro. Tenta novamente.");

          // Log para outros erros
          await logPasswordReset({
            email,
            status: "failed",
            message: `Erro na recuperação: ${errorMessage}`,
            metadata: { error: errorMessage },
          });
        }
      } else {
        setMessage(
          "Se o e-mail existir no sistema, receberás instruções para redefinir a senha."
        );

        // Log de sucesso
        await logPasswordReset({
          email,
          status: "success",
          message: "E-mail de recuperação enviado com sucesso",
          metadata: {},
        });
      }
    } catch (err) {
      console.error("Erro inesperado:", err);
      setError("Erro inesperado. Tenta novamente.");

      // Log para erros inesperados
      await logPasswordReset({
        email,
        status: "failed",
        message: "Erro inesperado na recuperação de senha",
        metadata: {
          error: err instanceof Error ? err.message : "Unknown error",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Esqueceste a senha?
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Introduz o teu e-mail para receberes instruções de recuperação
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="sr-only">
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${
                isUserNotFound ? "border-red-500" : "border-gray-300"
              } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "A enviar..." : "Enviar instruções"}
            </button>
          </div>

          {message && (
            <div className="rounded-md bg-green-50 p-4">
              <p className="text-sm text-green-800">{message}</p>
            </div>
          )}

          {error && (
            <div
              className={`rounded-md p-4 ${
                isUserNotFound ? "bg-amber-50" : "bg-red-50"
              }`}
            >
              <p
                className={`text-sm ${
                  isUserNotFound ? "text-amber-800" : "text-red-800"
                }`}
              >
                {error}
                {isUserNotFound && (
                  <span className="block mt-2">
                    <Link
                      href="/auth/register"
                      className="font-medium text-amber-600 hover:text-amber-500"
                    >
                      Criar nova conta →
                    </Link>
                  </span>
                )}
              </p>
            </div>
          )}

          <div className="text-center">
            <Link
              href="/auth/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              ← Voltar ao login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
