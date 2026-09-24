import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { WorldModeContext, type WorldView } from "./WorldModeContext";

export function WorldModeProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<WorldView>("explore");
  const [activeGameId, setActiveGameId] = useState<string | null>(null);

  const playGame = useCallback((gameId: string) => {
    setActiveGameId(gameId);
    setView("playing");
  }, []);

  const exitGame = useCallback(() => {
    setActiveGameId(null);
    setView("explore");
  }, []);

  useEffect(() => {
    if (view !== "playing") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") exitGame();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [view, exitGame]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const value = useMemo(
    () => ({ view, activeGameId, playGame, exitGame }),
    [view, activeGameId, playGame, exitGame],
  );

  return (
    <WorldModeContext.Provider value={value}>{children}</WorldModeContext.Provider>
  );
}
