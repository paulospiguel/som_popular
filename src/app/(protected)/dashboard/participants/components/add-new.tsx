import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useMemo } from "react";
import { useForm } from "react-hook-form";

import { Modal } from "@/components/Modal";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ImageUpload } from "@/components/ui/image-upload";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EVENT_CATEGORIES } from "@/constants";
import { cn } from "@/lib/utils";
import { participantSchema } from "@/schemas/participant";
import { Participant } from "@/server/database/schema";

const AddParticipantModal = ({
  isOpen,
  onClose,
  setParticipant,
}: {
  isOpen: boolean;
  onClose: () => void;
  setParticipant: (participant: Participant) => void;
}) => {
  // Schema específico para o modal (sem eventId)
  const modalSchema = useMemo(
    () => participantSchema.omit({ eventId: true }),
    []
  );

  const form = useForm<{ [k: string]: any }>({
    resolver: zodResolver(modalSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      avatar: "",
      category: "",
      experience: "",
      additionalInfo: "",
      hasSpecialNeeds: false,
      specialNeedsDescription: "",
      acceptsEmailNotifications: true,
    },
  });

  const onSubmit = async (value: any) => {
    try {
      const validatedData = modalSchema.parse(value);

      const participant = {
        ...validatedData,
        id: Date.now().toString(),
        status: "pending",
        registrationDate: new Date(),
        notes: "",
        archived: false,
        approvedAt: new Date(),
        approvedBy: null,
        rejectedAt: null,
        rejectedBy: null,
        rejectionReason: null,
        updatedAt: new Date(),
        createdAt: new Date(),
      } as Participant;

      setParticipant(participant);
      onClose();
    } catch (error) {
      console.error("Erro ao adicionar participante:", error);
    }
  };

  return (
    <Modal
      size="large"
      isOpen={isOpen}
      onClose={onClose}
      title="Adicionar Participante"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Informações Pessoais */}
          <div>
            <h4 className="font-semibold text-cinza-chumbo mb-4">
              Informações Pessoais
            </h4>

            <div className="mb-6">
              <div>
                <label className="block text-sm font-medium text-cinza-chumbo mb-2">
                  Foto de Perfil (Opcional)
                </label>
                <FormField
                  control={form.control}
                  name="avatar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Foto de Perfil (Opcional)</FormLabel>
                      <FormControl>
                        <ImageUpload
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nome */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Completo *</FormLabel>
                    <FormControl>
                      <Input
                        variant="lg"
                        type="text"
                        placeholder="Digite o nome completo"
                        {...field}
                      />
                    </FormControl>
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
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input
                        variant="lg"
                        type="email"
                        placeholder="exemplo@email.com"
                        {...field}
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
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <PhoneInput
                        value={field.value || ""}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        placeholder="(11) 99999-9999"
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
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
              <div className="space-y-3">
                <FormField
                  control={form.control}
                  name="hasSpecialNeeds"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            id={field.name}
                            checked={!!field.value}
                            onCheckedChange={(checked) => {
                              const booleanValue = checked === true;
                              field.onChange(booleanValue);
                              if (!booleanValue) {
                                form.setValue("specialNeedsDescription", "");
                              }
                            }}
                          />
                        </FormControl>
                        <FormLabel className="!m-0 cursor-pointer">
                          O participante declara que tem alguma necessidades
                          especiais?
                        </FormLabel>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {form.watch("hasSpecialNeeds") && (
                <div className="ml-6 mt-3">
                  <FormField
                    control={form.control}
                    name="specialNeedsDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Especifica qual a necessidade especial *
                        </FormLabel>
                        <FormControl>
                          <textarea
                            {...field}
                            placeholder="Por favor, descreve as tuas necessidades especiais para que possamos preparar o melhor ambiente possível..."
                            rows={3}
                            className={cn(
                              "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            )}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Informações Artísticas */}
          <div>
            <h4 className="font-semibold text-cinza-chumbo mb-4">
              Informações Artísticas
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Categoria */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria *</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className={cn("w-full min-h-12")}>
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          {EVENT_CATEGORIES.map((category) => (
                            <SelectItem
                              key={category.value}
                              value={category.value}
                            >
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
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
                    <FormLabel>Nível de Experiência *</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className={cn("w-full min-h-12")}>
                          <SelectValue placeholder="Selecione o nível" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="iniciante">Iniciante</SelectItem>
                          <SelectItem value="intermedio">Intermédio</SelectItem>
                          <SelectItem value="avancado">Avançado</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Notas Adicionais */}
            <div className="mt-4">
              <FormField
                control={form.control}
                name="additionalInfo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notas Adicionais</FormLabel>
                    <FormControl>
                      <textarea
                        rows={3}
                        placeholder="Notas adicionais sobre o participante"
                        className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-verde-suave focus:border-transparent transition-colors"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-cinza-chumbo/60 mt-1">
                      {form.watch("additionalInfo")?.length || 0}/500 caracteres
                    </p>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Notificações */}
          <div>
            <h4 className="font-semibold text-cinza-chumbo mb-4">
              Preferências de Comunicação
            </h4>
            <FormField
              control={form.control}
              name="acceptsEmailNotifications"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center space-x-3">
                    <FormControl>
                      <Checkbox
                        id="emailNotifications"
                        checked={!!field.value}
                        onCheckedChange={(checked) =>
                          field.onChange(checked === true)
                        }
                        className="w-4 h-4 text-verde-suave bg-gray-100 border-gray-300 rounded focus:ring-verde-suave focus:ring-2"
                      />
                    </FormControl>
                    <FormLabel htmlFor="emailNotifications" className="!m-0">
                      Aceito receber notificações por email sobre este evento e
                      futuros eventos
                    </FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <p className="text-xs text-cinza-chumbo/60 mt-2">
              O participante aceitará receber notificações sobre o estado da sua
              inscrição, detalhes do evento e convites para futuros festivais.
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

            <button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="flex-1 bg-verde-suave text-white py-3 px-4 rounded-xl hover:bg-verde-suave/90 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {form.formState.isSubmitting ? (
                <span>A adicionar...</span>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  <span>Adicionar Participante</span>
                </>
              )}
            </button>
          </div>
        </form>
      </Form>
    </Modal>
  );
};

export default AddParticipantModal;
