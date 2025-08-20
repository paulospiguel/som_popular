"use client";

import { signIn, useSession } from "@/lib/auth-client";
import { Eye, EyeOff, Loader2, Lock, Mail, Music } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session, isPending } = useSession();

  // Redirecionar se já estiver autenticado
  useEffect(() => {
    if (session?.user && !isPending) {
      router.push("/dashboard");
    }
  }, [session, isPending, router]);

  // Mostrar loading enquanto verifica a sessão
  if (isPending) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bege-claro via-verde-muito-suave to-dourado-muito-claro flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin w-8 h-8 text-verde-suave mx-auto mb-4" />
          <p className="text-cinza-chumbo">A verificar sessão...</p>
        </div>
      </div>
    );
  }

  // Não renderizar o formulário se já estiver autenticado
  if (session?.user) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn.email({
        email,
        password,
      });

      if (result.error) {
        setError("Email ou password incorretos");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError("Erro ao fazer login. Tenta novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-bege-claro via-verde-muito-suave to-dourado-muito-claro flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header com Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Music className="w-12 h-12 text-verde-suave" />
          </div>
          <h1 className="festival-title text-3xl mb-2">Som Popular</h1>
          <p className="text-cinza-chumbo/70">Acesso à plataforma</p>
        </div>

        {/* Formulário */}
        <div className="festival-card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-cinza-chumbo mb-2"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cinza-chumbo/50" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-verde-suave/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-verde-suave focus:border-transparent transition-all"
                  placeholder="teu@email.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-cinza-chumbo mb-2"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cinza-chumbo/50" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-verde-suave/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-verde-suave focus:border-transparent transition-all"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cinza-chumbo/50 hover:text-cinza-chumbo transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Erro */}
            {error && (
              <div className="bg-vermelho-suave/10 border border-vermelho-suave/20 text-vermelho-suave px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            {/* Botão Submit */}
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />A
                  entrar...
                </>
              ) : (
                "Entrar"
              )}
            </button>

            <div className="text-center space-y-2">
              <Link
                href="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-500 transition-colors"
              >
                Esqueci a palavra-passe
              </Link>
            </div>
          </form>

          {/* Link para Registo */}
          {/* <div className="mt-6 text-center">
            <p className="text-cinza-chumbo/70">
              Ainda não tens conta?{" "}
              <Link
                href="/register"
                className="text-verde-suave hover:text-verde-claro font-medium transition-colors"
              >
                Regista-te aqui
              </Link>
            </p>
          </div> */}
        </div>

        {/* Link para voltar */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-cinza-chumbo/70 hover:text-cinza-chumbo transition-colors text-sm"
          >
            ← Voltar ao site
          </Link>
        </div>
      </div>
    </div>
  );
}
