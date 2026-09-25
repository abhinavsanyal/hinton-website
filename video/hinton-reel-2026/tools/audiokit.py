"""Shared audio building blocks for the reel: loading, reverb, and designed (not sampled) sound effects.
All effects are click-free (smooth attacks), band-limited and meant to be sent through the shared hall."""
import os, subprocess, numpy as np
from scipy.signal import butter, sosfilt, sosfiltfilt, fftconvolve

SR = 48000
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
_rng = np.random.default_rng(1913)


def load(path, a=None, b=None, sr=SR):
    af = f"atrim={a}:{b},asetpts=N/SR/TB" if a is not None else "anull"
    cmd = ["ffmpeg", "-nostdin", "-v", "error", "-i", path, "-ac", "2", "-ar", str(sr), "-af", af, "-f", "f32le", "-"]
    raw = subprocess.run(cmd, capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32).reshape(-1, 2).astype(float)


def bp(x, lo, hi, order=2):
    return sosfiltfilt(butter(order, [lo, min(hi, SR / 2 - 100)], btype="band", fs=SR, output="sos"), x, axis=0)


def lp(x, f, order=2):
    return sosfiltfilt(butter(order, f, btype="low", fs=SR, output="sos"), x, axis=0)


def hp(x, f, order=2):
    return sosfiltfilt(butter(order, f, btype="high", fs=SR, output="sos"), x, axis=0)


def pink(n, ch=2):
    """Pink noise via spectral shaping."""
    w = _rng.standard_normal((n, ch))
    W = np.fft.rfft(w, axis=0)
    f = np.fft.rfftfreq(n, 1 / SR); f[0] = f[1]
    W /= np.sqrt(f)[:, None]
    p = np.fft.irfft(W, n, axis=0)
    return p / (np.abs(p).max() + 1e-9)


def hall_ir(rt60=2.4, pre=0.018, damp=(1.0, 0.75, 0.42)):
    n = int((rt60 * 1.15 + pre) * SR)
    t = np.arange(n) / SR
    out = np.zeros((n, 2))
    for (lo, hi), k in zip([(40, 400), (400, 3000), (3000, 14000)], damp):
        for ch in range(2):
            nz = sosfiltfilt(butter(2, [lo, hi], btype="band", fs=SR, output="sos"), _rng.standard_normal(n))
            out[:, ch] += nz * np.exp(-6.9 * np.maximum(0, t - pre) / (rt60 * k)) * (t >= pre)
    # early reflections for depth
    for d, g in [(0.011, 0.5), (0.019, 0.35), (0.027, 0.28), (0.041, 0.2)]:
        i = int(d * SR); out[i, 0] += g; out[int(i * 1.07), 1] += g
    return out / np.sqrt(np.sum(out ** 2) / 2)          # unit energy per channel: wet ≈ dry loudness


PLATE = hall_ir(1.1, 0.012, (1.0, 0.85, 0.6))
HALL = hall_ir(2.6)


def reverb(x, irx=HALL):
    return np.stack([fftconvolve(x[:, c], irx[:, c]) for c in range(2)], 1)


def env_ar(n, attack, release, curve=3.0):
    t = np.arange(n) / SR
    a = np.clip(t / max(attack, 1e-4), 0, 1) ** 2
    r = np.exp(-curve * np.maximum(0, t - attack) / max(release, 1e-4))
    return a * r


def pan(x, p):
    """equal-power pan; p may be scalar or per-sample array in [-1, 1]"""
    p = np.asarray(p)
    l, r = np.cos((p + 1) * np.pi / 4), np.sin((p + 1) * np.pi / 4)
    m = x.mean(1) if x.ndim == 2 else x
    return np.stack([m * l, m * r], 1) * 1.414


# ---------------- designed sounds ----------------
def whoosh(dur=0.75, lo=180, hi=3200, peak=0.6, direction=1):
    """Air pass-by: pink noise through a sweeping resonant band, Doppler-like pitch arc and a stereo pass."""
    n = int(dur * SR); t = np.linspace(0, 1, n)
    src = pink(n)[:, 0]
    up, down = np.clip(t / peak, 0, 1), np.clip((t - peak) / (1 - peak), 0, 1)
    arc = np.where(t < peak, up ** 1.6, 1 - 0.55 * down ** 0.8)
    fc = lo * (hi / lo) ** arc
    y = np.zeros(n); blk = 480
    for s in range(0, n, blk):
        e = min(n, s + blk); f = fc[(s + e) // 2]
        seg = sosfilt(butter(2, [f * 0.55, min(f * 1.8, 20000)], btype="band", fs=SR, output="sos"), src[max(0, s - 2400):e])
        y[s:e] = seg[-(e - s):]
    amp = np.where(t < peak, up ** 2.4, np.exp(-4.5 * down))
    y *= amp * np.hanning(n) ** 0.25
    y /= np.abs(y).max() + 1e-9
    return pan(y, direction * np.linspace(-0.75, 0.75, n))


def swell(dur=1.4, lo=120, hi=6000):
    """Soft rising air (no attack) — leads gently into a moment."""
    n = int(dur * SR); t = np.linspace(0, 1, n)
    y = bp(pink(n), lo, hi)
    y *= (t ** 2.2 * (1 - np.clip((t - 0.93) / 0.07, 0, 1)))[:, None]
    return y / (np.abs(y).max() + 1e-9)


def sub_drop(dur=1.8, f0=58, f1=31):
    n = int(dur * SR); t = np.arange(n) / SR
    f = f1 + (f0 - f1) * np.exp(-t * 3.2)
    y = np.sin(2 * np.pi * np.cumsum(f) / SR) * env_ar(n, 0.006, dur * 0.55, 2.8)
    body = lp(_rng.standard_normal(n), 180) * env_ar(n, 0.004, 0.12, 4)
    y = np.tanh((y + 0.35 * body / (np.abs(body).max() + 1e-9)) * 1.6) / np.tanh(1.6)
    return np.stack([y, y], 1)


def thud(dur=0.55):
    n = int(dur * SR); t = np.arange(n) / SR
    f = 55 + 60 * np.exp(-t * 22)
    tone = np.sin(2 * np.pi * np.cumsum(f) / SR) * env_ar(n, 0.003, 0.18, 3.5)
    knock = lp(_rng.standard_normal(n), 1100) * env_ar(n, 0.002, 0.045, 4)
    y = tone + 0.55 * knock / (np.abs(knock).max() + 1e-9)
    y /= np.abs(y).max()
    return np.stack([y, y], 1)


def paper(dur=0.32, pan_to=0.0):
    n = int(dur * SR); t = np.linspace(0, 1, n)
    y = bp(pink(n), 900, 7500)[:, 0]
    grain = 1 + 0.5 * np.sin(2 * np.pi * 31 * t * dur) * np.sin(2 * np.pi * 7 * t * dur)
    y *= (t ** 0.5) * np.exp(-5 * t) * grain
    y /= np.abs(y).max() + 1e-9
    return pan(y, pan_to)


def card_swish(dur=0.26, pan_to=0.0):
    n = int(dur * SR); t = np.linspace(0, 1, n)
    y = pink(n)[:, 0]
    fc = 1800 * (5.0 ** t)
    out = np.zeros(n); blk = 480
    for s in range(0, n, blk):
        e = min(n, s + blk); f = fc[(s + e) // 2]
        seg = sosfilt(butter(2, [f * 0.6, min(f * 1.6, 20000)], btype="band", fs=SR, output="sos"), y[max(0, s - 2400):e])
        out[s:e] = seg[-(e - s):]
    out *= np.sin(np.pi * t) ** 1.5
    tick = np.sin(2 * np.pi * 150 * np.arange(n) / SR) * env_ar(n, 0.002, 0.03, 4)
    out = out / (np.abs(out).max() + 1e-9) + 0.25 * tick
    return pan(out / np.abs(out).max(), pan_to)


def fire_flare(dur=1.6):
    """Film burning through: a breathy flame rush + crackle + a low whoomp."""
    n = int(dur * SR); t = np.arange(n) / SR
    rush = bp(pink(n), 250, 4200) * (env_ar(n, 0.28, 0.9, 2.6))[:, None]
    crack = np.zeros(n)
    for i in _rng.integers(0, int(n * 0.7), 60):
        m = min(300, n - i); crack[i:i + m] += _rng.standard_normal(m) * np.exp(-np.arange(m) / 25) * _rng.uniform(0.2, 1)
    crack = hp(crack, 2500)
    whoomp = np.sin(2 * np.pi * np.cumsum(90 * np.exp(-t * 2) + 38) / SR) * env_ar(n, 0.12, 0.6, 3)
    y = rush / (np.abs(rush).max() + 1e-9) + 0.25 * np.stack([crack, crack[::-1]], 1) / (np.abs(crack).max() + 1e-9) + 0.6 * np.stack([whoomp, whoomp], 1)
    return y / np.abs(y).max()


def neon_buzz(dur, flicker):
    """Mains-hum neon with an on/off flicker envelope (list of (t_on, t_off) in seconds)."""
    n = int(dur * SR); t = np.arange(n) / SR
    y = sum(np.sin(2 * np.pi * 100 * k * t + k) / k for k in (1, 2, 3, 5, 7)) + 0.15 * hp(_rng.standard_normal(n), 3000)
    g = np.zeros(n)
    for a, b in flicker:
        i, j = int(a * SR), int(b * SR); g[i:j] = 1
    g = np.convolve(g, np.ones(96) / 96, mode="same")
    y = y * g
    y = bp(y[:, None].repeat(2, 1), 90, 5000)
    return y / (np.abs(y).max() + 1e-9)


def chime(dur=2.2, base=1320):
    n = int(dur * SR); t = np.arange(n) / SR
    y = sum(np.sin(2 * np.pi * base * r * t + _rng.uniform(0, 6)) * np.exp(-t * (1.6 + i * 0.9)) / (i + 1) for i, r in enumerate([1, 1.5, 2.0, 2.76, 3.9]))
    y *= np.clip(t / 0.01, 0, 1)
    y /= np.abs(y).max()
    return pan(y, 0.0) * 0.7


def coin_ting():
    n = int(0.45 * SR); t = np.arange(n) / SR
    base = _rng.uniform(2600, 4300)
    y = sum(np.sin(2 * np.pi * base * k * t + _rng.uniform(0, 6)) * np.exp(-t * (16 + 9 * i)) / (i + 1) for i, k in enumerate([1, 1.47, 2.09, 2.76]))
    y *= np.clip(t / 0.0015, 0, 1)
    return pan(y / np.abs(y).max(), _rng.uniform(-0.7, 0.7))


def ui_tap():
    n = int(0.12 * SR); t = np.arange(n) / SR
    y = np.sin(2 * np.pi * 1800 * t) * np.exp(-t * 60) + 0.4 * np.sin(2 * np.pi * 900 * t) * np.exp(-t * 45)
    y *= np.clip(t / 0.001, 0, 1)
    return pan(y / np.abs(y).max(), 0.0)
