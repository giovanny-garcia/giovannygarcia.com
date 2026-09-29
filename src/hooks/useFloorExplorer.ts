import { useCallback, useEffect, useRef, useState } from "react";
import { WORLD_SCALE, worldStations } from "../data/world";

export interface Vec2 {
  x: number;
  y: number;
}

const BOUNDS = { minX: 6, maxX: 94, minY: 8, maxY: 92 };
// Tuned in viewport-percent, then scaled so walking speed and reach stay the same on screen.
const SPEED = 28 / WORLD_SCALE;
const ARRIVE = 1.2 / WORLD_SCALE;
const PROXIMITY = 11 / WORLD_SCALE;

const aboutStation = worldStations.find((s) => s.id === "about");
/** Just to the right of About, close enough for that station to open. */
const START: Vec2 = aboutStation
  ? { x: aboutStation.x + 4.5 / WORLD_SCALE, y: aboutStation.y }
  : { x: 50, y: 68 };

const MOVE_KEYS = [
  "w",
  "a",
  "s",
  "d",
  "arrowup",
  "arrowdown",
  "arrowleft",
  "arrowright",
];

function clearTextSelection() {
  const sel = window.getSelection();
  if (sel && !sel.isCollapsed) sel.removeAllRanges();
}

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

function dist(a: Vec2, b: Vec2) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function nearestStation(pos: Vec2) {
  let bestId: string | null = null;
  let bestD = Infinity;
  for (const s of worldStations) {
    const d = dist(pos, { x: s.x, y: s.y });
    if (d < bestD) {
      bestD = d;
      bestId = s.id;
    }
  }
  return { id: bestId, distance: bestD };
}

export type FloorFrame = (pos: Vec2, moving: boolean) => void;

export function useFloorExplorer(enabled: boolean) {
  const [facing, setFacing] = useState<-1 | 1>(-1);
  const [moving, setMoving] = useState(false);
  const [nearbyId, setNearbyId] = useState<string | null>(() => {
    const near = nearestStation(START);
    return near.id && near.distance <= PROXIMITY ? near.id : null;
  });
  const [visited, setVisited] = useState<Set<string>>(() => {
    const near = nearestStation(START);
    return near.id && near.distance <= PROXIMITY
      ? new Set([near.id])
      : new Set();
  });
  const [moveTarget, setMoveTarget] = useState<Vec2 | null>(null);

  const posRef = useRef<Vec2>(START);
  const keysRef = useRef(new Set<string>());
  const padRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef<Vec2 | null>(null);
  const rafRef = useRef(0);
  const lastTsRef = useRef(0);
  const loopRunning = useRef(false);
  const kickRef = useRef<() => void>(() => {});
  const onFrameRef = useRef<FloorFrame | null>(null);
  const facingRef = useRef<-1 | 1>(-1);
  const movingRef = useRef(false);
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;

  const setFacingIf = useCallback((next: -1 | 1) => {
    if (facingRef.current === next) return;
    facingRef.current = next;
    setFacing(next);
  }, []);

  const setMovingIf = useCallback((next: boolean) => {
    if (movingRef.current === next) return false;
    movingRef.current = next;
    setMoving(next);
    return true;
  }, []);

  const clearMoveTarget = useCallback(() => {
    targetRef.current = null;
    setMoveTarget(null);
  }, []);

  const walkTo = useCallback((target: Vec2) => {
    const next = {
      x: clamp(target.x, BOUNDS.minX, BOUNDS.maxX),
      y: clamp(target.y, BOUNDS.minY, BOUNDS.maxY),
    };
    targetRef.current = next;
    setMoveTarget(next);
    clearTextSelection();
    kickRef.current();
  }, []);

  const walkToStation = useCallback(
    (id: string) => {
      const station = worldStations.find((s) => s.id === id);
      if (!station) return;
      const dx = station.x - posRef.current.x;
      const dy = station.y - posRef.current.y;
      const len = Math.hypot(dx, dy) || 1;
      const stopShort = 4.5 / WORLD_SCALE;
      walkTo({
        x: station.x - (dx / len) * stopShort,
        y: station.y - (dy / len) * stopShort,
      });
    },
    [walkTo],
  );

  const setPad = useCallback(
    (x: number, y: number) => {
      padRef.current = { x, y };
      if (x !== 0 || y !== 0) {
        clearMoveTarget();
        clearTextSelection();
        kickRef.current();
      }
    },
    [clearMoveTarget],
  );

  useEffect(() => {
    if (!enabled) {
      keysRef.current.clear();
      padRef.current = { x: 0, y: 0 };
      clearMoveTarget();
      return;
    }

    const onDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      const key = e.key.toLowerCase();
      if (MOVE_KEYS.includes(key)) {
        e.preventDefault();
        keysRef.current.add(key);
        clearMoveTarget();
        clearTextSelection();
        kickRef.current();
      }
    };

    const onUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.key.toLowerCase());
    };

    window.addEventListener("keydown", onDown, { passive: false });
    window.addEventListener("keyup", onUp);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
    };
  }, [enabled, clearMoveTarget]);

  useEffect(() => {
    if (!enabled) {
      cancelAnimationFrame(rafRef.current);
      loopRunning.current = false;
      lastTsRef.current = 0;
      if (movingRef.current) {
        movingRef.current = false;
        setMoving(false);
      }
      return;
    }

    let cancelled = false;

    const tick = (ts: number) => {
      if (cancelled) return;

      const last = lastTsRef.current || ts;
      const dt = Math.min(0.05, (ts - last) / 1000);
      lastTsRef.current = ts;

      let { x, y } = posRef.current;
      let dx = padRef.current.x;
      let dy = padRef.current.y;
      const keys = keysRef.current;

      if (keys.has("w") || keys.has("arrowup")) dy -= 1;
      if (keys.has("s") || keys.has("arrowdown")) dy += 1;
      if (keys.has("a") || keys.has("arrowleft")) dx -= 1;
      if (keys.has("d") || keys.has("arrowright")) dx += 1;

      let movingChanged = false;

      if (dx !== 0 || dy !== 0) {
        const len = Math.hypot(dx, dy) || 1;
        x += (dx / len) * SPEED * dt;
        y += (dy / len) * SPEED * dt;
        if (dx < 0) setFacingIf(-1);
        else if (dx > 0) setFacingIf(1);
        movingChanged = setMovingIf(true);
      } else if (targetRef.current) {
        const t = targetRef.current;
        const tdx = t.x - x;
        const tdy = t.y - y;
        const d = Math.hypot(tdx, tdy);
        if (d <= ARRIVE) {
          clearMoveTarget();
          movingChanged = setMovingIf(false);
        } else {
          x += (tdx / d) * SPEED * dt;
          y += (tdy / d) * SPEED * dt;
          setFacingIf(tdx < 0 ? -1 : 1);
          movingChanged = setMovingIf(true);
        }
      } else {
        movingChanged = setMovingIf(false);
      }

      x = clamp(x, BOUNDS.minX, BOUNDS.maxX);
      y = clamp(y, BOUNDS.minY, BOUNDS.maxY);

      const moved = x !== posRef.current.x || y !== posRef.current.y;
      if (moved) posRef.current = { x, y };
      if (moved || movingChanged) {
        onFrameRef.current?.(posRef.current, movingRef.current);
      }

      const near = nearestStation(posRef.current);
      const nextNearby = near.distance <= PROXIMITY ? near.id : null;
      setNearbyId((prev) => (prev === nextNearby ? prev : nextNearby));
      if (nextNearby) {
        setVisited((prev) => {
          if (prev.has(nextNearby)) return prev;
          const copy = new Set(prev);
          copy.add(nextNearby);
          return copy;
        });
      }

      const idle =
        keysRef.current.size === 0 &&
        padRef.current.x === 0 &&
        padRef.current.y === 0 &&
        targetRef.current === null;

      if (cancelled || idle) {
        loopRunning.current = false;
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    kickRef.current = () => {
      if (cancelled || !enabledRef.current || loopRunning.current) return;
      loopRunning.current = true;
      lastTsRef.current = 0;
      rafRef.current = requestAnimationFrame(tick);
    };

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafRef.current);
      loopRunning.current = false;
      lastTsRef.current = 0;
      kickRef.current = () => {};
    };
  }, [enabled, clearMoveTarget, setFacingIf, setMovingIf]);

  return {
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
    bounds: BOUNDS,
  };
}
