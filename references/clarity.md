# Clarity: shot recipes and review checklist

The colours come from the user's THEME. These recipes are about layout, density and timing only.

## Type scale (1080p frame)
| role | size | weight |
|---|---|---|
| hero statement | 120–150 | light + one bold word |
| scene headline | 84–110 | light + one bold word |
| supporting line | 48–64 | light, secondary colour |
| label / kicker ("STEP 2", "HOW IT WORKS") | 24–30 | heavy, uppercase, accent |
| card text | 26–46 | 700 |
| subtitles | 32 in a box | heavy |

Line height 1.14. Keep text inside the 5% safe margin, and clear of the subtitle band (bottom ~130 px).

## Shot recipes (pick one per shot)
- **Statement**: one centred line, 2–5 words, with one bold word. Use for openers, problems and payoffs ("Networks **fail.**").
- **Statement + icon**: an icon or illustration above (y ≈ 330–400), the statement below (y ≈ 620–760).
- **Split**: the headline left-aligned at x = 160 (2 lines max), one card on the right (about 760×420–560).
- **Stack**: a kicker, then 3–4 short items appearing one per spoken word (a numbered list, or "Slow. / Repetitive. / Error-prone.").
- **Flow**: 4–6 single words joined by thin arrows, each appearing in turn, then an underline sweeping across.
- **State change**: one card whose status changes on the word (Running → Down → Restarting → Running) while the caption swaps (`sayStates`).
- **Before/after flip**: a value rolls up inside a clipped window (v2 bad → v1 good).
- **Number**: one big figure that counts up, with a short label under it.
- **End card**: title (2 lines), "Thank you" or the call to action (big), then credits (small).

Alternate the backgrounds (light, accent, dark) from shot to shot so each cut reads as a new idea. Use the dark background for tension or problems and the accent for key claims.

## Motion
- Entrance: rise about 30 px, fade, and scale 0.94→1 with an ease-out-expo over 0.8–1.0 s. Words stagger 60–90 ms.
- Text reveals through a mask (each word rises from behind an invisible line).
- One slow push-in per shot (about 3% over 5 s). No shake, no bounce, no spin.
- Loops are small: a spinner, a pulse ring, dots moving along a dashed link, a typing log.

## Timing
- A shot starts on the first word it shows (`W_(take, word)`), or 0.1–0.3 s before it.
- Caption swaps inside a shot land on their word too.
- Leave about 1.3 s between narration takes; the scene cut sits 0.6 s before the next take.
- Hold the end card at least 2 s after the last word.

## Review checklist (run on the stills sheet)
- [ ] Each frame has one idea, and you can read it in under a second.
- [ ] No text overlaps another element (status labels inside cards are a common culprit; shorten the names).
- [ ] Nothing important sits under the subtitle band.
- [ ] The bold word is the meaningful one.
- [ ] The background alternates between consecutive shots.
- [ ] No shot is shorter than about 1.5 s unless it's a deliberate quick list.
- [ ] Names, titles and credits are spelled exactly as the user gave them.
- [ ] Mid-animation stills (half-risen words) are fine; check the settled state too.
