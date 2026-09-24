import os, sys, glob
from google import genai
from google.genai import types
client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])
def listen(files, prompt, model="gemini-3.1-pro-preview"):
    parts = []
    for f in files:
        parts.append(types.Part(text=f"FILE: {os.path.basename(f)}"))
        mt = "audio/wav" if f.endswith(".wav") else ("audio/mpeg" if f.endswith(".mp3") else "video/mp4")
        parts.append(types.Part.from_bytes(data=open(f,"rb").read(), mime_type=mt))
    parts.append(types.Part(text=prompt))
    import time
    for m in [model, "gemini-3.1-pro-preview", "gemini-3.5-flash", "gemini-3.8-flash", "gemini-2.5-pro"]*2:
        try:
            r = client.models.generate_content(model=m, contents=[types.Content(role="user", parts=parts)])
            return f"[{m}]\n" + r.text
        except Exception as e:
            print("fail", m, str(e)[:120]); time.sleep(4)
if __name__ == "__main__":
    print(listen(sorted(glob.glob(sys.argv[1])), sys.argv[2]))
