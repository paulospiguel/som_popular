"use client";

import {
  Activity,
  AlertCircle,
  Clock,
  Download,
  Filter,
  Globe,
  Mail,
  RefreshCw,
  Search,
  Settings,
  Shield,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatTimeAgo } from "@/lib/utils";
import { getLogsStats, getSystemLogs } from "@/server/logs";

interface LogEntry {
  id: string;
  action: string;
  category: string;
  status: string;
  message: string | null;
  ipAddress: string | null;
  createdAt: Date | null;
  metadata: string | null;
}

interface LogsComponentProps {
  className?: string;
  visible?: boolean;
}

const CATEGORIES = [
  {
    value: "all",
    label: "Todos",
    icon: Activity,
    color: "bg-gray-100 text-gray-800",
  },
  {
    value: "auth",
    label: "Autenticação",
    icon: Shield,
    color: "bg-blue-100 text-blue-800",
  },
  {
    value: "security",
    label: "Segurança",
    icon: AlertCircle,
    color: "bg-red-100 text-red-800",
  },
  {
    value: "user_action",
    label: "Ações do Usuário",
    icon: User,
    color: "bg-green-100 text-green-800",
  },
  {
    value: "system",
    label: "Sistema",
    icon: Settings,
    color: "bg-purple-100 text-purple-800",
  },
  {
    value: "email",
    label: "Email",
    icon: Mail,
    color: "bg-orange-100 text-orange-800",
  },
];

const STATUS_COLORS = {
  success: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
  pending: "bg-yellow-100 text-yellow-800",
  warning: "bg-orange-100 text-orange-800",
};

const STATUS_LABELS = {
  success: "Sucesso",
  failed: "Falhou",
  pending: "Pendente",
  warning: "Aviso",
};

export default function LogsComponent({
  className,
  visible = true,
}: LogsComponentProps) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [stats, setStats] = useState<any>(null);

  // Carregar logs iniciais
  useEffect(() => {
    loadLogs();
    loadStats();
  }, []);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const result = await getSystemLogs({
        limit: 100,
      });

      if (result.success && result.data) {
        setLogs(result.data);
        setFilteredLogs(result.data);
      }
    } catch (error) {
      console.error("Erro ao carregar logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const result = await getLogsStats();
      if (result.success && result.data) {
        setStats(result.data);
      }
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
    }
  };

  // Filtrar logs baseado nos filtros ativos
  useEffect(() => {
    let filtered = logs;

    // Filtro por categoria
    if (activeTab !== "all") {
      filtered = filtered.filter((log) => log.category === activeTab);
    }

    // Filtro por status
    if (statusFilter !== "all") {
      filtered = filtered.filter((log) => log.status === statusFilter);
    }

    // Filtro por data
    if (dateFilter !== "all") {
      const now = new Date();
      const filterDate = new Date();

      switch (dateFilter) {
        case "today":
          filterDate.setHours(0, 0, 0, 0);
          break;
        case "week":
          filterDate.setDate(now.getDate() - 7);
          break;
        case "month":
          filterDate.setMonth(now.getMonth() - 1);
          break;
      }

      filtered = filtered.filter(
        (log) => log.createdAt && log.createdAt >= filterDate
      );
    }

    // Filtro por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(
        (log) =>
          log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.ipAddress?.includes(searchTerm) ||
          log.metadata?.includes(searchTerm.toLowerCase())
      );
    }

    setFilteredLogs(filtered);
  }, [logs, activeTab, statusFilter, dateFilter, searchTerm]);

  const handleRefresh = async () => {
    await loadLogs();
    await loadStats();
  };

  const handleExport = () => {
    const csvContent = [
      [
        "ID",
        "Ação",
        "Categoria",
        "Status",
        "Mensagem",
        "IP",
        "Data",
        "Metadados",
      ],
      ...filteredLogs.map((log) => [
        log.id,
        log.action,
        log.category,
        log.status,
        log.message || "",
        log.ipAddress || "",
        log.createdAt?.toISOString() || "",
        log.metadata || "",
      ]),
    ]
      .map((row) => row.map((field) => `"${field}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `logs_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getCategoryColor = (category: string) => {
    const cat = CATEGORIES.find((c) => c.value === category);
    return cat ? cat.color : "bg-gray-100 text-gray-800";
  };

  if (!visible) return null;

  if (loading) {
    return (
      <div className={`festival-card p-6 ${className}`}>
        <div className="text-center py-8">
          <div className="w-8 h-8 border-2 border-verde-suave border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-cinza-chumbo/70">Carregando logs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`festival-card p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="festival-subtitle text-lg flex items-center">
          <Activity className="w-5 h-5 mr-2 text-verde-suave" />
          Logs do Sistema
        </h3>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Atualizar
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
          {CATEGORIES.map((category) => {
            const Icon = category.icon;
            const count =
              category.value === "all"
                ? stats.total
                : stats[category.value as keyof typeof stats] || 0;
            return (
              <div
                key={category.value}
                className="text-center p-3 bg-white/50 rounded-lg border"
              >
                <Icon className="w-6 h-6 mx-auto mb-2 text-verde-suave" />
                <div className="text-2xl font-bold text-cinza-chumbo">
                  {count}
                </div>
                <div className="text-xs text-cinza-chumbo/70">
                  {category.label}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-cinza-chumbo/50" />
          <Input
            placeholder="Buscar logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Status</SelectItem>
            <SelectItem value="success">Sucesso</SelectItem>
            <SelectItem value="failed">Falhou</SelectItem>
            <SelectItem value="pending">Pendente</SelectItem>
            <SelectItem value="warning">Aviso</SelectItem>
          </SelectContent>
        </Select>

        <Select value={dateFilter} onValueChange={setDateFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todo o Período</SelectItem>
            <SelectItem value="today">Hoje</SelectItem>
            <SelectItem value="week">Última Semana</SelectItem>
            <SelectItem value="month">Último Mês</SelectItem>
          </SelectContent>
        </Select>

        <div className="text-sm text-cinza-chumbo/70 flex items-center">
          <Filter className="w-4 h-4 mr-2" />
          {filteredLogs.length} de {logs.length} logs
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6 mb-6">
          {CATEGORIES.map((category) => {
            const Icon = category.icon;
            return (
              <TabsTrigger
                key={category.value}
                value={category.value}
                className="flex items-center space-x-2"
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{category.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {CATEGORIES.map((category) => {
          const Icon = category.icon;
          const categoryLogs = filteredLogs.filter(
            (log) => category.value === "all" || log.category === category.value
          );

          return (
            <TabsContent
              key={category.value}
              value={category.value}
              className="space-y-3"
            >
              {categoryLogs.length === 0 ? (
                <div className="text-center py-8 text-cinza-chumbo/70">
                  <Icon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>Nenhum log encontrado para esta categoria</p>
                </div>
              ) : (
                categoryLogs.map((log) => (
                  <div
                    key={log.id}
                    className={`p-4 rounded-lg border ${
                      log.status === "success"
                        ? "bg-green-50 border-green-200"
                        : log.status === "failed"
                          ? "bg-red-50 border-red-200"
                          : log.status === "pending"
                            ? "bg-yellow-50 border-yellow-200"
                            : "bg-orange-50 border-orange-200"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <Icon className="w-5 h-5 text-verde-suave" />
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant="outline"
                              className={getCategoryColor(log.category)}
                            >
                              {log.category}
                            </Badge>
                            <Badge
                              className={
                                STATUS_COLORS[
                                  log.status as keyof typeof STATUS_COLORS
                                ]
                              }
                            >
                              {
                                STATUS_LABELS[
                                  log.status as keyof typeof STATUS_LABELS
                                ]
                              }
                            </Badge>
                          </div>
                        </div>

                        <h4 className="font-medium text-cinza-chumbo mb-1">
                          {log.action
                            .replace(/_/g, " ")
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                        </h4>

                        {log.message && (
                          <p className="text-sm text-cinza-chumbo/70 mb-2">
                            {log.message}
                          </p>
                        )}

                        <div className="flex items-center space-x-4 text-xs text-cinza-chumbo/50">
                          {log.ipAddress && (
                            <div className="flex items-center space-x-1">
                              <Globe className="w-3 h-3" />
                              <span>{log.ipAddress}</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>
                              {log.createdAt
                                ? formatTimeAgo(log.createdAt)
                                : "N/A"}
                            </span>
                          </div>
                        </div>

                        {log.metadata && (
                          <details className="mt-2">
                            <summary className="cursor-pointer text-xs text-cinza-chumbo/60 hover:text-cinza-chumbo">
                              Ver detalhes
                            </summary>
                            <pre className="mt-1 p-2 bg-cinza-chumbo/5 rounded text-xs text-cinza-chumbo/70 overflow-x-auto">
                              {log.metadata}
                            </pre>
                          </details>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
