"""Procedural sound design for the Hinton Studios reel.
Every effect is synthesised from noise/oscillators (no third-party samples), placed on the
locked picture timeline. Output: audio/sfx.wav (48 kHz stereo).
v2 (90 s) timeline."""
import subprocess, sys
import numpy as np, soundfile as sf
from scipy.signal import butter, sosfilt

SR = 48000
DUR = 90.0
rng = np.random.default_rng(1913)
out = np.zeros((int(DUR * SR) + SR, 2))


def bp(x, lo, hi, order=2):
    return sosfilt(butter(order, [lo, hi], btype="band", fs=SR, output="sos"), x)


def lp(x, f, order=2):
    return sosfilt(butter(order, f, btype="low", fs=SR, output="sos"), x)


def hp(x, f, order=2):
    return sosfilt(butter(order, f, btype="high", fs=SR, output="sos"), x)


def place(sig, t, gain=1.0, pan=0.0):
    """mono or stereo signal at time t (s); pan -1..1"""
    i = int(t * SR)
    if i >= len(out):
        return
    if sig.ndim == 1:
        l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
        sig = np.stack([sig * l, sig * r], 1) * 1.414
    n = min(len(sig), len(out) - i)
    out[i:i + n] += sig[:n] * gain


def env(n, a, d, curve=4.0):
    t = np.arange(n) / SR
    e = np.minimum(1, t / max(a, 1e-4)) * np.exp(-np.maximum(0, t - a) * curve / max(d, 1e-4))
    return e


# ---------- building blocks ----------
def whoosh(length=0.5, f0=300, f1=4000, peak=0.55):
    n = int(length * SR)
    noise = rng.standard_normal(n)
    t = np.linspace(0, 1, n)
    y = np.zeros(n)
    blocks = 24
    for b in range(blocks):
        s, e = b * n // blocks, (b + 1) * n // blocks
        u = (b + 0.5) / blocks
        fc = f0 * (f1 / f0) ** (u if u < peak else 1 - (u - peak) / (1 - peak) * 0.6)
        seg = bp(noise[max(0, s - 2000):e], fc * 0.6, min(fc * 1.6, 20000))
        y[s:e] = seg[-(e - s):]
    shape = np.where(t < peak, (t / peak) ** 2.2, ((1 - t) / (1 - peak)) ** 1.6)
    y = y * shape
    y /= np.abs(y).max() + 1e-9
    pan = np.linspace(-0.7, 0.7, n)
    return np.stack([y * np.cos((pan + 1) * np.pi / 4), y * np.sin((pan + 1) * np.pi / 4)], 1) * 1.3


def boom(length=2.2, f0=62, f1=32, noise_amt=0.5, click=0.6):
    n = int(length * SR)
    t = np.arange(n) / SR
    f = f1 + (f0 - f1) * np.exp(-t * 7)
    ph = 2 * np.pi * np.cumsum(f) / SR
    body = np.sin(ph) * np.exp(-t * 2.4)
    body = np.tanh(body * 2.2) / np.tanh(2.2)
    nz = lp(rng.standard_normal(n), 900) * np.exp(-t * 16) * noise_amt
    ck = hp(rng.standard_normal(n), 2500) * np.exp(-t * 90) * click
    y = body + nz + ck
    return y / (np.abs(y).max() + 1e-9)


def thud(length=0.5):
    n = int(length * SR); t = np.arange(n) / SR
    y = np.sin(2 * np.pi * np.cumsum(110 * np.exp(-t * 10) + 55) / SR) * np.exp(-t * 14)
    y += lp(rng.standard_normal(n), 1500) * np.exp(-t * 30) * 0.8
    return y / np.abs(y).max()


def pop(freq=880, length=0.12):
    n = int(length * SR); t = np.arange(n) / SR
    f = freq * (1 + 0.8 * np.exp(-t * 60))
    y = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 38)
    return y


def tick(length=0.03, f=5000):
    n = int(length * SR); t = np.arange(n) / SR
    return bp(rng.standard_normal(n), f * 0.6, min(f * 1.5, 20000)) * np.exp(-t * 250)


def typekey():
    n = int(0.06 * SR); t = np.arange(n) / SR
    y = bp(rng.standard_normal(n), 1800, 6000) * np.exp(-t * 180)
    y += np.sin(2 * np.pi * 420 * t) * np.exp(-t * 120) * 0.5
    return y / np.abs(y).max()


def paper(length=0.35):
    n = int(length * SR); t = np.arange(n) / SR
    y = bp(rng.standard_normal(n), 900, 7000) * (np.exp(-t * 12) * (1 + 0.6 * np.sin(2 * np.pi * 23 * t)))
    y += lp(rng.standard_normal(n), 300) * np.exp(-t * 40) * 2
    return y / np.abs(y).max()


def coin():
    n = int(0.5 * SR); t = np.arange(n) / SR
    base = rng.uniform(2600, 4200)
    y = sum(np.sin(2 * np.pi * base * k * t + rng.uniform(0, 6)) * np.exp(-t * (18 + 10 * i)) / (i + 1)
            for i, k in enumerate([1, 1.47, 2.09, 2.76, 3.4]))
    y += hp(rng.standard_normal(n), 4000) * np.exp(-t * 200) * 0.5
    return y / np.abs(y).max()


def whistle(length=0.55, f0=1900, f1=2700):
    n = int(length * SR); t = np.arange(n) / SR
    f = f0 + (f1 - f0) * np.minimum(1, t / (length * 0.35)) + 40 * np.sin(2 * np.pi * 7 * t)
    y = np.sin(2 * np.pi * np.cumsum(f) / SR)
    y += bp(rng.standard_normal(n), 1500, 4000) * 0.25
    return y * env(n, 0.03, length, 3)


def crowd(length, level=1.0):
    n = int(length * SR); t = np.arange(n) / SR
    y = np.zeros(n)
    for _ in range(10):  # many "voices" = formant-filtered noise with random swells
        lo = rng.uniform(250, 700)
        v = bp(rng.standard_normal(n), lo, lo * rng.uniform(2.5, 5))
        am = np.clip(np.interp(t, np.linspace(0, length, 12), rng.uniform(0.2, 1, 12)), 0, 1)
        y += v * am
    y = y / np.abs(y).max()
    fade = np.minimum(1, t / 0.25) * np.minimum(1, (length - t) / 0.4)
    return y * fade * level


def projector(length):
    n = int(length * SR); t = np.arange(n) / SR
    rate = 20 * np.minimum(1, t / 0.7) ** 0.7 + 0.01
    phase = np.cumsum(rate) / SR
    clicks = np.zeros(n)
    idx = np.where(np.diff(np.floor(phase)) > 0)[0]
    k = tick(0.025, 2800) * 1.2
    k2 = tick(0.02, 900) * 1.5
    for i in idx:
        seg = k if rng.random() < 0.7 else k2
        m = min(len(seg), n - i); clicks[i:i + m] += seg[:m] * rng.uniform(0.6, 1)
    hum = (np.sin(2 * np.pi * 96 * t) * 0.25 + np.sin(2 * np.pi * 192 * t) * 0.12) * np.minimum(1, t / 0.5)
    hiss = hp(rng.standard_normal(n), 3000) * 0.08
    crackle = np.zeros(n)
    for i in rng.integers(0, n, int(length * 14)):
        m = min(200, n - i); crackle[i:i + m] += rng.standard_normal(m) * np.exp(-np.arange(m) / 30) * rng.uniform(0.2, 1)
    return clicks + hum + hiss + crackle * 0.35


def riser(length=1.6):
    n = int(length * SR); t = np.arange(n) / SR; u = t / length
    y = np.zeros(n); noise = rng.standard_normal(n)
    for b in range(20):
        s, e = b * n // 20, (b + 1) * n // 20
        fc = 400 * (12000 / 400) ** ((b + 0.5) / 20)
        y[s:e] = bp(noise[max(0, s - 2000):e], fc * 0.7, min(fc * 1.4, 20000))[-(e - s):]
    tone = np.sin(2 * np.pi * np.cumsum(110 * 2 ** (u * 3)) / SR) * 0.35
    tone += np.sin(2 * np.pi * np.cumsum(165 * 2 ** (u * 3)) / SR) * 0.2
    y = (y / np.abs(y).max() + tone) * u ** 2.5
    return y


def shimmer(length=0.9):
    n = int(length * SR); t = np.arange(n) / SR; y = np.zeros(n)
    for _ in range(40):
        f = rng.uniform(2000, 9000); st_ = rng.uniform(0, length * 0.8)
        y += np.sin(2 * np.pi * f * t) * np.exp(-np.maximum(0, t - st_) * 25) * (t > st_)
    y += bp(rng.standard_normal(n), 5000, 14000) * np.exp(-t * 3) * 0.6
    return y / np.abs(y).max() * np.minimum(1, t / 0.05)


def beep(f=1000, length=0.04):
    t = np.arange(int(length * SR)) / SR
    return np.sin(2 * np.pi * f * t) * np.minimum(1, (length - t) / 0.005)


# ---------- timeline (v2, 90 s) ----------
proj = projector(12.2)
proj_env = np.concatenate([np.ones(int(1.2 * SR)), np.linspace(1, 0.45, int(1.0 * SR)), np.full(int(9.5 * SR), 0.45), np.linspace(0.45, 0, int(0.5 * SR))])
place(proj[: len(proj_env)] * proj_env[: len(proj)], 0.0, 0.3)
for tb in [0.36, 0.72]:
    place(beep(1000, 0.045), tb, 0.25)
place(riser(0.5) * 0.6, 0.62, 0.35)                                   # film burn
for tw in [3.12, 6.6, 9.45, 11.9, 13.15, 16.75, 19.8, 23.3, 29.85, 32.3, 33.4, 34.72, 42.2, 53.35, 58.5, 63.7, 67.5, 74.45]:
    place(whoosh(0.5, 250, 5500), tw - 0.22, 0.5)
place(whoosh(0.8, 120, 3000, 0.7), 7.3, 0.18)                         # filmstrip flutter
for tb, g in [(1.1, 0.9), (17.5, 0.55), (20.62, 0.5), (38.9, 0.5), (46.43, 0.55), (49.88, 0.95), (71.5, 0.6), (80.5, 0.95)]:
    place(boom(), tb, g)
for tb in [31.45, 39.75, 40.1, 40.45, 40.8]:
    place(thud(), tb, 0.7); place(paper(0.2), tb, 0.25)
for tb in [3.35, 9.75, 12.15]:
    place(thud(0.3) * 0.5 + paper(0.3)[: int(0.3 * SR)] * 0.5, tb, 0.35)
place(paper(), 4.95, 0.35, 0.4)
for i in range(3):
    place(paper(0.35), 38.9 + i * 0.12, 0.3)
for i in range(6):
    place(paper(0.3), 36.7 + i * 0.33, 0.28, (-1) ** i * 0.4)
for tp, f in [(2.55, 820), (4.25, 900), (5.5, 760), (5.75, 900), (5.91, 1000), (6.07, 1100), (8.1, 900), (10.25, 900), (10.4, 1080), (10.85, 520), (12.4, 880), (15.55, 600), (18.9, 820), (22.3, 700), (30.15, 900), (30.3, 1000), (54.97, 900), (56.25, 1150), (58.8, 900), (64.0, 760), (64.1, 900), (64.2, 1060), (68.8, 900)]:
    place(pop(f), tp, 0.28)
for i in range(8):
    place(pop(600 * 2 ** (i / 7)), 13.45 + i * 0.26, 0.3, (i % 2) * 0.6 - 0.3)
for i in range(16):                                                    # star wall: card slaps on the beat
    place(thud(0.25) * 0.5 + paper(0.25)[: int(0.25 * SR)] * 0.7, 23.55 + i * 0.395, 0.3, (-1) ** i * 0.3)
for i in range(14):
    place(typekey(), 1.7 + i * (0.8 / 14), 0.22)
for i in range(36):
    place(typekey() * 0.8, 53.85 + i * (1.9 / 36) + rng.uniform(-0.01, 0.01), 0.15)
for i in range(28):
    place(typekey() * 0.7, 83.0 + i * (0.8 / 28), 0.12)
place(tick(0.05, 1500) * 3, 55.85, 0.35)
place(shimmer(1.2), 55.97, 0.3)
for i in range(30):                                                    # clock hands whirring
    place(tick(0.02, 3000), 30.3 + i * 0.03, 0.08)
for _ in range(26):
    place(coin(), rng.uniform(34.95, 36.6), rng.uniform(0.06, 0.15), rng.uniform(-0.8, 0.8))
place(crowd(3.3, 0.16), 17.5); place(crowd(3.4, 0.14), 20.0); place(crowd(6.5, 0.1), 23.5)
place(crowd(2.3, 0.07), 30.0); place(crowd(1.1, 0.15), 32.45); place(crowd(1.4, 0.06), 33.55); place(crowd(1.8, 0.14), 34.9)
for tw_, f0 in [(17.7, 1900), (20.7, 2100), (33.1, 1800), (33.2, 2200), (33.3, 2000), (35.4, 2300)]:
    place(whistle(0.5, f0, f0 * 1.4), tw_, 0.13, rng.uniform(-0.6, 0.6))
for i in range(60):
    place(tick(0.02, 6000), 44.95 + i * 0.0125, 0.12, rng.uniform(-0.8, 0.8))
place(riser(1.7), 47.95, 0.5)
place(riser(0.7) * 0.8, 70.8, 0.35)
for i in range(4):
    place(pop(700 + i * 150, 0.1), 51.8 + i * 0.36, 0.3)
place(pop(1500, 0.14), 53.2, 0.3)
for i in range(14):
    place(pop(1400 + i * 60, 0.08), 65.7 + i * 0.07, 0.05, rng.uniform(-0.7, 0.7))
for i in range(9):                                                     # generated tiles resolving
    place(shimmer(0.5) * 0.6, 71.67 + i * 0.13, 0.12, rng.uniform(-0.6, 0.6))
for i in range(14):                                                    # 4K mosaic resolve
    place(tick(0.02, 2500 + i * 300), 69.6 + i * 0.065, 0.1)
place(tick(0.04, 2200) * 2, 74.6, 0.2)                                 # camera focus beep
place(beep(1800, 0.06) * 0.5, 74.65, 0.2)
# logo finale: crosshair zip, shards land, brackets snap, shine
place(whoosh(0.4, 800, 9000, 0.3), 80.45, 0.3)
rr_ = np.random.default_rng(745)
for i in range(13):
    place(pop(900 + rr_.uniform(0, 900), 0.09) * 0.9, 80.5 + 0.2 + rr_.uniform(0, 0.55) + 0.45, 0.12, rr_.uniform(-0.6, 0.6))
for i in range(4):
    place(thud(0.3) * 0.6, 81.65 + i * 0.05 + 0.2, 0.3)
place(shimmer(1.0), 81.95, 0.3)
out = out[: int(DUR * SR)]
out /= max(1.0, np.abs(out).max() / 0.95)
sf.write(sys.argv[2], out, SR, subtype="PCM_24" if sys.argv[2].endswith(".wav") else None)
print("sfx peak", np.abs(out).max(), "len", len(out) / SR)
