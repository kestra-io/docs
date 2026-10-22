// @ts-nocheck
/* eslint-disable */
export default function define(HL, hairline) {
const {
  Cam, circ, facing, fit, open, poly, prism, proj, ringAt, rings, rrect,
  tset, tval, tween, unproj, disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const PL = 92, PB = 5, K = 15, KH = 30, BH = 16, NEAR = 46, FAR = 66, HALF = 12, SR = 3.2, SH = 3.2;
const PIX = [[300, 147], [223, 224], [377, 224], [146, 301], [300, 301], [454, 301]];
function logo(P, s, z) {
  const w = (u, v) => { const du = (u - 300) * s, dv = (v - 300) * s; return [(du + dv) / Math.SQRT2, (dv - du) / Math.SQRT2]; };
  const h = 34 * s, [dx, dy] = w(300, 462);
  const pix = PIX.map(([u, v]) => { const [x, y] = w(u, v); return poly(rrect(x - h, y - h, x + h, y + h, h * 0.45, 3).map((q) => P(q.u, q.v, z))); }).join("");
  return { pix, dot: poly(circ(44 * s, 16).map((q) => P(q.u + dx, q.v + dy, z))) };
}

function along(pts, f) {
  const seglen = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]));
  let d = f * seglen.reduce((a, b) => a + b, 0);
  for (let i = 0; i < seglen.length; i++) {
    if (d <= seglen[i]) { const t = d / seglen[i]; return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * t, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * t]; }
    d -= seglen[i];
  }
  return pts[pts.length - 1];
}

const shift = (ring, dx, dy) => ring.map((q) => ({ ...q, u: q.u + dx, v: q.v + dy }));

const DIRS = [[-1, 0], [0, -1], [1, 0], [0, 1]];
const WAITING = 2, REST_OUT = [0, 0, 1, 0];

function brick(d, gap, z) {
  const [dx, dy] = d, a0 = NEAR + gap, a1 = FAR + gap;
  const span = (lo, hi) => (dx ? [dx > 0 ? lo : -hi, -HALF, dx > 0 ? hi : -lo, HALF] : [-HALF, dy > 0 ? lo : -hi, HALF, dy > 0 ? hi : -lo]);
  const [x0, y0, x1, y1] = span(a0, a1), cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
  const studs = [[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([u, v]) => [cx + u * 5.5, cy + v * 5.5]).sort((p, q) => p[0] + p[1] - q[0] - q[1]);
  return { x0, y0, x1, y1, cx, cy, z, studs };
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;

  const C = Cam(45, 0.5, 1.32);
  fit(C, [[-PL, -PL, -PB], [PL, PL, -PB], [PL, -PL, -PB], [-PL, PL, -PB], [-K, -K, KH], [FAR + 14, HALF, BH + SH + 26], [-FAR - 14, -HALF, BH + SH + 26]], 200, 166);
  const P = proj(C), front = facing(C);

  const g = mk("g", {}, svg);
  const [pr, pi] = rings(-PL, -PL, PL, PL, 12, 2.2);
  put(solid(g), prism(P, front, pr, pi, -PB, 0));

  const route = (d) => [[d[0] * (PL - 5) + d[1] * 6, d[1] * (PL - 5) - d[0] * 6], [d[0] * K + d[1] * 6, d[1] * K - d[0] * 6]];
  const traces = DIRS.map((d) => mk("path", { d: open(route(d).map(([x, y]) => P(x, y, 0))), class: "nf dash" }, g));
  const pg = mk("g", {}, g);
  const pulses = DIRS.map(() => [0, 1, 2].map(() => flatDot(pg, C, 1.5, "dot m")));
  const ph = DIRS.map((_, i) => i / 4);
  let act = -2;

  const bricks = DIRS.map((d, i) => {
    const bg = mk("g", {}, g);
    const h = brick(d, 0, 0), [hr] = rings(h.x0, h.y0, h.x1, h.y1, 4, 1.2);
    mk("path", { d: poly(ringAt(P, hr, 0)), class: "nf dash" }, bg);
    const body = solid(bg), studs = [0, 1, 2, 3].map(() => solid(bg));
    return { d, bg, body, studs, out: tween(REST_OUT[i]), drawn: NaN, home: h };
  });

  const [kr, ki] = rings(-K, -K, K, K, 5, 1.4);
  const block = solid(g);
  put(block, prism(P, front, kr, ki, 0, KH));
  const lg = logo(P, 0.062, KH);
  const pixEl = mk("path", { d: lg.pix, class: "dot" }, g), dotEl = mk("path", { d: lg.dot, class: "dot kpink" }, g);
  bricks[1].bg.after(block.g, pixEl, dotEl);
  for (const b of bricks.slice(2)) g.appendChild(b.bg);

  function draw(b, t) {
    if (t === b.drawn) return;
    b.drawn = t;
    const q = brick(b.d, t * reach * 0.6, t * reach), [r, ri] = rings(q.x0, q.y0, q.x1, q.y1, 4, 1.2);
    put(b.body, prism(P, front, r, ri, q.z, q.z + BH));
    q.studs.forEach(([x, y], k) => put(b.studs[k], prism(P, front, shift(circ(SR, 14), x, y), shift(circ(SR - 0.9, 14), x, y), q.z + BH, q.z + BH + SH)));
  }

  const B = register(stage, (dt, now) => {
    bricks.forEach((b, i) => {
      const t = tval(b.out, now);
      draw(b, t);
      const live = t < 0.05;
      if (live) ph[i] = (ph[i] + dt * 0.35) % 1;
      pulses[i].forEach((el, k) => {
        place(el, P(...along(route(b.d), (ph[i] + k / 3) % 1), 0));
        el.setAttribute("class", live ? (act >= 0 ? "dot off" : "dot m") : "dot off");
      });
    });
    return true;
  });
  bag.add(B.unregister);

  function hit([x, y]) {
    let best = -1, bd = 14;
    bricks.forEach((b, i) => {
      for (const z of [0, BH / 2, BH]) {
        const w = unproj(C, x, y, z), dd = Math.hypot(w[0] - b.home.cx, w[1] - b.home.cy);
        if (dd < bd && Math.hypot(w[0], w[1]) > dd) { bd = dd; best = i; }
      }
    });
    return best;
  }

  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act >= 0 ? act : WAITING;
    act = a;
    bricks.forEach((b, i) => {
      const ring = Math.min(Math.abs(i - from), 4 - Math.abs(i - from));
      tset(b.out, a < 0 ? REST_OUT[i] : i === a ? 1 : 0, now, ring * 50);
      b.body.sil.classList.toggle("hi", i === a);
      b.studs.forEach((s) => s.sil.classList.toggle("hi", i === a));
    });
    block.sil.classList.toggle("hi", a < 0);
    read.textContent = a < 0 ? "rest" : "plugin " + (a + 1);
    B.wake();
  }
  setActive(-1);

  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { reach = v; bricks.forEach((b) => { b.drawn = NaN; }); B.wake(); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "plugins",
  means: "The Kestra block with plugin bricks docked on its sides: point at one and it unplugs while the others seat home.",
  rules: [1, 2, 5, 7],
  range: [10, 18, 26],
  tour: [[150, 120], [250, 120], [270, 200], null],
  mount,
});
}
