# Hinton Studios — "Dream in 4K" Instagram reel (2026)

**v4 — 83.6 seconds.** A Vox-style motion-graphics promo that runs from Dadasaheb Phalke's 1913
hand-cranked camera through the talkies, India's many-language industries, the dialogues a nation
knows by heart, and 2026. It ends on Muskan and a 2D-animated Hinton Studios logo: *Dream in 4K.
Create with AI.* Earlier cuts (v1 60 s, v3 90 s) are kept in `out/` for reference.

This folder is self-contained and is **not part of the Next.js site build**; eslint ignores `video/**`.

| Deliverable | File |
|---|---|
| Reel master · 1080×1920 (9:16) · 30 fps · H.264 + AAC 48 kHz · −14 LUFS | `out/hinton-reel-9x16.mp4` |
| Feed cut · 1080×1440 (3:4 centre crop, the whole layout is built to survive it) | `out/hinton-reel-3x4.mp4` |
| Cover options | `out/cover-*.jpg` |
| v3 (90 s) and v1 (60 s), kept for reference | `out/hinton-reel-v3-90s-*.mp4`, `out/hinton-reel-v1-60s-*.mp4` |

## v4 (current encode)

The narration and screenplay are unchanged. v4 tightens the cut to the music and rebuilds the sound.

### Sound: one continuous, resonant score
- **Music first, bar-locked** (`tools/music_edit_v4.py`). Every join is an equal-power crossfade on
  a downbeat found by beat tracking. Section entrances rise out of reverse-reverb swells built from
  the incoming music, so nothing starts cold. A seamless three-bar jump (timbre match 0.92) extends
  the anthem instead of time-stretching it.
- **The music breathes with the story.** It inhales under "wept". A paulstretched drone grown from
  the dark sting holds the tension under "a thousand never did". The last bar before the final chord
  dissolves to a low-passed whisper for "Are you?", then the chord lands in full with the logo and
  blooms into a seven-second sustain.
- **Designed SFX in one room** (`tools/audiokit.py`, `tools/sfx_v4.py`). Every sound is drawn with
  a smooth attack and sent to the same synthetic hall as the score:
  - whooshes shaped to peak on the cut, sub drops only on the big hits
  - the film burning, the HOUSEFULL neon buzzing on with its flicker, a marquee swish per dialogue card
  - coin tings and paper for the headlines
- **An ambience bed from the clips' own sound**: the projector, crank camera, painter's street,
  festival crowd, dawn queue, whistles, rain and the Bengaluru rooftop. It is crossfaded shot to
  shot, low-passed and lightly reverberant, so every cut is carried by sound and there is no dead air.
- **Mix** (`tools/mix_v4.py`):
  - Dialogue is ridden line by line to one level (±4 dB clip gain, moved only between lines).
  - The music ducks slowly (−5.5 dB, 250 ms look-ahead, 700 ms hold, ≈0.85 s release) with a
    1–4 kHz spectral dip, so the voice cuts through without pumping.
  - Every line sits **≥ 10.6 dB above the bed in the speech band**.
  - Glue compression, then two-pass loudness to −14 LUFS / −1.5 dBTP (LRA ≈ 6 LU).

### Picture: motion in every frame
- **Silent-era irises**: out of the camera print, and out of the intertitle into *Alam Ara*.
- **The film burns into colour**: on the language map the projector jams, the frame freezes and
  shudders, blisters, then burns open. Through the hole is the hand-painted billboard in full
  colour, landing on the music's colour hit at 17.63 s.
- **"Temples for their stars"** now plays over the festival mural clip instead of a still.
- **The lines a nation knows by heart**: seven marquee cards, one every two beats, each with its
  own animated motif, the dialogue in its original script, and a Vox year ruler:
  - *Sholay* (hills at sunset) and *Deewaar* (coins thrown down)
  - *DDLJ* (a swaying mustard field) and *Padayappa* (a sunrise)
  - *Narasimham* (light from above) and *Wanted* (police tape)
  - *Pushpa* (rising sparks)
- **HOUSEFULL** is a neon sign that flickers on (buzz and thud in sync) above the dawn queue.
- **2026** arrives with a shockwave ring and an anamorphic flare, over the rain-soaked dreamer.
- **Hinton Studios. Dream in 4K.** The festival night plays as a moving colour mosaic behind the
  title. The billboard clip then resolves SD → HD → 4K with scan wipes, nested resolution outlines
  and a live megapixel counter.
- **Create with AI.** A match cut makes the 4K frame one tile in a wall of fifteen generated worlds,
  which denoise with typed prompts as the camera pulls back.
- **Muskan**: one continuous take of her video only (no stills, no slow motion). A focus pull opens
  on the beat. "The visionaries are already here" rises word by word; "Are you?" lands as she turns
  to camera and smiles. Cut to the logo on the final chord.
- A moving layer under every graphics scene: the projector behind the map, the dreamer behind 2026,
  a drifting star field behind the globe, and Ken Burns inside every portfolio tile.

### v4.1 final polish (from a frame-by-frame review)
- **Logo lands on the chord.** The whole H glows on the final hit, then the blueprint trace, light fill and wordmark play about 35% faster. The chime and air swell are re-timed to the fill and the wordmark.
- **"Hinton Studios":** the title now sits over a moving LED wall (one rounded bulb per pixel of the festival clip) instead of a blurry mosaic. Viewfinder ticks replace the lines that crossed the title.
- **SD → HD → 4K:** each resolution label appears as its frame arrives. A soft swish marks each step.
- **Create with AI:** the tiles resolve like a diffusion model (grain over a blurred, colour-rich picture, sharpening into the clip) instead of TV static.
- **Languages map:** pins run in order of each language's first talkie, and the HUD year follows them (1931 → 1963).
- **Dialogue cards:** a darker base and shadows under every name and film line. The DDLJ sky and horizon haze are calmer behind the text.
- **The camera is your imagination:** the labels no longer overlap, and the generation readout sits inside the frame as a pill.
- **Flashes:** the white flash under "Until now" is almost gone. The 2026 flash clears faster, so the red slam stays saturated.
- **Holds:** the "one film that got made" clip now breathes with a slow push and projector glow, and the intertitle keeps drifting.

### v4 structure (83.6 s)

| Time | Beat |
|---|---|
| 0.0–6.8 | Leader → **1913** → Phalke's camera, *Raja Harishchandra* (iris out) |
| 6.8–13.4 | Pictures that move (iris) → *Alam Ara* 1931 → first film song |
| 13.3–17.6 | Every language we dream in → the reel jams and **burns into colour** |
| 17.3–23.3 | We turned our heroes… into **Gods.** → temples for their stars |
| 23.2–30.1 | **The lines a nation knows by heart** (7 cards, 1975 → 2021) |
| 30.0–38.9 | Queued before sunrise (neon HOUSEFULL) · Whistled · Wept · coins at the screen → headlines 1956–2023 |
| 38.9–49.9 | Permission → 1 in 1,000 → Until now |
| 49.9–58.4 | **2026** · nothing has changed → the camera is your imagination |
| 58.3–65.9 | Small budgets · impossible dreams → Made in India, for the world |
| 65.8–71.0 | Hinton Studios · Dream in **4K** (SD → HD → 4K) → Create with **AI** (tile wall) |
| 71.0–76.1 | Muskan: the visionaries are already here. *Are you?* |
| 76.1–83.6 | Logo on the final chord; tagline, hintonstudios.com |

### Why the stars appear as their words, not their faces
The brief asked for photos of Shah Rukh Khan, Salman Khan, Amitabh Bachchan and others. They are
not used. Indian courts have granted these actors personality-rights protection against
unauthorised commercial use of their name, image and likeness (Amitabh Bachchan, Delhi High Court,
2022, and later orders for other stars), and the supplied film stills are copyrighted frames with
third-party watermarks. Using them in an ad would imply an endorsement.

The wall instead quotes each star's most famous line, short and attributed, with the film and year.
It uses no likeness and no film frames. Before paid promotion, have counsel confirm the quotations
and names. Licensed photography can replace a card's motif in `LINES` in `comp/scenes.js`.

## v3 update (90 s, superseded by v4)

- **All 14 Kling 3.0 motion clips are in the cut** (sources in `media/`, frame sequences built by `tools/prep_media.sh` at native aspect), with their diegetic sound: projector, crank camera, talkie, dance, billboard painter, milk abhishekam, first-day-first-show crowd (from 3.5 s, past the AI signage), dawn queue, whistling audience, the tear, scripts desk, dreamer, and Muskan (her smile to camera also carries "Are you?").
- **The coin shot is pure motion graphics now**, replacing the coin clip: a perspective cinema screen playing the abhishekam, a projector beam with dust, rows of silhouetted fans, 46 vector coins (25 paise / 50 paise / ₹1) arcing into the screen with motion trails and spark hits, Vox labels, and a "single-screen ovation" card.
- **Score rebuilt** (`tools/music_edit_v3.py`): five long, continuous passes from the original Lyria cues, with no time-stretching. Joins fall only on hits or in silence. The vintage theme now starts after "1913" so its hit lands exactly on the colour slam.
- **Mix and master rebuilt** (`tools/mix_v3.py`):
  - Dry vocal chain: high-pass, de-mud, presence, de-esser, gentle compression; the echo is removed.
  - Smooth voice-driven ducking (look-ahead, about 50 ms down and 280 ms up) instead of the pumping sidechain. The voice sits ≥7.6 dB above the bed in the speech band on every line.
  - A leaner SFX pass (`tools/sfx_v3.py`).
  - Glue compression, then two-pass loudness to −14 LUFS / −1.5 dBTP (LRA ≈ 4 LU).
- **Logo finale redone:** no fragment assembly. The crosshair extends, the H is traced as fine blueprint lines and then fills with light while settling into focus. The brackets glide in from the corners, one light sweep crosses the mark, and the wordmark's tracking closes as it rises.

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
tools/prep_media.sh                                       # clips in media/ → 30 fps frame sequences + manifest
node tools/render.mjs --out frames --workers 4            # ~11 min, 2508 frames
node tools/render.mjs --out stills --times 17.5,68.4      # spot-check stills
python3 tools/vo_build_v3.py                              # narration re-timed to the 83.6 s picture
python3 tools/music_edit_v4.py                            # bar-locked score
python3 tools/sfx_v4.py                                   # designed SFX + hall send
python3 tools/mix_v4.py                                   # → audio/mix.wav + mix.flac (−14 LUFS)
tools/encode.sh                                           # 2-pass H.264: 9:16 master (4.8 Mb/s) + 3:4 crop (4.2 Mb/s)
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

### v4 notes

- **Dialogue wall:** seven short, attributed quotations (Sholay, Deewaar, DDLJ, Padayappa,
  Narasimham, Wanted, Pushpa), shown in romanised form and in their original script, with the
  film and year. No photographs, film frames or likenesses of the actors are used.
- **Footage:** all motion footage is AI-generated with Kling 3.0 (Higgsfield) for this reel. The
  milk-abhishekam clip shows a painted cut-out hero; have it checked for accidental resemblance to
  a real actor before paid promotion. Muskan is Hinton's own mascot.
- **Narration:** the original Charon take, re-timed (`tools/vo_build_v3.py`). Every splice falls
  in a natural pause (−51 to −84 dB at the cut).
