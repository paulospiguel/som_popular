"use client";

import {
  ArrowLeft,
  Eye,
  Mail,
  Phone,
  Plus,
  User,
  UserCheck,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { DataTable } from "@/components/DataTable";
import Loading from "@/components/loading";
import { useSession } from "@/lib/auth-client";
import { Participant } from "@/server/database/schema";
import { getAllParticipants } from "@/server/participants";

import AddParticipantModal from "./components/add-new";
import ParticipantDetailsModal from "./components/participant-detail";
import {
  getCategoryText,
  getExperienceText,
  getStatusColor,
  getStatusText,
} from "./utils";

export default function ParticipantsManagement() {
  const searchParams = useSearchParams();
  const { isPending } = useSession();
  const [participants, setParticipants] = useState<Partial<Participant>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<any>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // ProtectedProvider já faz a validação de permissões

  const handleArchiveParticipant = (id: string) => {
    setParticipants((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, archived: true, updatedAt: new Date() } : p
      )
    );
  };

  const columns = [
    {
      key: "participant",
      header: "Participante",
      render: (participant: any) => (
        <div>
          <div className="font-semibold text-cinza-chumbo">
            {participant.name}
          </div>
          <div className="text-sm text-cinza-chumbo/70 flex items-center">
            <Mail className="w-4 h-4 mr-1" />
            {participant.email}
          </div>
          {participant.phone && (
            <div className="text-sm text-cinza-chumbo/70 flex items-center">
              <Phone className="w-4 h-4 mr-1" />
              {participant.phone}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "category",
      header: "Categoria",
      render: (participant: any) => (
        <div>
          <div className="font-medium text-cinza-chumbo">
            {getCategoryText(participant.category)}
          </div>
          <div className="text-sm text-cinza-chumbo/70">
            {getExperienceText(participant.experience)}
          </div>
        </div>
      ),
    },
    {
      key: "registrationDate",
      header: "Data de Registro",
      render: (participant: any) => {
        const dateValue = participant.registrationDate
          ? new Date(participant.registrationDate)
          : null;
        return (
          <span className="text-sm text-cinza-chumbo">
            {dateValue
              ? dateValue.toLocaleDateString("pt-PT", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "-"}
          </span>
        );
      },
    },
    {
      key: "status",
      header: "Status",
      render: (participant: any) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
            participant.status
          )}`}
        >
          {getStatusText(participant.status)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Ações",
      className: "text-center",
      headerClassName: "text-center items-center",
      render: (participant: Partial<Participant>) => (
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={() => {
              setSelectedParticipant(participant);
              setShowModal(true);
            }}
            className="p-2 text-cinza-chumbo hover:text-verde-suave hover:bg-verde-suave/10 rounded-lg transition-colors"
            title="Ver detalhes"
          >
            <Eye className="w-4 h-4" />
          </button>
          {/* 
          {["approved", "rejected"].includes(participant.status!) && (
            <button
              onClick={() => handleArchiveParticipant(participant?.id!)}
              disabled={participant.archived}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Arquivar participante"
            >
              <Archive className="w-4 h-4 text-gray-500 group-hover:text-orange-600" />
            </button>
          )} */}
        </div>
      ),
    },
  ];

  const activeParticipants = participants.filter((p) => !p.archived);

  const loadParticipants = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getAllParticipants();
      if (result.success && result.data) {
        setParticipants(result.data as Partial<Participant>[]);
      } else {
        setError(result.error || "Erro ao carregar participantes");
      }
    } catch (err) {
      console.error("Erro ao carregar participantes:", err);
      setError("Erro ao carregar participantes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isPending) {
      loadParticipants();
    }
  }, [isPending]);

  // Abrir modal de adicionar se solicitado via querystring
  useEffect(() => {
    const open = searchParams.get("open");
    if (open === "add") {
      setShowAddModal(true);
    }
  }, [searchParams]);

  const stats = {
    total: participants.length,
    active: activeParticipants.length,
    pending: activeParticipants.filter((p) => p.status === "pending").length,
    approved: activeParticipants.filter((p) => p.status === "approved").length,
    rejected: activeParticipants.filter((p) => p.status === "rejected").length,
    archived: participants.filter((p) => p.archived).length,
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
                <User className="w-6 h-6 mr-2 text-verde-suave" />
                Gestão de Participantes
              </h1>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-verde-suave text-white px-4 py-2 rounded-xl hover:bg-verde-suave/90 transition-colors flex items-center space-x-2 shadow-lg"
            >
              <Plus className="w-5 h-5" />
              <span>Adicionar Participante</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden flex flex-col">
        <div className="container mx-auto px-4 py-8 flex-1 flex flex-col">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 flex-shrink-0">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-cinza-chumbo/10 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-cinza-chumbo/60 font-medium uppercase tracking-wide">
                    Total
                  </p>
                  <p className="text-2xl font-bold text-cinza-chumbo">
                    {stats.total}
                  </p>
                </div>
                <div className="p-2 bg-cinza-chumbo/5 rounded-lg">
                  <Users className="w-5 h-5 text-cinza-chumbo" />
                </div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-verde-suave/20 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs text-cinza-chumbo/60 font-medium uppercase tracking-wide">
                    Participantes
                  </p>
                  <p className="text-lg font-bold text-cinza-chumbo">
                    {stats.active + stats.archived}
                  </p>
                </div>
                <div className="p-2 bg-verde-suave/10 rounded-lg">
                  <UserCheck className="w-5 h-5 text-verde-suave" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-verde-suave"></div>
                    <span className="text-cinza-chumbo/70">Ativos</span>
                  </div>
                  <span className="font-medium text-verde-suave">
                    {stats.active}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                    <span className="text-cinza-chumbo/70">Arquivados</span>
                  </div>
                  <span className="font-medium text-gray-500">
                    {stats.archived}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-cinza-chumbo/10 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs text-cinza-chumbo/60 font-medium uppercase tracking-wide">
                    Status
                  </p>
                  <p className="text-lg font-bold text-cinza-chumbo">
                    {stats.pending + stats.approved + stats.rejected}
                  </p>
                </div>
                <div className="p-2 bg-cinza-chumbo/5 rounded-lg">
                  <User className="w-5 h-5 text-cinza-chumbo" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    <span className="text-cinza-chumbo/70">Pendentes</span>
                  </div>
                  <span className="font-medium text-yellow-600">
                    {stats.pending}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-cinza-chumbo/70">Aprovados</span>
                  </div>
                  <span className="font-medium text-green-600">
                    {stats.approved}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <span className="text-cinza-chumbo/70">Rejeitados</span>
                  </div>
                  <span className="font-medium text-red-600">
                    {stats.rejected}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="festival-card p-4 mb-6 border-l-4 border-vermelho-suave bg-vermelho-suave/5">
              <p className="text-sm text-cinza-chumbo">{error}</p>
            </div>
          )}

          <DataTable
            className="min-h-[calc(100vh-400px)]"
            data={activeParticipants}
            columns={columns}
            searchFields={["id", "name", "email", "category"]}
            searchPlaceholder="Pesquisar por nº de inscrição, nome, email ou categoria..."
            emptyMessage="Nenhum participante encontrado."
            emptyIcon={<Users className="w-12 h-12 text-cinza-chumbo/30" />}
            onArchive={handleArchiveParticipant}
            orderBy={[
              { field: "registrationDate", direction: "desc" },
              { field: "name", direction: "asc" },
              { field: "status" },
            ]}
          />
        </div>
      </main>

      {/* Modal de Adicionar Participante */}
      {showAddModal && (
        <AddParticipantModal
          setParticipant={(participant: Participant) => {
            setParticipants([...participants, participant]);
          }}
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {/* Modal de Detalhes do Participante */}
      {showModal && selectedParticipant && (
        <ParticipantDetailsModal
          participant={selectedParticipant}
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedParticipant(null);
          }}
        />
      )}
    </div>
  );
}
