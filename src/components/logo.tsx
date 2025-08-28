import { Music, Shield } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type LogoProps = {
  isDashboard: boolean;
  width?: number;
  height?: number;
  version?: "default" | "small";
};

export function Logo({
  isDashboard,
  version = "default",
  width = 80,
  height = 80,
}: LogoProps) {
  return (
    <Link href={isDashboard ? "/dashboard" : "/"} className="flex items-center">
      {version === "default" ? (
        <Image
          src="/images/logo.png"
          alt="Festival Som Popular"
          width={width}
          height={height}
          className="rounded-full"
        />
      ) : (
        <Music className="w-8 h-8 text-verde-suave" />
      )}

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
    </Link>
  );
}
