import type { CSSProperties } from "react";
import type { WorldPropDef } from "../../data/worldProps";

interface WorldPropProps {
  prop: WorldPropDef;
}

const limb =
  "bg-gradient-to-b from-accent/90 to-cyan-800/90 shadow-[0_0_10px_rgba(0,180,210,0.25)]";

export default function WorldProp({ prop }: WorldPropProps) {
  const scale = prop.scale ?? 1;
  const rot = prop.rotation ?? 0;
  const v = prop.variant ?? 0;

  const style: CSSProperties = {
    left: `${prop.x}%`,
    top: `${prop.y}%`,
    zIndex: Math.floor(prop.y * 10) + 4,
    transform: `translate(-50%, -100%) rotate(${rot}deg) scale(${scale})`,
  };

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute w-0 origin-bottom"
      style={style}
    >
      <PropArt kind={prop.kind} variant={v} />
    </div>
  );
}

function PropArt({ kind, variant }: { kind: WorldPropDef["kind"]; variant: number }) {
  switch (kind) {
    case "building":
      return <Building variant={variant} />;
    case "tree":
      return <Tree variant={variant} />;
    case "bush":
      return <Bush variant={variant} />;
    case "rock":
      return <Rock variant={variant} />;
    case "lamp":
      return <Lamp />;
    case "crate":
      return <Crate variant={variant} />;
    case "antenna":
      return <Antenna />;
    case "bench":
      return <Bench />;
    default:
      return null;
  }
}

function Building({ variant }: { variant: number }) {
  const heights = ["h-14 md:h-16", "h-12 md:h-14", "h-16 md:h-[4.5rem]"];
  const widths = ["w-16 md:w-[4.5rem]", "w-14 md:w-16", "w-[4.5rem] md:w-20"];
  const h = heights[variant % heights.length];
  const w = widths[variant % widths.length];

  return (
    <div className="relative flex flex-col items-center">
      <div
        className={`relative ${w} ${h} rounded-sm border border-accent/35 bg-gradient-to-b from-[#1c2438] via-[#141a28] to-[#0e121c] shadow-[0_8px_24px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(0,229,255,0.12)]`}
      >
        <WindowGrid cols={variant === 2 ? 3 : 2} rows={variant === 0 ? 3 : 2} />
        {variant === 2 && (
          <div className="absolute -top-2 left-1/2 h-2 w-8 -translate-x-1/2 rounded-t border border-accent/30 bg-[#1a2235]" />
        )}
      </div>
      <div className="mt-0.5 h-1.5 w-[110%] rounded-full bg-black/50 blur-[2px]" />
    </div>
  );
}

function WindowGrid({ cols, rows }: { cols: number; rows: number }) {
  return (
    <div
      className="absolute inset-1.5 grid gap-1 p-0.5"
      style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)` }}
    >
      {Array.from({ length: cols * rows }).map((_, i) => (
        <span
          key={i}
          className="rounded-[2px] border border-cyan-500/20 bg-cyan-400/10 shadow-[inset_0_0_6px_rgba(0,229,255,0.15)]"
          style={{ opacity: 0.45 + (i % 3) * 0.2 }}
        />
      ))}
    </div>
  );
}

function Tree({ variant }: { variant: number }) {
  const wide = variant === 1;
  return (
    <div className="relative flex flex-col items-center">
      <div
        className={`${wide ? "h-9 w-11 md:h-10 md:w-12" : "h-8 w-9 md:h-9 md:w-10"} rounded-full border border-emerald-400/25 bg-gradient-to-b from-emerald-400/35 via-teal-700/50 to-[#0a1818] shadow-[0_0_16px_rgba(16,185,129,0.2)]`}
      />
      <div
        className={`${wide ? "-mt-3 h-7 w-10" : "-mt-2.5 h-6 w-8"} rounded-full border border-emerald-500/20 bg-gradient-to-b from-emerald-300/30 to-teal-900/60`}
      />
      <div className={`mt-0.5 ${wide ? "h-7 w-1.5" : "h-6 w-1"} rounded-sm ${limb}`} />
      <div className="mt-0.5 h-1 w-6 rounded-full bg-black/45 blur-[2px]" />
    </div>
  );
}

function Bush({ variant }: { variant: number }) {
  const sizes = [
    "h-4 w-8 md:h-5 md:w-9",
    "h-5 w-10 md:h-6 md:w-11",
    "h-3.5 w-7 md:h-4 md:w-8",
  ];
  return (
    <div className="relative">
      <div
        className={`${sizes[variant % sizes.length]} -rotate-3 rounded-[999px] border border-emerald-400/20 bg-gradient-to-b from-emerald-400/25 to-teal-900/55 shadow-[0_4px_12px_rgba(0,0,0,0.35)]`}
      />
      <div className="absolute -right-1 bottom-0 h-3 w-5 rotate-6 rounded-[999px] bg-teal-800/45" />
    </div>
  );
}

function Rock({ variant }: { variant: number }) {
  const large = variant === 1;
  return (
    <div className="relative">
      <div
        className={`${large ? "h-5 w-8 md:h-6 md:w-9" : "h-4 w-6 md:h-5 md:w-7"} rotate-[-8deg] rounded-[40%] border border-white/10 bg-gradient-to-br from-[#3a4050] via-[#252a36] to-[#151820] shadow-[0_6px_14px_rgba(0,0,0,0.45)]`}
      />
      <div className="absolute top-1 left-1 h-1.5 w-3 rotate-12 rounded-full bg-white/10" />
    </div>
  );
}

function Lamp() {
  const metal =
    "border-cyan-600/50 bg-gradient-to-b from-accent/85 via-cyan-700/90 to-cyan-950";
  return (
    <div className="relative flex w-7 flex-col items-center md:w-8">
      {/* flame + chimney glow */}
      <div
        className="pointer-events-none absolute -top-2 left-1/2 h-6 w-6 -translate-x-1/2 rounded-full bg-accent/25 blur-md"
        aria-hidden
      />
      <div className="relative z-[1] flex flex-col items-center">
        {/* glass chimney */}
        <div className="h-3 w-1.5 rounded-t-[2px] border border-cyan-100/20 bg-gradient-to-b from-white/25 via-accent/10 to-transparent shadow-[inset_0_0_4px_rgba(0,229,255,0.2)] md:h-3.5" />
        {/* wick flame */}
        <div className="relative -mt-px h-1.5 w-1 rounded-full bg-gradient-to-t from-cyan-700 via-accent to-cyan-100 shadow-[0_0_10px_rgba(0,229,255,0.85)]" />
        {/* burner cap */}
        <div className={`h-0.5 w-3 rounded-full border ${metal}`} />
        {/* bail handle */}
        <div
          className="absolute top-3.5 -right-0.5 h-4 w-2.5 rounded-r-full border border-cyan-600/60 border-l-transparent"
          aria-hidden
        />
        {/* hurricane glass font */}
        <div className="-mt-px relative h-3.5 w-4 rounded-b-[999px] rounded-t-[45%] border border-accent/25 bg-gradient-to-b from-accent/15 via-cyan-400/5 to-[#0a181c]/40 shadow-[inset_0_-3px_6px_rgba(0,0,0,0.35)] md:h-4 md:w-[1.125rem]">
          <div className="absolute inset-x-1 top-1 h-2 rounded-full bg-accent/15 blur-[1px]" />
        </div>
        {/* collar + foot */}
        <div className={`h-0.5 w-[1.125rem] border ${metal}`} />
        <div className={`h-1 w-5 rounded-sm border shadow-[0_0_8px_rgba(0,229,255,0.2)] ${metal}`} />
      </div>
      {/* short stake in the ground */}
      <div className={`mt-0.5 h-2.5 w-0.5 rounded-full ${limb}`} />
      <div className="mt-0.5 h-1 w-5 rounded-full bg-black/45 blur-[2px]" />
    </div>
  );
}

function Crate({ variant }: { variant: number }) {
  const stack = variant === 1;
  return (
    <div className="relative flex flex-col items-center gap-0.5">
      {stack && (
        <div className="h-4 w-5 rotate-3 rounded-sm border border-amber-600/30 bg-gradient-to-b from-[#3d3428] to-[#221c16] shadow-md" />
      )}
      <div className="h-5 w-6 rounded-sm border border-amber-600/35 bg-gradient-to-b from-[#4a4032] to-[#1e1914] shadow-[0_4px_10px_rgba(0,0,0,0.4)]">
        <div className="mx-auto mt-1.5 h-px w-4 bg-amber-700/40" />
        <div className="mx-auto mt-1 h-px w-3 bg-amber-800/30" />
      </div>
    </div>
  );
}

function Antenna() {
  return (
    <div className="relative flex flex-col items-center">
      <span className="absolute -top-1 h-2 w-2 animate-pulse rounded-full bg-accent shadow-[0_0_10px_rgba(0,229,255,0.9)]" />
      <div className={`h-10 w-0.5 ${limb}`} />
      <div className="absolute top-2 h-px w-6 bg-accent/40" />
      <div className="absolute top-4 h-px w-4 bg-accent/25" />
      <div className="h-1 w-5 rounded-full bg-black/45 blur-[2px]" />
    </div>
  );
}

function Bench() {
  return (
    <div className="relative">
      <div className="flex gap-1">
        <div className="h-1 w-8 rounded-sm bg-gradient-to-b from-[#3d4a5c] to-[#1a2230] shadow-md" />
      </div>
      <div className="mt-1 flex justify-between px-0.5">
        <div className={`h-2.5 w-0.5 ${limb}`} />
        <div className={`h-2.5 w-0.5 ${limb}`} />
      </div>
    </div>
  );
}
