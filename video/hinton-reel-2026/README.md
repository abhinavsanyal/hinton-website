# Hinton Studios — "Dream in 4K" Instagram reel (2026)

**v2 — 90 seconds.** A Vox-style motion-graphics promo that runs from Dadasaheb Phalke's 1913
hand-cranked camera through the talkies, India's many-language industries, the superstar era and
2026. It ends on a 2D-animated Hinton Studios logo: *Dream in 4K. Create with AI.*
(v1 was the 60-second cut. Its encodes are superseded, and it remains in git history.)

This folder is self-contained and is **not part of the Next.js site build**; eslint ignores `video/**`.

| Deliverable | File |
|---|---|
| Reel master · 1080×1920 (9:16) · 30 fps · H.264 + AAC 48 kHz · −14 LUFS | `out/hinton-reel-9x16.mp4` |
| Feed cut · 1080×1440 (3:4 centre crop, the whole layout is built to survive it) | `out/hinton-reel-3x4.mp4` |
| Cover options | `out/cover-*.jpg` |
| v1 (60 s) Reel + feed cut, kept for reference | `out/hinton-reel-v1-60s-9x16.mp4`, `out/hinton-reel-v1-60s-3x4.mp4` |

## v2 structure (90.0 s)

| Time | Beat | What's new in v2 |
|---|---|---|
| 0.0–13.4 | Silence → sound (1913, Alam Ara, first film song) | Video slots inside the prints and filmstrip; data chips (₹15,000 budget, ≈40 min, ≈16 fps hand-cranked; Majestic Cinema, 14 Mar 1931; first film song) |
| 13.3–17.0 | Every language | Map dots heat up around each pin; "More films than any nation on Earth" stat card |
| 17.5–23.5 | Heroes into gods | Colour slam on the hit; full-bleed billboard-painter and milk-abhishekam shots; kinetic type; "temples for their stars" insert |
| 23.5–30.0 | **Star wall (new)** | 16 superstar cards from the 1970s to the 2000s across 7 languages: name, signature film, year and verified notes (Deewaar's Angry Young Man, Nayakan on TIME's All-Time 100, DDLJ's 1,000+ weeks, Lagaan's Oscar nomination, Bhojpuri revival…), one per beat at 124 BPM |
| 30.0–38.9 | Queued · whistled · wept · coins | FDFS clock (03:00 → 05:40), HOUSEFULL stamp, shockwave, the tear, slow-motion coins, then a Vox timeline of six real headlines, 1956 → 2023 |
| 38.9–49.9 | Permission → 1 in 1,000 → Until now | Scripts shot, four gatekeeper stamps; the "one film" is a live clip that shrinks into the grid |
| 49.9–58.7 | 2026 · the camera is your imagination | New "only the tools changed" camera-evolution row (flat Vox icons); a denoise generation with a live progress readout |
| 58.6–67.7 | Small budgets · impossible dreams · made in India | 3D tilted parallax wall of Hinton frames; the globe now has shading, graticule, atmosphere and city labels |
| 67.7–74.7 | Hinton Studios · Dream in 4K · Create with AI | Pixel-mosaic → 4K resolve; nine "generated worlds" tiles resolving from noise |
| 74.6–80.5 | The visionaries… Are you? | Muskan with focus pull and viewfinder; "Are you?" over her portrait |
| 80.5–90.0 | **2D logo finale (new)** | The 17 real H-mask shards fly in on springs, the crosshair zips, brackets snap, shine sweep, wordmark, tagline, URL. The 3D sting clip is no longer used |

### Motion clips (Higgsfield · Kling 3.0)

Fourteen image-to-video / text-to-video clips were generated for v2. They are listed in
`tools/media_urls.tsv`: projector, crank camera, talkie, dance, billboard painter, milk abhishekam,
dawn queue, whistling audience, the tear, slow-motion coins, dreamer, Muskan, a first-day-first-show
crowd and the scripts desk. Three extra stills are also listed: Muskan in the studio, Muskan's
portrait, and a star seen from behind.

The composition has a slot for each clip and falls back to the source still with a camera move.
This cloud environment's egress policy blocks the Higgsfield result host
(`d8j0ntlcm91z4.cloudfront.net`), so **the committed v2 encode uses the still fallbacks**. To drop
the clips in:

```bash
tools/prep_media.sh          # downloads the clips, extracts 30 fps frames, writes assets/data/manifest.js
node tools/render.mjs --out frames --workers 4
```

Then re-mux with the ffmpeg line below. It needs network access to that host: allow it in the
environment settings, or run the two commands on any machine.

## v1 screenplay (60 s, as recorded; v2 re-times the same narration with longer pauses)

| Time | Narration (Gemini 3.8 Flash TTS · voice *Charon*) | Picture |
|---|---|---|
| 0.0 | — | Film-leader countdown, projector spins up |
| 0.95 | "Nineteen thirteen." | **1913** slams in over a projection booth, B&W, grain, flicker |
| 3.0 | "A man in Bombay bet everything he had…" | Hand-cranked camera print, Vox red circle, *Raja Harishchandra* clipping, Phalke label |
| 6.2 | "…on pictures that move." | Racing 35 mm strip + silent-film intertitle |
| 8.6 | "Then, they learned to speak," | *Alam Ara* 1931, live voice waveform, "100% TALKING!" |
| 10.9 | "to sing," | Hand-tinted 1950s dance print (colour begins to bleed in) |
| 12.0 | "in every language we dream in." | Dotted subcontinent; Bengali, Tamil, Telugu, Marathi, Kannada, Malayalam, Bhojpuri and Hindi pins, each with its first film and year |
| 14.7 | "We turned our heroes into gods," | Colour slam on the music hit: sunburst, milk abhishekam on a cut-out, billboard painter, marquee of legends, **GODS.** |
| 18.0 | "queued before sunrise, whistled, wept," | FDFS queue + HOUSEFULL stamp → WHISTLED! → *Wept.* |
| 21.5 | "threw coins at the screen." | Coins fly at the lens; clippings flurry (Pather Panchali 1956 … Naatu Naatu 2023) |
| 23.8 | "But every dream needed permission." | Cold grade; scripts stamped REJECTED / NO BUDGET / NOT NOW |
| 26.4 | "For every film that got made, a thousand never did." | Data viz: one lit frame, then 1,000 dark ones |
| 31.6 | "Until now." | Silence; Hinton crosshair; the 1,000 frames ignite red; white-out |
| 34.9 | "Nothing has changed. Only now, the camera is your imagination." | **2026**; the 1913 camera turns into a prompt → generate → image resolves |
| 39.8 | "Here's to the ones with small budgets… and impossible dreams." | Accelerating strip of real Hinton frames under SMALL BUDGETS / IMPOSSIBLE DREAMS |
| 44.3 | "Made in India. For the world." | Bengaluru HQ pin → dotted globe, arcs to 14 world cities |
| 47.5 | "Hinton Studios. Dream in 4K. Create with AI." | Hinton's own 3D metal logo sting (retimed so the H locks on "Studios") + tagline |
| 53.3 | "The visionaries are already here… Are you?" | Muskan (mascot) on a Bengaluru rooftop, viewfinder overlay; hard cut, ARE YOU?; end card + hintonstudios.com |

The spine borrows the "Think Different" cadence: history as a roll call, one turn ("Until now"),
then an invitation.

## Pipeline

```
preproduction (tools/preproduction)          composition (comp/)                 finishing (tools/)
────────────────────────────────────         ──────────────────────────          ───────────────────────────
tts.py      Gemini 3.8 Flash TTS, 3 takes    index.html + lib.js + scenes.js     render.mjs  headless Chromium,
            + 4 pickups; picked by ear       + main.js: every frame is a pure    4 workers → JPEG frames
vo_build.py cut take 3 at silences, 1.07×    function of t (springs, eases,      sfx.py      procedural SFX + logo
            rubberband, re-spaced to picture seeded noise); no CSS transitions   sting audio
genmusic.py Lyria 3 Pro score (instrumental)                                     mix.sh      VO chain, side-chain duck,
music_edit.py bar-accurate edit: +1 bar                                                      −14 LUFS / −1 dBTP
            celebration, drop moved to 34.57 s                                   ffmpeg      2-pass H.264, 9:16 + 3:4
genimg.py   Gemini 3 Pro Image archival stills
land.mjs    Natural Earth land → dot grid (no borders drawn)
```

### Re-render

Requires Node 22 with Playwright's Chromium, ffmpeg (with librubberband), Python 3.11 with `numpy`,
`scipy` and `soundfile`, and `google-genai` only for preproduction. Fonts are bundled in
`comp/assets/fonts` (OFL/Apache).

```bash
cd video/hinton-reel-2026
node tools/render.mjs --out frames --workers 4            # ~6 min, 2700 frames
node tools/render.mjs --out stills --times 17.2,49.8      # spot-check stills
python3 tools/vo_build_v2.py && python3 tools/music_edit_v2.py   # narration + score (90 s)
python3 tools/sfx_v2.py x audio/sfx.wav
tools/mix_v2.sh                                           # → audio/mix.wav + mix.flac
ffmpeg -framerate 30 -i frames/f_%05d.jpg -i audio/mix.wav -c:v libx264 -b:v 7M -pix_fmt yuv420p \
       -c:a aac -b:a 256k -movflags +faststart out/hinton-reel-9x16.mp4
# 3:4: add -vf crop=1080:1440:0:240
```

The preproduction scripts read `GEMINI_API_KEY` from the environment. **Never commit a key.**
Prompts used are in `tools/preproduction/prompts/`.

## Rights & review notes

- **No real people are depicted.** All archival-looking stills are AI-generated. They show
  anonymous crew, crowds and fictional painted heroes. Real directors, stars and musicians appear
  **only as names** in the tribute marquee. Have the painted cut-out face in `milk.jpg` reviewed
  for accidental resemblance before paid promotion.
- Newspaper mastheads are invented ("The Picture Herald", "Film Gazette", "The Screen Daily"). The
  headlines are historical facts: Raja Harishchandra 1913, Alam Ara 1931, Pather Panchali at Cannes
  1956, Mayabazar 1957, Mother India's Oscar nomination 1958, Sholay's five-year Minerva run,
  Baahubali 2 passing ₹1,000 crore in 2017, and Naatu Naatu's Oscar in 2023.
- The subcontinent and globe are drawn as land-only dot fields with **no political borders**.
- The montage uses only portfolio frames that are currently public on the site. Nishiddham,
  Superstar and the related portfolio-5/6 frames are excluded. Brand names are not shown on cards.
- Music was generated with Lyria 3 Pro as an instrumental. SFX were synthesised procedurally. The
  logo sting audio is Hinton's own asset.

### v2 notes

- **Star wall:** real names appear as text only, with signature films and years. No photographs or
  AI likenesses of real actors are used; that would need licensed photography and personality
  rights. Licensed stills can go into the card slots in `STARS` in `comp/scenes.js`.
- **Narration:** v2 re-times the original Charon take. The Gemini key's prepaid credits were
  exhausted, so no new lines were recorded.
- **Score:** built only from the three Lyria cues in `audio/sources/`, edited on hits
  (`tools/music_edit_v2.py`). Lyria was unavailable for new music.
- **GSAP:** GSAP 3.15 (`comp/vendor/`) is used only as a deterministic easing library.
