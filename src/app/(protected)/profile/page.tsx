"use client";

import { ImageIcon, KeyRound, Save, Shield, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Breadcrumb from "@/components/dashboard/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { useSession, requestPasswordReset } from "@/lib/auth-client";
import { getMyProfile, updateMyProfile, changeMyPassword } from "@/server/profile";
import { DiscreteImageUpload } from "@/components/ui/discrete-image-upload";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", image: "" });
  const [pwd, setPwd] = useState({ current: "", next: "", confirm: "" });

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await getMyProfile();
        if (res.success) {
          setForm({ name: res.data.name, email: res.data.email, image: res.data.image || "" });
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
      const res = await updateMyProfile({ name: form.name, image: form.image || null });
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
                  readOnly
                  disabled
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm text-cinza-chumbo/70 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" /> Foto de Perfil
                </label>
                <DiscreteImageUpload
                  value={form.image}
                  onChange={(value: string) => setForm({ ...form, image: value })}
                  maxSize={2}
                  acceptedTypes={["image/jpeg","image/jpg","image/png","image/webp"]}
                  placeholder="Adicionar/alterar foto"
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

            {/* Alterar senha diretamente */}
            <div className="mt-6 pt-6 border-t space-y-4">
              <h4 className="font-semibold text-cinza-chumbo flex items-center gap-2">
                <KeyRound className="w-4 h-4" /> Alterar senha
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm text-cinza-chumbo/70">Senha atual</label>
                  <Input
                    type="password"
                    value={pwd.current}
                    onChange={(e) => setPwd({ ...pwd, current: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm text-cinza-chumbo/70">Nova senha</label>
                  <Input
                    type="password"
                    value={pwd.next}
                    onChange={(e) => setPwd({ ...pwd, next: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm text-cinza-chumbo/70">Confirmar nova senha</label>
                  <Input
                    type="password"
                    value={pwd.confirm}
                    onChange={(e) => setPwd({ ...pwd, confirm: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  variant="secondary"
                  onClick={async () => {
                    if (!pwd.current || !pwd.next) {
                      showToast({ type: "error", title: "Preencha as senhas" });
                      return;
                    }
                    if (pwd.next !== pwd.confirm) {
                      showToast({ type: "error", title: "As senhas não coincidem" });
                      return;
                    }
                    if (pwd.next.length < 6) {
                      showToast({ type: "error", title: "A senha deve ter pelo menos 6 caracteres" });
                      return;
                    }
                    const res = await changeMyPassword({ currentPassword: pwd.current, newPassword: pwd.next });
                    if (res.success) {
                      showToast({ type: "success", title: "Senha alterada" });
                      setPwd({ current: "", next: "", confirm: "" });
                    } else {
                      showToast({ type: "error", title: res.error || "Não foi possível alterar a senha" });
                    }
                  }}
                >
                  Guardar nova senha
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
