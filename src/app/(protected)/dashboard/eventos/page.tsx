"use client";

import { DataTable } from "@/components/DataTable";
import Loading from "@/components/loading";
import { useSession } from "@/lib/auth-client";
import { Event } from "@/server/database/schema";
import { getEvents } from "@/server/events";
import {
  ArrowLeft,
  Calendar,
  CalendarDays,
  Eye,
  MapPin,
  Plus,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import AddEventModal from "./components/add-new";
import EventDetailsModal from "./components/event-detail";
import {
  getCategoryText,
  getStatusColor,
  getStatusText,
  getTypeText,
} from "./utils";

export default function EventsPage() {
  const { data: session, isPending } = useSession();
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ProtectedProvider já faz a validação de permissões
    if (!isPending && session) {
      loadEvents();
    }
  }, [session, isPending]);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const result = await getEvents();
      if (result.success && result.data) {
        setEvents(result.data);
      }
    } catch (error) {
      console.error("Erro ao carregar eventos:", error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      key: "event",
      header: "Evento",
      render: (event: Event) => (
        <div>
          <div className="font-semibold text-cinza-chumbo">{event.name}</div>
          <div className="text-sm text-cinza-chumbo/70 flex items-center mt-1">
            <MapPin className="w-4 h-4 mr-1" />
            {event.location}
          </div>
          <div className="text-sm text-cinza-chumbo/70">
            {getCategoryText(event.category)} • {getTypeText(event.type)}
          </div>
        </div>
      ),
    },
    {
      key: "dates",
      header: "Data do Evento",
      render: (event: Event) => (
        <div>
          <div className="font-medium text-cinza-chumbo flex items-center">
            <CalendarDays className="w-4 h-4 mr-1" />
            {event.startDate.toLocaleDateString("pt-PT", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </div>
          <div className="text-sm text-cinza-chumbo/70">
            {event.startDate.toLocaleTimeString("pt-PT", {
              hour: "2-digit",
              minute: "2-digit",
            })}
            {event.endDate && (
              <>
                {" "}
                -{" "}
                {event.endDate.toLocaleTimeString("pt-PT", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "participants",
      header: "Participantes",
      render: (event: Event) => (
        <div className="text-center">
          <div className="font-semibold text-cinza-chumbo">
            {event.currentParticipants}
            {event.maxParticipants && `/${event.maxParticipants}`}
          </div>
          <div className="text-xs text-cinza-chumbo/70">
            {event.maxParticipants ? "inscritos" : "sem limite"}
          </div>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (event: Event) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
            event.status
          )}`}
        >
          {getStatusText(event.status)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Ações",
      className: "text-center",
      headerClassName: "text-center items-center",
      render: (event: Event) => (
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={() => {
              setSelectedEvent(event);
              setShowModal(true);
            }}
            className="p-2 text-cinza-chumbo hover:text-verde-suave hover:bg-verde-suave/10 rounded-lg transition-colors"
            title="Ver detalhes"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  const stats = {
    total: events.length,
    published: events.filter((e) => e.status === "published").length,
    draft: events.filter((e) => e.status === "draft").length,
    ongoing: events.filter((e) => e.status === "ongoing").length,
    completed: events.filter((e) => e.status === "completed").length,
  };

  if (isPending || loading) {
    return <Loading />;
  }

  return (
    <div className="bg-gradient-to-br from-bege-claro via-verde-muito-suave to-dourado-muito-claro flex flex-col">
      <header className="bg-white/90 backdrop-blur-sm border-b border-verde-suave/20 shadow-sm flex-shrink-0">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="flex items-center space-x-2 text-cinza-chumbo hover:text-verde-suave transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Voltar</span>
              </Link>
              <div className="h-6 w-px bg-cinza-chumbo/20"></div>
              <h1 className="festival-title text-xl flex items-center">
                <Calendar className="w-6 h-6 mr-2 text-verde-suave" />
                Gestão de Eventos
              </h1>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="bg-verde-suave hover:bg-verde-suave/90 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Novo Evento</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6">
        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="festival-card p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs text-cinza-chumbo/60 font-medium uppercase tracking-wide">
                  Total
                </p>
                <p className="text-lg font-bold text-cinza-chumbo">
                  {stats.total}
                </p>
              </div>
              <div className="p-2 bg-cinza-chumbo/10 rounded-lg">
                <Calendar className="w-5 h-5 text-cinza-chumbo" />
              </div>
            </div>
          </div>

          <div className="festival-card p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs text-cinza-chumbo/60 font-medium uppercase tracking-wide">
                  Publicados
                </p>
                <p className="text-lg font-bold text-verde-suave">
                  {stats.published}
                </p>
              </div>
              <div className="p-2 bg-verde-suave/10 rounded-lg">
                <Users className="w-5 h-5 text-verde-suave" />
              </div>
            </div>
          </div>

          <div className="festival-card p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs text-cinza-chumbo/60 font-medium uppercase tracking-wide">
                  Rascunhos
                </p>
                <p className="text-lg font-bold text-gray-500">{stats.draft}</p>
              </div>
              <div className="p-2 bg-gray-100 rounded-lg">
                <Calendar className="w-5 h-5 text-gray-500" />
              </div>
            </div>
          </div>

          <div className="festival-card p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs text-cinza-chumbo/60 font-medium uppercase tracking-wide">
                  Em Curso
                </p>
                <p className="text-lg font-bold text-blue-600">
                  {stats.ongoing}
                </p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="festival-card p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs text-cinza-chumbo/60 font-medium uppercase tracking-wide">
                  Concluídos
                </p>
                <p className="text-lg font-bold text-dourado-claro">
                  {stats.completed}
                </p>
              </div>
              <div className="p-2 bg-dourado-claro/10 rounded-lg">
                <Calendar className="w-5 h-5 text-dourado-claro" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabela de Eventos */}
        <div className="festival-card">
          <DataTable
            data={events}
            columns={columns}
            searchPlaceholder="Pesquisar eventos..."
            emptyMessage="Nenhum evento encontrado"
            itemsPerPage={10}
          />
        </div>
      </main>

      {/* Modais */}
      <AddEventModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onEventAdded={() => {
          loadEvents(); // Recarregar eventos após adicionar
          setShowAddModal(false);
        }}
      />

      <EventDetailsModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedEvent(null);
        }}
        event={selectedEvent}
        onEventUpdated={() => {
          loadEvents(); // Recarregar eventos após atualizar
        }}
      />
    </div>
  );
}
