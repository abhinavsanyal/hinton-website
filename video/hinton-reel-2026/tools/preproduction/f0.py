import numpy as np, soundfile as sf, sys, glob
def f0(path):
    x, sr = sf.read(path); x = x.astype(float)
    fr = int(0.04*sr); hop = int(0.01*sr); fs=[]
    env = np.array([np.sqrt(np.mean(x[i:i+fr]**2)) for i in range(0, len(x)-fr, hop)])
    thr = env.max()*0.08
    active = np.where(env>thr)[0]
    speech = (active[-1]-active[0])*hop/sr if len(active) else 0
    for i in range(0, len(x)-fr, hop):
        seg = x[i:i+fr]
        if np.sqrt(np.mean(seg**2)) < thr*1.5: continue
        seg = seg - seg.mean(); ac = np.correlate(seg, seg, 'full')[fr-1:]
        lo, hi = int(sr/300), int(sr/60)
        k = lo + np.argmax(ac[lo:hi])
        if ac[k] > 0.4*ac[0]: fs.append(sr/k)
    return np.median(fs), np.percentile(fs,10), speech, len(x)/sr
for p in sorted(glob.glob(sys.argv[1])):
    m, lo, sp, tot = f0(p); print(f"{p:32s} medianF0={m:6.1f}Hz p10={lo:6.1f} speech={sp:5.2f}s total={tot:5.2f}s")
