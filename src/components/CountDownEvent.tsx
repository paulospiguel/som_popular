import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Event } from "@/types";

type Size = "sm" | "md" | "lg";

type Props = {
  event: Event;
  size?: Size;
  /**
   * Mostrar rótulos (d, h, m, s)
   * @default true
   */
  showLabels?: boolean;
  /**
   * Callback quando chega a zero
   */
  onFinish?: () => void;
};

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const pad2 = (n: number) => n.toString().padStart(2, "0");

export default function CountDownEvent({
  event,
  size = "md",
  showLabels = true,
  onFinish,
}: Props) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [canStartVoting, setCanStartVoting] = useState(false);
  const timerRef = useRef<number | null>(null);

  const styles = useMemo(() => {
    // classes por tamanho
    const chip = {
      sm: "px-1.5 py-0.5 text-[11px] rounded-md font-semibold",
      md: "px-2 py-1 text-sm rounded-md font-semibold",
      lg: "px-3 py-1.5 text-base rounded-lg font-semibold",
    } as const;

    const gapRow = {
      sm: "space-x-1",
      md: "space-x-1.5",
      lg: "space-x-2",
    } as const;
    const sub = {
      sm: "text-[10px] mb-0.5",
      md: "text-xs mb-1",
      lg: "text-sm mb-1.5",
    } as const;
    const unit = { sm: "text-[10px]", md: "text-xs", lg: "text-sm" } as const;

    return {
      chip: chip[size],
      gapRow: gapRow[size],
      sub: sub[size],
      unit: unit[size],
    };
  }, [size]);

  // Calcula diferença (sempre no momento do tick)
  const compute = useCallback((startISO: string): TimeLeft | null => {
    const now = new Date().getTime();
    const start = new Date(startISO).getTime();
    const diff = start - now;

    if (isNaN(start)) return null; // data inválida
    if (diff <= 0) return null; // já iniciou

    const days = Math.floor(diff / 86_400_000);
    const hours = Math.floor((diff % 86_400_000) / 3_600_000);
    const minutes = Math.floor((diff % 3_600_000) / 60_000);
    const seconds = Math.floor((diff % 60_000) / 1000);

    return { days, hours, minutes, seconds };
  }, []);

  // Inicializa e atualiza a cada 1s
  useEffect(() => {
    // calcula imediato
    const first = compute(event.startDate.toISOString());
    setTimeLeft(first);
    setCanStartVoting(!first);

    // limpa anterior
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // se já iniciou, não cria intervalo
    if (!first) {
      setCanStartVoting(true);
      onFinish?.();
      return;
    }

    timerRef.current = window.setInterval(() => {
      const t = compute(event.startDate.toISOString());
      if (!t) {
        setTimeLeft(null);
        setCanStartVoting(true);
        if (timerRef.current) {
          window.clearInterval(timerRef.current);
          timerRef.current = null;
        }
        onFinish?.();
      } else {
        setTimeLeft(t);
      }
    }, 1000);

    // cleanup
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [event.startDate, compute, onFinish]);

  if (canStartVoting) {
    return null;
  }

  if (!timeLeft) {
    return null;
  }

  const showDays = timeLeft.days > 0;

  return (
    <div className="text-center" aria-live="polite">
      <div className={`text-cinza-chumbo/70 ${styles.sub}`}>Inicia em:</div>

      <div className={`flex items-center ${styles.gapRow} font-mono`}>
        {showDays && (
          <>
            <span
              className={`bg-verde-muito-suave text-verde-suave ${styles.chip}`}
            >
              {pad2(timeLeft.days)}
            </span>
            {showLabels && (
              <span className={`text-cinza-chumbo/60 ${styles.unit}`}>d</span>
            )}
          </>
        )}

        <span
          className={`bg-verde-muito-suave text-verde-suave ${styles.chip}`}
        >
          {pad2(timeLeft.hours)}
        </span>
        {showLabels && (
          <span className={`text-cinza-chumbo/60 ${styles.unit}`}>h</span>
        )}

        <span
          className={`bg-verde-muito-suave text-verde-suave ${styles.chip}`}
        >
          {pad2(timeLeft.minutes)}
        </span>
        {showLabels && (
          <span className={`text-cinza-chumbo/60 ${styles.unit}`}>m</span>
        )}

        <span
          className={`bg-verde-muito-suave text-verde-suave ${styles.chip}`}
        >
          {pad2(timeLeft.seconds)}
        </span>
        {showLabels && (
          <span className={`text-cinza-chumbo/60 ${styles.unit}`}>s</span>
        )}
      </div>
    </div>
  );
}
