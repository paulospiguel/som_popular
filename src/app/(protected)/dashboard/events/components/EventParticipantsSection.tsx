import { UserCheck } from "lucide-react";
import { useState } from "react";
import { Control } from "react-hook-form";

import { EventParticipantsModal } from "@/components/participant-form";
import AvatarGroup from "@/components/ui/avatar-group";
import { Button } from "@/components/ui/button";
import { useEventParticipants } from "@/hooks/use-participants";
import { EventFormData } from "@/validators/events";

interface EventParticipantsSectionProps {
  control: Control<EventFormData>;
  isEditing: boolean;
  formValues: EventFormData;
  eventId?: string;
  eventName?: string;
}

export function EventParticipantsSection({
  control: _control,
  isEditing,
  formValues: _formValues,
  eventId,
  eventName,
}: EventParticipantsSectionProps) {
  const [openParticipantsModal, setOpenParticipantsModal] = useState(false);
  const { data: eventParticipants } = useEventParticipants(eventId || "");

  const handleOpenParticipantsModal = () => {
    setOpenParticipantsModal(true);
  };

  const handleCloseParticipantsModal = () => {
    setOpenParticipantsModal(false);
  };

  return (
    <>
      <div>
        <h4 className="font-semibold text-cinza-chumbo mb-4 flex items-center">
          <UserCheck className="w-5 h-5 mr-2" /> Participantes
        </h4>

        <div className="space-y-4">
          <Button
            hidden={!isEditing || !eventId}
            className="w-full"
            variant="dashed"
            onClick={handleOpenParticipantsModal}
          >
            Gerenciar Participantes
          </Button>
          {!eventId && (
            <p className="text-sm text-gray-500 text-center">
              Salve o evento primeiro para gerenciar participantes
            </p>
          )}
        </div>

        <div className="space-y-4 mt-4">
          <div className="space-y-2 mt-2">
            <AvatarGroup
              items={
                eventParticipants?.data?.map((participant) => ({
                  id: participant.id,
                  name: participant.name,
                  avatar: participant.photoImage?.publicUrl || "",
                  description: participant.email,
                })) || []
              }
              size="md"
              type="participants"
            />
          </div>

          {eventParticipants?.data?.length === 0 && (
            <p className="text-sm text-gray-500 text-center">
              Nenhum participante adicionado
            </p>
          )}
        </div>
      </div>

      {/* Modal de Gerenciamento de Participantes */}
      {eventId && eventName && (
        <EventParticipantsModal
          isOpen={openParticipantsModal}
          onClose={handleCloseParticipantsModal}
          eventId={eventId}
          eventName={eventName}
        />
      )}
    </>
  );
}
