// SOUNDTRACK — a soft synthesized bed (pads, e-piano, low strings, music box) under the ElevenLabs takes.
// The bed ducks ~12 dB under the voice, a soft bell marks every scene cut, master at -15 LUFS.
//   node song.js     (STEMS=1 writes stems for measuring; LUFS=-14 changes loudness)
const fs = require('fs');
const path = require('path');
const { SR, Bus, reverb } = require('./engine/audio/dsp');
const I = require('./engine/audio/instruments');
const MIX = require('./engine/audio/mix');
const sc = require('./score');
const { DURATION, S, ev, m, chords, pulseGrid } = sc;

const N = Math.ceil(DURATION * SR);
const bus = () => new Bus(N);
const pad = bus(), keys = bus(), low = bus(), bell = bus(), fx = bus(), verb = bus();
const lastName = sc.NAMES[sc.NAMES.length - 1];
const moodAt = (t) => { const i = sc.NAMES.findIndex((n) => t >= S[n][0] && t < S[n][1]); return (sc.SCENES[i] || sc.SCENES[0]).mood; };

// pads + low strings, one chord per part of each scene
for (const c of chords) {
  const dur = c.t1 - c.t0 + 0.6;
  c.notes.forEach((n, i) => { const { L, R } = I.padNote(m(n) + 12, dur, { cutoff: moodAt(c.t0) === 'dark' ? 750 : 1300, attack: 0.9, release: 1.4, seed: 10 + i }); pad.addStereo(L, R, c.t0, 0.07); });
  const st = I.strings(m(c.notes[0]), dur, { attack: 0.8, release: 1.2, bright: 0.35, seed: 3 });
  low.addStereo(st.L, st.R, c.t0, 0.10);
}
// soft e-piano: slow broken chords; sparse when dark; a gentle pulse (+ shaker) when building
const arp = (from, to, step, gain, oct = 12, pattern = [0, 1, 2, 3, 2, 1]) => pulseGrid(from, to, step).forEach((t, i) => {
  const c = sc.chordAt(t), x = I.epiano(m(c.notes[pattern[i % pattern.length] % c.notes.length]) + oct, step * 2.2, { index: 0.7, decay: 1.4 });
  keys.addMono(x, t, gain * (i % 4 === 0 ? 1 : 0.7), (i % 2 ? 0.25 : -0.25)); verb.addMono(x, t, gain * 0.5);
});
for (const n of sc.NAMES) {
  const [a, b0] = S[n], b = n === lastName ? ev.endCard : b0, mood = moodAt(a + 0.01);
  if (mood === 'dark') arp(a, b, 1.5, 0.12, 0, [0, 2, 1, 3]);
  else if (mood === 'build') {
    arp(a, (a + b) / 2, 0.42, 0.09); arp((a + b) / 2, b, 0.42, 0.11, 12, [0, 1, 2, 3, 4, 3, 2, 1]);
    pulseGrid((a + b) / 2, b - 0.4, 0.42).forEach((t, i) => fx.addMono(I.shaker(i % 2 ? 0.5 : 0.9, 8 + i), t, 0.03, 0.3));
  } else arp(a + 0.2, b, 0.8, 0.14, 12, [0, 2, 4, 3]);
}
// music box: opening motif + end-card reprise
[['F#5', 0], ['A5', 0.8], ['D6', 1.6], ['C#6', 3.2], ['A5', 4.0], ['E5', 4.8]].forEach(([n, d]) => { const x = I.musicBox(m(n)); bell.addMono(x, 0.3 + d, 0.11, 0.15); verb.addMono(x, 0.3 + d, 0.2); });
[['D5', 0], ['F#5', 0.18], ['A5', 0.36], ['D6', 0.6]].forEach(([n, d]) => { const x = I.musicBox(m(n)); bell.addMono(x, ev.endCard + d, 0.16, 0); verb.addMono(x, ev.endCard + d, 0.25); });
// a soft bell on every scene cut (the picture cuts on the same frame)
for (const n of sc.NAMES.slice(1)) {
  const t = S[n][0], x = I.bell(440 * Math.pow(2, (m(sc.chordAt(t + 0.01).notes[0]) + 24 - 69) / 12), 0.9, 1.4, 2);
  bell.addMono(x, t, 0.16, 0); verb.addMono(x, t, 0.25);
}
// story cues from score.js
sc.cues.forEach((t, i) => fx.addMono(I.pop(1200 + i * 60), t, 0.11, (i % 2 ? 0.3 : -0.3)));

// the narration: every take placed on the timeline; voice.json feeds the subtitles
const voice = bus(), lines = [];
for (const v of sc.vo) {
  const b = MIX.loadAudio(path.join(__dirname, 'assets', `vo_${v.take}.mp3`), { at: v.at, length: DURATION });
  for (let i = 0; i < N; i++) { voice.L[i] += b.L[i]; voice.R[i] += b.R[i]; }
  const tk = sc.TAKES[v.take - 1], words = tk.words.map((x) => ({ w: x.w, t: +(v.at + x.t).toFixed(3), end: +(v.at + x.end).toFixed(3) }));
  lines.push({ t: v.at, end: words[words.length - 1].end, text: tk.text, who: v.who, words });
}
fs.mkdirSync(path.join(__dirname, 'out'), { recursive: true });
fs.writeFileSync(path.join(__dirname, 'out', 'voice.json'), JSON.stringify({ engine: 'elevenlabs', lines }));

MIX.duck([pad, keys, low, bell, fx], voice, { depth: 0.45, attack: 0.04, release: 0.5 });
const stems = { pad, keys, low, bell, fx, voice, verb: reverb(verb, { room: 0.82, damp: 0.5 }) };
const GAIN = { pad: 0.33, keys: 0.3, low: 0.8, bell: 0.32, fx: 0.55, voice: 1.0, verb: 0.2 };   // measured: bed ≈ 11 dB under the voice
const mix = MIX.mixdown(stems, GAIN, { stemDir: process.env.STEMS ? path.join(__dirname, 'out') : null });
MIX.highpass(mix, 30);
MIX.fadeOut(mix, DURATION - 1.2, DURATION);
const res = MIX.master(mix, 0.8, undefined, { lufs: process.env.LUFS ? +process.env.LUFS : -15 });
MIX.writeWav(path.join(__dirname, 'out', 'music.wav'), mix);
console.log(`out/music.wav  ${DURATION.toFixed(1)}s  ${res.lufs.toFixed(1)} LUFS  (${lines.length} takes)`);
