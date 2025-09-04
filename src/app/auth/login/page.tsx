"use client";

import { Eye, EyeOff, Loader2, Lock, Mail, Music } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { ROLES } from "@/constants";
import { signIn, useSession } from "@/lib/auth-client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (session?.user && !isPending) {
      console.log("Login page: Sessão completa:", session);
      console.log("Login page: Dados do usuário:", session.user);
      console.log("Login page: Role original:", session.user.role);

      const userRole = session.user.role || ROLES.OPERATOR;
      console.log("Login page: Role processado:", userRole);
      console.log("Login page: ROLES.ADMIN:", ROLES.ADMIN);
      console.log("Login page: ROLES.OPERATOR:", ROLES.OPERATOR);
      console.log("Login page: É admin?", userRole === ROLES.ADMIN);
      console.log("Login page: É operador?", userRole === ROLES.OPERATOR);

      setRedirecting(true);

      // Usar setTimeout para garantir que o redirecionamento aconteça
      const redirectTimeout = setTimeout(() => {
        console.log(
          "Login page: Executando redirecionamento com role:",
          userRole
        );
        if (userRole === ROLES.ADMIN) {
          console.log("Login page: Redirecionando admin para dashboard");
          router.push("/dashboard");
        } else if (userRole === ROLES.OPERATOR) {
          console.log("Login page: Redirecionando operador para votações");
          router.push("/votings");
        } else {
          // Usuário sem role válido, manter na página de login
          console.log("Login page: Usuário sem role válido:", userRole);
          setRedirecting(false);
        }
      }, 1000); // Aumentar delay para 1 segundo para debugging

      // Timeout adicional para mostrar botões manuais se redirecionamento falhar
      const fallbackTimeout = setTimeout(() => {
        console.log(
          "Login page: Redirecionamento falhou, mostrando opções manuais"
        );
        setRedirecting(false);
      }, 3000); // 3 segundos para fallback

      return () => {
        clearTimeout(redirectTimeout);
        clearTimeout(fallbackTimeout);
      };
    }

    // Retornar função vazia se a condição não for atendida
    return () => {};
  }, [session, isPending, router]);

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

  if (session?.user) {
    const userRole = session.user.role || ROLES.OPERATOR;

    return (
      <div className="min-h-screen bg-gradient-to-br from-bege-claro via-verde-muito-suave to-dourado-muito-claro flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-sm max-w-md w-full mx-4">
          {redirecting ? (
            <>
              <Loader2 className="animate-spin w-8 h-8 text-verde-suave mx-auto mb-4" />
              <p className="text-cinza-chumbo mb-4">A redirecionar...</p>
              <p className="text-sm text-cinza-chumbo/70">
                Se não for redirecionado automaticamente, clique no botão
                abaixo:
              </p>
            </>
          ) : (
            <>
              <p className="text-cinza-chumbo mb-4">
                Você está logado como{" "}
                {userRole === ROLES.ADMIN ? "Administrador" : "Operador"}
              </p>
              <p className="text-xs text-gray-500 mb-2">
                Role detectado: {userRole}
              </p>
              <p className="text-sm text-cinza-chumbo/70 mb-6">
                Clique no botão abaixo para continuar:
              </p>
            </>
          )}

          <div className="space-y-3 mt-6">
            {userRole === ROLES.ADMIN && (
              <button
                onClick={() => router.push("/dashboard")}
                className="w-full bg-verde-suave text-white px-4 py-2 rounded-lg hover:bg-verde-suave/90 transition-colors"
              >
                Ir para Dashboard
              </button>
            )}
            {(userRole === ROLES.ADMIN || userRole === ROLES.OPERATOR) && (
              <button
                onClick={() => router.push("/votings")}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Ir para Votações
              </button>
            )}
          </div>
        </div>
      </div>
    );
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

      console.log(result);

      if (result.error) {
        setError("Email ou password incorretos");
      } else {
        // Depois do login bem-sucedido, redirecionar baseado no role
        // O useEffect acima vai lidar com o redirecionamento quando a sessão for atualizada
        console.log(
          "Login bem-sucedido, aguardando redirecionamento automático"
        );
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
                href="/auth/forgot-password"
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
                href="/auth/register"
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
