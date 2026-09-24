import { useContext } from "react";
import { WorldModeContext } from "./WorldModeContext";

export function useWorldMode() {
  const ctx = useContext(WorldModeContext);
  if (!ctx) {
    throw new Error("useWorldMode must be used within WorldModeProvider");
  }
  return ctx;
}
