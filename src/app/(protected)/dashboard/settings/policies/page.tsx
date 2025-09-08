"use client";

import { FileText } from "lucide-react";
import { useRouter } from "next/navigation";

import Breadcrumb from "@/components/dashboard/Breadcrumb";

export default function PoliciesSettingsPage() {
  const router = useRouter();

  return (
    <div className="p-6">
      <Breadcrumb
        title="Políticas e Regras"
        description="Configure políticas gerais do sistema (ex: aprovações, limites, segurança)."
        icon={<FileText className="w-5 h-5 mr-2 text-verde-suave" />}
        backButton={() => router.back()}
      />

      <div className="p-6 border rounded-xl bg-white/60">
        <p className="text-cinza-chumbo/70">
          Em breve: formulários para editar políticas e regras do sistema.
        </p>
      </div>
    </div>
  );
}
