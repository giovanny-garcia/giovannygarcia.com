import { useContext } from "react";
import { PortfolioModeContext } from "./PortfolioModeContext";

export function usePortfolioMode() {
  const ctx = useContext(PortfolioModeContext);
  if (!ctx) {
    throw new Error("usePortfolioMode must be used within PortfolioModeProvider");
  }
  return ctx;
}
