"use client";

import { ArrowLeft, Compass, Home } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-bege-claro via-verde-muito-suave to-dourado-muito-claro flex items-center justify-center p-6">
      <div className="festival-card p-8 max-w-xl w-full text-center">
        <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-verde-suave/10 flex items-center justify-center border border-verde-suave/20">
          <Compass className="w-8 h-8 text-verde-suave" />
        </div>
        <h1 className="text-3xl font-bold text-cinza-chumbo mb-2">
          Página não encontrada (404)
        </h1>
        <p className="text-cinza-chumbo/70 mb-6">
          A página que você procura pode ter sido movida, removida ou o endereço
          foi digitado incorretamente.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button className="festival-button">
              <Home className="w-4 h-4 mr-2" />
              Voltar para a Home
            </Button>
          </Link>
          <Link href="/ranking">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" /> Ver Rankings
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

