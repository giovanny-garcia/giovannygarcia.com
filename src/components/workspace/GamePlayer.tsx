import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  HiArrowsExpand,
  HiExternalLink,
  HiX,
  HiArrowLeft,
} from "react-icons/hi";
import type { PlayableGame } from "../../data/games";

interface GamePlayerProps {
  game: PlayableGame;
  onExit: () => void;
}

export default function GamePlayer({ game, onExit }: GamePlayerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = useCallback(() => {
    if (!stageRef.current) return;
    if (!document.fullscreenElement) {
      void stageRef.current.requestFullscreen();
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
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`Playing ${game.title}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[70] flex flex-col bg-bg-primary"
    >
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-border bg-bg-secondary/95 px-4 py-3 backdrop-blur-md md:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onExit}
            className="flex items-center gap-2 rounded-lg border border-border bg-bg-card px-3 py-2 text-sm font-medium text-text-primary transition-colors hover:border-accent/40 hover:bg-accent-glow hover:text-accent"
          >
            <HiArrowLeft size={16} />
            <span className="hidden sm:inline">Back to workspace</span>
            <span className="sm:hidden">Back</span>
          </button>
          <div className="min-w-0">
            <p className="truncate font-heading text-sm font-semibold text-text-primary md:text-base">
              {game.title}
            </p>
            <p className="truncate font-mono text-xs text-text-muted">
              {game.engine} · Esc to exit
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <a
            href={game.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs text-text-secondary transition-colors hover:bg-white/5 hover:text-text-primary"
          >
            <HiExternalLink size={14} />
            <span className="hidden sm:inline">itch.io</span>
          </a>
          <button
            type="button"
            onClick={toggleFullscreen}
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs text-text-secondary transition-colors hover:bg-white/5 hover:text-text-primary"
          >
            <HiArrowsExpand size={14} />
            <span className="hidden sm:inline">
              {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            </span>
          </button>
          <button
            type="button"
            onClick={onExit}
            aria-label="Close player"
            className="rounded-lg p-2 text-text-muted transition-colors hover:bg-white/5 hover:text-text-primary"
          >
            <HiX size={20} />
          </button>
        </div>
      </header>

      <div className="relative flex min-h-0 flex-1 flex-col items-center justify-center p-3 sm:p-6">
        <p className="mb-3 text-center text-xs text-text-muted sm:hidden">
          Rotate to landscape for the best play experience.
        </p>

        <div
          ref={stageRef}
          className="relative w-full max-w-5xl overflow-hidden rounded-xl border border-border bg-black shadow-2xl shadow-black/50"
        >
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            <iframe
              src={game.embedUrl}
              title={`${game.title} — playable build`}
              className="absolute inset-0 h-full w-full border-0"
              allowFullScreen
            />
          </div>
        </div>

        <p className="mt-4 max-w-xl text-center text-sm text-text-secondary">
          When you are finished, hit{" "}
          <span className="font-mono text-accent">Back to workspace</span> to
          return to the interactive floor — the site stays put.
        </p>
      </div>
    </motion.div>
  );
}
