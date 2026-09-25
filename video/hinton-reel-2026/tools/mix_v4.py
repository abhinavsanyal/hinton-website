"""Mix & master v4.
- VO: high-pass, de-mud, presence, de-ess, gentle compression, then a small plate (7 %) so it sits in the room.
- Score: gentle, slow ducking under the voice (−5.5 dB, 250 ms look-ahead, ~0.9 s release, holds across short
  gaps) plus a 1–4 kHz "spectral dip" so the voice cuts through without the music audibly pumping.
- Ambience: a continuous bed built from the Kling clips' own sound, crossfaded shot to shot, low-passed and sent
  to the hall, so there is never dead air and every cut is carried by sound.
- SFX: dry + hall send from sfx_v4.py.
- Master: light glue compression → two-pass loudnorm −14 LUFS / −1.5 dBTP.
Writes audio/mix.wav + audio/mix.flac."""
import os, sys, json, subprocess, numpy as np, soundfile as sf
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from audiokit import SR, ROOT, load, reverb, PLATE, HALL, lp, hp, bp

A = lambda p: os.path.join(ROOT, p)
TOTAL = 83.6
N = int(TOTAL * SR)


def ff(args):
    subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-y"] + args, check=True)


def fit(x):
    x = x if x.ndim == 2 else np.stack([x, x], 1)
    y = np.zeros((N, 2)); y[: min(N, len(x))] = x[:N]; return y


# 1 · voice
ff(["-i", A("audio/vo.wav"), "-af", "aresample=48000,highpass=f=75,equalizer=f=260:t=q:w=1.1:g=-2.5,equalizer=f=3300:t=q:w=1.3:g=2,deesser=i=0.35,acompressor=threshold=-21dB:ratio=2.6:attack=8:release=170:makeup=2.5", "-ac", "2", A("audio/_vo_proc.wav")])
vo, _ = sf.read(A("audio/_vo_proc.wav")); vo = fit(vo)
# ride the dialogue: clip-gain each line toward one speech-band level (±4 dB), as a dialogue editor would,
# so no line drops under the anthem; gain moves only in the gaps between lines.
LINES = json.load(open(A("comp/assets/data/timeline.json")))["lines"]
sb = bp(vo, 300, 4000).mean(1)
ride = np.ones(N); prev_end, prev_g = 0.0, 1.0
for L in LINES:
    a, z = L["voice"]; i, j = int(a * SR), int(z * SR)
    lvl = 20 * np.log10(np.sqrt(np.mean(sb[i:j] ** 2)) + 1e-9)
    target = -21.0 if L["label"] == "are_you" else -19.5                 # "Are you?" stays intimate
    g = 10 ** (np.clip(target - (lvl + 20 * np.log10(1.8)), -4, 4) / 20)  # measured at the final VO gain
    g0 = int(prev_end * SR); g1 = max(g0 + 1, i - int(0.03 * SR))
    ride[g0:g1] = np.linspace(prev_g, g, g1 - g0); ride[g1:] = g
    prev_end, prev_g = z + 0.03, g
vo = vo * ride[:, None]
vo = vo + reverb(vo, PLATE)[:N] * 0.07

# 2 · score with slow ducking + spectral dip
mu, _ = sf.read(A("audio/score.wav")); mu = fit(mu)
hop = int(0.01 * SR)
e = np.sqrt(np.convolve(vo.mean(1) ** 2, np.ones(hop) / hop, mode="same"))[::hop]
act = (20 * np.log10(e + 1e-9) > -40).astype(float)
look, hold = 25, 70                                   # 250 ms look-ahead, 700 ms hold across short gaps
act = np.maximum.reduce([np.roll(act, -k) for k in range(look)] + [np.roll(act, k) for k in range(hold)])
g = np.empty(len(act)); cur = 0.0
for i, a in enumerate(act):                          # cur: 0 = no duck, 1 = full duck
    cur += (a - cur) * (0.06 if a > cur else 0.012)  # ≈ 170 ms in, ≈ 0.85 s out (per 10 ms step)
    g[i] = cur
duck = np.repeat(g, hop)[:N]; duck = np.pad(duck, (0, N - len(duck)))
mid = bp(mu, 1000, 4000)
music = (mu - mid * 0.55 * duck[:, None]) * (10 ** (-5.5 / 20)) ** duck[:, None]

# 3 · ambience bed from the clips' own sound (crossfaded, low-passed, lightly in the hall)
bed = np.zeros((N, 2))
def lay(name, t0, t1, off=0.0, gain=0.4, fi=0.45, fo=0.55, lpf=9000):
    p = A(f"media/{name}.mp4")
    if not os.path.exists(p): return
    x = load(p)
    seg = x[int(off * SR): int((off + t1 - t0) * SR)]
    if len(seg) < (t1 - t0) * SR * 0.98:              # loop short sources
        reps = int(np.ceil((t1 - t0) * SR / max(1, len(x) - int(off * SR))))
        seg = np.vstack([x[int(off * SR):]] * (reps + 1))[: int((t1 - t0) * SR)]
    seg = lp(seg.copy(), lpf)
    n1, n2 = int(fi * SR), int(fo * SR)
    seg[:n1] *= (np.sin(np.linspace(0, np.pi / 2, n1)) ** 2)[:, None]; seg[-n2:] *= (np.cos(np.linspace(0, np.pi / 2, n2)) ** 2)[:, None]
    i = int(t0 * SR); bed[i:i + len(seg)] += seg * gain
lay("v01_projector", 0.0, 3.6, 0.0, 0.62, 0.05, 0.6)
lay("v02_camera1913", 3.1, 7.1, 0.0, 0.42)
lay("v01_projector", 6.7, 12.3, 0.4, 0.34, 0.5, 0.8)
lay("v05_billboard", 17.45, 20.2, 0.0, 0.3, 0.25)
lay("v06_milk", 19.85, 23.5, 0.0, 0.36)
lay("v13_fdfs", 22.0, 30.3, 3.5, 0.24, 0.5, 0.6, 7000)
lay("v07_queue", 29.9, 32.6, 0.0, 0.34)
lay("v08_audience", 32.35, 33.75, 0.0, 0.3, 0.12, 0.35)
lay("v08_audience", 34.8, 36.7, 2.5, 0.3, 0.3, 0.5)
lay("v10_coins", 35.55, 36.7, 3.3, 0.3, 0.1, 0.4)
lay("v14_scripts", 38.8, 42.5, 0.0, 1.0, 0.5, 0.7)
lay("v11_dreamer", 55.5, 58.4, 0.0, 1.3, 0.5, 0.6)
lay("v12_muskan", 70.9, 76.3, 0.0, 1.25, 0.6, 0.35)
bed_duck = (1 - 0.35 * duck)[:, None]
bed = bed * bed_duck + reverb(bed)[:N] * 0.12

# 4 · SFX
sfx, _ = sf.read(A("audio/sfx.wav")); sfx = fit(sfx)
sfw, _ = sf.read(A("audio/sfx_wet.wav")); sfw = fit(sfw)
fx = (sfx + sfw * 0.8) * (1 - 0.25 * duck)[:, None]

VO_G = float(os.environ.get("VO_G", 1.8)); MU_G = float(os.environ.get("MU_G", 0.6))
mix = vo * VO_G + music * MU_G + bed + fx
if os.environ.get("STEMS"):
    sf.write(A("audio/_stem_vo.wav"), vo * VO_G, SR, subtype="FLOAT"); sf.write(A("audio/_stem_bed.wav"), mix - vo * VO_G, SR, subtype="FLOAT")
    sf.write(A("audio/_stem_music.wav"), music * MU_G, SR, subtype="FLOAT"); sf.write(A("audio/_stem_amb.wav"), bed, SR, subtype="FLOAT"); sf.write(A("audio/_stem_fx.wav"), fx, SR, subtype="FLOAT")
sf.write(A("audio/_premix.wav"), mix / max(1.0, np.abs(mix).max() / 0.98), SR, subtype="FLOAT")

# 5 · master
glue = "acompressor=threshold=-16dB:ratio=1.6:attack=30:release=250:makeup=1"
m = subprocess.run(["ffmpeg", "-nostdin", "-hide_banner", "-i", A("audio/_premix.wav"), "-af", glue + ",loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json", "-f", "null", "-"], capture_output=True, text=True).stderr
j = json.loads(m[m.rindex("{"): m.rindex("}") + 1])
ln = f"loudnorm=I=-14:TP=-1.5:LRA=11:measured_I={j['input_i']}:measured_TP={j['input_tp']}:measured_LRA={j['input_lra']}:measured_thresh={j['input_thresh']}:offset={j['target_offset']}:linear=true"
ff(["-i", A("audio/_premix.wav"), "-af", f"{glue},{ln}", "-ar", str(SR), "-c:a", "pcm_s24le", A("audio/mix.wav")])
ff(["-i", A("audio/mix.wav"), "-c:a", "flac", A("audio/mix.flac")])
r = subprocess.run(["ffmpeg", "-nostdin", "-hide_banner", "-i", A("audio/mix.wav"), "-af", "ebur128=peak=true", "-f", "null", "-"], capture_output=True, text=True).stderr
print([l.strip() for l in r.splitlines() if l.strip().startswith(("I:", "LRA:", "Peak:"))][-3:])
for p in ("audio/_vo_proc.wav", "audio/_premix.wav"): os.remove(A(p))
