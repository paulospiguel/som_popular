"use client";

import {
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  Loader2,
  Lock,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { resetPassword } from "@/lib/auth-client";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const errorParam = searchParams.get("error");

  useEffect(() => {
    if (errorParam === "INVALID_TOKEN") {
      setError(
        "Token inválido ou expirado. Solicita um novo link de recuperação."
      );
    }
    if (!token && !errorParam) {
      router.push("/auth/forgot-password");
    }
  }, [token, errorParam, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("As palavras-passe não coincidem");
      return;
    }

    if (password.length < 6) {
      setError("A palavra-passe deve ter pelo menos 6 caracteres");
      return;
    }

    if (!token) {
      setError("Token inválido");
      return;
    }

    setIsLoading(true);

    try {
      const result = await resetPassword({
        token,
        newPassword: password,
      });

      if (result.error) {
        setError(result.error.message || "Erro ao redefinir palavra-passe");
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push("/auth/login");
        }, 3000);
      }
    } catch (err) {
      setError("Erro inesperado. Tenta novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  // Página de sucesso
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="mt-6 text-2xl font-bold text-gray-900">
              Senha Redefinida com Sucesso! 🎉
            </h2>
            <p className="mt-2 text-gray-600">
              A tua palavra-passe foi alterada. Serás redirecionado para o login
              em 3 segundos...
            </p>
            <div className="mt-4">
              <Link
                href="/auth/login"
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Ir para Login Agora
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Página de erro de token
  if (errorParam === "INVALID_TOKEN") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="mx-auto h-16 w-16 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="mt-6 text-2xl font-bold text-gray-900">
              Token Inválido
            </h2>
            <p className="mt-2 text-gray-600">
              O link de recuperação é inválido ou expirou. Solicita um novo
              link.
            </p>
            <div className="mt-6 space-y-3">
              <Link
                href="/auth/forgot-password"
                className="block w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Solicitar Novo Link
              </Link>
              <Link
                href="/auth/login"
                className="block w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Voltar ao Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Lock className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Nova Palavra-passe
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Introduz a tua nova palavra-passe
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Nova Palavra-passe
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Mínimo 6 caracteres"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirmar Palavra-passe
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Repete a palavra-passe"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />A
                  redefinir...
                </>
              ) : (
                "Redefinir Palavra-passe"
              )}
            </button>

            <div className="text-center">
              <Link
                href="/auth/login"
                className="text-sm text-gray-600 hover:text-gray-500 transition-colors"
              >
                Voltar ao Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
