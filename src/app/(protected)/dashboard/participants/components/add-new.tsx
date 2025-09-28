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
import { z } from "zod";

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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { EVENT_CATEGORIES, EXPERIENCE_LEVELS } from "@/constants";
import { useConfirm } from "@/hooks/use-confirm";
import {
  useCheckEmailExists,
  useCreateParticipantWithTermsEmail,
} from "@/hooks/use-participants";
import { useSonner } from "@/hooks/use-sonner";
import {
  NewParticipant,
  Participant,
  participantStatusEnum,
} from "@/infra/database/schema";
import { cn } from "@/lib/utils";
import { participantRegistrationSchema } from "@/validators/participants";

interface AddParticipantModalProps {
  isOpen: boolean;
  onClose: () => void;
  setParticipant: (participant: Participant) => void;
}

const modalSchema = participantRegistrationSchema
  .omit({ eventId: true, acceptsTerms: true })
  .extend({
    hasSpecialNeeds: z.boolean(),
    acceptsEmailNotifications: z.boolean(),
    sendTermsAndConditionsByEmail: z.boolean(),
  });

type ParticipantRegistrationForm = z.infer<typeof modalSchema>;

const AddParticipantModal: React.FC<AddParticipantModalProps> = ({
  isOpen,
  onClose,
  setParticipant,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  const { showError, showSuccess } = useSonner();
  const { mutate: createParticipant, isPending } =
    useCreateParticipantWithTermsEmail();
  const { mutate: checkEmail } = useCheckEmailExists();
  const { confirm, ConfirmDialog } = useConfirm();

  const form = useForm<ParticipantRegistrationForm>({
    resolver: zodResolver(modalSchema),
    reValidateMode: "onSubmit",
    criteriaMode: "all",
    shouldFocusError: true,
    defaultValues: {
      name: "",
      stageName: "",
      email: "",
      phone: "",
      photoImageId: "",
      category: undefined,
      experience: undefined,
      additionalInfo: "",
      hasSpecialNeeds: false,
      specialNeedsDescription: "",
      acceptsEmailNotifications: true,
      sendTermsAndConditionsByEmail: false,
    },
  });

  const {
    formState: { errors, isDirty },
    watch,
    reset,
  } = form;

  // Observar campo de necessidades especiais
  const hasSpecialNeeds = watch("hasSpecialNeeds");

  // Função para verificar email quando sair do campo
  const handleEmailCheck = useCallback(
    (email: string) => {
      if (!email || email.length < 5) {
        setEmailError(null);
        return;
      }

      setIsCheckingEmail(true);
      setEmailError(null);

      checkEmail(email, {
        onSuccess: (response) => {
          setIsCheckingEmail(false);
          if (response.exists) {
            setEmailError("Este email já está cadastrado no sistema");
            form.setError("email", {
              type: "manual",
              message: "Este email já está cadastrado no sistema",
            });
          } else {
            setEmailError(null);
            form.clearErrors("email");
          }
        },
        onError: (error) => {
          setIsCheckingEmail(false);
          console.error("Erro ao verificar email:", error);
          // Não mostrar erro para o usuário, apenas log
        },
      });
    },
    [checkEmail, form]
  );

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
      const message =
        (firstVal as { message?: string })?.message || "Campo inválido";

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
    [getFieldError, showError, form]
  );

  const onSubmit = async (values: ParticipantRegistrationForm) => {
    try {
      setIsSubmitting(true);

      // Verificar se há erro de email antes de prosseguir
      if (emailError) {
        showError("Por favor, corrija o erro de email antes de continuar", {
          title: "Email inválido",
          description: emailError,
        });
        return;
      }

      if (!values.sendTermsAndConditionsByEmail) {
        const result = await confirm({
          title: "Atenção: Termos e condições",
          description:
            "O Cadastro só estará ativa se o participante aceitar os termos e condições clicando no link enviado por email",
          confirmText: "Continuar",
          cancelText: "Cancelar",
          destructive: false,
        });

        if (!result) {
          return;
        }
      }

      const participant: NewParticipant = {
        ...values,
        stageName: values.stageName || null,
        phone: values.phone || null,
        category: values.category || undefined,
        experience: values.experience || undefined,
        additionalInfo: values.additionalInfo || null,
        specialNeedsDescription: values.specialNeedsDescription || null,
        photoImageId: values.photoImageId || null,
        registrationDate: new Date(),
        status: participantStatusEnum.enumValues[1],
      };

      createParticipant(participant, {
        onSuccess: (response) => {
          if (response.emailSent) {
            showSuccess("Participante adicionado com sucesso!", {
              title: "Sucesso",
              description:
                "O participante foi registrado no sistema e os termos foram enviados por email",
            });
          } else {
            showSuccess("Participante adicionado com sucesso!", {
              title: "Sucesso",
              description: "O participante foi registrado no sistema",
            });
          }
          setParticipant(response.data as Participant);
          reset();
          onClose();
        },
        onError: (error) => {
          showError(
            error instanceof Error
              ? error.message
              : "Erro ao adicionar participante",
            {
              title: "Erro",
              description:
                "Não foi possível adicionar o participante. Tente novamente.",
            }
          );
        },
      });
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

  const handleClose = useCallback(() => {
    reset();
    setShowValidationErrors(false);
    setEmailError(null);
    onClose();
  }, [reset, onClose]);

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
                        {val?.message || "Campo inválido"}
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
                      onFileChange={(file) => {
                        if (file) {
                          // Aqui você precisaria implementar o upload do arquivo
                          // Por enquanto, vamos usar um placeholder
                          field.onChange(file.id || "");
                        } else {
                          field.onChange("");
                        }
                      }}
                      defaultAvatar={field.value || ""}
                      showInstructions={true}
                      size="24"
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
                      {isCheckingEmail && (
                        <span className="text-xs text-blue-600 animate-pulse">
                          Verificando...
                        </span>
                      )}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type="email"
                          placeholder="exemplo@email.com"
                          onBlur={(e) => {
                            field.onBlur();
                            handleEmailCheck(e.target.value);
                          }}
                          className={cn(
                            "h-12 pr-10",
                            errors.email && "border-red-500 focus:ring-red-500",
                            emailError && "border-red-500 focus:ring-red-500"
                          )}
                        />
                        {isCheckingEmail && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                          </div>
                        )}
                        {field.value &&
                          field.value.length >= 5 &&
                          !isCheckingEmail &&
                          !emailError && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                              <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                <svg
                                  className="w-2 h-2 text-white"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                            </div>
                          )}
                      </div>
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
                      <Switch
                        checked={field.value}
                        onCheckedChange={(checked) =>
                          field.onChange(checked === true)
                        }
                      />
                    </FormControl>
                    <div className="space-y-1">
                      <FormLabel className="cursor-pointer">
                        Aceitar Receber notificações por e-mail
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
              name="sendTermsAndConditionsByEmail"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-start space-x-3">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={(checked) =>
                          field.onChange(checked === true)
                        }
                      />
                    </FormControl>
                    <div className="space-y-1">
                      <FormLabel
                        htmlFor="acceptsTerms"
                        className="cursor-pointer"
                      >
                        Envia termos e condições por email para participante
                      </FormLabel>
                      <FormDescription>
                        O Cadastro só estará ativa se o participante aceitar os
                        termos e condições enviado por email
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
              disabled={
                isSubmitting ||
                isPending ||
                !isDirty ||
                !!emailError ||
                isCheckingEmail
              }
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
      <ConfirmDialog />
    </Modal>
  );
};

export default AddParticipantModal;
