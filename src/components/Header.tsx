import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface HeaderProps {
  transparent?: boolean;
}

export default function Header({ transparent = false }: HeaderProps) {
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
          <Link
            href="/"
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
          >
            <Image
              src="/images/logo.png"
              alt="Festival Som Popular"
              width={50}
              height={50}
              className="rounded-full"
            />
            <h1 className="festival-title text-neve text-2xl font-bold">
              Som Popular
            </h1>
          </Link>

          {/* Navegação Desktop */}
          <nav className="hidden md:flex space-x-6 items-center">
            <Link
              href="/#sobre"
              className="text-neve hover:text-dourado transition-colors font-medium"
            >
              Sobre
            </Link>
            <Link
              href="/#regulamento"
              className="text-neve hover:text-dourado transition-colors font-medium"
            >
              Regulamento
            </Link>
            <Link
              href="/ranking"
              className="text-neve hover:text-dourado transition-colors font-medium"
            >
              Ranking
            </Link>
            <Link
              href="/inscricoes"
              className="festival-button-secondary px-4 py-2 text-sm"
            >
              Inscrever-me
            </Link>
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
