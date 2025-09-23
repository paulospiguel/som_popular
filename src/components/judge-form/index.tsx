"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import AvatarUpload from "@/components/ui/discrete-image-upload";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useCreateJudge } from "@/hooks/use-judges";
import { judgeFormSchema, type JudgeFormData } from "@/validators/judges";

interface JudgeFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  isModal?: boolean;
}

export const JudgeForm = ({
  onSuccess,
  onCancel,
  isModal = false,
}: JudgeFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createJudgeMutation = useCreateJudge();

  const form = useForm<JudgeFormData>({
    resolver: zodResolver(judgeFormSchema),
    defaultValues: {
      name: "",
      description: "",
      notes: "",
      isActive: true,
      photoImageId: "",
    },
  });

  const onSubmit = async (data: JudgeFormData) => {
    setIsSubmitting(true);

    try {
      const result = await createJudgeMutation.mutateAsync({
        name: data.name.trim(),
        description: data.description?.trim() || null,
        notes: data.notes?.trim() || null,
        isActive: data.isActive,
        photoImageId: data.photoImageId || null,
      });

      if (result.success) {
        toast.success("Jurado criado com sucesso!");
        form.reset();
        onSuccess?.();
      } else {
        toast.error(result.error || "Erro ao criar jurado");
      }
    } catch (error) {
      console.error("Erro ao criar jurado:", error);
      toast.error("Erro ao criar jurado");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-cinza-chumbo">
          {isModal ? "Adicionar Novo Jurado" : "Formulário de Jurado"}
        </h3>
        <p className="text-sm text-cinza-chumbo/70 mt-1">
          Preencha os dados do jurado para adicioná-lo ao sistema.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-4">
          {/* Foto do Jurado */}
          <div className="flex md:flex-row flex-col justify-between items-center gap-4">
            <div className="space-y-2 flex-1">
              <label className="text-sm font-medium text-cinza-chumbo">
                Foto do Jurado
              </label>
              <div className="flex items-center gap-4 px-2">
                <AvatarUpload
                  //value={form.watch("photoImageId") || ""}
                  // onChange={(value) => form.setValue("photoImageId", value)}
                  className="w-16 h-16 py-2"
                  // acceptedTypes={[
                  //   "image/jpeg",
                  //   "image/jpg",
                  //   "image/png",
                  //   "image/webp",
                  // ]}
                  // placeholder=" "
                />
                <div className="text-xs text-cinza-chumbo/60">
                  <p>Formatos aceitos: JPG, PNG, WebP</p>
                  <p>Tamanho máximo: 3MB</p>
                </div>
              </div>
            </div>

            <div className="space-y-2 flex-1">
              {/* Status Ativo */}
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Jurado Ativo</FormLabel>
                      <div className="text-sm text-cinza-chumbo/70">
                        Jurados inativos não aparecerão nas listas de seleção
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Nome */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome Completo *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Digite o nome completo do jurado"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Descrição */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Breve descrição sobre o jurado (opcional)"
                    className="resize-none"
                    rows={3}
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Notas */}
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notas Internas</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Notas internas sobre o jurado (opcional)"
                    className="resize-none"
                    rows={3}
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Botões */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting || createJudgeMutation.isPending}
              className="flex-1"
            >
              {isSubmitting || createJudgeMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar Jurado"
              )}
            </Button>

            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
                className="flex-1 sm:flex-none"
              >
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

export { EventJudgesModal } from "./EventJudgesModal";
