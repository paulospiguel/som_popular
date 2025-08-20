import { Logo } from "@/components/logo";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-bege-claro via-verde-muito-suave to-dourado-muito-claro flex items-center justify-center">
      <div className="flex flex-col items-center">
        <Logo isDashboard={false} />
        <p className="text-cinza-chumbo mt-2 animate-pulse">Carregando...</p>
      </div>
    </div>
  );
}
