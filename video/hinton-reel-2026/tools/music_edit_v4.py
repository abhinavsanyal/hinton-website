"""Score v4 (83.6 s): music-first, bar-locked edit of the Lyria cues.

Every join sits on a downbeat found by beat tracking (librosa, 129.2 BPM main cue / 123 BPM celebration cue)
and uses an equal-power crossfade. Section entrances are led in by reverse-reverb swells built from the
incoming music itself, and the finale's tail is a paulstretched bloom of the anthem's final chord, so
nothing starts or stops abruptly.

main  = score_main.mp3         bars every 1.875 s; downbeats …15.13 (colour hit) 22.62 (dark) 30.12 37.62 (drop) … 58.24 (final chord)
cel   = score_celebration.mp3  downbeat 11.75 → natural ending at 27.4
"""
import os, subprocess, numpy as np, soundfile as sf
from scipy.signal import butter, sosfiltfilt, fftconvolve

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SR = 48000
TOTAL = 83.6
rng = np.random.default_rng(2026)


def load(name, a=None, b=None):
    af = f"atrim={a}:{b},asetpts=N/SR/TB" if a is not None else "anull"
    cmd = ["ffmpeg", "-nostdin", "-v", "error", "-i", os.path.join(ROOT, "audio/sources", name), "-ac", "2", "-ar", str(SR), "-af", af, "-f", "f32le", "-"]
    return np.frombuffer(subprocess.run(cmd, capture_output=True, check=True).stdout, dtype=np.float32).reshape(-1, 2).astype(float)


def ir(rt60=2.4, pre=0.02):
    """Synthetic stereo hall impulse response with frequency-dependent decay."""
    n = int((rt60 * 1.1 + pre) * SR)
    t = np.arange(n) / SR
    out = np.zeros((n, 2))
    for lo, hi, k in [(40, 400, 1.0), (400, 2500, 0.8), (2500, 12000, 0.45)]:
        for ch in range(2):
            nz = rng.standard_normal(n)
            nz = sosfiltfilt(butter(2, [lo, hi], btype="band", fs=SR, output="sos"), nz)
            out[:, ch] += nz * np.exp(-6.9 * np.maximum(0, t - pre) / (rt60 * k)) * (t >= pre)
    return out / np.sqrt(np.sum(out ** 2) / 2)          # unit energy per channel


HALL = ir(2.6)


def reverb(x, wet=1.0, irx=HALL):
    y = np.stack([fftconvolve(x[:, c], irx[:, c])[: len(x) + len(irx)] for c in range(2)], 1)
    return y * wet


def reverse_swell(src, hit_time, length=0.9, grab=0.35, gain=0.35):
    """Reverse-reverb swell that rises into `hit_time` from the first `grab` s of the incoming audio."""
    g = src[: int(grab * SR)].copy()
    g[-int(0.05 * SR):] *= np.linspace(1, 0, int(0.05 * SR))[:, None]
    tail = reverb(np.vstack([g, np.zeros((int(3 * SR), 2))]))
    rev = tail[::-1]
    rev = rev[-int(length * SR):]
    env = np.linspace(0, 1, len(rev)) ** 2.2
    return rev * env[:, None] / (np.abs(rev).max() + 1e-9) * gain, hit_time - length


def paulstretch(x, dur=7.0, win=0.25):
    """Paul's extreme time-stretch (random-phase STFT overlap-add): smears `x` into a `dur`-second sustained bloom."""
    W = int(win * SR) // 2 * 2
    window = np.hanning(W)
    hop_out = W // 4
    frames = int(dur * SR / hop_out)
    span = max(1, len(x) - W)
    out = np.zeros((frames * hop_out + W, 2))
    for k in range(frames):
        i = int(k * span / frames)
        for c in range(2):
            spec = np.abs(np.fft.rfft(x[i:i + W, c] * window))
            ph = rng.uniform(0, 2 * np.pi, len(spec))
            out[k * hop_out:k * hop_out + W, c] += np.fft.irfft(spec * np.exp(1j * ph)) * window
    return out / (np.abs(out).max() + 1e-9)


buf = np.zeros((int(TOTAL * SR) + 8 * SR, 2))


def put(sig, t, fade_in=0.0, fade_out=0.0, gain=1.0):
    s = sig.copy()
    n1, n2 = int(fade_in * SR), int(fade_out * SR)
    if n1: s[:n1] *= (np.sin(np.linspace(0, np.pi / 2, n1)) ** 2)[:, None]
    if n2: s[-n2:] *= (np.cos(np.linspace(0, np.pi / 2, n2)) ** 2)[:, None]
    i = int(round(t * SR))
    buf[i:i + len(s)] += s * gain


XF = 0.06   # equal-power crossfade at bar seams

# 1 · Silence → sound → languages → colour hit → "into gods": main 0–21.1 at +2.5 s (colour downbeat 15.13 → 17.63).
#     The main cue's own celebration winds down after 21.0; it is released under the celebration cue's entrance.
p1 = load("score_main.mp3", 0, 21.12)
put(p1, 2.5, 1.4, 0.36)

# 2 · Dialogue wall → queue → whistle → wept → coins → headlines: celebration cue from its downbeat 11.75 at 23.26
#     (a main-cue downbeat), so its own ending lands on the dark turn at 38.9.
cel = load("score_celebration.mp3", 11.75, 27.4)
t = np.arange(len(cel)) / SR + 23.26
breathe = np.ones(len(cel)); m = (t > 33.35) & (t < 35.05)
breathe[m] = 1 - 0.45 * np.sin(np.pi * (t[m] - 33.35) / 1.7) ** 2          # the music inhales under "wept"
put(cel * breathe[:, None], 23.26 - XF / 2, XF, 0.0)
sw, st = reverse_swell(cel, 23.26, length=1.1, gain=0.3); put(sw, st)

# 3 · Dark turn: main 22.2–32.3 with its hits at 38.9 (22.62) and 46.40 (30.12); then the drop pass.
dark = load("score_main.mp3", 22.2, 32.3)
put(dark, 38.9 - (22.62 - 22.2), 0.12, 0.25)
sw, st = reverse_swell(load("score_main.mp3", 22.62, 23.2), 38.9, length=1.3, gain=0.22); put(sw, st)

# 3b · the original cue goes almost silent under "For every film… a thousand never did" (≈ −60 dB for 4 s):
#      a low drone grown from the dark sting keeps the tension alive and dissolves into the second hit.
drone = paulstretch(load("score_main.mp3", 22.62, 23.4), dur=6.0, win=0.4)
drone = np.stack([sosfiltfilt(butter(2, 1400, btype="low", fs=SR, output="sos"), drone[:, c]) for c in range(2)], 1)
nd = len(drone); td = np.arange(nd) / SR
drone *= (np.minimum(1, td / 1.6) * np.clip((nd / SR - td) / 0.9, 0, 1))[:, None]
put(drone, 40.4, 0, 0, 0.15)

# 4 · Build → drop (37.62 → 49.88) → anthem, extended by one seamless 3-bar jump (50.74 → 45.12, timbre match 0.92)
off_a = 49.88 - 37.62
a1 = load("score_main.mp3", 36.45, 50.74 + XF / 2)
put(a1, 36.45 + off_a, 0.3, XF)
off_b = (50.74 + off_a) - 45.12                                           # 45.12 plays right after 50.74
a2 = load("score_main.mp3", 45.12 - XF / 2, 60.2)
seg_start = 45.12 - XF / 2 + off_b
# "Are you?" — the last bar before the final chord dips (low-pass + level), then the final chord lands in full
t2 = np.arange(len(a2)) / SR + seg_start
lp = np.stack([sosfiltfilt(butter(2, 700, btype="low", fs=SR, output="sos"), a2[:, c]) for c in range(2)], 1)
final_hit = 58.24 + off_b                                                  # = 76.11
mix_lp = np.clip((t2 - (final_hit - 1.95)) / 0.9, 0, 1) * (t2 < final_hit - 0.02)
gain = 1 - 0.72 * mix_lp
a2 = (a2 * (1 - mix_lp)[:, None] + lp * mix_lp[:, None] * 0.55) * gain[:, None]
put(a2, seg_start, XF, 1.6)

# 5 · Finale bloom: the final chord, paulstretched into a slow sustain that swells under the logo and dissolves.
chord = load("score_main.mp3", 58.24, 58.9)
bloom = paulstretch(chord, dur=7.6)
nb = len(bloom); tb = np.arange(nb) / SR
env = np.minimum(1, tb / 1.2) ** 1.5 * np.clip((nb / SR - tb) / 3.0, 0, 1)
bloom = bloom * env[:, None]
put(bloom, final_hit + 0.2, 0, 0, 0.55)
sw, st = reverse_swell(load("score_main.mp3", 58.24, 58.8), final_hit, length=1.4, gain=0.25); put(sw, st)
# the final chord's natural reverb tail
hit = load("score_main.mp3", 58.24, 58.9)
put(reverb(hit, 0.35), final_hit)

out = buf[: int(TOTAL * SR)]
fade = np.ones(len(out)); nf = int(1.2 * SR); fade[-nf:] = np.cos(np.linspace(0, np.pi / 2, nf)) ** 2
out *= fade[:, None]
out /= max(1.0, np.abs(out).max() / 0.95)
sf.write(os.path.join(ROOT, "audio/score.wav"), out, SR, subtype="PCM_24")
print("score v4", round(len(out) / SR, 2), "final chord at", round(final_hit, 3), "jump seam at", round(50.74 + off_a, 3))
