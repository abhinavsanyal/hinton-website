import os, sys, struct, json, time
from google import genai
from google.genai import types

def to_wav(pcm, rate=24000, bits=16):
    ba = bits // 8
    hdr = struct.pack("<4sI4s4sIHHIIHH4sI", b"RIFF", 36 + len(pcm), b"WAVE", b"fmt ", 16, 1, 1, rate, rate * ba, ba, bits, b"data", len(pcm))
    return hdr + pcm

def tts(text, style, voice, out, model="gemini-3.8-flash-tts", temperature=1.0):
    client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])
    contents = [types.Content(role="user", parts=[types.Part(text=text, speech_metadata=types.SpeechMetadata(style=style))])]
    cfg = types.GenerateContentConfig(temperature=temperature, response_modalities=["audio"],
        speech_config=types.SpeechConfig(voice_config=types.VoiceConfig(prebuilt_voice_config=types.PrebuiltVoiceConfig(voice_name=voice))))
    audio = bytearray(); mime = ""
    for attempt in range(4):
        try:
            for ch in client.models.generate_content_stream(model=model, contents=contents, config=cfg):
                if ch.parts is None: continue
                p = ch.parts[0]
                if p.inline_data and p.inline_data.data:
                    audio.extend(p.inline_data.data); mime = p.inline_data.mime_type
            break
        except Exception as e:
            print("retry", e, file=sys.stderr); audio = bytearray(); time.sleep(3 * (attempt + 1))
    rate = 24000
    for part in mime.split(";"):
        part = part.strip()
        if part.startswith("rate="): rate = int(part[5:])
    open(out, "wb").write(to_wav(bytes(audio), rate))
    print(out, mime, round(len(audio) / (rate * 2), 2), "s")

if __name__ == "__main__":
    job = json.loads(sys.argv[1])
    tts(**job)
