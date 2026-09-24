import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { getPlayableStation, worldStations } from "../../data/world";
import { useWorldMode } from "../../context/useWorldMode";
import { useFloorExplorer } from "../../hooks/useFloorExplorer";
import StationMarker from "./StationMarker";
import FocusDock from "./FocusDock";
import GamePlayer from "./GamePlayer";
import Explorer from "./Explorer";

export default function World() {
  const { view, activeGameId, playGame, exitGame } = useWorldMode();
  const exploring = view === "explore";
  const {
    pos,
    facing,
    moving,
    nearbyId,
    visited,
    walkTo,
    walkToStation,
    setPad,
  } = useFloorExplorer(exploring);

  const [dismissedId, setDismissedId] = useState<string | null>(null);
  const [hintPulse, setHintPulse] = useState(true);
  const [trackedNearby, setTrackedNearby] = useState<string | null>(nearbyId);
  const floorRef = useRef<HTMLDivElement>(null);

  // Reset dismiss when you leave or reach a different station (React "adjust state during render")
  if (nearbyId !== trackedNearby) {
    setTrackedNearby(nearbyId);
    setDismissedId(null);
  }

  const inspectId =
    nearbyId && nearbyId !== dismissedId ? nearbyId : null;

  const inspecting = useMemo(
    () => worldStations.find((s) => s.id === inspectId) ?? null,
    [inspectId],
  );
  const nearby = useMemo(
    () => worldStations.find((s) => s.id === nearbyId) ?? null,
    [nearbyId],
  );
  const activeGame = activeGameId ? getPlayableStation(activeGameId) : undefined;

  useEffect(() => {
    if (!exploring) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== "e") return;
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (!nearbyId) return;
      e.preventDefault();
      setDismissedId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [exploring, nearbyId]);

  const closeDock = useCallback(() => {
    if (nearbyId) setDismissedId(nearbyId);
  }, [nearbyId]);

  const onFloorPointer = useCallback(
    (clientX: number, clientY: number) => {
      const el = floorRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width) * 100;
      const y = ((clientY - rect.top) / rect.height) * 100;
      walkTo({ x, y });
      setHintPulse(false);
    },
    [walkTo],
  );

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-bg-primary text-text-primary">
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

      <header className="pointer-events-none relative z-20 px-5 pt-6 text-center md:pt-8">
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
          className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-text-secondary md:text-base"
        >
          Walk the floor. Approach a station to discover games, notes, and who I
          am.
        </motion.p>
      </header>

      <div className="absolute inset-0 z-10">
        <div className="absolute inset-x-0 top-[20%] bottom-0 md:top-[18%]">
          <div
            ref={floorRef}
            role="application"
            aria-label="Interactive floor. Use WASD or arrow keys to move, or click to walk. Approach stations to inspect."
            tabIndex={0}
            onClick={(e) => onFloorPointer(e.clientX, e.clientY)}
            className="relative mx-auto h-full w-full max-w-6xl cursor-crosshair touch-none px-2 outline-none md:px-6"
          >
            <div
              className="pointer-events-none absolute inset-x-[2%] top-[8%] bottom-[14%] rounded-[45%] border border-accent/10 bg-gradient-to-b from-[#151522]/55 via-[#101018]/35 to-transparent shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]"
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
                nearby={nearbyId === station.id}
                visited={visited.has(station.id)}
                inspecting={inspectId === station.id}
                onApproach={walkToStation}
              />
            ))}

            <Explorer x={pos.x} y={pos.y} facing={facing} moving={moving} />

            <AnimatePresence>
              {nearby && exploring && (
                <motion.div
                  key={nearby.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  className="pointer-events-none absolute z-30 -translate-x-1/2"
                  style={{
                    left: `${nearby.x}%`,
                    top: `calc(${nearby.y}% - 5.5rem)`,
                  }}
                >
                  <div className="rounded-full border border-accent/40 bg-bg-primary/90 px-3 py-1 font-mono text-[10px] tracking-wide text-accent shadow-lg backdrop-blur-md md:text-[11px]">
                    Nearby · {nearby.title}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {hintPulse && !inspecting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="pointer-events-none absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-1 px-4 text-center md:bottom-7"
        >
          <p className="font-mono text-[11px] tracking-wide text-text-muted">
            <span className="text-accent">WASD</span> / arrows move ·{" "}
            <span className="text-accent">click</span> floor or station to walk
          </p>
          <p className="font-mono text-[10px] text-text-muted/70">
            Get close to open · Esc leaves a game
          </p>
        </motion.div>
      )}

      {exploring && (
        <div className="absolute bottom-4 left-4 z-30 md:hidden">
          <div className="grid grid-cols-3 gap-1">
            <span />
            <PadButton label="↑" onVector={setPad} vec={{ x: 0, y: -1 }} />
            <span />
            <PadButton label="←" onVector={setPad} vec={{ x: -1, y: 0 }} />
            <PadButton label="↓" onVector={setPad} vec={{ x: 0, y: 1 }} />
            <PadButton label="→" onVector={setPad} vec={{ x: 1, y: 0 }} />
          </div>
        </div>
      )}

      {inspecting && exploring && (
        <FocusDock
          station={inspecting}
          onClose={closeDock}
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

function PadButton({
  label,
  vec,
  onVector,
}: {
  label: string;
  vec: { x: number; y: number };
  onVector: (x: number, y: number) => void;
}) {
  return (
    <button
      type="button"
      aria-label={`Move ${label}`}
      onPointerDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
        (e.currentTarget as HTMLButtonElement).setPointerCapture(e.pointerId);
        onVector(vec.x, vec.y);
      }}
      onPointerUp={(e) => {
        e.stopPropagation();
        onVector(0, 0);
      }}
      onPointerCancel={() => onVector(0, 0)}
      className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-bg-card/90 font-mono text-sm text-text-primary shadow-lg backdrop-blur-md active:border-accent/50 active:bg-accent/15"
    >
      {label}
    </button>
  );
}
