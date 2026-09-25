"""90 s score, v3: long continuous passes from the three Lyria cues, no time-stretching.
Joins happen only on hits or in silence; each pass keeps its own musical phrasing."""
import os, subprocess, numpy as np, soundfile as sf
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SR = 48000
def load(name, a, b):
    cmd = ["ffmpeg", "-v", "error", "-i", os.path.join(ROOT, "audio/sources", name), "-ac", "2", "-ar", str(SR),
           "-af", f"atrim={a}:{b},asetpts=N/SR/TB", "-f", "f32le", "-"]
    return np.frombuffer(subprocess.run(cmd, capture_output=True, check=True).stdout, dtype=np.float32).reshape(-1, 2).astype(float)
TOTAL = 90.0
buf = np.zeros((int(TOTAL * SR) + SR, 2))
def put(sig, t, fade_in=0.01, fade_out=0.02, gain=1.0, curve=None):
    s = sig.copy(); n1, n2 = int(fade_in * SR), int(fade_out * SR)
    if n1: s[:n1] *= (np.sin(np.linspace(0, np.pi / 2, n1)) ** 2)[:, None]
    if n2: s[-n2:] *= (np.cos(np.linspace(0, np.pi / 2, n2)) ** 2)[:, None]
    if curve is not None: s *= curve[: len(s), None]
    i = int(t * SR); n = min(len(s), len(buf) - i); buf[i:i + n] += s[:n] * gain
# 1. vintage → hero entrance → celebration, one continuous pass: main 0–21.3 at 2.5 (its hit lands at 17.5)
put(load("score_main.mp3", 0, 21.3), 2.5, 1.2, 0.6)
# 2. star wall → queue → whistle → wept → coins: celebration cue 0–15.25 at 23.5, breathing under "wept"
cel = load("score_celebration.mp3", 0, 15.25)
t = np.arange(len(cel)) / SR + 23.5
curve = np.ones(len(cel)); m = (t > 33.3) & (t < 35.1)
curve[m] = 1 - 0.5 * np.sin(np.pi * (t[m] - 33.3) / 1.8) ** 2
put(cel, 23.5, 0.02, 0.5, curve=curve)
# 3. dark turn → Until now → drop → anthem: main 22.2–32.3 at 38.63, then 36.45–59.3 at 48.73 (both joins in silence)
put(load("score_main.mp3", 22.2, 32.3), 38.63, 0.05, 0.08)
put(load("score_main.mp3", 36.45, 59.3), 48.73, 0.08, 0.4)
# 4. "Create with AI": anthem cue from its opening impact, released before "Are you?"
put(load("score_anthem.mp3", 0, 7.0), 71.5, 0.005, 0.9)
# 5. logo finale: the same anthem cue's closing phrase and natural ring-out, entering under the finale impact
put(load("score_anthem.mp3", 21.27, 30.77), 80.5, 0.15, 0.5)
out = buf[: int(TOTAL * SR)]
out /= max(1.0, np.abs(out).max() / 0.95)
sf.write(os.path.join(ROOT, "audio/score.wav"), out, SR, subtype="PCM_24")
print("score v3", len(out) / SR)
