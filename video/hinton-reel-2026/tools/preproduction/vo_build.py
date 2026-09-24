import sys, json, numpy as np, soundfile as sf
sys.path.insert(0,'.')
from seg import segs
SR=24000
x,_=sf.read('vo/take3_fast.wav'); y,_=sf.read('vo/areyou1_fast.wav')
K=1.07
S=[[a/K,b/K] for a,b in json.load(open('vo/segs.json'))]
labels=["1913","man_bombay","pictures_move","learned_speak","to_sing","every_language","heroes_gods","queued","coins","permission","every_film","thousand","until_now","camera_imagination","heres_to","made_india","for_world","hinton_tag","visionaries"]
# gap before each segment (seconds)
gaps=[0.95,0.35,0.35,0.60,0.35,0.30,0.55,0.40,0.25,0.75,0.45,0.35,1.35,1.88,0.55,0.45,0.30,0.70,0.80]
clips=[]
for i,(a,b) in enumerate(S[:18]):
    lo=max(0,a-0.06); hi=b+0.14
    if i+1<len(S): hi=min(hi,(b+S[i+1][0])/2)
    clips.append(x[int(lo*SR):int(hi*SR)])
clips.append(y[0:int(4.8*SR)])
t=0; out=[]; tl=[]
for lab,g,c in zip(labels,gaps,clips):
    t+=g; tl.append(dict(label=lab,start=round(t,3),end=round(t+len(c)/SR,3))); out.append((t,c)); t+=len(c)/SR
total=t+1.8
buf=np.zeros(int(total*SR)+SR)
for st,c in out:
    r=np.sqrt(np.mean(c[np.abs(c)>0.01]**2)); c=c*np.clip(10**(-20/20)/r,0.5,2.0)
    i=int(st*SR); fade=np.ones(len(c)); n=int(0.01*SR); fade[:n]=np.linspace(0,1,n); fade[-n:]=np.linspace(1,0,n)
    buf[i:i+len(c)]+=c*fade
buf=buf[:int(total*SR)]
sf.write('vo/vo_line.wav',buf,SR)
# sub-phrase timings for kinetic type
for e in tl:
    seg=buf[int(e['start']*SR):int(e['end']*SR)]
    sf.write('/tmp/_s.wav',seg,SR)
    ss,_=segs('/tmp/_s.wav',0.12,-38)
    e['sub']=[[round(e['start']+a,2),round(e['start']+b,2)] for a,b in ss]
json.dump(dict(total=round(total,3),lines=tl),open('timeline.json','w'),indent=1)
for e in tl: print(f"{e['label']:20s} {e['start']:6.2f}-{e['end']:6.2f}  sub={e['sub']}")
print('TOTAL',round(total,2))
