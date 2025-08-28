"use client";

import { getDashboardStats } from "@/actions/dashboard";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatTimeAgo } from "@/lib/utils";
import {
  AlertCircle,
  AlertTriangle,
  Calendar,
  CalendarDays,
  CheckCircle,
  Clock,
  FileText,
  Star,
  Trophy,
  UserCheck,
  Users,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

interface ActivityDetail {
  status?: string;
  score?: number;
  isNew?: boolean;
  [key: string]: any;
}

interface Activity {
  type: "participant" | "event" | "evaluation" | "status_change";
  message: string;
  timestamp: Date;
  details?: ActivityDetail;
}

interface RecentActivityComponentProps {
  className?: string;
  visible?: boolean;
}

const ACTIVITY_TYPES = [
  {
    value: "all",
    label: "Todas",
    icon: FileText,
    color: "bg-gray-100 text-gray-800",
  },
  {
    value: "participant",
    label: "Participantes",
    icon: Users,
    color: "bg-verde-suave/20 text-green-800",
  },
  {
    value: "event",
    label: "Eventos",
    icon: CalendarDays,
    color: "bg-dourado-claro/20 text-amber-800",
  },
  {
    value: "evaluation",
    label: "Avaliações",
    icon: Star,
    color: "bg-amarelo-suave/20 text-amber-800",
  },
];

const STATUS_COLORS = {
  approved: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  rejected: "bg-red-100 text-red-800",
  draft: "bg-gray-100 text-gray-800",
  published: "bg-blue-100 text-blue-800",
  ongoing: "bg-purple-100 text-purple-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const STATUS_LABELS = {
  approved: "Aprovado",
  pending: "Pendente",
  rejected: "Rejeitado",
  draft: "Rascunho",
  published: "Publicado",
  ongoing: "Em Curso",
  completed: "Concluído",
  cancelled: "Cancelado",
};

const TYPE_COLORS = {
  participant: "bg-verde-suave/5",
  event: "bg-dourado-claro/5",
  evaluation: "bg-amarelo-suave/5",
  status_change: "bg-blue-50",
};

const TYPE_ICONS = {
  participant: UserCheck,
  event: Calendar,
  evaluation: Trophy,
  status_change: AlertCircle,
};

export default function RecentActivityComponent({
  className = "",
  visible = true,
}: RecentActivityComponentProps) {
  const [activities, setActivities] = useState<Activity[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadEventStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getDashboardStats();
      if (result.success && result.data) {
        setActivities(result.data.recentActivity);
      } else {
        setError(result.error || "Erro ao carregar estatísticas");
      }
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
      setError("Erro ao carregar estatísticas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEventStats();
  }, []);

  const getActivityIcon = (type: string) => {
    return TYPE_ICONS[type as keyof typeof TYPE_ICONS] || AlertCircle;
  };

  const getActivityColor = (type: string) => {
    return TYPE_COLORS[type as keyof typeof TYPE_COLORS] || "bg-blue-50";
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "participant":
        return "Participante";
      case "event":
        return "Evento";
      case "evaluation":
        return "Avaliação";
      case "status_change":
        return "Mudança de Status";
      default:
        return "Sistema";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "participant":
        return "bg-verde-suave/20 text-green-800";
      case "event":
        return "bg-dourado-claro/20 text-amber-800";
      case "evaluation":
        return "bg-amarelo-suave/20 text-amber-800";
      case "status_change":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filterActivitiesByType = (type: string) => {
    if (type === "all") return activities;
    return activities?.filter((activity) => activity.type === type);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
      case "completed":
        return CheckCircle;
      case "rejected":
      case "cancelled":
        return XCircle;
      case "pending":
        return AlertTriangle;
      default:
        return AlertCircle;
    }
  };

  if (!visible) {
    return null;
  }

  if (error) {
    return (
      <div className={`festival-card p-6 mb-8 ${className}`}>
        <h3 className="festival-subtitle text-lg mb-4 flex items-center">
          <FileText className="w-5 h-5 mr-2 text-verde-suave" />
          Atividade Recente
        </h3>
        <p>{error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`festival-card p-6 mb-8 ${className}`}>
        <div className="text-center py-8 text-cinza-chumbo/70">
          <div className="w-8 h-8 border-2 border-verde-suave border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p>Carregando atividades...</p>
        </div>
      </div>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <div className={`festival-card p-6 mb-8 ${className}`}>
        <h3 className="festival-subtitle text-lg mb-4 flex items-center">
          <FileText className="w-5 h-5 mr-2 text-verde-suave" />
          Atividade Recente
        </h3>
        <div className="text-center py-8 text-cinza-chumbo/70">
          <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>Nenhuma atividade recente</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`festival-card p-6 mb-8 ${className}`}>
      <h3 className="festival-subtitle text-lg mb-4 flex items-center">
        <FileText className="w-5 h-5 mr-2 text-verde-suave" />
        Atividade Recente
      </h3>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          {ACTIVITY_TYPES.map((type) => {
            const Icon = type.icon;
            return (
              <TabsTrigger
                key={type.value}
                value={type.value}
                className="flex items-center space-x-2"
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{type.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {ACTIVITY_TYPES.map((type) => {
          const Icon = type.icon;
          const filteredActivities = filterActivitiesByType(type.value);

          return (
            <TabsContent
              key={type.value}
              value={type.value}
              className="space-y-3"
            >
              {filteredActivities?.length === 0 ? (
                <div className="text-center py-8 text-cinza-chumbo/70">
                  <Icon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>Nenhuma atividade encontrada para esta categoria</p>
                </div>
              ) : (
                filteredActivities?.map((activity, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-3 rounded-lg ${getActivityColor(
                      activity.type
                    )}`}
                  >
                    <div className="flex items-center space-x-3 flex-1">
                      {(() => {
                        const ActivityIcon = getActivityIcon(activity.type);
                        return (
                          <ActivityIcon className="w-5 h-5 text-verde-suave" />
                        );
                      })()}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <Badge
                            variant="outline"
                            className={getTypeColor(activity.type)}
                          >
                            {getTypeLabel(activity.type)}
                          </Badge>
                        </div>
                        <span className="text-sm text-cinza-chumbo block">
                          {activity.message}
                        </span>
                        {activity.details && (
                          <div className="flex items-center space-x-2 mt-2">
                            {activity.details.status && (
                              <Badge
                                className={
                                  STATUS_COLORS[
                                    activity.details
                                      .status as keyof typeof STATUS_COLORS
                                  ] || "bg-gray-100 text-gray-800"
                                }
                              >
                                {(() => {
                                  const StatusIcon = getStatusIcon(
                                    activity.details.status
                                  );
                                  return (
                                    <>
                                      <StatusIcon className="w-3 h-3 mr-1" />
                                      {STATUS_LABELS[
                                        activity.details
                                          .status as keyof typeof STATUS_LABELS
                                      ] || activity.details.status}
                                    </>
                                  );
                                })()}
                              </Badge>
                            )}
                            {activity.details.score && (
                              <Badge className="bg-amarelo-suave/20 text-amber-800">
                                ⭐ {activity.details.score}
                              </Badge>
                            )}
                            {activity.details.isNew !== undefined && (
                              <Badge
                                variant="outline"
                                className={
                                  activity.details.isNew
                                    ? "bg-green-100 text-green-800 border-green-200"
                                    : "bg-blue-100 text-blue-800 border-blue-200"
                                }
                              >
                                {activity.details.isNew ? "Novo" : "Atualizado"}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-cinza-chumbo/70">
                      <Clock className="w-3 h-3" />
                      <span>{formatTimeAgo(activity.timestamp)}</span>
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
