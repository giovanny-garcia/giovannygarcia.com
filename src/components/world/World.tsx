import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  getPlayableStation,
  worldStations,
} from "../../data/world";
import { useWorldMode } from "../../context/useWorldMode";
import StationMarker from "./StationMarker";
import FocusDock from "./FocusDock";
import GamePlayer from "./GamePlayer";

export default function World() {
  const { view, activeGameId, playGame, exitGame } = useWorldMode();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = useMemo(
    () => worldStations.find((s) => s.id === selectedId) ?? null,
    [selectedId],
  );
  const activeGame = activeGameId ? getPlayableStation(activeGameId) : undefined;

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-bg-primary text-text-primary">
      {/* Atmosphere */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,#1a1a2e_0%,#0a0a0f_42%,#050508_100%)]" />
        <motion.div
          className="absolute top-[-10%] left-1/2 h-[55vh] w-[70vw] -translate-x-1/2 rounded-full bg-accent/[0.07] blur-[110px]"
          animate={{ opacity: [0.55, 0.9, 0.55], scale: [1, 1.06, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute bottom-[5%] left-[10%] h-56 w-56 rounded-full bg-teal-700/15 blur-[90px]" />
        <div className="absolute right-[8%] bottom-[20%] h-64 w-64 rounded-full bg-cyan-800/12 blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.22]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,229,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.1) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage:
              "radial-gradient(ellipse at 50% 65%, black 15%, transparent 72%)",
          }}
        />
        <div className="absolute inset-x-0 top-0 h-[34%] bg-gradient-to-b from-black/35 to-transparent" />
      </div>

      {/* Brand / first composition */}
      <header className="relative z-20 px-5 pt-7 text-center md:pt-10">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-2 font-mono text-[11px] uppercase tracking-[0.28em] text-accent md:text-xs"
        >
          giovannygarcia.com
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08 }}
          className="font-heading text-4xl font-bold tracking-tight text-text-primary sm:text-5xl md:text-6xl"
        >
          Giovanny Garcia
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.18 }}
          className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-text-secondary md:text-base"
        >
          An interactive floor for my games, notes, and who I am — click a
          station to look around.
        </motion.p>
      </header>

      {/* Floor stage */}
      <div className="absolute inset-0 z-10">
        <div className="absolute inset-x-0 top-[22%] bottom-0 md:top-[20%]">
          <div className="relative mx-auto h-full w-full max-w-6xl px-2 md:px-6">
            <div
              className="absolute inset-x-[2%] top-[8%] bottom-[18%] rounded-[45%] border border-accent/10 bg-gradient-to-b from-[#151522]/55 via-[#101018]/35 to-transparent shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]"
              style={{
                transform: "perspective(1100px) rotateX(52deg)",
                transformOrigin: "center top",
              }}
              aria-hidden
            />

            <motion.div
              className="pointer-events-none absolute top-[6%] left-1/2 h-px w-[70%] -translate-x-1/2 bg-gradient-to-r from-transparent via-accent/35 to-transparent"
              initial={{ opacity: 0, scaleX: 0.6 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              aria-hidden
            />

            {worldStations.map((station, index) => (
              <StationMarker
                key={station.id}
                station={station}
                index={index}
                selected={selectedId === station.id}
                onSelect={setSelectedId}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Hint */}
      {!selected && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="pointer-events-none absolute bottom-6 left-1/2 z-20 -translate-x-1/2 font-mono text-[11px] tracking-wide text-text-muted md:bottom-8"
        >
          Click a station · Esc leaves a game
        </motion.p>
      )}

      {selected && (
        <FocusDock
          station={selected}
          onClose={() => setSelectedId(null)}
          onPlay={playGame}
        />
      )}

      <AnimatePresence>
        {view === "playing" && activeGame && (
          <GamePlayer game={activeGame} onExit={exitGame} />
        )}
      </AnimatePresence>
    </div>
  );
}
