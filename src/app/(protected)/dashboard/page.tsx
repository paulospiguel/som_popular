"use client";

import {
  AlertTriangle,
  BarChart3,
  Calendar,
  Mail,
  Music,
  Settings,
  Shield,
  Trophy,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { useSession } from "@/lib/auth-client";
import { getDashboardStats, type DashboardStats } from "@/server/dashboard";

const CARDS = [
  {
    icon: Users,
    color: "verde-suave",
    title: "Gestão de Participantes",
    description: "Aprovar, editar e gerir inscrições",
    href: "/dashboard/participantes",
  },
  {
    icon: Calendar,
    color: "dourado-claro",
    title: "Gestão de Eventos",
    description: "Criar, editar e programar eventos",
    href: "/dashboard/events",
  },
  {
    icon: Trophy,
    color: "amarelo-suave",
    title: "Sistema de Votações",
    description: "Avaliar e gerir votos",
    href: "/votings",
  },
  {
    icon: BarChart3,
    color: "indigo-500",
    title: "Relatórios e Estatísticas",
    description: "Análises e dados do festival",
    href: "/dashboard/reports",
    disabled: true,
  },
  {
    icon: Mail,
    color: "blue-500",
    title: "Comunicações",
    description: "Enviar emails e notificações",
    href: "/dashboard/notifications",
    disabled: true,
  },
  {
    icon: Settings,
    color: "cinza-chumbo",
    title: "Configurações do Sistema",
    description: "Gerir definições gerais",
    href: "/dashboard/settings",
    disabled: true,
  },
];

export default function AdminDashboard() {
  const { data: session, isPending } = useSession();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getDashboardStats();
      if (result.success && result.data) {
        setStats(result.data);
      } else {
        setError(result.error || "Erro ao carregar estatísticas");
      }
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
      setError("Erro ao carregar estatísticas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      loadDashboardStats();
    }
  }, [session]);

  if (isPending || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bege-claro via-verde-muito-suave to-dourado-muito-claro flex items-center justify-center">
        <div className="text-center">
          <Music className="w-12 h-12 text-verde-suave mx-auto mb-4 animate-pulse" />
          <p className="text-cinza-chumbo">
            A carregar painel administrativo...
          </p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <>
      {/* Conteúdo Principal */}
      <main className="container mx-auto px-4 py-8 flex-1">
        {/* Boas-vindas Administrativas */}
        <div className="festival-card p-6 mb-8 border-l-4 border-verde-suave">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="festival-subtitle text-2xl mb-2 flex items-center">
                <Shield className="w-6 h-6 mr-2 text-verde-suave" />
                Painel de Administração
              </h2>
              <p className="text-cinza-chumbo/70">
                Gere todos os aspetos do Festival Som Popular
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-cinza-chumbo/70">
                  Última atualização
                </p>
                <p className="font-semibold text-verde-suave">
                  {new Date().toLocaleDateString("pt-PT")}
                </p>
              </div>
              <button
                onClick={loadDashboardStats}
                disabled={loading}
                className="p-2 bg-verde-suave/10 hover:bg-verde-suave/20 rounded-lg transition-colors disabled:opacity-50"
                title="Atualizar estatísticas"
              >
                <BarChart3 className="w-5 h-5 text-verde-suave" />
              </button>
            </div>
          </div>
        </div>

        {/* Indicador de Erro */}
        {error && (
          <div className="festival-card p-4 mb-6 border-l-4 border-vermelho-suave bg-vermelho-suave/5">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-5 h-5 text-vermelho-suave" />
              <div className="flex-1">
                <p className="text-sm text-cinza-chumbo font-medium">
                  Erro ao carregar estatísticas
                </p>
                <p className="text-xs text-cinza-chumbo/70">{error}</p>
              </div>
              <button
                onClick={loadDashboardStats}
                className="px-3 py-1 bg-vermelho-suave/10 hover:bg-vermelho-suave/20 text-vermelho-suave text-xs rounded-lg transition-colors"
              >
                Tentar novamente
              </button>
            </div>
          </div>
        )}

        {/* Estatísticas Administrativas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="festival-card p-6 text-center hover:shadow-lg transition-shadow">
            <Users className="w-10 h-10 text-verde-suave mx-auto mb-3" />
            <h3 className="font-semibold text-cinza-chumbo mb-1">
              Total Participantes
            </h3>
            <p className="text-3xl font-bold text-verde-suave mb-1">
              {loading ? (
                <div className="w-8 h-8 border-2 border-verde-suave border-t-transparent rounded-full animate-spin mx-auto" />
              ) : (
                stats?.totalParticipants || 0
              )}
            </p>
            <p className="text-xs text-cinza-chumbo/70">
              {loading ? (
                "Carregando..."
              ) : (stats?.newParticipantsThisWeek ?? 0) > 0 ? (
                <span className="text-green-600">
                  +{stats?.newParticipantsThisWeek ?? 0} esta semana
                </span>
              ) : (
                <span className="text-gray-500">Nenhum novo esta semana</span>
              )}
            </p>
          </div>

          <div className="festival-card p-6 text-center hover:shadow-lg transition-shadow">
            <Calendar className="w-10 h-10 text-dourado-claro mx-auto mb-3" />
            <h3 className="font-semibold text-cinza-chumbo mb-1">
              Eventos Ativos
            </h3>
            <p className="text-3xl font-bold text-dourado-claro mb-1">
              {loading ? (
                <div className="w-8 h-8 border-2 border-dourado-claro border-t-transparent rounded-full animate-spin mx-auto" />
              ) : (
                stats?.activeEvents || 0
              )}
            </p>
            <p className="text-xs text-cinza-chumbo/70">
              {loading
                ? "Carregando..."
                : `${stats?.pendingEvents || 0} pendentes`}
            </p>
          </div>

          <div className="festival-card p-6 text-center hover:shadow-lg transition-shadow">
            <Trophy className="w-10 h-10 text-amarelo-suave mx-auto mb-3" />
            <h3 className="font-semibold text-cinza-chumbo mb-1">Avaliações</h3>
            <p className="text-3xl font-bold text-amarelo-suave mb-1">
              {loading ? (
                <div className="w-8 h-8 border-2 border-amarelo-suave border-t-transparent rounded-full animate-spin mx-auto" />
              ) : (
                stats?.completedEvaluations || 0
              )}
            </p>
            <p className="text-xs text-cinza-chumbo/70">
              {loading
                ? "Carregando..."
                : `de ${stats?.totalEvaluations || 0} esperadas`}
            </p>
            {!loading &&
              stats?.totalEvaluations &&
              stats?.totalEvaluations > 0 && (
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-amarelo-suave h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.round(
                          ((stats.completedEvaluations || 0) /
                            stats.totalEvaluations) *
                            100
                        )}%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-cinza-chumbo/70 mt-1">
                    {Math.round(
                      ((stats.completedEvaluations || 0) /
                        stats.totalEvaluations) *
                        100
                    )}
                    % completo
                  </p>
                </div>
              )}
          </div>

          <Link
            href="/dashboard/logs"
            className="festival-card p-6 text-center hover:shadow-lg transition-shadow"
          >
            <AlertTriangle className="w-10 h-10 text-vermelho-suave mx-auto mb-3" />
            <h3 className="font-semibold text-cinza-chumbo mb-1">Pendências</h3>
            <p className="text-3xl font-bold text-vermelho-suave mb-1">
              {loading ? (
                <div className="w-8 h-8 border-2 border-vermelho-suave border-t-transparent rounded-full animate-spin mx-auto" />
              ) : (
                stats?.pendingActions || 0
              )}
            </p>
            <p className="text-xs text-cinza-chumbo/70">
              {loading ? "Carregando..." : "requer atenção"}
            </p>
          </Link>
        </div>

        {/* Ações Administrativas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 ">
          {CARDS.map((card) => (
            <Link
              data-disabled={card.disabled}
              key={card.title}
              href={card.href}
              className="festival-card p-6 hover:scale-105 transition-all hover:shadow-lg group data-disabled:opacity-50 data-disabled:pointer-events-none"
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`bg-${card.color}/10 p-4 rounded-xl group-hover:bg-${card.color}/20 transition-colors`}
                >
                  <card.icon
                    className={`w-8 h-8 text-${card.color} group-hover:text-${card.color}`}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-cinza-chumbo mb-1">
                    {card.title}
                  </h3>
                  <p className="text-sm text-cinza-chumbo/70">
                    {card.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
