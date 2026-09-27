/* SAHNE 1 — DİK AÇI MI? (0–10 s)  Hangi üçgenler dik açılı?
   The whole film's drawing lives in LI.world(t); each scene only sets the camera. */
(function (LI) {
  'use strict';
  const { seg, lerp, inOut } = LI.E;
  const KD = LI.KD, F = () => LI.Film, A = LI.Ang, Ink = LI.Ink;
  const END = (t) => 1 - seg(t, 90.4, 91.4);

  function win(t, a, b, fi = 0.4, fo = 0.4) { return seg(t, a, a + fi) * (1 - seg(t, b - fo, b)); }
  function exprs(ctx, t, P, list, sz) {
    const f = F();
    list.forEach(([a, b, items, hot]) => {
      const al = win(t, a, b); if (al <= 0) return;
      f.expr(ctx, typeof items === 'string' ? [items] : items, P.x, P.y, sz ?? P.s, { alpha: al, w: P.w, halo: true, color: hot ? A.amber : undefined });
    });
  }
  const at = (P, k, y) => ({ x: P.x, y: y ?? P.y[k], s: P.s, w: P.w });
  const amber = (a) => `rgba(${LI.AMBER_RGB},${a})`;
  const fr = (n, d, h) => F().fr(n, d, h);
  const neg = (s) => s.replace('-', '−');
  const label = (v) => (v < 0 ? neg(String(v)) : String(v));

  function tally(ctx, env, t, rows) {
    const T = KD.L(env).TL;
    rows.forEach(([t0, t1, txt, hot], i) => { const al = win(t, t0, t1) * END(t); if (al > 0) F().T(ctx, txt, T.x, T.y[i], { size: T.s, alpha: al, halo: true, color: hot ? A.amber : undefined }); });
  }

  function dashL(ctx, p, q, a, seed, color, w = 2.5) {
    if (a <= 0) return; const n = Math.max(6, Math.round(Math.hypot(q[0] - p[0], q[1] - p[1]) / 14));
    for (let j = 0; j < n; j += 2) Ink.path(ctx, [[lerp(p[0], q[0], j / n), lerp(p[1], q[1], j / n)], [lerp(p[0], q[0], (j + 1) / n), lerp(p[1], q[1], (j + 1) / n)]], { w, alpha: a, seed: seed + j, taper: [0, 0], color });
  }
  function seg2(ctx, p, q, a, k, seed, color, w = 3.5) { if (a > 0 && k > 0) Ink.path(ctx, [p, [lerp(p[0], q[0], k), lerp(p[1], q[1], k)]], { w, alpha: a, seed, taper: [0, 0], color }); }
  function dot(ctx, p, a, color) { if (a <= 0) return; ctx.beginPath(); ctx.arc(p[0], p[1], 6, 0, 7); ctx.fillStyle = color ? `rgba(${color},${a})` : `rgba(${LI.INK_RGB},${a})`; ctx.fill(); }
  function txt(ctx, env, p, s, a, hot, sz = 0.8) { if (a > 0) F().T(ctx, s, p[0], p[1], { size: KD.L(env).G.s * sz, alpha: a, halo: true, color: hot ? A.amber : undefined }); }
  function arcAt(ctx, C, r, u0, u1, a, seed, color) {
    if (a <= 0) return; const P = []; for (let j = 0; j <= 16; j++) { const u = lerp(u0, u1, j / 16); P.push([C[0] + r * Math.cos(u), C[1] + r * Math.sin(u)]); }
    Ink.path(ctx, P, { w: 2.5, alpha: a, seed, taper: [0, 0], color });
  }
  const lerpP = (p, q, k) => [lerp(p[0], q[0], k), lerp(p[1], q[1], k)];
  const add = (p, q, k = 1) => [p[0] + q[0] * k, p[1] + q[1] * k];
  const dec = (v, d = 1) => v.toFixed(d).replace('.', ',');
  function poly(ctx, P, fill) { ctx.beginPath(); P.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); }
  const D2R = Math.PI / 180;
  /** triangle shape (a on the base from C, b at angle g) as a function of time */
  const KEYS = [
    [0, 0, [3, 4, 90]],
    [28.6, 0.1, [3, 4, 90]],
    [34.2, 1.2, [5 * 5 / 13, 12 * 5 / 13, 90]],
    [39.6, 1.2, [2 * 1.25, 3 * 1.25, Math.acos(-0.25) / D2R]],
    [46.2, 1.0, [3, 4, 90]],
    [48.6, 3.0, [3, 4, 55]],
    [55.2, 4.0, [3, 4, 125]],
    [64.6, 1.2, [4 * 5 / 6, 5 * 5 / 6, Math.acos(5 / 40) / D2R]],
    [71.8, 1.2, [3 * 5 / 7, 5 * 5 / 7, 120]],
  ];
  function shape(t) {
    let v = KEYS[0][2];
    for (let i = 1; i < KEYS.length; i++) { const [t0, d, w] = KEYS[i]; if (t < t0) break; const e = d > 0 ? inOut(seg(t, t0, t0 + d)) : 1; v = v.map((x, j) => lerp(x, w[j], e)); }
    return { a: v[0], b: v[1], g: v[2] };
  }
  function pts(env, s) {
    const P = KD.L(env).PY, u = P.u, C = P.C;
    const g = s.g * D2R;
    return { C, B: [C[0] + s.a * u, C[1]], A: [C[0] + s.b * u * Math.cos(g), C[1] - s.b * u * Math.sin(g)], u };
  }
  /** square on p→q, outward (away from o), n×n grid */
  function square(ctx, p, q, o, n, t, t0, a, seed, fillN, fillC) {
    if (a <= 0) return;
    const d = [q[0] - p[0], q[1] - p[1]]; let nr = [d[1], -d[0]];
    const m = lerpP(p, q, 0.5); if ((o[0] - m[0]) * nr[0] + (o[1] - m[1]) * nr[1] > 0) nr = [-nr[0], -nr[1]];
    const p2 = add(p, nr), q2 = add(q, nr), k = seg(t, t0, t0 + 1.0);
    const e1 = [d[0] / n, d[1] / n], e2 = [nr[0] / n, nr[1] / n];
    if (fillN) for (let c = 0; c < n * n; c++) {
      const f = fillN(c); if (f <= 0) continue; const i = c % n, j = Math.floor(c / n), o0 = add(add(p, e1, i), e2, j);
      poly(ctx, [o0, add(o0, e1), add(add(o0, e1), e2), add(o0, e2)], `rgba(${fillC(c)},${0.35 * f * a})`);
    }
    Ink.path(ctx, [q, lerpP(q, q2, k)], { w: 3.5, alpha: a, seed, taper: [0, 0] });
    Ink.path(ctx, [p, lerpP(p, p2, k)], { w: 3.5, alpha: a, seed: seed + 1, taper: [0, 0] });
    Ink.path(ctx, [p2, lerpP(p2, q2, seg(t, t0 + 0.6, t0 + 1.2))], { w: 3.5, alpha: a, seed: seed + 2, taper: [0, 0] });
    const kg = seg(t, t0 + 1.2, t0 + 2.0) * a * 0.45;
    if (kg > 0) for (let i = 1; i < n; i++) {
      Ink.path(ctx, [add(p, e1, i), add(add(p, e1, i), nr, kg > 0 ? 1 : 0)], { w: 1.6, alpha: kg, seed: seed + 10 + i, taper: [0, 0] });
      Ink.path(ctx, [add(p, e2, i), add(q, e2, i)], { w: 1.6, alpha: kg, seed: seed + 30 + i, taper: [0, 0] });
    }
    return lerpP(lerpP(p, q, 0.5), lerpP(p2, q2, 0.5), 0.5);
  }
  function rightMark(ctx, T, a, color) {
    if (a <= 0) return; const r = 18, uB = [(T.B[0] - T.C[0]), (T.B[1] - T.C[1])], uA = [(T.A[0] - T.C[0]), (T.A[1] - T.C[1])];
    const nb = Math.hypot(...uB), na = Math.hypot(...uA), p1 = add(T.C, uB, r / nb), p3 = add(T.C, uA, r / na), p2 = add(p1, uA, r / na);
    Ink.path(ctx, [p1, p2, p3], { w: 3, alpha: a, seed: 2790, taper: [0, 0], color: color || LI.AMBER_RGB });
  }
  function sideLabels(ctx, env, T, la, lb, lc, a, o = 1) {
    if (a <= 0) return; const s = KD.L(env).G.s, G = [(T.A[0] + T.B[0] + T.C[0]) / 3, (T.A[1] + T.B[1] + T.C[1]) / 3];
    const put = (p, q, l, out) => { if (!l) return; const m = lerpP(p, q, 0.5), d = [m[0] - G[0], m[1] - G[1]], n = Math.hypot(...d) || 1; F().T(ctx, l, m[0] + d[0] / n * out, m[1] + d[1] / n * out, { size: s * 0.7, alpha: a, halo: true }); };
    put(T.C, T.B, la, 30 * o); put(T.C, T.A, lb, 34 * o); put(T.A, T.B, lc, 34 * o);
  }
  function names(ctx, env, T, a) { if (a <= 0) return; const s = KD.L(env).G.s; F().T(ctx, 'C', T.C[0] - 26, T.C[1] + 22, { size: s * 0.6, alpha: a, halo: true }); F().T(ctx, 'B', T.B[0] + 24, T.B[1] + 22, { size: s * 0.6, alpha: a, halo: true }); F().T(ctx, 'A', T.A[0], T.A[1] - 26, { size: s * 0.6, alpha: a, halo: true }); }

  function context(ctx, env, t) {
    exprs(ctx, t, KD.L(env).CX, [
      [4.4, 10.2, 'Hangi üçgenler dik açılıdır?'],
      [10.6, 27.8, 'Kenarları 3, 4 ve 5 olan üçgen'],
      [28.4, 45.8, 'Hangi sayılar a² + b² = c² eşitliğini sağlar?'],
      [46.4, 63.8, 'C açısı değişirse ne olur?'],
      [64.4, 79.8, 'Önermeler: eşit, küçük, büyük'],
    ]);
  }

  function figure(ctx, env, t) {
    const a = END(t), s = KD.L(env).G.s, sh = shape(t), T = pts(env, sh);
    const aT = a * win(t, 5.6, 79.8);
    if (aT > 0) {
      const k = seg(t, 5.8, 7.0);
      Ink.path(ctx, [T.C, lerpP(T.C, T.B, k)], { w: 4, alpha: aT, seed: 2701, taper: [0, 0] });
      Ink.path(ctx, [T.C, lerpP(T.C, T.A, k)], { w: 4, alpha: aT, seed: 2702, taper: [0, 0] });
      Ink.path(ctx, [T.A, lerpP(T.A, T.B, seg(t, 6.6, 7.4))], { w: 4, alpha: aT, seed: 2703, taper: [0, 0], color: (t > 46 && t < 64) ? LI.AMBER_RGB : undefined });
      names(ctx, env, T, aT * seg(t, 7.2, 7.6));
    }
    txt(ctx, env, [T.C[0] + 44, T.C[1] - 40], '?', a * win(t, 7.6, 11.0), true, 1.1);
    // S2: squares
    const k2 = a * win(t, 11.8, 27.8);
    if (k2 > 0) {
      const amb = LI.AMBER_RGB, ink = LI.INK_RGB;
      const cb = square(ctx, T.C, T.B, T.A, 3, t, 12.0, k2, 2710, (c) => seg(t, 14.0 + c * 0.08, 14.2 + c * 0.08), () => amb);
      const ca = square(ctx, T.C, T.A, T.B, 4, t, 12.6, k2, 2720, (c) => seg(t, 14.8 + c * 0.06, 15.0 + c * 0.06), () => ink);
      const ab = square(ctx, T.A, T.B, T.C, 5, t, 13.2, k2, 2730, (c) => (c < 9 ? seg(t, 17.2 + c * 0.05, 17.4 + c * 0.05) : seg(t, 17.8 + (c - 9) * 0.05, 18.0 + (c - 9) * 0.05)), (c) => (c < 9 ? amb : ink));
      txt(ctx, env, cb, '9', k2 * seg(t, 14.6, 15.0), true, 1.0);
      txt(ctx, env, ca, '16', k2 * seg(t, 15.8, 16.2), false, 1.0);
      txt(ctx, env, ab, '25', k2 * seg(t, 16.2, 16.6) * (1 - seg(t, 17.0, 17.3)), false, 1.0);
      txt(ctx, env, ab, '9 + 16', k2 * seg(t, 18.8, 19.2), true, 0.9);
      rightMark(ctx, T, k2 * seg(t, 20.0, 20.4));
    }
    sideLabels(ctx, env, T, 'a', 'b', 'c', a * win(t, 11.0, 28.2), -0.75);
    tally(ctx, env, t, [[11.4, 27.8, 'a = 3, b = 4, c = 5'], [15.0, 27.8, '3² = 9 · 4² = 16 · 5² = 25'], [18.6, 27.8, '9 + 16 = 25 → a² + b² = c²'], [20.4, 27.8, 'C açısı 90°: dik üçgen ✓', true]]);
    // S3: rational triples
    sideLabels(ctx, env, T, '1,5', '2', '2,5', a * win(t, 29.2, 34.0));
    sideLabels(ctx, env, T, '5', '12', '13', a * win(t, 35.2, 39.4));
    sideLabels(ctx, env, T, '2', '3', '4', a * win(t, 40.6, 45.8));
    rightMark(ctx, T, a * win(t, 29.6, 34.0)); rightMark(ctx, T, a * win(t, 35.6, 39.4));
    if (t > 40.6 && t < 45.8) { const w = a * win(t, 41.0, 45.8); arcAt(ctx, T.C, 34, 0, -sh.g * D2R, w, 2740, LI.AMBER_RGB); txt(ctx, env, [T.C[0] + 60, T.C[1] - 64], '> 90°', w, true, 0.6); }
    tally(ctx, env, t, [[29.8, 45.8, '1,5² + 2² = 6,25 = 2,5² ✓'], [35.4, 45.8, '5² + 12² = 169 = 13² ✓'], [41.0, 45.8, '2² + 3² = 13 ≠ 16 = 4² ✗'], [43.4, 45.8, 'Rasyonel sayılar da sağlar', true]]);
    // S4: the hinge
    const k4 = a * win(t, 46.8, 63.8);
    if (k4 > 0) {
      const g = { a: 3, b: 4, g: 90 }, R = pts(env, g);
      dashL(ctx, T.C, R.A, k4 * 0.4 * seg(t, 48.4, 48.8), 2750); dashL(ctx, R.A, R.B, k4 * 0.4 * seg(t, 48.4, 48.8), 2751);
      sideLabels(ctx, env, T, 'a = 3', 'b = 4', 'c', k4);
      arcAt(ctx, T.C, 34, 0, -sh.g * D2R, k4, 2752, LI.AMBER_RGB);
      const m = -sh.g * D2R / 2; txt(ctx, env, [T.C[0] + 68 * Math.cos(m), T.C[1] + 68 * Math.sin(m)], `${Math.round(sh.g)}°`, k4, true, 0.55);
      const c2 = 9 + 16 - 24 * Math.cos(sh.g * D2R), T2 = KD.L(env).TL;
      const v = k4 * seg(t, 48.2, 48.6); if (v > 0) F().T(ctx, `C = ${Math.round(sh.g)}° → c² ≈ ${dec(c2)}`, T2.x, T2.y[1], { size: T2.s, alpha: v, halo: true, color: A.amber });
    }
    tally(ctx, env, t, [[47.2, 63.8, 'a² + b² = 9 + 16 = 25'], [99, 99, ''], [51.8, 63.8, 'C < 90° ise c² < a² + b²'], [58.6, 63.8, 'C > 90° ise c² > a² + b²']]);
    // S5
    sideLabels(ctx, env, T, '4', '5', '6', a * win(t, 65.8, 71.6));
    sideLabels(ctx, env, T, '3', '5', '7', a * win(t, 73.0, 79.8));
    if (t > 65.8 && t < 79.8) {
      const w = a * (win(t, 66.0, 71.6) + win(t, 73.2, 79.8));
      arcAt(ctx, T.C, 34, 0, -sh.g * D2R, w, 2760, LI.AMBER_RGB);
      const m = -sh.g * D2R / 2; txt(ctx, env, [T.C[0] + 72 * Math.cos(m), T.C[1] + 72 * Math.sin(m)], t < 72 ? '< 90°' : '120°', w, true, 0.55);
    }
    tally(ctx, env, t, [[65.0, 79.8, 'c en uzun kenar olsun'], [66.8, 79.8, '4, 5, 6: 36 < 16 + 25 = 41 → dar'], [72.6, 79.8, '3, 5, 7: 49 > 9 + 25 = 34 → geniş'], [75.4, 79.8, 'Eşitse dik, küçükse dar, büyükse geniş', true]]);
  }

  function words(ctx, env, t) {
    const W = KD.L(env).W;
    exprs(ctx, t, at(W, 0), [[5.6, 10.2, 'Varsayım: kenarların kareleri arasında bir ilişki var'],
      [11.4, 27.8, 'Her kenarın üstüne bir kare çizelim'],
      [29.4, 45.8, 'Kenarlar kesirli ya da ondalıklı da olabilir'],
      [47.4, 63.8, 'C açısını daraltıp genişletelim'],
      [65.4, 79.8, 'c² = a² + b² ise dik açılı']]);
    exprs(ctx, t, at(W, 1), [[18.6, 27.8, 'İki küçük karenin toplamı büyük kareye eşit'],
      [35.0, 39.6, '5, 12, 13 de bir dik üçgen'], [41.0, 45.8, '2, 3, 4 dik üçgen değil: C açısı 90°’den büyük'],
      [52.0, 57.6, 'Açı küçülünce karşısındaki kenar kısalır'], [58.0, 63.8, 'Açı büyüyünce karşısındaki kenar uzar'],
      [67.6, 79.8, 'c² < a² + b² ise dar açılı']]);
    exprs(ctx, t, at(W, 2), [[22.4, 27.8, 'a² + b² = c² ise üçgen dik açılıdır', true], [43.4, 45.8, 'Eşitlik sağlanırsa üçgen dik açılıdır', true],
      [60.4, 63.8, 'Yine de c, 3 + 4 = 7’den kısa: üçgen eşitsizliği', true], [73.4, 79.8, 'c² > a² + b² ise geniş açılı', true]]);
  }

  function summary(ctx, env, t) {
    if (t < 80.4) return;
    const S = KD.L(env).SUM, f = F(), a = END(t);
    [['Dik üçgende: a² + b² = c²', 80.6], ['c² < a² + b²: dar açılı', 81.6], ['c² > a² + b²: geniş açılı', 82.6], ['Karelerin toplamı: Pisagor!', 83.6, true]].forEach(([s, t0, hot], i) => {
      const al = seg(t, t0, t0 + 0.4) * a; if (al <= 0) return;
      f.expr(ctx, [s], S.x, S.y[i], S.s * (i === 3 ? 1.1 : 1), { alpha: al, w: S.w, halo: true, color: hot ? A.amber : undefined });
    });
  }

  LI.fireworks = function (ctx, env, t) {
    const k = seg(t, 84.4, 86.4);
    if (k <= 0 || t >= 91) return;
    const n = F().nokta(t, env), C = [n.x, n.y - 170];
    [30, 60, 90, 120, 150].forEach((d, i) => {
      const r = 150 + 30 * Math.sin(t * 2 + i);
      A.arc(ctx, C, r, d - 12, d + 12, { p: seg(k, i * 0.12, i * 0.12 + 0.4), alpha: 0.8 * (1 - seg(t, 90.2, 91)), w: 6, seed: 80 + i });
    });
  };

  LI.world = function (ctx, env, t) { context(ctx, env, t); figure(ctx, env, t); words(ctx, env, t); summary(ctx, env, t); };

  function camera(t, env) {
    const L = KD.L(env);
    return LI.Camera.breathe(LI.Camera.track([
      [0, KD.cam(env, { x: L.nx, y: env.V ? 380 : 140, zoom: 1.6 })],
      [3.0, KD.cam(env, { x: L.nx, y: env.V ? 380 : 140, zoom: 1.6 })],
      [4.8, KD.cam(env, { zoom: 1 })],
    ], t), t, 0.5);
  }
  function render(ctx, lt, env, t) { F().base(ctx, env, t, camera(t, env), () => LI.world(ctx, env, t)); }
  LI.registerScene({ id: 1, start: 0, end: 10, name: 'A right angle?', nameTr: 'Dik açı mı?', concept: 'A guess', conceptTr: 'Varsayım', render });
})(window.LI = window.LI || {});
