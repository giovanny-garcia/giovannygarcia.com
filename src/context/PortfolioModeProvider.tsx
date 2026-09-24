import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  PortfolioModeContext,
  type PortfolioView,
} from "./PortfolioModeContext";

export function PortfolioModeProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<PortfolioView>("site");
  const [activeGameId, setActiveGameId] = useState<string | null>(null);

  const enterWorkspace = useCallback(() => {
    setActiveGameId(null);
    setView("workspace");
  }, []);

  const exitWorkspace = useCallback(() => {
    setActiveGameId(null);
    setView("site");
  }, []);

  const playGame = useCallback((gameId: string) => {
    setActiveGameId(gameId);
    setView("playing");
  }, []);

  const exitGame = useCallback(() => {
    setActiveGameId(null);
    setView("workspace");
  }, []);

  useEffect(() => {
    if (view === "site") return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [view]);

  useEffect(() => {
    if (view === "site") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (view === "playing") exitGame();
      else exitWorkspace();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [view, exitGame, exitWorkspace]);

  const value = useMemo(
    () => ({
      view,
      activeGameId,
      enterWorkspace,
      exitWorkspace,
      playGame,
      exitGame,
    }),
    [
      view,
      activeGameId,
      enterWorkspace,
      exitWorkspace,
      playGame,
      exitGame,
    ],
  );

  return (
    <PortfolioModeContext.Provider value={value}>
      {children}
    </PortfolioModeContext.Provider>
  );
}
