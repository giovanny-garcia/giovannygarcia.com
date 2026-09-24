import { createContext } from "react";

export type PortfolioView = "site" | "workspace" | "playing";

export interface PortfolioModeContextValue {
  view: PortfolioView;
  activeGameId: string | null;
  enterWorkspace: () => void;
  exitWorkspace: () => void;
  playGame: (gameId: string) => void;
  exitGame: () => void;
}

export const PortfolioModeContext =
  createContext<PortfolioModeContextValue | null>(null);
