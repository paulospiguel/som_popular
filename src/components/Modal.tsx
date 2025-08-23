import { X } from "lucide-react";
import { ReactNode, useEffect } from "react";

interface ModalProps {
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
  headerActions?: ReactNode; // Nova prop para ações no header
}

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-2xl",
  large: "max-w-[65vw]",
  full: "w-full",
};

export function Modal({
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
}: ModalProps) {
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 print:bg-transparent print:p-0">
      <div
        className={`bg-white relative rounded-2xl shadow-2xl print:shadow-none w-full ${sizeClasses[size]} max-h-[90vh] overflow-y-auto ${className} print:min-w-full`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(title || subtitle || icon || showCloseButton) && (
          <div className="sticky print:hidden top-0 z-10 bg-white border-b border-cinza-chumbo/10 rounded-t-2xl">
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
                      <h2 className="text-xl font-bold text-cinza-chumbo">
                        {title}
                      </h2>
                    )}
                    {subtitle && (
                      <p className="text-sm text-cinza-chumbo/70">{subtitle}</p>
                    )}
                  </div>
                </div>
              )}
              <div className="flex items-center space-x-2">
                {/* Ações do header */}
                {headerActions}
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-cinza-chumbo/10 rounded-lg transition-colors"
                    aria-label="Fechar modal"
                  >
                    <X className="w-5 h-5 text-cinza-chumbo" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6 print:p-0">{children}</div>
      </div>

      {/* Overlay para fechar ao clicar fora */}
      {closeOnOverlayClick && (
        <div
          className="absolute inset-0 -z-10"
          onClick={onClose}
          aria-label="Fechar modal"
        />
      )}
    </div>
  );
}

// Componente para botões do modal
interface ModalButtonsProps {
  children: ReactNode;
  className?: string;
}

export function ModalButtons({ children, className = "" }: ModalButtonsProps) {
  return <div className={`flex space-x-3 mt-6 ${className}`}>{children}</div>;
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
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex-1 px-4 py-3 border border-cinza-chumbo/20 text-cinza-chumbo rounded-xl hover:bg-cinza-chumbo/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${className}`}
    >
      {children}
    </button>
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
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex-1 px-4 py-3 text-white rounded-xl disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2 ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
