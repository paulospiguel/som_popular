"use client";

import { DataTable } from "@/components/DataTable";
import { Loading } from "@/components/loading";
import {
  Modal,
  ModalButtons,
  ModalPrimaryButton,
  ModalSecondaryButton,
} from "@/components/Modal";
import { Participant } from "@/db/schema";
import { useSession } from "@/lib/auth-client";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Eye,
  Mail,
  MapPin,
  Phone,
  Plus,
  User,
  UserCheck,
  Users,
  UserX,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AddParticipantModal from "./components/add-new";
import ParticipantDetailsModal from "./components/participant-detail";
import {
  getCategoryText,
  getExperienceText,
  getStatusColor,
  getStatusText,
} from "./utils";

// Mock data atualizado com campo de notificações
const mockParticipants = [
  {
    id: "1",
    name: "João Silva",
    email: "joao.silva@email.com",
    phone: "+351 912 345 678",
    age: 28,
    city: "Lisboa",
    district: "Lisboa",
    category: "fado",
    experience: "intermedio",
    biography: "Canto fado há 5 anos, participei em vários eventos locais.",
    status: "pending",
    acceptsEmailNotifications: true,
    registrationDate: new Date("2024-01-15"),
    notes: "",
  },
  {
    id: "2",
    name: "Maria Santos",
    email: "maria.santos@email.com",
    phone: "+351 913 456 789",
    age: 35,
    city: "Porto",
    district: "Porto",
    category: "guitarra",
    experience: "avancado",
    biography: "Guitarrista profissional com 15 anos de experiência.",
    status: "approved",
    acceptsEmailNotifications: false,
    registrationDate: new Date("2024-01-10"),
    notes: "Excelente candidata, muito experiente.",
  },
  {
    id: "3",
    name: "António Costa",
    email: "antonio.costa@email.com",
    phone: "+351 914 567 890",
    age: 42,
    city: "Coimbra",
    district: "Coimbra",
    category: "concertina",
    experience: "avancado",
    biography: "Toco concertina desde criança, ensino música tradicional.",
    status: "approved",
    registrationDate: new Date("2024-01-08"),
    notes: "",
  },
  {
    id: "4",
    name: "Ana Ferreira",
    email: "ana.ferreira@email.com",
    phone: "+351 915 678 901",
    age: 22,
    city: "Braga",
    district: "Braga",
    category: "fado",
    experience: "iniciante",
    biography: "Sempre gostei de cantar, quero começar no fado.",
    status: "rejected",
    registrationDate: new Date("2024-01-12"),
    notes: "Precisa de mais experiência antes de participar.",
  },
  {
    id: "1",
    name: "João Silva",
    email: "joao.silva@email.com",
    phone: "+351 912 345 678",
    age: 28,
    city: "Lisboa",
    district: "Lisboa",
    category: "fado",
    experience: "intermedio",
    biography: "Canto fado há 5 anos, participei em vários eventos locais.",
    status: "pending",
    registrationDate: new Date("2024-01-15"),
    notes: "",
  },
  {
    id: "2",
    name: "Maria Santos",
    email: "maria.santos@email.com",
    phone: "+351 913 456 789",
    age: 35,
    city: "Porto",
    district: "Porto",
    category: "guitarra",
    experience: "avancado",
    biography: "Guitarrista profissional com 15 anos de experiência.",
    status: "approved",
    registrationDate: new Date("2024-01-10"),
    notes: "Excelente candidata, muito experiente.",
  },
  {
    id: "3",
    name: "António Costa",
    email: "antonio.costa@email.com",
    phone: "+351 914 567 890",
    age: 42,
    city: "Coimbra",
    district: "Coimbra",
    category: "concertina",
    experience: "avancado",
    biography: "Toco concertina desde criança, ensino música tradicional.",
    status: "approved",
    registrationDate: new Date("2024-01-08"),
    notes: "",
  },
  {
    id: "4",
    name: "Ana Ferreira",
    email: "ana.ferreira@email.com",
    phone: "+351 915 678 901",
    age: 22,
    city: "Braga",
    district: "Braga",
    category: "fado",
    experience: "iniciante",
    biography: "Sempre gostei de cantar, quero começar no fado.",
    status: "rejected",
    registrationDate: new Date("2024-01-12"),
    notes: "Precisa de mais experiência antes de participar.",
  },
];

export default function ParticipantsManagement() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [participants, setParticipants] =
    useState<Partial<Participant>[]>(mockParticipants);
  const [showModal, setShowModal] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<any>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [participantToReject, setParticipantToReject] = useState<any>(null);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  const handleApprove = (participantId: string) => {
    setParticipants((prev) =>
      prev.map((p) =>
        p.id === participantId ? { ...p, status: "approved" } : p
      )
    );
  };

  const handleReject = (participantId: string) => {
    const participant = participants.find((p) => p.id === participantId);
    setParticipantToReject(participant);
    setShowRejectModal(true);
  };

  const handleConfirmReject = () => {
    if (participantToReject && rejectionReason.trim()) {
      setParticipants((prev) =>
        prev.map((p) =>
          p.id === participantToReject.id
            ? { ...p, status: "rejected", notes: rejectionReason }
            : p
        )
      );

      setShowRejectModal(false);
      setRejectionReason("");
      setParticipantToReject(null);
    }
  };

  // Definir colunas da tabela
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
      key: "location",
      header: "Localização",
      render: (participant: any) => (
        <div className="flex items-center text-cinza-chumbo">
          <MapPin className="w-4 h-4 mr-1" />
          <span>
            {participant.city}, {participant.district}
          </span>
        </div>
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
      key: "registrationDate",
      header: "Data",
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
      key: "actions",
      header: "Ações",
      className: "text-center",
      headerClassName: "text-center",
      render: (participant: any) => (
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

          {participant.status === "pending" && (
            <>
              <button
                onClick={() => handleApprove(participant.id)}
                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                title="Aprovar"
              >
                <UserCheck className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleReject(participant.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Rejeitar"
              >
                <UserX className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  // Calcular estatísticas
  const stats = {
    total: participants.length,
    pending: participants.filter((p) => p.status === "pending").length,
    approved: participants.filter((p) => p.status === "approved").length,
    rejected: participants.filter((p) => p.status === "rejected").length,
  };

  if (isPending) {
    return <Loading isLoading={isPending} />;
  }

  return (
    <div className="h-screen bg-gradient-to-br from-bege-claro via-verde-muito-suave to-dourado-muito-claro flex flex-col">
      {/* Header */}
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

      {/* Conteúdo Principal */}
      <main className="flex-1 overflow-hidden flex flex-col">
        <div className="container mx-auto px-4 py-8 flex-1 flex flex-col">
          {/* Cards de Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 flex-shrink-0">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-verde-suave/20 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-cinza-chumbo/70 font-medium">
                    Total de Participantes
                  </p>
                  <p className="text-3xl font-bold text-cinza-chumbo mt-1">
                    {stats.total}
                  </p>
                </div>
                <div className="p-3 bg-verde-suave/10 rounded-xl">
                  <Users className="w-8 h-8 text-verde-suave" />
                </div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-yellow-200 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-cinza-chumbo/70 font-medium">
                    Pendentes
                  </p>
                  <p className="text-3xl font-bold text-yellow-600 mt-1">
                    {stats.pending}
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-xl">
                  <Clock className="w-8 h-8 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-green-200 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-cinza-chumbo/70 font-medium">
                    Aprovados
                  </p>
                  <p className="text-3xl font-bold text-green-600 mt-1">
                    {stats.approved}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-xl">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-red-200 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-cinza-chumbo/70 font-medium">
                    Rejeitados
                  </p>
                  <p className="text-3xl font-bold text-red-600 mt-1">
                    {stats.rejected}
                  </p>
                </div>
                <div className="p-3 bg-red-100 rounded-xl">
                  <XCircle className="w-8 h-8 text-red-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Tabela de Participantes com Componente Reutilizável */}
          <DataTable
            data={participants}
            columns={columns}
            searchFields={["name", "email", "city", "category"]}
            searchPlaceholder="Pesquisar por nome, email, cidade ou categoria..."
            emptyMessage="Nenhum participante encontrado."
            emptyIcon={<Users className="w-12 h-12 text-cinza-chumbo/30" />}
            orderBy={[
              { field: "registrationDate", direction: "desc" }, // Mudança aqui: desc para mais novo primeiro
              { field: "name", direction: "asc" },
              { field: "status" },
            ]}
          />
        </div>
      </main>

      {/* Modal de Adicionar Participante */}
      {showAddModal && (
        <AddParticipantModal
          setParticipant={(participant: any) => {
            setParticipants([...participants, participant]);
          }}
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {/* Modal de Detalhes do Participante */}
      {showModal && selectedParticipant && (
        <ParticipantDetailsModal
          handleApprove={handleApprove}
          handleReject={handleReject}
          participant={selectedParticipant}
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedParticipant(null);
          }}
        />
      )}

      {/* Modal de Rejeição - Agora usando o componente reutilizável */}
      <Modal
        isOpen={showRejectModal}
        onClose={() => {
          setShowRejectModal(false);
          setRejectionReason("");
          setParticipantToReject(null);
        }}
        title="Rejeitar Participante"
        subtitle={participantToReject?.name}
        icon={<UserX className="w-6 h-6 text-red-600" />}
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-cinza-chumbo mb-2">
              Motivo da rejeição *
            </label>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Descreva o motivo da rejeição..."
              className="w-full px-4 py-3 border border-cinza-chumbo/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-verde-suave/50 focus:border-verde-suave resize-none"
              rows={4}
              required
            />
            <p className="text-xs text-cinza-chumbo/60 mt-1">
              Este motivo será guardado nos registos do participante.
            </p>
          </div>
        </div>

        <ModalButtons>
          <ModalSecondaryButton
            onClick={() => {
              setShowRejectModal(false);
              setRejectionReason("");
              setParticipantToReject(null);
            }}
          >
            Cancelar
          </ModalSecondaryButton>
          <ModalPrimaryButton
            onClick={handleConfirmReject}
            disabled={!rejectionReason.trim()}
            variant="danger"
          >
            <UserX className="w-4 h-4" />
            <span>Rejeitar</span>
          </ModalPrimaryButton>
        </ModalButtons>
      </Modal>
    </div>
  );
}
