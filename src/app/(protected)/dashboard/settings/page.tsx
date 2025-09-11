import { Home, Shield, Tags, Users, Wrench } from "lucide-react";
import Link from "next/link";

import { requireMaster } from "@/lib/action-guards";

export default async function SettingsPage() {
  await requireMaster();

  const cards = [
    {
      icon: Home,
      title: "Configurações da Página Principal",
      description: "Tema, cores e configurações da home",
      href: "/dashboard/settings/homepage",
    },
    {
      icon: Users,
      title: "Utilizadores e Regras",
      description: "Gerir contas, papéis (roles) e permissões",
      href: "/dashboard/settings/users",
    },
    {
      icon: Tags,
      title: "Opções de Eventos",
      description: "Categorias e Tipos de eventos",
      href: "/dashboard/settings/options",
    },
    {
      icon: Wrench,
      title: "Políticas e Regras",
      description: "Definições gerais do sistema",
      href: "/dashboard/settings/policies",
    },
  ];

  return (
    <div className="p-6">
      <div className="festival-card p-6 mb-8 border-l-4 border-verde-suave">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="festival-subtitle text-2xl mb-2 flex items-center">
              <Shield className="w-6 h-6 mr-2 text-verde-suave" />
              Configurações do Sistema
            </h2>
            <p className="text-cinza-chumbo/70">
              Administração avançada. Apenas utilizadores com regra Master.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link key={c.title} href={c.href} className="block">
              <div className="p-5 rounded-xl border bg-white/60 hover:bg-white transition shadow-sm h-full">
                <div className="flex items-center space-x-3 mb-3">
                  <Icon className="w-5 h-5 text-verde-suave" />
                  <h3 className="font-semibold text-cinza-chumbo">{c.title}</h3>
                </div>
                <p className="text-sm text-cinza-chumbo/70">{c.description}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
