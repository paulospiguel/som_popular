import { Modal } from "@/components/Modal";
import { Participant } from "@/db/schema";
import { FileText, Printer, Send, CreditCard } from "lucide-react"; // Adicionado CreditCard
import { getCategoryText, getExperienceText } from "../utils";

interface ParticipantDetailsModalProps {
  participant: Participant;
  isOpen: boolean;
  onClose: () => void;
  handleReject: (id: string) => void;
  handleApprove: (id: string) => void;
}

export default function ParticipantDetailsModal({
  participant,
  isOpen,
  onClose,
  handleReject,
  handleApprove,
}: ParticipantDetailsModalProps) {
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

  // Função para gerar credencial
  const handleGenerateCredential = () => {
    // Lógica para gerar credencial de identificação
    console.log("Gerando credencial para:", participant?.name);
    // Aqui você pode implementar a lógica para gerar a credencial
  };

  // Ações do header (ícones discretos)
  const headerActions = participant.status !== "pending" ? (
    <>
      <button
        onClick={handlePrintReceipt}
        className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
        title="Imprimir comprovante"
      >
        <Printer className="w-5 h-5 text-blue-600 group-hover:text-blue-700" />
      </button>
      
      <button
        onClick={handleGenerateCredential}
        className="p-2 hover:bg-purple-50 rounded-lg transition-colors group"
        title="Gerar credencial"
      >
        <CreditCard className="w-5 h-5 text-purple-600 group-hover:text-purple-700" />
      </button>
      
      {participant?.acceptsEmailNotifications && (
        <button
          onClick={() => handleEmailReceipt(participant?.id)}
          className="p-2 hover:bg-green-50 rounded-lg transition-colors group"
          title="Notificar por email"
        >
          <Send className="w-5 h-5 text-verde-suave group-hover:text-verde-suave/80" />
        </button>
      )}
    </>
  ) : null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        // setparticipant?(null);
      }}
      title="Detalhes da Inscrição"
      subtitle={participant?.name}
      icon={<FileText className="w-6 h-6 text-verde-suave" />}
      size="large"
      headerActions={headerActions} // Passando as ações para o header
    >
      <div className="p-8 print:p-12">
        <div className="space-y-8">
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
                  #{participant?.id.toUpperCase()}
                </p>
              </div>
              <div>
                <label className="text-sm text-cinza-chumbo/70 font-medium">
                  Data de Inscrição
                </label>
                <p className="font-semibold">
                  {participant?.registrationDate?.toLocaleDateString("pt-PT", {
                    weekday: "long",
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <div>
                <label className="text-sm text-cinza-chumbo/70 font-medium">
                  Modalidade de Inscrição
                </label>
                <p className="font-semibold">
                  {participant?.createdAt &&
                  participant?.registrationDate &&
                  Math.abs(
                    participant.createdAt.getTime() -
                      participant.registrationDate.getTime()
                  ) < 60000
                    ? "Automática"
                    : "Online"}
                </p>
              </div>
              <div>
                <label className="text-sm text-cinza-chumbo/70 font-medium">
                  Status
                </label>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    participant?.status === "approved"
                      ? "text-green-600 bg-green-50"
                      : participant?.status === "rejected"
                        ? "text-red-600 bg-red-50"
                        : "text-yellow-600 bg-yellow-50"
                  }`}
                >
                  {participant?.status === "approved"
                    ? "Aprovado"
                    : participant?.status === "rejected"
                      ? "Rejeitado"
                      : "Pendente"}
                </span>
              </div>
            </div>
          </div>

          {/* Motivo de Rejeição - Novo bloco */}
          {participant?.status === "rejected" && participant?.notes && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <h3 className="font-bold text-red-800 mb-3 text-lg">
                Motivo da Rejeição
              </h3>
              <p className="text-red-700 font-medium">{participant.notes}</p>
            </div>
          )}

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
                  <p className="font-semibold text-lg">{participant?.name}</p>
                </div>
                <div>
                  <label className="text-sm text-cinza-chumbo/70 font-medium">
                    Email
                  </label>
                  <p className="font-medium">{participant?.email}</p>
                </div>
                <div>
                  <label className="text-sm text-cinza-chumbo/70 font-medium">
                    Telefone
                  </label>
                  <p className="font-medium">{participant?.phone || "N/A"}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-cinza-chumbo/70 font-medium">
                    Idade
                  </label>
                  <p className="font-semibold">{participant?.age} anos</p>
                </div>
                <div>
                  <label className="text-sm text-cinza-chumbo/70 font-medium">
                    Localização
                  </label>
                  <p className="font-medium">
                    {participant?.city}, {participant?.district}
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
                  {getCategoryText(participant?.category)}
                </p>
              </div>
              <div>
                <label className="text-sm text-cinza-chumbo/70 font-medium">
                  Nível de Experiência
                </label>
                <p className="font-semibold">
                  {getExperienceText(participant?.experience)}
                </p>
              </div>
            </div>
            {participant?.biography && (
              <div className="mt-4">
                <label className="text-sm text-cinza-chumbo/70 font-medium">
                  Biografia
                </label>
                <p className="font-medium mt-2 text-justify">
                  {participant?.biography}
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
          {participant?.acceptsEmailNotifications !== undefined && (
            <div className="text-sm text-cinza-chumbo/70 bg-gray-50 rounded-lg p-4">
              <p>
                <strong>Notificações por Email:</strong>{" "}
                {participant?.acceptsEmailNotifications ? (
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
        <div className="flex  gap-4 mt-8 pt-6 border-t print:hidden">
          {participant.status !== "pending" ? (
            <>
              <button
                onClick={handlePrintReceipt}
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Printer className="w-5 h-5" />
                <span>Imprimir</span>
              </button>

              {participant?.acceptsEmailNotifications && (
                <button
                  onClick={() => handleEmailReceipt(participant?.id)}
                  className="flex-1 bg-verde-suave text-white py-3 px-4 rounded-xl hover:bg-verde-suave/90 transition-colors flex items-center justify-center space-x-2"
                >
                  <Send className="w-5 h-5" />
                  <span>Notificar por Email</span>
                </button>
              )}
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  handleApprove(participant?.id);
                  onClose();
                }}
                className="flex-1 bg-green-600 text-white py-3 px-4 rounded-xl hover:bg-green-700 transition-colors"
              >
                Aprovar
              </button>

              <button
                onClick={() => {
                  handleReject(participant?.id);
                  onClose();
                }}
                className="flex-1 bg-red-600 text-white py-3 px-4 rounded-xl hover:bg-red-700 transition-colors"
              >
                Rejeitar
              </button>
            </>
          )}
          <button
            onClick={onClose}
            className="bg-gray-600 text-white py-3 px-4 rounded-xl hover:bg-gray-700 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </Modal>
  );
}
