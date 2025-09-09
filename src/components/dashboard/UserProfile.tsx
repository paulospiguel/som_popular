"use client";
import { IdCardLanyard, LogOut, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { ROLES } from "@/constants";
import { signOut, useSession } from "@/lib/auth-client";

import { Avatar } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export default function UserProfile() {
  const router = useRouter();
  const { data: session } = useSession();
  const userRole = session?.user.role || ROLES.OPERATOR;

  const getUserRole = (role: string) => {
    if (role === ROLES.MASTER) return "Master";
    if (role === ROLES.ADMIN) return "Administrador";
    return "Operador";
  };

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center space-x-3 px-2 py-1 rounded-lg hover:bg-gray-50 transition-colors">
          <div className="text-right">
            <span className="text-cinza-chumbo font-medium block">
              {session?.user.name}
            </span>
            <span className="text-xs text-cinza-chumbo/70">
              {getUserRole(userRole)}
            </span>
          </div>
          <Avatar
            name={session?.user.name || "Utilizador"}
            src={session?.user.image || null}
            size="lg"
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex items-center gap-2">
          <IdCardLanyard className="w-4 h-4" />
          {session?.user.name}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile">
            <span className="inline-flex items-center gap-2">
              <UserIcon className="w-4 h-4" /> Ver perfil
            </span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} variant="destructive">
          <LogOut className="w-4 h-4" /> Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
