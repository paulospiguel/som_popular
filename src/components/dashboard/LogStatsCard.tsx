"use client";

import { LOG_SEVERITY_LEVELS } from "@/constants";
import { AlertTriangle, BarChart3 } from "lucide-react";

interface LogStats {
  critical: number;
  major: number;
  minor: number;
  none: number;
  pendingCritical: number;
}

interface LogStatsCardProps {
  stats: LogStats;
}

export function LogStatsCard({ stats }: LogStatsCardProps) {
  const totalLogs = stats.critical + stats.major + stats.minor + stats.none;

  const getSeverityInfo = (severity: string) => {
    return (
      LOG_SEVERITY_LEVELS.find((level) => level.value === severity) ||
      LOG_SEVERITY_LEVELS[3]
    );
  };

  const getPercentage = (count: number) => {
    if (totalLogs === 0) return 0;
    return Math.round((count / totalLogs) * 100);
  };

  const getPriorityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-600";
      case "major":
        return "text-orange-600";
      case "minor":
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="festival-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <BarChart3 className="w-6 h-6 text-verde-suave" />
          <h3 className="festival-subtitle text-lg">Estatísticas dos Logs</h3>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-verde-suave">{totalLogs}</p>
          <p className="text-xs text-cinza-chumbo/70">Total de logs</p>
        </div>
      </div>

      {/* Logs Pendentes Críticos */}
      {stats.pendingCritical > 0 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <div className="flex-1">
              <h4 className="font-medium text-red-700">
                {stats.pendingCritical} atividade
                {stats.pendingCritical !== 1 ? "s" : ""} pendente
                {stats.pendingCritical !== 1 ? "s" : ""}
              </h4>
              <p className="text-sm text-red-600">Requerem atenção imediata</p>
            </div>
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          </div>
        </div>
      )}

      {/* Distribuição por Severidade */}
      <div className="space-y-4">
        <h4 className="font-medium text-cinza-chumbo mb-3">
          Distribuição por Severidade
        </h4>

        {LOG_SEVERITY_LEVELS.map((level) => {
          const count = stats[level.value as keyof LogStats] || 0;
          const percentage = getPercentage(count);
          const isPriority =
            level.value === "critical" || level.value === "major";

          return (
            <div key={level.value} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span
                    className={`w-3 h-3 rounded-full ${level.color.replace("text-", "bg-").replace(" bg-", " bg-")}`}
                  />
                  <span
                    className={`text-sm font-medium ${getPriorityColor(level.value)}`}
                  >
                    {level.label}
                  </span>
                  {isPriority && count > 0 && (
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  )}
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-cinza-chumbo">
                    {count}
                  </span>
                  <span className="text-xs text-cinza-chumbo/60 ml-1">
                    ({percentage}%)
                  </span>
                </div>
              </div>

              {/* Barra de progresso */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${level.color.replace("text-", "bg-").replace(" bg-", " bg-")}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Resumo de Ações */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {stats.critical + stats.major}
            </div>
            <div className="text-xs text-blue-600">Críticos + Maiores</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {stats.minor + stats.none}
            </div>
            <div className="text-xs text-green-600">Menores + Sem Class.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
