import { Settings } from "lucide-react";
import { Control } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { APPROVAL_MODES } from "@/constants";
import { EventFormData } from "@/validators/events";

interface EventSettingsSectionProps {
  formValues: EventFormData;
  errors?: any;
  isEditing?: boolean;
  control: Control<EventFormData>;
}

export function EventSettingsSection({
  formValues,
  errors = {},
  isEditing = false,
  control,
}: EventSettingsSectionProps) {
  return (
    <div>
      <h4 className="font-semibold text-cinza-chumbo mb-4 flex items-center">
        <Settings className="w-5 h-5 mr-2" /> Configurações
      </h4>

      {/* Configurações */}
      <div className="space-y-4">
        {/* Evento Público */}
        <FormField
          control={control}
          name="isPublic"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center space-x-3">
                <FormControl>
                  <Switch
                    id="isPublic"
                    disabled={!isEditing}
                    checked={!!field.value}
                    onCheckedChange={(checked: boolean) =>
                      field.onChange(!!checked)
                    }
                  />
                </FormControl>
                <FormLabel htmlFor="isPublic" className="!m-0">
                  Evento público (visível para todos)
                </FormLabel>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Requer Aprovação */}
        <FormField
          control={control}
          name="requiresApproval"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center space-x-3">
                <FormControl>
                  <Switch
                    id="requiresApproval"
                    disabled={!isEditing}
                    checked={!!field.value}
                    onCheckedChange={(checked: boolean) =>
                      field.onChange(!!checked)
                    }
                  />
                </FormControl>
                <FormLabel htmlFor="requiresApproval" className="!m-0">
                  Inscrições requerem aprovação
                </FormLabel>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Modalidade de Aprovação */}
        {formValues.requiresApproval && (
          <div className="ml-6">
            <FormField
              control={control}
              name="approvalMode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Modalidade de Aprovação</FormLabel>
                  <FormControl>
                    <Select
                      defaultValue={field.value as string}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        className={`w-full ${errors.approvalMode ? "!border-red-500 focus:!border-red-500 ring-red-500" : ""}`}
                      >
                        <SelectValue placeholder="Selecione a modalidade" />
                      </SelectTrigger>
                      <SelectContent>
                        {APPROVAL_MODES.map((mode) => (
                          <SelectItem key={mode.value} value={mode.value}>
                            <div className="flex flex-col items-start space-x-2">
                              <div className="font-medium">{mode.label}</div>
                              <div className="text-xs text-gray-500">
                                {mode.description}
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
      </div>
    </div>
  );
}
