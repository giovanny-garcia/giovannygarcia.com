import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HiArrowLeft, HiPlay, HiExternalLink } from "react-icons/hi";
import {
  getPlayableGame,
  workspaceStations,
  type WorkspaceStation,
} from "../../data/games";
import { usePortfolioMode } from "../../context/usePortfolioMode";
import GameStation from "./GameStation";
import GamePlayer from "./GamePlayer";

function stationById(id: string | null): WorkspaceStation | undefined {
  if (!id) return undefined;
  return workspaceStations.find((s) => s.id === id);
}

export default function WorkspaceShell() {
  const { view, activeGameId, exitWorkspace, playGame, exitGame } =
    usePortfolioMode();
  const [selectedId, setSelectedId] = useState<string>("tiles-ascend");

  const selected = useMemo(
    () => stationById(selectedId) ?? workspaceStations[0],
    [selectedId],
  );
  const activeGame = activeGameId ? getPlayableGame(activeGameId) : undefined;

  return (
    <AnimatePresence>
      {view !== "site" && (
        <motion.div
          key="workspace-root"
          role="dialog"
          aria-modal="true"
          aria-label="Interactive workspace"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-[60] flex flex-col bg-bg-primary"
        >
          {/* Chrome */}
          <header className="relative z-30 flex shrink-0 items-center justify-between gap-3 border-b border-border/80 bg-bg-primary/80 px-4 py-3 backdrop-blur-md md:px-6">
            <button
              type="button"
              onClick={exitWorkspace}
              className="flex items-center gap-2 rounded-lg border border-border bg-bg-card px-3 py-2 text-sm font-medium text-text-primary transition-colors hover:border-accent/40 hover:bg-accent-glow hover:text-accent"
            >
              <HiArrowLeft size={16} />
              Back to portfolio
            </button>
            <div className="hidden text-center sm:block">
              <p className="font-heading text-sm font-semibold tracking-tight text-text-primary">
                Workspace
              </p>
              <p className="font-mono text-[11px] text-text-muted">
                Click a station · Esc exits
              </p>
            </div>
            <span className="font-mono text-xs text-text-muted sm:w-[9.5rem] sm:text-right">
              giovannygarcia
            </span>
          </header>

          {/* Floor */}
          <div className="relative min-h-0 flex-1 overflow-hidden">
            {/* Atmosphere */}
            <div className="pointer-events-none absolute inset-0" aria-hidden>
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,#16162a_0%,#0a0a0f_55%,#07070c_100%)]" />
              <div
                className="absolute inset-0 opacity-[0.18]"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(0,229,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.12) 1px, transparent 1px)",
                  backgroundSize: "48px 48px",
                  maskImage:
                    "radial-gradient(ellipse at 50% 60%, black 20%, transparent 75%)",
                }}
              />
              <div className="absolute top-[12%] left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-accent/10 blur-[100px]" />
              <div className="absolute bottom-[8%] left-[20%] h-40 w-40 rounded-full bg-cyan-700/15 blur-[80px]" />
              <div className="absolute right-[15%] bottom-[18%] h-48 w-48 rounded-full bg-teal-600/10 blur-[90px]" />

              {/* Horizon / room walls suggestion */}
              <div className="absolute inset-x-0 top-0 h-[28%] bg-gradient-to-b from-bg-secondary/40 to-transparent" />
              <div className="absolute inset-x-[8%] top-[22%] h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            </div>

            {/* Room stage */}
            <div className="absolute inset-0 flex items-stretch justify-center px-3 pb-4 pt-2 md:px-8 md:pb-6">
              <div className="relative w-full max-w-5xl">
                {/* Floor plane */}
                <div
                  className="absolute inset-x-[4%] top-[18%] bottom-[6%] rounded-[40%] border border-accent/10 bg-gradient-to-b from-bg-secondary/40 via-bg-card/30 to-bg-primary/80 shadow-[inset_0_0_80px_rgba(0,0,0,0.45)]"
                  style={{
                    transform: "perspective(900px) rotateX(48deg)",
                    transformOrigin: "center top",
                  }}
                  aria-hidden
                />

                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="absolute top-2 left-1/2 z-10 w-[min(100%,28rem)] -translate-x-1/2 text-center font-heading text-lg font-semibold text-text-primary md:top-4 md:text-2xl"
                >
                  Step onto a station
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="absolute top-10 left-1/2 z-10 w-[min(100%,32rem)] -translate-x-1/2 text-center text-xs text-text-secondary md:top-14 md:text-sm"
                >
                  Play a build in-place, then return here without leaving the
                  site.
                </motion.p>

                {/* Stations live in floor percentage space */}
                <div className="absolute inset-0 z-10">
                  {workspaceStations.map((station) => (
                    <GameStation
                      key={station.id}
                      station={station}
                      selected={selected.id === station.id}
                      onSelect={setSelectedId}
                      onActivate={playGame}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Detail panel */}
            <AnimatePresence mode="wait">
              <motion.aside
                key={selected.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.25 }}
                className="absolute inset-x-3 bottom-3 z-20 mx-auto max-w-lg rounded-2xl border border-border bg-bg-card/95 p-4 shadow-xl shadow-black/40 backdrop-blur-md md:inset-x-auto md:right-6 md:bottom-6 md:left-auto md:w-80"
              >
                {selected.kind === "playable" && selected.image ? (
                  <img
                    src={selected.image}
                    alt=""
                    className="mb-3 aspect-video w-full rounded-lg object-cover"
                  />
                ) : (
                  <div className="mb-3 flex aspect-video items-center justify-center rounded-lg border border-dashed border-border bg-bg-secondary">
                    <span className="font-mono text-xs text-text-muted">
                      {selected.kind === "coming-soon"
                        ? "coming soon"
                        : "info"}
                    </span>
                  </div>
                )}

                <h2 className="mb-1 font-heading text-lg font-semibold text-text-primary">
                  {selected.title}
                </h2>
                <p className="mb-4 text-sm leading-relaxed text-text-secondary">
                  {selected.description}
                </p>

                {selected.kind === "playable" && (
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => playGame(selected.id)}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 font-heading text-sm font-semibold text-bg-primary transition-all hover:bg-accent-dim hover:shadow-lg hover:shadow-accent/20"
                    >
                      <HiPlay size={16} />
                      Play now
                    </button>
                    <a
                      href={selected.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border px-3 py-2.5 text-sm text-text-secondary transition-colors hover:border-accent/40 hover:text-accent"
                    >
                      <HiExternalLink size={16} />
                    </a>
                  </div>
                )}

                {selected.kind !== "playable" && (
                  <p className="font-mono text-xs uppercase tracking-wider text-text-muted">
                    {selected.kind === "coming-soon"
                      ? "Station locked"
                      : "Reference only"}
                  </p>
                )}
              </motion.aside>
            </AnimatePresence>
          </div>

          {/* Immersive player overlays workspace */}
          <AnimatePresence>
            {view === "playing" && activeGame && (
              <GamePlayer game={activeGame} onExit={exitGame} />
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
