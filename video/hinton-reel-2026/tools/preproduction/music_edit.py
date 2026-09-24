import numpy as np, soundfile as sf
x,sr=sf.read('music/full1_48k.wav')   # stereo 48k
B,_=sf.read('music/B_1.wav')
P=0.43*4  # one bar
def S(a,b): return x[int(a*sr):int(b*sr)]
parts=[S(0,15.0+2*P), S(15.0+P,15.0+2*P), S(15.0+2*P,21.6), S(22.2,32.3), S(36.45,58.6)]
xf=int(0.02*sr)
out=parts[0]
for p in parts[1:]:
    r=np.linspace(0,1,xf)[:,None]
    out=np.concatenate([out[:-xf], out[-xf:]*(1-r)+p[:xf]*r, p[xf:]])
print("edited len", len(out)/sr)
TOTAL=59.87
buf=np.zeros((int(TOTAL*sr)+sr,2)); buf[:len(out)]=out[:len(buf)]
t=np.arange(len(buf))/sr
# ending: duck anthem under final line, stop-down before 'Are you?'
g=np.ones(len(buf))
def ramp(t0,t1,v0,v1):
    m=(t>=t0)&(t<t1); g[m]=v0+(v1-v0)*(t[m]-t0)/(t1-t0)
ramp(52.4,53.3,1.0,0.55); g[(t>=53.3)&(t<56.0)]=0.55; ramp(56.0,56.9,0.55,0.0); g[t>=56.9]=0
buf*=g[:,None]
# final ring-out hit from B_1 tail after 'Are you?'
tail=B[int((len(B)/sr-5.2)*sr):]
st=int(57.95*sr); n=min(len(tail),len(buf)-st); buf[st:st+n]+=tail[:n]*0.9
buf=buf[:int(TOTAL*sr)]
sf.write('music/score_edit.wav',buf,sr)
