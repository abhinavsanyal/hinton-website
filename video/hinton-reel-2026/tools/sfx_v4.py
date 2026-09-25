"""Sound design v4 — one designed sound per visual event, gain-staged low and sent through a shared hall so every
effect lives in the same space as the score. Writes audio/sfx.wav (dry) and audio/sfx_wet.wav (hall send)."""
import os, sys, numpy as np, soundfile as sf
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from audiokit import *  # noqa: F401,F403

DUR = 83.6
dry = np.zeros((int(DUR * SR) + 4 * SR, 2))
send = np.zeros_like(dry)                     # what goes to the hall


def place(sig, t, gain=1.0, wet=0.35):
    i = int(round(t * SR)); n = min(len(sig), len(dry) - i)
    dry[i:i + n] += sig[:n] * gain
    send[i:i + n] += sig[:n] * gain * wet


def lead_in(sig, t_peak, peak_frac):
    """place so that the sound's peak (at `peak_frac` of its length) lands on t_peak"""
    return t_peak - peak_frac * len(sig) / SR


# ACT I — silence
place(sub_drop(2.2), 1.1, 0.42, 0.5)                                   # 1913 lands
w = whoosh(0.8, 160, 2600, 0.62, 1); place(w, lead_in(w, 3.3, 0.62), 0.16)
w = whoosh(0.9, 140, 2200, 0.6, -1); place(w, lead_in(w, 6.84, 0.6), 0.12)      # iris
w = whoosh(0.9, 140, 2200, 0.6, 1); place(w, lead_in(w, 9.72, 0.6), 0.12)       # iris
w = whoosh(0.7, 200, 3400, 0.6, -1); place(w, lead_in(w, 12.1, 0.6), 0.16)
place(swell(1.1, 150, 5000), 12.25, 0.08)
# ACT II → III — the film burns into colour
f = fire_flare(1.7); place(f, 17.63 - 0.32, 0.3, 0.45)
place(sub_drop(2.0, 62, 30), 17.63, 0.32, 0.45)
w = whoosh(0.7, 220, 3800, 0.6, 1); place(w, lead_in(w, 20.0, 0.6), 0.16)
place(sub_drop(1.4, 70, 34), 20.62, 0.22, 0.4)                          # GODS.
w = whoosh(0.8, 160, 2400, 0.62, -1); place(w, lead_in(w, 22.15, 0.62), 0.1)
for k in range(7):                                                      # dialogue cards, one per two beats
    place(card_swish(0.28, (-1) ** k * 0.45), 23.26 + k * 0.9756 - 0.12, 0.1, 0.3)
w = whoosh(0.8, 180, 3000, 0.6, 1); place(w, lead_in(w, 30.05, 0.6), 0.15)
flick = [(0.0, 0.05), (0.12, 0.16), (0.24, 0.36), (0.42, 3.0)]            # HOUSEFULL neon flickers on
place(neon_buzz(1.3, flick), 31.3, 0.06, 0.25)
place(thud(0.5), 31.72, 0.24, 0.35)
w = whoosh(0.5, 300, 5200, 0.6, -1); place(w, lead_in(w, 32.47, 0.6), 0.14)
w = whoosh(0.7, 200, 3200, 0.6, 1); place(w, lead_in(w, 34.93, 0.6), 0.14)
rr = np.random.default_rng(35)
for _ in range(24):
    place(coin_ting(), rr.uniform(35.65, 36.5), rr.uniform(0.04, 0.09), 0.4)
for i in range(6):
    place(paper(0.3, (-1) ** i * 0.4), 36.7 + i * 0.33, 0.09, 0.3)
# ACT IV — permission
place(sub_drop(2.4, 50, 28), 38.9, 0.28, 0.55)
for i, tt in enumerate([39.75, 40.1, 40.45, 40.8]):
    place(thud(0.5), tt, 0.3, 0.45); place(paper(0.22, (-1) ** i * 0.3), tt, 0.08)
w = whoosh(0.9, 140, 2000, 0.6, -1); place(w, lead_in(w, 42.35, 0.6), 0.09)
place(swell(1.9, 90, 7000), 47.95, 0.1, 0.4)                              # the grid ignites
# ACT V — 2026
place(sub_drop(2.6, 64, 29), 49.88, 0.4, 0.5)
w = whoosh(1.1, 90, 1800, 0.12, 1); place(w, 49.86, 0.14, 0.6)           # shockwave air
w = whoosh(0.8, 180, 3000, 0.6, -1); place(w, lead_in(w, 53.2, 0.6), 0.13)
place(ui_tap(), 55.45, 0.09, 0.3)
place(chime(2.4, 1320), 55.6, 0.05, 0.6)
place(swell(1.2, 200, 9000), 54.45, 0.06)
w = whoosh(0.7, 220, 4000, 0.6, 1); place(w, lead_in(w, 58.25, 0.6), 0.15)
w = whoosh(0.8, 160, 2800, 0.6, -1); place(w, lead_in(w, 62.5, 0.6), 0.13)
place(swell(1.0, 120, 4000), 63.0, 0.07)
w = whoosh(0.9, 140, 2400, 0.6, 1); place(w, lead_in(w, 65.82, 0.6), 0.12)
place(swell(0.9, 300, 10000), 67.3, 0.06)
place(card_swish(0.3, -0.25), 67.38 - 0.12, 0.05, 0.3)                 # SD frame pops in
place(card_swish(0.3, 0.25), 67.72 - 0.12, 0.06, 0.3)                  # HD
place(card_swish(0.3, 0.0), 68.12, 0.1, 0.3)                           # 4K chip
w = whoosh(0.7, 200, 3600, 0.6, -1); place(w, lead_in(w, 69.06, 0.6), 0.13)
place(swell(1.3, 120, 6000), 69.75, 0.06)
place(swell(1.1, 100, 3000), 70.0, 0.05)                                # into Muskan
# logo
place(sub_drop(2.8, 60, 28), 76.12, 0.36, 0.55)
place(chime(3.0, 1100), 76.86, 0.05, 0.7)                             # the H fills with light
place(swell(1.2, 400, 12000), 76.5, 0.05, 0.6)                         # air rising into the wordmark (77.62)

dry = dry[: int(DUR * SR)]
wet = reverb(send)[: int(DUR * SR)]
peak = max(np.abs(dry).max(), np.abs(wet).max())
sf.write(os.path.join(ROOT, "audio/sfx.wav"), dry / max(1.0, peak / 0.9), SR, subtype="PCM_24")
sf.write(os.path.join(ROOT, "audio/sfx_wet.wav"), wet / max(1.0, peak / 0.9), SR, subtype="PCM_24")
print("sfx v4 peak", round(float(np.abs(dry).max()), 3), "wet peak", round(float(np.abs(wet).max()), 3))
