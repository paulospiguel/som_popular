"use client";

import { CalendarDays, Clock, MapPin, Users } from "lucide-react";
import { Control, Controller, useFormContext } from "react-hook-form";

import AISuggestionForm from "@/components/automation-form";
import { Checkbox } from "@/components/ui/checkbox";
import { DateTimePicker } from "@/components/ui/date-picker";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { EVENT_CATEGORIES, EVENT_TYPES } from "@/constants";
import { EventFormData } from "@/validators/events";

interface EventFormFieldsProps {
  control: Control<EventFormData>;
  isEditing: boolean;
  formValues: EventFormData;
  currentParticipants: number;
  errors?: Record<string, { message?: string }>;
}

export function EventFormFields({
  control,
  isEditing,
  formValues,
  currentParticipants = 0,
  errors,
}: EventFormFieldsProps) {
  const { setValue } = useFormContext();
  return (
    <div className="space-y-6">
      {/* Debug visual temporário */}
      {Object.keys(errors || {}).length > 0 && (
        <div className="bg-red-100 border border-red-300 rounded p-2 text-sm">
          <strong>Erros detectados:</strong>{" "}
          {Object.keys(errors || {}).join(", ")}
        </div>
      )}
      {/* Informações básicas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col gap-2">
          <Label htmlFor="type">Tipo de Evento</Label>
          <div className="w-full">
            {isEditing ? (
              <Controller
                control={control}
                name="type"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      className={`w-full ${errors?.type ? "!border-red-500 focus:!border-red-500 ring-red-500" : ""}`}
                    >
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {EVENT_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            ) : (
              <p className="font-semibold text-cinza-chumbo">
                {EVENT_TYPES.find((t) => t.value === formValues.type)?.label ||
                  formValues.type}
              </p>
            )}
          </div>
          {errors?.type && (
            <p className="text-sm text-red-500 flex items-center">
              <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
              {errors.type.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="category">Modalidade</Label>
          <div className="w-full">
            {isEditing ? (
              <Controller
                control={control}
                name="category"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      className={`w-full ${errors?.category ? "!border-red-500 focus:!border-red-500 ring-red-500" : ""}`}
                    >
                      <SelectValue placeholder="Selecione a modalidade" />
                    </SelectTrigger>
                    <SelectContent>
                      {EVENT_CATEGORIES.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            ) : (
              <p className="font-semibold text-cinza-chumbo">
                {EVENT_CATEGORIES.find((c) => c.value === formValues.category)
                  ?.label || formValues.category}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="location">Localização</Label>
          <div className="w-full">
            {isEditing ? (
              <FormField
                control={control}
                name="location"
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Local do evento..."
                    error={errors?.location?.message}
                    className={`font-normal w-full`}
                    viewMode={!isEditing}
                  />
                )}
              />
            ) : (
              <p className="font-semibold text-cinza-chumbo flex items-center">
                <MapPin className="w-4 h-4 mr-1" /> {formValues.location}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Descrição */}
      <div>
        <Label htmlFor="description">Descrição do Evento</Label>
        {isEditing ? (
          <>
            <div className="flex items-center justify-end mb-2">
              <AISuggestionForm
                label="Gerar descrição com IA"
                className="float-right"
                defaultTargets={["longo"]}
                references={["title", "location", "category", "type"]}
                onChangeValue={(value) => {
                  setValue("description", value);
                }}
                context={{
                  title: formValues.name,
                  location: formValues.location,
                  category: formValues.category,
                  type: formValues.type,
                }}
              />
            </div>
            <Controller
              control={control}
              name="description"
              render={({ field }) => (
                <Textarea
                  {...field}
                  value={field.value || ""}
                  placeholder="Descrição do evento..."
                  className={`mt-1 ${errors?.description ? "!border-red-500 focus:!border-red-500 ring-red-500" : ""}`}
                />
              )}
            />
          </>
        ) : (
          <p className="mt-1 text-cinza-chumbo whitespace-pre-wrap">
            {formValues.description || "Sem descrição"}
          </p>
        )}
      </div>

      {/* Participantes e Datas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col col-span-1 md:col-span-2 gap-2">
          <Label htmlFor="maxParticipants" className="flex items-center">
            <Users className="w-4 h-4 mr-1" />
            Limite de Participantes
          </Label>
          <div>
            {isEditing ? (
              <Controller
                control={control}
                name="maxParticipants"
                render={({ field }) => (
                  <Input
                    {...field}
                    type="number"
                    placeholder="Máximo de participantes (opcional)"
                    min={1}
                    value={field.value || ""}
                    className={
                      errors?.maxParticipants
                        ? "!border-red-500 focus:!border-red-500 ring-red-500"
                        : ""
                    }
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? parseInt(e.target.value) : 0
                      )
                    }
                  />
                )}
              />
            ) : (
              <p className="font-semibold text-cinza-chumbo">
                {currentParticipants}
                {" / "}
                {formValues.maxParticipants || "♾️"}
              </p>
            )}
          </div>
        </div>

        <h3 className="text-lg font-semibold text-cinza-chumbo flex items-center">
          <Clock className="w-4 h-4 mr-1" /> Datas e Horários
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 col-span-1 md:col-span-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="startDate" className="flex items-center">
              <CalendarDays className="w-4 h-4 mr-1" /> Data e Hora de Início
            </Label>
            <div>
              {isEditing ? (
                <Controller
                  control={control}
                  name="startDate"
                  render={({ field }) => (
                    <DateTimePicker
                      date={field.value}
                      onDateChange={field.onChange}
                      className={
                        errors?.startDate
                          ? "!border-red-500 focus:!border-red-500 ring-red-500"
                          : ""
                      }
                    />
                  )}
                />
              ) : (
                <p className="font-semibold text-cinza-chumbo">
                  {formValues.startDate
                    ? new Date(formValues.startDate).toLocaleDateString("pt-BR")
                    : "Sem início definido"}{" "}
                  <span className="text-sm text-cinza-chumbo/70">
                    {formValues.startDate
                      ? `às ${new Date(formValues.startDate).toLocaleTimeString(
                          "pt-BR",
                          { hour: "2-digit", minute: "2-digit" }
                        )}`
                      : ""}
                  </span>
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="endDate">Data e Hora de Fim</Label>
            <div>
              {isEditing ? (
                <Controller
                  control={control}
                  name="endDate"
                  render={({ field }) => (
                    <DateTimePicker
                      date={field.value || undefined}
                      onDateChange={field.onChange}
                      className={
                        errors?.endDate
                          ? "!border-red-500 focus:!border-red-500 ring-red-500"
                          : ""
                      }
                    />
                  )}
                />
              ) : formValues.endDate ? (
                <p className="font-semibold text-cinza-chumbo">
                  {new Date(formValues.endDate).toLocaleDateString("pt-BR")}{" "}
                  <span className="text-sm text-cinza-chumbo/70">
                    às{" "}
                    {new Date(formValues.endDate).toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </p>
              ) : (
                <p className="text-sm text-cinza-chumbo/50 italic">
                  Não definido
                </p>
              )}
            </div>
          </div>

          {/* <div className="flex flex-col gap-2">
            <Label
              htmlFor="registrationStartDate"
              className="flex items-center"
            >
              <Clock className="w-4 h-4 mr-1" /> Início das Inscrições
            </Label>
            <div>
              {isEditing ? (
                <Controller
                  control={control}
                  name="registrationStartDate"
                  render={({ field }) => (
                    <DateTimePicker
                      date={field.value || undefined}
                      onDateChange={field.onChange}
                      className={
                        errors?.registrationStartDate
                          ? "!border-red-500 focus:!border-red-500 ring-red-500"
                          : ""
                      }
                    />
                  )}
                />
              ) : formValues.registrationStartDate ? (
                <p className="font-semibold text-cinza-chumbo">
                  {new Date(
                    formValues.registrationStartDate
                  ).toLocaleDateString("pt-BR")}{" "}
                  <span className="text-sm text-cinza-chumbo/70">
                    às{" "}
                    {new Date(
                      formValues.registrationStartDate
                    ).toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </p>
              ) : (
                <p className="text-sm text-cinza-chumbo/50 italic">
                  Não definido
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="registrationEndDate">Fim das Inscrições</Label>
            <div>
              {isEditing ? (
                <Controller
                  control={control}
                  name="registrationEndDate"
                  render={({ field }) => (
                    <DateTimePicker
                      date={field.value || undefined}
                      onDateChange={field.onChange}
                      className={
                        errors?.registrationEndDate
                          ? "!border-red-500 focus:!border-red-500 ring-red-500"
                          : ""
                      }
                    />
                  )}
                />
              ) : formValues.registrationEndDate ? (
                <p className="font-semibold text-cinza-chumbo">
                  {new Date(formValues.registrationEndDate).toLocaleDateString(
                    "pt-BR"
                  )}{" "}
                  <span className="text-sm text-cinza-chumbo/70">
                    às{" "}
                    {new Date(
                      formValues.registrationEndDate
                    ).toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </p>
              ) : (
                <p className="text-sm text-cinza-chumbo/50 italic">
                  Não definido
                </p>
              )}
            </div>
          </div> */}
        </div>

        {/* Ativar janela de inscrições personalizada */}
        <FormField
          control={control}
          name="customRegistrationWindow"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <div className="flex items-center space-x-3">
                <FormControl>
                  <Checkbox
                    id="customRegistrationWindow"
                    disabled={!isEditing}
                    checked={!!field.value}
                    onCheckedChange={(checked: boolean) =>
                      field.onChange(!!checked)
                    }
                  />
                </FormControl>
                <FormLabel htmlFor="customRegistrationWindow" className="!m-0">
                  Definir início e fim das inscrições manualmente
                </FormLabel>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Início das Inscrições */}
        {formValues.customRegistrationWindow ? (
          <FormField
            control={control}
            name="registrationStartDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Início das Inscrições</FormLabel>
                <FormControl>
                  <DateTimePicker
                    date={field.value || undefined}
                    onDateChange={(date: Date | undefined) =>
                      field.onChange(date)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
          <div className="text-sm text-cinza-chumbo/70">
            O início das inscrições será na publicação do evento.
          </div>
        )}

        {/* Fim das Inscrições */}
        {formValues.customRegistrationWindow ? (
          <FormField
            control={control}
            name="registrationEndDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fim das Inscrições</FormLabel>
                <FormControl>
                  <DateTimePicker
                    date={field.value || undefined}
                    onDateChange={(date: Date | undefined) =>
                      field.onChange(date)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
          <div className="text-sm text-cinza-chumbo/70">
            O fim das inscrições será 1 hora antes do início do evento.
          </div>
        )}
      </div>
    </div>
  );
}
