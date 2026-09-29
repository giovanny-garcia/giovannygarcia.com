import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  dockPlacement,
  getPlayableStation,
  mapCamera,
  paintFloorFrame,
  viewportPoint,
  WORLD_SIZE,
  worldStations,
} from "../../data/world";
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
    posRef,
    onFrameRef,
    facing,
    moving,
    nearbyId,
    visited,
    walkTo,
    walkToStation,
    moveTarget,
    setPad,
  } = useFloorExplorer(exploring);

  const [dismissedId, setDismissedId] = useState<string | null>(null);
  const [hintPulse, setHintPulse] = useState(true);
  const [trackedNearby, setTrackedNearby] = useState<string | null>(nearbyId);
  const floorRef = useRef<HTMLDivElement>(null);
  const explorerRef = useRef<HTMLDivElement>(null);
  const dockRef = useRef<HTMLDivElement>(null);
  const dockStationRef = useRef<{
    x: number;
    y: number;
  } | null>(null);

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
  const dockPlace = inspecting
    ? dockPlacement(viewportPoint(inspecting, mapCamera(posRef.current)))
    : null;

  dockStationRef.current = inspecting
    ? {
        x: inspecting.x,
        y: inspecting.y,
      }
    : null;

  const paintFloor = useCallback(
    (pos: { x: number; y: number }, isMoving: boolean) => {
      paintFloorFrame(pos, isMoving, {
        floor: floorRef.current,
        explorer: explorerRef.current,
        dock: dockRef.current,
        dockStation: dockStationRef.current,
      });
    },
    [],
  );

  onFrameRef.current = paintFloor;

  useLayoutEffect(() => {
    paintFloor(posRef.current, moving);
  }, [paintFloor, posRef, moving, inspecting]);

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
    <div
      className="relative h-dvh w-full select-none overflow-hidden bg-bg-primary text-text-primary [-webkit-touch-callout:none]"
      onMouseDownCapture={(e) => {
        const el = e.target as HTMLElement | null;
        if (el?.closest("button, a, input, textarea, select, [data-allow-select]")) return;
        e.preventDefault();
      }}
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,#10131c_0%,#0a0a0f_46%,#050508_100%)]" />
        <div className="absolute inset-x-0 top-0 h-[34%] bg-gradient-to-b from-black/35 to-transparent" />
      </div>

      <div className="absolute inset-0 z-10">
        <div className="absolute inset-x-2 top-[9.75rem] bottom-16 md:inset-x-4 md:top-36 md:bottom-16">
          {/* clip, not hidden: hidden still lets focus scroll this frame and shove popups outside it */}
          <div className="relative mx-auto h-full w-full max-w-6xl overflow-clip rounded-2xl border border-accent/50 bg-black/25 shadow-[0_0_0_1px_rgba(0,229,255,0.16),0_0_32px_rgba(0,229,255,0.16),inset_0_0_0_1px_rgba(0,0,0,0.55)]">
            <div
              ref={floorRef}
              role="application"
              aria-label="Interactive floor. Use WASD or arrow keys to move, or click to walk. Approach stations to inspect. The floor extends beyond the window and scrolls as you move."
              tabIndex={0}
              onClick={(e) => onFloorPointer(e.clientX, e.clientY)}
              className="absolute top-0 left-0 cursor-crosshair touch-none outline-none"
              style={{
                width: `${WORLD_SIZE.width}%`,
                height: `${WORLD_SIZE.height}%`,
              }}
            >
              <div
                className="pointer-events-none absolute inset-[3%] rounded-[2.5rem] border border-white/8 bg-[#0c0c12]/35 shadow-[inset_0_0_80px_rgba(0,0,0,0.35)]"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.35]"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)",
                  backgroundSize: "64px 64px",
                }}
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
                  effectsActive={exploring}
                  onApproach={walkToStation}
                />
              ))}

              <AnimatePresence>
                {moveTarget && (
                  <MovePing
                    key={`${moveTarget.x}-${moveTarget.y}`}
                    x={moveTarget.x}
                    y={moveTarget.y}
                  />
                )}
              </AnimatePresence>

              <Explorer explorerRef={explorerRef} facing={facing} moving={moving} />

              <AnimatePresence>
                {nearby && exploring && !inspecting && (
                  <motion.div
                    key={`badge-${nearby.id}`}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    className="pointer-events-none absolute z-30 flex -translate-x-1/2 justify-center"
                    style={{
                      left: `${nearby.x}%`,
                      top: `calc(${nearby.y}% - 7.25rem)`,
                    }}
                  >
                    <div className="whitespace-nowrap rounded-full border border-accent/40 bg-bg-primary/90 px-3 py-1 text-center font-mono text-[10px] tracking-wide text-accent shadow-lg backdrop-blur-md md:text-[11px]">
                      {nearby.callout}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 55%, transparent 42%, rgba(5,5,8,0.45) 100%)",
              }}
              aria-hidden
            />

            <AnimatePresence>
              {inspecting && dockPlace && exploring && (
                <FocusDock
                  key="focus-dock"
                  station={inspecting}
                  placement={dockPlace}
                  dockRef={dockRef}
                  onClose={closeDock}
                  onPlay={playGame}
                />
              )}
            </AnimatePresence>
          </div>

          <header className="pointer-events-none absolute top-0 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="flex items-center gap-2.5 whitespace-nowrap rounded-full border border-accent/35 bg-[#0c1018] px-3.5 py-1.5 shadow-[0_10px_28px_rgba(0,0,0,0.45)]"
            >
              <h1 className="font-heading text-sm font-semibold tracking-tight md:text-[15px]">
                <span className="bg-gradient-to-r from-accent to-cyan-300 bg-clip-text text-transparent">
                  Giovanny Garcia
                </span>
              </h1>
              <span className="hidden h-3.5 w-px bg-white/15 lg:block" aria-hidden />
              <p className="hidden font-mono text-[10px] uppercase tracking-[0.18em] text-text-muted lg:block">
                games · blog · guitar
              </p>
            </motion.div>
          </header>
        </div>
      </div>

      {exploring && <VisitQuest visited={visited} />}

      {hintPulse && !inspecting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="pointer-events-none absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-1 px-4 text-center md:bottom-7"
        >
          <p className="font-mono text-[11px] tracking-wide text-text-muted">
            <span className="text-accent">WASD</span> / arrows move ·{" "}
            <span className="text-accent">click</span> to walk · floor scrolls
            with you
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

      <AnimatePresence>
        {view === "playing" && activeGame && (
          <GamePlayer game={activeGame} onExit={exitGame} />
        )}
      </AnimatePresence>
    </div>
  );
}

function VisitQuest({ visited }: { visited: Set<string> }) {
  const total = worldStations.length;
  const count = worldStations.filter((station) => visited.has(station.id)).length;
  const done = count >= total;
  const next = worldStations.find((station) => !visited.has(station.id));

  return (
    <aside
      aria-label={done ? "Quest complete" : "Quest: visit every station"}
      className="pointer-events-none absolute top-3.5 left-3 z-20 w-[12.5rem] rounded-2xl border border-white/10 bg-[#0e0e16]/85 px-3 py-2.5 shadow-[0_16px_40px_rgba(0,0,0,0.4)] backdrop-blur-md md:top-4 md:left-5"
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
        {done ? "Quest complete" : "Quest"}
      </p>
      <p className="mt-1 font-heading text-sm font-semibold text-text-primary">
        {done ? "Every station visited" : "Visit every station"}
      </p>
      <p className="mt-0.5 text-xs text-sky-300">
        {done ? "The floor is cleared." : `Next: ${next?.shortLabel}`}
      </p>
      <div
        className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/15"
        aria-hidden
      >
        <div
          className="h-full rounded-full bg-gradient-to-b from-accent to-cyan-700 shadow-[0_0_8px_rgba(0,180,210,0.35)] transition-[width] duration-300"
          style={{ width: total === 0 ? "0%" : `${(count / total) * 100}%` }}
        />
      </div>
      <p className="mt-1.5 font-mono text-[10px] tracking-wide text-text-muted">
        {count} / {total}
      </p>
    </aside>
  );
}

function MovePing({ x, y }: { x: number; y: number }) {
  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0, scale: 0.4 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.6 }}
      transition={{ duration: 0.16 }}
      className="pointer-events-none absolute z-[16] h-10 w-10 -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <motion.span
        className="absolute inset-0 rounded-full border-2 border-accent"
        animate={{ scale: [0.55, 1.7], opacity: [0.95, 0] }}
        transition={{ duration: 0.9, repeat: Infinity, ease: "easeOut" }}
      />
      <span className="absolute top-1/2 left-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_12px_rgba(0,229,255,0.9)]" />
    </motion.div>
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
