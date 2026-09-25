"""90 s score from three Lyria 3 cues (instrumental). Edit points sit on hits or under SFX impacts.
main  = score_main.mp3      (vintage → celebration → dark → drop → anthem)
cel   = score_celebration.mp3 (124 BPM masala celebration, starts at full energy)
anth  = score_anthem.mp3    (hybrid anthem that opens on a big impact)"""
import os, subprocess, numpy as np, soundfile as sf
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SR = 48000
def load(name, tempo=None, a=None, b=None):
    af = []
    if a is not None: af.append(f"atrim={a}:{b},asetpts=N/SR/TB")
    if tempo: af.append(f"rubberband=tempo={tempo}:pitchq=quality")
    cmd = ["ffmpeg", "-v", "error", "-i", os.path.join(ROOT, "audio/sources", name), "-ac", "2", "-ar", str(SR)]
    if af: cmd += ["-af", ",".join(af)]
    cmd += ["-f", "f32le", "-"]
    return np.frombuffer(subprocess.run(cmd, capture_output=True, check=True).stdout, dtype=np.float32).reshape(-1, 2).astype(float)
TOTAL = 90.0
buf = np.zeros((int(TOTAL * SR) + SR, 2))
def put(sig, t, fade_in=0.01, fade_out=0.02, gain=1.0):
    s = sig.copy(); n1, n2 = int(fade_in * SR), int(fade_out * SR)
    if n1: s[:n1] *= np.linspace(0, 1, n1)[:, None]
    if n2: s[-n2:] *= np.linspace(1, 0, n2)[:, None]
    i = int(t * SR); n = min(len(s), len(buf) - i); buf[i:i + n] += s[:n] * gain
# 1. vintage 0–14.4 stretched to 16.9 s (pitch preserved)
put(load("score_main.mp3", tempo=14.4 / 16.9, a=0, b=14.4), 0.0, 0.0, 0.03)
# 2. build + celebration: main 14.4–21.0 → 16.9–23.5 (hit at 17.5)
put(load("score_main.mp3", a=14.4, b=21.0), 16.9, 0.03, 0.06)
# 3. star wall / queue / whistle / wept / coins: celebration cue 0–15.4 → 23.5–38.9
cel = load("score_celebration.mp3", a=0, b=15.4)
t = np.arange(len(cel)) / SR + 23.5
dip = np.ones(len(cel)); m = (t > 33.4) & (t < 35.0)          # breathe under "wept"
dip[m] = 1 - 0.55 * np.sin(np.pi * (t[m] - 33.4) / 1.6)
put(cel * dip[:, None], 23.5, 0.02, 0.25)
# 4. dark turn: main 22.2–32.3 → 38.63–48.73 (hits land at 38.9 and 46.43)
put(load("score_main.mp3", a=22.2, b=32.3), 38.63, 0.02, 0.05)
# 5. drop + anthem: main 36.45–58.5 → 48.73–70.78
put(load("score_main.mp3", a=36.45, b=58.5), 48.73, 0.02, 0.35)
# 6. anthem cue from its opening impact: 0–7.0 → 71.5–78.5, stop-down before "Are you?"
put(load("score_anthem.mp3", a=0, b=7.0), 71.5, 0.005, 0.35)
# 7. finale: anthem 21.0–end → 80.5–90 (natural ring-out)
fin = load("score_anthem.mp3", a=21.0, b=30.7)
put(fin, 80.5, 0.005, 0.4)
out = buf[: int(TOTAL * SR)]
out /= max(1.0, np.abs(out).max() / 0.98)
sf.write(os.path.join(ROOT, "audio/score.wav"), out, SR)
print("score", len(out) / SR, "peak", np.abs(out).max())
