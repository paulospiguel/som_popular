"use client";

import {
  Accessibility,
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  Mail,
  MapPin,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import PhoneInput from "@/components/PhoneInput";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DiscreteImageUpload } from "@/components/ui/discrete-image-upload";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EXPERIENCE_LEVELS, PARTICIPANT_CATEGORIES } from "@/constants";
import {
  getPublicEventById,
  registerForEvent,
  type EventRegistrationData,
  type PublicEvent,
} from "@/server/events-public";

import { Label } from "@/components/ui/label";

export default function EventRegistrationPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  // Redirect to unified participant registration with preselected event
  useEffect(() => {
    if (eventId) {
      router.replace(`/participant-registration?event=${eventId}`);
    } else {
      router.replace(`/participant-registration`);
    }
  }, [eventId, router]);

  return null;

  const [event, setEvent] = useState<PublicEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  type FormValues = {
    name: string;
    stageName: string;
    email: string;
    phone: string;
    experience: string;
    additionalInfo: string;
    hasSpecialNeeds: boolean;
    specialNeedsDescription: string;
    acceptsEmailNotifications: boolean;
    avatar: string;
    acceptsRegulation: boolean;
    category: string;
  };

  const {
    control,
    register,
    handleSubmit: rhfHandleSubmit,
    watch,
    formState: {},
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      stageName: "",
      email: "",
      phone: "",
      experience: "",
      additionalInfo: "",
      hasSpecialNeeds: false,
      specialNeedsDescription: "",
      acceptsEmailNotifications: false,
      avatar: "",
      acceptsRegulation: false,
      category: "",
    },
  });

  const loadEvent = useCallback(async () => {
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
  }, [eventId]);

  useEffect(() => {
    loadEvent();
  }, [loadEvent]);

  const onSubmit = async (formData: FormValues) => {
    if (!event || !event.canRegister) {
      toast.error("Inscrições não disponíveis para este evento");
      return;
    }

    // Validação básica
    if (!formData.name || !formData.email || !formData.experience) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    if (formData.hasSpecialNeeds && !formData.specialNeedsDescription) {
      toast.error("Por favor, descreva as necessidades especiais");
      return;
    }

    try {
      setSubmitting(true);

      const registrationData: EventRegistrationData = { eventId, ...formData };

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

  const hasSpecialNeeds = watch("hasSpecialNeeds");
  const acceptsRegulation = watch("acceptsRegulation");

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

            <form onSubmit={rhfHandleSubmit(onSubmit)} className="space-y-6">
              {/* Foto de Perfil */}
              <div>
                <Label>Foto de Perfil (Opcional)</Label>
                <Controller
                  control={control}
                  name="avatar"
                  render={({ field }) => (
                    <DiscreteImageUpload
                      value={field.value}
                      onChange={(value: string) => field.onChange(value)}
                      maxSize={2}
                      acceptedTypes={[
                        "image/jpeg",
                        "image/jpg",
                        "image/png",
                        "image/webp",
                      ]}
                      placeholder="Adicionar foto"
                    />
                  )}
                />
              </div>

              {/* Dados Pessoais */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label isRequired>Nome do Representante</Label>

                  <Input
                    placeholder="Nome do representante"
                    {...register("name", { required: true, minLength: 2 })}
                  />
                </div>

                <div>
                  <Label>Nome Artístico</Label>

                  <Input
                    placeholder="Ex: Banda X, Dupla Y, Nome Artístico"
                    {...register("stageName")}
                  />
                </div>

                <div>
                  <Label isRequired>Email</Label>

                  <Input
                    type="email"
                    placeholder="seu@email.com"
                    {...register("email", { required: true })}
                  />
                </div>

                <div>
                  <Label>Telefone</Label>
                  <Controller
                    control={control}
                    name="phone"
                    render={({ field }) => (
                      <PhoneInput
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        placeholder="(11) 99999-9999"
                        className="w-full"
                      />
                    )}
                  />
                </div>
              </div>

              {/* Informações Artísticas */}
              <div className="w-full">
                <h4 className="text-md font-semibold text-cinza-chumbo mb-4">
                  Informações Artísticas
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                  <div className="w-full">
                    <Label>Categoria</Label>

                    <Controller
                      control={control}
                      name="category"
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full">
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
                      )}
                    />
                  </div>
                  <div className="w-full">
                    <Label>Nível de Experiência</Label>

                    <Controller
                      control={control}
                      name="experience"
                      rules={{ required: true }}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full">
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
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* Informações Adicionais */}
              <div>
                <Label>Informações Adicionais</Label>

                <textarea
                  {...register("additionalInfo")}
                  placeholder="Conte-nos mais sobre você, sua música ou qualquer informação relevante..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-verde-suave"
                  rows={4}
                />
              </div>

              {/* Necessidades Especiais */}
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Controller
                    control={control}
                    name="hasSpecialNeeds"
                    render={({ field }) => (
                      <Checkbox
                        id="hasSpecialNeeds"
                        checked={!!field.value}
                        onCheckedChange={(checked) => field.onChange(!!checked)}
                      />
                    )}
                  />
                  <Label
                    htmlFor="hasSpecialNeeds"
                    className="text-sm gap-2 text-cinza-chumbo flex items-center"
                  >
                    <Accessibility className="w-4 h-4 mr-2" />
                    Tenho necessidades especiais
                  </Label>
                </div>

                {hasSpecialNeeds && (
                  <textarea
                    {...register("specialNeedsDescription")}
                    placeholder="Descreva suas necessidades especiais para que possamos preparar o melhor atendimento..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-verde-suave"
                    rows={3}
                  />
                )}
              </div>

              {/* Notificações */}
              <div>
                <div className="flex items-center space-x-2">
                  <Controller
                    control={control}
                    name="acceptsEmailNotifications"
                    render={({ field }) => (
                      <Checkbox
                        id="acceptsEmailNotifications"
                        checked={!!field.value}
                        onCheckedChange={(checked) => field.onChange(!!checked)}
                      />
                    )}
                  />
                  <Label
                    htmlFor="acceptsEmailNotifications"
                    className="text-sm text-cinza-chumbo flex items-center"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Aceito receber notificações por email sobre o evento
                  </Label>
                </div>
              </div>

              {/* Regulamento */}
              <div>
                <Label>Regulamento</Label>

                <p className="text-sm gap-2 text-cinza-chumbo flex items-center">
                  <Controller
                    control={control}
                    name="acceptsRegulation"
                    rules={{ required: true, validate: (v) => v === true }}
                    render={({ field }) => (
                      <Checkbox
                        id="acceptsRegulation"
                        checked={!!field.value}
                        onCheckedChange={(checked) => field.onChange(!!checked)}
                      />
                    )}
                  />
                  <Link
                    href={`/regulation/${event.id}`}
                    className="text-sm text-cinza-chumbo flex items-center hover:text-verde-suave"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Regulamento do evento *
                  </Link>
                </p>
              </div>

              {/* Botão de Submissão */}
              <div className="pt-6 border-t">
                <Button
                  type="submit"
                  disabled={
                    submitting || !event.canRegister || !acceptsRegulation
                  }
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
