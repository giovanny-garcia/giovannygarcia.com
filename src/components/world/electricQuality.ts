export interface ElectricQuality {
  /** Fractal octaves. The original crackle uses 10. */
  octaves: number;
  /** Pixels between stroke samples. The original crackle uses 2. */
  samplePx: number;
  dprCap: number;
  glowBlur: number;
}

/** Index 0 is the lightest stroke. The last tier matches the original effect. */
const TIERS: ElectricQuality[] = [
  { octaves: 4, samplePx: 8, dprCap: 1, glowBlur: 16 },
  { octaves: 6, samplePx: 4, dprCap: 1, glowBlur: 22 },
  { octaves: 8, samplePx: 3, dprCap: 1.5, glowBlur: 28 },
  { octaves: 10, samplePx: 2, dprCap: 2, glowBlur: 32 },
];

const COST_DOWN_MS = 8;
const SAMPLE_WINDOW = 24;
const COOLDOWN_MS = 1200;

let tier = -1;
let ceiling = 0;
let snapshot: ElectricQuality = TIERS[0];
let cooldownUntil = 0;
let bucketAt = 0;
let bucketCost = 0;
const samples: number[] = [];
const listeners = new Set<() => void>();

function deviceMemoryGb() {
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  return typeof memory === "number" ? memory : 8;
}

function saveDataOn() {
  const connection = (
    navigator as Navigator & { connection?: { saveData?: boolean } }
  ).connection;
  return connection?.saveData === true;
}

/** Highest tier this machine should attempt. Runtime can only go lower. */
function specTier() {
  const cores = navigator.hardwareConcurrency || 4;
  const memory = deviceMemoryGb();
  const mobile =
    window.matchMedia("(pointer: coarse)").matches &&
    window.matchMedia("(hover: none)").matches;

  let next = 1;
  if (cores >= 8 && memory >= 8 && !mobile) next = 3;
  else if (cores >= 4 && memory >= 4 && !mobile) next = 2;
  else if (mobile && cores >= 8 && memory >= 6) next = 1;
  else next = 0;

  if (memory <= 2 || saveDataOn()) next = 0;
  return next;
}

function ensureTier() {
  if (tier >= 0) return;
  ceiling = specTier();
  tier = ceiling;
  snapshot = TIERS[tier];
}

function setTier(next: number) {
  const clamped = Math.max(0, Math.min(ceiling, next));
  if (clamped === tier) return;
  tier = clamped;
  snapshot = TIERS[tier];
  samples.length = 0;
  bucketAt = 0;
  bucketCost = 0;
  cooldownUntil = performance.now() + COOLDOWN_MS;
  listeners.forEach((listener) => listener());
}

export function getElectricQuality() {
  ensureTier();
  return snapshot;
}

export function subscribeElectricQuality(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * Combined cost of every crackle drawn in one frame.
 * A sustained overrun lowers the shared tier for the rest of the visit.
 */
export function noteElectricDraw(now: number, costMs: number) {
  ensureTier();
  if (costMs <= 0 || costMs > 50) return;
  if (performance.now() < cooldownUntil) return;

  // Group every crackle from the same turn, even if the first one ran long.
  if (bucketAt === 0 || now - bucketAt > 20) {
    if (bucketAt !== 0) samples.push(bucketCost);
    bucketAt = now;
    bucketCost = costMs;
  } else {
    bucketCost += costMs;
  }

  if (samples.length < SAMPLE_WINDOW) return;
  const average = samples.reduce((sum, sample) => sum + sample, 0) / samples.length;
  samples.length = 0;
  if (average > COST_DOWN_MS && tier > 0) {
    ceiling = tier - 1;
    setTier(tier - 1);
  }
}
