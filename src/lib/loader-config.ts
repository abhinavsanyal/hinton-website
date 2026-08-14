export interface LoaderConfig {
  /** Frames advanced per second at rate 1.0. Source is 24. */
  baseFps: number;
  /** Global speed multiplier. 2.0 = twice as fast. */
  playbackRate: number;
  /** 'progress' = frame index is driven by real load %.
   *  'time'     = plays straight through, ignores load state (for previewing). */
  mode: "progress" | "time";
  /** Frame index the loader may not advance past until real loading hits 100%.
   *  Keeps the light sweep + settle as the *reward* for completion. */
  gateFrame: number;
  /** Minimum ms the loader stays up even on a warm cache. Prevents an ugly flash. */
  minDurationMs: number;
  /** Hard ceiling. If real loading hasn't finished by now, exit anyway. */
  maxDurationMs: number;
  /** How aggressively displayed progress chases real progress. 0..1 per frame. */
  progressEase: number;
  /** Idle creep: fraction of remaining gap to close per second when the real
   *  number is stalled, so the logo never appears frozen. */
  idleCreepPerSec: number;
  /** Repeat visits config */
  sessionStorageKey: string;
  exit: {
    durationMs: number;
    /** Seam angle in degrees. 0 = horizontal, 45 = the diagonal I want. */
    angleDeg: number;
    /** How far each half travels, as a fraction of viewport diagonal. */
    travel: number;
    blurPx: number;
    easing: string; // CSS easing
  };
}

export const loaderConfig: LoaderConfig = {
  baseFps: 120,
  playbackRate: 2.0,
  mode: "progress",
  gateFrame: 104,
  minDurationMs: 10,
  maxDurationMs: 1000,
  progressEase: 0.8,
  idleCreepPerSec: 0.12,
  sessionStorageKey: "hinton_loader_played",
  exit: {
    durationMs: 150,
    angleDeg: 45,
    travel: 1.1,
    blurPx: 24,
    easing: "cubic-bezier(0.7, 0, 0.2, 1)",
  },
};
