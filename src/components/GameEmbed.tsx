import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { HiPlay, HiArrowsExpand, HiExternalLink } from "react-icons/hi";

const ITCH_GAME_URL = "https://cry0smith.itch.io/tiles-ascend";
const LOCAL_GAME_URL = "/tiles-ascend/index.html";

export default function GameEmbed() {
  const [activated, setActivated] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, []);

  useEffect(() => {
    const onFs = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  return (
    <div id="game" className="mt-16">
      <h3 className="mb-2 font-heading text-2xl font-bold tracking-tight text-text-primary">
        Play Tiles Ascend
      </h3>
      <p className="mb-8 text-text-secondary">
        Hosted here — the web export loads when you start it.
      </p>

      {/* Landscape hint on small portrait screens */}
      <p className="mb-4 text-center text-xs text-text-muted sm:hidden">
        For the best experience, rotate your device to landscape.
      </p>

      <div
        ref={containerRef}
        className="relative mx-auto w-full max-w-4xl overflow-hidden rounded-2xl border border-border bg-black"
      >
        {/* 16:9 aspect ratio container */}
        <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
          {!activated && (
            <motion.button
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
                Loads the game files from this site (~84 MB first time)
              </span>
            </motion.button>
          )}

          {activated && (
            <iframe
              src={LOCAL_GAME_URL}
              title="Tiles Ascend — Godot 4.3 Game"
              className="absolute inset-0 h-full w-full border-0"
              allow="autoplay; fullscreen; gamepad; keyboard-map"
              allowFullScreen
            />
          )}
        </div>

        {/* Controls bar */}
        {activated && (
          <div className="flex items-center justify-between border-t border-border bg-bg-card px-4 py-2">
            <span className="font-mono text-xs text-text-muted">
              Tiles Ascend • Godot 4.3
            </span>
            <div className="flex items-center gap-3">
              <a
                href={ITCH_GAME_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-text-secondary transition-colors hover:bg-white/5 hover:text-text-primary"
              >
                <HiExternalLink size={14} />
                itch.io
              </a>
              <button
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

      {/* Fallback link for small screens */}
      <p className="mt-4 text-center text-xs text-text-muted sm:hidden">
        Having trouble?{" "}
        <a
          href={ITCH_GAME_URL}
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
