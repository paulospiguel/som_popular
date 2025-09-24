"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  Bell,
  Camera,
  Info,
  Mail,
  Music,
  Phone,
  Plus,
  User,
} from "lucide-react";
import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

import Loading from "@/components/loading";
import { Modal } from "@/components/Modal";
import PhoneInput from "@/components/PhoneInput";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import DiscreteImageUpload from "@/components/ui/discrete-image-upload";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { EVENT_CATEGORIES, EXPERIENCE_LEVELS } from "@/constants";
import { useCreateParticipant } from "@/hooks/use-participants";
import { useSonner } from "@/hooks/use-sonner";
import { Participant } from "@/infra/database/schema";
import { cn } from "@/lib/utils";
import { ParticipantRegistrationFormData } from "@/validators/participants";

interface AddParticipantModalProps {
  isOpen: boolean;
  onClose: () => void;
  setParticipant: (participant: Participant) => void;
}

const AddParticipantModal: React.FC<AddParticipantModalProps> = ({
  isOpen,
  onClose,
  setParticipant,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showValidationErrors, setShowValidationErrors] = useState(false);

  // const modalSchema = useMemo(
  //   () => participantFormSchema.omit({ eventId: true }),
  //   []
  // );

  const modalSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
  });

  const { showError, showSuccess, showWarning } = useSonner();
  const { mutate: createParticipant, isPending } = useCreateParticipant();

  const form = useForm<ParticipantRegistrationFormData>({
    resolver: zodResolver(modalSchema),
    // Mostra erros de forma imediata e foca no primeiro campo inválido
    mode: "onChange",
    reValidateMode: "onSubmit",
    criteriaMode: "all",
    shouldFocusError: true,
    defaultValues: {
      name: "",
      stageName: "",
      email: "",
      phone: "",
      photoImageId: "",
      category: "",
      experience: "",
      additionalInfo: "",
      hasSpecialNeeds: false,
      specialNeedsDescription: "",
      acceptsEmailNotifications: true,
      acceptsTerms: false,
    },
  });

  const {
    formState: { errors, isDirty },
    watch,
    reset,
  } = form;

  // Observar campo de necessidades especiais
  const hasSpecialNeeds = watch("hasSpecialNeeds");

  // Função para formatar erros de forma amigável
  const getFieldError = useCallback((fieldName: string) => {
    const fieldLabels: Record<string, string> = {
      name: "Nome completo",
      stageName: "Nome artístico",
      email: "E-mail",
      phone: "Telefone",
      category: "Categoria",
      experience: "Experiência",
      additionalInfo: "Informações adicionais",
      specialNeedsDescription: "Descrição de necessidades especiais",
      acceptsTerms: "Termos e condições",
      photoImageId: "Foto de perfil",
    };

    return fieldLabels[fieldName] || fieldName;
  }, []);

  // Mostrar erros de validação quando o usuário tenta submeter
  const handleValidationErrors = useCallback(
    (formErrors: typeof form.formState.errors) => {
      const entries = Object.entries(formErrors ?? {});
      if (entries.length === 0) return;

      const [firstKey, firstVal] = entries[0];
      const fieldLabel = getFieldError(firstKey);
      const message = (firstVal as any)?.message || "Campo inválido";

      // Foca no primeiro campo inválido se existir um input com esse name
      const firstEl = document.querySelector(`[name="${firstKey}"]`) as
        | HTMLInputElement
        | HTMLTextAreaElement
        | null;
      if (firstEl?.focus) firstEl.focus();

      showError(`${fieldLabel}: ${message}`, {
        title: "Erro de validação",
        description: `${entries.length} campo(s) precisa(m) de correção`,
        duration: 5000,
      });

      setShowValidationErrors(true);
    },
    [getFieldError, showError, form.formState.errors]
  );

  // Função de submit otimizada
  const onSubmit = async (values: ParticipantRegistrationFormData) => {
    try {
      setIsSubmitting(true);

      // Verificar termos
      if (!values.acceptsTerms) {
        showWarning("Você precisa aceitar os termos para continuar", {
          title: "Atenção",
          description: "Por favor, leia e aceite os termos e condições",
        });
        return;
      }

      // Criar objeto do participante
      const participant: Participant = {
        ...values,
        id: `participant-${Date.now()}`,
        status: "pending",
        registrationDate: new Date(),
        notes: "",
        archived: false,
        approvedAt: null,
        approvedBy: null,
        rejectedAt: null,
        rejectedBy: null,
        rejectionReason: null,
        updatedAt: new Date(),
        createdAt: new Date(),
        age: null,
        eventId: null,
      } as Participant;
      console.log(participant);

      // Chamar a mutação
      // createParticipant(participant, {
      //   onSuccess: () => {
      //     showSuccess("Participante adicionado com sucesso!", {
      //       title: "Sucesso",
      //       description: "O participante foi registrado no sistema",
      //     });

      //     setParticipant(participant);
      //     reset();
      //     onClose();
      //   },
      //   onError: (error) => {
      //     showError(
      //       error instanceof Error
      //         ? error.message
      //         : "Erro ao adicionar participante",
      //       {
      //         title: "Erro",
      //         description:
      //           "Não foi possível adicionar o participante. Tente novamente.",
      //       }
      //     );
      //   },
      // });
    } catch (error) {
      console.error("Erro ao processar participante:", error);
      showError("Erro inesperado ao processar os dados", {
        title: "Erro",
        description: "Por favor, tente novamente ou contate o suporte",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Função para limpar e fechar modal
  const handleClose = useCallback(() => {
    reset();
    setShowValidationErrors(false);
    onClose();
  }, [reset, onClose]);

  // Função para validar antes de submeter
  const handleFormSubmit = form.handleSubmit(onSubmit, handleValidationErrors);

  return (
    <Modal
      size="large"
      isOpen={isOpen}
      onClose={handleClose}
      title="Adicionar Novo Participante"
    >
      <Form {...form}>
        <form onSubmit={handleFormSubmit} className="space-y-6">
          {/* Alerta de validação */}
          {showValidationErrors && Object.keys(errors).length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <p>Por favor, corrija os erros abaixo antes de continuar:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    {Object.entries(errors).map(([key, val]) => (
                      <li key={key}>
                        <span className="font-medium">
                          {getFieldError(key)}:
                        </span>{" "}
                        {(val as any)?.message || "Campo inválido"}
                      </li>
                    ))}
                  </ul>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Seção: Foto de Perfil */}
          <div className="flex justify-center">
            <FormField
              control={form.control}
              name="photoImageId"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="flex items-center gap-2">
                    <Camera className="w-4 h-4" />
                    Foto de Perfil
                  </FormLabel>
                  <FormControl>
                    <DiscreteImageUpload
                      value={field.value || ""}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>
                    Opcional - Adicione uma foto do participante
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Seção: Informações Pessoais */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg flex items-center gap-2">
              <User className="w-5 h-5" />
              Informações Pessoais
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nome Completo */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Completo *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Ex: João Silva"
                        className={cn(
                          "h-12",
                          errors.name && "border-red-500 focus:ring-red-500"
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Nome Artístico */}
              <FormField
                control={form.control}
                name="stageName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Artístico</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Ex: DJ Silva"
                        className="h-12"
                      />
                    </FormControl>
                    <FormDescription>
                      Como deseja ser chamado no evento
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      E-mail *
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="exemplo@email.com"
                        className={cn(
                          "h-12",
                          errors.email && "border-red-500 focus:ring-red-500"
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Telefone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Telefone
                    </FormLabel>
                    <FormControl>
                      <PhoneInput
                        value={field.value || ""}
                        onChange={field.onChange}
                        placeholder="(11) 99999-9999"
                        className="w-full h-12"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Seção: Informações Artísticas */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg flex items-center gap-2">
              <Music className="w-5 h-5" />
              Informações Artísticas
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Categoria */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <Select
                      value={field.value || ""}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger className="h-12 w-full">
                          <SelectValue placeholder="Selecione a categoria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {EVENT_CATEGORIES.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Experiência */}
              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nível de Experiência</FormLabel>
                    <Select
                      value={field.value || ""}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger className="h-12 w-full">
                          <SelectValue placeholder="Selecione o nível" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {EXPERIENCE_LEVELS.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Informações Adicionais */}
            <FormField
              control={form.control}
              name="additionalInfo"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Informações Adicionais
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Conte-nos mais sobre o participante..."
                    />
                  </FormControl>
                  <FormDescription>
                    {field.value?.length || 0}/500 caracteres
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Seção: Necessidades Especiais */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="hasSpecialNeeds"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-start space-x-3">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked === true);
                          if (!checked) {
                            form.setValue("specialNeedsDescription", "");
                          }
                        }}
                      />
                    </FormControl>
                    <div className="space-y-1">
                      <FormLabel className="cursor-pointer">
                        O participante possui necessidades especiais?
                      </FormLabel>
                      <FormDescription>
                        Marque se o participante precisa de acomodações
                        especiais
                      </FormDescription>
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {hasSpecialNeeds && (
              <FormField
                control={form.control}
                name="specialNeedsDescription"
                render={({ field }) => (
                  <FormItem className="ml-7">
                    <FormLabel>Descreva as necessidades especiais *</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Por favor, descreva as necessidades especiais..."
                        className={cn(
                          errors.specialNeedsDescription && "border-red-500"
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          {/* Seção: Preferências */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Preferências e Termos
            </h4>

            {/* Notificações por Email */}
            <FormField
              control={form.control}
              name="acceptsEmailNotifications"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-start space-x-3">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) =>
                          field.onChange(checked === true)
                        }
                      />
                    </FormControl>
                    <div className="space-y-1">
                      <FormLabel className="cursor-pointer">
                        Receber notificações por e-mail
                      </FormLabel>
                      <FormDescription>
                        Atualizações sobre inscrição, evento e futuros festivais
                      </FormDescription>
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Termos e Condições */}
            <FormField
              control={form.control}
              name="acceptsTerms"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-start space-x-3">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) =>
                          field.onChange(checked === true)
                        }
                        className={cn(errors.acceptsTerms && "border-red-500")}
                      />
                    </FormControl>
                    <div className="space-y-1">
                      <FormLabel className="cursor-pointer">
                        Li e aceito os termos e condições *
                      </FormLabel>
                      <FormDescription>
                        Você deve aceitar os termos para continuar
                      </FormDescription>
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Botões de Ação */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting || isPending}
              className="flex-1"
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting || isPending || !isDirty}
              className="flex-1 bg-verde-suave hover:bg-verde-suave/90"
            >
              {isSubmitting || isPending ? (
                <Loading />
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Participante
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
};

export default AddParticipantModal;
