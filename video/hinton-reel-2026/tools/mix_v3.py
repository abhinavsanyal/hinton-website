"""Mix & master v3: clean VO chain, smooth VO-driven ducking (no pumping sidechain), diegetic clip sound,
gentle bus glue, two-pass loudness normalisation to −14 LUFS / −1.5 dBTP. Writes audio/mix.wav + audio/mix.flac."""
import os, json, subprocess, numpy as np, soundfile as sf
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
A = lambda p: os.path.join(ROOT, p)
SR, TOTAL = 48000, 90.0
N = int(TOTAL * SR)
def ff(args): subprocess.run(["ffmpeg", "-v", "error", "-y"] + args, check=True)
# 1. VO: high-pass, de-mud, presence, de-ess, gentle compression — dry (no echo)
ff(["-i", A("audio/vo.wav"), "-af", "aresample=48000,highpass=f=75,equalizer=f=260:t=q:w=1.1:g=-2.5,equalizer=f=3300:t=q:w=1.3:g=2,deesser=i=0.35,acompressor=threshold=-21dB:ratio=2.6:attack=8:release=170:makeup=2.5", "-ac", "2", A("audio/_vo_proc.wav")])
def rd(p):
    x, sr = sf.read(A(p)); assert sr == SR
    x = x if x.ndim == 2 else np.stack([x, x], 1)
    y = np.zeros((N, 2)); y[: min(N, len(x))] = x[:N]; return y
vo, mu, fx = rd("audio/_vo_proc.wav"), rd("audio/score.wav"), rd("audio/sfx.wav")
# 2. ducking curve from the VO envelope: 120 ms look-ahead, 250 ms hold, smooth one-pole attack/release
hop = int(0.01 * SR)
env = np.sqrt(np.convolve(vo.mean(1) ** 2, np.ones(hop) / hop, mode="same"))[::hop]
act = (20 * np.log10(env + 1e-9) > -42).astype(float)
look, hold = 12, 25
act = np.maximum.reduce([np.roll(act, -k) for k in range(look)] + [np.roll(act, k) for k in range(hold)])
target = np.where(act > 0, 10 ** (float(os.environ.get("DUCK_DB", -10)) / 20), 1.0)
g = np.empty_like(target); cur = 1.0
for i, tg in enumerate(target):
    a = 0.18 if tg < cur else 0.035          # ~50 ms down, ~280 ms up (per 10 ms step)
    cur += (tg - cur) * a; g[i] = cur
duck = np.repeat(g, hop)[:N]; duck = np.pad(duck, (0, N - len(duck)), constant_values=1.0)
fxduck = 1 - (1 - duck) * 0.35
# 3. diegetic sound from the Kling clips (street, drums & crowd, cinema cheer, coins)
dieg = np.zeros((N, 2))
def lay(name, t0, t1, off=0.0, gain=0.4, fi=0.12, fo=0.3):
    p = A(f"media/{name}.wav")
    if not os.path.exists(p): return
    x, _ = sf.read(p); x = x if x.ndim == 2 else np.stack([x, x], 1)
    seg = x[int(off * SR): int((off + t1 - t0) * SR)].copy()
    n1, n2 = int(fi * SR), int(fo * SR)
    seg[:n1] *= np.linspace(0, 1, n1)[:, None]; seg[-n2:] *= np.linspace(1, 0, n2)[:, None]
    i = int(t0 * SR); dieg[i:i + len(seg)] += seg * gain
lay("v05_billboard", 16.95, 20.05, 0.0, 0.32, 0.4)
lay("v06_milk", 19.95, 23.6, 0.0, 0.42, 0.15, 0.5)
lay("v08_audience", 32.45, 33.62, 0.0, 0.55, 0.05, 0.2)
lay("v08_audience", 34.9, 35.85, 2.5, 0.4, 0.1, 0.25)
lay("v10_coins", 35.8, 36.7, 3.9, 0.45, 0.05, 0.3)
mix = vo * float(os.environ.get("VO_G", 1.7)) + mu * duck[:, None] * float(os.environ.get("MU_G", 0.5)) + fx * fxduck[:, None] * 0.9 + dieg * duck[:, None] ** 0.5
if os.environ.get("STEMS"):
    sf.write(A("audio/_stem_vo.wav"), vo, SR, subtype="FLOAT"); sf.write(A("audio/_stem_bed.wav"), mix - vo * float(os.environ.get("VO_G", 1.7)), SR, subtype="FLOAT")
sf.write(A("audio/_premix.wav"), mix / max(1.0, np.abs(mix).max() / 0.98), SR, subtype="FLOAT")
# 4. master: gentle glue compression → two-pass loudnorm (−14 LUFS, −1.5 dBTP) → mix.wav / mix.flac
glue = "acompressor=threshold=-14dB:ratio=1.8:attack=25:release=220:makeup=1"
m = subprocess.run(["ffmpeg", "-hide_banner", "-i", A("audio/_premix.wav"), "-af", glue + ",loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json", "-f", "null", "-"], capture_output=True, text=True).stderr
j = json.loads(m[m.rindex("{"): m.rindex("}") + 1])
ln = f"loudnorm=I=-14:TP=-1.5:LRA=11:measured_I={j['input_i']}:measured_TP={j['input_tp']}:measured_LRA={j['input_lra']}:measured_thresh={j['input_thresh']}:offset={j['target_offset']}:linear=true"
ff(["-i", A("audio/_premix.wav"), "-af", f"{glue},{ln}", "-ar", str(SR), "-c:a", "pcm_s24le", A("audio/mix.wav")])
ff(["-i", A("audio/mix.wav"), "-c:a", "flac", A("audio/mix.flac")])
r = subprocess.run(["ffmpeg", "-hide_banner", "-i", A("audio/mix.wav"), "-af", "ebur128=peak=true", "-f", "null", "-"], capture_output=True, text=True).stderr
print([l.strip() for l in r.splitlines() if l.strip().startswith(("I:", "LRA:", "Peak:"))][-3:])
for p in ("audio/_vo_proc.wav", "audio/_premix.wav"): os.remove(A(p))
