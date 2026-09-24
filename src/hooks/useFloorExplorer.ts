import { useCallback, useEffect, useRef, useState } from "react";
import { worldStations } from "../data/world";

export interface Vec2 {
  x: number;
  y: number;
}

const START: Vec2 = { x: 50, y: 72 };
const BOUNDS = { minX: 10, maxX: 90, minY: 22, maxY: 82 };
const SPEED = 28;
const ARRIVE = 1.2;
const PROXIMITY = 11;

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

export function useFloorExplorer(enabled: boolean) {
  const [pos, setPos] = useState<Vec2>(START);
  const [facing, setFacing] = useState<-1 | 1>(1);
  const [moving, setMoving] = useState(false);
  const [nearbyId, setNearbyId] = useState<string | null>(null);
  const [visited, setVisited] = useState<Set<string>>(() => new Set());

  const posRef = useRef(pos);
  const keysRef = useRef(new Set<string>());
  const padRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef<Vec2 | null>(null);
  const rafRef = useRef(0);
  const lastTsRef = useRef(0);

  useEffect(() => {
    posRef.current = pos;
  }, [pos]);

  const walkTo = useCallback((target: Vec2) => {
    targetRef.current = {
      x: clamp(target.x, BOUNDS.minX, BOUNDS.maxX),
      y: clamp(target.y, BOUNDS.minY, BOUNDS.maxY),
    };
  }, []);

  const walkToStation = useCallback(
    (id: string) => {
      const station = worldStations.find((s) => s.id === id);
      if (!station) return;
      const dx = station.x - posRef.current.x;
      const dy = station.y - posRef.current.y;
      const len = Math.hypot(dx, dy) || 1;
      const stopShort = 4.5;
      walkTo({
        x: station.x - (dx / len) * stopShort,
        y: station.y - (dy / len) * stopShort,
      });
    },
    [walkTo],
  );

  const setPad = useCallback((x: number, y: number) => {
    padRef.current = { x, y };
    if (x !== 0 || y !== 0) targetRef.current = null;
  }, []);

  useEffect(() => {
    if (!enabled) {
      keysRef.current.clear();
      padRef.current = { x: 0, y: 0 };
      targetRef.current = null;
      return;
    }

    const onDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      const key = e.key.toLowerCase();
      if (
        [
          "w",
          "a",
          "s",
          "d",
          "arrowup",
          "arrowdown",
          "arrowleft",
          "arrowright",
        ].includes(key)
      ) {
        e.preventDefault();
        keysRef.current.add(key);
        targetRef.current = null;
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
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    const tick = (ts: number) => {
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

      if (dx !== 0 || dy !== 0) {
        const len = Math.hypot(dx, dy) || 1;
        x += (dx / len) * SPEED * dt;
        y += (dy / len) * SPEED * dt;
        if (dx < 0) setFacing(-1);
        else if (dx > 0) setFacing(1);
        setMoving(true);
      } else if (targetRef.current) {
        const t = targetRef.current;
        const tdx = t.x - x;
        const tdy = t.y - y;
        const d = Math.hypot(tdx, tdy);
        if (d <= ARRIVE) {
          targetRef.current = null;
          setMoving(false);
        } else {
          x += (tdx / d) * SPEED * dt;
          y += (tdy / d) * SPEED * dt;
          setFacing(tdx < 0 ? -1 : 1);
          setMoving(true);
        }
      } else {
        setMoving(false);
      }

      x = clamp(x, BOUNDS.minX, BOUNDS.maxX);
      y = clamp(y, BOUNDS.minY, BOUNDS.maxY);

      if (x !== posRef.current.x || y !== posRef.current.y) {
        posRef.current = { x, y };
        setPos({ x, y });
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

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafRef.current);
      lastTsRef.current = 0;
    };
  }, [enabled]);

  return {
    pos,
    facing,
    moving,
    nearbyId,
    visited,
    walkTo,
    walkToStation,
    setPad,
    bounds: BOUNDS,
  };
}
