import { motion } from "framer-motion";
import type { WorkspaceStation } from "../../data/games";

interface GameStationProps {
  station: WorkspaceStation;
  selected: boolean;
  onSelect: (id: string) => void;
  onActivate: (id: string) => void;
}

export default function GameStation({
  station,
  selected,
  onSelect,
  onActivate,
}: GameStationProps) {
  const playable = station.kind === "playable";

  return (
    <motion.button
      type="button"
      style={{ left: `${station.x}%`, top: `${station.y}%` }}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => {
        onSelect(station.id);
        if (playable) onActivate(station.id);
      }}
      onFocus={() => onSelect(station.id)}
      aria-label={
        playable
          ? `Play ${station.title}`
          : `${station.title} — ${station.kind === "coming-soon" ? "coming soon" : "info"}`
      }
      className={`group absolute z-10 -translate-x-1/2 -translate-y-1/2 text-left outline-none ${
        selected ? "z-20" : ""
      }`}
    >
      {/* Floor pad */}
      <span
        className={`absolute top-[72%] left-1/2 h-3 w-14 -translate-x-1/2 rounded-[100%] blur-[2px] transition-colors ${
          playable
            ? "bg-accent/35 group-hover:bg-accent/50"
            : "bg-text-muted/25"
        }`}
        aria-hidden
      />

      {/* Pedestal / cabinet */}
      <span
        className={`relative flex h-16 w-14 flex-col items-center justify-end overflow-hidden rounded-t-md rounded-b-sm border transition-all md:h-20 md:w-16 ${
          playable
            ? selected
              ? "border-accent bg-bg-card shadow-[0_0_24px_rgba(0,229,255,0.35)]"
              : "border-accent/50 bg-bg-card/90 group-hover:border-accent group-hover:shadow-[0_0_18px_rgba(0,229,255,0.25)]"
            : "border-border bg-bg-secondary/90 group-hover:border-text-muted"
        }`}
      >
        <span
          className={`mb-1 h-6 w-10 rounded-sm md:h-7 md:w-11 ${
            playable
              ? "bg-gradient-to-b from-accent/40 to-accent/10"
              : "bg-gradient-to-b from-white/10 to-transparent"
          }`}
          aria-hidden
        />
        <span
          className={`h-1.5 w-full ${playable ? "bg-accent/60" : "bg-border"}`}
          aria-hidden
        />
      </span>

      {/* Pulse ring for playable */}
      {playable && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/30 md:h-24 md:w-24"
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.15, 0.5] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      <span
        className={`mt-2 block max-w-[7.5rem] text-center font-heading text-[11px] font-semibold leading-tight md:max-w-[9rem] md:text-xs ${
          playable ? "text-accent" : "text-text-secondary"
        }`}
      >
        {station.shortLabel}
      </span>
      {playable && (
        <span className="mt-0.5 block text-center font-mono text-[10px] uppercase tracking-wider text-accent/80">
          Play
        </span>
      )}
      {station.kind === "coming-soon" && (
        <span className="mt-0.5 block text-center font-mono text-[10px] uppercase tracking-wider text-text-muted">
          Soon
        </span>
      )}
    </motion.button>
  );
}
