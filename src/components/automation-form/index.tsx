"use client";

import { Wand2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { generateContent } from "@/server/ai/generate.actions";
import { Metadata } from "@/validators/ia-generate";

import { ShimmeringText } from "../ui/shimmering-text";

import createDescription from "./templates/create-description";

const targetLabels = {
  curto: "Curto",
  longo: "Longo",
} as const;

type TargetField = keyof typeof targetLabels;

export function AISuggestionForm({
  className,
  label = "Sugerir com IA",
  defaultTargets = Object.keys(targetLabels) as TargetField[],
  targets = targetLabels,
  references = ["title", "startDate", "location", "category", "type"],
  onChangeValue,
  outputLaguage = "Português Brasileiro",
  context = {},
}: {
  className?: string;
  label?: string;
  defaultTargets?: TargetField[];
  targets?: typeof targetLabels;
  references?: string[];
  onChangeValue?: (value: string) => void;
  outputLaguage?: string;
  context?: Record<string, any>;
}) {
  const { showToast } = useToast();
  const [open, setOpen] = useState(false);
  const [objective, setObjective] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedTargets, setSelectedTargets] = useState<
    Record<TargetField, boolean>
  >(() => {
    const initial: Record<TargetField, boolean> = {
      curto: false,
      longo: false,
    };

    defaultTargets.forEach((key) => {
      initial[key] = true;
    });

    return initial;
  });

  const canSubmit = useMemo(() => {
    return !!objective.trim() && Object.values(selectedTargets).some(Boolean);
  }, [objective, selectedTargets]);

  const toggleTarget = (key: TargetField) => {
    setSelectedTargets(
      () =>
        ({
          curto: false,
          longo: false,
          [key]: true,
        }) as Record<TargetField, boolean>
    );
  };

  const generateFieldContent = useCallback(
    async (field: TargetField, prompt: string) => {
      try {
        const fieldConfig = {
          curto: { limit: 30, type: "Curto" },
          longo: { limit: 800, type: "Longo" },
        }[field] as Metadata["fieldConfig"];

        const enhancedPrompt = createDescription({
          prompt,
          context,
          metadata: {
            fieldConfig: fieldConfig,
            outputLaguage: outputLaguage as Metadata["outputLaguage"],
          },
        });

        const result = await generateContent({
          prompt: enhancedPrompt,
          context: { ...context, fields: [field] },
        });

        if (result) {
          onChangeValue?.(result);
        }
      } catch (error) {
        showToast({
          type: "error",
          title: "Erro",
          description: "Falha ao gerar conteúdo com IA",
        });
      }
    },
    [references, showToast, onChangeValue, context]
  );

  const submit = useCallback(async () => {
    if (!canSubmit) return;
    setLoading(true);

    try {
      const selectedFields = Object.entries(selectedTargets)
        .filter(([_, v]) => v)
        .map(([k]) => k as TargetField);

      // Gerar conteúdo para cada campo selecionado
      for (const field of selectedFields) {
        await generateFieldContent(field, objective);
      }

      setOpen(false);
      setObjective("");
    } finally {
      setLoading(false);
    }
  }, [canSubmit, objective, selectedTargets, generateFieldContent]);

  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === "Escape") setOpen(false);
      if (
        (ev.ctrlKey || ev.metaKey) &&
        ev.key === "Enter" &&
        open &&
        !loading &&
        canSubmit
      ) {
        ev.preventDefault();
        submit();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, loading, canSubmit, submit]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            "h-8 px-2 text-xs gap-1 border-gray-300 bg-white/90",
            className
          )}
        >
          <Wand2 className="w-3.5 h-3.5" />
          <ShimmeringText
            text={label}
            className="text-xs font-bold"
            color="var(--color-primary)"
            shimmerColor="var(--color-white)"
            duration={1.5}
            repeatDelay={1}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[360px] p-0 overflow-hidden" align="end">
        <div className="p-3 border-b">
          <p className="text-sm font-medium text-cinza-chumbo">
            Gerar conteúdo
          </p>
          <p className="text-xs text-cinza-chumbo/70">
            Descreva o conteúdo que você deseja gerar.
          </p>
        </div>
        <div>
          <div className="p-3 space-y-3">
            <div>
              <textarea
                autoFocus
                rows={4}
                placeholder="Ex.: Classificatória local com foco em jovens talentos..."
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                className="w-full resize-none rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-verde-suave focus:border-transparent"
              />
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {Object.entries(targets).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2">
                  <Checkbox
                    disabled={!defaultTargets.includes(key as TargetField)}
                    checked={selectedTargets[key as TargetField]}
                    onCheckedChange={() => toggleTarget(key as TargetField)}
                  />
                  <Label className="text-sm">{value}</Label>
                </div>
              ))}
            </div>
          </div>
          <div className="p-3 border-t flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-8 px-3"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              className="h-8 px-3"
              disabled={!canSubmit || loading}
              onClick={() => void submit()}
            >
              {loading ? "Gerando..." : "Aplicar"}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default AISuggestionForm;
