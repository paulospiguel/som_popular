import { UserCheck } from "lucide-react";
import { useState } from "react";
import { Control } from "react-hook-form";

import { EventJudgesModal } from "@/components/judge-form";
import AvatarGroup from "@/components/ui/avatar-group";
import { Button } from "@/components/ui/button";
import { useEventJudges } from "@/hooks/use-judges";
import { EventFormData } from "@/validators/events";

interface EventJodgesSectionProps {
  control: Control<EventFormData>;
  isEditing: boolean;
  formValues: EventFormData;
  eventId?: string;
  eventName?: string;
}

export function EventJodgesSection({
  control: _control,
  isEditing,
  formValues: _formValues,
  eventId,
  eventName,
}: EventJodgesSectionProps) {
  const [openJudgesModal, setOpenJudgesModal] = useState(false);
  const { data: eventJudges } = useEventJudges(eventId || "");

  const handleOpenJudgesModal = () => {
    setOpenJudgesModal(true);
  };

  const handleCloseJudgesModal = () => {
    setOpenJudgesModal(false);
  };

  return (
    <>
      <div>
        <h4 className="font-semibold text-cinza-chumbo mb-4 flex items-center">
          <UserCheck className="w-5 h-5 mr-2" /> Jurados
        </h4>

        <div className="space-y-4">
          <Button
            hidden={!isEditing || !eventId}
            className="w-full"
            variant="dashed"
            onClick={handleOpenJudgesModal}
          >
            Gerenciar Jurados
          </Button>
          {!eventId && (
            <p className="text-sm text-gray-500 text-center">
              Salve o evento primeiro para gerenciar jurados
            </p>
          )}
        </div>

        <div className="space-y-4 mt-4">
          <div className="space-y-2 mt-2">
            <AvatarGroup
              items={
                eventJudges?.data?.map((judge) => ({
                  id: judge.judge.id,
                  name: judge.judge.name,
                  avatar: judge.photoImage?.publicUrl || "",
                })) || []
              }
              size="md"
              type="judges"
            />
          </div>

          {eventJudges?.data?.length === 0 && (
            <p className="text-sm text-gray-500 text-center">
              Nenhum jurado adicionado
            </p>
          )}
        </div>
      </div>

      {/* Modal de Gerenciamento de Jurados */}
      {eventId && eventName && (
        <EventJudgesModal
          isOpen={openJudgesModal}
          onClose={handleCloseJudgesModal}
          eventId={eventId}
          eventName={eventName}
        />
      )}
    </>
  );
}
