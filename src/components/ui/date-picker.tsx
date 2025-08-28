"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import * as React from "react";

interface DatePickerProps {
  date?: Date | undefined;
  onDateChange?: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function DatePicker({
  date,
  onDateChange,
  placeholder = "Selecione uma data",
  className,
  disabled = false,
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP", { locale: ptBR }) : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onDateChange || (() => {})}
          initialFocus
          locale={ptBR}
        />
      </PopoverContent>
    </Popover>
  );
}

interface DateTimePickerProps {
  date?: Date | undefined;
  onDateChange?: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function DateTimePicker({
  date,
  onDateChange,
  placeholder = "Selecione data e hora",
  className,
  disabled = false,
}: DateTimePickerProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    date
  );
  const [selectedTime, setSelectedTime] = React.useState<string>(
    date ? format(date, "HH:mm") : ""
  );
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    if (date) {
      setSelectedDate(date);
      setSelectedTime(format(date, "HH:mm"));
    }
  }, [date]);

  const handleDateChange = (newDate: Date | undefined) => {
    setSelectedDate(newDate);
    if (newDate && selectedTime) {
      const [hours, minutes] = selectedTime.split(":").map(Number);
      const combinedDate = new Date(newDate);
      combinedDate.setHours(hours, minutes, 0, 0);
      onDateChange?.(combinedDate);
    } else if (newDate) {
      // Se não há hora selecionada, usar hora atual
      const now = new Date();
      const combinedDate = new Date(newDate);
      combinedDate.setHours(now.getHours(), now.getMinutes(), 0, 0);
      setSelectedTime(format(combinedDate, "HH:mm"));
      onDateChange?.(combinedDate);
    } else {
      onDateChange?.(newDate);
    }
  };

  const handleTimeChange = (time: string) => {
    setSelectedTime(time);
    if (selectedDate && time) {
      const [hours, minutes] = time.split(":").map(Number);
      const combinedDate = new Date(selectedDate);
      combinedDate.setHours(hours, minutes, 0, 0);
      onDateChange?.(combinedDate);
    }
  };

  const handleTimePreset = (preset: string) => {
    const [hours, minutes] = preset.split(":").map(Number);
    const newTime = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
    setSelectedTime(newTime);

    if (selectedDate) {
      const combinedDate = new Date(selectedDate);
      combinedDate.setHours(hours, minutes, 0, 0);
      onDateChange?.(combinedDate);
    }
  };

  const timePresets = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
  ];

  const displayValue =
    selectedDate && selectedTime
      ? `${format(selectedDate, "dd/MM/yyyy", { locale: ptBR })} às ${selectedTime}`
      : placeholder;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal min-h-10",
            !selectedDate && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {displayValue}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="start">
        <div className="space-y-4">
          {/* Calendário */}
          <div>
            <h4 className="font-medium text-sm mb-2 text-gray-700">
              Selecionar Data
            </h4>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateChange}
              initialFocus
              locale={ptBR}
            />
          </div>

          {/* Seleção de Hora */}
          {selectedDate && (
            <div className="border-t pt-4">
              <h4 className="font-medium text-sm mb-3 text-gray-700 flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Selecionar Hora
              </h4>

              {/* Input de hora personalizado */}
              <div className="mb-3">
                <input
                  type="time"
                  value={selectedTime}
                  onChange={(e) => handleTimeChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-verde-suave focus:border-transparent transition-colors text-sm"
                  disabled={disabled}
                />
              </div>

              {/* Presets de hora */}
              <div>
                <p className="text-xs text-gray-500 mb-2">Horários comuns:</p>
                <div className="grid grid-cols-4 gap-2">
                  {timePresets.map((preset) => (
                    <button
                      key={preset}
                      onClick={() => handleTimePreset(preset)}
                      className={cn(
                        "px-2 py-1 text-xs rounded border transition-colors",
                        selectedTime === preset
                          ? "bg-verde-suave text-white border-verde-suave"
                          : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                      )}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Botão de confirmação */}
              <div className="mt-4 pt-3 border-t">
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full bg-verde-suave text-white px-3 py-2 rounded-lg hover:bg-verde-suave/90 transition-colors text-sm"
                >
                  Confirmar Seleção
                </button>
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
