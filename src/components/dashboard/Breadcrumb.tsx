"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "../ui/button";

interface BreadcrumbProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  backButton?: () => void;
  goToHome?: boolean;
}

export default function Breadcrumb({
  title,
  description,
  icon,
  backButton,
  goToHome = false,
}: BreadcrumbProps) {
  const router = useRouter();

  const handleBackButton = () => {
    if (backButton) {
      backButton();
    } else if (goToHome) {
      router.push("/dashboard");
    } else {
      router.back();
    }
  };
  return (
    <div className="festival-card p-6 mb-6">
      <div className="flex items-center justify-between">
        {(backButton || goToHome) && (
          <Button
            variant="ghost"
            size="sm"
            className="p-2 text-verde-suave"
            onClick={handleBackButton}
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
        )}
      </div>
      <h2 className="festival-subtitle text-xl flex items-center">
        {icon}
        {title}
      </h2>
      <p className="text-cinza-chumbo/70 mt-2">{description}</p>
    </div>
  );
}
