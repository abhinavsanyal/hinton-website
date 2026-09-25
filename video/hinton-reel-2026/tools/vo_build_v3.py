"""Re-time the recorded narration (v1 take, level-matched) onto the 90 s picture.
Each entry: label, source range in the v1 VO (s), new start (s). Writes audio/vo.wav + comp/assets/data/timeline.json."""
import json, numpy as np, soundfile as sf, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
x, SR = sf.read(os.path.join(ROOT, "audio/sources/vo_v1.flac"))
EDL = [
    ("1913", 0.95, 2.664, 1.10), ("man_bombay_a", 3.014, 4.39, 3.30), ("man_bombay_b", 4.39, 5.84, 4.90),
    ("pictures_move", 6.19, 8.054, 6.85), ("learned_speak", 8.654, 10.555, 9.70), ("to_sing", 10.905, 11.731, 12.10),
    ("every_language", 12.031, 14.137, 13.35), ("heroes", 14.687, 16.46, 17.75), ("gods", 16.46, 17.626, 20.00),
    ("queued", 18.026, 19.83, 30.30), ("whistled", 19.83, 20.49, 32.45), ("wept", 20.49, 21.216, 33.55),
    ("coins", 21.466, 23.031, 35.20), ("permission", 23.781, 25.962, 39.30), ("every_film", 26.412, 28.294, 42.45),
    ("thousand", 28.644, 30.274, 44.60), ("until_now", 31.624, 33.021, 47.30), ("nothing_changed", 34.901, 36.22, 50.35),
    ("only_now", 36.22, 37.18, 53.40), ("the_camera", 37.18, 38.09, 54.45), ("imagination", 38.09, 39.269, 55.45),
    ("heres_to", 39.819, 42.15, 58.15), ("impossible", 42.15, 43.86, 60.55), ("made_india", 44.31, 45.491, 62.85),
    ("for_world", 45.791, 46.758, 64.30), ("hinton", 47.458, 48.78, 66.00), ("dream4k", 48.78, 50.56, 67.20),
    ("create_ai", 50.56, 52.471, 68.90), ("visionaries", 53.271, 56.8, 71.05), ("are_you", 56.8, 58.071, 74.80),
]
TOTAL = 83.6
out = np.zeros(int(TOTAL * SR))
lines = []
thr = 0.02
for lab, a, b, t in EDL:
    c = x[int(a * SR):int(b * SR)].copy()
    n = int(0.008 * SR); c[:n] *= np.linspace(0, 1, n); c[-n:] *= np.linspace(1, 0, n)
    i = int(t * SR); out[i:i + len(c)] += c
    act = np.where(np.abs(c) > thr)[0]
    lines.append(dict(label=lab, start=round(t, 3), end=round(t + len(c) / SR, 3),
                      voice=[round(t + act[0] / SR, 3), round(t + act[-1] / SR, 3)] if len(act) else None))
sf.write(os.path.join(ROOT, "audio/vo.wav"), out, SR)
env = [float(np.sqrt(np.mean(out[int(i / 30 * SR):int((i + 1) / 30 * SR)] ** 2))) for i in range(int(TOTAL * 30))]
m = max(env)
json.dump(dict(total=TOTAL, lines=lines), open(os.path.join(ROOT, "comp/assets/data/timeline.json"), "w"), indent=1)
json.dump([round(v / m, 3) for v in env], open(os.path.join(ROOT, "comp/assets/data/vo_env.json"), "w"))
for l in lines: print(f"{l['label']:16s} {l['start']:6.2f}  voice {l['voice']}")
