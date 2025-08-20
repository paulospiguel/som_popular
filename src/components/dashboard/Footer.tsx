import { Home } from "lucide-react";
import Link from "next/link";

export default function FooterDashborad() {
  return (
    <footer className="bg-white/90 backdrop-blur-sm border-t border-verde-suave/20 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="text-cinza-chumbo text-xs">
            &copy; {new Date().getFullYear()} Som Popular. Todos os direitos
            reservados.
          </div>

          <div className="text-center text-sm">
            <Link
              href="/"
              className="inline-flex items-center space-x-2 text-cinza-chumbo/70 hover:text-cinza-chumbo transition-colors p-3 rounded-lg hover:bg-white/50"
            >
              <Home className="w-4 h-4" />
              <span>Voltar ao site principal</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
