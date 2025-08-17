"use client";

import { signUp } from "@/lib/auth-client";
import { Eye, EyeOff, Lock, Mail, Music, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
  
    // Validações mais robustas
    if (!name.trim()) {
      setError("O nome é obrigatório");
      return;
    }
  
    if (!email.trim()) {
      setError("O email é obrigatório");
      return;
    }
  
    if (password.length < 6) {
      setError("A password deve ter pelo menos 6 caracteres");
      return;
    }
  
    if (password !== confirmPassword) {
      setError("As passwords não coincidem");
      return;
    }
  
    setLoading(true);
  
    try {
      const result = await signUp.email({
        email: email.trim(),
        password,
        name: name.trim(),
      });
  
      console.log("✅ Registo bem-sucedido:", result);
  
      if (result.error) {
        console.error("❌ Erro no registo:", result.error);
        setError(
          result.error.message || "Erro ao criar conta. Tenta novamente."
        );
      } else {
        // Sucesso! Redirecionar para dashboard
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("❌ Erro inesperado:", err);
      setError("Erro ao criar conta. Tenta novamente.");
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
          <p className="text-cinza-chumbo/70">Cria a tua conta</p>
        </div>

        {/* Formulário */}
        <div className="festival-card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nome */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-cinza-chumbo mb-2"
              >
                Nome Completo
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cinza-chumbo/50" />
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-verde-suave/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-verde-suave focus:border-transparent transition-all"
                  placeholder="O teu nome"
                  required
                />
              </div>
            </div>

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

            {/* Confirmar Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-cinza-chumbo mb-2"
              >
                Confirmar Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cinza-chumbo/50" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-verde-suave/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-verde-suave focus:border-transparent transition-all"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cinza-chumbo/50 hover:text-cinza-chumbo transition-colors"
                >
                  {showConfirmPassword ? (
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
              className="w-full festival-button py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "A criar conta..." : "Criar Conta"}
            </button>
          </form>

          {/* Link para Login */}
          <div className="mt-6 text-center">
            <p className="text-cinza-chumbo/70">
              Já tens conta?{" "}
              <Link
                href="/login"
                className="text-verde-suave hover:text-verde-claro font-medium transition-colors"
              >
                Faz login aqui
              </Link>
            </p>
          </div>
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
