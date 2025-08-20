"use client";

import { DataTable } from "@/components/DataTable";
import { Loading } from "@/components/loading";
import {
  Modal,
  ModalButtons,
  ModalPrimaryButton,
  ModalSecondaryButton,
} from "@/components/Modal";
import { useSession } from "@/lib/auth-client";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Eye,
  FileText,
  Mail,
  MapPin,
  Phone,
  Plus,
  Printer,
  Send,
  User,
  UserCheck,
  Users,
  UserX,
  X,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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

type ParticipantStatus = "all" | "pending" | "approved" | "rejected";
type ParticipantCategory =
  | "all"
  | "fado"
  | "guitarra"
  | "concertina"
  | "outros";

export default function ParticipantsManagement() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [participants, setParticipants] = useState(mockParticipants);
  const [showModal, setShowModal] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<any>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [participantToReject, setParticipantToReject] = useState<any>(null);
  const [newParticipant, setNewParticipant] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    city: "",
    district: "",
    category: "fado",
    experience: "iniciante",
    biography: "",
    acceptsEmailNotifications: false,
  });

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "text-green-600 bg-green-50";
      case "rejected":
        return "text-red-600 bg-red-50";
      case "pending":
        return "text-yellow-600 bg-yellow-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved":
        return "Aprovado";
      case "rejected":
        return "Rejeitado";
      case "pending":
        return "Pendente";
      default:
        return status;
    }
  };

  const getCategoryText = (category: string) => {
    switch (category) {
      case "fado":
        return "Fado";
      case "guitarra":
        return "Guitarra";
      case "concertina":
        return "Concertina";
      default:
        return category;
    }
  };

  const getExperienceText = (experience: string) => {
    switch (experience) {
      case "iniciante":
        return "Iniciante";
      case "intermedio":
        return "Intermédio";
      case "avancado":
        return "Avançado";
      default:
        return experience;
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
          {participant.registrationDate.toLocaleDateString("pt-PT")}
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

          {/* Nova ação: Comprovante */}
          <button
            onClick={() => {
              setSelectedParticipant(participant);
              setShowReceiptModal(true);
            }}
            className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
            title="Ver comprovante"
          >
            <FileText className="w-4 h-4" />
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

  // Função para adicionar novo participante
  const handleAddParticipant = () => {
    const participant = {
      id: Date.now().toString(),
      ...newParticipant,
      age: parseInt(newParticipant.age),
      status: "pending",
      registrationDate: new Date(),
      notes: "",
    };

    setParticipants((prev) => [participant, ...prev]);
    setNewParticipant({
      name: "",
      email: "",
      phone: "",
      age: "",
      city: "",
      district: "",
      category: "fado",
      experience: "iniciante",
      biography: "",
      acceptsEmailNotifications: false,
    });
    setShowAddModal(false);
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
            itemsPerPage={15}
            searchFields={["name", "email", "city"]}
            emptyMessage="Nenhum participante encontrado com os filtros aplicados."
            emptyIcon={<User className="w-12 h-12 text-cinza-chumbo/30" />}
            className="flex-1"
            maxHeight="calc(100vh - 400px)"
          />
        </div>
      </main>

      {/* Modal de Adicionar Participante */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="festival-subtitle text-xl">
                  Adicionar Novo Participante
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddParticipant();
                }}
                className="space-y-6"
              >
                {/* Informações Pessoais */}
                <div>
                  <h4 className="font-semibold text-cinza-chumbo mb-4">
                    Informações Pessoais
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-cinza-chumbo mb-2">
                        Nome Completo *
                      </label>
                      <input
                        type="text"
                        required
                        value={newParticipant.name}
                        onChange={(e) =>
                          setNewParticipant((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-verde-suave focus:border-transparent transition-colors"
                        placeholder="Digite o nome completo"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-cinza-chumbo mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={newParticipant.email}
                        onChange={(e) =>
                          setNewParticipant((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-verde-suave focus:border-transparent transition-colors"
                        placeholder="exemplo@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-cinza-chumbo mb-2">
                        Telefone
                      </label>
                      <input
                        type="tel"
                        value={newParticipant.phone}
                        onChange={(e) =>
                          setNewParticipant((prev) => ({
                            ...prev,
                            phone: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-verde-suave focus:border-transparent transition-colors"
                        placeholder="+351 912 345 678"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-cinza-chumbo mb-2">
                        Idade *
                      </label>
                      <input
                        type="number"
                        required
                        min="16"
                        max="99"
                        value={newParticipant.age}
                        onChange={(e) =>
                          setNewParticipant((prev) => ({
                            ...prev,
                            age: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-verde-suave focus:border-transparent transition-colors"
                        placeholder="25"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-cinza-chumbo mb-2">
                        Cidade *
                      </label>
                      <input
                        type="text"
                        required
                        value={newParticipant.city}
                        onChange={(e) =>
                          setNewParticipant((prev) => ({
                            ...prev,
                            city: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-verde-suave focus:border-transparent transition-colors"
                        placeholder="Lisboa"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-cinza-chumbo mb-2">
                        Distrito *
                      </label>
                      <input
                        type="text"
                        required
                        value={newParticipant.district}
                        onChange={(e) =>
                          setNewParticipant((prev) => ({
                            ...prev,
                            district: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-verde-suave focus:border-transparent transition-colors"
                        placeholder="Lisboa"
                      />
                    </div>
                  </div>
                </div>

                {/* Informações Artísticas */}
                <div>
                  <h4 className="font-semibold text-cinza-chumbo mb-4">
                    Informações Artísticas
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-cinza-chumbo mb-2">
                        Categoria *
                      </label>
                      <select
                        required
                        value={newParticipant.category}
                        onChange={(e) =>
                          setNewParticipant((prev) => ({
                            ...prev,
                            category: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-verde-suave focus:border-transparent transition-colors"
                      >
                        <option value="fado">Fado</option>
                        <option value="guitarra">Guitarra</option>
                        <option value="concertina">Concertina</option>
                        <option value="outros">Outros</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-cinza-chumbo mb-2">
                        Nível de Experiência *
                      </label>
                      <select
                        required
                        value={newParticipant.experience}
                        onChange={(e) =>
                          setNewParticipant((prev) => ({
                            ...prev,
                            experience: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-verde-suave focus:border-transparent transition-colors"
                      >
                        <option value="iniciante">Iniciante</option>
                        <option value="intermedio">Intermédio</option>
                        <option value="avancado">Avançado</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-cinza-chumbo mb-2">
                      Biografia
                    </label>
                    <textarea
                      rows={4}
                      value={newParticipant.biography}
                      onChange={(e) =>
                        setNewParticipant((prev) => ({
                          ...prev,
                          biography: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-verde-suave focus:border-transparent transition-colors resize-none"
                      placeholder="Conte-nos um pouco sobre a sua experiência musical..."
                    />
                  </div>
                </div>

                {/* Botões */}
                <div className="flex gap-4 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 bg-gray-100 text-cinza-chumbo py-3 px-4 rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-verde-suave text-white py-3 px-4 rounded-xl hover:bg-verde-suave/90 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Adicionar Participante</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Detalhes do Participante */}
      {showModal && selectedParticipant && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="festival-subtitle text-xl">
                  Detalhes do Participante
                </h3>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedParticipant(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-8">
                {/* Dados da Inscrição */}
                <div>
                  <h3 className="font-bold text-cinza-chumbo mb-4 text-lg">
                    Dados da Inscrição
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-cinza-chumbo/70 font-medium">
                        Número de Inscrição
                      </label>
                      <p className="font-bold text-verde-suave text-lg">
                        #{selectedParticipant.id.toUpperCase()}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-cinza-chumbo/70 font-medium">
                        Data de Inscrição
                      </label>
                      <p className="font-semibold">
                        {selectedParticipant.registrationDate.toLocaleDateString(
                          "pt-PT",
                          {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-cinza-chumbo/70 font-medium">
                        Status
                      </label>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          selectedParticipant.status === "approved"
                            ? "text-green-600 bg-green-50"
                            : selectedParticipant.status === "rejected"
                              ? "text-red-600 bg-red-50"
                              : "text-yellow-600 bg-yellow-50"
                        }`}
                      >
                        {getStatusText(selectedParticipant.status)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Dados do Participante */}
                <div>
                  <h3 className="font-bold text-cinza-chumbo mb-4 text-lg">
                    Dados do Participante
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-cinza-chumbo/70 font-medium">
                          Nome Completo
                        </label>
                        <p className="font-semibold text-lg">
                          {selectedParticipant.name}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm text-cinza-chumbo/70 font-medium">
                          Email
                        </label>
                        <p className="font-medium">
                          {selectedParticipant.email}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm text-cinza-chumbo/70 font-medium">
                          Telefone
                        </label>
                        <p className="font-medium">
                          {selectedParticipant.phone || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-cinza-chumbo/70 font-medium">
                          Idade
                        </label>
                        <p className="font-semibold">
                          {selectedParticipant.age} anos
                        </p>
                      </div>
                      <div>
                        <label className="text-sm text-cinza-chumbo/70 font-medium">
                          Localização
                        </label>
                        <p className="font-medium">
                          {selectedParticipant.city},{" "}
                          {selectedParticipant.district}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dados Artísticos */}
                <div>
                  <h3 className="font-bold text-cinza-chumbo mb-4 text-lg">
                    Informações Artísticas
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm text-cinza-chumbo/70 font-medium">
                        Categoria
                      </label>
                      <p className="font-semibold text-lg">
                        {getCategoryText(selectedParticipant.category)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-cinza-chumbo/70 font-medium">
                        Nível de Experiência
                      </label>
                      <p className="font-semibold">
                        {getExperienceText(selectedParticipant.experience)}
                      </p>
                    </div>
                  </div>
                  {selectedParticipant.biography && (
                    <div className="mt-4">
                      <label className="text-sm text-cinza-chumbo/70 font-medium">
                        Biografia
                      </label>
                      <p className="font-medium mt-2 text-justify">
                        {selectedParticipant.biography}
                      </p>
                    </div>
                  )}
                </div>

                {/* Notas (se existirem) */}
                {selectedParticipant.notes && (
                  <div>
                    <h3 className="font-bold text-cinza-chumbo mb-4 text-lg">
                      Notas
                    </h3>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-cinza-chumbo">
                        {selectedParticipant.notes}
                      </p>
                    </div>
                  </div>
                )}

                {/* Ações para participantes pendentes */}
                {selectedParticipant.status === "pending" && (
                  <div className="flex justify-end space-x-4 pt-6 border-t">
                    <button
                      onClick={() => {
                        handleReject(selectedParticipant.id);
                        setShowModal(false);
                        setSelectedParticipant(null);
                      }}
                      className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors flex items-center space-x-2"
                    >
                      <UserX className="w-5 h-5" />
                      <span>Rejeitar</span>
                    </button>
                    <button
                      onClick={() => {
                        handleApprove(selectedParticipant.id);
                        setShowModal(false);
                        setSelectedParticipant(null);
                      }}
                      className="px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors flex items-center space-x-2"
                    >
                      <UserCheck className="w-5 h-5" />
                      <span>Aprovar</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
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

      {/* Modal de Comprovante de Inscrição */}
      {showReceiptModal && selectedParticipant && (
        <Modal
          isOpen={showReceiptModal}
          onClose={() => {
            setShowReceiptModal(false);
            setSelectedParticipant(null);
          }}
          title="Comprovante de Inscrição"
          subtitle={selectedParticipant.name}
          icon={<FileText className="w-6 h-6 text-verde-suave" />}
          size="large"
        >
          <div className="p-8 print:p-12">
            {/* Informações do Comprovante */}
            <div className="space-y-8">
              {/* Dados da Inscrição */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-bold text-cinza-chumbo mb-4 text-lg">
                  Dados da Inscrição
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-cinza-chumbo/70 font-medium">
                      Número de Inscrição
                    </label>
                    <p className="font-bold text-verde-suave text-lg">
                      #{selectedParticipant.id.toUpperCase()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-cinza-chumbo/70 font-medium">
                      Data de Inscrição
                    </label>
                    <p className="font-semibold">
                      {selectedParticipant.registrationDate.toLocaleDateString(
                        "pt-PT",
                        {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-cinza-chumbo/70 font-medium">
                      Status
                    </label>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        selectedParticipant.status === "approved"
                          ? "text-green-600 bg-green-50"
                          : selectedParticipant.status === "rejected"
                            ? "text-red-600 bg-red-50"
                            : "text-yellow-600 bg-yellow-50"
                      }`}
                    >
                      {selectedParticipant.status === "approved"
                        ? "Aprovado"
                        : selectedParticipant.status === "rejected"
                          ? "Rejeitado"
                          : "Pendente"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Dados do Participante */}
              <div>
                <h3 className="font-bold text-cinza-chumbo mb-4 text-lg">
                  Dados do Participante
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-cinza-chumbo/70 font-medium">
                        Nome Completo
                      </label>
                      <p className="font-semibold text-lg">
                        {selectedParticipant.name}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-cinza-chumbo/70 font-medium">
                        Email
                      </label>
                      <p className="font-medium">{selectedParticipant.email}</p>
                    </div>
                    <div>
                      <label className="text-sm text-cinza-chumbo/70 font-medium">
                        Telefone
                      </label>
                      <p className="font-medium">
                        {selectedParticipant.phone || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-cinza-chumbo/70 font-medium">
                        Idade
                      </label>
                      <p className="font-semibold">
                        {selectedParticipant.age} anos
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-cinza-chumbo/70 font-medium">
                        Localização
                      </label>
                      <p className="font-medium">
                        {selectedParticipant.city},{" "}
                        {selectedParticipant.district}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dados Artísticos */}
              <div>
                <h3 className="font-bold text-cinza-chumbo mb-4 text-lg">
                  Informações Artísticas
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm text-cinza-chumbo/70 font-medium">
                      Categoria
                    </label>
                    <p className="font-semibold text-lg">
                      {getCategoryText(selectedParticipant.category)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-cinza-chumbo/70 font-medium">
                      Nível de Experiência
                    </label>
                    <p className="font-semibold">
                      {getExperienceText(selectedParticipant.experience)}
                    </p>
                  </div>
                </div>
                {selectedParticipant.biography && (
                  <div className="mt-4">
                    <label className="text-sm text-cinza-chumbo/70 font-medium">
                      Biografia
                    </label>
                    <p className="font-medium mt-2 text-justify">
                      {selectedParticipant.biography}
                    </p>
                  </div>
                )}
              </div>

              {/* Informações do Festival */}
              <div className="bg-verde-suave/10 rounded-xl p-6 border border-verde-suave/20">
                <h3 className="font-bold text-cinza-chumbo mb-4 text-lg">
                  Informações do Festival
                </h3>
                <div className="space-y-2">
                  <p>
                    <strong>Evento:</strong> Som Popular - Festival Centenário
                  </p>
                  <p>
                    <strong>Organização:</strong> Câmara Municipal
                  </p>
                  <p>
                    <strong>Local:</strong> A definir
                  </p>
                  <p>
                    <strong>Data:</strong> A definir
                  </p>
                </div>
              </div>

              {/* Notificações por Email */}
              {selectedParticipant.acceptsEmailNotifications !== undefined && (
                <div className="text-sm text-cinza-chumbo/70 bg-gray-50 rounded-lg p-4">
                  <p>
                    <strong>Notificações por Email:</strong>{" "}
                    {selectedParticipant.acceptsEmailNotifications ? (
                      <span className="text-green-600 font-medium">
                        ✓ Aceita receber notificações
                      </span>
                    ) : (
                      <span className="text-red-600 font-medium">
                        ✗ Não aceita notificações
                      </span>
                    )}
                  </p>
                </div>
              )}
            </div>

            {/* Ações do Comprovante */}
            <div className="flex gap-4 mt-8 pt-6 border-t print:hidden">
              <button
                onClick={handlePrintReceipt}
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Printer className="w-5 h-5" />
                <span>Imprimir</span>
              </button>

              {selectedParticipant.acceptsEmailNotifications && (
                <button
                  onClick={() => handleEmailReceipt(selectedParticipant)}
                  className="flex-1 bg-verde-suave text-white py-3 px-4 rounded-xl hover:bg-verde-suave/90 transition-colors flex items-center justify-center space-x-2"
                >
                  <Send className="w-5 h-5" />
                  <span>Enviar por Email</span>
                </button>
              )}

              <button
                onClick={() => setShowReceiptModal(false)}
                className="px-6 py-3 bg-gray-100 text-cinza-chumbo rounded-xl hover:bg-gray-200 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal de Adicionar Participante - Atualizado */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* ... existing form fields ... */}

              {/* Novo campo de notificações */}
              <div className="mt-6">
                <h4 className="font-semibold text-cinza-chumbo mb-4">
                  Preferências de Comunicação
                </h4>
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="emailNotifications"
                    checked={newParticipant.acceptsEmailNotifications}
                    onChange={(e) =>
                      setNewParticipant((prev) => ({
                        ...prev,
                        acceptsEmailNotifications: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 text-verde-suave bg-gray-100 border-gray-300 rounded focus:ring-verde-suave focus:ring-2"
                  />
                  <label
                    htmlFor="emailNotifications"
                    className="text-sm text-cinza-chumbo"
                  >
                    Aceito receber notificações por email sobre este evento e
                    futuros eventos
                  </label>
                </div>
                <p className="text-xs text-cinza-chumbo/60 mt-2">
                  Ao aceitar, receberá informações sobre o estado da sua
                  inscrição, detalhes do evento e convites para futuros
                  festivais.
                </p>
              </div>

              {/* ... existing form buttons ... */}
            </div>
          </div>
        </div>
      )}

      {/* ... existing modals ... */}
    </div>
  );
}

// Função para imprimir comprovante
const handlePrintReceipt = () => {
  // Adicionar estilos específicos para impressão
  const printStyles = `
    <style>
      @media print {
        body * {
          visibility: hidden;
        }
        .print-area, .print-area * {
          visibility: visible;
        }
        .print-area {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
        }
        .print-hidden {
          display: none !important;
        }
        .bg-gradient-to-br {
          background: white !important;
        }
      }
    </style>
  `;

  // Adicionar os estilos ao head temporariamente
  const styleElement = document.createElement("style");
  styleElement.innerHTML = printStyles;
  document.head.appendChild(styleElement);

  // Imprimir
  window.print();

  // Remover os estilos após a impressão
  setTimeout(() => {
    document.head.removeChild(styleElement);
  }, 1000);
};

// Função para enviar comprovante por email
const handleEmailReceipt = async (participant: any) => {
  if (!participant) return;

  try {
    // Mostrar loading (podes adicionar um estado de loading se quiseres)
    const loadingToast = document.createElement("div");
    loadingToast.className =
      "fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50";
    loadingToast.textContent = "A enviar comprovante...";
    document.body.appendChild(loadingToast);

    // Simular chamada à API (aqui implementarias a lógica real)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Aqui farias a chamada real à API
    // const response = await fetch('/api/send-receipt', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     participantId: participant.id,
    //     email: participant.email,
    //     participantData: participant
    //   })
    // });

    // Remover loading
    document.body.removeChild(loadingToast);

    // Mostrar sucesso
    const successToast = document.createElement("div");
    successToast.className =
      "fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50";
    successToast.textContent = `Comprovante enviado para ${participant.email} com sucesso!`;
    document.body.appendChild(successToast);

    // Remover toast de sucesso após 3 segundos
    setTimeout(() => {
      if (document.body.contains(successToast)) {
        document.body.removeChild(successToast);
      }
    }, 3000);
  } catch (error) {
    console.error("Erro ao enviar comprovante:", error);

    // Mostrar erro
    const errorToast = document.createElement("div");
    errorToast.className =
      "fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50";
    errorToast.textContent = "Erro ao enviar comprovante. Tenta novamente.";
    document.body.appendChild(errorToast);

    setTimeout(() => {
      if (document.body.contains(errorToast)) {
        document.body.removeChild(errorToast);
      }
    }, 3000);
  }
};
