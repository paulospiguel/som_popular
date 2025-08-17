import Link from "next/link";

import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Header com fundo verde médio */}
      <Header />

      {/* Hero Section com muito espaço em branco */}
      <section className="relative py-24 px-6">
        <div className="container mx-auto text-center max-w-4xl">
          {/* Título em verde escuro */}
          <h1 className="festival-title text-5xl md:text-7xl mb-8 leading-tight">
            Festival Som Popular
          </h1>

          {/* Subtítulo em cinza escuro */}
          <p className="festival-subtitle text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed">
            Celebrando os talentos da nossa terra com música, tradição e paixão
          </p>

          {/* CTA Buttons com nova paleta */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            {/* Botão principal - Dourado */}
            <Link
              href="/inscricoes"
              className="festival-button text-lg px-10 py-4 font-semibold"
            >
              🎤 Inscrever-me Agora
            </Link>

            {/* Botão secundário - Verde */}
            <Link
              href="/ranking"
              className="festival-button-secondary text-lg px-10 py-4 font-semibold"
            >
              📊 Ver Ranking
            </Link>
          </div>

          {/* Box Estado Atual - Fundo amarelo claro com texto verde escuro */}
          <div className="festival-card p-8 max-w-md mx-auto bg-slate-50">
            <h3 className="festival-subtitle text-lg font-semibold mb-4 text-terra">
              Estado Atual
            </h3>
            <div className="flex items-center justify-center space-x-3 mb-3">
              <div className="w-4 h-4 bg-verde-suave rounded-full animate-pulse"></div>
              <span className="text-verde-suave font-semibold text-lg">
                Inscrições Abertas
              </span>
            </div>
            <p className="text-sm text-cinza-chumbo/80">
              Próxima fase: Classificatórias - 15 de Março
            </p>
          </div>
        </div>
      </section>

      {/* Seção de Informações com fundo bege claro */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="festival-card p-8 text-center">
              <div className="text-4xl mb-4">🎵</div>
              <h3 className="festival-subtitle text-xl font-semibold mb-4 text-verde-suave">
                Múltiplas Categorias
              </h3>
              <p className="festival-text text-cinza-chumbo">
                Participa em diferentes modalidades musicais e mostra o teu
                talento único.
              </p>
            </div>

            {/* Card 2 */}
            <div className="festival-card p-8 text-center">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="festival-subtitle text-xl font-semibold mb-4 text-verde-suave">
                Prémios Incríveis
              </h3>
              <p className="festival-text text-cinza-chumbo">
                Reconhecimento, troféus e oportunidades para os melhores
                talentos.
              </p>
            </div>

            {/* Card 3 */}
            <div className="festival-card p-8 text-center">
              <div className="text-4xl mb-4">🎪</div>
              <h3 className="festival-subtitle text-xl font-semibold mb-4 text-verde-suave">
                Evento Comunitário
              </h3>
              <p className="festival-text text-cinza-chumbo">
                Uma celebração que une toda a comunidade em torno da música.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Apoiadores com Marquee Elegante */}
      <section className="py-16 px-6 bg-gradient-to-r from-bege-claro/30 to-verde-suave/5">
        <div className="container mx-auto">
          {/* Título da Seção */}
          <div className="text-center mb-12">
            <h2 className="festival-title text-3xl md:text-4xl mb-4 text-verde-suave">
              Apoiadores & Parceiros
            </h2>
            <p className="festival-subtitle text-base md:text-lg text-cinza-chumbo max-w-xl mx-auto mb-8">
              Juntos, construímos um festival que celebra a música local
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 10 }).map((_, index) => (
              <div
                key={`${index}`}
                className="flex-shrink-0 h-36 bg-white hover:bg-white/60 hover:shadow-dourado-claro/8 rounded-lg flex items-center justify-center border border-verde-suave/10 hover:border-verde-suave/20 transition-all duration-200 hover:scale-105"
              >
                <span className="text-verde-suave text-xs font-semibold tracking-wider">
                  APOIADOR {index}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
