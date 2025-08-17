"use client";

import { signOut, useSession } from "@/lib/auth-client";
import { LogOut, Settings, Home, Trophy, Star, Music, Users, Calendar } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  if (isPending) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bege-claro via-verde-muito-suave to-dourado-muito-claro flex items-center justify-center">
        <div className="text-center">
          <Music className="w-12 h-12 text-verde-suave mx-auto mb-4 animate-pulse" />
          <p className="text-cinza-chumbo">A carregar...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-bege-claro via-verde-muito-suave to-dourado-muito-claro">
      {/* Header do Dashboard */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-verde-suave/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Music className="w-8 h-8 text-verde-suave" />
              <h1 className="festival-title text-xl">Som Popular</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-cinza-chumbo font-medium">Olá, {session.user.name}!</span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-cinza-chumbo hover:text-vermelho-suave transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="container mx-auto px-4 py-8">
        {/* Boas-vindas */}
        <div className="festival-card p-6 mb-8">
          <h2 className="festival-subtitle text-2xl mb-2">Bem-vindo ao Dashboard!</h2>
          <p className="text-cinza-chumbo/70">Gere a tua participação no Festival Som Popular</p>
        </div>

        {/* Estatísticas Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="festival-card p-6 text-center">
            <Trophy className="w-8 h-8 text-dourado-claro mx-auto mb-3" />
            <h3 className="font-semibold text-cinza-chumbo mb-1">Posição</h3>
            <p className="text-2xl font-bold text-verde-suave">-</p>
          </div>
          
          <div className="festival-card p-6 text-center">
            <Star className="w-8 h-8 text-amarelo-suave mx-auto mb-3" />
            <h3 className="font-semibold text-cinza-chumbo mb-1">Pontuação</h3>
            <p className="text-2xl font-bold text-verde-suave">0</p>
          </div>
          
          <div className="festival-card p-6 text-center">
            <Users className="w-8 h-8 text-verde-suave mx-auto mb-3" />
            <h3 className="font-semibold text-cinza-chumbo mb-1">Participantes</h3>
            <p className="text-2xl font-bold text-verde-suave">156</p>
          </div>
          
          <div className="festival-card p-6 text-center">
            <Calendar className="w-8 h-8 text-vermelho-suave mx-auto mb-3" />
            <h3 className="font-semibold text-cinza-chumbo mb-1">Próximo Evento</h3>
            <p className="text-sm font-bold text-verde-suave">15 Jan</p>
          </div>
        </div>

        {/* Ações Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/dashboard/inscricao" className="festival-card p-6 hover:scale-105 transition-transform">
            <div className="flex items-center space-x-4">
              <div className="bg-verde-suave/10 p-3 rounded-xl">
                <Music className="w-6 h-6 text-verde-suave" />
              </div>
              <div>
                <h3 className="font-semibold text-cinza-chumbo mb-1">Minha Inscrição</h3>
                <p className="text-sm text-cinza-chumbo/70">Ver e editar dados</p>
              </div>
            </div>
          </Link>
          
          <Link href="/ranking" className="festival-card p-6 hover:scale-105 transition-transform">
            <div className="flex items-center space-x-4">
              <div className="bg-dourado-claro/10 p-3 rounded-xl">
                <Trophy className="w-6 h-6 text-dourado-claro" />
              </div>
              <div>
                <h3 className="font-semibold text-cinza-chumbo mb-1">Ranking</h3>
                <p className="text-sm text-cinza-chumbo/70">Ver classificação</p>
              </div>
            </div>
          </Link>
          
          <Link href="/dashboard/configuracoes" className="festival-card p-6 hover:scale-105 transition-transform">
            <div className="flex items-center space-x-4">
              <div className="bg-cinza-chumbo/10 p-3 rounded-xl">
                <Settings className="w-6 h-6 text-cinza-chumbo" />
              </div>
              <div>
                <h3 className="font-semibold text-cinza-chumbo mb-1">Configurações</h3>
                <p className="text-sm text-cinza-chumbo/70">Gerir conta</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Link para voltar ao site */}
        <div className="text-center mt-8">
          <Link href="/" className="inline-flex items-center space-x-2 text-cinza-chumbo/70 hover:text-cinza-chumbo transition-colors">
            <Home className="w-4 h-4" />
            <span>Voltar ao site principal</span>
          </Link>
        </div>
      </main>
    </div>
  );
}