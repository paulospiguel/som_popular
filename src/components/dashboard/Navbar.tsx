"use client";

import { Play } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { ROLES } from "@/constants";
import { useSession } from "@/lib/auth-client";

import { Logo } from "../logo";
import { Switch } from "../ui/switch";

import UserProfile from "./UserProfile";

export default function NavbarDashboard() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isEventModeActive, setIsEventModeActive] = useState(false);

  const userRole = session?.user.role || ROLES.OPERATOR;
  const isVotingPage = pathname.startsWith("/votings");

  useEffect(() => {
    setIsEventModeActive(isVotingPage);
  }, [isVotingPage]);

  if (!session) {
    return null;
  }

  const toggleEventMode = () => {
    if (userRole === ROLES.ADMIN || userRole === ROLES.MASTER) {
      if (!isEventModeActive) {
        router.push("/votings");
      } else {
        router.push("/dashboard");
      }
      setIsEventModeActive(!isEventModeActive);
    } else if (userRole === ROLES.OPERATOR) {
      // Operadores só podem ir para votações
      router.push("/votings");
    }
  };

  return (
    <header className="bg-white/90 backdrop-blur-sm border-b border-verde-suave/20 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <Logo isDashboard={true} />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Switch do Modo Evento - admins e master */}
            {(userRole === ROLES.ADMIN || userRole === ROLES.MASTER) && (
              <div className="flex items-center space-x-3 px-3 py-2 bg-gray-50 rounded-lg">
                {isEventModeActive ? (
                  <div className="flex items-center space-x-1 text-verde-suave">
                    <Play className="w-4 h-4" />
                    <span className="text-sm font-medium">Modo Evento</span>
                  </div>
                ) : (
                  <span className="text-sm font-medium text-cinza-chumbo">
                    Modo Administrador
                  </span>
                )}

                <Switch
                  checked={isVotingPage}
                  onCheckedChange={toggleEventMode}
                />
              </div>
            )}

            {/* Indicador para operadores */}
            {userRole === ROLES.OPERATOR && (
              <div className="flex items-center space-x-2 px-3 py-2 bg-verde-suave/10 rounded-lg">
                <Play className="w-4 h-4 text-verde-suave" />
                <span className="text-sm font-medium text-verde-suave">
                  Modo Operador
                </span>
              </div>
            )}

            <UserProfile />
          </div>
        </div>
      </div>
    </header>
  );
}
