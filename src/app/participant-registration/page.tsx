"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAvailableEventsForRegistration } from "@/server/events-public";
import {
  getParticipantByEmail,
  registerParticipant,
} from "@/server/participants-public";
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  ExternalLink,
  Heart,
  Home,
  Info,
  Mail,
  Music,
  Search,
  Star,
  User,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const CATEGORIES = [
  { value: "vocal", label: "Vocal" },
  { value: "instrumental", label: "Instrumental" },
  { value: "composicao", label: "Composição" },
  { value: "grupo", label: "Grupo/Banda" },
];

const EXPERIENCE_LEVELS = [
  { value: "iniciante", label: "Iniciante" },
  { value: "intermediario", label: "Intermediário" },
  { value: "avancado", label: "Avançado" },
  { value: "profissional", label: "Profissional" },
];

interface FormData {
  name: string;
  email: string;
  phone: string;
  category: string;
  experience: string;
  additionalInfo: string;
  hasSpecialNeeds: boolean;
  specialNeedsDescription: string;
  acceptsEmailNotifications: boolean;
  acceptsTerms: boolean;
  acceptsRegulation: boolean;
  eventId: string;
}

export default function ParticipantRegistrationPage() {
  const [activeTab, setActiveTab] = useState<"new" | "existing">("new");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [participantId, setParticipantId] = useState<string>("");
  const [existingSearch, setExistingSearch] = useState("");
  const [searchingExisting, setSearchingExisting] = useState(false);
  const [existingParticipant, setExistingParticipant] = useState<any>(null);
  const [availableEvents, setAvailableEvents] = useState<any[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    category: "",
    experience: "",
    additionalInfo: "",
    hasSpecialNeeds: false,
    specialNeedsDescription: "",
    acceptsEmailNotifications: true,
    acceptsTerms: false,
    acceptsRegulation: false,
    eventId: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Carregar eventos disponíveis ao montar o componente
  useEffect(() => {
    loadAvailableEvents();
  }, []);

  const loadAvailableEvents = async () => {
    try {
      setLoadingEvents(true);
      const result = await getAvailableEventsForRegistration();

      if (result.success && result.events) {
        setAvailableEvents(result.events);

        // Se só há um evento, selecionar automaticamente
        if (result.events && result.events.length === 1) {
          setFormData((prev) => ({ ...prev, eventId: result.events![0].id }));
        }
      }
    } catch (error) {
      console.error("Erro ao carregar eventos:", error);
      toast.error("Erro ao carregar eventos disponíveis");
    } finally {
      setLoadingEvents(false);
    }
  };

  const handleInputChange = (
    field: keyof FormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Limpar erro quando usuário começa a digitar
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }

    // Validação em tempo real para campos críticos
    if (field === "name" && typeof value === "string") {
      if (value.trim().length > 0 && value.trim().length < 2) {
        setErrors((prev) => ({
          ...prev,
          name: "Nome deve ter pelo menos 2 caracteres",
        }));
      }
    }

    if (field === "email" && typeof value === "string") {
      if (
        value.trim().length > 0 &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      ) {
        setErrors((prev) => ({ ...prev, email: "Email inválido" }));
      }
    }

    if (field === "specialNeedsDescription" && typeof value === "string") {
      if (formData.hasSpecialNeeds && value.trim().length === 0) {
        setErrors((prev) => ({
          ...prev,
          specialNeedsDescription: "Descreva as necessidades especiais",
        }));
      }
    }
  };

  const validateForm = (): { isValid: boolean; message: string } => {
    const newErrors: Record<string, string> = {};

    // Validação do nome
    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório";
    } else if (formData.name.length < 2) {
      newErrors.name = "Nome deve ter pelo menos 2 caracteres";
    }

    // Validação do email
    if (!formData.email.trim()) {
      newErrors.email = "Email é obrigatório";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    // Validação da categoria
    if (!formData.category) {
      newErrors.category = "Selecione uma modalidade";
    }

    // Validação da experiência
    if (!formData.experience) {
      newErrors.experience = "Selecione um nível de experiência";
    }

    // Validação das necessidades especiais
    if (formData.hasSpecialNeeds && !formData.specialNeedsDescription.trim()) {
      newErrors.specialNeedsDescription = "Descreva as necessidades especiais";
    }

    // Validação dos termos
    if (!formData.acceptsTerms) {
      newErrors.acceptsTerms = "Você deve aceitar os termos e condições";
    }

    if (!formData.acceptsRegulation) {
      newErrors.acceptsRegulation =
        "Você deve aceitar o regulamento do festival";
    }

    // Validação do evento
    if (!formData.eventId) {
      newErrors.eventId = "Selecione um evento para inscrição";
    }

    setErrors(newErrors);

    // Log para debug
    if (Object.keys(newErrors).length > 0) {
      console.log("Erros de validação:", newErrors);
    }

    // Retornar resultado da validação com mensagem
    if (Object.keys(newErrors).length === 0) {
      return { isValid: true, message: "Formulário válido" };
    } else {
      // Pegar o primeiro erro para mostrar no toast
      const firstErrorKey = Object.keys(newErrors)[0];
      const firstErrorMessage = newErrors[firstErrorKey];

      // Criar mensagem personalizada baseada no tipo de erro
      let message = "";
      switch (firstErrorKey) {
        case "name":
          message = `Nome: ${firstErrorMessage}`;
          break;
        case "email":
          message = `Email: ${firstErrorMessage}`;
          break;
        case "category":
          message = `Categoria: ${firstErrorMessage}`;
          break;
        case "experience":
          message = `Experiência: ${firstErrorMessage}`;
          break;
        case "eventId":
          message = `Evento: ${firstErrorMessage}`;
          break;
        case "acceptsTerms":
          message = `Termos: ${firstErrorMessage}`;
          break;
        case "acceptsRegulation":
          message = `Regulamento: ${firstErrorMessage}`;
          break;
        case "specialNeedsDescription":
          message = `Necessidades especiais: ${firstErrorMessage}`;
          break;
        default:
          message = firstErrorMessage;
      }

      return { isValid: false, message };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateForm();

    if (!validation.isValid) {
      // Mostrar toast de erro com mensagem específica
      toast.error(validation.message, {
        duration: 5000,
        style: {
          background: "#ef4444",
          color: "white",
          border: "1px solid #dc2626",
        },
      });

      // Mostrar resumo de todos os erros no console para debug
      console.log("Resumo de erros:", errors);

      // Scroll para o primeiro campo com erro
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        const element = document.getElementById(firstErrorField);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }

      return;
    }

    setLoading(true);

    try {
      const result = await registerParticipant(formData);

      if (result.success) {
        setParticipantId(result.participantId || "");
        setSuccess(true);
        toast.success("Registro realizado com sucesso!");
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
        const result = await getParticipantByEmail(existingSearch);

        if (result.success && result.participant) {
          setExistingParticipant(result.participant);
          toast.success("Participante encontrado!");
        } else {
          toast.error("Participante não encontrado com este email");
          setExistingParticipant(null);
        }
      } else {
        // É número de registro - enviar por email
        toast.info(
          "Funcionalidade de envio por email será implementada em breve"
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
                Registro Concluído!
              </h1>
              <p className="text-lg text-cinza-chumbo/80 mb-6">
                Seu registro como participante foi realizado com sucesso e você
                foi automaticamente inscrito no evento selecionado!
              </p>

              {/* Informações do Evento */}
              {formData.eventId &&
                availableEvents.find((e) => e.id === formData.eventId) && (
                  <div className="bg-verde-suave/10 border border-verde-suave/20 rounded-lg p-4 mb-6">
                    <h4 className="font-semibold text-verde-suave mb-2">
                      Evento Selecionado
                    </h4>
                    <div className="text-sm text-cinza-chumbo/80">
                      <p>
                        <strong>Nome:</strong>{" "}
                        {
                          availableEvents.find((e) => e.id === formData.eventId)
                            ?.name
                        }
                      </p>
                      <p>
                        <strong>Modalidade:</strong>{" "}
                        {
                          availableEvents.find((e) => e.id === formData.eventId)
                            ?.category
                        }
                      </p>
                      <p>
                        <strong>Data:</strong>{" "}
                        {availableEvents.find((e) => e.id === formData.eventId)
                          ?.startDate
                          ? new Date(
                              availableEvents.find(
                                (e) => e.id === formData.eventId
                              )!.startDate
                            ).toLocaleDateString("pt-BR")
                          : "N/A"}
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

                <Link href="/registration-lookup" className="flex-1">
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
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Informações Pessoais */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-cinza-chumbo flex items-center">
                  <User className="w-5 h-5 mr-2 text-verde-suave" />
                  Informações Pessoais
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-cinza-chumbo mb-2">
                      Nome Completo *
                    </label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      placeholder="Seu nome completo"
                      className={`${errors.name ? "border-red-500 ring-red-200" : "border-gray-300"} focus:ring-2 focus:ring-verde-suave focus:border-transparent`}
                    />
                    {errors.name && (
                      <p className="text-red-600 text-sm mt-1 font-medium flex items-center">
                        <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-cinza-chumbo mb-2">
                      Email *
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      placeholder="seu@email.com"
                      className={`${errors.email ? "border-red-500 ring-red-200" : "border-gray-300"} focus:ring-2 focus:ring-verde-suave focus:border-transparent`}
                    />
                    {errors.email && (
                      <p className="text-red-600 text-sm mt-1 font-medium flex items-center">
                        <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-cinza-chumbo mb-2">
                      Telefone
                    </label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      placeholder="(XX) XXXX-XXXX"
                    />
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
                      Não há eventos com inscrições abertas no momento.
                    </p>
                    <Link href="/#eventos">
                      <Button variant="outline" size="sm">
                        Ver Todos os Eventos
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-cinza-chumbo mb-2">
                      Selecione o Evento *
                    </label>
                    <Select
                      value={formData.eventId}
                      onValueChange={(value) =>
                        handleInputChange("eventId", value)
                      }
                      disabled={availableEvents.length === 1}
                    >
                      <SelectTrigger
                        id="eventId"
                        className={`${errors.eventId ? "border-red-500 ring-red-200" : "w-full border-gray-300"} w-full focus:ring-2 focus:ring-verde-suave focus:border-transparent`}
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
                        {availableEvents.map((event) => (
                          <SelectItem key={event.id} value={event.id}>
                            <div className="flex flex-col">
                              <span className="font-medium">{event.name}</span>
                              <span className="text-xs text-cinza-chumbo/60">
                                {event.category} •{" "}
                                {new Date(event.startDate).toLocaleDateString(
                                  "pt-BR"
                                )}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.eventId && (
                      <p className="text-red-600 text-sm mt-1 font-medium flex items-center">
                        <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                        {errors.eventId}
                      </p>
                    )}
                    {availableEvents.length === 1 && (
                      <p className="text-xs text-cinza-chumbo/60 mt-1">
                        Este é o único evento disponível para inscrição no
                        momento.
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
                    <label className="block text-sm font-medium text-cinza-chumbo mb-2">
                      Modalidade *
                    </label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        handleInputChange("category", value)
                      }
                    >
                      <SelectTrigger
                        id="category"
                        className={`${errors.category ? "border-red-500 ring-red-200" : " border-gray-300"} w-full focus:ring-2 focus:ring-verde-suave focus:border-transparent`}
                      >
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((category) => (
                          <SelectItem
                            key={category.value}
                            value={category.value}
                          >
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category && (
                      <p className="text-red-600 text-sm mt-1 font-medium flex items-center">
                        <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                        {errors.category}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-cinza-chumbo mb-2">
                      Nível de Experiência *
                    </label>
                    <Select
                      value={formData.experience}
                      onValueChange={(value) =>
                        handleInputChange("experience", value)
                      }
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
                    {errors.experience && (
                      <p className="text-red-600 text-sm mt-1 font-medium flex items-center">
                        <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                        {errors.experience}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-cinza-chumbo mb-2">
                    Informações Adicionais
                  </label>
                  <textarea
                    value={formData.additionalInfo}
                    onChange={(e) =>
                      handleInputChange("additionalInfo", e.target.value)
                    }
                    placeholder="Conte-nos um pouco sobre sua experiência musical, instrumentos que toca, etc."
                    className="w-full p-3 border border-cinza-chumbo/20 rounded-lg resize-none h-24"
                    maxLength={500}
                  />
                  <p className="text-xs text-cinza-chumbo/60 mt-1">
                    {formData.additionalInfo.length}/500 caracteres
                  </p>
                </div>
              </div>

              {/* Necessidades Especiais */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-cinza-chumbo flex items-center">
                  <Heart className="w-5 h-5 mr-2 text-red-400" />
                  Acessibilidade
                </h3>

                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="specialNeeds"
                      checked={formData.hasSpecialNeeds}
                      onCheckedChange={(checked) =>
                        handleInputChange("hasSpecialNeeds", !!checked)
                      }
                    />
                    <label
                      htmlFor="specialNeeds"
                      className="text-sm text-cinza-chumbo"
                    >
                      Possuo necessidades especiais ou preciso de adaptações
                    </label>
                  </div>

                  {formData.hasSpecialNeeds && (
                    <div>
                      <label className="block text-sm font-medium text-cinza-chumbo mb-2">
                        Descreva suas necessidades *
                      </label>
                      <textarea
                        value={formData.specialNeedsDescription}
                        onChange={(e) =>
                          handleInputChange(
                            "specialNeedsDescription",
                            e.target.value
                          )
                        }
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
                          {errors.specialNeedsDescription}
                        </p>
                      )}
                      <p className="text-xs text-cinza-chumbo/60 mt-1">
                        {formData.specialNeedsDescription.length}/300 caracteres
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
                      checked={formData.acceptsEmailNotifications}
                      onCheckedChange={(checked) =>
                        handleInputChange(
                          "acceptsEmailNotifications",
                          !!checked
                        )
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
                      id="acceptsRegulation"
                      checked={formData.acceptsRegulation}
                      onCheckedChange={(checked) =>
                        handleInputChange("acceptsRegulation", !!checked)
                      }
                    />
                    <label
                      htmlFor="acceptsRegulation"
                      className="text-sm text-cinza-chumbo"
                    >
                      Li e aceito o{" "}
                      <Link
                        href="/regulation"
                        className="text-verde-suave hover:text-verde-escuro font-medium inline-flex items-center"
                        target="_blank"
                      >
                        regulamento do festival
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </Link>
                      *
                    </label>
                    {errors.acceptsRegulation && (
                      <p className="text-red-600 text-sm mt-1 font-medium flex items-center">
                        <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                        {errors.acceptsRegulation}
                      </p>
                    )}
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="acceptsTerms"
                      checked={formData.acceptsTerms}
                      onCheckedChange={(checked) =>
                        handleInputChange("acceptsTerms", !!checked)
                      }
                    />
                    <label
                      htmlFor="acceptsTerms"
                      className="text-sm text-cinza-chumbo"
                    >
                      Estou ciente dos termos e condições de participação *
                    </label>
                    {errors.acceptsTerms && (
                      <p className="text-red-600 text-sm mt-1 font-medium flex items-center">
                        <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                        {errors.acceptsTerms}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="festival-button w-full text-lg py-6"
              >
                {loading ? "Registrando..." : "Registrar como Participante"}
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
                    <label className="block text-sm font-medium text-cinza-chumbo mb-2">
                      Email ou Número de Registro
                    </label>
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

              {existingParticipant && (
                <div className="festival-card p-6 max-w-md mx-auto">
                  <div className="text-center">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <h4 className="font-semibold text-cinza-chumbo mb-2">
                      Participante Encontrado!
                    </h4>
                    <p className="text-cinza-chumbo mb-4">
                      <strong>{existingParticipant.name}</strong>
                    </p>
                    <Badge className="mb-4">
                      {CATEGORIES.find(
                        (c) => c.value === existingParticipant.category
                      )?.label || existingParticipant.category}
                    </Badge>

                    <div className="space-y-3">
                      <Link href="/registration-lookup">
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
