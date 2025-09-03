"use client";

import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  MapPin,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DiscreteImageUpload } from "@/components/ui/discrete-image-upload";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getPublicEventById,
  registerForEvent,
  type EventRegistrationData,
  type PublicEvent,
} from "@/server/events-public";

const CATEGORIES = [
  "Fado",
  "Guitarra Portuguesa",
  "Cavaquinho",
  "Concertina",
  "Viola Campaniça",
  "Cante Alentejano",
  "Outro",
];

const EXPERIENCE_LEVELS = [
  "Iniciante (menos de 1 ano)",
  "Amador (1-3 anos)",
  "Intermédio (3-7 anos)",
  "Avançado (7+ anos)",
  "Profissional",
];

export default function EventRegistrationPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const [event, setEvent] = useState<PublicEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    category: "",
    experience: "",
    additionalInfo: "",
    hasSpecialNeeds: false,
    specialNeedsDescription: "",
    acceptsEmailNotifications: false,
    avatar: "",
  });

  useEffect(() => {
    loadEvent();
  }, [eventId]);

  const loadEvent = async () => {
    try {
      setLoading(true);
      const result = await getPublicEventById(eventId);
      if (result.success && result.event) {
        setEvent(result.event);
        if (!result.event.canRegister) {
          setError("Inscrições não disponíveis para este evento");
        }
      } else {
        setError(result.error || "Evento não encontrado");
      }
    } catch (error) {
      setError("Erro ao carregar evento");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!event || !event.canRegister) {
      toast.error("Inscrições não disponíveis para este evento");
      return;
    }

    // Validação básica
    if (
      !formData.name ||
      !formData.email ||
      !formData.category ||
      !formData.experience
    ) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    if (formData.hasSpecialNeeds && !formData.specialNeedsDescription) {
      toast.error("Por favor, descreva as necessidades especiais");
      return;
    }

    try {
      setSubmitting(true);

      const registrationData: EventRegistrationData = {
        eventId,
        ...formData,
      };

      const result = await registerForEvent(registrationData);

      if (result.success) {
        toast.success("Inscrição realizada com sucesso!");
        // Redirecionar para página de confirmação com QR code
        router.push(
          `/events/${eventId}/registration/confirmation?registration=${result.registrationId}&participant=${result.participantId}`
        );
      } else {
        toast.error(result.error || "Erro ao processar inscrição");
      }
    } catch (error) {
      toast.error("Erro ao processar inscrição");
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-PT", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bege-claro via-verde-muito-suave to-dourado-muito-claro flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-verde-suave border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-cinza-chumbo">Carregando evento...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bege-claro via-verde-muito-suave to-dourado-muito-claro flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-cinza-chumbo mb-4">
            {error || "Evento não encontrado"}
          </h1>
          <Link href="/">
            <Button className="festival-button-secondary">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar à Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-bege-claro via-verde-muito-suave to-dourado-muito-claro">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-verde-suave hover:text-verde-claro mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar à Home
          </Link>

          <div className="festival-card p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-cinza-chumbo mb-2">
                  Inscrição no Evento
                </h1>
                <h2 className="text-xl text-verde-suave font-semibold">
                  {event.name}
                </h2>
              </div>
              <Badge
                className={
                  event.registrationStatus === "open"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }
              >
                {event.registrationStatus === "open"
                  ? "Inscrições Abertas"
                  : "Inscrições Encerradas"}
              </Badge>
            </div>

            {/* Informações do Evento */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-dourado-claro" />
                <span>{formatDate(event.startDate)}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-dourado-claro" />
                <span>{event.location}</span>
              </div>
              {event.maxParticipants && (
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2 text-dourado-claro" />
                  <span>
                    {event.currentParticipants} / {event.maxParticipants}{" "}
                    inscritos
                  </span>
                </div>
              )}
            </div>

            {event.description && (
              <div className="mt-4 p-4 bg-verde-muito-suave/20 rounded-lg">
                <p className="text-cinza-chumbo">{event.description}</p>
              </div>
            )}
          </div>
        </div>

        {/* Formulário de Inscrição */}
        {event.canRegister ? (
          <div className="festival-card p-6">
            <h3 className="text-xl font-bold text-cinza-chumbo mb-6">
              Dados para Inscrição
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Dados Pessoais */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-cinza-chumbo mb-2">
                    Nome Completo *
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Seu nome completo"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-cinza-chumbo mb-2">
                    Email *
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="seu@email.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-cinza-chumbo mb-2">
                    Telefone
                  </label>
                  <PhoneInput
                    value={formData.phone}
                    onChange={(value) => handleInputChange("phone", value)}
                    placeholder="(11) 99999-9999"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-cinza-chumbo mb-2">
                    Foto de Perfil
                  </label>
                  <DiscreteImageUpload
                    value={formData.avatar}
                    onChange={(value: string) =>
                      handleInputChange("avatar", value)
                    }
                    maxSize={2}
                    acceptedTypes={[
                      "image/jpeg",
                      "image/jpg",
                      "image/png",
                      "image/webp",
                    ]}
                    placeholder="Adicionar foto"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-cinza-chumbo mb-2">
                    Categoria Musical *
                  </label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      handleInputChange("category", value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-cinza-chumbo mb-2">
                    Nível de Experiência *
                  </label>
                  <Select
                    value={formData.experience}
                    onValueChange={(value) =>
                      handleInputChange("experience", value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione seu nível" />
                    </SelectTrigger>
                    <SelectContent>
                      {EXPERIENCE_LEVELS.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Informações Adicionais */}
              <div>
                <label className="block text-sm font-medium text-cinza-chumbo mb-2">
                  Informações Adicionais
                </label>
                <textarea
                  value={formData.additionalInfo}
                  onChange={(e) =>
                    handleInputChange("additionalInfo", e.target.value)
                  }
                  placeholder="Conte-nos mais sobre você, sua música ou qualquer informação relevante..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-verde-suave"
                  rows={4}
                />
              </div>

              {/* Necessidades Especiais */}
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <input
                    type="checkbox"
                    id="hasSpecialNeeds"
                    checked={formData.hasSpecialNeeds}
                    onChange={(e) =>
                      handleInputChange("hasSpecialNeeds", e.target.checked)
                    }
                    className="rounded border-gray-300 text-verde-suave focus:ring-verde-suave"
                  />
                  <label
                    htmlFor="hasSpecialNeeds"
                    className="text-sm font-medium text-cinza-chumbo"
                  >
                    Tenho necessidades especiais
                  </label>
                </div>

                {formData.hasSpecialNeeds && (
                  <textarea
                    value={formData.specialNeedsDescription}
                    onChange={(e) =>
                      handleInputChange(
                        "specialNeedsDescription",
                        e.target.value
                      )
                    }
                    placeholder="Descreva suas necessidades especiais para que possamos preparar o melhor atendimento..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-verde-suave"
                    rows={3}
                    required
                  />
                )}
              </div>

              {/* Notificações */}
              <div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="acceptsEmailNotifications"
                    checked={formData.acceptsEmailNotifications}
                    onChange={(e) =>
                      handleInputChange(
                        "acceptsEmailNotifications",
                        e.target.checked
                      )
                    }
                    className="rounded border-gray-300 text-verde-suave focus:ring-verde-suave"
                  />
                  <label
                    htmlFor="acceptsEmailNotifications"
                    className="text-sm text-cinza-chumbo"
                  >
                    Aceito receber notificações por email sobre o evento
                  </label>
                </div>
              </div>

              {/* Botão de Submissão */}
              <div className="pt-6 border-t">
                <Button
                  type="submit"
                  disabled={submitting || !event.canRegister}
                  className="w-full festival-button text-lg py-3"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Processando Inscrição...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Confirmar Inscrição
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <div className="festival-card p-8 text-center">
            <Clock className="w-16 h-16 text-cinza-chumbo/50 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-cinza-chumbo mb-2">
              Inscrições Não Disponíveis
            </h3>
            <p className="text-cinza-chumbo/70 mb-6">
              {event.registrationStatus === "not_open" &&
                "As inscrições ainda não foram abertas"}
              {event.registrationStatus === "closed" &&
                "O período de inscrições já encerrou"}
              {event.registrationStatus === "full" &&
                "O evento já atingiu o número máximo de participantes"}
            </p>
            <Link href="/">
              <Button className="festival-button-secondary">
                Ver Outros Eventos
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
