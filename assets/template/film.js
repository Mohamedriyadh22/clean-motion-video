// FILM — one idea per shot, big type with one bold word, hard cuts on the spoken word, calm settle.
// 1) Set THEME to the user's colours/font.  2) Replace SHOTS with the approved shot plan.
// Shot times come from score.js: scene starts S[name][0] and spoken words W_(take, 'word').
(function () {
  const U = globalThis.U, G = globalThis.G, Subs = globalThis.Subs, S = globalThis.SCORE, Studio = globalThis.Studio;
  const { clamp, ease } = U;
  const { ev, W_ } = S;
  const W = G.W, H = G.H;

  // ---------- THEME: the user decides these ----------
  const THEME = {
    light: '#F4F6FB',      // background A
    accent: '#1652F0',     // background B + bold words on light shots
    dark: '#0A1230',       // background C (problems, tension)
    ink: '#0D1530',        // text on light
    onDark: '#FFFFFF',     // text on accent/dark
    muted: '#6B7591',      // secondary text
    good: '#17B26A', bad: '#F0384A', warn: '#F59E0B',
    card: '#FFFFFF', line: '#E3E8F2',
    font: 'Inter',         // engine ships Inter 400/700/800; load others with Studio.loadFont in init()
    lightWeight: 400, boldWeight: 800,
  };
  let SUBS = [];

  // ---------- motion vocabulary ----------
  const P = (t, t0, d = 0.9) => ease.outExpo(clamp((t - t0) / d));        // fast in, long settle
  const Pio = (t, t0, d = 0.7) => ease.inOutCubic(clamp((t - t0) / d));
  const txt = (ctx, s, x, y, o = {}) => G.text(ctx, s, x, y, { fam: THEME.font, weight: THEME.boldWeight, color: THEME.ink, boil: 0, ...o });
  function enter(ctx, x, y, p, fn, { dy = 30, s0 = 0.94 } = {}) {
    if (p <= 0) return;
    ctx.save(); ctx.globalAlpha *= clamp(p * 1.5);
    const s = s0 + (1 - s0) * p;
    ctx.translate(x, y + dy * (1 - p)); ctx.scale(s, s); ctx.translate(-x, -y);
    fn(); ctx.restore();
  }
  const fadeIn = (ctx, p, fn) => { if (p <= 0) return; ctx.save(); ctx.globalAlpha *= p; fn(); ctx.restore(); };
  function rr(ctx, x, y, w, h, r, fill, stroke, lw = 2) {
    ctx.beginPath(); ctx.roundRect(x, y, w, h, r);
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
  }
  function circle(ctx, x, y, r, fill, stroke, lw = 3) {
    ctx.beginPath(); ctx.arc(x, y, Math.max(0, r), 0, Math.PI * 2);
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
  }
  function seg(ctx, pts, color, lw = 3, dash = null, off = 0) {
    ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = lw; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    if (dash) { ctx.setLineDash(dash); ctx.lineDashOffset = off; }
    ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke(); ctx.restore();
  }
  function card(ctx, x, y, w, h, r = 30, fill = THEME.card) {
    ctx.save(); ctx.shadowColor = 'rgba(16,30,70,0.12)'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 14;
    rr(ctx, x, y, w, h, r, fill); ctx.restore();
  }

  // kinetic type: lines of [text, bold] runs; each word rises out of a mask, staggered
  function say(ctx, lines, t, t0, { x = W / 2, y = H / 2, size = 110, color = THEME.ink, boldColor = null, align = 'center', lh = 1.14, stagger = 0.085, d = 1.0 } = {}) {
    const words = [];
    lines.forEach((runs, li) => runs.forEach(([s, b]) => s.split(' ').filter(Boolean).forEach((wd) => words.push({ wd, b, li }))));
    const top = y - ((lines.length - 1) * size * lh) / 2;
    for (let li = 0; li < lines.length; li++) {
      const ws = words.filter((q) => q.li === li);
      ws.forEach((q) => { ctx.font = G.font(size, THEME.font, q.b ? THEME.boldWeight : THEME.lightWeight); q.w = ctx.measureText(q.wd).width; });
      ctx.font = G.font(size, THEME.font, THEME.lightWeight); const sp = ctx.measureText(' ').width;
      const total = ws.reduce((a, q) => a + q.w, 0) + sp * (ws.length - 1);
      let cx = align === 'center' ? x - total / 2 : align === 'right' ? x - total : x;
      ws.forEach((q) => { q.x = cx; q.y = top + li * size * lh; cx += q.w + sp; });
    }
    words.forEach((q, i) => {
      const p = P(t, t0 + i * stagger, d); if (p <= 0) return;
      ctx.save(); ctx.beginPath(); ctx.rect(q.x - 20, q.y - size * 1.02, q.w + 40, size * 1.32); ctx.clip();
      txt(ctx, q.wd, q.x, q.y + (1 - p) * size * 1.1, { size, weight: q.b ? THEME.boldWeight : THEME.lightWeight, color: q.b && boldColor ? boldColor : color });
      ctx.restore();
    });
  }
  // a caption that swaps on its word: [[t, lines], …]
  function sayStates(ctx, t, states, o) { let cur = states[0]; for (const s of states) if (t >= s[0]) cur = s; say(ctx, cur[1], t, cur[0], o); }

  // ---------- small icon set ----------
  function checkMark(ctx, x, y, r, p, color, lw) {
    const pts = [[x - r * 0.42, y + r * 0.02], [x - r * 0.1, y + r * 0.34], [x + r * 0.46, y - r * 0.32]];
    const L1 = Math.hypot(pts[1][0] - pts[0][0], pts[1][1] - pts[0][1]), L2 = Math.hypot(pts[2][0] - pts[1][0], pts[2][1] - pts[1][1]);
    const d = clamp(p) * (L1 + L2); if (d <= 0) return;
    const path = [pts[0]];
    if (d <= L1) path.push([pts[0][0] + (pts[1][0] - pts[0][0]) * d / L1, pts[0][1] + (pts[1][1] - pts[0][1]) * d / L1]);
    else { path.push(pts[1]); const e = (d - L1) / L2; path.push([pts[1][0] + (pts[2][0] - pts[1][0]) * e, pts[1][1] + (pts[2][1] - pts[1][1]) * e]); }
    seg(ctx, path, color, lw || r * 0.2);
  }
  function spinner(ctx, x, y, r, t, color, lw = 5) { ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = lw; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(x, y, r, t * 6, t * 6 + Math.PI * 1.4); ctx.stroke(); ctx.restore(); }
  // a status card: ● Name ........ Label   (state: idle | ok | down | busy)
  function statusCard(ctx, x, y, name, state, t, tState, scale = 1) {
    const col = { idle: THEME.line, ok: THEME.good, down: THEME.bad, busy: THEME.warn }[state];
    ctx.save(); ctx.translate(x, y); ctx.scale(scale, scale); ctx.translate(-x, -y);
    card(ctx, x - 200, y - 58, 400, 116, 30);
    circle(ctx, x - 138, y, 17, col);
    if (state === 'busy') spinner(ctx, x - 138, y, 30, t, THEME.warn, 4);
    txt(ctx, name, x - 102, y + 16, { size: 46 });   // keep names short: long names collide with the label
    const label = { idle: '', ok: 'Running', down: 'Down', busy: 'Working' }[state];
    fadeIn(ctx, P(t, tState, 0.5), () => txt(ctx, label, x + 176, y + 13, { size: 30, weight: 700, align: 'right', color: col }));
    ctx.restore();
  }

  // ---------- SHOTS (example — replace with the approved shot plan) ----------
  // { t: start time (a scene start or a spoken word), bg, draw(ctx, t, t0) }
  const intro = S.S[S.NAMES[0]][0], second = S.S[S.NAMES[1]] ? S.S[S.NAMES[1]][0] : null;
  const SHOTS = [
    { t: intro, bg: THEME.light, draw(ctx, t, t0) {
      say(ctx, [[['Your', 0], ['big idea', 1]], [['in one line', 0]]], t, t0 + 0.3, { size: 116, boldColor: THEME.accent });
    } },
    second !== null && { t: second, bg: THEME.dark, draw(ctx, t, t0) {
      say(ctx, [[['The', 0], ['problem.', 1]]], t, t0 + 0.2, { size: 150, color: THEME.onDark, boldColor: THEME.bad });
    } },
    { t: ev.endCard, bg: THEME.light, draw(ctx, t, t0) {
      say(ctx, [[['Thank you.', 1]]], t, t0, { y: 520, size: 140, color: THEME.accent });
      fadeIn(ctx, P(t, t0 + 0.4), () => txt(ctx, 'Name  ·  Organisation', W / 2, 660, { size: 36, weight: 700, color: THEME.muted, align: 'center' }));
    } },
    // more patterns (see references/clarity.md): statement + icon, split (text left / card right),
    // stack (one item per spoken word), flow (words + arrows), state change (statusCard + sayStates)…
    // e.g. { t: W_(1, 'crashes'), bg: THEME.dark, draw(ctx, t, t0) { statusCard(ctx, W/2, 420, 'DNS', 'down', t, t0, 1.3); … } },
  ].filter(Boolean).sort((a, b) => a.t - b.t);
  const shotAt = (t) => { let s = SHOTS[0]; for (const q of SHOTS) if (t >= q.t) s = q; return s; };
  void W_; void Pio; void checkMark;   // helpers kept for your shots

  Studio.film({
    fadeOut: 1.0,
    post: { paper: 0, grain: 0, vignette: 0 },
    async init() { const VO = await Studio.loadJSON('out/voice.json'); SUBS = Subs.fromVoice(VO, { maxWords: 7, hold: 0.4 }); },
    draw(ctx, t) {
      G.setStyle('flat');
      const s = shotAt(t);
      ctx.fillStyle = s.bg; ctx.fillRect(0, 0, W, H);
      const k = 1 + 0.03 * ease.outCubic(clamp((t - s.t) / 5));   // slow push-in keeps every shot alive
      ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(k, k); ctx.translate(-W / 2, -H / 2);
      s.draw(ctx, t, s.t);
      ctx.restore();
      Subs.draw(ctx, t, SUBS, { style: 'box', size: Math.round(H * 0.03) });   // burned-in subtitles
    },
  });
})();
