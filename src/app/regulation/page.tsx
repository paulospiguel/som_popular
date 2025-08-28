"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, FileText, Home } from "lucide-react";
import Link from "next/link";

export default function RegulationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-bege-claro via-verde-muito-suave to-dourado-muito-claro py-12">
      <div className="container mx-auto px-4">
        <Link
          href="/"
          className="inline-flex items-center text-verde-suave hover:text-verde-escuro mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar à Home
        </Link>

        <div className="festival-card p-6 max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <FileText className="w-16 h-16 text-verde-suave mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-cinza-chumbo mb-2">
              Regulamento do Festival
            </h1>
            <p className="text-cinza-chumbo/70">
              Festival Som Popular - Prefeitura Municipal do Centenário do Sul
            </p>
          </div>

          {/* PDF Viewer */}
          <div className="bg-white border border-cinza-chumbo/20 rounded-lg overflow-hidden mb-6">
            <div className="bg-gray-50 p-4 border-b border-cinza-chumbo/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-verde-suave" />
                  <span className="font-medium text-cinza-chumbo">
                    regulamento-festival-som-popular.pdf
                  </span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    // Aqui você pode implementar o download do PDF
                    window.open("/docs/regulamento.pdf", "_blank");
                  }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Baixar PDF
                </Button>
              </div>
            </div>

            {/* PDF Embed */}
            <div className="relative" style={{ height: "800px" }}>
              <iframe
                src="/docs/regulamento.pdf"
                className="w-full h-full"
                title="Regulamento do Festival Som Popular"
                onError={() => {
                  // Fallback se o PDF não carregar
                  console.log("Erro ao carregar PDF");
                }}
              />

              {/* Fallback content se PDF não carregar */}
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50 text-center p-8">
                <div>
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-cinza-chumbo mb-2">
                    Visualizador de PDF
                  </h3>
                  <p className="text-cinza-chumbo/70 mb-4">
                    O regulamento será carregado aqui quando o arquivo PDF
                    estiver disponível.
                  </p>
                  <p className="text-sm text-cinza-chumbo/60 mb-6">
                    Por enquanto, você pode baixar o arquivo usando o botão
                    acima.
                  </p>

                  {/* Texto do regulamento como fallback */}
                  <div className="text-left max-w-2xl mx-auto space-y-4 text-sm">
                    <h4 className="font-bold text-verde-suave">
                      REGULAMENTO - FESTIVAL SOM POPULAR
                    </h4>

                    <div>
                      <h5 className="font-semibold mb-2">1. DO OBJETIVO</h5>
                      <p className="text-cinza-chumbo/80">
                        O Festival Som Popular tem como objetivo promover e
                        valorizar a música popular brasileira, oferecendo
                        oportunidades para artistas locais e regionais
                        demonstrarem seus talentos.
                      </p>
                    </div>

                    <div>
                      <h5 className="font-semibold mb-2">2. DA PARTICIPAÇÃO</h5>
                      <p className="text-cinza-chumbo/80">
                        Podem participar do festival artistas maiores de 16
                        anos, nas categorias: Vocal, Instrumental, Composição e
                        Grupo/Banda.
                      </p>
                    </div>

                    <div>
                      <h5 className="font-semibold mb-2">3. DAS INSCRIÇÕES</h5>
                      <p className="text-cinza-chumbo/80">
                        As inscrições são gratuitas e devem ser realizadas
                        através do site oficial do festival. É necessário o
                        preenchimento completo dos dados solicitados.
                      </p>
                    </div>

                    <div>
                      <h5 className="font-semibold mb-2">4. DAS FASES</h5>
                      <p className="text-cinza-chumbo/80">
                        O festival será realizado em três fases:
                        Classificatórias, Semi-finais e Final. Cada fase terá
                        critérios específicos de avaliação.
                      </p>
                    </div>

                    <div>
                      <h5 className="font-semibold mb-2">5. DA AVALIAÇÃO</h5>
                      <p className="text-cinza-chumbo/80">
                        A avaliação será realizada por uma comissão julgadora
                        composta por profissionais da área musical, considerando
                        critérios técnicos e artísticos.
                      </p>
                    </div>

                    <div>
                      <h5 className="font-semibold mb-2">6. DOS PRÊMIOS</h5>
                      <p className="text-cinza-chumbo/80">
                        Serão premiados os três primeiros colocados de cada
                        categoria, além de prêmios especiais para melhor
                        interpretação, melhor composição e escolha do público.
                      </p>
                    </div>

                    <div>
                      <h5 className="font-semibold mb-2">
                        7. DAS DISPOSIÇÕES GERAIS
                      </h5>
                      <p className="text-cinza-chumbo/80">
                        A participação no festival implica na aceitação integral
                        deste regulamento. A organização se reserva o direito de
                        alterar datas e horários se necessário.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ações */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/participant-registration" className="flex-1">
              <Button className="festival-button w-full">
                <FileText className="w-4 h-4 mr-2" />
                Aceitar e Registrar-se
              </Button>
            </Link>

            <Link href="/" className="flex-1">
              <Button variant="outline" className="w-full">
                <Home className="w-4 h-4 mr-2" />
                Voltar à Home
              </Button>
            </Link>
          </div>

          {/* Informações de Contato */}
          <div className="mt-8 pt-6 border-t border-cinza-chumbo/20">
            <h3 className="text-lg font-semibold text-cinza-chumbo mb-4">
              Dúvidas sobre o Regulamento?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-cinza-chumbo mb-1">
                  Secretaria de Cultura
                </h4>
                <p className="text-cinza-chumbo/70">
                  cultura@centenariodosul.com.br
                </p>
              </div>
              <div>
                <h4 className="font-medium text-cinza-chumbo mb-1">Telefone</h4>
                <p className="text-cinza-chumbo/70">(XX) XXXX-XXXX0</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
