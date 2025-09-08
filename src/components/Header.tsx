"use client";
import { Menu, Music } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { cn } from "@/lib/utils";

import { Logo } from "./logo";

interface HeaderProps {
  transparent?: boolean;
}

const MENU = [
  {
    name: "Eventos",
    href: "/#events",
  },
  {
    name: "Consultar Inscrição",
    href: "/search-registration",
  },
  {
    name: "Ajuda",
    href: "/help",
  },
];

export default function Header({ transparent = false }: HeaderProps) {
  const router = useRouter();
  return (
    <header
      className={cn(
        "bg-terra/95 backdrop-blur-sm",
        transparent ? "bg-transparent" : "bg-terra/95 backdrop-blur-sm",
        "sticky top-0 z-50 transition-all duration-300"
      )}
    >
      <div className="container mx-auto px-4 py-4 text-white">
        <div className="flex items-center justify-between">
          {/* Logo e Título */}
          <Logo isDashboard={false} />

          {/* Navegação Desktop */}
          <nav className="hidden md:flex space-x-6 items-center">
            {MENU.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-neve hover:text-dourado transition-colors font-medium"
              >
                {item.name}
              </Link>
            ))}
            <ShimmerButton
              onClick={() => {
                router.push("/participant-registration");
              }}
              background="#4caf50"
              //  href="/participant-registration"
              className="px-4 py-2 text-sm border border-white/10"
            >
              <Music className="w-4 h-4 mr-2" />
              Quero Participar
            </ShimmerButton>
          </nav>

          {/* Menu Mobile (Hamburger) */}
          <button className="md:hidden text-neve hover:text-dourado transition-colors">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
}
