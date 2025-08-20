import { Logo } from "./logo";

export function Loading({ isLoading }: { isLoading: boolean }) {
  if (!isLoading) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-bege-claro via-verde-muito-suave to-dourado-muito-claro flex items-center justify-center">
      <div className="text-center">
        <Logo isDashboard={false} />
        <p className="text-cinza-chumbo mt-2 animate-pulse">Carregando...</p>
      </div>
    </div>
  );
}
