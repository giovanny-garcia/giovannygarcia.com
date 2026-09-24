import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  HiPlay,
  HiArrowsExpand,
  HiExternalLink,
  HiCubeTransparent,
} from "react-icons/hi";
import { getPlayableGame } from "../data/games";
import { usePortfolioMode } from "../context/usePortfolioMode";

const tilesAscend = getPlayableGame("tiles-ascend")!;

export default function GameEmbed() {
  const { enterWorkspace, playGame } = usePortfolioMode();
  const [activated, setActivated] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      void containerRef.current.requestFullscreen();
    } else {
      void document.exitFullscreen();
    }
  }, []);

  useEffect(() => {
    const onFs = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  return (
    <div id="game" className="mt-16">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="mb-2 font-heading text-2xl font-bold tracking-tight text-text-primary">
            Play Tiles Ascend
          </h3>
          <p className="text-text-secondary">
            Inline preview from itch.io — or open the workspace for the full
            enter / play / return loop.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            enterWorkspace();
            playGame("tiles-ascend");
          }}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-accent/30 bg-accent-glow px-4 py-2.5 font-heading text-sm font-semibold text-accent transition-all hover:border-accent/60 hover:bg-accent/10"
        >
          <HiCubeTransparent size={16} />
          Open in workspace
        </button>
      </div>

      <p className="mb-4 text-center text-xs text-text-muted sm:hidden">
        For the best experience, rotate your device to landscape.
      </p>

      <div
        ref={containerRef}
        className="relative mx-auto w-full max-w-4xl overflow-hidden rounded-2xl border border-border bg-black"
      >
        <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
          {!activated && (
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setActivated(true)}
              className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-bg-card/90 backdrop-blur-sm transition-colors hover:bg-bg-card/70"
            >
              <div className="rounded-full bg-accent/20 p-5 transition-transform hover:scale-110">
                <HiPlay size={40} className="text-accent" />
              </div>
              <span className="font-heading text-lg font-semibold text-text-primary">
                Tap to Play
              </span>
              <span className="text-xs text-text-muted">
                Click to load {tilesAscend.title} from itch.io
              </span>
            </motion.button>
          )}

          {activated && (
            <iframe
              src={tilesAscend.embedUrl}
              title={`${tilesAscend.title} — Godot game`}
              className="absolute inset-0 h-full w-full border-0"
              allowFullScreen
            />
          )}
        </div>

        {activated && (
          <div className="flex items-center justify-between border-t border-border bg-bg-card px-4 py-2">
            <span className="font-mono text-xs text-text-muted">
              {tilesAscend.title} • {tilesAscend.engine}
            </span>
            <div className="flex items-center gap-3">
              <a
                href={tilesAscend.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-text-secondary transition-colors hover:bg-white/5 hover:text-text-primary"
              >
                <HiExternalLink size={14} />
                itch.io
              </a>
              <button
                type="button"
                onClick={toggleFullscreen}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-text-secondary transition-colors hover:bg-white/5 hover:text-text-primary"
              >
                <HiArrowsExpand size={14} />
                {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              </button>
            </div>
          </div>
        )}
      </div>

      <p className="mt-4 text-center text-xs text-text-muted sm:hidden">
        Having trouble?{" "}
        <a
          href={tilesAscend.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent underline"
        >
          Play on itch.io
        </a>
      </p>
    </div>
  );
}
