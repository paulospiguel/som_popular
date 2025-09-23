"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Accessibility,
  ArrowLeft,
  Calendar,
  CheckCircle,
  ExternalLink,
  Home,
  Info,
  Mail,
  Music,
  Search,
  Star,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import QRCode from "qrcode";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import PhoneInput from "@/components/PhoneInput";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DiscreteImageUpload } from "@/components/ui/discrete-image-upload";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// Categoria não utilizada nesta tela (campo removido)
import { EXPERIENCE_LEVELS, PARTICIPANT_CATEGORIES } from "@/constants";
import {
  getAvailableEventsForRegistration,
  getRegistrationByEmail,
} from "@/server/events-public";
import {
  getParticipantByEmail,
  registerParticipant,
} from "@/server/participants-public";
import {
  ParticipantRegistrationFormData,
  participantRegistrationSchema,
} from "@/validators/participants";

type FormData = ParticipantRegistrationFormData;

// Interfaces para os tipos de dados
interface Event {
  id: string;
  name: string;
  category: string;
  startDate: Date;
  canRegister: boolean;
  registrationStatus: "open" | "not_open" | "closed" | "full";
  registrationStartDate?: Date | null;
}

interface RegistrationResult {
  success: boolean;
  participantId?: string | undefined;
  registrationId?: string | undefined;
  isNewParticipant?: boolean | undefined;
  message?: string | undefined;
  error?: string | undefined;
}

interface Participant {
  name: string;
  category: string;
}

export default function ParticipantRegistrationPage() {
  const searchParams = useSearchParams();
  const preselectedEventId = searchParams.get("event");
  const [activeTab, setActiveTab] = useState<"new" | "existing">("new");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [participantId, setParticipantId] = useState<string>("");
  const [existingSearch, setExistingSearch] = useState("");
  const [searchingExisting, setSearchingExisting] = useState(false);
  const [existingParticipant, setExistingParticipant] =
    useState<Participant | null>(null);
  const [availableEvents, setAvailableEvents] = useState<Event[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [emailExists, setEmailExists] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [registrationResult, setRegistrationResult] =
    useState<RegistrationResult | null>(null);
  const [qrUrl, setQrUrl] = useState<string>("");
  const [eventLocked, setEventLocked] = useState(false);
  const [existingNotice, setExistingNotice] = useState("");
  const [photoImageUrl, setPhotoImageUrl] = useState<string>("");

  // Configuração do react-hook-form com validação Zod
  const form = useForm<FormData>({
    resolver: zodResolver(participantRegistrationSchema),
    defaultValues: {
      name: "",
      stageName: "",
      email: "",
      phone: "",
      category: "",
      experience: "",
      additionalInfo: "",
      hasSpecialNeeds: false,
      specialNeedsDescription: "",
      acceptsEmailNotifications: true,
      acceptsTerms: false,
      eventId: "",
      photoImageId: "",
    },
    mode: "onChange", // Validação em tempo real
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = form;

  const handleUploadPhotoImage = (value: string) => {
    setPhotoImageUrl(value);
    setValue("photoImageId", value);
  };

  // Carregar eventos disponíveis ao montar o componente
  useEffect(() => {
    loadAvailableEvents();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Aplicar seleção de evento via querystring
  useEffect(() => {
    if (preselectedEventId) {
      setValue("eventId", preselectedEventId);
      setEventLocked(true);
    }
  }, [preselectedEventId, setValue]);

  const loadAvailableEvents = async () => {
    try {
      setLoadingEvents(true);
      const result = await getAvailableEventsForRegistration();

      if (result.success && result.events) {
        setAvailableEvents(result.events);

        // Se só há um evento, selecionar automaticamente
        if (result.events && result.events.length === 1) {
          setValue("eventId", result.events![0].id);
        }
      }
    } catch (error) {
      console.error("Erro ao carregar eventos:", error);
      toast.error("Erro ao carregar eventos disponíveis");
    } finally {
      setLoadingEvents(false);
    }
  };

  const checkEmailExists = async (email: string) => {
    if (!email || !email.includes("@")) {
      setEmailExists(false);
      return;
    }

    try {
      setCheckingEmail(true);
      const result = await getParticipantByEmail(email);
      setEmailExists(result.success);
    } catch (error) {
      setEmailExists(false);
    } finally {
      setCheckingEmail(false);
    }
  };

  // Watch para monitorar mudanças no email
  const watchedEmail = watch("email");

  // Verificar email quando mudar
  useEffect(() => {
    if (watchedEmail && watchedEmail.includes("@")) {
      checkEmailExists(watchedEmail);
    } else {
      setEmailExists(false);
    }
  }, [watchedEmail]);

  // Função para validar evento selecionado
  const validateEventSelection = (eventId: string) => {
    const selectedEvent = availableEvents.find((e: Event) => e.id === eventId);
    if (selectedEvent && !selectedEvent.canRegister) {
      if (selectedEvent.registrationStatus === "not_open") {
        return `As inscrições para este evento abrem em ${selectedEvent.registrationStartDate ? selectedEvent.registrationStartDate.toLocaleDateString("pt-BR") : "data não definida"}`;
      } else if (selectedEvent.registrationStatus === "closed") {
        return "As inscrições para este evento já encerraram";
      } else if (selectedEvent.registrationStatus === "full") {
        return "Este evento já está lotado";
      }
    }
    return null;
  };

  const onSubmit = async (data: FormData) => {
    // Validação adicional do evento
    const eventError = validateEventSelection(data.eventId);
    if (eventError) {
      toast.error(eventError, {
        duration: 5000,
        style: {
          background: "#ef4444",
          color: "white",
          border: "1px solid #dc2626",
        },
      });
      return;
    }

    setLoading(true);

    try {
      // Converter campos opcionais para string vazia quando undefined
      const payload = {
        ...data,
        stageName: data.stageName || "",
        phone: data.phone || "",
        category: data.category || "",
        experience: data.experience || "",
        additionalInfo: data.additionalInfo || "",
        specialNeedsDescription: data.specialNeedsDescription || "",
        photoImageId: data.photoImageId || "",
      };
      const result = await registerParticipant(payload);

      if (result.success) {
        setParticipantId(result.participantId || "");
        setRegistrationResult(result);
        setSuccess(true);
        // Gerar QR mínimo se houver registrationId
        if (result.registrationId) {
          const qrData = JSON.stringify({
            registrationId: result.registrationId,
            email: data.email,
            eventId: data.eventId,
          });
          try {
            const url = await QRCode.toDataURL(qrData, { width: 160 });
            setQrUrl(url);
          } catch {}
        }
        toast.success(result.message || "Registro realizado com sucesso!");
      } else {
        toast.error(result.error || "Erro ao registrar participante");
      }
    } catch (error) {
      toast.error("Erro interno. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchExisting = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!existingSearch.trim()) {
      toast.error("Digite um email ou número de registro para buscar");
      return;
    }

    setSearchingExisting(true);

    try {
      // Se é email (contém @)
      if (existingSearch.includes("@")) {
        const result = await getRegistrationByEmail(
          existingSearch,
          preselectedEventId || undefined
        );

        if (result.success) {
          // Segurança de dados: não exibir informações; enviar email se aplicável
          setExistingParticipant(null);
          setExistingNotice(
            "Se houver inscrições ativas para este email, você receberá um email com o número da inscrição."
          );
          toast.success(
            "Se houver inscrições ativas para este email, você receberá um email."
          );
        } else {
          toast.error(
            result.error || "Nenhuma inscrição encontrada para este email"
          );
          setExistingParticipant(null);
          setExistingNotice("");
        }
      } else {
        // É número de registro - enviar por email
        toast.info(
          "Use o número de inscrição na página 'Consultar Inscrições' para visualizar sua credencial."
        );
        setExistingParticipant(null);
      }
    } catch (error) {
      toast.error("Erro ao buscar participante");
    } finally {
      setSearchingExisting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bege-claro via-verde-muito-suave to-dourado-muito-claro py-12">
        <div className="container mx-auto px-4 text-center">
          <Link
            href="/"
            className="inline-flex items-center text-verde-suave hover:text-verde-escuro mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar à Home
          </Link>

          <div className="festival-card p-8 max-w-2xl mx-auto">
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-cinza-chumbo mb-4">
                {registrationResult?.isNewParticipant
                  ? "Registro Concluído!"
                  : "Atualização Concluída!"}
              </h1>
              <p className="text-lg text-cinza-chumbo/80 mb-6">
                {registrationResult?.isNewParticipant
                  ? "Seu registro como participante foi realizado com sucesso e você foi automaticamente inscrito no evento selecionado!"
                  : "Suas informações foram atualizadas com sucesso e você foi inscrito no evento selecionado!"}
              </p>

              {registrationResult?.registrationId && (
                <div className="bg-white rounded-lg border p-4 mb-6 inline-block text-left">
                  <div className="flex items-start space-x-4">
                    {qrUrl ? (
                      <Image
                        width={112}
                        height={112}
                        src={qrUrl}
                        alt="QR Code"
                        className="w-28 h-28 border rounded"
                      />
                    ) : (
                      <div className="w-28 h-28 border rounded animate-pulse bg-gray-50" />
                    )}
                    <div>
                      <p className="text-sm text-cinza-chumbo/70">
                        Número da Inscrição
                      </p>
                      <p className="font-bold text-cinza-chumbo text-xl">
                        #
                        {registrationResult.registrationId
                          .slice(-8)
                          .toUpperCase()}
                      </p>
                      <p className="text-xs text-cinza-chumbo/60 mt-2">
                        Guarde este número. Ele aparece na sua credencial e pode
                        ser usado para consulta.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mt-4">
                    <Link
                      href={`/events/${watch("eventId")}/registration/confirmation?registration=${registrationResult.registrationId}`}
                    >
                      <Button size="sm" variant="outline">
                        Ver Credencial Completa
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      onClick={() => {
                        const w = window.open("", "_blank");
                        if (!w) return;
                        const html = `<!doctype html><html><head><meta charset='utf-8'><title>Credencial</title><style>body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,'Helvetica Neue',Arial,'Noto Sans','Apple Color Emoji','Segoe UI Emoji';padding:24px} .card{border:1px solid #e5e7eb;border-radius:12px;padding:16px;max-width:360px} .row{display:flex;gap:12px;align-items:center}</style></head><body><div class='card'><div class='row'><img src='${qrUrl}' width='120' height='120'/><div><h3 style='margin:0'>${availableEvents.find((e: Event) => e.id === watch("eventId"))?.name || "Evento"}</h3><div style='font-size:12px;color:#6b7280;margin-top:4px'>${watch("name")} • ${watch("email")}</div><div style='font-size:12px;color:#6b7280;margin-top:4px'>Inscrição #${registrationResult?.registrationId?.slice(-8).toUpperCase()}</div></div></div></div><script>window.onload=()=>window.print()</script></body></html>`;
                        w.document.write(html);
                        w.document.close();
                      }}
                    >
                      Baixar PDF
                    </Button>
                  </div>
                </div>
              )}

              {/* Informações do Evento */}
              {watch("eventId") &&
                availableEvents.find(
                  (e: Event) => e.id === watch("eventId")
                ) && (
                  <div className="bg-verde-suave/10 border border-verde-suave/20 rounded-lg p-4 mb-6">
                    <h4 className="font-semibold text-verde-suave mb-2">
                      Evento Selecionado
                    </h4>
                    <div className="text-sm text-cinza-chumbo/80">
                      <p>
                        <strong>Nome:</strong>{" "}
                        {
                          availableEvents.find(
                            (e: Event) => e.id === watch("eventId")
                          )?.name
                        }
                      </p>
                      <p>
                        <strong>Modalidade:</strong>{" "}
                        {
                          availableEvents.find(
                            (e: Event) => e.id === watch("eventId")
                          )?.category
                        }
                      </p>
                      <p>
                        <strong>Data:</strong>{" "}
                        {availableEvents.find(
                          (e: Event) => e.id === watch("eventId")
                        )?.startDate
                          ? availableEvents
                              .find((e: Event) => e.id === watch("eventId"))!
                              .startDate.toLocaleDateString("pt-BR")
                          : "N/A"}
                      </p>
                      <p>
                        <strong>Status das Inscrições:</strong>{" "}
                        {(() => {
                          const event = availableEvents.find(
                            (e: Event) => e.id === watch("eventId")
                          );
                          if (!event) return "N/A";

                          if (event.registrationStatus === "open") {
                            return (
                              <span className="text-green-600 font-medium">
                                🟢 Inscrições Abertas
                              </span>
                            );
                          } else if (event.registrationStatus === "not_open") {
                            const startDate = event.registrationStartDate
                              ? event.registrationStartDate.toLocaleDateString(
                                  "pt-BR"
                                )
                              : "data não definida";
                            return (
                              <span className="text-blue-600 font-medium">
                                🔵 Inscrições abrem em {startDate}
                              </span>
                            );
                          } else if (event.registrationStatus === "closed") {
                            return (
                              <span className="text-red-600 font-medium">
                                🔴 Inscrições Encerradas
                              </span>
                            );
                          } else if (event.registrationStatus === "full") {
                            return (
                              <span className="text-orange-600 font-medium">
                                🟠 Evento Lotado
                              </span>
                            );
                          }
                          return "N/A";
                        })()}
                      </p>
                    </div>
                  </div>
                )}

              <Badge className="bg-green-100 text-green-800 text-lg px-4 py-2 mb-6">
                ID: {participantId.slice(-8).toUpperCase()}
              </Badge>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-cinza-chumbo">
                  Próximos Passos
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="text-center">
                    <Music className="w-8 h-8 text-verde-suave mx-auto mb-2" />
                    <h4 className="font-medium text-cinza-chumbo">
                      Ver Eventos
                    </h4>
                    <p className="text-sm text-cinza-chumbo/70">
                      Navegue pelos eventos disponíveis e inscreva-se
                    </p>
                  </div>

                  <div className="text-center">
                    <Star className="w-8 h-8 text-dourado-claro mx-auto mb-2" />
                    <h4 className="font-medium text-cinza-chumbo">Acompanhe</h4>
                    <p className="text-sm text-cinza-chumbo/70">
                      Consulte suas inscrições e acompanhe os rankings
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Link href="/#eventos" className="flex-1">
                  <Button className="festival-button w-full">
                    <Music className="w-4 h-4 mr-2" />
                    Ver Meu Evento
                  </Button>
                </Link>

                <Link href="/search-registration" className="flex-1">
                  <Button className="festival-button-secondary w-full">
                    <Search className="w-4 h-4 mr-2" />
                    Consultar Inscrições
                  </Button>
                </Link>
              </div>

              <Link href="/" className="block mt-6">
                <Button variant="outline" className="w-full">
                  <Home className="w-4 h-4 mr-2" />
                  Voltar à Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-bege-claro via-verde-muito-suave to-dourado-muito-claro py-12">
      <div className="container mx-auto px-4">
        <Link
          href="/"
          className="inline-flex items-center text-verde-suave hover:text-verde-escuro mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar à Home
        </Link>

        <div className="festival-card p-6 max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-cinza-chumbo mb-2">
              Registro de Participante
            </h1>
            <p className="text-cinza-chumbo/70">
              Registre-se como participante para poder se inscrever nos eventos
              do festival
            </p>
          </div>

          {/* Tabs para Novo vs Existente */}
          <div className="flex border-b border-cinza-chumbo/20 mb-6">
            <button
              className={`flex-1 pb-4 px-4 font-medium transition-colors ${
                activeTab === "new"
                  ? "text-verde-suave border-b-2 border-verde-suave"
                  : "text-cinza-chumbo/60 hover:text-cinza-chumbo"
              }`}
              onClick={() => setActiveTab("new")}
            >
              <User className="w-4 h-4 inline mr-2" />
              Novo Participante
            </button>
            <button
              className={`flex-1 pb-4 px-4 font-medium transition-colors ${
                activeTab === "existing"
                  ? "text-verde-suave border-b-2 border-verde-suave"
                  : "text-cinza-chumbo/60 hover:text-cinza-chumbo"
              }`}
              onClick={() => setActiveTab("existing")}
            >
              <Search className="w-4 h-4 inline mr-2" />
              Já sou Participante
            </button>
          </div>

          {activeTab === "new" ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Informações Pessoais */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-cinza-chumbo flex items-center">
                  <User className="w-5 h-5 mr-2 text-verde-suave" />
                  Informações Pessoais
                </h3>

                <div>
                  <Label>Foto para o Ranking (Opcional)</Label>
                  <DiscreteImageUpload
                    value={photoImageUrl}
                    onChange={handleUploadPhotoImage}
                    maxSize={3}
                    acceptedTypes={[
                      "image/jpeg",
                      "image/jpg",
                      "image/png",
                      "image/webp",
                    ]}
                    placeholder="Adicionar foto para ranking"
                  />
                  <p className="text-xs text-cinza-chumbo/60 mt-1">
                    Adicione uma foto para aparecer no ranking. Deixe em branco
                    se não quiser.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label isRequired>Nome do Representante</Label>
                    <Input
                      {...register("name")}
                      id="name"
                      type="text"
                      placeholder="Nome do representante"
                      className={`${errors.name ? "border-red-500 ring-red-200" : "border-gray-300"} focus:ring-2 focus:ring-verde-suave focus:border-transparent`}
                    />
                    {errors.name && (
                      <p className="text-red-600 text-sm mt-1 font-medium flex items-center">
                        <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label>Nome Artístico</Label>
                    <Input
                      {...register("stageName")}
                      id="stageName"
                      type="text"
                      placeholder="Ex: Banda X, Duo Y, Nome Artístico"
                      className={`${errors.stageName ? "border-red-500 ring-red-200" : "border-gray-300"} focus:ring-2 focus:ring-verde-suave focus:border-transparent`}
                    />
                    {errors.stageName && (
                      <p className="text-red-600 text-sm mt-1 font-medium flex items-center">
                        <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                        {errors.stageName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label isRequired>Email</Label>
                    <Input
                      {...register("email")}
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      className={`${errors.email ? "border-red-500 ring-red-200" : "border-gray-300"} focus:ring-2 focus:ring-verde-suave focus:border-transparent`}
                    />
                    {errors.email && (
                      <p className="text-red-600 text-sm mt-1 font-medium flex items-center">
                        <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                        {errors.email.message}
                      </p>
                    )}

                    {emailExists && !errors.email && (
                      <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-start space-x-2">
                          <Info className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-yellow-800 text-sm font-medium mb-2">
                              Este email já está cadastrado!
                            </p>
                            <p className="text-yellow-700 text-sm mb-3">
                              Você já possui um cadastro no sistema. Deseja
                              consultar suas inscrições existentes?
                            </p>
                            <div className="flex space-x-2">
                              <Link href="/search-registration">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-yellow-700 border-yellow-300 hover:bg-yellow-100"
                                >
                                  <Search className="w-4 h-4 mr-1" />
                                  Consultar Inscrições
                                </Button>
                              </Link>
                              <button
                                type="button"
                                onClick={() => setActiveTab("existing")}
                                className="text-yellow-700 hover:text-yellow-800 text-sm font-medium underline"
                              >
                                Já sou participante
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {checkingEmail && (
                      <p className="text-blue-600 text-sm mt-1 flex items-center">
                        <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                        Verificando email...
                      </p>
                    )}
                  </div>

                  <div>
                    <Label>Telefone</Label>
                    <PhoneInput
                      value={watch("phone") || ""}
                      onChange={(value) => setValue("phone", value || "")}
                      placeholder="(11) 99999-9999"
                      error={!!errors.phone}
                      className="w-full"
                    />
                    {errors.phone && (
                      <p className="text-red-600 text-sm mt-1 font-medium flex items-center">
                        <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Seleção de Evento */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-cinza-chumbo flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-verde-suave" />
                  Evento para Inscrição
                </h3>

                {loadingEvents ? (
                  <div className="text-center py-4">
                    <div className="w-6 h-6 border-2 border-verde-suave border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <p className="text-cinza-chumbo/70">
                      Carregando eventos...
                    </p>
                  </div>
                ) : availableEvents.length === 0 ? (
                  <div className="text-center py-6 bg-gray-50 rounded-lg">
                    <Calendar className="w-12 h-12 text-cinza-chumbo/50 mx-auto mb-3" />
                    <h4 className="font-medium text-cinza-chumbo mb-2">
                      Nenhum evento disponível
                    </h4>
                    <p className="text-cinza-chumbo/70 mb-4">
                      Não há eventos futuros disponíveis no momento.
                    </p>
                    <Link href="/#eventos">
                      <Button variant="outline" size="sm">
                        Ver Todos os Eventos
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div>
                    <Label isRequired>Selecione o Evento</Label>
                    <Select
                      value={watch("eventId")}
                      onValueChange={(value) => setValue("eventId", value)}
                      disabled={eventLocked || availableEvents.length === 1}
                    >
                      <SelectTrigger
                        id="eventId"
                        className={`${errors.eventId ? "border-red-500 ring-red-200" : "w-full border-gray-300"} w-full min-h-16 focus:ring-2 focus:ring-verde-suave focus:border-transparent`}
                      >
                        <SelectValue
                          placeholder={
                            availableEvents.length === 1
                              ? "Evento selecionado automaticamente"
                              : "Selecione um evento"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {availableEvents.map((event: Event) => {
                          const eventDate = event.startDate;
                          const registrationStart = event.registrationStartDate;

                          let statusText = "";
                          let statusColor = "";

                          if (event.registrationStatus === "open") {
                            statusText = "Inscrições Abertas";
                            statusColor = "text-green-600";
                          } else if (event.registrationStatus === "not_open") {
                            statusText = `Inscrições abrem em ${registrationStart?.toLocaleDateString("pt-BR")}`;
                            statusColor = "text-blue-600";
                          } else if (event.registrationStatus === "closed") {
                            statusText = "Inscrições Encerradas";
                            statusColor = "text-red-600";
                          } else if (event.registrationStatus === "full") {
                            statusText = "Evento Lotado";
                            statusColor = "text-orange-600";
                          }

                          return (
                            <SelectItem key={event.id} value={event.id}>
                              <div className="flex flex-col items-start">
                                <span className="font-medium">
                                  {event.name}
                                </span>
                                <span className="text-xs text-cinza-chumbo/60">
                                  {event.category} •{" "}
                                  {eventDate.toLocaleDateString("pt-BR")}
                                </span>
                                <span
                                  className={`text-xs ${statusColor} font-medium`}
                                >
                                  {statusText}
                                </span>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    {errors.eventId && (
                      <p className="text-red-600 text-sm mt-1 font-medium flex items-center">
                        <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                        {errors.eventId.message}
                      </p>
                    )}
                    {availableEvents.length === 1 && !eventLocked && (
                      <p className="text-xs text-cinza-chumbo/60 mt-1">
                        Este é o único evento disponível no momento.
                      </p>
                    )}
                    {!eventLocked && (
                      <p className="text-xs text-cinza-chumbo/60 mt-2">
                        💡 Você pode selecionar um evento mesmo que as
                        inscrições ainda não tenham começado. O sistema validará
                        se as inscrições estão abertas quando você submeter o
                        formulário.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Informações Artísticas */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-cinza-chumbo flex items-center">
                  <Music className="w-5 h-5 mr-2 text-dourado-claro" />
                  Informações Artísticas
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Nível de Experiência</Label>
                    <Select
                      value={watch("experience") || ""}
                      onValueChange={(value) => setValue("experience", value)}
                    >
                      <SelectTrigger
                        id="experience"
                        className={`${errors.experience ? "border-red-500 ring-red-200" : "border-gray-300"} w-full focus:ring-2 focus:ring-verde-suave focus:border-transparent`}
                      >
                        <SelectValue placeholder="Selecione seu nível" />
                      </SelectTrigger>
                      <SelectContent>
                        {EXPERIENCE_LEVELS.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Categoria</Label>
                    <Select
                      value={watch("category") || ""}
                      onValueChange={(value) => setValue("category", value)}
                    >
                      <SelectTrigger
                        id="category"
                        className={`w-full focus:ring-2 focus:ring-verde-suave focus:border-transparent`}
                      >
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {PARTICIPANT_CATEGORIES.map((c) => (
                          <SelectItem key={c.value} value={c.value}>
                            {c.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Informações Adicionais</Label>

                  <textarea
                    {...register("additionalInfo")}
                    placeholder="Conte-nos um pouco sobre sua experiência musical, instrumentos que toca, etc."
                    className={`w-full p-3 border rounded-lg resize-none h-24 ${
                      errors.additionalInfo
                        ? "border-red-500"
                        : "border-cinza-chumbo/20"
                    }`}
                    maxLength={500}
                  />
                  <p className="text-xs text-cinza-chumbo/60 mt-1">
                    {watch("additionalInfo")?.length || 0}/500 caracteres
                  </p>
                  {errors.additionalInfo && (
                    <p className="text-red-600 text-sm mt-1 font-medium flex items-center">
                      <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                      {errors.additionalInfo.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Necessidades Especiais */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-cinza-chumbo flex items-center">
                  <Accessibility className="w-5 h-5 mr-2 text-gray-600" />
                  Acessibilidade
                </h3>

                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="specialNeeds"
                      checked={watch("hasSpecialNeeds")}
                      onCheckedChange={(checked) =>
                        setValue("hasSpecialNeeds", !!checked)
                      }
                    />
                    <label
                      htmlFor="specialNeeds"
                      className="text-sm text-cinza-chumbo"
                    >
                      Possuo necessidades especiais ou preciso de adaptações
                    </label>
                  </div>

                  {watch("hasSpecialNeeds") && (
                    <div>
                      <Label isRequired>Descreva suas necessidades</Label>

                      <textarea
                        {...register("specialNeedsDescription")}
                        placeholder="Descreva as adaptações necessárias para sua participação"
                        className={`w-full p-3 border rounded-lg resize-none h-20 ${
                          errors.specialNeedsDescription
                            ? "border-red-500"
                            : "border-cinza-chumbo/20"
                        }`}
                        maxLength={300}
                      />
                      {errors.specialNeedsDescription && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.specialNeedsDescription.message}
                        </p>
                      )}
                      <p className="text-xs text-cinza-chumbo/60 mt-1">
                        {watch("specialNeedsDescription")?.length || 0}/300
                        caracteres
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Comunicações e Termos */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-cinza-chumbo flex items-center">
                  <Mail className="w-5 h-5 mr-2 text-blue-500" />
                  Comunicações e Termos
                </h3>

                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="emailNotifications"
                      checked={watch("acceptsEmailNotifications")}
                      onCheckedChange={(checked) =>
                        setValue("acceptsEmailNotifications", !!checked)
                      }
                    />
                    <label
                      htmlFor="emailNotifications"
                      className="text-sm text-cinza-chumbo"
                    >
                      Desejo receber notificações por email sobre eventos,
                      resultados e novidades do festival
                    </label>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="acceptsTerms"
                      checked={watch("acceptsTerms")}
                      onCheckedChange={(checked) =>
                        setValue("acceptsTerms", !!checked)
                      }
                    />
                    <label
                      htmlFor="acceptsTerms"
                      className="text-sm text-cinza-chumbo"
                    >
                      Li e aceito o regulamento do festival e estou ciente dos
                      termos e condições de participação
                      <span className="text-red-500"> *</span>{" "}
                      <Link
                        href={
                          watch("eventId")
                            ? `/regulation/${watch("eventId")}`
                            : "/regulation"
                        }
                        className="text-verde-suave hover:text-verde-escuro font-medium inline-flex items-center ml-1"
                        target="_blank"
                      >
                        Ver regulamento
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </Link>
                    </label>
                    {errors.acceptsTerms && (
                      <p className="text-red-600 text-sm mt-1 font-medium flex items-center">
                        <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                        {errors.acceptsTerms.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || loading}
                className="festival-button w-full text-lg py-6"
              >
                {isSubmitting || loading
                  ? "Registrando..."
                  : "Registrar como Participante"}
              </Button>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-cinza-chumbo mb-2">
                  Já é Participante?
                </h3>
                <p className="text-cinza-chumbo/70">
                  Digite seu email ou número de registro para acessar suas
                  informações
                </p>
              </div>

              <form
                onSubmit={handleSearchExisting}
                className="max-w-md mx-auto"
              >
                <div className="space-y-4">
                  <div>
                    <Label>Email ou Número de Registro</Label>
                    <Input
                      type="text"
                      value={existingSearch}
                      onChange={(e) => setExistingSearch(e.target.value)}
                      placeholder="seu@email.com ou REG123456"
                    />
                    <p className="text-xs text-cinza-chumbo/60 mt-1">
                      Se usar número de registro, enviaremos as informações por
                      email
                    </p>
                  </div>

                  <Button
                    type="submit"
                    disabled={searchingExisting}
                    className="festival-button w-full"
                  >
                    {searchingExisting ? "Buscando..." : "Buscar Participante"}
                  </Button>
                </div>
              </form>

              {existingNotice && (
                <div className="festival-card p-4 max-w-md mx-auto bg-blue-50 border border-blue-200">
                  <p className="text-sm text-blue-800">{existingNotice}</p>
                </div>
              )}

              {existingParticipant && (
                <div className="festival-card p-6 max-w-md mx-auto">
                  <div className="text-center">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <h4 className="font-semibold text-cinza-chumbo mb-2">
                      Participante Encontrado!
                    </h4>
                    <p className="text-cinza-chumbo mb-4">
                      <strong>{existingParticipant?.name}</strong>
                    </p>
                    <Badge className="mb-4">
                      {PARTICIPANT_CATEGORIES.find(
                        (c) => c.value === existingParticipant?.category
                      )?.label || existingParticipant?.category}
                    </Badge>

                    <div className="space-y-3">
                      <Link href="/search-registration">
                        <Button className="festival-button w-full">
                          <Search className="w-4 h-4 mr-2" />
                          Ver Minhas Inscrições
                        </Button>
                      </Link>

                      <Link href="/#eventos">
                        <Button variant="outline" className="w-full">
                          <Music className="w-4 h-4 mr-2" />
                          Ver Eventos Disponíveis
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              <div className="text-center">
                <p className="text-cinza-chumbo/70 text-sm">
                  Não encontrou seu registro?{" "}
                  <button
                    onClick={() => setActiveTab("new")}
                    className="text-verde-suave hover:text-verde-escuro font-medium"
                  >
                    Registre-se como novo participante
                  </button>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Ajuda */}
        <div className="festival-card p-6 max-w-4xl mx-auto mt-8">
          <h3 className="text-lg font-semibold text-cinza-chumbo mb-4 flex items-center">
            <Info className="w-5 h-5 mr-2 text-blue-500" />
            Informações Importantes
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <h4 className="font-semibold text-cinza-chumbo mb-2">
                Registro Gratuito
              </h4>
              <p className="text-cinza-chumbo/70">
                O registro como participante é gratuito e permite inscrição em
                múltiplos eventos.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-cinza-chumbo mb-2">
                Aprovação Automática
              </h4>
              <p className="text-cinza-chumbo/70">
                Seu registro é aprovado automaticamente. Você pode se inscrever
                em eventos imediatamente.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-cinza-chumbo mb-2">
                Dados Seguros
              </h4>
              <p className="text-cinza-chumbo/70">
                Seus dados são protegidos e usados apenas para comunicações do
                festival.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
