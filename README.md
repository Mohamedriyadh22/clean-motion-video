# clean-motion-video: a Claude skill

Clear, narrated motion-graphics videos made by Claude: **one idea per shot, big type, cuts exactly on the spoken words**, a natural ElevenLabs voice, soft background music, burned-in subtitles, and a measured, sync-verified MP4.
You choose the colors and the look; the skill supplies the clarity, pacing and quality checks.

## Install in 3 steps (Windows)

**1. Paste this one line into PowerShell** (Start menu → type `PowerShell` → Enter):
```powershell
irm https://raw.githubusercontent.com/Mohamedriyadh22/clean-motion-video/main/install.ps1 | iex
```
It checks your computer and installs anything missing (Node.js, ffmpeg, Chrome, Python, Git), downloads the skill, creates a work folder in `Videos\claude-videos`, and opens the ElevenLabs page so you can paste **your own** API key, which it then tests. It's safe to run again at any time; running it again also updates the skill.

**2. In the Claude app:** **Plugins → Browse plugins →** search **`animation-studio`** → **Install** (the drawing engine the skill uses).

**3. Make a video:** open the **Code** tab, choose the folder `Videos\claude-videos`, and ask, for example:
> Make a 60-second 16:9 video explaining my app. Cream and orange colors, calm female voice.

Claude asks for anything missing, writes the script, **waits for your approval** before spending voice credits, shows you still frames, then renders and verifies the MP4.

> Just want to check, without installing anything?
> `$env:CMV_CHECK_ONLY="1"; irm https://raw.githubusercontent.com/Mohamedriyadh22/clean-motion-video/main/install.ps1 | iex`

## What you need
- A Claude plan with **Claude Code** (Pro, Max, Team or Enterprise). Chat alone can only plan; the rendering runs in Claude Code.
- An **ElevenLabs account** (the free plan is fine). The key is yours, stays on your computer, and is never uploaded.
- Everything else, the installer sets up for you.

## Other ways to install
- **Claude app only (planning scripts and shot lists):** download `clean-motion-video.zip` from **[Releases](https://github.com/Mohamedriyadh22/clean-motion-video/releases/latest)**, then go to **Plugins → Add → Upload skill**.
- **macOS / Linux:** install Node.js 22+, ffmpeg, Chrome, Python 3 (`pip install requests python-dotenv`) and Git, then:
  ```bash
  git clone https://github.com/Mohamedriyadh22/clean-motion-video ~/.claude/skills/clean-motion-video
  ```
  and put `ELEVENLABS_API_KEY=your_key` in a `.env` file in your work folder.

## Troubleshooting
| problem | fix |
|---|---|
| `winget is not available` | Install "App Installer" from the Microsoft Store, then run the line again |
| Python packages are missing | `python -m pip install requests python-dotenv` |
| The ElevenLabs key "did not work" | Create a new key on the ElevenLabs page and run the installer again |
| Music generation says "paid plan required" | Normal on the free plan: the skill makes the music itself |
| Claude doesn't use the skill | Start a **new** Code session, or say "use the clean-motion-video skill" |

## What's inside
| path | what |
|---|---|
| `install.ps1` | the one-line Windows installer |
| `SKILL.md` | the workflow Claude follows |
| `references/clarity.md` | shot recipes, type scale, review checklist |
| `scripts/make_vo.py` | ElevenLabs narration with word timestamps |
| `scripts/make_takes.js` | packs the word timings for the score |
| `assets/template/` | the generic `score.js`, `song.js` and `film.js` to start from |

Never commit your `.env` or API keys.
