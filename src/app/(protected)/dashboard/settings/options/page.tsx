"use client";

import { Plus, Tags, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Breadcrumb from "@/components/dashboard/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EVENT_CATEGORIES, EVENT_TYPES } from "@/constants";

export default function EventOptionsSettings() {
  const [categories, setCategories] = useState<{ label: string; value: string }[]>(
    EVENT_CATEGORIES.map((c) => ({ label: c.label as string, value: c.value as string }))
  );
  const [types, setTypes] = useState<{ label: string; value: string }[]>(
    EVENT_TYPES.map((t) => ({ label: t.label as string, value: t.value as string }))
  );
  const [newCat, setNewCat] = useState({ label: "", value: "" });
  const [newType, setNewType] = useState({ label: "", value: "" });

  const router = useRouter();

  useEffect(() => {
    // TODO: carregar opções do backend quando houver persistência
  }, []);

  const addCategory = () => {
    if (!newCat.label || !newCat.value) return;
    setCategories((prev) => [...prev, newCat]);
    setNewCat({ label: "", value: "" });
  };

  const addType = () => {
    if (!newType.label || !newType.value) return;
    setTypes((prev) => [...prev, newType]);
    setNewType({ label: "", value: "" });
  };

  const removeCategory = (value: string) => {
    setCategories((prev) => prev.filter((c) => c.value !== value));
  };

  const removeType = (value: string) => {
    setTypes((prev) => prev.filter((t) => t.value !== value));
  };

  const saveAll = async () => {
    // TODO: implementar ação de persistência no backend (Drizzle)
    alert("Salvará em breve: persistência backend pendente");
  };

  return (
    <div className="p-6 space-y-8">
      <Breadcrumb
        title="Opções de Eventos"
        description="Configure categorias e tipos de eventos."
        icon={<Tags className="w-5 h-5 mr-2 text-verde-suave" />}
        backButton={() => router.back()}
      />
      <Tabs defaultValue="categories">
        <TabsList>
          <TabsTrigger value="categories">Categorias</TabsTrigger>
          <TabsTrigger value="types">Tipos</TabsTrigger>
        </TabsList>
        <TabsContent value="categories">
          <section className="festival-card p-6">
            <h3 className="font-semibold text-cinza-chumbo mb-4">Categorias</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
              <Input
                placeholder="Label"
                value={newCat.label}
                onChange={(e) =>
                  setNewCat({ ...newCat, label: e.target.value })
                }
              />
              <Input
                placeholder="Valor (slug)"
                value={newCat.value}
                onChange={(e) =>
                  setNewCat({ ...newCat, value: e.target.value })
                }
              />
              <Button onClick={addCategory}>
                <Plus className="w-4 h-4 mr-1" /> Adicionar
              </Button>
            </div>
            <div className="space-y-2">
              {categories.map((c) => (
                <div
                  key={c.value}
                  className="flex items-center justify-between p-2 border rounded"
                >
                  <div>
                    <div className="font-medium">{c.label}</div>
                    <div className="text-xs text-cinza-chumbo/70">
                      {c.value}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => removeCategory(c.value)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </section>
        </TabsContent>
        <TabsContent value="types">
          <section className="festival-card p-6">
            <h3 className="font-semibold text-cinza-chumbo mb-4">Tipos</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
              <Input
                placeholder="Label"
                value={newType.label}
                onChange={(e) =>
                  setNewType({ ...newType, label: e.target.value })
                }
              />
              <Input
                placeholder="Valor (slug)"
                value={newType.value}
                onChange={(e) =>
                  setNewType({ ...newType, value: e.target.value })
                }
              />
              <Button onClick={addType}>
                <Plus className="w-4 h-4 mr-1" /> Adicionar
              </Button>
            </div>
            <div className="space-y-2">
              {types.map((t) => (
                <div
                  key={t.value}
                  className="flex items-center justify-between p-2 border rounded"
                >
                  <div>
                    <div className="font-medium">{t.label}</div>
                    <div className="text-xs text-cinza-chumbo/70">
                      {t.value}
                    </div>
                  </div>
                  <Button variant="ghost" onClick={() => removeType(t.value)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </section>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={saveAll}>Guardar alterações</Button>
      </div>
    </div>
  );
}
