"use client";

import { LOG_SEVERITY_LEVELS } from "@/constants";
import { AlertTriangle, CheckCircle, Clock } from "lucide-react";

interface PendingActivity {
  id: string;
  type: "system" | "event";
  action: string;
  severity: "critical" | "major" | "minor" | "none";
  message: string;
  timestamp: Date;
  category: string;
}

interface PendingActivitiesCardProps {
  activities: PendingActivity[];
  onActionClick?: (activity: PendingActivity) => void;
}

export function PendingActivitiesCard({
  activities,
  onActionClick,
}: PendingActivitiesCardProps) {
  const getSeverityInfo = (severity: string) => {
    return (
      LOG_SEVERITY_LEVELS.find((level) => level.value === severity) ||
      LOG_SEVERITY_LEVELS[3]
    );
  };

  const getTypeIcon = (type: string) => {
    return type === "system" ? "🔧" : "📅";
  };

  const getTypeLabel = (type: string) => {
    return type === "system" ? "Sistema" : "Evento";
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m atrás`;
    if (hours < 24) return `${hours}h atrás`;
    return `${days}d atrás`;
  };

  if (activities.length === 0) {
    return (
      <div className="festival-card p-6">
        <div className="flex items-center space-x-3 mb-4">
          <CheckCircle className="w-6 h-6 text-green-500" />
          <h3 className="festival-subtitle text-lg">Atividades Pendentes</h3>
        </div>
        <p className="text-cinza-chumbo/70 text-center py-8">
          Não há atividades pendentes que requeiram atenção imediata.
        </p>
      </div>
    );
  }

  return (
    <div className="festival-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <AlertTriangle className="w-6 h-6 text-orange-500" />
          <h3 className="festival-subtitle text-lg">Atividades Pendentes</h3>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-cinza-chumbo/70">
            {activities.length} pendente{activities.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => {
          const severityInfo = getSeverityInfo(activity.severity);
          const isCritical = activity.severity === "critical";
          const isMajor = activity.severity === "major";

          return (
            <div
              key={activity.id}
              className={`p-4 rounded-lg border-l-4 transition-all duration-200 hover:shadow-md cursor-pointer ${
                isCritical
                  ? "border-red-500 bg-red-50 hover:bg-red-100"
                  : isMajor
                    ? "border-orange-500 bg-orange-50 hover:bg-orange-100"
                    : "border-yellow-500 bg-yellow-50 hover:bg-yellow-100"
              }`}
              onClick={() => onActionClick?.(activity)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg">
                      {getTypeIcon(activity.type)}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${severityInfo.color}`}
                    >
                      {severityInfo.label}
                    </span>
                    <span className="text-xs text-cinza-chumbo/60 bg-gray-100 px-2 py-1 rounded-full">
                      {getTypeLabel(activity.type)}
                    </span>
                  </div>

                  <h4 className="font-medium text-cinza-chumbo mb-1">
                    {activity.action}
                  </h4>

                  {activity.message && (
                    <p className="text-sm text-cinza-chumbo/70 mb-2">
                      {activity.message}
                    </p>
                  )}

                  <div className="flex items-center space-x-4 text-xs text-cinza-chumbo/60">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatTimestamp(activity.timestamp)}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <span>📁</span>
                      <span>{activity.category}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {isCritical && (
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                  )}
                  {isMajor && (
                    <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {activities.length > 5 && (
        <div className="mt-4 text-center">
          <button className="text-sm text-verde-suave hover:text-verde-suave/80 font-medium">
            Ver todas as atividades pendentes →
          </button>
        </div>
      )}
    </div>
  );
}
