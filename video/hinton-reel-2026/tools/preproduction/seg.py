import numpy as np, soundfile as sf, sys
def segs(path, min_sil=0.30, thr_db=-40):
    x, sr = sf.read(path); hop = int(0.01*sr)
    env = np.array([np.sqrt(np.mean(x[i:i+hop]**2))+1e-9 for i in range(0, len(x)-hop, hop)])
    db = 20*np.log10(env/env.max()); on = db > thr_db
    out=[]; start=None; last=None
    for i,v in enumerate(on):
        if v:
            if start is None: start=i
            elif (i-last)*0.01 > min_sil: out.append((start,last)); start=i
            last=i
    out.append((start,last))
    return [(a*0.01, (b+1)*0.01) for a,b in out], sr
if __name__=="__main__":
    s,_ = segs(sys.argv[1], float(sys.argv[2]) if len(sys.argv)>2 else 0.3)
    tot=0
    for a,b in s: print(f"{a:6.2f}-{b:6.2f}  ({b-a:4.2f})"); tot+=b-a
    print("n",len(s),"speech sum",round(tot,2))
