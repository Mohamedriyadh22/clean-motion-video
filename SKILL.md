---
name: clean-motion-video
description: Make clear narrated motion-graphics videos: one idea per shot, big type, cuts on spoken words, natural ElevenLabs voice, soft music, subtitles. Use for any video, explainer or promo request.
---

# Clean motion video

Narrated motion-graphics videos that read instantly: **one idea per shot, big type, lots of space, a cut on the spoken word.** The colours, fonts and mood are the user's choice every time; what this skill guarantees is clarity, pacing and measured quality.

Built on the **animation-studio** engine (every frame drawn on a canvas, rendered by headless Chrome, muxed with ffmpeg). Read that skill's SKILL.md for the engine itself; this skill adds the voice-driven workflow, the clarity rules and the template.

## Why it looks "clear" (the rules that matter)

The difference between a clear video and one that "looks like AI" is almost never the colours. It is density and timing:

1. **One idea per shot.** A shot is a phrase of 2–6 words, plus at most one supporting visual (a card, an icon, a toggle, three small items). If a frame needs a legend or more than ~10 words, split it into two shots. Busy dashboards, full network diagrams, mascots and HUDs everywhere make it feel generated.
2. **Big type, one heavy word.** Headlines at 90–150 px on a 1080p frame. Mix a light weight with one bold key word ("Networks **fail.**", "Live **dashboard**"), with the bold word in the accent colour. That single contrast carries the message.
3. **Empty space.** Keep 40–60% of the frame empty. Centre the idea, or put text left and one visual right.
4. **Cut on the word.** Each shot starts when the narrator says the word it shows (from the ElevenLabs word timestamps), as a hard cut to a new solid background. Words then rise into place with a soft ease-out and a small stagger. Nothing bounces.
5. **Calm pacing.** Shots hold about 2.5–5 seconds. The voice runs at about 2.2–2.5 words per second (ElevenLabs `speed` 0.9–1.0), with about a 1.3 s breath between scenes. If the user says "too fast", lower the voice speed, lengthen the gaps, and merge shots; never cram.
6. **Always moving, never busy.** A slow push-in (about 3% over 5 s) on every shot, plus small loops (a spinner, a pulse, a typing log), keeps frames alive without clutter.
7. **Story beats beat feature lists.** For explainers, use a small story: a concrete situation, the problem, the old way, the new way step by step, proof, and the payoff. Label steps ("STEP 1…4") when explaining a process.

See `references/clarity.md` for shot recipes and the review checklist.

## Workflow

### 0. Brief (one round of questions, at most)
Settle these, asking only for what is missing:
- topic, audience and the length (60–100 s is typical; a story needs about 90–100 s)
- **format**: 16:9 (YouTube, slides, defense) or 9:16 (Reels/TikTok)
- **the look, which the user decides**: 2–3 background colours, one accent colour, a text colour, and the font. If they have no preference, offer 2–3 palettes and let them pick; don't impose one. Put the choice in the `THEME` object of film.js.
- the exact names, titles and credits (spelled exactly)
- the voice: male/female, accent, calm/energetic

### 1. Script → narration lines
Write one narration line per scene (2–4 sentences each, about 230 words for 100 s) and a shot plan (which phrase each shot shows). Save it as a markdown file and **get the user's approval before spending credits.** Keep facts honest: frame illustrative scenarios as "Imagine…".

### 2. Check the keys and the plan, then record the voice
- The key comes from `.env` (`ELEVENLABS_API_KEY`). Check the plan with `GET /v1/user/subscription`. **The free tier cannot use the Music API (it returns 402, "paid_plan_required")**: tell the user, and offer the synthesized soft music from step 4, which is free and works well.
- List the voices (`GET /v2/voices`) and choose a natural premade voice for the brief (for example Eric, Brian, George, Sarah or Alice). Avoid "character" voices for explainers.
- Run `scripts/make_vo.py` with a `lines.json`. It calls `/with-timestamps` once per line and writes `assets/vo_<n>.mp3` plus word timings. Spell tricky words phonetically in the spoken text (for example "N-eight-N") and map them back for the subtitles with `--display`.
- Run `node scripts/make_takes.js <project>/assets` to write `takes.js`, which holds every word time and is shared by sound and picture.

### 3. Scaffold and copy the template
```bash
node <animation-studio-dir>/scripts/new-project.js <project-dir> [--format 9:16]   # the default starter
```
Then copy `assets/template/{score.js,song.js,film.js}` from this skill over the scaffold, and add `<script src="takes.js"></script>` before `score.js` in `index.html`.
- `score.js` lays the takes out (FIRST, GAP, CUT_BEFORE) and exposes `W_(take, word, nth)`, which returns the exact time of a spoken word. Every shot time comes from it. Watch out: `W_(0, 'A')` also matches "Automated"; use a distinctive word.
- `song.js` synthesizes a soft bed (pads, e-piano, low strings, music box), ducks it about 12 dB under the voice, puts a soft bell on every scene cut, and masters to −15 LUFS. Rename the scenes to match `score.js`.
- `film.js` has the `THEME`, the motion helpers (`say`, `sayStates`, `enter`, `fadeIn`, cards, icons) and a `SHOTS` list. Replace the example shots with yours.

### 4. Measure the audio (you can't hear it)
`STEMS=1 node song.js`, then compare the voice and the music RMS during words: aim for the music about 11–13 dB under the voice. Delete `out/stem-*.wav` afterwards.

### 5. Review the stills before the full render
Render about one still per shot (`node engine/render.js stills t1 t2 …`), tile them into one sheet with ffmpeg `xstack`, and look at it. Check against `references/clarity.md`: overlaps, words colliding with icons, text too small, too much in one frame, and labels under the subtitles. Fix, then re-render those times.

### 6. Render, mux, verify
```bash
node engine/render.js video     # minutes: run in the background
node engine/render.js mux
node engine/render.js check     # loudness ≈ −15 LUFS, peak ≤ −1 dBFS
node engine/render.js verify    # every scene cut: sound ±20 ms, picture ±1 frame
```
On Windows, set `CHROME_PATH="/c/Program Files/Google/Chrome/Application/chrome.exe"` first.

### 7. Deliver
Report the path, duration, resolution and size; what each scene shows; the credits used and remaining; and that the audio was verified by measurement, not by listening. Offer the next step: a different length, a 9:16 cut, a voice change, or a theme change.

## When the user gives a reference video
Don't download it without permission. Open it in the built-in browser, pause the `<video>`, seek through it, draw the frames onto one canvas grid, and screenshot that. Describe what makes it clear (density, type, cuts, pacing) and adopt those principles, while keeping the user's own colours.

## Files in this skill
- `scripts/make_vo.py`: ElevenLabs narration with word timestamps, one take per line.
- `scripts/make_takes.js`: packs the take timings into `takes.js`.
- `assets/template/`: `score.js`, `song.js` and `film.js`, a working generic 7-scene example to adapt.
- `references/clarity.md`: shot recipes, a type scale, and the review checklist.
