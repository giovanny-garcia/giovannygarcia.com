import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { noteElectricDraw } from "./electricPerformance";

/** Original crackle. Frame measurements do not change these. */
const OCTAVES = 10;
const SAMPLE_PX = 2;
const DPR_CAP = 2;
const GLOW_BLUR_PX = 32;

interface ElectricBorderProps {
  children: ReactNode;
  color?: string;
  speed?: number;
  chaos?: number;
  borderRadius?: number;
  className?: string;
  style?: CSSProperties;
  contentClassName?: string;
  contentStyle?: CSSProperties;
  /** When false, draw one still frame and skip the animation loop. */
  active?: boolean;
}

type BorderTicker = (now: number) => void;

const tickers = new Set<BorderTicker>();
let sharedRaf = 0;

function sharedFrame(now: number) {
  sharedRaf = 0;
  for (const tick of tickers) tick(now);
  if (tickers.size > 0) sharedRaf = requestAnimationFrame(sharedFrame);
}

function registerTicker(tick: BorderTicker) {
  tickers.add(tick);
  if (!sharedRaf) sharedRaf = requestAnimationFrame(sharedFrame);
}

function unregisterTicker(tick: BorderTicker) {
  tickers.delete(tick);
  if (tickers.size === 0 && sharedRaf) {
    cancelAnimationFrame(sharedRaf);
    sharedRaf = 0;
  }
}

/** Same crackling edge used on the Growth card at petalgear.com. */
export default function ElectricBorder({
  children,
  color = "#00e5ff",
  speed = 1,
  chaos = 0.12,
  borderRadius = 16,
  className,
  style,
  contentClassName,
  contentStyle,
  active = true,
}: ElectricBorderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const root = rootRef.current;
    if (!canvas || !root) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lacunarity = 1.6;
    const gain = 0.7;
    const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
    let width = 0;
    let height = 0;
    let time = 0;
    let last = 0;
    let onScreen = true;
    let registered = false;

    /** Base rounded-rect samples; rebuilt only on resize. */
    let baseX = new Float32Array(0);
    let baseY = new Float32Array(0);
    let sampleT = new Float32Array(0);
    let sampleCount = 0;

    const wantsLoop = () => active && onScreen && !reduce && !document.hidden;

    const rebuildPath = () => {
      const boxW = width - 120;
      const boxH = height - 120;
      if (boxW <= 2 || boxH <= 2) {
        sampleCount = 0;
        return;
      }
      const radius = Math.min(borderRadius, Math.min(boxW, boxH) / 2);
      const perimeter = 2 * (boxW + boxH) + 2 * Math.PI * radius;
      const steps = Math.max(1, Math.floor(perimeter / SAMPLE_PX));
      sampleCount = steps + 1;
      if (baseX.length < sampleCount) {
        baseX = new Float32Array(sampleCount);
        baseY = new Float32Array(sampleCount);
        sampleT = new Float32Array(sampleCount);
      }
      for (let i = 0; i < sampleCount; i++) {
        const t = i / steps;
        sampleT[i] = t;
        pointOnRoundedRectInto(t, 60, 60, boxW, boxH, radius, i, baseX, baseY);
      }
    };

    const resize = () => {
      const rect = root.getBoundingClientRect();
      width = rect.width + 120;
      height = rect.height + 120;
      canvas.width = Math.max(1, width * dpr);
      canvas.height = Math.max(1, height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      rebuildPath();
    };

    const draw = (now: number, advance: boolean) => {
      const dt = last === 0 ? 0 : (now - last) / 1000;
      last = now;
      if (advance && wantsLoop()) time += dt * speed;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale(dpr, dpr);
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      if (sampleCount < 2) return;

      ctx.beginPath();
      for (let i = 0; i < sampleCount; i++) {
        const t = sampleT[i];
        const dx = fractal(t * 8, OCTAVES, lacunarity, gain, chaos, 10, time, 0, 0);
        const dy = fractal(t * 8, OCTAVES, lacunarity, gain, chaos, 10, time, 1, 0);
        const x = baseX[i] + dx * 60;
        const y = baseY[i] + dy * 60;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    };

    const tick: BorderTicker = (now) => {
      if (!wantsLoop()) {
        syncRegistration();
        return;
      }
      const started = performance.now();
      draw(now, true);
      noteElectricDraw(now, performance.now() - started);
    };

    const syncRegistration = () => {
      if (wantsLoop()) {
        if (!registered) {
          registered = true;
          last = 0;
          registerTicker(tick);
        }
      } else if (registered) {
        registered = false;
        unregisterTicker(tick);
      }
    };

    const start = () => {
      syncRegistration();
      if (!wantsLoop() && !document.hidden && onScreen) {
        draw(performance.now(), false);
      }
    };

    const onVis = () => {
      if (document.hidden) {
        if (registered) {
          registered = false;
          unregisterTicker(tick);
        }
      } else {
        start();
      }
    };

    resize();
    const resizeObserver = new ResizeObserver(() => {
      resize();
      if (!document.hidden && onScreen) draw(performance.now(), false);
    });
    resizeObserver.observe(root);

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        onScreen = entry?.isIntersecting ?? false;
        if (onScreen) start();
        else {
          if (registered) {
            registered = false;
            unregisterTicker(tick);
          }
          if (!document.hidden) draw(performance.now(), false);
        }
      },
      { threshold: 0 },
    );
    intersectionObserver.observe(root);

    document.addEventListener("visibilitychange", onVis);
    start();

    return () => {
      if (registered) unregisterTicker(tick);
      registered = false;
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [active, borderRadius, chaos, color, speed]);

  return (
    <div
      ref={rootRef}
      className={`electric-border ${className ?? ""}`}
      style={
        {
          "--electric-border-color": color,
          "--eb-radius": `${borderRadius}px`,
          "--eb-glow": `${GLOW_BLUR_PX}px`,
          borderRadius: "var(--eb-radius)",
          ...style,
        } as CSSProperties
      }
    >
      <div className="eb-canvas-container" aria-hidden>
        <canvas ref={canvasRef} className="eb-canvas" />
      </div>
      <div className="eb-layers" aria-hidden>
        <div className="eb-glow-1" />
        <div className="eb-glow-2" />
        <div className="eb-background-glow" />
      </div>
      <div
        className={`eb-content ${contentClassName ?? ""}`}
        style={contentStyle}
      >
        {children}
      </div>
    </div>
  );
}

function hash(n: number) {
  return (Math.sin(n * 12.9898) * 43758.5453) % 1;
}

function valueNoise(x: number, y: number) {
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const fx = x - x0;
  const fy = y - y0;
  const v00 = hash(x0 + y0 * 57);
  const v10 = hash(x0 + 1 + y0 * 57);
  const v01 = hash(x0 + (y0 + 1) * 57);
  const v11 = hash(x0 + 1 + (y0 + 1) * 57);
  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);
  return (
    v00 * (1 - ux) * (1 - uy) +
    v10 * ux * (1 - uy) +
    v01 * (1 - ux) * uy +
    v11 * ux * uy
  );
}

function fractal(
  x: number,
  octaves: number,
  lacunarity: number,
  gain: number,
  amplitude: number,
  frequency: number,
  time: number,
  seed: number,
  firstOctaveScale: number,
) {
  let sum = 0;
  let amp = amplitude;
  let freq = frequency;
  for (let i = 0; i < octaves; i++) {
    const scale = i === 0 ? amp * firstOctaveScale : amp;
    sum += scale * valueNoise(freq * x + seed * 100, time * freq * 0.3);
    freq *= lacunarity;
    amp *= gain;
  }
  return sum;
}

function pointOnArcInto(
  cx: number,
  cy: number,
  radius: number,
  start: number,
  sweep: number,
  t: number,
  index: number,
  outX: Float32Array,
  outY: Float32Array,
) {
  const angle = start + t * sweep;
  outX[index] = cx + radius * Math.cos(angle);
  outY[index] = cy + radius * Math.sin(angle);
}

function pointOnRoundedRectInto(
  t: number,
  left: number,
  top: number,
  width: number,
  height: number,
  radius: number,
  index: number,
  outX: Float32Array,
  outY: Float32Array,
) {
  const straightW = width - 2 * radius;
  const straightH = height - 2 * radius;
  const corner = (Math.PI * radius) / 2;
  const dist = t * (2 * straightW + 2 * straightH + 4 * corner);
  let cursor = 0;

  if (dist <= cursor + straightW) {
    const u = straightW === 0 ? 0 : (dist - cursor) / straightW;
    outX[index] = left + radius + u * straightW;
    outY[index] = top;
    return;
  }
  cursor += straightW;
  if (dist <= cursor + corner) {
    pointOnArcInto(
      left + width - radius,
      top + radius,
      radius,
      -Math.PI / 2,
      Math.PI / 2,
      corner === 0 ? 0 : (dist - cursor) / corner,
      index,
      outX,
      outY,
    );
    return;
  }
  cursor += corner;
  if (dist <= cursor + straightH) {
    const u = straightH === 0 ? 0 : (dist - cursor) / straightH;
    outX[index] = left + width;
    outY[index] = top + radius + u * straightH;
    return;
  }
  cursor += straightH;
  if (dist <= cursor + corner) {
    pointOnArcInto(
      left + width - radius,
      top + height - radius,
      radius,
      0,
      Math.PI / 2,
      corner === 0 ? 0 : (dist - cursor) / corner,
      index,
      outX,
      outY,
    );
    return;
  }
  cursor += corner;
  if (dist <= cursor + straightW) {
    const u = straightW === 0 ? 0 : (dist - cursor) / straightW;
    outX[index] = left + width - radius - u * straightW;
    outY[index] = top + height;
    return;
  }
  cursor += straightW;
  if (dist <= cursor + corner) {
    pointOnArcInto(
      left + radius,
      top + height - radius,
      radius,
      Math.PI / 2,
      Math.PI / 2,
      corner === 0 ? 0 : (dist - cursor) / corner,
      index,
      outX,
      outY,
    );
    return;
  }
  cursor += corner;
  if (dist <= cursor + straightH) {
    const u = straightH === 0 ? 0 : (dist - cursor) / straightH;
    outX[index] = left;
    outY[index] = top + height - radius - u * straightH;
    return;
  }
  cursor += straightH;
  pointOnArcInto(
    left + radius,
    top + radius,
    radius,
    Math.PI,
    Math.PI / 2,
    corner === 0 ? 0 : (dist - cursor) / corner,
    index,
    outX,
    outY,
  );
}
