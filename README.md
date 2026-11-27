# clean-motion-video: a Claude skill

Clear, narrated motion-graphics videos made by Claude: **one idea per shot, big type, cuts exactly on the spoken words**, a natural ElevenLabs voice, soft background music, burned-in subtitles, and a measured, sync-verified MP4.
You choose the colors and the look; the skill supplies the clarity, pacing and quality checks.

## What you need
- A Claude plan with **Claude Code** (Pro, Max, Team or Enterprise). Chat alone can only plan; the rendering runs in Claude Code.
- The **animation-studio** plugin (`i-afaqrashid/claude-animation-studio`): install it from **Plugins → Browse plugins**.
- Your own **ElevenLabs API key**. The free plan works for the voice; the music is synthesized locally.
- On your computer: **Node.js 22+**, **ffmpeg**, **Google Chrome**, and **Python 3** with `pip install requests python-dotenv`.

## Install

**Claude Code (full video rendering):** clone this repository into your personal skills folder:
```bash
# Windows (PowerShell)
git clone https://github.com/Mohamedriyadh22/clean-motion-video "$env:USERPROFILE\.claude\skills\clean-motion-video"
# macOS / Linux
git clone https://github.com/Mohamedriyadh22/clean-motion-video ~/.claude/skills/clean-motion-video
```

**Claude app (planning: scripts and shot lists):** download `clean-motion-video.zip` from the **Releases** page, then go to **Plugins → Add → Upload skill**.

## Use
1. Make a work folder with a `.env` file: `ELEVENLABS_API_KEY=your_key`
2. Open the **Code** tab in that folder and ask, for example:
   > Make a 60-second 16:9 video explaining my app. Cream and orange colors, calm female voice.
3. Claude asks for anything missing (colors, format, voice), writes the script, and **waits for your approval** before spending voice credits.
4. It shows you a still-frame review sheet, then renders and verifies the MP4.

## What's inside
| path | what |
|---|---|
| `SKILL.md` | the workflow Claude follows |
| `references/clarity.md` | shot recipes, type scale, review checklist |
| `scripts/make_vo.py` | ElevenLabs narration with word timestamps |
| `scripts/make_takes.js` | packs the word timings for the score |
| `assets/template/` | the generic `score.js`, `song.js` and `film.js` to start from |

## Notes
- The ElevenLabs **Music API** needs a paid plan; this skill synthesizes music instead.
- Never commit your `.env` or API keys.
