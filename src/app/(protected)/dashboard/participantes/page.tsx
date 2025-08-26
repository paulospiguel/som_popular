"use client";

import { DataTable } from "@/components/DataTable";
import Loading from "@/components/loading";
import { Participant } from "@/database/schema";
import { useSession } from "@/lib/auth-client";
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
import { useState } from "react";
import AddParticipantModal from "./components/add-new";
import ParticipantDetailsModal from "./components/participant-detail";
import {
  getCategoryText,
  getExperienceText,
  getStatusColor,
  getStatusText,
} from "./utils";

// Mock data atualizado sem age, city, district e com additionalInfo
const mockParticipants = [
  {
    id: "1",
    name: "João Silva",
    email: "joao.silva@email.com",
    phone: "+351 912 345 678",
    category: "fado",
    experience: "intermedio",
    additionalInfo:
      "Canto fado há 5 anos, participei em vários eventos locais.",
    status: "approved", // Alterado de 'pending' para 'approved' (auto-aprovação)
    archived: false,
    acceptsEmailNotifications: true,
    registrationDate: new Date("2024-01-15"),
    notes: "",
  },
  {
    id: "2",
    name: "Maria Santos",
    email: "maria.santos@email.com",
    phone: "+351 913 456 789",
    category: "guitarra",
    experience: "avancado",
    additionalInfo: "Guitarrista profissional com 15 anos de experiência.",
    status: "approved",
    archived: false,
    acceptsEmailNotifications: false,
    registrationDate: new Date("2024-01-10"),
    notes: "Excelente candidata, muito experiente.",
  },
  {
    id: "3",
    name: "António Costa",
    email: "antonio.costa@email.com",
    phone: "+351 914 567 890",
    category: "concertina",
    experience: "avancado",
    additionalInfo: "Toco concertina desde criança, ensino música tradicional.",
    status: "approved",
    archived: false,
    registrationDate: new Date("2024-01-08"),
    notes: "",
  },
  {
    id: "4",
    name: "Ana Ferreira",
    email: "ana.ferreira@email.com",
    phone: "+351 915 678 901",
    category: "fado",
    experience: "iniciante",
    additionalInfo: "Sempre gostei de cantar, quero começar no fado.",
    status: "rejected",
    archived: false,
    registrationDate: new Date("2024-01-12"),
    rejectionReason:
      "Necessita de mais experiência prática antes de participar no evento.",
    rejectedAt: new Date("2024-01-13"),
    rejectedBy: "admin@somopopular.pt",
    notes: "Precisa de mais experiência antes de participar.",
  },
  {
    id: "5",
    name: "Carlos Mendes",
    email: "carlos.mendes@email.com",
    phone: "+351 916 789 012",
    category: "cavaquinho",
    experience: "intermedio",
    additionalInfo: "Toco cavaquinho há 3 anos, gosto muito de música popular.",
    status: "approved",
    archived: false,
    acceptsEmailNotifications: true,
    registrationDate: new Date("2024-01-20"),
    notes: "",
  },
];

export default function ParticipantsManagement() {
  const { isPending } = useSession();
  const [participants, setParticipants] =
    useState<Partial<Participant>[]>(mockParticipants);
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
      render: (participant: any) => (
        <span className="text-sm text-cinza-chumbo">
          {participant.registrationDate.toLocaleDateString("pt-PT", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      ),
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

  const stats = {
    total: participants.length,
    active: activeParticipants.length,
    pending: activeParticipants.filter((p) => p.status === "pending").length,
    approved: activeParticipants.filter((p) => p.status === "approved").length,
    rejected: activeParticipants.filter((p) => p.status === "rejected").length,
    archived: participants.filter((p) => p.archived).length,
  };

  if (isPending) {
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

          <DataTable
            className="min-h-[calc(100vh-400px)]"
            data={activeParticipants}
            columns={columns}
            searchFields={["name", "email", "category"]} // Removido "city"
            searchPlaceholder="Pesquisar por nome, email ou categoria..."
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
