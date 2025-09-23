"use client";

import { Trophy } from "lucide-react";
import { Control, Controller } from "react-hook-form";

import { TagsInput } from "@/components/ui/tags-input";
import { EventFormData } from "@/validators/events";

interface EventPrizesSectionProps {
  control: Control<EventFormData>;
  isEditing: boolean;
  formValues: EventFormData;
}

export function EventPrizesSection({
  control,
  isEditing,
  formValues,
}: EventPrizesSectionProps) {
  const prizesArray = formValues.prizes
    ? formValues.prizes.split(",").filter(Boolean)
    : [];

  return (
    <div>
      <h4 className="font-semibold text-cinza-chumbo mb-4 flex items-center">
        <Trophy className="w-5 h-5 mr-2" /> Prémios
      </h4>
      {isEditing ? (
        <Controller
          control={control}
          name="prizes"
          render={({ field }) => (
            <TagsInput
              disabled={false}
              value={prizesArray}
              onChange={(value) => field.onChange(value.join(","))}
              name="prizes"
              placeHolder="Prémios do evento..."
              maxTagsCount={5}
              icon={Trophy}
            />
          )}
        />
      ) : (
        <div className="space-y-2">
          {prizesArray.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {prizesArray.map((prize, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full text-sm font-medium shadow-sm"
                >
                  <Trophy className="w-4 h-4 mr-2 text-amber-100" />
                  {prize.trim()}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Sem prémios definidos</p>
          )}
        </div>
      )}
    </div>
  );
}
