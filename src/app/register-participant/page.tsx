"use client";

import {
  getParticipantByEmail,
  registerParticipant,
} from "@/actions/participants-public";
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
import {
  ArrowLeft,
  CheckCircle,
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
import { useState } from "react";
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
}

export default function ParticipantRegistrationPage() {
  const [activeTab, setActiveTab] = useState<"new" | "existing">("new");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [participantId, setParticipantId] = useState<string>("");
  const [existingEmail, setExistingEmail] = useState("");
  const [searchingExisting, setSearchingExisting] = useState(false);
  const [existingParticipant, setExistingParticipant] = useState<any>(null);

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
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
    field: keyof FormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Limpar erro quando usuário começa a digitar
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório";
    } else if (formData.name.length < 2) {
      newErrors.name = "Nome deve ter pelo menos 2 caracteres";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email é obrigatório";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    if (!formData.category) {
      newErrors.category = "Selecione uma categoria";
    }

    if (!formData.experience) {
      newErrors.experience = "Selecione um nível de experiência";
    }

    if (formData.hasSpecialNeeds && !formData.specialNeedsDescription.trim()) {
      newErrors.specialNeedsDescription = "Descreva as necessidades especiais";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Por favor, corrija os erros no formulário");
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

    if (!existingEmail.trim()) {
      toast.error("Digite um email para buscar");
      return;
    }

    setSearchingExisting(true);

    try {
      const result = await getParticipantByEmail(existingEmail);

      if (result.success && result.participant) {
        setExistingParticipant(result.participant);
        toast.success("Participante encontrado!");
      } else {
        toast.error(result.error || "Participante não encontrado");
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
                Seu registro como participante foi realizado com sucesso. Agora
                você pode se inscrever em eventos do festival.
              </p>

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
                    Ver Eventos Disponíveis
                  </Button>
                </Link>

                <Link href="/consulta-inscricao" className="flex-1">
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
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      placeholder="Seu nome completo"
                      className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-cinza-chumbo mb-2">
                      Email *
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      placeholder="seu@email.com"
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">
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
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                </div>
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
                      Categoria *
                    </label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        handleInputChange("category", value)
                      }
                    >
                      <SelectTrigger
                        className={errors.category ? "border-red-500" : ""}
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
                      <p className="text-red-500 text-sm mt-1">
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
                        className={errors.experience ? "border-red-500" : ""}
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
                      <p className="text-red-500 text-sm mt-1">
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

              {/* Comunicações */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-cinza-chumbo flex items-center">
                  <Mail className="w-5 h-5 mr-2 text-blue-500" />
                  Comunicações
                </h3>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="emailNotifications"
                    checked={formData.acceptsEmailNotifications}
                    onCheckedChange={(checked) =>
                      handleInputChange("acceptsEmailNotifications", !!checked)
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
                  Digite seu email para buscar seu registro e acessar suas
                  inscrições
                </p>
              </div>

              <form
                onSubmit={handleSearchExisting}
                className="max-w-md mx-auto"
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-cinza-chumbo mb-2">
                      Email de Cadastro
                    </label>
                    <Input
                      type="email"
                      value={existingEmail}
                      onChange={(e) => setExistingEmail(e.target.value)}
                      placeholder="seu@email.com"
                    />
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
                      <Link href="/consulta-inscricao">
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
