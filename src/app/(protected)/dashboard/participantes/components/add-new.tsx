import { Modal } from "@/components/Modal";
import { Participant } from "@/db/schema";
import { Plus } from "lucide-react";
import { useState } from "react";

interface NewParticipant extends Partial<Participant> {}

const AddParticipantModal = ({
  isOpen,
  onClose,
  setParticipant,
}: {
  isOpen: boolean;
  onClose: () => void;
  setParticipant: (participant: NewParticipant) => void;
}) => {
  const [newParticipant, setNewParticipant] = useState<NewParticipant>(
    {} as NewParticipant
  );

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    category: "",
    experience: "",
    additionalInfo: "",
    acceptsEmailNotifications: true,
  });

  const handleAddParticipant = () => {
    const participant = {
      ...newParticipant,
      id: Date.now().toString(),
      status: "pending",
      registrationDate: new Date(),
      notes: "",
    };

    setParticipant(participant);
    setNewParticipant({} as NewParticipant);
    onClose();
  };

  /*   const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newParticipant = {
      ...formData,
      id: Date.now().toString(),
      status: "approved", // Auto-aprovação no registo
      archived: false,
      registrationDate: new Date(),
      notes: "",
    };

    onAdd(newParticipant);
    onClose();
  }; */

  return (
    <Modal
      size="large"
      isOpen={isOpen}
      onClose={onClose}
      title="Adicionar Participante"
    >
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
                value={newParticipant?.phone || ""}
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
                <option value="">Selecione uma categoria</option>
                <option value="vocal">Vocal</option>
                <option value="instrumental">Instrumental</option>
                <option value="banda">Banda</option>
                <option value="dj">DJ</option>
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
            {/* Remover campos de idade, cidade e distrito */}
            {/* Campo de informações adicionais */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Informações Adicionais
              </label>
              <textarea
                value={formData.additionalInfo}
                onChange={(e) =>
                  setFormData({ ...formData, additionalInfo: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Conte-nos sobre a sua experiência musical..."
              />
            </div>
          </div>
        </div>

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
              Aceito receber notificações por email sobre este evento e futuros
              eventos
            </label>
          </div>
          <p className="text-xs text-cinza-chumbo/60 mt-2">
            Ao aceitar, receberá informações sobre o estado da sua inscrição,
            detalhes do evento e convites para futuros festivais.
          </p>
        </div>

        {/* Botões */}
        <div className="flex gap-4 pt-4 border-t">
          <button
            type="button"
            onClick={onClose}
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
    </Modal>
  );
};

export default AddParticipantModal;
