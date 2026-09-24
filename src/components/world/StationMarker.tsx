import { motion } from "framer-motion";
import type { WorldStation } from "../../data/world";

const KIND_ACCENT: Record<WorldStation["kind"], string> = {
  playable: "border-accent bg-accent/15 text-accent shadow-[0_0_28px_rgba(0,229,255,0.35)]",
  about: "border-teal-300/50 bg-teal-400/10 text-teal-200",
  log: "border-sky-300/40 bg-sky-400/10 text-sky-100",
  skills: "border-cyan-200/35 bg-white/5 text-cyan-100",
  links: "border-emerald-300/40 bg-emerald-400/10 text-emerald-100",
  soon: "border-border bg-bg-secondary/80 text-text-muted",
};

interface StationMarkerProps {
  station: WorldStation;
  selected: boolean;
  index: number;
  onSelect: (id: string) => void;
}

export default function StationMarker({
  station,
  selected,
  index,
  onSelect,
}: StationMarkerProps) {
  const playable = station.kind === "playable";

  return (
    <motion.button
      type="button"
      style={{ left: `${station.x}%`, top: `${station.y}%` }}
      initial={{ opacity: 0, y: 18, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.55, delay: 0.35 + index * 0.07, ease: "easeOut" }}
      whileHover={{ scale: 1.08, y: -4 }}
      whileTap={{ scale: 0.96 }}
      onClick={() => onSelect(station.id)}
      aria-pressed={selected}
      aria-label={`${station.title}. ${station.tagline}`}
      className={`group absolute z-10 -translate-x-1/2 -translate-y-1/2 outline-none ${
        selected ? "z-20" : ""
      }`}
    >
      <span
        className={`absolute top-[78%] left-1/2 h-2.5 w-12 -translate-x-1/2 rounded-full blur-[3px] transition-colors ${
          selected || playable ? "bg-accent/40" : "bg-black/50"
        }`}
        aria-hidden
      />

      <span
        className={`relative flex h-[4.25rem] w-[3.35rem] flex-col items-center justify-end overflow-hidden rounded-t-lg rounded-b-md border transition-all md:h-[5rem] md:w-16 ${
          selected
            ? KIND_ACCENT[station.kind]
            : playable
              ? "border-accent/45 bg-bg-card/90 text-accent group-hover:border-accent"
              : "border-border/80 bg-bg-card/70 text-text-secondary group-hover:border-text-muted"
        }`}
      >
        <span
          className={`mb-1.5 h-7 w-10 rounded-sm md:h-8 md:w-11 ${
            playable
              ? "bg-gradient-to-b from-accent/50 to-accent/5"
              : "bg-gradient-to-b from-white/15 to-transparent"
          }`}
          aria-hidden
        />
        <span
          className={`h-1.5 w-full ${playable ? "bg-accent/70" : "bg-white/10"}`}
          aria-hidden
        />
      </span>

      {playable && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute top-[42%] left-1/2 h-[4.5rem] w-[4.5rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/25 md:h-24 md:w-24"
          animate={{ scale: [1, 1.18, 1], opacity: [0.55, 0.12, 0.55] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      <span className="mt-2 block max-w-[7rem] text-center font-heading text-[11px] font-semibold leading-tight text-text-primary md:max-w-[8.5rem] md:text-xs">
        {station.shortLabel}
      </span>
      <span className="mt-0.5 block text-center font-mono text-[9px] uppercase tracking-[0.14em] text-text-muted md:text-[10px]">
        {station.tagline}
      </span>
    </motion.button>
  );
}
