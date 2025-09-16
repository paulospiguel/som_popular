"use client";

import {
  Copy,
  Edit,
  MoreVertical,
  Pause,
  Save,
  SaveOff,
  ToggleLeft as Toggle,
  Trash2,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Event } from "@/types";

interface EventActionsMenuProps {
  isEditing: boolean;
  event: Event;
  onEdit: () => void;
  onSave: () => void;
  onCancelEdit: () => void;
  onCopyEvent: () => void;
  onToggleVisibility: () => void;
  onPauseEvent: () => void;
  onDeleteEvent: () => void;
}

export function EventActionsMenu({
  isEditing,
  event,
  onEdit,
  onSave,
  onCancelEdit,
  onCopyEvent,
  onToggleVisibility,
  onPauseEvent,
  onDeleteEvent,
}: EventActionsMenuProps) {
  const handleSave = () => {
    console.log("Botão salvar clicado");
    onSave();
  };

  const handleEdit = () => {
    console.log("Botão editar clicado");
    onEdit();
  };

  const handleCancelEdit = () => {
    console.log("Botão cancelar edição clicado");
    onCancelEdit();
  };

  return (
    <>
      {isEditing ? (
        <>
          <button
            onClick={handleSave}
            className="p-2 hover:bg-gray-50 rounded-lg transition-colors group"
            title="Salvar alterações"
          >
            <Save className="w-5 h-5 text-gray-600 group-hover:text-gray-700" />
          </button>
          <button
            title="Cancelar edição"
            onClick={handleCancelEdit}
            className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
          >
            <SaveOff className="w-5 h-5 text-red-500 group-hover:text-red-700" />
          </button>
        </>
      ) : (
        <button
          onClick={handleEdit}
          className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
          title="Editar evento"
        >
          <Edit className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
        </button>
      )}

      {/* Menu de três pontos */}
      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreVertical className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={onCopyEvent} className="flex items-center">
            <Copy className="w-4 h-4 mr-2" />
            Copiar Evento
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onToggleVisibility}
            className="flex items-center"
          >
            <Toggle className="w-4 h-4 mr-2" />
            Alterar visibilidade
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onPauseEvent}
            className="flex items-center"
          >
            <Pause className="w-4 h-4 mr-2" />
            Pausar Evento
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onDeleteEvent}
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
}
