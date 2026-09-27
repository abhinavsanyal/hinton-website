import type { Article } from "./article-types";

export const featuredArticles: Article[] = [
  {
    "slug": "opus-5-5-blender-previz-seedance",
    "title": "Your first camera move starts in Blender. AI lowers the barrier.",
    "category": "Production lab",
    "service": "ai-storyboards-and-moodboards",
    "description": "A beginner-friendly Opus 5.5, Blender and Seedance 2.5 workflow for blocking a scene, planning a camera move and building a useful reference.",
    "published": "2026-09-27",
    "featured": true,
    "cover": "/assets/blog/previz.webp",
    "coverAlt": "Clay film set, camera lens and a red camera path on a technical grid.",
    "diagram": "/assets/blog/previz-diagram.svg",
    "diagramAlt": "Workflow: describe a shot, build a Blender blockout, render a reference, generate, then compare the result.",
    "takeaway": "Use AI to make a controllable plan sooner. Keep human review between the plan and the finished shot.",
    "sections": [
      {
        "heading": "The expensive mistake is a beautiful shot that does not cut",
        "body": "A camera glides around an actor. The light looks gorgeous. Then the next shot arrives, and the actor is looking in the wrong direction. The image works; the scene does not. Previsualisation exists to catch that problem before a production commits to expensive detail.\n\nFor a beginner, the breakthrough is not instantly becoming a 3D artist. It is being able to make a rough scene that answers useful questions: Where is the character? What can the camera see? When does the reveal happen? This is a proposed production exercise, not a claim that we have benchmarked these models against a professional previz team.",
        "sources": []
      },
      {
        "heading": "What the tools actually contribute",
        "body": "Anthropic positions Opus 5.5 as a coding and computer-use model. Blender exposes scene operations through Python. ByteDance documents clay-render referencing in Seedance 2.5, including blocking and camera movement. Put together, they suggest a practical route from a written brief to a controllable reference.\n\nThe important distinction: a generated reference is not an interchange file containing your exact Blender camera transforms. Treat the output as an interpretation to evaluate, not a solved camera track. A model can help draft a script; you still need a compatible Blender version, a working render and someone reviewing the frames.",
        "sources": [
          {
            "label": "Anthropic: Introducing Claude Opus 5.5 (22 September 2026)",
            "url": "https://www.anthropic.com/claude-opus-5-5"
          },
          {
            "label": "Blender: Python API quickstart",
            "url": "https://docs.blender.org/api/4.4/info_quickstart.html"
          },
          {
            "label": "ByteDance Seed: Seedance 2.5 launch and reference examples (31 July 2026)",
            "url": "https://seed.bytedance.com/en/blog/one-take-creation-flexible-referencing-introducing-seedance-2-5"
          }
        ]
      },
      {
        "heading": "1. Write a shot that can be built from five objects",
        "body": "Start with a six-second reveal: a person walks past a doorway while the camera moves sideways to reveal a product on a table. Use a floor, wall, doorway, table and simple character stand-in. Do not ask for realistic skin, elaborate clothes or a detailed city. Those details make it harder to judge the thing you are testing.\n\nChoose the frame shape before the camera move. A portrait ad and a widescreen film need different staging. Write the opening composition and final composition in plain English, then decide which subject must remain visible between them.",
        "sources": [],
        "prompt": "Help me build a non-destructive Blender previz script for my installed Blender version. Create a new collection named Shot_01; do not delete existing objects. Use simple clay primitives: floor, doorway, table, product stand-in and character. Set 24 fps and frames 1–144. Start with the doorway obscuring the product; move the camera sideways to reveal it by frame 120. Keep the character on screen. Expose camera height, travel distance and timing as named settings. Explain how to run the script, inspect its keyframes and undo it."
      },
      {
        "heading": "2. Make Blender readable before making it pretty",
        "body": "Run the proposed script in a copy of your scene and inspect the result in camera view. If it fails, give the assistant the actual error and your Blender version. Ask it to fix the smallest failing part. Repeatedly replacing the whole scene makes debugging harder and can hide accidental changes.\n\nScrub the beginning, middle and end. Check feet against the floor, camera clearance, screen direction and the moment the product appears. A subject passing behind a wall is a blocking problem, not a prompting problem. Fix it in the controllable scene. Save the approved project and render a low-cost reference with simple materials. This reference is your visual agreement about what the shot must do.",
        "sources": []
      },
      {
        "heading": "3. Give movement and appearance separate jobs",
        "body": "In the Seedance interface available to you, attach the clay render as the motion and composition reference. Supply a separate, rights-cleared style frame for appearance. Assign each input one job. A finished-film reference full of unrelated actors, lighting and editing can introduce more ambiguity than it removes.\n\nTry a focused instruction: “Use the clay reference for camera travel, subject position and reveal timing. Use the style frame for surface materials and lighting. Keep the doorway reveal and the final product framing.” Avoid asking for a faster camera, different blocking and a new set in the same revision. Reference labels and available settings vary by host; use the labels shown in your interface.",
        "sources": []
      },
      {
        "heading": "4. Compare landmarks, not just atmosphere",
        "body": "Place the reference and generated clip side by side. At the start, midpoint, reveal and last frame, compare subject position, horizon, occlusion and screen direction. Check whether the movement supports the edit. If the product changes shape, use an approved product asset or a conventional composite for that element.\n\nKeep a brief review sheet: intended moment, observed deviation, proposed correction. This makes the next iteration specific. If exact geometry, repeatability or client revisions are essential, retain the 3D render as the production source instead of forcing a generative clip to behave like a renderer.",
        "sources": []
      },
      {
        "heading": "Where Hinton can help",
        "body": "Bring a script page, a rough sketch or a difficult transition. Hinton can scope storyboard development, camera blocking and a short proof of concept before the full film. The useful deliverable is an approved sequence with clear decisions—not a folder of unrelated attractive frames.\n\nThe beginner exercise is deliberately small. Once you can explain why the first shot works, add a reverse angle, an eyeline match and a cut. That is how a camera move becomes filmmaking.",
        "sources": []
      }
    ]
  },
  {
    "slug": "seedance-2-5-prompting-guide",
    "title": "Stop writing “cinematic”. Start directing Seedance 2.5.",
    "category": "Practical guide",
    "service": "ai-ad-film-production",
    "description": "A practical Seedance 2.5 prompting tutorial: build a shot brief, assign references, write timed action and diagnose the result without prompt overload.",
    "published": "2026-09-27",
    "featured": true,
    "cover": "/assets/blog/prompting.webp",
    "coverAlt": "A red subject under a spotlight surrounded by reference cards and timeline cues.",
    "diagram": "/assets/blog/prompting-diagram.svg",
    "diagramAlt": "Six-part prompting framework: subject, action, camera, scene, timing and sound.",
    "takeaway": "A useful prompt assigns responsibility: what moves, what stays fixed, which reference controls what, and when the payoff happens.",
    "sections": [
      {
        "heading": "A prompt is a set of production decisions",
        "body": "“Epic, cinematic, stunning, ultra-realistic” tells you almost nothing about a shot. Who moves first? Where does the camera start? What should the audience notice? Those are the decisions that make a video feel intentional.\n\nThis tutorial uses an imaginary, unbranded desk lamp advertisement. The prompts are original starting points, not tested presets or guaranteed outputs. Keep the first exercise simple enough that you can identify what went wrong. A single readable action is a better teacher than a thirty-second montage with ten competing demands.",
        "sources": []
      },
      {
        "heading": "Know the documented capability—and your actual interface",
        "body": "ByteDance’s Seedance 2.5 announcement describes generation up to 30 seconds, multimodal references and timestamp-based editing. It also demonstrates clay-render reference inputs. Those are vendor-described capabilities, not a guarantee that every access provider exposes identical controls, limits or availability.\n\nSelect Seedance 2.5 explicitly where available. Check your host’s accepted reference types and duration settings before drafting the shot. Set aspect ratio and duration in the interface when it provides those controls; do not assume a sentence in a prompt overrides the actual settings.",
        "sources": [
          {
            "label": "ByteDance Seed: Seedance 2.5 launch and reference examples (31 July 2026)",
            "url": "https://seed.bytedance.com/en/blog/one-take-creation-flexible-referencing-introducing-seedance-2-5"
          }
        ]
      },
      {
        "heading": "Step 1: decide what the shot must communicate",
        "body": "For our lamp, the proposition is “a quiet pool of light for focused work”. The action is one hand turning it on. The visual payoff is the light revealing a notebook. This gives the shot a beginning, change and resolution without requiring a complicated story.\n\nWrite a one-sentence acceptance test: “By the end, the lamp is on, the notebook is readable as an object, and the product silhouette is unchanged.” Acceptance criteria are more useful than endlessly adding style adjectives. They tell you when to stop generating.",
        "sources": []
      },
      {
        "heading": "Step 2: give every reference a single responsibility",
        "body": "Prepare one approved product image and one mood reference. If camera motion matters, add a simple movement reference rather than another unrelated beauty image. Name their responsibilities in the prompt: product geometry, lighting palette, or camera direction.\n\nUse the exact attachment labels your interface assigns. Do not paste example labels for files you have not uploaded. If two references disagree on product colour or shape, remove the conflict before generating. More references are not automatically more control.",
        "sources": [],
        "bullets": [
          "Product reference: shape, material, base and switch position.",
          "Mood reference: background colour, contrast and light quality.",
          "Motion reference, if needed: camera travel and reveal timing."
        ]
      },
      {
        "heading": "Step 3: write the first pass like a tiny shot list",
        "body": "The example below uses one camera move and one action. Its timing is a creative request; inspect whether the output follows it. Replace the bracketed attachment descriptions with the actual references in your chosen host.",
        "sources": [],
        "prompt": "Create a six-second, 16:9 product shot. Use [product image] for the exact lamp silhouette and [mood image] only for the warm lighting palette. A single desk lamp sits beside a closed notebook on a dark wooden desk. 0–2 seconds: medium close-up, lamp off, camera at desk height. 2–4 seconds: one hand enters from frame right and presses the switch once; a warm pool of light reveals the notebook. 4–6 seconds: the hand leaves; the camera completes a slow forward move and holds on the lamp. Keep the lamp, desk and notebook in the same positions. Quiet room tone and one switch click. No dialogue, music, captions or added logos."
      },
      {
        "heading": "Step 4: separate camera motion from subject motion",
        "body": "A dolly move changes the camera’s position. A zoom changes framing through the lens. A pan rotates the view. Asking for all three while a subject spins and the scene changes gives the model too many possible interpretations. Pick the movement that serves the reveal.\n\nIf the output invents a cut, explicitly request one continuous shot and simplify the action. If the subject drifts, describe a fixed position relative to a visible landmark. If the camera is too energetic, remove conflicting motion references before adding more words. When precision is essential, build the motion in Blender and use a reference-led approach.",
        "sources": []
      },
      {
        "heading": "Step 5: revise one variable and keep a record",
        "body": "Save the original prompt, settings, references and output. For the next attempt, change only the failing decision. “Keep the existing composition; make the switch action happen earlier” is a useful revision. “Make it more premium, faster, moodier and less artificial” changes too many things to diagnose.\n\nUse a simple scorecard: product fidelity, action readability, temporal continuity, camera intent and sound. Give each a pass or fail, with one sentence explaining why. This is an editorial tool, not a scientific benchmark. Track accepted shots and total attempts so you can estimate actual production cost.",
        "sources": []
      },
      {
        "heading": "Step 6: know when prompting should stop",
        "body": "A distorted logo belongs in a controlled graphic layer. A mechanically exact product turn may belong in 3D. A line of legal copy belongs in typography you can edit. A voice or likeness needs appropriate permission. Generating repeatedly is not always the cheapest or most reliable correction.\n\nBring the selected clip into an edit. Check the first and last frames against adjacent shots; inspect hands, reflections and background motion at normal speed and frame by frame. Listen without looking at the picture. Deliver only after the film works as a sequence, with the correct framing, colour, sound and export settings.",
        "sources": []
      },
      {
        "heading": "Turn the exercise into an actual campaign",
        "body": "Once the basic shot works, develop a second opening that tests a different audience hook while keeping the product benefit constant. Keep the landing page and offer consistent if you want a useful comparison. A model cannot tell you whether an ad caused a qualified enquiry without campaign measurement.\n\nHinton can turn a product brief into a reference pack, directed shot sequence and platform-specific edits. Share your approved product assets, intended audience, channels and deadline. That is a much better starting point than a demand for “viral AI video”.",
        "sources": []
      }
    ]
  },
  {
    "slug": "india-ai-filmmaking-market-opportunity",
    "title": "India’s AI film opportunity is bigger than a cheaper shoot.",
    "category": "Market perspective",
    "service": "ai-brand-films",
    "description": "The published numbers behind India’s media expansion—and where AI filmmaking could build a business without confusing ad spend with production revenue.",
    "published": "2026-09-27",
    "featured": true,
    "cover": "/assets/blog/india-market.webp",
    "coverAlt": "An editorial city of film screens, production stages and connected windows.",
    "diagram": "/assets/blog/india-market-diagram.svg",
    "diagramAlt": "Three separate 2025 market measures: media and entertainment INR 2.78 trillion; advertising INR 1.5 trillion; digital advertising INR 947 billion. Figures overlap and must not be added.",
    "takeaway": "The wider market is large. The AI-specific opportunity must be earned through repeatable work, credible pricing and customer demand.",
    "sections": [
      {
        "heading": "The next wave will be judged by what gets used",
        "body": "A spectacular demo can earn attention. A repeatable production process earns a second brief. India’s AI filmmaking opportunity sits in that gap: helping businesses turn good ideas into usable films, campaign variations and stories that travel across languages and screens.\n\nOur thesis is that AI-assisted production can widen the range of briefs a studio can economically serve. That is an argument about capability and demand, not evidence that a standalone billion-dollar Indian AI film market has already been measured.",
        "sources": []
      },
      {
        "heading": "Three market numbers worth keeping separate",
        "body": "FICCI–EY reports India’s media and entertainment revenue at INR 2.78 trillion in 2025, up 9%. Its March 2026 release places advertising at about INR 1.5 trillion and digital advertising at INR 947 billion. These are overlapping market measures, not three amounts to add together. They describe the surrounding economy, not AI film production revenue.\n\nThe same release projects total media and entertainment revenue of INR 3.3 trillion by 2028. That is a forecast for the wider sector. It does not establish an AI-specific growth rate, production budget or available contract pipeline.",
        "sources": [
          {
            "label": "FICCI–EY: India’s media and entertainment market, 2025 results (24 March 2026)",
            "url": "https://www.ey.com/en_in/newsroom/2026/03/india-s-media-and-entertainment-sector-grew-9-percent-to-inr-2-point-78-trillion-in-2025-driven-by-digital-and-live-experiences-ficci-ey-report"
          }
        ]
      },
      {
        "heading": "Why the opportunity feels different now",
        "body": "Consider a mid-sized brand with one strong product film. It may also need a portrait opening for social, a retailer version, a festival variation and regional-language adaptations. The challenge is not simply making another attractive clip. It is preserving the product, proposition and visual identity across all those versions.\n\nAI-assisted development makes it possible to explore more treatments before a production commits. Whether that becomes a commercial advantage depends on approval speed, consistency and finishing. A faster first draft with weeks of repair is not a faster delivery. Studios that track the whole process will have a more useful sales story than studios comparing only generation time.",
        "sources": []
      },
      {
        "heading": "Build a market model from briefs, not headlines",
        "body": "A credible business model starts with a reachable group of customers. How many have a real need, authority to approve a budget and a repeat purchase pattern? Multiply realistic paid projects by an achievable average fee. Then subtract acquisition costs, creative development, generation, rejected versions, compositing, sound and project management.\n\nFor illustration only, 100 clients buying four projects a year at INR 2 lakh per project would produce INR 8 crore of gross annual revenue before costs. This is arithmetic, not a forecast or a statement about Hinton’s clients. Changing repeat frequency or realised fees can matter more than a model becoming cheaper. A national billion-dollar thesis would need defensible assumptions for adoption, pricing and demand; these sources do not supply them.",
        "sources": []
      },
      {
        "heading": "Four places to look for useful demand",
        "body": "Product storytelling, localisation, campaign development and narrative proof of concept offer different routes to value. They should not be sold as one generic “AI video” package. A product close-up demands fidelity. A multilingual campaign demands language and performance review. A film pitch demands coherent story and staging.\n\nThe right offer names the business outcome and the review process. An approved launch sequence, a set of localised cutdowns or a funding-ready scene study is easier to evaluate than a promise of unlimited content. Before scaling, test whether customers accept the work, return with another brief and can explain the value.",
        "sources": [],
        "bullets": [
          "Brands: a product benefit made clear in a short, approved sequence.",
          "Agencies: alternative visual treatments before committing the campaign.",
          "Regional campaigns: adaptations reviewed by fluent speakers and local creatives.",
          "Filmmakers: storyboards, previz and a focused scene proof of concept."
        ]
      },
      {
        "heading": "What could hold the market back",
        "body": "Clients need clarity on source assets, usage rights, approval responsibilities and what can be revised. Inconsistent faces or products, unclear licensing, weak sound and unreliable turnaround can erase the appeal of a cheap first render. Distribution also matters: a film that nobody sees cannot justify its production cost through visibility alone.\n\nThe strongest offer will usually combine new tools with familiar accountability. Define the scope, show a reference sequence, agree approval gates and specify the deliverables. Keep a realistic correction budget. Treat AI capability as one part of a production business, not a substitute for one.",
        "sources": []
      },
      {
        "heading": "Hinton’s place in the opportunity",
        "body": "Hinton can help a brand start with a bounded project: a product film, a brand story or a small campaign package with agreed adaptations. The first conversation should establish audience, product truth, creative ambition and how success will be measured.\n\nIndia does not need another unqualified “billion-dollar AI” headline. It needs work that clients approve, audiences understand and teams can produce consistently. That is the opportunity worth building toward.",
        "sources": []
      }
    ]
  },
  {
    "slug": "india-vfx-jobs-ai-skills",
    "title": "AI is changing Indian VFX jobs. The craft still matters.",
    "category": "Careers & industry",
    "service": "ai-vfx-and-cgi",
    "description": "A grounded look at India’s animation and VFX market, task automation and the practical skills that can make a creative portfolio more useful.",
    "published": "2026-09-27",
    "featured": true,
    "cover": "/assets/blog/vfx-careers.webp",
    "coverAlt": "A human hand adjusts a compositing node network beside a cinematic frame.",
    "diagram": "/assets/blog/vfx-careers-diagram.svg",
    "diagramAlt": "Skills ladder: image craft, controllable tools, automation, and production judgement build on each other.",
    "takeaway": "Learn to judge and finish a shot. Add automation to that foundation rather than replacing the foundation with a prompt.",
    "sections": [
      {
        "heading": "The question is bigger than “Will AI take my job?”",
        "body": "A junior artist learning a compositing tool is not just learning where the buttons live. They are learning what a convincing edge looks like, how light behaves and why a shot feels wrong. Automation can change how a task is executed without removing the need to recognise whether the result works.\n\nThat does not make the employment transition painless. Pricing pressure, changing staffing patterns and fewer routine tasks can affect real livelihoods. But declaring every traditional tool obsolete is poor career advice. The more useful question is which responsibilities an artist can own as the production process changes.",
        "sources": []
      },
      {
        "heading": "The slowdown is not a clean AI experiment",
        "body": "The FICCI–EY 2026 report estimates India’s combined animation, VFX and post-production revenue at INR 105 billion in 2025, compared with INR 103 billion in 2024. Within the rounded table, animation falls from INR 29 billion to INR 27 billion, while VFX rises from INR 47 billion to INR 48 billion. These are revenue estimates, not employment counts.\n\nThe figures do not establish how many jobs AI displaced or created. Nor does a segment’s weakness prove a single cause. Production cycles, commissioning decisions and client budgets also matter. Treat a claim about an AI-driven employment collapse as a claim requiring evidence, not a conclusion hidden inside a market chart.",
        "sources": [
          {
            "label": "FICCI–EY 2026 report: animation, VFX and post-production tables",
            "url": "https://www.ey.com/content/dam/ey-unified-site/ey-com/en-in/insights/media-entertainment/2026/03/ey-stories-scale-and-impact-un-locking-indias-media-and-entertainment-economy.pdf"
          }
        ]
      },
      {
        "heading": "Exposure is not the same as redundancy",
        "body": "The ILO’s 2025 research estimates that one in four workers globally is in an occupation with some generative-AI exposure. Its central distinction is that continued human input makes job transformation more likely than wholesale replacement for most occupations. This is a global task-based study, not an Indian VFX hiring forecast.\n\nFor a studio, this suggests examining tasks before deleting job titles. Preparing versions, organising assets and drafting scripts may be candidates for assistance. Diagnosing why a composite fails, protecting continuity and taking responsibility for final approval remain substantial work.",
        "sources": [
          {
            "label": "ILO: Generative AI and jobs, 2025 update",
            "url": "https://www.ilo.org/publications/generative-ai-and-jobs-2025-update"
          }
        ]
      },
      {
        "heading": "Build a portfolio that shows decisions",
        "body": "A reel of polished final images tells a reviewer what you selected. A concise breakdown shows what you can control. Include the brief, reference, intermediate state, difficult failure and correction. Explain which parts were generated, which were built conventionally and which you personally finished.\n\nA useful exercise is a ten-second product scene with one deliberately hard element: a reflective object, a hand interaction or a moving shadow. Show how you solved it. Preserve editable files and organise the handoff. These are practical demonstrations of judgement and reliability, not claims that one exercise guarantees a job.",
        "sources": []
      },
      {
        "heading": "A learning path that does not throw away the foundations",
        "body": "Start with composition, perspective, timing, colour and sound. Then build competence in one controllable production tool. Add a generative workflow only when you can assess its output. Finally, automate a repeated task that you understand well enough to test.\n\nThe order matters. If you cannot recognise a bad track or a broken matte, generating more options will not teach you which one is acceptable. If you can, a coding assistant may help you build a batch operation, validation report or versioning tool that makes the rest of your work easier.",
        "sources": [],
        "bullets": [
          "Week 1: recreate a simple shot and explain its light, staging and camera.",
          "Week 2: build an editable composite or 3D blockout with a clean handoff.",
          "Week 3: add one generated element and document every correction.",
          "Week 4: package a breakdown, review checklist and reproducible project."
        ]
      },
      {
        "heading": "Where new responsibilities may emerge",
        "body": "A team experimenting with generative footage needs people who can curate references, review continuity, integrate outputs and keep track of permissions and versions. A technically inclined artist may also help connect tools or create reliable batch workflows. These are plausible areas of responsibility, not a verified list of open vacancies or salary bands.\n\nLikewise, a large media economy does not translate directly into a billion-dollar new job market. Revenue is not wages, and technology adoption is not guaranteed net employment growth. Candidates and employers deserve that distinction. Good workforce planning includes training, realistic supervision and clear ownership of final work.",
        "sources": []
      },
      {
        "heading": "What this means for a Hinton brief",
        "body": "For clients, the lesson is to choose a production partner for the quality of its decisions and final delivery. Ask how the team handles inaccurate products, broken continuity and late revisions. Ask to see relevant work and discuss a limited proof of concept.\n\nHinton’s VFX and CGI conversations begin with the shot’s requirements. Some elements benefit from generated exploration; others need controlled 3D or compositing. Keeping that choice open is a strength. This article is a skills perspective, not a recruitment announcement or a promise of available roles.",
        "sources": []
      }
    ]
  },
  {
    "slug": "opus-astra-motion-design-post-production",
    "title": "The timeline isn’t dead. The work around it is changing.",
    "category": "Motion & post",
    "service": "ai-animation",
    "description": "How Opus 5.5 and GPT-6 Astra could assist motion design and post-production through coding, iteration and workflow automation—without confusing agents with renderers.",
    "published": "2026-09-27",
    "featured": true,
    "cover": "/assets/blog/motion-design.webp",
    "coverAlt": "A sculptural letter A made from timeline layers, keyframes and red motion paths.",
    "diagram": "/assets/blog/motion-design-diagram.svg",
    "diagramAlt": "Production loop: creative brief, editable system, rendered preview, human review, then controlled delivery.",
    "takeaway": "Agents can help build and operate the production system. Designers still define what a good result looks and feels like.",
    "sections": [
      {
        "heading": "The hidden work between two good frames",
        "body": "A motion designer’s day contains more than animation. There are asset names to fix, subtitles to update, aspect ratios to adapt, review notes to reconcile and exports to check. None of that appears in the showreel, but it shapes what a project costs and how reliably it ships.\n\nThe interesting role for a coding agent is in this surrounding work. If it helps turn a repeatable instruction into an editable, testable operation, the designer can spend more attention on pacing, hierarchy and the idea. That is a practical hypothesis to test, not a promise that a model will finish a commercial unattended.",
        "sources": []
      },
      {
        "heading": "What Opus 5.5 and GPT-6 Astra actually are",
        "body": "Anthropic describes Opus 5.5’s strengths in coding and computer use. OpenAI describes GPT-6 Astra as a reasoning, coding and computer-use model; its model page lists text output and image input, with video unsupported as a direct modality. Tools can extend an agent’s workflow, but that does not make the language model itself a video renderer.\n\nFor motion work, the proposed connection is therefore indirect: help write scripts, structure scenes, analyse still frames or coordinate supported tools. Access, integrations and permissions determine what can actually run. A software benchmark is not a benchmark for animation taste, compositing quality or a studio’s delivery speed.",
        "sources": [
          {
            "label": "Anthropic: Introducing Claude Opus 5.5 (22 September 2026)",
            "url": "https://www.anthropic.com/claude-opus-5-5"
          },
          {
            "label": "OpenAI: GPT-6 Astra model capabilities",
            "url": "https://developers.openai.com/api/docs/models/gpt-6-astra"
          }
        ]
      },
      {
        "heading": "Start with a repeatable deliverable",
        "body": "Imagine a product launch requiring three aspect ratios and five language versions. The core animation is approved. The repeated work is replacing text, validating safe areas and producing a predictable file set. Define that structure before involving an agent.\n\nSeparate fixed design decisions from variable content. Keep typography, colour, timing and logo placement in an editable template. Store the approved text and filenames in a simple manifest. Then ask the assistant to create the smallest automation that reads that manifest and reports missing inputs. This is easier to review than a large opaque script that both redesigns and exports the campaign.",
        "sources": []
      },
      {
        "heading": "Give the agent a contract, not a wish",
        "body": "“Make the animation better” invites uncontrolled changes. A useful request defines the input, protected decisions, output and checks. The assistant should explain what its script will touch and leave the original project intact. Test on a copy before running a batch.",
        "sources": [],
        "prompt": "Help automate versions of an approved motion project using the scripting interface of my installed application. First ask for the application version and inspect the available API documentation. Read a manifest of approved copy, language and output size. Preserve existing timing, fonts, colours and source assets. Create a separate version for each manifest row. Report missing assets and text overflow; do not silently replace fonts or shorten copy. Render a preview for review before final exports. Include an undo or recovery plan and a short validation checklist."
      },
      {
        "heading": "Keep animation judgement in the review loop",
        "body": "A technically valid render can still feel lifeless. Watch for the spacing of keyframes, the pause before a reveal, the weight of a transition and the relationship between picture and sound. A title fitting inside its box does not mean its line breaks are good. A portrait crop keeping the logo does not mean it preserves the story.\n\nReview representative outputs before committing to the full batch. Choose the longest text, the narrowest format and the most complex scene. If those fail, fix the system rather than patching each export separately. This is where traditional design knowledge becomes especially valuable: it provides the criteria automation must satisfy.",
        "sources": []
      },
      {
        "heading": "Measure the whole job, including repairs",
        "body": "Run a bounded comparison on a real repeatable task. Record setup time, review time, correction time and accepted outputs for both the assisted and existing method. Count rejected renders and the cost of recovering from mistakes. Do not present a faster script execution as an equivalent reduction in project cost.\n\nThe useful outcome may be fewer manual mistakes, a more consistent handoff or more time for creative alternatives. It may also be that a familiar template is already the best tool. There is no requirement to add an agent to a task that is simple and reliable without one.",
        "sources": []
      },
      {
        "heading": "The business opportunity is an accountable service",
        "body": "A client buys a film or a campaign that works across its channels. They do not need to buy the internal complexity of the production pipeline. A studio can package the benefit as a coherent motion system, controlled localisation or a disciplined versioning service with review gates.\n\nHinton can discuss animated brand films, product sequences and campaign adaptations around that kind of brief. The strongest question is not whether AI replaces a named application. It is whether a human-directed workflow can deliver more useful work while keeping changes understandable and quality dependable.",
        "sources": []
      }
    ]
  }
];
