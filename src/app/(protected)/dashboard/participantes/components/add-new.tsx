import { Modal } from "@/components/Modal";
import { Checkbox } from "@/components/ui/checkbox";
import { ImageUpload } from "@/components/ui/image-upload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Participant } from "@/database/schema";
import { cn } from "@/lib/utils";
import { participantSchema } from "@/schemas/participant";
import { Updater, useForm } from "@tanstack/react-form";
import { Plus } from "lucide-react";
import { useState } from "react";
import z from "zod";

const categories = [
  {
    label: "Vocal",
    value: "vocal",
  },
  {
    label: "Instrumental",
    value: "instrumental",
  },
  {
    label: "Banda",
    value: "banda",
  },
  {
    label: "DJ",
    value: "dj",
  },
] as const;

const AddParticipantModal = ({
  isOpen,
  onClose,
  setParticipant,
}: {
  isOpen: boolean;
  onClose: () => void;
  setParticipant: (participant: Participant) => void;
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      avatar: "", // ✅ NOVO: Campo avatar
      category: "" as const,
      experience: "" as const,
      additionalInfo: "",
      hasSpecialNeeds: false,
      specialNeedsDescription: "",
      acceptsEmailNotifications: true,
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      try {
        const validatedData = participantSchema.parse(value);

        const participant = {
          ...validatedData,
          id: Date.now().toString(),
          status: "pending",
          registrationDate: new Date(),
          notes: "",
          archived: false,
        } as Participant;

        setParticipant(participant);
        onClose();
      } catch (error) {
        console.error("Erro ao adicionar participante:", error);
        // Aqui podes mostrar uma toast de erro ao utilizador
      } finally {
        setIsSubmitting(false);
      }
    },
    // Remove esta parte completamente:
    // validators: {
    //   onSubmit: participantSchema.parse,
    // },
  });

  const FieldError = ({ field }: { field: any }) => {
    return field.state.meta.isTouched && field.state.meta.errors.length > 0 ? (
      <p className="text-red-500 text-sm mt-1">
        {field.state.meta.errors.join(", ")}
      </p>
    ) : null;
  };

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
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-6"
      >
        {/* Informações Pessoais */}
        <div>
          <h4 className="font-semibold text-cinza-chumbo mb-4">
            Informações Pessoais
          </h4>

          <div className="mb-6">
            <form.Field
              name="avatar"
              children={(field) => (
                <div>
                  <label className="block text-sm font-medium text-cinza-chumbo mb-2">
                    Foto de Perfil (Opcional)
                  </label>
                  <ImageUpload
                    value={field.state.value}
                    onChange={(value) => field.handleChange(value)}
                  />
                  <FieldError field={field} />
                </div>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nome */}
            <form.Field
              name="name"
              validators={{
                onChange: (value) => {
                  try {
                    participantSchema.shape.name.parse(value.value);
                    return undefined;
                  } catch (error) {
                    return (error as z.ZodError).issues[0].message;
                  }
                },
              }}
              children={(field) => (
                <div>
                  <label className="block text-sm font-medium text-cinza-chumbo mb-2">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-verde-suave focus:border-transparent transition-colors ${
                      field.state.meta.errors.length > 0
                        ? "border-red-300"
                        : "border-gray-200"
                    }`}
                    placeholder="Digite o nome completo"
                  />
                  <FieldError field={field} />
                </div>
              )}
            />

            {/* Email */}
            <form.Field
              name="email"
              validators={{
                onChange: (value) => {
                  try {
                    participantSchema.shape.email.parse(value.value);
                    return undefined;
                  } catch (error) {
                    return (error as z.ZodError).issues[0].message;
                  }
                },
              }}
              children={(field) => (
                <div>
                  <label className="block text-sm font-medium text-cinza-chumbo mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-verde-suave focus:border-transparent transition-colors ${
                      field.state.meta.errors.length > 0
                        ? "border-red-300"
                        : "border-gray-200"
                    }`}
                    placeholder="exemplo@email.com"
                  />
                  <FieldError field={field} />
                </div>
              )}
            />

            {/* Telefone */}
            <form.Field
              name="phone"
              validators={{
                onChange: (value) => {
                  try {
                    participantSchema.shape.phone.parse(value.value);
                    return undefined;
                  } catch (error) {
                    return (error as z.ZodError).issues[0].message;
                  }
                },
              }}
              children={(field) => (
                <div>
                  <label className="block text-sm font-medium text-cinza-chumbo mb-2">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    value={field.state.value || ""}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-verde-suave focus:border-transparent transition-colors ${
                      field.state.meta.errors.length > 0
                        ? "border-red-300"
                        : "border-gray-200"
                    }`}
                    placeholder="+351 912 345 678"
                  />
                  <FieldError field={field} />
                </div>
              )}
            />
          </div>
        </div>

        {/* Informações Complementares */}
        <div className="mt-4">
          <h4 className="font-semibold text-cinza-chumbo mb-4">
            Informações Complementares
          </h4>
          {/* Necessidades Especiais */}
          <div className="my-4">
            <form.Field
              name="hasSpecialNeeds"
              children={(field) => (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={field.name}
                      checked={field.state.value || false}
                      onCheckedChange={(checked) => {
                        console.log(checked);
                        const booleanValue = checked === true;
                        field.handleChange(booleanValue);

                        setTimeout(() => {
                          if (!booleanValue) {
                            // ✅ Aceder ao campo de forma mais segura
                            const descriptionField = form.getFieldInfo(
                              "specialNeedsDescription"
                            );
                            if (descriptionField?.instance) {
                              descriptionField.instance.handleChange("");
                            }
                          }
                        }, 0);
                      }}
                    />
                    <label
                      htmlFor={field.name}
                      className="text-sm font-medium text-cinza-chumbo cursor-pointer"
                    >
                      O participante declara que tem alguma necessidades
                      especiais?
                    </label>
                  </div>
                  <FieldError field={field} />
                </div>
              )}
            />

            <form.Subscribe
              selector={(state) => state.values.hasSpecialNeeds}
              children={(hasSpecialNeeds) => {
                if (!hasSpecialNeeds) return null;

                return (
                  <form.Field
                    name="specialNeedsDescription"
                    validators={{
                      onChange: (value) => {
                        try {
                          participantSchema.shape.specialNeedsDescription.parse(
                            value.value
                          );
                          return undefined;
                        } catch (error) {
                          return (error as z.ZodError).issues[0].message;
                        }
                      },
                    }}
                    children={(field) => (
                      <div className="ml-6 mt-3">
                        <label
                          htmlFor={field.name}
                          className="block text-sm font-medium text-cinza-chumbo mb-2"
                        >
                          Especifica qual a necessidade especial *
                        </label>
                        <textarea
                          id={field.name}
                          name={field.name}
                          value={field.state.value || ""}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="Por favor, descreve as tuas necessidades especiais para que possamos preparar o melhor ambiente possível..."
                          rows={3}
                          className={cn(
                            "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500",
                            field.state.meta.isTouched &&
                              field.state.meta.errors.length > 0 &&
                              "border-red-500"
                          )}
                        />
                        <FieldError field={field} />
                      </div>
                    )}
                  />
                );
              }}
            />
          </div>
        </div>

        {/* Informações Artísticas */}
        <div>
          <h4 className="font-semibold text-cinza-chumbo mb-4">
            Informações Artísticas
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Categoria */}
            <form.Field
              validators={{
                onChange: (value) => {
                  try {
                    participantSchema.shape.category.parse(value.value);
                    return undefined;
                  } catch (error) {
                    return (error as z.ZodError).issues[0].message;
                  }
                },
              }}
              name="category"
              children={(field) => (
                <div>
                  <label className="block text-sm font-medium text-cinza-chumbo mb-2">
                    Categoria *
                  </label>

                  <Select
                    name="category"
                    value={field.state.value}
                    onValueChange={(value) =>
                      field.handleChange(value as Updater<"">)
                    }
                  >
                    <SelectTrigger
                      className={cn(
                        "w-full min-h-12",
                        field.state.meta.errors.length > 0
                          ? "border-red-300"
                          : "border-gray-200"
                      )}
                    >
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError field={field} />
                </div>
              )}
            />

            {/* Experiência */}
            <form.Field
              name="experience"
              validators={{
                onChange: (value) => {
                  try {
                    participantSchema.shape.experience.parse(value.value);
                    return undefined;
                  } catch (error) {
                    return (error as z.ZodError).issues[0].message;
                  }
                },
              }}
              children={(field) => (
                <div>
                  <label className="block text-sm font-medium text-cinza-chumbo mb-2">
                    Nível de Experiência *
                  </label>
                  <Select
                    name="experience"
                    value={field.state.value}
                    onValueChange={(value) =>
                      field.handleChange(value as Updater<"">)
                    }
                  >
                    <SelectTrigger
                      className={cn(
                        "w-full min-h-12",
                        field.state.meta.errors.length > 0
                          ? "border-red-300"
                          : "border-gray-200"
                      )}
                    >
                      <SelectValue placeholder="Selecione o nível" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="iniciante">Iniciante</SelectItem>
                      <SelectItem value="intermedio">Intermédio</SelectItem>
                      <SelectItem value="avancado">Avançado</SelectItem>
                    </SelectContent>
                  </Select>
                  <FieldError field={field} />
                </div>
              )}
            />
          </div>

          {/* Notas Adicionais */}
          <div className="mt-4">
            <form.Field
              name="additionalInfo"
              children={(field) => (
                <div>
                  <label className="block text-sm font-medium text-cinza-chumbo mb-2">
                    Notas Adicionais
                  </label>
                  <textarea
                    value={field.state.value || ""}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-verde-suave focus:border-transparent transition-colors ${
                      field.state.meta.errors.length > 0
                        ? "border-red-300"
                        : "border-gray-200"
                    }`}
                    rows={3}
                    placeholder="Notas adicionais sobre o participante"
                  />
                  <FieldError field={field} />
                  <p className="text-xs text-cinza-chumbo/60 mt-1">
                    {field.state.value?.length || 0}/500 caracteres
                  </p>
                </div>
              )}
            />
          </div>
        </div>

        {/* Notificações */}
        <div>
          <h4 className="font-semibold text-cinza-chumbo mb-4">
            Preferências de Comunicação
          </h4>
          <form.Field
            name="acceptsEmailNotifications"
            defaultValue={false}
            children={(field) => (
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="emailNotifications"
                  checked={field.state.value}
                  onCheckedChange={(checked) =>
                    field.handleChange(checked as Updater<boolean>)
                  }
                  className="w-4 h-4 text-verde-suave bg-gray-100 border-gray-300 rounded focus:ring-verde-suave focus:ring-2"
                />
                <label
                  htmlFor="emailNotifications"
                  className="text-sm text-cinza-chumbo"
                >
                  Aceito receber notificações por email sobre este evento e
                  futuros eventos
                </label>
              </div>
            )}
          />
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

          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmittingForm]) => (
              <button
                type="submit"
                disabled={!canSubmit || isSubmitting}
                className="flex-1 bg-verde-suave text-white py-3 px-4 rounded-xl hover:bg-verde-suave/90 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting || isSubmittingForm ? (
                  <span>A adicionar...</span>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    <span>Adicionar Participante</span>
                  </>
                )}
              </button>
            )}
          />
        </div>
      </form>
    </Modal>
  );
};

export default AddParticipantModal;
