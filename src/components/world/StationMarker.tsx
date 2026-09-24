import { motion } from "framer-motion";
import type { WorldStation } from "../../data/world";

interface StationMarkerProps {
  station: WorldStation;
  index: number;
  nearby: boolean;
  visited: boolean;
  inspecting: boolean;
  onApproach: (id: string) => void;
}

export default function StationMarker({
  station,
  index,
  nearby,
  visited,
  inspecting,
  onApproach,
}: StationMarkerProps) {
  const playable = station.kind === "playable";
  const lit = nearby || inspecting;

  return (
    <button
      type="button"
      style={{ left: `${station.x}%`, top: `${station.y}%` }}
      onClick={(e) => {
        e.stopPropagation();
        onApproach(station.id);
      }}
      aria-label={`Walk to ${station.title}`}
      className={`group absolute z-10 -translate-x-1/2 -translate-y-1/2 outline-none transition-transform duration-300 ${
        lit ? "z-20 scale-110" : "scale-100"
      }`}
    >
      <motion.span
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 + index * 0.06, duration: 0.5 }}
        className="relative block"
      >
        {/* Proximity aura */}
        {nearby && (
          <motion.span
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/40"
            animate={{ scale: [1, 1.2, 1], opacity: [0.55, 0.15, 0.55] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        )}

        <span
          className={`absolute top-[78%] left-1/2 h-2.5 w-12 -translate-x-1/2 rounded-full blur-[3px] transition-colors ${
            lit ? "bg-accent/45" : "bg-black/45"
          }`}
          aria-hidden
        />

        <span
          className={`relative flex h-[4.25rem] w-[3.35rem] flex-col items-center justify-end overflow-hidden rounded-t-lg rounded-b-md border transition-all duration-300 md:h-[5rem] md:w-16 ${
            lit
              ? "border-accent bg-accent/20 text-accent shadow-[0_0_28px_rgba(0,229,255,0.4)]"
              : playable
                ? "border-accent/40 bg-bg-card/85 text-accent/80"
                : visited
                  ? "border-white/20 bg-bg-card/75 text-text-secondary"
                  : "border-border/70 bg-bg-card/55 text-text-muted"
          }`}
        >
          <span
            className={`mb-1.5 h-7 w-10 rounded-sm transition-colors md:h-8 md:w-11 ${
              lit || playable
                ? "bg-gradient-to-b from-accent/55 to-accent/5"
                : "bg-gradient-to-b from-white/12 to-transparent"
            }`}
            aria-hidden
          />
          <span
            className={`h-1.5 w-full ${lit || playable ? "bg-accent/70" : "bg-white/10"}`}
            aria-hidden
          />
        </span>

        <span
          className={`mt-2 block max-w-[7rem] text-center font-heading text-[11px] font-semibold leading-tight transition-opacity md:max-w-[8.5rem] md:text-xs ${
            lit || visited ? "text-text-primary opacity-100" : "text-text-muted opacity-70"
          }`}
        >
          {station.shortLabel}
        </span>
        <span
          className={`mt-0.5 block text-center font-mono text-[9px] uppercase tracking-[0.14em] transition-opacity md:text-[10px] ${
            lit ? "text-accent opacity-100" : "text-text-muted opacity-50"
          }`}
        >
          {lit ? "In range" : station.tagline}
        </span>
      </motion.span>
    </button>
  );
}
