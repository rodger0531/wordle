import { useEffect, useState } from "react";
import { msUntilNextPuzzle } from "../game/words";

const pad = (value: number) => String(value).padStart(2, "0");

const format = (ms: number) => {
  const total = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  return `${pad(hours)}:${pad(minutes)}:${pad(total % 60)}`;
};

/** Ticks once a second while `active`, so the interval stops with the modal. */
export function useCountdown(active: boolean): string {
  const [remaining, setRemaining] = useState(msUntilNextPuzzle);

  useEffect(() => {
    if (!active) return;

    setRemaining(msUntilNextPuzzle());
    const id = setInterval(() => setRemaining(msUntilNextPuzzle()), 1000);
    return () => clearInterval(id);
  }, [active]);

  return format(remaining);
}
