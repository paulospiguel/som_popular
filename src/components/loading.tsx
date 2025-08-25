export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-bege-claro via-verde-muito-suave to-dourado-muito-claro flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-verde-suave mx-auto mb-4"></div>
        <p className="text-cinza-chumbo font-medium">Carregando...</p>
      </div>
    </div>
  );
}
