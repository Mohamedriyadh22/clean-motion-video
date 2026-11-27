// SCORE — the single source of truth. Narration takes (takes.js, from the ElevenLabs alignments) are laid
// out with a calm breath between them; every scene cut, shot and music cue is derived from spoken words.
// Edit: SCENES (one per narration line, with a mood), FORMAT, and the `ev` word lookups.
(function () {
  const node = typeof require !== 'undefined';
  const U = node ? require('./engine/util') : globalThis.U;
  const MU = node ? require('./engine/music') : globalThis.MUSIC;
  const TAKES = node ? require('./takes') : globalThis.TAKES;
  const { m } = MU;

  const FPS = 30;
  const FORMAT = '16:9';            // or '9:16'
  const STYLE = 'flat';
  const [W, H] = U.formatSize(FORMAT);
  const SAFE = U.safeArea(W, H);

  // one scene per narration line; mood picks the harmony ('bright' | 'dark' | 'build')
  const SCENES = [
    { name: 'intro', mood: 'bright' },
    { name: 'problem', mood: 'dark' },
    { name: 'solution', mood: 'build' },
    { name: 'outro', mood: 'bright' },
  ].slice(0, TAKES.length);
  while (SCENES.length < TAKES.length) SCENES.push({ name: `scene${SCENES.length + 1}`, mood: 'bright' });

  const FIRST = 0.6, GAP = 1.35, CUT_BEFORE = 0.6, TAIL = 2.4;
  const VO_AT = [];
  TAKES.forEach((tk, i) => VO_AT.push(i === 0 ? FIRST : +(VO_AT[i - 1] + TAKES[i - 1].len + GAP).toFixed(3)));
  const CUT = VO_AT.map((at, i) => (i === 0 ? 0 : +(at - CUT_BEFORE).toFixed(3)));
  const last = TAKES.length - 1;
  const DURATION = Math.ceil((VO_AT[last] + TAKES[last].len + TAIL) * 10) / 10;
  const NAMES = SCENES.map((s) => s.name);
  const S = {};
  NAMES.forEach((n, i) => { S[n] = [CUT[i], i < last ? CUT[i + 1] : DURATION]; });

  // absolute time of the nth spoken word in a take that starts with `word` (case/punctuation ignored).
  // Use distinctive words: 'A' would also match 'Automated'.
  const norm = (s) => s.toLowerCase().replace(/[^a-z0-9']/g, '');
  function W_(take, word, nth = 1) {
    let k = 0;
    for (const x of TAKES[take].words) if (norm(x.w).startsWith(norm(word)) && ++k === nth) return +(VO_AT[take] + x.t).toFixed(3);
    throw new Error(`word "${word}" #${nth} not in take ${take + 1}`);
  }
  // named moments used by film.js / song.js, e.g. ev.crash = W_(1, 'crashes')
  const ev = {};
  ev.endCard = +(VO_AT[last] + TAKES[last].len - 0.8).toFixed(3);   // better: W_(last, 'Thank') - 0.45

  // harmony by mood (D major home)
  const CH = {
    Dmaj9: ['D3', 'A3', 'C#4', 'E4', 'F#4'], Bm9: ['B2', 'F#3', 'A3', 'C#4', 'D4'], Gmaj7: ['G2', 'D3', 'F#3', 'B3', 'D4'],
    Bm: ['B2', 'F#3', 'B3', 'D4'], Gadd9: ['G2', 'D3', 'A3', 'B3'], Em7: ['E2', 'B2', 'D3', 'G3'], Fs: ['F#2', 'C#3', 'F#3', 'A#3'],
    D: ['D3', 'A3', 'D4', 'F#4'], A: ['A2', 'E3', 'A3', 'C#4'], G: ['G2', 'D3', 'G3', 'B3'],
  };
  const MOOD = { bright: ['Dmaj9', 'Bm9', 'Gmaj7', 'A'], dark: ['Bm', 'Gadd9', 'Em7', 'Fs'], build: ['D', 'A', 'Bm', 'G', 'D', 'A'] };
  const split = ([a, b], names) => names.map((n, i) => ({ t0: a + (b - a) * i / names.length, t1: a + (b - a) * (i + 1) / names.length, name: n, notes: CH[n] }));
  const chords = [];
  SCENES.forEach((sc, i) => chords.push(...split(i === last ? [S[sc.name][0], ev.endCard] : S[sc.name], MOOD[sc.mood])));
  chords.push({ t0: ev.endCard, t1: DURATION, name: 'Dmaj9', notes: CH.Dmaj9 });
  const chordAt = (t) => chords.find((c) => t >= c.t0 && t < c.t1) || chords[chords.length - 1];
  const pulseGrid = (a, b, target = 0.4) => { const n = Math.max(1, Math.round((b - a) / target)); return Array.from({ length: n }, (_, i) => a + i * (b - a) / n); };

  const vo = VO_AT.map((at, i) => ({ at, take: i + 1, len: TAKES[i].len, who: 'narrator' }));
  const markers = {};
  NAMES.slice(1).forEach((n) => { markers[n] = { t: S[n][0], sync: 'av' }; }); // hard cut + soft bell
  markers.endCard = ev.endCard;
  const cues = [];   // soft blips in song.js: push word times, e.g. cues.push(W_(1, 'crashes'))

  const SCORE = { FPS, FORMAT, STYLE, W, H, SAFE, DURATION, SCENES, S, NAMES, CUT, ev, m, vo, VO_AT, TAKES, chords, chordAt, pulseGrid, markers, cues, W_ };
  if (node) module.exports = SCORE; else globalThis.SCORE = SCORE;
})();
