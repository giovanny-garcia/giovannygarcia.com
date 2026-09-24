import { createContext } from "react";

export type WorldView = "explore" | "playing";

export interface WorldModeContextValue {
  view: WorldView;
  activeGameId: string | null;
  playGame: (gameId: string) => void;
  exitGame: () => void;
}

export const WorldModeContext = createContext<WorldModeContextValue | null>(
  null,
);
