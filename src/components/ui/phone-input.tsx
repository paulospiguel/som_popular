"use client";

import { Phone } from "lucide-react";
import React, { forwardRef, useEffect, useState } from "react";

import { cn } from "@/lib/utils";

export interface PhoneInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "onBlur"
  > {
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: (value: string) => void;
  countryCode?: string;
  placeholder?: string;
  error?: boolean;
  className?: string;
  label?: string;
  required?: boolean;
}

// Formatos de telefone por país
const PHONE_FORMATS = {
  BR: {
    mask: "(00) 00000-0000",
    placeholder: "(11) 99999-9999",
    length: 11,
    regex: /^\(?([1-9]{2})\)?[-. ]?([0-9]{4,5})[-. ]?([0-9]{4})$/,
  },
  PT: {
    mask: "000 000 000",
    placeholder: "912 345 678",
    length: 9,
    regex: /^[0-9]{9}$/,
  },
  US: {
    mask: "(000) 000-0000",
    placeholder: "(555) 123-4567",
    length: 10,
    regex: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
  },
  // Adicionar mais países conforme necessário
};

// Função para aplicar máscara ao telefone
const applyPhoneMask = (value: string, countryCode: string = "BR"): string => {
  const format = PHONE_FORMATS[countryCode as keyof typeof PHONE_FORMATS];
  if (!format) return value;

  // Remove tudo que não é número
  const numbers = value.replace(/\D/g, "");

  // Limita o tamanho
  const limitedNumbers = numbers.slice(0, format.length);

  // Aplica a máscara
  let masked = format.mask;
  let numberIndex = 0;

  for (
    let i = 0;
    i < masked.length && numberIndex < limitedNumbers.length;
    i++
  ) {
    if (masked[i] === "0") {
      masked =
        masked.slice(0, i) + limitedNumbers[numberIndex] + masked.slice(i + 1);
      numberIndex++;
    }
  }

  // Remove caracteres não preenchidos
  return masked.replace(/0/g, "").replace(/[()\-\s]+$/, "");
};

// Função para remover máscara
const removePhoneMask = (value: string): string => {
  return value.replace(/\D/g, "");
};

// Função para validar telefone
const validatePhone = (value: string, countryCode: string = "BR"): boolean => {
  const format = PHONE_FORMATS[countryCode as keyof typeof PHONE_FORMATS];
  if (!format) return false;

  const cleanValue = removePhoneMask(value);
  return format.regex.test(cleanValue) && cleanValue.length === format.length;
};

// Função para formatar telefone para exibição
const formatPhoneForDisplay = (
  value: string,
  countryCode: string = "BR"
): string => {
  if (!value) return "";

  const cleanValue = removePhoneMask(value);
  const format = PHONE_FORMATS[countryCode as keyof typeof PHONE_FORMATS];

  if (!format || cleanValue.length !== format.length) {
    return value; // Retorna o valor original se não conseguir formatar
  }

  return applyPhoneMask(cleanValue, countryCode);
};

const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    {
      value = "",
      onChange,
      onBlur,
      countryCode = "BR",
      placeholder,
      error = false,
      className,
      label,
      required = false,
      ...props
    },
    ref
  ) => {
    const [displayValue, setDisplayValue] = useState("");
    const [isFocused, setIsFocused] = useState(false);

    const format = PHONE_FORMATS[countryCode as keyof typeof PHONE_FORMATS];
    const currentPlaceholder = placeholder || format?.placeholder || "";

    // Inicializa o valor de exibição
    useEffect(() => {
      if (value) {
        setDisplayValue(formatPhoneForDisplay(value, countryCode));
      } else {
        setDisplayValue("");
      }
    }, [value, countryCode]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      const cleanValue = removePhoneMask(inputValue);

      // Aplica a máscara
      const maskedValue = applyPhoneMask(cleanValue, countryCode);
      setDisplayValue(maskedValue);

      // Chama onChange com o valor limpo (apenas números)
      if (onChange) {
        onChange(cleanValue);
      }
    };

    const handleBlur = (_e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);

      // Formata o valor final para exibição
      const cleanValue = removePhoneMask(displayValue);
      if (cleanValue) {
        const formattedValue = formatPhoneForDisplay(cleanValue, countryCode);
        setDisplayValue(formattedValue);

        if (onBlur) {
          onBlur(cleanValue);
        }
      }
    };

    const handleFocus = () => {
      setIsFocused(true);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Permite apenas números, backspace, delete, tab, escape, enter
      const allowedKeys = [
        "Backspace",
        "Delete",
        "Tab",
        "Escape",
        "Enter",
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
        "Home",
        "End",
      ];

      if (allowedKeys.includes(e.key)) {
        return;
      }

      // Permite apenas números
      if (!/[0-9]/.test(e.key)) {
        e.preventDefault();
      }
    };

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Phone className="h-5 w-5 text-gray-400" />
          </div>

          <input
            ref={ref}
            type="tel"
            value={displayValue}
            onChange={handleInputChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
            placeholder={currentPlaceholder}
            className={cn(
              "block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm",
              "placeholder-gray-400",
              "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
              "disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed",
              error && "border-red-300 focus:ring-red-500 focus:border-red-500",
              isFocused && "ring-2 ring-blue-500 border-blue-500",
              className
            )}
            {...props}
          />

          {/* Indicador de país */}
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded">
              {countryCode}
            </span>
          </div>
        </div>

        {/* Mensagem de erro */}
        {error && (
          <p className="mt-1 text-sm text-red-600">
            Formato de telefone inválido
          </p>
        )}

        {/* Dica de formato */}
        {!error && displayValue && (
          <p className="mt-1 text-xs text-gray-500">Formato: {format?.mask}</p>
        )}
      </div>
    );
  }
);

PhoneInput.displayName = "PhoneInput";

export { formatPhoneForDisplay, PhoneInput, removePhoneMask, validatePhone };
