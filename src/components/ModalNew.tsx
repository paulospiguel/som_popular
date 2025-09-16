"use client";

import { XIcon } from "lucide-react";
import { ReactNode, useEffect, useId } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ModalNewProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  icon?: ReactNode;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "large" | "full";
  children: ReactNode;
  headerActions?: ReactNode;
  trigger?: ReactNode;
}

const sizeClasses = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-md",
  lg: "sm:max-w-lg",
  xl: "sm:max-w-2xl",
  large: "sm:max-w-[65vw]",
  full: "sm:max-w-full",
};

export function ModalNew({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  children,
  size = "xl",
  showCloseButton = true,
  closeOnOverlayClick = true,
  className = "",
  headerActions,
  trigger,
}: ModalNewProps) {
  const id = useId();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const content = (
    <DialogContent
      className={`flex flex-col gap-0 overflow-y-visible p-0 ${sizeClasses[size]} [&>button:last-child]:top-3.5 ${className}`}
      onPointerDownOutside={closeOnOverlayClick ? onClose : () => {}}
    >
      <DialogHeader className="contents space-y-0 text-left">
        {(title || subtitle || icon || showCloseButton) && (
          <div className="sticky top-0 z-10 bg-white border-b border-cinza-chumbo/10 rounded-t-2xl">
            <div className="flex items-center justify-between p-6">
              {(title || subtitle || icon) && (
                <div className="flex items-center space-x-3">
                  {icon && (
                    <div className="w-12 h-12 bg-verde-suave/10 rounded-full flex items-center justify-center">
                      {icon}
                    </div>
                  )}
                  <div>
                    {title && (
                      <DialogTitle className="text-xl font-bold text-cinza-chumbo">
                        {title}
                      </DialogTitle>
                    )}
                    {subtitle && (
                      <p className="text-sm text-cinza-chumbo/70">{subtitle}</p>
                    )}
                  </div>
                </div>
              )}
              <div className="flex items-center space-x-2">
                {headerActions}
                {showCloseButton && (
                  <DialogClose asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="p-2 hover:bg-cinza-chumbo/10 rounded-lg transition-colors"
                      aria-label="Fechar modal"
                    >
                      <XIcon className="w-5 h-5 text-cinza-chumbo" />
                    </Button>
                  </DialogClose>
                )}
              </div>
            </div>
          </div>
        )}
      </DialogHeader>

      <DialogDescription className="sr-only">
        {subtitle || "Modal content"}
      </DialogDescription>

      <div className="overflow-y-auto">
        <div className="p-6">{children}</div>
      </div>
    </DialogContent>
  );

  if (trigger) {
    return (
      <Dialog
        key={id}
        open={isOpen}
        onOpenChange={(open) => !open && onClose()}
      >
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        {content}
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      {content}
    </Dialog>
  );
}

// Componente para botões do modal
interface ModalButtonsProps {
  children: ReactNode;
  className?: string;
}

export function ModalButtons({ children, className = "" }: ModalButtonsProps) {
  return (
    <DialogFooter className="border-t px-6 py-4">
      <div className={`flex space-x-3 w-full ${className}`}>{children}</div>
    </DialogFooter>
  );
}

// Botão secundário (cancelar, etc.)
interface ModalSecondaryButtonProps {
  onClick: () => void;
  children: ReactNode;
  disabled?: boolean;
  className?: string;
}

export function ModalSecondaryButton({
  onClick,
  children,
  disabled = false,
  className = "",
}: ModalSecondaryButtonProps) {
  return (
    <DialogClose asChild>
      <Button
        type="button"
        variant="outline"
        onClick={onClick}
        disabled={disabled}
        className={`flex-1 ${className}`}
      >
        {children}
      </Button>
    </DialogClose>
  );
}

// Botão primário (confirmar, salvar, etc.)
interface ModalPrimaryButtonProps {
  onClick: () => void;
  children: ReactNode;
  disabled?: boolean;
  variant?: "success" | "danger" | "primary";
  className?: string;
}

const variantClasses = {
  success: "bg-green-600 hover:bg-green-700 disabled:bg-green-300",
  danger: "bg-red-600 hover:bg-red-700 disabled:bg-red-300",
  primary: "bg-verde-suave hover:bg-verde-suave/90 disabled:bg-verde-suave/50",
};

export function ModalPrimaryButton({
  onClick,
  children,
  disabled = false,
  variant = "primary",
  className = "",
}: ModalPrimaryButtonProps) {
  return (
    <DialogClose asChild>
      <Button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={`flex-1 ${variantClasses[variant]} ${className}`}
      >
        {children}
      </Button>
    </DialogClose>
  );
}

// Componente para formulários com validação
interface ModalFormProps {
  children: ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
  className?: string;
}

export function ModalForm({
  children,
  onSubmit,
  className = "",
}: ModalFormProps) {
  return (
    <form onSubmit={onSubmit} className={`space-y-4 ${className}`}>
      {children}
    </form>
  );
}

// Componente para campos de formulário
interface ModalFieldProps {
  label: string;
  children: ReactNode;
  required?: boolean;
  className?: string;
}

export function ModalField({
  label,
  children,
  required = false,
  className = "",
}: ModalFieldProps) {
  const id = useId();

  return (
    <div className={`space-y-2 ${className}`}>
      <Label
        htmlFor={id}
        className={
          required ? "after:content-['*'] after:text-red-500 after:ml-1" : ""
        }
      >
        {label}
      </Label>
      {children}
    </div>
  );
}

// Componente para campos de input
interface ModalInputProps {
  id?: string;
  placeholder?: string;
  defaultValue?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
  className?: string;
}

export function ModalInput({
  id,
  placeholder,
  defaultValue,
  value,
  onChange,
  type = "text",
  required = false,
  className = "",
}: ModalInputProps) {
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <Input
      id={inputId}
      placeholder={placeholder}
      defaultValue={defaultValue}
      value={value}
      onChange={onChange}
      type={type}
      required={required}
      className={className}
    />
  );
}

// Componente para textarea
interface ModalTextareaProps {
  id?: string;
  placeholder?: string;
  defaultValue?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  maxLength?: number;
  required?: boolean;
  className?: string;
  rows?: number;
}

export function ModalTextarea({
  id,
  placeholder,
  defaultValue,
  value,
  onChange,
  maxLength,
  required = false,
  className = "",
  rows = 3,
}: ModalTextareaProps) {
  const generatedId = useId();
  const textareaId = id || generatedId;

  return (
    <Textarea
      id={textareaId}
      placeholder={placeholder}
      defaultValue={defaultValue}
      value={value}
      onChange={onChange}
      maxLength={maxLength}
      required={required}
      className={className}
      rows={rows}
    />
  );
}
