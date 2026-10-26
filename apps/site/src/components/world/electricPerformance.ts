/**
 * Observes the crackle. These numbers never change how it is drawn.
 * A fixed window keeps one sample per frame: combined draw time, and the
 * gap since the previous frame. Medians are computed when the stats are read.
 */

const WINDOW = 120;
const MIN_SAMPLES = 20;
/** Longer than this is a tab wake, not a frame. */
const WAKE_GAP_MS = 250;

const drawSamples = new Float64Array(WINDOW);
const gapSamples = new Float64Array(WINDOW);
let drawWrite = 0;
let gapWrite = 0;
let drawCount = 0;
let gapCount = 0;
let bucketAt = -1;
let bucketCost = 0;
let previousFrameAt = -1;
let framesNoted = 0;

export interface ElectricFrameStats {
  samples: number;
  /** Median milliseconds between animation frames. */
  frameMs: number;
  /** Median milliseconds spent drawing every crackle in one frame. */
  drawMs: number;
}

function remember(buffer: Float64Array, write: number, count: number, value: number) {
  buffer[write] = value;
  return {
    write: (write + 1) % buffer.length,
    count: count < buffer.length ? count + 1 : buffer.length,
  };
}

function medianOf(buffer: Float64Array, write: number, count: number) {
  const values: number[] = [];
  const start = (write - count + buffer.length) % buffer.length;
  for (let i = 0; i < count; i++) values.push(buffer[(start + i) % buffer.length]);
  values.sort((a, b) => a - b);
  const mid = Math.floor(count / 2);
  if (count % 2 === 0) return (values[mid - 1] + values[mid]) / 2;
  return values[mid];
}

export function getElectricFrameStats(): ElectricFrameStats | null {
  if (drawCount < MIN_SAMPLES) return null;
  return {
    samples: drawCount,
    frameMs: gapCount >= MIN_SAMPLES / 2 ? medianOf(gapSamples, gapWrite, gapCount) : 0,
    drawMs: medianOf(drawSamples, drawWrite, drawCount),
  };
}

/** One User Timing entry per window, so a profiler can see the medians. */
function publishDevMeasure(now: number) {
  if (!import.meta.env.DEV || framesNoted % WINDOW !== 0) return;
  const stats = getElectricFrameStats();
  if (!stats || !(stats.frameMs > 0) || !(stats.drawMs > 0) || now < stats.frameMs) return;
  performance.measure("electric-frame", {
    start: now - stats.frameMs,
    duration: stats.frameMs,
  });
  performance.measure("electric-draw", {
    start: now - stats.drawMs,
    duration: stats.drawMs,
  });
}

/**
 * Combined cost of every crackle drawn in one animation frame.
 * Borders that share a frame timestamp are summed.
 */
export function noteElectricDraw(now: number, costMs: number) {
  if (!(costMs > 0) || !Number.isFinite(costMs) || !Number.isFinite(now)) return;

  if (bucketAt === now) {
    bucketCost += costMs;
    return;
  }

  if (bucketAt >= 0) {
    const draw = remember(drawSamples, drawWrite, drawCount, bucketCost);
    drawWrite = draw.write;
    drawCount = draw.count;
    if (previousFrameAt >= 0) {
      const gap = bucketAt - previousFrameAt;
      if (gap > 0 && gap < WAKE_GAP_MS) {
        const gapSample = remember(gapSamples, gapWrite, gapCount, gap);
        gapWrite = gapSample.write;
        gapCount = gapSample.count;
      }
    }
    previousFrameAt = bucketAt;
    framesNoted += 1;
    publishDevMeasure(now);
  }

  bucketAt = now;
  bucketCost = costMs;
}
