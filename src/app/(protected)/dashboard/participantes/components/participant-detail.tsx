import { Modal } from "@/components/Modal";
import { Participant } from "@/database/schema";
import { FileText, Printer, QrCode, Send } from "lucide-react"; // Adicionado X
import { useState } from "react"; // Adicionar useState
import { getCategoryText, getExperienceText } from "../utils";

interface ParticipantDetailsModalProps {
  participant: Participant;
  isOpen: boolean;
  onClose: () => void;
}

export default function ParticipantDetailsModal({
  participant,
  isOpen,
  onClose,
}: ParticipantDetailsModalProps) {
  // Adicionar estados para o modal de indeferimento
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

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

  const handleEmailReceipt = async (participant: any) => {
    if (!participant) return;

    try {
      const loadingToast = document.createElement("div");
      loadingToast.className =
        "fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50";
      loadingToast.textContent = "A enviar comprovante...";
      document.body.appendChild(loadingToast);

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

      setTimeout(() => {
        if (document.body.contains(successToast)) {
          document.body.removeChild(successToast);
        }
      }, 3000);
    } catch (error) {
      console.error("Erro ao enviar comprovante:", error);

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

  const handleGenerateCredential = () => {
    // Lógica para gerar credencial de identificação
    console.log("Gerando credencial para:", participant?.name);
    // Aqui você pode implementar a lógica para gerar a credencial
  };

  // Função para lidar com o indeferimento
  const handleRejectWithReason = () => {
    if (rejectionReason.trim()) {
      //  handleReject(participant?.id, rejectionReason);
      setShowRejectModal(false);
      setRejectionReason("");
      onClose();
    }
  };

  const headerActions =
    participant.status !== "pending" ? (
      <>
        <button
          onClick={handlePrintReceipt}
          className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
          title="Imprimir comprovante"
        >
          <Printer className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
        </button>

        <button
          onClick={handleGenerateCredential}
          className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
          title="Gerar credencial"
        >
          <QrCode className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
        </button>

        {participant?.acceptsEmailNotifications && (
          <button
            onClick={() => handleEmailReceipt(participant)}
            className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
            title="Notificar por email"
          >
            <Send className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
          </button>
        )}
      </>
    ) : null;

  return (
    <>
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
        headerActions={headerActions}
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
                    {participant?.registrationDate?.toLocaleDateString(
                      "pt-PT",
                      {
                        weekday: "long",
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
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

            {/* Adicionar campo de justificativa de rejeição se existir */}
            {participant.status === "rejected" &&
              participant.rejectionReason && (
                <div className="space-y-2 bg-red-50 p-3 rounded-md">
                  <h4 className="font-medium text-red-900">
                    Motivo da Rejeição
                  </h4>
                  <p className="text-red-700">{participant.rejectionReason}</p>
                  {participant.rejectedAt && (
                    <p className="text-sm text-red-600">
                      Rejeitado em:{" "}
                      {new Date(participant.rejectedAt).toLocaleDateString(
                        "pt-PT"
                      )}
                    </p>
                  )}
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
              {/* Informações Adicionais */}
              {participant.additionalInfo && (
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">
                    Informações Adicionais
                  </h4>
                  <p className="text-gray-600">{participant.additionalInfo}</p>
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
          {participant.status === "pending" && (
            <div className="flex gap-4 mt-8 pt-6 print:hidden">
              <>
                <button
                  onClick={() => {
                    //handleApprove(participant?.id);
                    onClose();
                  }}
                  className="flex-1 bg-green-600 text-white py-3 px-4 rounded-xl hover:bg-green-700 transition-colors"
                >
                  Aprovar
                </button>

                <button
                  onClick={() => setShowRejectModal(true)}
                  className="flex-1 bg-red-600 text-white py-3 px-4 rounded-xl hover:bg-red-700 transition-colors"
                >
                  Rejeitar
                </button>
              </>
            </div>
          )}
        </div>
      </Modal>

      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {participant.status === "approved"
                ? "Indeferir Inscrição"
                : "Rejeitar Inscrição"}
            </h3>

            <p className="text-gray-600 mb-4">
              Por favor, indique o motivo do{" "}
              {participant.status === "approved" ? "indeferimento" : "rejeição"}{" "}
              da inscrição de <strong>{participant.name}</strong>:
            </p>

            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Motivo do indeferimento..."
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              rows={4}
              required
            />

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason("");
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>

              <button
                onClick={handleRejectWithReason}
                disabled={!rejectionReason.trim()}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {participant.status === "approved" ? "Indeferir" : "Rejeitar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
