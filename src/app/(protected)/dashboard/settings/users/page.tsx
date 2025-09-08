"use client";

import { Pencil, Plus, Trash2, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Breadcrumb from "@/components/dashboard/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ROLES } from "@/constants";
import { useConfirm } from "@/hooks/use-confirm";
import { useSession } from "@/lib/auth-client";
import {
  createUserAction,
  deleteUserAction,
  listUsers,
  setUserActiveAction,
  updateUserRoleAction,
  type AppUser,
} from "@/server/users";

export default function UsersSettingsPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const currentUserId = session?.user?.id as string | undefined;

  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: ROLES.OPERATOR as string,
  });
  const { confirm, ConfirmDialog } = useConfirm();

  const load = async () => {
    try {
      setLoading(true);
      const res = await listUsers(search);
      if (res.success) setUsers(res.data);
    } catch (e) {
      setError("Erro ao carregar utilizadores");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const canEdit = (u: AppUser) =>
    Boolean(currentUserId) && u.id !== currentUserId;

  const onCreate = async () => {
    if (!form.name || !form.email) return;
    const res = await createUserAction(form);
    if (!res.success) {
      setError(res.error || "Erro ao criar utilizador");
      return;
    }
    setForm({ name: "", email: "", role: ROLES.OPERATOR });
    setShowCreate(false);
    await load();
  };

  const onToggleActive = async (u: AppUser) => {
    if (!canEdit(u)) return;
    await setUserActiveAction({ id: u.id, active: !u.isActive });
    await load();
  };

  const onChangeRole = async (u: AppUser, role: string) => {
    if (!canEdit(u)) return;
    await updateUserRoleAction({ id: u.id, role });
    await load();
  };

  const onDelete = async (u: AppUser) => {
    if (!canEdit(u)) return;
    const ok = await confirm({
      title: "Remover utilizador",
      description: `Deseja remover ${u.name}? Esta ação não pode ser desfeita.`,
      confirmText: "Remover",
      cancelText: "Cancelar",
      destructive: true,
    });
    if (!ok) return;
    await deleteUserAction(u.id);
    await load();
  };

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb
        title="Utilizadores e Regras"
        description="Gerir contas, papéis (roles) e permissões"
        icon={<Users className="w-5 h-5 mr-2 text-verde-suave" />}
        backButton={() => router.back()}
      />

      {/* Criar novo */}
      {!showCreate ? (
        <div className="festival-card p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-cinza-chumbo">
              Adicionar novo utilizador
            </h3>
            <Button onClick={() => setShowCreate(true)}>
              <Plus className="w-4 h-4 mr-2" /> Adicionar novo utilizador
            </Button>
          </div>
        </div>
      ) : (
        <div className="festival-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-cinza-chumbo">Novo utilizador</h3>
            <Button variant="outline" onClick={() => setShowCreate(false)}>
              Cancelar
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <Input
              placeholder="Nome"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Input
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <Select
              value={form.role}
              onValueChange={(v) => setForm({ ...form, role: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Papel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ROLES.OPERATOR}>Operador</SelectItem>
                <SelectItem value={ROLES.ADMIN}>Administrador</SelectItem>
                <SelectItem value={ROLES.MASTER}>Master</SelectItem>
              </SelectContent>
            </Select>
            <div className="md:col-span-2 flex items-center justify-end">
              <Button onClick={onCreate}>
                <Plus className="w-4 h-4 mr-2" />
                Cadastrar
              </Button>
            </div>
          </div>
          <p className="text-xs text-cinza-chumbo/60 mt-2">
            O utilizador pode usar “Esqueci minha senha” para definir uma senha.
          </p>
        </div>
      )}

      {/* Lista */}
      <div className="festival-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-cinza-chumbo">
            Lista de utilizadores
          </h3>
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Pesquisar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button variant="outline" onClick={load}>
              Buscar
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-cinza-chumbo/70 py-8">
            A carregar...
          </div>
        ) : users.length === 0 ? (
          <div className="text-center text-cinza-chumbo/70 py-8">
            Sem utilizadores
          </div>
        ) : (
          <div className="space-y-2">
            {users.map((u) => {
              const isEditing = editingId === u.id;
              const disableRowActions = !(isEditing && canEdit(u));
              return (
                <div
                  key={u.id}
                  className={`flex items-center justify-between p-3 border rounded-lg bg-white/60 ${isEditing ? "border-verde-suave" : ""}`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-cinza-chumbo">
                      {u.name}
                    </div>
                    <div className="text-xs text-cinza-chumbo/70">
                      Email:
                      {u.email}
                    </div>
                    <div className="text-xs text-cinza-chumbo/70">
                      Criado em: {u.createdAt.toLocaleString()}
                    </div>
                  </div>
                  <div className="flex flex-col justify-end space-y-1">
                    <div className="flex items-center space-x-3 ">
                      <Button
                        className="ml-auto"
                        variant={isEditing ? "primary" : "outline"}
                        onClick={() => setEditingId(isEditing ? null : u.id)}
                        disabled={!canEdit(u)}
                        title={isEditing ? "Concluir" : "Editar"}
                      >
                        <Pencil className="w-4 h-4 mr-1" />
                        {isEditing ? "Concluir" : "Editar"}
                      </Button>
                      {isEditing && (
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-cinza-chumbo/70">
                              Ativo
                            </span>
                            <Switch
                              checked={u.isActive}
                              onCheckedChange={() => onToggleActive(u)}
                              disabled={disableRowActions}
                            />
                          </div>
                          <Select
                            value={u.role}
                            onValueChange={(v) => onChangeRole(u, v)}
                            disabled={disableRowActions}
                          >
                            <SelectTrigger className="w-[160px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={ROLES.OPERATOR}>
                                Operador
                              </SelectItem>
                              <SelectItem value={ROLES.ADMIN}>
                                Administrador
                              </SelectItem>
                              <SelectItem value={ROLES.MASTER}>
                                Master
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            variant="ghost"
                            onClick={() => onDelete(u)}
                            disabled={disableRowActions}
                            title={
                              canEdit(u)
                                ? "Remover"
                                : "Não pode remover a si mesmo"
                            }
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="text-xs ml-auto text-orange-500/70">
                      Atualizado em: {u.updatedAt.toLocaleString()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
      </div>
      <ConfirmDialog />
    </div>
  );
}
