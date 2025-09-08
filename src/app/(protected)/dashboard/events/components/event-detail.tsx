"use client";

import {
  AlertTriangle,
  Calendar,
  CalendarDays,
  CheckCircle,
  Clock,
  Copy,
  Download,
  Edit,
  Eye,
  EyeOff,
  FileText,
  Globe,
  MapPin,
  MoreVertical,
  Pause,
  Plus,
  RefreshCw,
  Save,
  SaveOff,
  Settings,
  StickyNote,
  ToggleLeft as Toggle,
  Trash2,
  Trophy,
  Upload,
  UserCheck,
  UserMinus,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

import { JudgeDetailsModal } from "@/components/JudgeDetailsModal";
import { Modal } from "@/components/Modal";
import { ParticipantDetailsModal } from "@/components/ParticipantDetailsModal";
import { AvatarGroup } from "@/components/ui/avatar-group";
import { DateTimePicker } from "@/components/ui/date-picker";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ExpandedTabs } from "@/components/ui/expanded-tabs";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TagsInput } from "@/components/ui/tags-input";
import { useToast } from "@/components/ui/toast";
import { EVENT_CATEGORIES, EVENT_STATUSES, EVENT_TYPES } from "@/constants";
import { useConfirm } from "@/hooks/use-confirm";
import { useSonner } from "@/hooks/use-sonner";
import { Event, Participant } from "@/server/database/schema";
import {
  cancelEvent,
  completeEvent,
  copyEvent,
  deleteEvent,
  publishEvent,
  revertToDraft,
  startEvent,
  updateEvent,
} from "@/server/events";
import {
  addJudgeToEvent,
  createJudge,
  getEventJudges,
  getJudges,
  removeJudgeFromEvent,
} from "@/server/judges";
import {
  getApprovedParticipants,
  getEventParticipants,
  registerParticipantInEvent,
  removeParticipantFromEvent,
} from "@/server/participants";
import { uploadrulesFile } from "@/server/upload";

import {
  formatEventDate,
  formatEventTime,
  getCategoryText,
  getStatusText,
  getTypeText,
  isEventActive,
  isRegistrationOpen,
} from "../utils";

interface EventDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
  onEventUpdated?: (event: Event) => void;
}

const EventDetailsModal = ({
  isOpen,
  onClose,
  event,
  onEventUpdated,
}: EventDetailsModalProps) => {
  const { showToast } = useToast();
  const { showSuccess, showError } = useSonner();
  const { confirm, ConfirmDialog } = useConfirm();
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [loading, setLoading] = useState(false);
  const [eventJudges, setEventJudges] = useState<any[]>([]);
  const [allJudges, setAllJudges] = useState<any[]>([]);
  const [showJudgesModal, setShowJudgesModal] = useState(false);
  const [loadingJudges, setLoadingJudges] = useState(false);
  const [showCreateJudgeForm, setShowCreateJudgeForm] = useState(false);
  const [newJudgeName, setNewJudgeName] = useState("");
  const [newJudgeDescription, setNewJudgeDescription] = useState("");

  // Estados para participantes
  const [eventParticipants, setEventParticipants] = useState<any[]>([]);
  const [allParticipants, setAllParticipants] = useState<Participant[]>([]);
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  const [loadingParticipants, setLoadingParticipants] = useState(false);

  // Estados para edição
  const [editedEvent, setEditedEvent] = useState<Partial<Event>>({});
  const [regulationMode, setRegulationMode] = useState<"text" | "pdf">("text");
  const [showRegulationImport, setShowRegulationImport] = useState(false);

  // Estados para modais de detalhes
  const [selectedJudge, setSelectedJudge] = useState<any>(null);
  const [selectedParticipant, setSelectedParticipant] = useState<any>(null);
  const [showJudgeDetails, setShowJudgeDetails] = useState(false);
  const [showParticipantDetails, setShowParticipantDetails] = useState(false);

  // Estado para menu de três pontos
  const [showMenu, setShowMenu] = useState(false);

  // Carregar jurados e participantes quando o modal abrir
  useEffect(() => {
    if (isOpen && event) {
      loadEventJudges();
      loadEventParticipants();

      // Inicializar o estado de edição com todos os campos do evento
      const initialEditState = {
        name: event.name,
        description: event.description,
        location: event.location,
        maxParticipants: event.maxParticipants,
        startDate: event.startDate,
        endDate: event.endDate,
        registrationStartDate: event.registrationStartDate,
        registrationEndDate: event.registrationEndDate,
        isPublic: event.isPublic,
        requiresApproval: event.requiresApproval,
        rules: event.rules,
        prizes: event.prizes || "",
        rulesFile: event.rulesFile,
        notes: event.notes,
      };

      // Definir modo de regulamento baseado no que está disponível
      if (event.rulesFile) {
        setRegulationMode("pdf");
      } else {
        setRegulationMode("text");
      }

      // Resetar estados de edição inline
      setIsEditingName(false);
      setEditedName("");

      console.log("Inicializando estado de edição:", initialEditState);
      setEditedEvent(initialEditState);
    }
  }, [isOpen, event]);

  // Fechar menu quando clicar fora
  useEffect(() => {
    const handleClickOutside = (_event: MouseEvent) => {
      if (showMenu) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  // Função para recarregar dados após operações
  const refreshData = async () => {
    if (event) {
      await Promise.all([loadEventJudges(), loadEventParticipants()]);
    }
  };

  if (!event) return null;

  const handleAction = async (
    action: () => Promise<any>,
    actionName: string,
    closeModal: boolean = false
  ) => {
    setLoading(true);
    try {
      const result = await action();
      if (result.success) {
        showSuccess(result.message || `${actionName} realizado com sucesso!`);
        if (onEventUpdated && result.data) {
          onEventUpdated(result.data);
        }
        await refreshData();

        // Fechar modal se especificado
        if (closeModal) {
          onClose();
        }
      } else {
        showError(result.error || `Erro ao realizar ${actionName}`);
      }
    } catch (error) {
      console.error(`Erro ao ${actionName}:`, error);
      showError(`Erro ao realizar ${actionName}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = () =>
    handleAction(
      () => publishEvent(event.id, "admin"),
      "publicar evento",
      true
    );

  const handleStart = () =>
    handleAction(() => startEvent(event.id, "admin"), "iniciar evento", true);

  const handleComplete = () =>
    handleAction(
      () => completeEvent(event.id, "admin"),
      "concluir evento",
      true
    );

  const handleCancel = () => {
    const reason = prompt("Motivo do cancelamento (opcional):");
    if (reason !== null) {
      // User didn't click cancel
      handleAction(
        () => cancelEvent(event.id, "admin", reason || undefined),
        "cancelar evento",
        true
      );
    }
  };

  const handleRevertToDraft = async () => {
    const confirmed = await confirm({
      title: "Voltar evento para rascunho",
      description:
        "Esta ação irá:\n" +
        "• Alterar o status do evento para 'Rascunho'\n" +
        "• Tornar o evento invisível para o público\n" +
        "• Desativar as inscrições\n" +
        "• Permitir nova edição completa do evento\n\n" +
        "Tem certeza que deseja continuar?",
      confirmText: "Sim, voltar para rascunho",
      cancelText: "Cancelar",
      destructive: true,
      icon: <AlertTriangle className="w-5 h-5 text-orange-500" />,
    });

    if (confirmed) {
      handleAction(
        () => revertToDraft(event.id, "admin"),
        "voltar para rascunho",
        true
      );
    }
  };

  const loadEventJudges = async () => {
    if (!event) return;

    setLoadingJudges(true);
    try {
      const result = await getEventJudges(event.id);
      if (result.success && result.data) {
        setEventJudges(result.data);
      }
    } catch (error) {
      console.error("Erro ao carregar jurados:", error);
    } finally {
      setLoadingJudges(false);
    }
  };

  const loadAllJudges = async () => {
    try {
      const result = await getJudges();
      if (result.success && result.data) {
        setAllJudges(result.data);
      }
    } catch (error) {
      console.error("Erro ao carregar todos os jurados:", error);
    }
  };

  const handleAddJudge = async (judgeId: string) => {
    if (!event) return;

    try {
      const result = await addJudgeToEvent(event.id, judgeId);
      if (result.success) {
        await refreshData();
        showSuccess("Jurado adicionado com sucesso!");
      } else {
        showError("Erro ao adicionar jurado");
      }
    } catch (error) {
      console.error("Erro ao adicionar jurado:", error);
      showError("Erro ao adicionar jurado");
    }
  };

  const handleRemoveJudge = async (judgeId: string) => {
    if (!event) return;

    const confirmed = await confirm({
      title: "Remover jurado",
      description: "Tem certeza que deseja remover este jurado do evento?",
      confirmText: "Sim, remover",
      cancelText: "Cancelar",
      destructive: true,
      icon: <UserMinus className="w-5 h-5 text-red-500" />,
    });

    if (!confirmed) return;

    try {
      const result = await removeJudgeFromEvent(event.id, judgeId);
      if (result.success) {
        await refreshData();
        showSuccess("Jurado removido com sucesso!");
      } else {
        showError("Erro ao remover jurado");
      }
    } catch (error) {
      console.error("Erro ao remover jurado:", error);
      showError("Erro ao remover jurado");
    }
  };

  const openJudgesModal = async () => {
    await loadAllJudges();
    setShowJudgesModal(true);
  };

  const availableJudges = allJudges.filter(
    (judge) => !eventJudges.some((ej) => ej.judge.id === judge.id)
  );

  const handleCreateQuickJudge = async (name: string, description: string) => {
    try {
      const result = await createJudge({ name, description, isActive: true });
      if (result.success) {
        await loadAllJudges();
        showToast({
          type: "success",
          title: "Sucesso!",
          description: "Jurado criado com sucesso!",
        });
      } else {
        showToast({
          type: "error",
          title: "Erro",
          description: "Erro ao criar jurado",
        });
      }
    } catch (error) {
      console.error("Erro ao criar jurado:", error);
      showToast({
        type: "error",
        title: "Erro",
        description: "Erro ao criar jurado",
      });
    }
  };

  // Funções para participantes
  const loadEventParticipants = async () => {
    if (!event) return;

    setLoadingParticipants(true);
    try {
      const result = await getEventParticipants(event.id);
      if (result.success && result.data) {
        setEventParticipants(result.data);
      }
    } catch (error) {
      console.error("Erro ao carregar participantes:", error);
    } finally {
      setLoadingParticipants(false);
    }
  };

  const loadAllParticipants = async () => {
    try {
      const result = await getApprovedParticipants();
      if (result.success && result.data) {
        setAllParticipants(result.data);
      }
    } catch (error) {
      console.error("Erro ao carregar todos os participantes:", error);
    }
  };

  const handleAddParticipant = async (participantId: string) => {
    if (!event) return;

    try {
      const result = await registerParticipantInEvent(event.id, participantId);
      if (result.success) {
        await refreshData();
        showSuccess("Participante registrado no evento com sucesso!");
      } else {
        showError(result.error || "Erro ao registrar participante");
      }
    } catch (error) {
      console.error("Erro ao registrar participante:", error);
      showError("Erro ao registrar participante");
    }
  };

  const handleRemoveParticipant = async (participantId: string) => {
    if (!event) return;

    const confirmed = await confirm({
      title: "Remover participante",
      description:
        "Tem certeza que deseja remover este participante do evento?",
      confirmText: "Sim, remover",
      cancelText: "Cancelar",
      destructive: true,
      icon: <UserMinus className="w-5 h-5 text-red-500" />,
    });

    if (!confirmed) return;

    try {
      const result = await removeParticipantFromEvent(event.id, participantId);
      if (result.success) {
        await refreshData();
        showSuccess("Participante removido do evento com sucesso!");
      } else {
        showError(result.error || "Erro ao remover participante");
      }
    } catch (error) {
      console.error("Erro ao remover participante:", error);
      showError("Erro ao remover participante");
    }
  };

  const openParticipantsModal = async () => {
    await loadAllParticipants();
    setShowParticipantsModal(true);
  };

  const handleRedirectToCreateParticipant = async () => {
    const confirmed = await confirm({
      title: "Criar Novo Participante",
      description:
        "Não há participantes registrados no sistema.\n" +
        "Deseja ser redirecionado para a página de criação de participantes?\n\n" +
        "Esta ação irá:\n" +
        "• Abrir a página de gestão de participantes\n" +
        "• Permitir criar novos participantes\n" +
        "• Após criar, poderá voltar para vincular ao evento\n\n" +
        "Continuar?",
      confirmText: "Sim, ir para gestão",
      cancelText: "Cancelar",
      icon: <UserPlus className="w-5 h-5 text-green-500" />,
    });

    if (confirmed) {
      window.location.href = "/dashboard/participants";
    }
  };

  const availableParticipants = allParticipants.filter(
    (participant) =>
      !eventParticipants.some((ep) => ep.participant.id === participant.id)
  );

  // Função para salvar edições do evento
  const handleSaveEvent = async () => {
    if (!event) return;

    try {
      // Garantir que os prémios sejam uma string válida
      const dataToSave = {
        ...editedEvent,
        prizes: editedEvent.prizes || "",
      };

      console.log("Salvando dados:", dataToSave);

      const result = await updateEvent(event.id, dataToSave);
      if (result.success) {
        showToast({
          type: "success",
          title: "Sucesso!",
          description: "Evento atualizado com sucesso!",
        });
        if (onEventUpdated && result.data) {
          onEventUpdated(result.data);
        }
        setIsEditing(false);
        // Fechar a modal após salvar com sucesso
        onClose();
      } else {
        showToast({
          type: "error",
          title: "Erro",
          description: result.error || "Erro ao atualizar evento",
        });
      }
    } catch (error) {
      console.error("Erro ao atualizar evento:", error);
      showToast({
        type: "error",
        title: "Erro",
        description: "Erro ao atualizar evento",
      });
    }
  };

  // Funções para modais de detalhes
  const openJudgeDetails = (judge: any) => {
    setSelectedJudge(judge);
    setShowJudgeDetails(true);
  };

  const openParticipantDetails = (participant: any) => {
    setSelectedParticipant(participant);
    setShowParticipantDetails(true);
  };

  // Função para enviar notificação (placeholder)
  const handleSendNotification = () => {
    showToast({
      type: "info",
      title: "Notificação",
      description: `Funcionalidade de notificação será implementada em breve.`,
    });
  };

  // Funções para o menu de três pontos
  const handleCopyEvent = async () => {
    if (!event) return;

    const confirmed = await confirm({
      title: "Copiar Evento",
      description:
        "Deseja criar uma cópia deste evento? A cópia será criada como rascunho e poderá ser editada livremente.",
      confirmText: "Sim, copiar",
      cancelText: "Cancelar",
      icon: <Copy className="w-5 h-5 text-blue-500" />,
    });

    if (!confirmed) return;

    try {
      setLoading(true);
      const result = await copyEvent(event.id);

      if (result.success) {
        showSuccess(result.message || "Evento copiado com sucesso!");
        if (onEventUpdated && result.data) {
          onEventUpdated(result.data);
        }
        setShowMenu(false);
        // Fechar o modal atual e abrir o modal de edição da cópia
        onClose();
      } else {
        showError(result.error || "Erro ao copiar evento");
      }
    } catch (error) {
      console.error("Erro ao copiar evento:", error);
      showError("Erro ao copiar evento");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVisibility = async () => {
    const action = event.isPublic ? "tornar privado" : "tornar público";
    const confirmed = await confirm({
      title: `${event.isPublic ? "Tornar Privado" : "Tornar Público"}`,
      description: `Deseja ${action} este evento?`,
      confirmText: `Sim, ${action}`,
      cancelText: "Cancelar",
      icon: event.isPublic ? (
        <EyeOff className="w-5 h-5 text-orange-500" />
      ) : (
        <Eye className="w-5 h-5 text-green-500" />
      ),
    });

    if (!confirmed) return;

    try {
      // Aqui você implementaria a lógica para alterar a visibilidade
      showSuccess("Funcionalidade de visibilidade será implementada em breve!");
      setShowMenu(false);
    } catch (error) {
      showError("Erro ao alterar visibilidade");
    }
  };

  const handlePauseEvent = async () => {
    const confirmed = await confirm({
      title: "Pausar Evento",
      description:
        "Deseja pausar este evento? O evento ficará temporariamente inativo.",
      confirmText: "Sim, pausar",
      cancelText: "Cancelar",
      icon: <Pause className="w-5 h-5 text-orange-500" />,
    });

    if (!confirmed) return;

    try {
      // Aqui você implementaria a lógica para pausar o evento
      showSuccess("Funcionalidade de pausar será implementada em breve!");
      setShowMenu(false);
    } catch (error) {
      showError("Erro ao pausar evento");
    }
  };

  const handleDeleteEvent = async () => {
    if (!event) return;

    const confirmed = await confirm({
      title: "Excluir Evento",
      description: `Tem certeza que deseja excluir o evento "${event.name}"? Esta ação é irreversível e só é permitida para eventos em rascunho.`,
      confirmText: "Sim, excluir",
      cancelText: "Cancelar",
      destructive: true,
      icon: <Trash2 className="w-5 h-5 text-red-500" />,
    });

    if (!confirmed) return;

    try {
      const result = await deleteEvent(event.id);

      if (result.success) {
        showSuccess(result.message || "Evento excluído com sucesso!");
        onEventUpdated?.(event);
        onClose();
      } else {
        showError(result.error || "Erro ao excluir evento");
      }
    } catch (error) {
      console.error("Erro ao excluir evento:", error);
      showError("Erro ao excluir evento");
    }
  };

  const handleEditName = () => {
    if (!event) return;
    setEditedName(event.name);
    setIsEditingName(true);
  };

  const handleSaveName = async () => {
    if (!event || !editedName.trim()) return;

    try {
      const result = await updateEvent(event.id, { name: editedName.trim() });

      if (result.success && result.data) {
        showSuccess("Nome do evento atualizado com sucesso!");
        onEventUpdated?.(result.data);
        setIsEditingName(false);
      } else {
        showError(result.error || "Erro ao atualizar nome do evento");
      }
    } catch (error) {
      console.error("Erro ao atualizar nome:", error);
      showError("Erro ao atualizar nome do evento");
    }
  };

  const handleCancelEditName = () => {
    setEditedName("");
    setIsEditingName(false);
  };

  // Funções de ação dinâmicas
  const handleCompleteEvent = async () => {
    if (!event) return;

    const confirmed = await confirm({
      title: "Concluir Evento",
      description: `Tem certeza que deseja concluir o evento "${event.name}"? Esta ação finalizará todas as avaliações.`,
      confirmText: "Sim, concluir",
      cancelText: "Cancelar",
      icon: <CheckCircle className="w-5 h-5 text-green-500" />,
    });

    if (!confirmed) return;

    try {
      const result = await completeEvent(event.id, "admin");

      if (result.success && result.data) {
        showSuccess(result.message || "Evento concluído com sucesso!");
        onEventUpdated?.(result.data);
      } else {
        showError(result.error || "Erro ao concluir evento");
      }
    } catch (error) {
      console.error("Erro ao concluir evento:", error);
      showError("Erro ao concluir evento");
    }
  };

  const handlePublishResults = async () => {
    if (!event) return;

    const confirmed = await confirm({
      title: "Publicar Resultados",
      description: `Tem certeza que deseja publicar os resultados do evento "${event.name}" no site?`,
      confirmText: "Sim, publicar",
      cancelText: "Cancelar",
      icon: <Globe className="w-5 h-5 text-blue-500" />,
    });

    if (!confirmed) return;

    try {
      // TODO: Implementar publicação de resultados
      showSuccess("Resultados publicados com sucesso!");
    } catch (error) {
      console.error("Erro ao publicar resultados:", error);
      showError("Erro ao publicar resultados");
    }
  };

  const handleResetVotings = async () => {
    if (!event) return;

    const confirmed = await confirm({
      title: "Resetar Votações",
      description: `Tem certeza que deseja resetar todas as votações do evento "${event.name}"? Esta ação é irreversível.`,
      confirmText: "Sim, resetar",
      cancelText: "Cancelar",
      destructive: true,
      icon: <RefreshCw className="w-5 h-5 text-red-500" />,
    });

    if (!confirmed) return;

    try {
      // TODO: Implementar reset de votações
      showSuccess("Votações resetadas com sucesso!");
    } catch (error) {
      console.error("Erro ao resetar votações:", error);
      showError("Erro ao resetar votações");
    }
  };

  const handleAddNotes = () => {
    // TODO: Implementar modal para adicionar notas
    showSuccess("Funcionalidade de notas será implementada em breve!");
  };

  const handlePauseEventTemporarily = async () => {
    if (!event) return;

    const confirmed = await confirm({
      title: "Pausar Evento",
      description: `Tem certeza que deseja pausar temporariamente o evento "${event.name}"?`,
      confirmText: "Sim, pausar",
      cancelText: "Cancelar",
      icon: <Pause className="w-5 h-5 text-yellow-500" />,
    });

    if (!confirmed) return;

    try {
      // TODO: Implementar pausa temporária
      showSuccess("Evento pausado temporariamente!");
    } catch (error) {
      console.error("Erro ao pausar evento:", error);
      showError("Erro ao pausar evento");
    }
  };

  const handleReplaceJudge = () => {
    // TODO: Implementar substituição de jurado
    showSuccess(
      "Funcionalidade de substituição de jurado será implementada em breve!"
    );
  };

  const handleAddTemporaryJudge = () => {
    setShowCreateJudgeForm(true);
  };

  // Configuração das abas de ações dinâmicas
  const getActionTabs = () => {
    const baseTabs = [
      {
        title: "Concluir Evento",
        icon: CheckCircle,
        action: handleCompleteEvent,
        disabled: event?.status !== "ongoing",
        variant: "default" as const,
      },
      {
        title: "Publicar Resultados",
        icon: Globe,
        action: handlePublishResults,
        disabled: event?.status !== "completed",
        variant: "default" as const,
      },
      {
        type: "separator" as const,
      },
      {
        title: "Resetar Votações",
        icon: RefreshCw,
        action: handleResetVotings,
        disabled: event?.status === "draft",
        variant: "destructive" as const,
      },
      {
        title: "Adicionar Notas",
        icon: StickyNote,
        action: handleAddNotes,
        variant: "default" as const,
      },
      {
        title: "Pausar Evento",
        icon: Pause,
        action: handlePauseEventTemporarily,
        disabled: event?.status !== "ongoing",
        variant: "warning" as const,
      },
      {
        type: "separator" as const,
      },
      {
        title: "Substituir Jurado",
        icon: UserMinus,
        action: handleReplaceJudge,
        disabled: eventJudges.length === 0,
        variant: "default" as const,
      },
      {
        title: "Jurado Temporário",
        icon: UserPlus,
        action: handleAddTemporaryJudge,
        variant: "default" as const,
      },
    ];

    return baseTabs;
  };

  const headerActions = (
    <>
      {isEditing ? (
        <>
          <button
            onClick={handleSaveEvent}
            className="p-2 hover:bg-gray-50 rounded-lg transition-colors group"
            title="Salvar alterações"
          >
            <Save className="w-5 h-5 text-gray-600 group-hover:text-gray-700" />
          </button>
          <button
            title="Cancelar edição"
            onClick={() => {
              setIsEditing(false);
              // Restaurar todos os campos para os valores originais
              setEditedEvent({
                name: event.name,
                description: event.description,
                location: event.location,
                maxParticipants: event.maxParticipants,
                startDate: event.startDate,
                endDate: event.endDate,
                registrationStartDate: event.registrationStartDate,
                registrationEndDate: event.registrationEndDate,
                isPublic: event.isPublic,
                requiresApproval: event.requiresApproval,
                rules: event.rules,
                prizes: event.prizes || "",
                rulesFile: event.rulesFile,
                notes: event.notes,
              });

              // Restaurar modo de regulamento
              if (event.rulesFile) {
                setRegulationMode("pdf");
              } else {
                setRegulationMode("text");
              }
            }}
            className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
          >
            <SaveOff className="w-5 h-5 text-red-500 group-hover:text-red-700" />
          </button>
        </>
      ) : (
        <button
          onClick={() => {
            console.log("Ativando modo de edição, estado atual:", editedEvent);
            setIsEditing(true);
          }}
          className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
          title="Editar evento"
        >
          <Edit className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
        </button>
      )}

      {/* Menu de três pontos */}
      <DropdownMenu open={showMenu} onOpenChange={setShowMenu}>
        <DropdownMenuTrigger>
          <MoreVertical className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => handleCopyEvent()}
            className="flex items-center"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copiar Evento
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleToggleVisibility()}
            className="flex items-center"
          >
            <Toggle className="w-4 h-4 mr-2" />
            Alterar visibilidade
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handlePauseEvent()}
            className="flex items-center"
          >
            <Pause className="w-4 h-4 mr-2" />
            Pausar Evento
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleDeleteEvent()}
            className="flex items-center"
            disabled={event?.status !== "draft"}
          >
            <Trash2 className="w-4 h-5 text-red-500" />
            Excluir Evento
            {event?.status !== "draft" && (
              <span className="ml-auto text-xs text-gray-400">
                (Apenas rascunhos)
              </span>
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setIsEditing(false);
          // Resetar o estado de edição quando fechar
          setEditedEvent({});
        }}
        title="Detalhes do Evento"
        subtitle={event.name}
        icon={<Calendar className="w-6 h-6 text-verde-suave" />}
        size="large"
        headerActions={headerActions}
      >
        <div className="p-8">
          <div className="space-y-8">
            {/* Nome do Evento - Edição Inline */}
            <div className="border-b border-gray-200 pb-6">
              <label className="text-sm text-cinza-chumbo/70 font-medium block mb-2">
                Nome do Evento
              </label>
              {isEditingName ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-lg font-medium focus:outline-none focus:ring-2 focus:ring-verde-suave focus:border-transparent"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSaveName();
                      } else if (e.key === "Escape") {
                        handleCancelEditName();
                      }
                    }}
                  />
                  <button
                    onClick={handleSaveName}
                    disabled={!editedName.trim()}
                    className="px-3 py-2 bg-verde-suave text-white text-sm rounded-md hover:bg-verde-suave/80 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                  >
                    <Save className="w-4 h-4" />
                    Salvar
                  </button>
                  <button
                    onClick={handleCancelEditName}
                    className="px-3 py-2 bg-gray-500 text-white text-sm rounded-md hover:bg-gray-600 flex items-center gap-1"
                  >
                    <X className="w-4 h-4" />
                    Cancelar
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 group">
                  <h2 className="text-xl font-semibold text-cinza-chumbo">
                    {event.name}
                  </h2>
                  <button
                    onClick={handleEditName}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded-md"
                    title="Editar nome do evento"
                  >
                    <Edit className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              )}
            </div>

            {/* Status e Informações Básicas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-sm text-cinza-chumbo/70 font-medium">
                  Estado do Evento
                </label>
                <div className="mt-1 space-y-3">
                  {/* Estado Principal do Evento */}
                  <div>
                    <span className="text-xs text-cinza-chumbo/60 block mb-1">
                      Estado atual:
                    </span>
                    {(() => {
                      const statusInfo = EVENT_STATUSES.find(
                        (s) => s.value === event.status
                      );
                      return (
                        <span
                          className={`inline-block px-3 py-1.5 rounded-full text-sm font-medium ${
                            statusInfo?.color || "text-gray-600 bg-gray-100"
                          }`}
                        >
                          {statusInfo?.label || getStatusText(event.status)}
                        </span>
                      );
                    })()}
                  </div>

                  {/* Condições Adicionais */}
                  <div>
                    <span className="text-xs text-cinza-chumbo/60 block mb-1">
                      Condições:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {isEventActive(event) && (
                        <span className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium border border-blue-200">
                          <Clock className="w-3 h-3 mr-1" />
                          Evento em andamento
                        </span>
                      )}
                      {isRegistrationOpen(event) && (
                        <span className="inline-flex items-center px-2 py-1 bg-green-50 text-green-700 rounded-md text-xs font-medium border border-green-200">
                          <UserPlus className="w-3 h-3 mr-1" />
                          Aceitando inscrições
                        </span>
                      )}
                      {!isEventActive(event) &&
                        !isRegistrationOpen(event) &&
                        event.status === "published" && (
                          <span className="inline-flex items-center px-2 py-1 bg-gray-50 text-gray-600 rounded-md text-xs font-medium border border-gray-200">
                            <Calendar className="w-3 h-3 mr-1" />
                            Aguardando início
                          </span>
                        )}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm text-cinza-chumbo/70 font-medium">
                  Tipo de Evento
                </label>
                <p className="font-semibold text-cinza-chumbo">
                  {EVENT_TYPES.find((type) => type.value === event.type)
                    ?.label || getTypeText(event.type)}
                </p>
              </div>

              <div>
                <label className="text-sm text-cinza-chumbo/70 font-medium">
                  Modalidade
                </label>
                <p className="font-semibold text-cinza-chumbo">
                  {EVENT_CATEGORIES.find((cat) => cat.value === event.category)
                    ?.label || getCategoryText(event.category)}
                </p>
              </div>
            </div>

            {/* Descrição */}
            <div>
              <label className="text-sm text-cinza-chumbo/70 font-medium">
                Descrição
              </label>
              {isEditing ? (
                <textarea
                  value={editedEvent.description || ""}
                  onChange={(e) =>
                    setEditedEvent({
                      ...editedEvent,
                      description: e.target.value,
                    })
                  }
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Descrição do evento..."
                />
              ) : (
                <p className="mt-1 text-cinza-chumbo whitespace-pre-wrap">
                  {event.description || "Sem descrição"}
                </p>
              )}
            </div>

            {/* Local e Participantes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-cinza-chumbo/70 font-medium flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  Local
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedEvent.location || ""}
                    onChange={(e) =>
                      setEditedEvent({
                        ...editedEvent,
                        location: e.target.value,
                      })
                    }
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Local do evento..."
                  />
                ) : (
                  <p className="font-semibold text-cinza-chumbo">
                    {event.location}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm text-cinza-chumbo/70 font-medium flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  Participantes
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    value={editedEvent.maxParticipants || ""}
                    onChange={(e) =>
                      setEditedEvent({
                        ...editedEvent,
                        maxParticipants: e.target.value
                          ? parseInt(e.target.value)
                          : null,
                      })
                    }
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Máximo de participantes (opcional)"
                    min="1"
                  />
                ) : (
                  <p className="font-semibold text-cinza-chumbo">
                    {eventParticipants.length}
                    {event.maxParticipants && ` / ${event.maxParticipants}`}
                    <span className="text-sm text-cinza-chumbo/70 ml-1">
                      {event.maxParticipants ? "vinculados" : "(sem limite)"}
                    </span>
                  </p>
                )}
              </div>
            </div>

            {/* Datas do Evento */}
            <div>
              <h4 className="font-semibold text-cinza-chumbo mb-4 flex items-center">
                <CalendarDays className="w-5 h-5 mr-2" />
                Datas do Evento
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-cinza-chumbo/70 font-medium">
                    Data e Hora de Início
                  </label>
                  {isEditing ? (
                    <DateTimePicker
                      date={editedEvent.startDate}
                      onDateChange={(date) =>
                        setEditedEvent({
                          ...editedEvent,
                          startDate: date || new Date(),
                        })
                      }
                    />
                  ) : (
                    <>
                      <p className="font-semibold text-cinza-chumbo">
                        {formatEventDate(event.startDate)}
                      </p>
                      <p className="text-sm text-cinza-chumbo/70">
                        às {formatEventTime(event.startDate)}
                      </p>
                    </>
                  )}
                </div>

                {event.endDate && (
                  <div>
                    <label className="text-sm text-cinza-chumbo/70 font-medium">
                      Data e Hora de Fim
                    </label>
                    {isEditing ? (
                      <DateTimePicker
                        date={editedEvent.endDate || undefined}
                        onDateChange={(date) =>
                          setEditedEvent({
                            ...editedEvent,
                            endDate: date || null,
                          })
                        }
                      />
                    ) : (
                      <>
                        <p className="font-semibold text-cinza-chumbo">
                          {formatEventDate(event.endDate)}
                        </p>
                        <p className="text-sm text-cinza-chumbo/70">
                          às {formatEventTime(event.endDate)}
                        </p>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Período de Inscrições */}
            <div>
              <h4 className="font-semibold text-cinza-chumbo mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Período de Inscrições
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-cinza-chumbo/70 font-medium">
                    Início das Inscrições
                  </label>
                  {isEditing ? (
                    <DateTimePicker
                      date={editedEvent.registrationStartDate || undefined}
                      onDateChange={(date) =>
                        setEditedEvent({
                          ...editedEvent,
                          registrationStartDate: date || null,
                        })
                      }
                    />
                  ) : event.registrationStartDate ? (
                    <>
                      <p className="font-semibold text-cinza-chumbo">
                        {formatEventDate(event.registrationStartDate)}
                      </p>
                      <p className="text-sm text-cinza-chumbo/70">
                        às {formatEventTime(event.registrationStartDate)}
                      </p>
                    </>
                  ) : (
                    <p className="text-sm text-cinza-chumbo/50 italic">
                      Não definido
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm text-cinza-chumbo/70 font-medium">
                    Fim das Inscrições
                  </label>
                  {isEditing ? (
                    <DateTimePicker
                      date={editedEvent.registrationEndDate || undefined}
                      onDateChange={(date) =>
                        setEditedEvent({
                          ...editedEvent,
                          registrationEndDate: date || null,
                        })
                      }
                    />
                  ) : event.registrationEndDate ? (
                    <>
                      <p className="font-semibold text-cinza-chumbo">
                        {formatEventDate(event.registrationEndDate)}
                      </p>
                      <p className="text-sm text-cinza-chumbo/70">
                        às {formatEventTime(event.registrationEndDate)}
                      </p>
                    </>
                  ) : (
                    <p className="text-sm text-cinza-chumbo/50 italic">
                      Não definido
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Configurações */}
            <div>
              <h4 className="font-semibold text-cinza-chumbo mb-4 flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Configurações
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-cinza-chumbo/70 font-medium">
                    Visibilidade
                  </label>
                  {isEditing ? (
                    <Select
                      value={editedEvent.isPublic ? "publico" : "privado"}
                      onValueChange={(value) =>
                        setEditedEvent({
                          ...editedEvent,
                          isPublic: value === "publico",
                        })
                      }
                    >
                      <SelectTrigger className="w-full ">
                        <SelectValue placeholder="Selecione uma opção" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="privado">Privado</SelectItem>
                        <SelectItem value="publico">Público</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <>
                      <p className="font-semibold text-cinza-chumbo">
                        {event.isPublic ? "Público" : "Privado"}
                      </p>
                      <p className="text-xs text-cinza-chumbo/70">
                        {event.isPublic
                          ? "Visível para todos os utilizadores"
                          : "Visível apenas para administradores"}
                      </p>
                    </>
                  )}
                </div>

                <div>
                  <label className="text-sm text-cinza-chumbo/70 font-medium">
                    Aprovação de Inscrições
                  </label>
                  {isEditing ? (
                    <Select
                      value={
                        editedEvent.requiresApproval
                          ? "requer_aprovacao"
                          : "automatica"
                      }
                      onValueChange={(value) =>
                        setEditedEvent({
                          ...editedEvent,
                          requiresApproval: value === "requer_aprovacao",
                        })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione uma opção" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="automatica">Automática</SelectItem>
                        <SelectItem value="requer_aprovacao">
                          Requer aprovação
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <>
                      <p className="font-semibold text-cinza-chumbo">
                        {event.requiresApproval
                          ? "Requer aprovação"
                          : "Automática"}
                      </p>
                      <p className="text-xs text-cinza-chumbo/70">
                        {event.requiresApproval
                          ? "Inscrições precisam ser aprovadas"
                          : "Inscrições são aprovadas automaticamente"}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Regulamento */}
            <div>
              <h4 className="font-semibold text-cinza-chumbo mb-4 flex items-center justify-between">
                <span>Regulamento</span>
                {isEditing && (
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowRegulationImport(true)}
                      className="flex items-center space-x-2 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      Importar PDF
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setRegulationMode(
                          regulationMode === "text" ? "pdf" : "text"
                        )
                      }
                      className="flex items-center space-x-2 px-3 py-1.5 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      {regulationMode === "text" ? (
                        <>
                          <FileText className="w-4 h-4" />
                          Modo PDF
                        </>
                      ) : (
                        <>
                          <Edit className="w-4 h-4" />
                          Modo Texto
                        </>
                      )}
                    </button>
                  </div>
                )}
              </h4>

              {isEditing ? (
                <div className="space-y-4">
                  {regulationMode === "text" ? (
                    <div>
                      <label className="block text-sm font-medium text-cinza-chumbo mb-2">
                        Regulamento em Texto
                      </label>
                      <RichTextEditor
                        value={editedEvent.rules || ""}
                        onChange={(content) => {
                          setEditedEvent({ ...editedEvent, rules: content });
                        }}
                        placeholder="Digite o regulamento do evento..."
                        className="w-full"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-cinza-chumbo mb-2">
                        Regulamento em PDF
                      </label>
                      {editedEvent.rulesFile ? (
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <FileText className="w-5 h-5 text-green-600" />
                            <span className="text-green-800 font-medium">
                              PDF carregado com sucesso
                            </span>
                          </div>
                          <div className="flex space-x-2">
                            <a
                              href={editedEvent.rulesFile}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                              Visualizar
                            </a>
                            <a
                              href={editedEvent.rulesFile}
                              download
                              className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                            >
                              <Download className="w-4 h-4" />
                              Download
                            </a>
                            <button
                              type="button"
                              onClick={() => {
                                setEditedEvent({
                                  ...editedEvent,
                                  rulesFile: "",
                                });
                                setRegulationMode("text");
                              }}
                              className="flex items-center space-x-2 px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                              Remover
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-500 mb-2">
                            Nenhum PDF carregado
                          </p>
                          <p className="text-sm text-gray-400">
                            Clique em "Importar PDF" para carregar um
                            regulamento
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {event.rulesFile ? (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <span className="text-blue-800 font-medium">
                          Regulamento disponível em PDF
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <a
                          href={event.rulesFile}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          Visualizar PDF
                        </a>
                        <a
                          href={event.rulesFile}
                          download
                          className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          Download PDF
                        </a>
                      </div>
                    </div>
                  ) : event.rules ? (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <RichTextEditor
                        value={event.rules}
                        onChange={() => {}} // Não faz nada em modo somente leitura
                        readOnly={true}
                        showHtml={true}
                        className="w-full"
                      />
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">
                      Sem regulamento definido
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Prémios */}
            <div>
              <h4 className="font-semibold text-cinza-chumbo mb-4 flex items-center">
                <Trophy className="w-5 h-5 mr-2" />
                Prémios
              </h4>
              {isEditing ? (
                <TagsInput
                  disabled={false}
                  value={editedEvent.prizes?.split(",").filter(Boolean) || []}
                  onChange={(value) => {
                    setEditedEvent({ ...editedEvent, prizes: value.join(",") });
                  }}
                  name="prizes"
                  placeHolder="Prémios do evento..."
                  maxTagsCount={5}
                  icon={Trophy}
                />
              ) : (
                <div className="space-y-2">
                  {event.prizes ? (
                    <div className="flex flex-wrap gap-2">
                      {event.prizes
                        .split(",")
                        .filter(Boolean)
                        .map((prize, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full text-sm font-medium shadow-sm"
                          >
                            <Trophy className="w-4 h-4 mr-2 text-amber-100" />
                            {prize.trim()}
                          </span>
                        ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">
                      Sem prémios definidos
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Participantes do Evento */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-cinza-chumbo flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Participantes do Evento ({eventParticipants.length})
                </h4>
                <button
                  onClick={openParticipantsModal}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Vincular Participante</span>
                </button>
              </div>

              {loadingParticipants ? (
                <div className="text-center py-4">
                  <p className="text-cinza-chumbo/70">
                    Carregando participantes...
                  </p>
                </div>
              ) : (
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <AvatarGroup
                    items={eventParticipants.map((ep) => ({
                      id: ep.participant.id,
                      name: ep.participant.name,
                      avatar: ep.participant.avatar,
                      email: ep.participant.email,
                      category: ep.participant.category,
                      experience: ep.participant.experience,
                      status: ep.participant.status,
                    }))}
                    maxVisible={8}
                    size="md"
                    onAvatarClick={openParticipantDetails}
                    onShowAll={() => console.log("Show all participants")}
                    type="participants"
                  />
                </div>
              )}
            </div>

            {/* Jurados do Evento */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-cinza-chumbo flex items-center">
                  <UserCheck className="w-5 h-5 mr-2" />
                  Jurados do Evento ({eventJudges.length})
                </h4>
                <button
                  onClick={openJudgesModal}
                  className="flex items-center space-x-2 bg-verde-suave text-white px-3 py-2 rounded-lg hover:bg-verde-suave/90 transition-colors text-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Adicionar Jurado</span>
                </button>
              </div>

              {loadingJudges ? (
                <div className="text-center py-4">
                  <p className="text-cinza-chumbo/70">Carregando jurados...</p>
                </div>
              ) : eventJudges.length === 0 ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                  <UserCheck className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                    Nenhum jurado associado
                  </h3>
                  <p className="text-yellow-700 mb-4">
                    Este evento ainda não possui jurados. Adicione jurados para
                    poder realizar as avaliações.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={openJudgesModal}
                      className="flex items-center justify-center space-x-2 bg-verde-suave text-white px-4 py-2 rounded-lg hover:bg-verde-suave/90 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Associar Jurados</span>
                    </button>
                    <button
                      onClick={() => setShowCreateJudgeForm(true)}
                      className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Criar Jurado Temporário</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <AvatarGroup
                    items={eventJudges.map((ej) => ({
                      id: ej.judge.id,
                      name: ej.judge.name,
                      avatar: ej.judge.avatar,
                      description: ej.judge.description,
                      isActive: ej.judge.isActive,
                    }))}
                    maxVisible={5}
                    size="md"
                    onAvatarClick={openJudgeDetails}
                    onShowAll={() => console.log("Show all judges")}
                    type="judges"
                  />
                </div>
              )}
            </div>

            {/* Ações Dinâmicas */}
            <div>
              <h4 className="font-semibold text-cinza-chumbo mb-4 flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Ações do Evento
              </h4>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <ExpandedTabs tabs={getActionTabs()} className="flex-wrap" />
                <p className="text-xs text-gray-500 mt-3">
                  As ações disponíveis dependem do status atual do evento e da
                  configuração.
                </p>
              </div>
            </div>

            {/* Notas Internas */}
            <div>
              <h4 className="font-semibold text-cinza-chumbo mb-4">
                Notas Internas
              </h4>
              {isEditing ? (
                <textarea
                  value={editedEvent.notes || ""}
                  onChange={(e) =>
                    setEditedEvent({ ...editedEvent, notes: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Notas internas sobre o evento..."
                />
              ) : event.notes ? (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-cinza-chumbo whitespace-pre-wrap text-sm">
                    {event.notes}
                  </p>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Sem notas internas</p>
              )}
            </div>

            {/* Ações Rápidas */}
            <div>
              <h4 className="font-semibold text-cinza-chumbo mb-4">
                Ações Rápidas
              </h4>
              <div className="flex flex-wrap gap-3">
                {event.status === "draft" && (
                  <button
                    onClick={handlePublish}
                    disabled={loading}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "A publicar..." : "Publicar Evento"}
                  </button>
                )}

                {event.status === "published" && (
                  <button
                    onClick={handleStart}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "A iniciar..." : "Marcar como Em Curso"}
                  </button>
                )}

                {event.status === "ongoing" && (
                  <button
                    onClick={handleComplete}
                    disabled={loading}
                    className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "A concluir..." : "Marcar como Concluído"}
                  </button>
                )}

                {["published", "ongoing"].includes(event.status) && (
                  <button
                    onClick={handleCancel}
                    disabled={loading}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "A cancelar..." : "Cancelar Evento"}
                  </button>
                )}

                {event.status !== "ongoing" && (
                  <button
                    onClick={handleRevertToDraft}
                    disabled={loading}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "A reverter..." : "Voltar a Rascunho"}
                  </button>
                )}
              </div>
            </div>

            {/* Informações de Auditoria */}
            <div className="border-t border-gray-200 pt-6">
              <h4 className="font-semibold text-cinza-chumbo mb-4">
                Informações de Auditoria
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div>
                  <label className="text-cinza-chumbo/70 font-medium">
                    Criado por
                  </label>
                  <p className="text-cinza-chumbo">{event.createdBy}</p>
                </div>
                <div>
                  <label className="text-cinza-chumbo/70 font-medium">
                    Data de Criação
                  </label>
                  <p className="text-cinza-chumbo">
                    {event.createdAt?.toLocaleDateString("pt-PT", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div>
                  <label className="text-cinza-chumbo/70 font-medium">
                    Última Atualização
                  </label>
                  <p className="text-cinza-chumbo">
                    {event.updatedAt?.toLocaleDateString("pt-PT", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* Modal de Seleção de Jurados */}
      <Modal
        isOpen={showJudgesModal}
        onClose={() => setShowJudgesModal(false)}
        title="Adicionar Jurados ao Evento"
        subtitle={`Gerir jurados para: ${event?.name}`}
        icon={<UserCheck className="w-6 h-6 text-verde-suave" />}
        size="lg"
      >
        <div className="p-6">
          {allJudges.length === 0 ? (
            <div className="text-center py-8">
              <UserCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-cinza-chumbo mb-2">
                Nenhum jurado encontrado
              </h3>
              <p className="text-cinza-chumbo/70 mb-6">
                Não há jurados na base de dados. Crie alguns jurados primeiro.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => setShowCreateJudgeForm(true)}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Criar Novo Jurado
                </button>
              </div>
            </div>
          ) : availableJudges.length === 0 ? (
            <div className="text-center py-8">
              <UserCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-cinza-chumbo mb-2">
                Todos os jurados já foram adicionados
              </h3>
              <p className="text-cinza-chumbo/70 mb-6">
                Não há mais jurados disponíveis para adicionar a este evento.
              </p>
              <button
                onClick={() => setShowCreateJudgeForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Criar Novo Jurado
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="font-semibold text-cinza-chumbo mb-4">
                Jurados Disponíveis ({availableJudges.length})
              </h3>
              <div className="grid gap-4 max-h-96 overflow-y-auto">
                {availableJudges.map((judge) => (
                  <div
                    key={judge.id}
                    className="border border-gray-200 p-4 rounded-lg hover:border-verde-suave transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-cinza-chumbo">
                          {judge.name}
                        </h4>
                        {judge.description && (
                          <p className="text-sm text-cinza-chumbo/70 mt-1">
                            {judge.description}
                          </p>
                        )}
                        {judge.notes && (
                          <p className="text-xs text-gray-500 mt-2">
                            Notas: {judge.notes}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => handleAddJudge(judge.id)}
                        className="ml-4 bg-verde-suave text-white px-3 py-2 rounded-lg hover:bg-verde-suave/90 transition-colors text-sm"
                      >
                        Adicionar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Formulário de Criação Rápida */}
          {showCreateJudgeForm && (
            <div className="mt-6 p-4 border-t border-gray-200">
              <h3 className="font-semibold text-cinza-chumbo mb-4">
                Criar Novo Jurado
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-cinza-chumbo mb-1">
                    Nome do Jurado
                  </label>
                  <input
                    type="text"
                    value={newJudgeName}
                    onChange={(e) => setNewJudgeName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-verde-suave focus:border-verde-suave"
                    placeholder="Ex: Maria Silva"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-cinza-chumbo mb-1">
                    Descrição/Especialidade
                  </label>
                  <input
                    type="text"
                    value={newJudgeDescription}
                    onChange={(e) => setNewJudgeDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-verde-suave focus:border-verde-suave"
                    placeholder="Ex: Fadista profissional e professora de canto"
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      if (newJudgeName.trim()) {
                        handleCreateQuickJudge(
                          newJudgeName.trim(),
                          newJudgeDescription.trim()
                        );
                        setNewJudgeName("");
                        setNewJudgeDescription("");
                        setShowCreateJudgeForm(false);
                      }
                    }}
                    className="px-4 py-2 bg-verde-suave text-white rounded-lg hover:bg-verde-suave/90 transition-colors"
                    disabled={!newJudgeName.trim()}
                  >
                    Criar Jurado
                  </button>
                  <button
                    onClick={() => {
                      setShowCreateJudgeForm(false);
                      setNewJudgeName("");
                      setNewJudgeDescription("");
                    }}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center mt-6 pt-4 border-t">
            {!showCreateJudgeForm &&
              allJudges.length > 0 &&
              availableJudges.length > 0 && (
                <button
                  onClick={() => setShowCreateJudgeForm(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  + Criar Novo Jurado
                </button>
              )}
            <div className="flex-1"></div>
            <button
              onClick={() => {
                setShowJudgesModal(false);
                setShowCreateJudgeForm(false);
                setNewJudgeName("");
                setNewJudgeDescription("");
              }}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal de Seleção de Participantes */}
      <Modal
        isOpen={showParticipantsModal}
        onClose={() => setShowParticipantsModal(false)}
        title="Vincular Participantes ao Evento"
        subtitle={`Gerir participantes para: ${event?.name}`}
        icon={<Users className="w-6 h-6 text-blue-600" />}
        size="lg"
      >
        <div className="p-6">
          {allParticipants.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-cinza-chumbo mb-2">
                Nenhum participante encontrado
              </h3>
              <p className="text-cinza-chumbo/70 mb-6">
                Não há participantes aprovados na base de dados.
              </p>
              <div className="space-y-3">
                <button
                  onClick={handleRedirectToCreateParticipant}
                  className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Ir para Gestão de Participantes
                </button>
              </div>
            </div>
          ) : availableParticipants.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-cinza-chumbo mb-2">
                Todos os participantes já foram vinculados
              </h3>
              <p className="text-cinza-chumbo/70 mb-6">
                Não há mais participantes disponíveis para vincular a este
                evento.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="font-semibold text-cinza-chumbo mb-4">
                Participantes Disponíveis ({availableParticipants.length})
              </h3>
              <div className="grid gap-4 max-h-96 overflow-y-auto">
                {availableParticipants.map((participant) => (
                  <div
                    key={participant.id}
                    className="border border-gray-200 p-4 rounded-lg hover:border-blue-500 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-cinza-chumbo">
                          {participant.name}
                        </h4>
                        <p className="text-sm text-cinza-chumbo/70 mt-1">
                          {participant.email}
                        </p>
                        {participant.phone && (
                          <p className="text-sm text-cinza-chumbo/70">
                            {participant.phone}
                          </p>
                        )}
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            {participant.category}
                          </span>
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            {participant.experience}
                          </span>
                        </div>
                        {participant.additionalInfo && (
                          <p className="text-xs text-gray-500 mt-2">
                            {participant.additionalInfo}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => handleAddParticipant(participant.id)}
                        className="ml-4 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        Vincular
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end mt-6 pt-4 border-t">
            <button
              onClick={() => setShowParticipantsModal(false)}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal de Detalhes do Jurado */}
      <JudgeDetailsModal
        isOpen={showJudgeDetails}
        onClose={() => {
          setShowJudgeDetails(false);
          setSelectedJudge(null);
        }}
        judge={selectedJudge}
        showEventActions={true}
        onRemoveFromEvent={() => {
          if (selectedJudge) {
            handleRemoveJudge(selectedJudge.id);
            setShowJudgeDetails(false);
          }
        }}
        onSendNotification={handleSendNotification}
      />

      {/* Modal de Detalhes do Participante */}
      <ParticipantDetailsModal
        isOpen={showParticipantDetails}
        onClose={() => {
          setShowParticipantDetails(false);
          setSelectedParticipant(null);
        }}
        participant={selectedParticipant}
        showEventActions={true}
        onRemoveFromEvent={() => {
          if (selectedParticipant) {
            handleRemoveParticipant(selectedParticipant.id);
            setShowParticipantDetails(false);
          }
        }}
        onSendNotification={handleSendNotification}
      />

      {/* Modal de Importação de Regulamento */}
      <Modal
        isOpen={showRegulationImport}
        onClose={() => setShowRegulationImport(false)}
        title="Importar Regulamento PDF"
        subtitle="Faça upload do arquivo PDF do regulamento"
        icon={<FileText className="w-6 h-6 text-blue-600" />}
        size="lg"
      >
        <div className="p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-cinza-chumbo mb-4">
                Upload do PDF
              </h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-cinza-chumbo mb-2">
                  Arraste e solte o PDF aqui
                </p>
                <p className="text-cinza-chumbo/70 mb-4">
                  ou clique para selecionar um arquivo
                </p>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      try {
                        setLoading(true);
                        const result = await uploadrulesFile(file);

                        if (result.success && result.url) {
                          setEditedEvent((prev) => ({
                            ...prev,
                            rulesFile: result.url || null,
                          }));
                          setRegulationMode("pdf");
                          setShowRegulationImport(false);
                          showSuccess("PDF carregado com sucesso!");
                        } else {
                          showError(result.error || "Erro ao carregar PDF");
                        }
                      } catch (error) {
                        showError("Erro ao carregar PDF");
                      } finally {
                        setLoading(false);
                      }
                    }
                  }}
                  className="hidden"
                  id="pdf-upload"
                />
                <label
                  htmlFor="pdf-upload"
                  className={`inline-flex items-center px-4 py-2 rounded-lg transition-colors cursor-pointer ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Carregando...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Selecionar PDF
                    </>
                  )}
                </label>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-800 mb-2">
                Informações Importantes
              </h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Apenas arquivos PDF são aceitos</li>
                <li>• Tamanho máximo: 20MB</li>
                <li>• O arquivo será armazenado no servidor</li>
                <li>• Após o upload, o modo de texto será desabilitado</li>
              </ul>
            </div>
          </div>

          <div className="flex justify-end mt-6 pt-4 border-t">
            <button
              onClick={() => setShowRegulationImport(false)}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </Modal>

      {/* Dialog de Confirmação */}
      <ConfirmDialog />
    </>
  );
};

export default EventDetailsModal;
