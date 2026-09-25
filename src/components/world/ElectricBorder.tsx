import {
  useEffect,
  useRef,
  useSyncExternalStore,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  getElectricQuality,
  noteElectricDraw,
  subscribeElectricQuality,
} from "./electricQuality";

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
  const quality = useSyncExternalStore(
    subscribeElectricQuality,
    getElectricQuality,
    getElectricQuality,
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const root = rootRef.current;
    if (!canvas || !root) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lacunarity = 1.6;
    const gain = 0.7;
    const { octaves, samplePx } = quality;
    const dpr = Math.min(window.devicePixelRatio || 1, quality.dprCap);
    let width = 0;
    let height = 0;
    let raf = 0;
    let time = 0;
    let last = 0;

    const animating = () => active && !reduce && !document.hidden;

    const resize = () => {
      const rect = root.getBoundingClientRect();
      width = rect.width + 120;
      height = rect.height + 120;
      canvas.width = Math.max(1, width * dpr);
      canvas.height = Math.max(1, height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };

    const draw = (now: number, advance: boolean) => {
      const dt = last === 0 ? 0 : (now - last) / 1000;
      last = now;
      if (advance && animating()) time += dt * speed;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale(dpr, dpr);
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      const boxW = width - 120;
      const boxH = height - 120;
      if (boxW > 2 && boxH > 2) {
        const radius = Math.min(borderRadius, Math.min(boxW, boxH) / 2);
        const perimeter = 2 * (boxW + boxH) + 2 * Math.PI * radius;
        const steps = Math.max(1, Math.floor(perimeter / samplePx));
        ctx.beginPath();
        for (let i = 0; i <= steps; i++) {
          const t = i / steps;
          const point = pointOnRoundedRect(t, 60, 60, boxW, boxH, radius);
          const dx = fractal(t * 8, octaves, lacunarity, gain, chaos, 10, time, 0, 0);
          const dy = fractal(t * 8, octaves, lacunarity, gain, chaos, 10, time, 1, 0);
          const x = point.x + dx * 60;
          const y = point.y + dy * 60;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
      }
    };

    const frame = (now: number) => {
      if (!animating()) return;
      const started = performance.now();
      draw(now, true);
      noteElectricDraw(now, performance.now() - started);
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      cancelAnimationFrame(raf);
      if (!animating()) {
        if (!document.hidden) draw(performance.now(), false);
        return;
      }
      last = 0;
      raf = requestAnimationFrame(frame);
    };

    const onVis = () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else start();
    };

    resize();
    const observer = new ResizeObserver(() => {
      resize();
      if (!document.hidden) draw(performance.now(), false);
    });
    observer.observe(root);
    document.addEventListener("visibilitychange", onVis);
    start();

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [active, borderRadius, chaos, color, quality, speed]);

  return (
    <div
      ref={rootRef}
      className={`electric-border ${className ?? ""}`}
      style={
        {
          "--electric-border-color": color,
          "--eb-radius": `${borderRadius}px`,
          "--eb-glow": `${quality.glowBlur}px`,
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

function pointOnArc(
  cx: number,
  cy: number,
  radius: number,
  start: number,
  sweep: number,
  t: number,
) {
  const angle = start + t * sweep;
  return { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
}

function pointOnRoundedRect(
  t: number,
  left: number,
  top: number,
  width: number,
  height: number,
  radius: number,
) {
  const straightW = width - 2 * radius;
  const straightH = height - 2 * radius;
  const corner = (Math.PI * radius) / 2;
  const dist = t * (2 * straightW + 2 * straightH + 4 * corner);
  let cursor = 0;

  if (dist <= cursor + straightW) {
    const u = straightW === 0 ? 0 : (dist - cursor) / straightW;
    return { x: left + radius + u * straightW, y: top };
  }
  cursor += straightW;
  if (dist <= cursor + corner) {
    return pointOnArc(
      left + width - radius,
      top + radius,
      radius,
      -Math.PI / 2,
      Math.PI / 2,
      corner === 0 ? 0 : (dist - cursor) / corner,
    );
  }
  cursor += corner;
  if (dist <= cursor + straightH) {
    const u = straightH === 0 ? 0 : (dist - cursor) / straightH;
    return { x: left + width, y: top + radius + u * straightH };
  }
  cursor += straightH;
  if (dist <= cursor + corner) {
    return pointOnArc(
      left + width - radius,
      top + height - radius,
      radius,
      0,
      Math.PI / 2,
      corner === 0 ? 0 : (dist - cursor) / corner,
    );
  }
  cursor += corner;
  if (dist <= cursor + straightW) {
    const u = straightW === 0 ? 0 : (dist - cursor) / straightW;
    return { x: left + width - radius - u * straightW, y: top + height };
  }
  cursor += straightW;
  if (dist <= cursor + corner) {
    return pointOnArc(
      left + radius,
      top + height - radius,
      radius,
      Math.PI / 2,
      Math.PI / 2,
      corner === 0 ? 0 : (dist - cursor) / corner,
    );
  }
  cursor += corner;
  if (dist <= cursor + straightH) {
    const u = straightH === 0 ? 0 : (dist - cursor) / straightH;
    return { x: left, y: top + height - radius - u * straightH };
  }
  cursor += straightH;
  return pointOnArc(
    left + radius,
    top + radius,
    radius,
    Math.PI,
    Math.PI / 2,
    corner === 0 ? 0 : (dist - cursor) / corner,
  );
}
