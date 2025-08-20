"use client";

import { signOut, useSession } from "@/lib/auth-client";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { Logo } from "../logo";

export default function NavbarDashboard() {
  const router = useRouter();
  const { data: session } = useSession();

  if (!session) {
    return null;
  }

  const handleLogout = async () => {
    await signOut();
    router.push("/");
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
            <div className="text-right">
              <span className="text-cinza-chumbo font-medium block">
                {session.user.name}
              </span>
              <span className="text-xs text-cinza-chumbo/70">
                Administrador
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-cinza-chumbo hover:text-vermelho-suave transition-colors p-2 rounded-lg hover:bg-vermelho-suave/10"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:block">Sair</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
