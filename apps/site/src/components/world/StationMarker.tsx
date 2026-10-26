import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import type { IconType } from "react-icons";
import {
  HiBookOpen,
  HiChip,
  HiClipboardList,
  HiClock,
  HiLink,
  HiPlay,
  HiUserCircle,
} from "react-icons/hi";
import { FaGuitar } from "react-icons/fa6";
import type { WorldStation } from "../../data/world";
import ElectricBorder from "./ElectricBorder";

const STATION_ICONS: Record<WorldStation["kind"], IconType> = {
  about: HiUserCircle,
  playable: HiPlay,
  log: HiClipboardList,
  skills: HiChip,
  links: HiLink,
  blog: HiBookOpen,
  guitar: FaGuitar,
  soon: HiClock,
};

interface StationMarkerProps {
  station: WorldStation;
  index: number;
  nearby: boolean;
  visited: boolean;
  inspecting: boolean;
  onApproach: (id: string) => void;
}

/** Concentric rings: radius in px, glyph count, characters to sprinkle (no warping). */
const WAVE_RINGS = [
  { radius: 36, count: 12, glyphs: "+*+" },
  { radius: 56, count: 16, glyphs: ":+·" },
  { radius: 78, count: 20, glyphs: "·:." },
  { radius: 102, count: 26, glyphs: "·." },
  { radius: 128, count: 32, glyphs: "." },
] as const;

/** Seconds between consecutive rings so the pulse reads as one ripple from the center. */
const WAVE_RING_STAGGER_S = 0.2;

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
  const attention = !visited;
  const blue = attention || lit;

  return (
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
        {(lit || nearby) && (
          <AsciiWaves lit={lit} nearby={nearby} phaseOffset={index * 0.18} />
        )}

        <span
          className={`absolute bottom-0 left-1/2 h-2.5 w-12 -translate-x-1/2 translate-y-1 rounded-full blur-[3px] transition-colors ${
            blue ? "bg-accent/45" : "bg-black/45"
          }`}
          aria-hidden
        />

        {playable && blue ? (
          <ElectricBorder
            active={lit && !inspecting}
            borderRadius={8}
            className={`relative z-[1] mb-0 h-[4.25rem] w-[3.35rem] origin-bottom transition-transform duration-300 md:h-[5rem] md:w-16 ${
              lit ? "scale-110" : "scale-100"
            }`}
          >
            <Cabinet station={station} tone="blue" playable />
          </ElectricBorder>
        ) : (
          <div
            className={`relative z-[1] mb-0 h-[4.25rem] w-[3.35rem] origin-bottom transition-transform duration-300 md:h-[5rem] md:w-16 ${
              lit ? "scale-110" : "scale-100"
            } ${attention && !playable ? "station-attention" : ""}`}
          >
            <Cabinet
              station={station}
              tone={blue ? "blue" : visited ? "visited" : "idle"}
              playable={false}
            />
          </div>
        )}

        {/* Labels hang below the floor point, always centered on the pedestal */}
        <div className="absolute top-full left-1/2 z-[1] mt-2 w-28 -translate-x-1/2 md:w-32">
          <p
            className={`m-0 w-full text-center font-heading text-[11px] font-semibold leading-tight md:text-xs ${
              blue || visited ? "text-text-primary" : "text-text-muted"
            }`}
          >
            {station.shortLabel}
          </p>
          <p
            className={`m-0 mt-0.5 w-full text-center font-mono text-[9px] uppercase tracking-[0.14em] md:text-[10px] ${
              blue ? "text-accent" : "text-text-muted/70"
            }`}
          >
            {station.tagline}
          </p>
        </div>
      </motion.div>
    </button>
  );
}

function AsciiWaves({
  lit,
  nearby,
  phaseOffset,
}: {
  lit: boolean;
  nearby: boolean;
  phaseOffset: number;
}) {
  const maxRadius = WAVE_RINGS[WAVE_RINGS.length - 1].radius;
  const pulsing = lit || nearby;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute bottom-[2.15rem] left-1/2 z-0 h-0 w-0 -translate-x-1/2 select-none text-accent"
    >
      {WAVE_RINGS.map((ring, ringIndex) => {
        const distanceFade = 1 - ring.radius / (maxRadius + 8);
        const peak = (nearby ? 0.95 : lit ? 0.72 : 0) * distanceFade;
        // Inner rings lead so the pulse expands from the cabinet outward.
        const delay = pulsing
          ? phaseOffset + ringIndex * WAVE_RING_STAGGER_S
          : 0;

        return (
          <div
            key={ring.radius}
            className={pulsing ? "ascii-wave-ring" : "ascii-wave-ring-paused"}
            style={
              {
                "--wave-peak": peak,
                animationDelay: pulsing ? `${delay}s` : undefined,
              } as CSSProperties
            }
          >
            {Array.from({ length: ring.count }, (_, i) => {
              const angle = (i / ring.count) * Math.PI * 2 - Math.PI / 2;
              const x = Math.cos(angle) * ring.radius;
              const y = Math.sin(angle) * ring.radius;
              const glyph = ring.glyphs[i % ring.glyphs.length];
              return (
                <span
                  key={i}
                  className="absolute font-mono text-[10px] leading-none md:text-[11px]"
                  style={{
                    left: x,
                    top: y,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  {glyph}
                </span>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

function Cabinet({
  station,
  tone,
  playable,
}: {
  station: WorldStation;
  tone: "blue" | "visited" | "idle";
  playable: boolean;
}) {
  const Icon = STATION_ICONS[station.kind];
  const frame =
    tone === "blue" && playable
      ? "bg-[#101018]"
      : tone === "blue"
        ? "rounded-t-lg rounded-b-md border border-accent bg-accent/20 shadow-[0_0_16px_rgba(0,229,255,0.28)]"
        : tone === "visited"
          ? "rounded-t-lg rounded-b-md border border-white/20 bg-bg-card/75"
          : "rounded-t-lg rounded-b-md border border-border/70 bg-bg-card/55";

  const iconTone =
    tone === "blue"
      ? "text-accent drop-shadow-[0_0_10px_rgba(0,229,255,0.45)]"
      : tone === "visited"
        ? "text-text-secondary"
        : "text-text-muted/55";

  return (
    <div
      className={`flex h-full w-full flex-col items-center justify-end overflow-hidden rounded-lg ${frame}`}
    >
      <span
        className={`mb-1.5 flex h-7 w-10 shrink-0 items-center justify-center rounded-sm transition-colors md:h-8 md:w-11 ${
          tone === "blue"
            ? "bg-gradient-to-b from-accent/25 to-accent/5"
            : "bg-gradient-to-b from-white/10 to-transparent"
        }`}
        aria-hidden
      >
        <Icon className={iconTone} size={playable ? 22 : 20} />
      </span>
      <span
        className={`h-1.5 w-full shrink-0 ${tone === "blue" ? "bg-accent/70" : "bg-white/10"}`}
        aria-hidden
      />
    </div>
  );
}
