import os, sys, json, time
from google import genai
from google.genai import types
client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])
def gen(name, prompt, aspect="3:4", refs=(), model="gemini-3-pro-image"):
    parts = [types.Part.from_bytes(data=open(r,"rb").read(), mime_type="image/png" if r.endswith("png") else ("image/webp" if r.endswith("webp") else "image/jpeg")) for r in refs]
    parts.append(types.Part(text=prompt))
    for attempt in range(5):
        try:
            r = client.models.generate_content(model=model, contents=[types.Content(role="user", parts=parts)],
                config=types.GenerateContentConfig(response_modalities=["IMAGE"], image_config=types.ImageConfig(aspect_ratio=aspect, image_size="2K")))
            for p in r.candidates[0].content.parts:
                if p.inline_data and p.inline_data.data:
                    ext = "png" if "png" in p.inline_data.mime_type else "jpg"
                    open(f"img/{name}.{ext}", "wb").write(p.inline_data.data); print("ok", name, ext); return
            print("noimg", name, r.text if hasattr(r,'text') else r)
        except Exception as e:
            print("retry", name, str(e)[:200]); time.sleep(6*(attempt+1))
if __name__ == "__main__":
    jobs = json.load(open(sys.argv[1]))
    from concurrent.futures import ThreadPoolExecutor
    with ThreadPoolExecutor(6) as ex:
        list(ex.map(lambda j: gen(**j), jobs))
