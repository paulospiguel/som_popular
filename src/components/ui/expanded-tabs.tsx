"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

interface Tab {
  title?: string;
  icon?: React.ComponentType<{ className?: string }>;
  type?: "separator";
  action?: () => void;
  disabled?: boolean;
  variant?: "default" | "destructive" | "warning";
  status?: "success" | "pending" | "error";
}

interface ExpandedTabsProps {
  tabs: Tab[];
  className?: string;
  orientation?: "horizontal" | "vertical";
}

export function ExpandedTabs({
  tabs,
  className,
  orientation = "horizontal",
}: ExpandedTabsProps) {
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const handleTabClick = (tab: Tab) => {
    if (tab.type === "separator" || tab.disabled) return;

    if (tab.action) {
      tab.action();
    } else if (tab.title) {
      setActiveTab(tab.title);
    }
  };

  const getVariantStyles = (variant: Tab["variant"] = "default") => {
    switch (variant) {
      case "destructive":
        return "text-red-600 hover:text-red-700 hover:bg-red-50";
      case "warning":
        return "text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50";
      default:
        return "text-gray-700 hover:text-gray-900 hover:bg-gray-50";
    }
  };

  const getStatusStyles = (status: Tab["status"] = "pending") => {
    switch (status) {
      case "success":
        return "bg-green-500 animate-pulse";
      case "pending":
        return "bg-yellow-500";
      case "error":
        return "bg-red-500";
    }
  };

  return (
    <div
      className={cn(
        "flex gap-1 p-1 bg-gray-100 rounded-lg",
        orientation === "vertical" ? "flex-col" : "flex-row",
        className
      )}
    >
      {tabs.map((tab, index) => {
        if (tab.type === "separator") {
          return (
            <div
              key={`separator-${index}`}
              className={cn(
                "bg-gray-300 rounded-full",
                orientation === "vertical"
                  ? "w-full h-px my-1"
                  : "h-full w-px mx-1"
              )}
            />
          );
        }

        const Icon = tab.icon;
        const isActive = activeTab === tab.title;

        return (
          <div
            key={tab.title}
            className="flex items-center justify-center gap-2"
          >
            <button
              type="button"
              onClick={() => handleTabClick(tab)}
              disabled={tab.disabled}
              className={cn(
                "flex items-center  gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                isActive
                  ? "bg-white text-gray-900 shadow-sm"
                  : getVariantStyles(tab.variant),
                tab.disabled && "cursor-not-allowed"
              )}
            >
              {Icon && <Icon className="w-4 h-4" />}
              <span>{tab.title}</span>
            </button>

            {tab.status && (
              <span
                className={cn(
                  "w-2 h-2 rounded-full",
                  getStatusStyles(tab.status)
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
