import os, sys, json, time
from google import genai
from google.genai import types
client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])
def gen(name, prompt, model="lyria-3-clip-preview"):
    for attempt in range(4):
        try:
            r = client.models.generate_content(model=model, contents=prompt)
            n=0
            for p in r.candidates[0].content.parts:
                if p.inline_data and p.inline_data.data:
                    mt=p.inline_data.mime_type; ext = "mp3" if "mp" in mt else ("wav" if "wav" in mt else mt.split('/')[-1])
                    open(f"music/{name}{'_'+str(n) if n else ''}.{ext}", "wb").write(p.inline_data.data); print("ok", name, mt); n+=1
                elif p.text: print("text", name, p.text[:300])
            if n: return
        except Exception as e:
            print("retry", name, str(e)[:300]); time.sleep(5*(attempt+1))
if __name__ == "__main__":
    jobs = json.load(open(sys.argv[1]))
    from concurrent.futures import ThreadPoolExecutor
    with ThreadPoolExecutor(8) as ex: list(ex.map(lambda j: gen(**j), jobs))
