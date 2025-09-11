"use client";

import { Palette, Settings, ToggleLeft, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import Breadcrumb from "@/components/dashboard/Breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch, SwitchWrapper } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Label } from "@/components/ui/label";

interface HomePageSettings {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  showSupporters: boolean;
  showNextEvents: boolean;
  showCurrentStatus: boolean;
  showInfoCards: boolean;
  singleEventMode: boolean;
  singleEventId: string | null;
}

export default function HomepageSettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<HomePageSettings>({
    primaryColor: "#4ade80",
    secondaryColor: "#fbbf24",
    accentColor: "#f59e0b",
    showSupporters: true,
    showNextEvents: true,
    showCurrentStatus: true,
    showInfoCards: true,
    singleEventMode: false,
    singleEventId: null,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [events, setEvents] = useState<
    Array<{
      id: string;
      name: string;
      category: string;
      location: string;
      startDate: string | Date;
      status: string;
      registrationStatus: string;
      currentParticipants: number;
      maxParticipants: number | null;
    }>
  >([]);
  const [loadingEvents, setLoadingEvents] = useState(false);

  useEffect(() => {
    loadSettings();
    loadEventsForDropdown();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/settings/homepage");
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error("Erro ao carregar configurações:", error);
      toast.error("Erro ao carregar configurações");
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      const response = await fetch("/api/settings/homepage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        toast.success("Configurações salvas com sucesso!");
        // Refetch para refletir o que foi persistido (inclui normalizações do backend)
        await loadSettings();
      } else {
        throw new Error("Erro ao salvar configurações");
      }
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
      toast.error("Erro ao salvar configurações");
    } finally {
      setSaving(false);
    }
  };

  const loadEventsForDropdown = async () => {
    try {
      setLoadingEvents(true);
      const res = await fetch("/api/events/for-dropdown");
      if (!res.ok) return;
      const data = await res.json();
      setEvents(
        data.map((e: any) => ({
          ...e,
          startDate: e.startDate,
        }))
      );
    } catch (e) {
      console.error("Erro ao carregar eventos:", e);
    } finally {
      setLoadingEvents(false);
    }
  };

  const handleColorChange = (key: keyof HomePageSettings, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleToggleChange = (key: keyof HomePageSettings, value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSingleEventModeChange = (enabled: boolean) => {
    setSettings((prev) => ({
      ...prev,
      singleEventMode: enabled,
      singleEventId: enabled ? prev.singleEventId : null,
    }));
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-verde-suave border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <Breadcrumb
        title="Configurações da Página Principal"
        description="Configure o tema, blocos e modo único evento da página inicial."
        icon={<Settings className="w-5 h-5 mr-2 text-verde-suave" />}
        backButton={() => router.back()}
      />

      <Tabs defaultValue="theme" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="theme" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Tema e Cores
          </TabsTrigger>
          <TabsTrigger value="blocks" className="flex items-center gap-2">
            <ToggleLeft className="w-4 h-4" />
            Blocos da Página
          </TabsTrigger>
          <TabsTrigger value="single-event" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Modo Único Evento
          </TabsTrigger>
        </TabsList>

        <TabsContent value="theme" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-verde-suave" />
                Configurações de Cores
              </CardTitle>
              <CardDescription>
                Personalize as cores do tema da página principal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Cor Primária</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={settings.primaryColor}
                      onChange={(e) =>
                        handleColorChange("primaryColor", e.target.value)
                      }
                      className="w-16 h-10 p-1 border rounded"
                    />
                    <Input
                      value={settings.primaryColor}
                      onChange={(e) =>
                        handleColorChange("primaryColor", e.target.value)
                      }
                      className="flex-1"
                      placeholder="#4ade80"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">Cor Secundária</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={settings.secondaryColor}
                      onChange={(e) =>
                        handleColorChange("secondaryColor", e.target.value)
                      }
                      className="w-16 h-10 p-1 border rounded"
                    />
                    <Input
                      value={settings.secondaryColor}
                      onChange={(e) =>
                        handleColorChange("secondaryColor", e.target.value)
                      }
                      className="flex-1"
                      placeholder="#fbbf24"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accentColor">Cor de Destaque</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="accentColor"
                      type="color"
                      value={settings.accentColor}
                      onChange={(e) =>
                        handleColorChange("accentColor", e.target.value)
                      }
                      className="w-16 h-10 p-1 border rounded"
                    />
                    <Input
                      value={settings.accentColor}
                      onChange={(e) =>
                        handleColorChange("accentColor", e.target.value)
                      }
                      className="flex-1"
                      placeholder="#f59e0b"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Preview das Cores</h4>
                <div className="flex gap-4">
                  <div
                    className="w-16 h-16 rounded-lg border"
                    style={{ backgroundColor: settings.primaryColor }}
                    title="Cor Primária"
                  />
                  <div
                    className="w-16 h-16 rounded-lg border"
                    style={{ backgroundColor: settings.secondaryColor }}
                    title="Cor Secundária"
                  />
                  <div
                    className="w-16 h-16 rounded-lg border"
                    style={{ backgroundColor: settings.accentColor }}
                    title="Cor de Destaque"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blocks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ToggleLeft className="w-5 h-5 text-verde-suave" />
                Blocos da Página Principal
              </CardTitle>
              <CardDescription>
                Habilite ou desabilite seções específicas da página inicial
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Card de Status Atual</h4>
                    <p className="text-sm text-gray-600">
                      Mostra estatísticas dos eventos e participantes
                    </p>
                  </div>
                  <SwitchWrapper>
                    <Switch
                      checked={settings.showCurrentStatus}
                      onCheckedChange={(checked) =>
                        handleToggleChange("showCurrentStatus", checked)
                      }
                    />
                  </SwitchWrapper>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Cards Informativos</h4>
                    <p className="text-sm text-gray-600">
                      Cards com informações sobre o festival
                    </p>
                  </div>
                  <SwitchWrapper>
                    <Switch
                      checked={settings.showInfoCards}
                      onCheckedChange={(checked) =>
                        handleToggleChange("showInfoCards", checked)
                      }
                    />
                  </SwitchWrapper>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Próximos Eventos</h4>
                    <p className="text-sm text-gray-600">
                      Seção com os próximos eventos do festival
                    </p>
                  </div>
                  <SwitchWrapper>
                    <Switch
                      checked={settings.showNextEvents}
                      onCheckedChange={(checked) =>
                        handleToggleChange("showNextEvents", checked)
                      }
                    />
                  </SwitchWrapper>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Seção de Apoiadores</h4>
                    <p className="text-sm text-gray-600">
                      Marquee com logos dos apoiadores
                    </p>
                  </div>
                  <SwitchWrapper>
                    <Switch
                      checked={settings.showSupporters}
                      onCheckedChange={(checked) =>
                        handleToggleChange("showSupporters", checked)
                      }
                    />
                  </SwitchWrapper>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="single-event" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-verde-suave" />
                Modo Único Evento
              </CardTitle>
              <CardDescription>
                Configure o redirecionamento automático para um evento
                específico
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Ativar Modo Único Evento</h4>
                  <p className="text-sm text-gray-600">
                    Quando ativado, os usuários serão redirecionados
                    automaticamente para o evento selecionado
                  </p>
                </div>
                <SwitchWrapper>
                  <Switch
                    checked={settings.singleEventMode}
                    onCheckedChange={handleSingleEventModeChange}
                  />
                </SwitchWrapper>
              </div>

              {settings.singleEventMode && (
                <div className="space-y-2">
                  <Label htmlFor="singleEventId">Selecionar Evento</Label>
                  <Select
                    value={settings.singleEventId ?? ""}
                    onValueChange={(value) =>
                      setSettings((prev) => ({
                        ...prev,
                        singleEventId: value === "__none__" ? "" : value,
                      }))
                    }
                  >
                    <SelectTrigger
                      id="singleEventId"
                      className="w-full min-h-16"
                    >
                      <SelectValue
                        placeholder={
                          loadingEvents
                            ? "Carregando eventos..."
                            : "Selecione um evento"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {/* Opção para limpar seleção (sem redirecionamento). O Item não pode ter value vazio. */}
                      <SelectItem value="__none__">
                        <div className="flex flex-col items-start">
                          <span className="font-medium">Nenhum evento</span>
                          <span className="text-xs text-cinza-chumbo/60">Não redirecionar</span>
                        </div>
                      </SelectItem>
                      <SelectSeparator />
                      {events.length === 0 ? (
                        <SelectItem value="__no_events__" disabled>
                          {loadingEvents
                            ? "Carregando..."
                            : "Nenhum evento disponível"}
                        </SelectItem>
                      ) : (
                        events.map((ev) => {
                          const start = new Date(ev.startDate);
                          let statusText = "";
                          let statusColor = "";
                          if (ev.registrationStatus === "open") {
                            statusText = "Inscrições Abertas";
                            statusColor = "text-green-600";
                          } else if (ev.registrationStatus === "not_open") {
                            statusText = "Inscrições em Breve";
                            statusColor = "text-blue-600";
                          } else if (ev.registrationStatus === "closed") {
                            statusText = "Inscrições Encerradas";
                            statusColor = "text-red-600";
                          } else if (ev.registrationStatus === "full") {
                            statusText = "Evento Lotado";
                            statusColor = "text-orange-600";
                          }
                          return (
                            <SelectItem key={ev.id} value={ev.id}>
                              <div className="flex flex-col items-start">
                                <span className="font-medium">{ev.name}</span>
                                <span className="text-xs text-cinza-chumbo/60">
                                  {ev.category} •{" "}
                                  {start.toLocaleDateString("pt-PT")}
                                </span>
                                <span
                                  className={`text-xs ${statusColor} font-medium`}
                                >
                                  {statusText}
                                </span>
                              </div>
                            </SelectItem>
                          );
                        })
                      )}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-600">
                    Escolha o evento para redirecionamento quando o modo único
                    estiver ativo.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-4">
        <Button
          variant="outline"
          onClick={() => router.back()}
          disabled={saving}
        >
          Cancelar
        </Button>
        <Button
          onClick={saveSettings}
          disabled={saving}
          className="festival-button"
        >
          {saving ? "Salvando..." : "Salvar Configurações"}
        </Button>
      </div>
    </div>
  );
}
