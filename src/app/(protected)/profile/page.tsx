"use client";

import { Save, Shield, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Breadcrumb from "@/components/dashboard/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { useSession, requestPasswordReset } from "@/lib/auth-client";
import { getMyProfile, updateMyProfile } from "@/server/profile";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", email: "" });

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await getMyProfile();
        if (res.success) {
          setForm({ name: res.data.name, email: res.data.email });
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const onSave = async () => {
    try {
      setSubmitting(true);
      const res = await updateMyProfile(form);
      if (res.success) {
        showToast({ type: "success", title: "Perfil atualizado" });
        router.refresh();
      } else {
        showToast({ type: "error", title: res.error || "Erro ao atualizar" });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const onRequestPasswordReset = async () => {
    const email = form.email || session?.user?.email;
    if (!email) return;
    try {
      await requestPasswordReset({ email });
      showToast({ type: "success", title: "Email de redefinição enviado" });
    } catch {
      showToast({ type: "error", title: "Não foi possível enviar o email" });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb
        title="Meu Perfil"
        description="Atualize suas informações de conta"
        icon={<User className="w-5 h-5 mr-2 text-verde-suave" />}
        backButton={() => router.back()}
      />

      <div className="festival-card p-6 space-y-4">
        {loading ? (
          <div className="text-cinza-chumbo/70">A carregar...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-cinza-chumbo/70">Nome</label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm text-cinza-chumbo/70">Email</label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Button onClick={onSave} disabled={submitting}>
                <Save className="w-4 h-4 mr-2" /> Guardar alterações
              </Button>

              <Button variant="outline" onClick={onRequestPasswordReset}>
                <Shield className="w-4 h-4 mr-2" /> Redefinir senha por email
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

