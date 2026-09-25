import type { RefObject } from "react";

interface ExplorerProps {
  facing: -1 | 1;
  moving: boolean;
  explorerRef: RefObject<HTMLDivElement | null>;
}

const limb =
  "bg-gradient-to-b from-accent to-cyan-700 shadow-[0_0_8px_rgba(0,180,210,0.35)]";

export default function Explorer({ facing, moving, explorerRef }: ExplorerProps) {
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
    </div>
  );
}
