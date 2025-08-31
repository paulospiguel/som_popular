"use client";

import { Button } from "@/components/ui/button";
import { getPublicEvents, type PublicEvent } from "@/server/events-public";
import {
  ArrowLeft,
  Calendar,
  FileText,
  Home,
  Info,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function RegulationPage() {
  const [events, setEvents] = useState<PublicEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const result = await getPublicEvents();

        if (result.success && result.events) {
          setEvents(result.events);
        } else {
          setError(result.error || "Erro ao carregar eventos");
        }
      } catch (err) {
        setError("Erro ao carregar eventos");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-PT", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bege-claro via-verde-muito-suave to-dourado-muito-claro py-12">
        <div className="container mx-auto px-4">
          <div className="festival-card p-6 max-w-4xl mx-auto text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-verde-suave mx-auto mb-4"></div>
            <p className="text-cinza-chumbo">Carregando eventos...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bege-claro via-verde-muito-suave to-dourado-muito-claro py-12">
        <div className="container mx-auto px-4">
          <div className="festival-card p-6 max-w-4xl mx-auto text-center">
            <div className="text-red-500 mb-4">
              <Info className="w-16 h-16 mx-auto" />
            </div>
            <h1 className="text-2xl font-bold text-cinza-chumbo mb-4">
              Erro ao carregar eventos
            </h1>
            <p className="text-cinza-chumbo/70 mb-6">{error}</p>
            <Link href="/">
              <Button className="festival-button">
                <Home className="w-4 h-4 mr-2" />
                Voltar à Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
            <Info className="w-16 h-16 text-verde-suave mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-cinza-chumbo mb-2">
              Regulamentos dos Eventos
            </h1>
            <p className="text-cinza-chumbo/70">
              Festival Som Popular - Prefeitura Municipal do Centenário do Sul
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <div className="flex items-start space-x-3">
              <Info className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-blue-800 mb-2">
                  Como acessar os regulamentos
                </h3>
                <p className="text-blue-700 mb-4">
                  Cada evento do festival possui seu próprio regulamento
                  específico. Para visualizar o regulamento de um evento, você
                  deve:
                </p>
                <ol className="list-decimal list-inside text-blue-700 space-y-2">
                  <li>Navegar até a página do evento desejado</li>
                  <li>
                    Clicar no botão "Ver Regulamento" ou acessar diretamente a
                    URL do regulamento
                  </li>
                  <li>
                    O regulamento será exibido em um visualizador PDF integrado
                  </li>
                </ol>
              </div>
            </div>
          </div>

          {/* Lista de eventos disponíveis */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-cinza-chumbo mb-4">
              Eventos Disponíveis
            </h3>
            {events.length > 0 ? (
              <div className="grid gap-4">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="bg-white border border-cinza-chumbo/20 rounded-lg p-4"
                  >
                    <h4 className="font-semibold text-cinza-chumbo mb-2">
                      {event.name}
                    </h4>
                    <div className="flex items-center text-sm text-cinza-chumbo/70 mb-3 space-x-4">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>{formatDate(event.startDate)}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                    <p className="text-sm text-cinza-chumbo/70 mb-3">
                      Categoria: {event.category} | Tipo: {event.type}
                    </p>
                    <Link href={`/regulation/${event.id}`}>
                      <Button size="sm" className="festival-button">
                        <FileText className="w-4 h-4 mr-2" />
                        Ver Regulamento
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-16 h-16 text-cinza-chumbo/50 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-cinza-chumbo mb-2">
                  Nenhum evento disponível
                </h3>
                <p className="text-cinza-chumbo/70">
                  Novos eventos serão anunciados em breve
                </p>
              </div>
            )}
          </div>

          {/* Ações */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/#eventos" className="flex-1">
              <Button className="festival-button w-full">
                <FileText className="w-4 h-4 mr-2" />
                Ver Todos os Eventos
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
              Dúvidas sobre os Regulamentos?
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
                <p className="text-cinza-chumbo/70">(XX) XXXX-XXXX</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
