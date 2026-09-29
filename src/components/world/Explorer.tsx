import type { RefObject } from "react";

interface ExplorerProps {
  facing: -1 | 1;
  moving: boolean;
  explorerRef: RefObject<HTMLDivElement | null>;
  /** First-visit cue. Stays until the player actually walks. */
  nudge?: boolean;
}

const limb =
  "bg-gradient-to-b from-accent to-cyan-700 shadow-[0_0_8px_rgba(0,180,210,0.35)]";

export default function Explorer({
  facing,
  moving,
  explorerRef,
  nudge = false,
}: ExplorerProps) {
  const cueOnRight = facing < 0;

  return (
    <div
      ref={explorerRef}
      className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-full"
      aria-hidden
    >
      <div className="absolute bottom-0 left-1/2 h-2 w-7 -translate-x-1/2 translate-y-1 rounded-full bg-accent/35 blur-[3px]" />

      {/* Facing flip stays off the bobbing element so the step cycle can own translateY */}
      <div
        className="relative w-8 md:w-9"
        style={{ transform: `scaleX(${facing})` }}
      >
        <div className={moving ? "explorer-bob-walk" : "explorer-bob-idle"}>
          <div className="flex flex-col items-center">
            <div className={`h-3.5 w-3.5 rounded-full md:h-4 md:w-4 ${limb}`} />
            <div
              className={`mt-0.5 h-5 w-4 rounded-md md:h-6 md:w-[1.15rem] ${limb}`}
            />
            <div className="mt-0.5 flex w-full justify-between px-0.5">
              <span
                className={`h-1.5 w-1.5 rounded-sm ${limb} ${moving ? "explorer-step" : ""}`}
              />
              <span
                className={`h-1.5 w-1.5 rounded-sm ${limb} ${moving ? "explorer-step explorer-step-late" : ""}`}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="explorer-ping absolute bottom-[-6px] left-1/2 h-8 w-8 -translate-x-1/2 rounded-full border border-accent/30" />

      {nudge && (
        <div
          className={`absolute top-[calc(100%-0.35rem)] flex items-center gap-2 ${
            cueOnRight ? "left-full ml-3" : "right-full mr-3 flex-row-reverse"
          }`}
        >
          <span className="font-mono text-sm text-accent/80" aria-hidden>
            {cueOnRight ? "›" : "‹"}
          </span>
          <div className="relative h-8 w-8 shrink-0">
            <span className="nudge-ring absolute inset-0 rounded-full border-2 border-accent" />
            <span className="absolute top-1/2 left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_10px_rgba(0,229,255,0.9)]" />
            <svg
              viewBox="0 0 24 24"
              className="nudge-cursor absolute top-1/2 left-1/2 h-3.5 w-3.5 text-text-primary drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
              aria-hidden
            >
              <path
                fill="currentColor"
                d="M5.2 2.8 19.4 12l-6.3 1.2L11.2 20.6 8.7 13.4z"
              />
            </svg>
          </div>
          <div className={cueOnRight ? "text-left" : "text-right"}>
            <p className="whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.16em] text-accent">
              <span className="md:hidden">tap to walk</span>
              <span className="hidden md:inline">click to walk</span>
            </p>
            <div
              className={`mt-1 hidden gap-0.5 md:flex ${cueOnRight ? "" : "justify-end"}`}
            >
              {["W", "A", "S", "D"].map((key, index) => (
                <span
                  key={key}
                  className="nudge-key flex h-4 min-w-4 items-center justify-center rounded border px-0.5 font-mono text-[9px]"
                  style={{ animationDelay: `${index * 0.12}s` }}
                >
                  {key}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
