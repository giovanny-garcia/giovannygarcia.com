import { motion } from "framer-motion";
import type { WorldStation } from "../../data/world";
import ElectricBorder from "./ElectricBorder";

interface StationMarkerProps {
  station: WorldStation;
  index: number;
  nearby: boolean;
  visited: boolean;
  inspecting: boolean;
  effectsActive: boolean;
  onApproach: (id: string) => void;
}

export default function StationMarker({
  station,
  index,
  nearby,
  visited,
  inspecting,
  effectsActive,
  onApproach,
}: StationMarkerProps) {
  const playable = station.kind === "playable";
  const lit = nearby || inspecting;

  return (
    <>
    <span
      aria-hidden
      className="pointer-events-none absolute z-[1] h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl md:h-44 md:w-44"
      style={{
        left: `${station.x}%`,
        top: `${station.y}%`,
        background: lit
          ? "radial-gradient(circle, rgba(76,141,255,0.55) 0%, rgba(76,141,255,0.16) 42%, transparent 70%)"
          : "radial-gradient(circle, rgba(76,141,255,0.34) 0%, rgba(76,141,255,0.1) 42%, transparent 70%)",
      }}
    />
    <button
      type="button"
      style={{ left: `${station.x}%`, top: `${station.y}%` }}
      onClick={(e) => {
        e.stopPropagation();
        onApproach(station.id);
      }}
      aria-label={`Walk to ${station.title}`}
      className="absolute z-10 h-20 w-28 -translate-x-1/2 -translate-y-full outline-none md:h-24 md:w-32"
    >
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 + index * 0.06, duration: 0.5 }}
        className="relative flex h-full w-full items-end justify-center"
      >
        {nearby && (
          <motion.span
            aria-hidden
            className="pointer-events-none absolute bottom-2 left-1/2 h-24 w-24 -translate-x-1/2 rounded-full border border-[#4C8DFF]/45"
            animate={{ scale: [1, 1.2, 1], opacity: [0.55, 0.15, 0.55] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        )}

        <span
          className={`absolute bottom-0 left-1/2 h-2.5 w-12 -translate-x-1/2 translate-y-1 rounded-full blur-[3px] transition-colors ${
            lit ? "bg-[#4C8DFF]/40" : "bg-black/45"
          }`}
          aria-hidden
        />

        {playable ? (
          <ElectricBorder
            active={effectsActive}
            color="#4C8DFF"
            borderRadius={8}
            className={`mb-0 h-[4.25rem] w-[3.35rem] origin-bottom transition-transform duration-300 md:h-[5rem] md:w-16 ${
              lit ? "scale-110" : "scale-100"
            }`}
          >
            <Cabinet lit={lit} playable visited={visited} />
          </ElectricBorder>
        ) : (
          <div
            className={`relative mb-0 h-[4.25rem] w-[3.35rem] origin-bottom transition-transform duration-300 md:h-[5rem] md:w-16 ${
              lit ? "scale-110" : "scale-100"
            }`}
          >
            <Cabinet lit={lit} playable={false} visited={visited} />
          </div>
        )}

        {/* Labels hang below the floor point, always centered on the pedestal */}
        <div className="absolute top-full left-1/2 mt-2 w-28 -translate-x-1/2 md:w-32">
          <p
            className={`m-0 w-full text-center font-heading text-[11px] font-semibold leading-tight md:text-xs ${
              lit || visited ? "text-text-primary" : "text-text-muted"
            }`}
          >
            {station.shortLabel}
          </p>
          <p
            className={`m-0 mt-0.5 w-full text-center font-mono text-[9px] uppercase tracking-[0.14em] md:text-[10px] ${
              lit ? "text-accent" : "text-text-muted/70"
            }`}
          >
            {station.tagline}
          </p>
        </div>
      </motion.div>
    </button>
    </>
  );
}

function Cabinet({
  lit,
  playable,
  visited,
}: {
  lit: boolean;
  playable: boolean;
  visited: boolean;
}) {
  return (
    <div
      className={`flex h-full w-full flex-col items-center justify-end overflow-hidden rounded-lg ${
        playable
          ? lit
            ? "bg-[#101018]"
            : "bg-bg-card/90"
          : lit
            ? "rounded-t-lg rounded-b-md border border-[#4C8DFF] bg-[#4C8DFF]/15 shadow-[0_0_28px_rgba(76,141,255,0.45)]"
            : visited
              ? "rounded-t-lg rounded-b-md border border-white/20 bg-bg-card/75"
              : "rounded-t-lg rounded-b-md border border-border/70 bg-bg-card/55"
      }`}
    >
      <span
        className={`mb-1.5 h-7 w-10 shrink-0 rounded-sm transition-colors md:h-8 md:w-11 ${
          lit || playable
            ? "bg-gradient-to-b from-[#4C8DFF]/55 to-[#4C8DFF]/5"
            : "bg-gradient-to-b from-white/12 to-transparent"
        }`}
        aria-hidden
      />
      <span
        className={`h-1.5 w-full shrink-0 ${lit || playable ? "bg-[#4C8DFF]/70" : "bg-white/10"}`}
        aria-hidden
      />
    </div>
  );
}
