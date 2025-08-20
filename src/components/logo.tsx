import { Music, Shield } from "lucide-react";

export function Logo({ isDashboard }: { isDashboard: boolean }) {
  return (
    <div className="flex items-center">
      <Music className="w-8 h-8 text-verde-suave" />
      <div className="ml-2">
        <h1
          className={`festival-title text-xl ${isDashboard ? "text-verde-suave" : "text-white"}`}
        >
          Som Popular
        </h1>
        {isDashboard && (
          <p className="text-xs text-cinza-chumbo/70 flex items-center">
            <Shield className="w-3 h-3 mr-1" />
            Painel Administrativo
          </p>
        )}
      </div>
    </div>
  );
}
