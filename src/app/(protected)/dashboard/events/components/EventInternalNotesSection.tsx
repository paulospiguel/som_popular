import { Newspaper } from "lucide-react";
import { Control } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EventFormData } from "@/validators/events";

interface EventInternalNotesSectionProps {
  control: Control<EventFormData>;
  isEditing: boolean;
  formValues: EventFormData;
}

export function EventInternalNotesSection({
  control,
  isEditing,
  formValues,
}: EventInternalNotesSectionProps) {
  return (
    <>
      {/* Notas Internas */}
      <div className="grid grid-cols-1 gap-6">
        <div className="flex flex-col gap-2">
          <Label htmlFor="notes" className="flex items-center">
            <Newspaper className="w-4 h-4 mr-1" />
            Notas Internas
          </Label>
          <FormField
            control={control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  {isEditing ? (
                    <Textarea
                      {...field}
                      value={field.value || ""}
                      placeholder="Notas internas sobre o evento"
                    />
                  ) : (
                    <p className="text-cinza-chumbo whitespace-pre-wrap text-sm">
                      {formValues.notes}
                    </p>
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </>
  );
}
