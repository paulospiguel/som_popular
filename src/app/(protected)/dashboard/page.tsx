"use client";

import { useSession } from "@/lib/auth-client";
import {
  AlertTriangle,
  BarChart3,
  Calendar,
  FileText,
  Mail,
  Music,
  Settings,
  Shield,
  Trophy,
  UserCheck,
  Users,
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const { data: session, isPending } = useSession();

  // ProtectedProvider já faz a validação de permissões

  if (isPending) {
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
    <div className="min-h-screen bg-gradient-to-br from-bege-claro via-verde-muito-suave to-dourado-muito-claro">
      {/* Conteúdo Principal */}
      <main className="container mx-auto px-4 py-8">
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
            <div className="text-right">
              <p className="text-sm text-cinza-chumbo/70">Última atualização</p>
              <p className="font-semibold text-verde-suave">
                {new Date().toLocaleDateString("pt-PT")}
              </p>
            </div>
          </div>
        </div>

        {/* Estatísticas Administrativas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="festival-card p-6 text-center hover:shadow-lg transition-shadow">
            <Users className="w-10 h-10 text-verde-suave mx-auto mb-3" />
            <h3 className="font-semibold text-cinza-chumbo mb-1">
              Total Participantes
            </h3>
            <p className="text-3xl font-bold text-verde-suave mb-1">156</p>
            <p className="text-xs text-cinza-chumbo/70">+12 esta semana</p>
          </div>

          <div className="festival-card p-6 text-center hover:shadow-lg transition-shadow">
            <Calendar className="w-10 h-10 text-dourado-claro mx-auto mb-3" />
            <h3 className="font-semibold text-cinza-chumbo mb-1">
              Eventos Ativos
            </h3>
            <p className="text-3xl font-bold text-dourado-claro mb-1">8</p>
            <p className="text-xs text-cinza-chumbo/70">3 pendentes</p>
          </div>

          <div className="festival-card p-6 text-center hover:shadow-lg transition-shadow">
            <Trophy className="w-10 h-10 text-amarelo-suave mx-auto mb-3" />
            <h3 className="font-semibold text-cinza-chumbo mb-1">
              Classificações
            </h3>
            <p className="text-3xl font-bold text-amarelo-suave mb-1">45</p>
            <p className="text-xs text-cinza-chumbo/70">avaliadas</p>
          </div>

          <div className="festival-card p-6 text-center hover:shadow-lg transition-shadow">
            <AlertTriangle className="w-10 h-10 text-vermelho-suave mx-auto mb-3" />
            <h3 className="font-semibold text-cinza-chumbo mb-1">Pendências</h3>
            <p className="text-3xl font-bold text-vermelho-suave mb-1">7</p>
            <p className="text-xs text-cinza-chumbo/70">requer atenção</p>
          </div>
        </div>

        {/* Ações Administrativas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Gestão de Participantes */}
          <Link
            href="/dashboard/participantes"
            className="festival-card p-6 hover:scale-105 transition-all hover:shadow-lg group"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-verde-suave/10 p-4 rounded-xl group-hover:bg-verde-suave/20 transition-colors">
                <Users className="w-8 h-8 text-verde-suave" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-cinza-chumbo mb-1">
                  Gestão de Participantes
                </h3>
                <p className="text-sm text-cinza-chumbo/70">
                  Aprovar, editar e gerir inscrições
                </p>
              </div>
            </div>
          </Link>

          {/* Gestão de Eventos */}
          <Link
            href="/dashboard/eventos"
            className="festival-card p-6 hover:scale-105 transition-all hover:shadow-lg group"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-dourado-claro/10 p-4 rounded-xl group-hover:bg-dourado-claro/20 transition-colors">
                <Calendar className="w-8 h-8 text-dourado-claro" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-cinza-chumbo mb-1">
                  Gestão de Eventos
                </h3>
                <p className="text-sm text-cinza-chumbo/70">
                  Criar, editar e programar eventos
                </p>
              </div>
            </div>
          </Link>

          {/* Sistema de Classificações */}
          <Link
            href="/dashboard/classificacoes"
            className="festival-card p-6 hover:scale-105 transition-all hover:shadow-lg group"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-amarelo-suave/10 p-4 rounded-xl group-hover:bg-amarelo-suave/20 transition-colors">
                <Trophy className="w-8 h-8 text-amarelo-suave" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-cinza-chumbo mb-1">
                  Sistema de Classificações
                </h3>
                <p className="text-sm text-cinza-chumbo/70">
                  Avaliar e gerir pontuações
                </p>
              </div>
            </div>
          </Link>

          {/* Relatórios e Estatísticas */}
          <Link
            href="/dashboard/relatorios"
            className="festival-card p-6 hover:scale-105 transition-all hover:shadow-lg group"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-blue-500/10 p-4 rounded-xl group-hover:bg-blue-500/20 transition-colors">
                <BarChart3 className="w-8 h-8 text-blue-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-cinza-chumbo mb-1">
                  Relatórios e Estatísticas
                </h3>
                <p className="text-sm text-cinza-chumbo/70">
                  Análises e dados do festival
                </p>
              </div>
            </div>
          </Link>

          {/* Comunicações */}
          <Link
            href="/dashboard/comunicacoes"
            className="festival-card p-6 hover:scale-105 transition-all hover:shadow-lg group"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-purple-500/10 p-4 rounded-xl group-hover:bg-purple-500/20 transition-colors">
                <Mail className="w-8 h-8 text-purple-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-cinza-chumbo mb-1">
                  Comunicações
                </h3>
                <p className="text-sm text-cinza-chumbo/70">
                  Enviar emails e notificações
                </p>
              </div>
            </div>
          </Link>

          {/* Configurações do Sistema */}
          <Link
            href="/dashboard/configuracoes"
            className="festival-card p-6 hover:scale-105 transition-all hover:shadow-lg group"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-cinza-chumbo/10 p-4 rounded-xl group-hover:bg-cinza-chumbo/20 transition-colors">
                <Settings className="w-8 h-8 text-cinza-chumbo" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-cinza-chumbo mb-1">
                  Configurações do Sistema
                </h3>
                <p className="text-sm text-cinza-chumbo/70">
                  Gerir definições gerais
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* Atividade Recente */}
        <div className="festival-card p-6 mb-8">
          <h3 className="festival-subtitle text-lg mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-verde-suave" />
            Atividade Recente
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-verde-suave/5 rounded-lg">
              <div className="flex items-center space-x-3">
                <UserCheck className="w-5 h-5 text-verde-suave" />
                <span className="text-sm text-cinza-chumbo">
                  Nova inscrição aprovada: João Silva
                </span>
              </div>
              <span className="text-xs text-cinza-chumbo/70">há 2 horas</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-dourado-claro/5 rounded-lg">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-dourado-claro" />
                <span className="text-sm text-cinza-chumbo">
                  Evento "Concurso de Fado" criado
                </span>
              </div>
              <span className="text-xs text-cinza-chumbo/70">há 4 horas</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-amarelo-suave/5 rounded-lg">
              <div className="flex items-center space-x-3">
                <Trophy className="w-5 h-5 text-amarelo-suave" />
                <span className="text-sm text-cinza-chumbo">
                  Classificações atualizadas para "Concurso de Guitarra"
                </span>
              </div>
              <span className="text-xs text-cinza-chumbo/70">ontem</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
