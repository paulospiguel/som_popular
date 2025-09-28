import Link from "next/link";
import { redirect } from "next/navigation";

import CurrentStatusCard from "@/components/CurrentStatusCard";
import EventsSection from "@/components/EventsSection";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Ripple } from "@/components/magicui/ripple";
import { getHomePageSettings } from "@/server/settings.actions";

export default async function Home() {
  // Buscar configurações da página principal
  const settings = await getHomePageSettings();

  // Se o modo único evento estiver ativado, redirecionar para o evento específico
  if (settings.singleEventMode && settings.singleEventId) {
    redirect(`/${settings.singleEventId}`);
  }
  return (
    <div className="min-h-screen">
      {/* Header com fundo verde médio */}
      <Header />

      {/* Hero Section com muito espaço em branco */}
      <section className="relative py-24 px-6">
        <Ripple />
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
              href="/participant-registration"
              className="festival-button text-lg px-10 py-4 font-semibold"
            >
              🎤 Inscrever-se
            </Link>

            {/* Botão secundário - Verde */}
            <Link
              href="/#events"
              className="festival-button-secondary text-lg px-10 py-4 font-semibold"
            >
              📋 Ver Eventos
            </Link>

            {/* Botão terciário - Rankings */}
            <Link
              href="/ranking"
              className="festival-button-secondary text-lg px-10 py-4 font-semibold"
            >
              📊 Acompanhar
            </Link>
          </div>

          {/* Card Estado Atual com Dados Reais - apenas se habilitado */}
          {settings.showCurrentStatus && <CurrentStatusCard />}
        </div>
      </section>

      {/* Seção de Informações com fundo bege claro - apenas se habilitado */}
      {settings.showInfoCards && (
        <section className="py-20 px-6">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Card 1 */}
              <div className="festival-card p-8 text-center">
                <div className="text-4xl mb-4">🎵</div>
                <h3 className="festival-subtitle text-xl font-semibold mb-4 text-verde-suave">
                  Evento Multicultural
                </h3>
                <p className="festival-text text-cinza-chumbo">
                  Participe de um evento multicultural, com música, dança e
                  cultura.
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
      )}

      {/* Seção de Eventos - apenas se habilitado */}
      {settings.showNextEvents && <EventsSection />}

      {/* Seção de Apoiadores com Marquee Elegante - apenas se habilitado */}
      {settings.showSupporters && (
        <section
          id="partners"
          className="py-16 px-6 bg-gradient-to-r from-bege-claro/30 to-verde-suave/5"
        >
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
      )}

      <Footer />
    </div>
  );
}
