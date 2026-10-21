// @ts-nocheck
/* eslint-disable */
// Hairline figure, drawn with the hairline-create skill. Edit the body, not the wrapper.
export default function define(HL, hairline) {
/**
 * Deploy: a client's estate on a rounded plinth, holding a server, a database
 * and a screen, and the Kestra block hovering above its centre, still to be
 * set down. The pointer picks a system: the block settles onto the plinth, and
 * the cable from it to that system lights while the system lifts to show it is
 * wired. The slider is that lift.
 *
 * The pattern: one of many. Tweens, a bright stroke that passes from the block
 * at rest to the wired system, and a hit test on each system's rest pose.
 */
const {
  Cam, circ, facing, fit, open, poly, prism, proj, ringAt, rings, rrect, run, seg,
  tset, tval, tween, unproj, disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const PL = 70, PB = 5, K = 11, KH = 22, HOVER = 16;
/** The Kestra mark laid on a top face: six rounded pixels in a pyramid and the dot under them. s is world units per unit of the 600 mark. */
const PIX = [[300, 147], [223, 224], [377, 224], [146, 301], [300, 301], [454, 301]];
function logo(P, s, z) {
  const w = (u, v) => { const du = (u - 300) * s, dv = (v - 300) * s; return [(du + dv) / Math.SQRT2, (dv - du) / Math.SQRT2]; };
  const h = 34 * s, [dx, dy] = w(300, 462);
  const pix = PIX.map(([u, v]) => { const [x, y] = w(u, v); return poly(rrect(x - h, y - h, x + h, y + h, h * 0.45, 3).map((q) => P(q.u, q.v, z))); }).join("");
  return { pix, dot: poly(circ(44 * s, 16).map((q) => P(q.u + dx, q.v + dy, z))) };
}

/** The point a fraction f along a route of world [x, y] points. */
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
const box = (x0, y0, x1, y1, r, b, z0, z1) => { const [ring, inner] = rings(x0, y0, x1, y1, r, b); return { ring, inner, z0, z1 }; };

/** The three systems, far to near: their parts as solids, the marks on their faces, the cable's route from the block, and their height. */
const SYSTEMS = [
  {
    name: "server", c: [-44, -38], h: 46,
    parts: [box(-53, -46, -35, -30, 3, 1.1, 0, 46)],
    // blade slots across the face that looks left, and one bright-able light
    marks: (P, L) => [10, 17, 24, 31, 38].map((z) => seg(P(-51, -30, z + L), P(-41, -30, z + L))).join(""),
    route: [[0, 0], [-44, 0], [-44, -38]],
  },
  {
    name: "db", c: [44, -36], h: 30,
    parts: [{ ring: shift(circ(12, 28), 44, -36), inner: shift(circ(10.8, 28), 44, -36), z0: 0, z1: 30 }],
    // the seams between the platters of a database cylinder
    marks: (P, L, front, ring) => [10, 20].map((z) => open(ringAt(P, run(ring, front), z + L))).join(""),
    route: [[0, 0], [0, -36], [44, -36]],
  },
  {
    name: "screen", c: [-38, 42], h: 36,
    parts: [box(-47, 33, -29, 51, 4, 1.1, 0, 2.5), box(-41, 40, -37, 44, 1.5, 0.6, 2.5, 13), box(-40, 25, -36, 59, 1.5, 0.6, 13, 37)],
    // the glass, inset on the panel's face
    marks: (P, L) => poly(rrect(28, 16, 56, 34, 1.5, 4).map((q) => P(-36, q.u, q.v + L))),
    route: [[0, 0], [0, 42], [-38, 42]],
  },
];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lift = value;

  const C = Cam(45, 0.5, 1.68);
  fit(C, [[-PL, -PL, -PB], [PL, PL, -PB], [PL, -PL, -PB], [-PL, PL, -PB], [-PL, -PL, 46 + 14], [K, K, HOVER + KH]], 200, 166);
  const P = proj(C), front = facing(C);

  const g = mk("g", {}, svg);
  const [pr, pi] = rings(-PL, -PL, PL, PL, 12, 2.2);
  put(solid(g), prism(P, front, pr, pi, -PB, 0));

  // the cables lie on the plinth, painted before every solid that stands on them, and data runs along them
  const cables = SYSTEMS.map((s) => mk("path", { d: open(s.route.map(([x, y]) => P(x, y, 0))), class: "nf dash" }, g));
  const pg = mk("g", {}, g);
  const pulses = SYSTEMS.map(() => [0, 1, 2].map(() => flatDot(pg, C, 1.5, "dot m")));
  const ph = SYSTEMS.map((_, i) => i / 5);
  let act = -2;

  // the block, its slot dashed on the plinth where it will sit, and the Kestra mark on top
  const [kr, ki] = rings(-K, -K, K, K, 4, 1.2);
  const drops = mk("path", { d: poly(ringAt(P, kr, 0)), class: "nf dash" }, g);
  const block = solid(g);
  const pixEl = mk("path", { class: "dot" }, g), dotEl = mk("path", { class: "dot kpink" }, g);
  const blockZ = tween(HOVER);

  // the systems, in paint order: the server is farthest; the database and the screen sit level
  const sys = SYSTEMS.map((s) => {
    const sg = mk("g", {}, g);
    const els = s.parts.map(() => solid(sg));
    const m = mk("path", { class: "nf lo" }, sg);
    return { ...s, els, m, z: tween(0), drawn: NaN };
  });
  // the block stands in front of the server and behind the two near systems
  sys[0].els[0].g.parentNode.after(drops, block.g, pixEl, dotEl);

  let drawnK = NaN;
  function drawBlock(z) {
    if (z === drawnK) return;
    drawnK = z;
    put(block, prism(P, front, kr, ki, z, z + KH));
    const lg = logo(P, 0.045, z + KH);
    pixEl.setAttribute("d", lg.pix);
    dotEl.setAttribute("d", lg.dot);
  }
  function drawSys(s, L) {
    if (L === s.drawn) return;
    s.drawn = L;
    s.parts.forEach((p, k) => put(s.els[k], prism(P, front, p.ring, p.inner, p.z0 + L, p.z1 + L)));
    s.m.setAttribute("d", s.marks(P, L, front, s.parts[0].ring));
  }

  // the data never stops: it runs from the block to every system, faster on the one wired
  const B = register(stage, (dt, now) => {
    drawBlock(tval(blockZ, now));
    sys.forEach((s) => drawSys(s, tval(s.z, now)));
    sys.forEach((s, i) => {
      ph[i] = (ph[i] + dt * (i === act ? 0.7 : 0.22)) % 1;
      pulses[i].forEach((el, k) => place(el, P(...along(s.route, (ph[i] + k / 3) % 1), 0)));
    });
    return true;
  });
  bag.add(B.unregister);

  /** The system nearest the pointer, tested along its rest pose from foot to top; -1 over the block or the bare plinth. */
  function hit([x, y]) {
    let best = -1, bd = 15;
    sys.forEach((s, i) => {
      for (const f of [0, 0.5, 1]) {
        const w = unproj(C, x, y, s.h * f), d = Math.hypot(w[0] - s.c[0], w[1] - s.c[1]);
        if (d < bd) { bd = d; best = i; }
      }
    });
    return best;
  }

  function setActive(a) {
    if (a === act) return;
    act = a;
    const now = performance.now();
    tset(blockZ, a < 0 ? HOVER : 0, now, 0);
    block.sil.classList.toggle("hi", a < 0);
    sys.forEach((s, i) => {
      tset(s.z, i === a ? lift : 0, now, i === a ? 60 : 0);
      s.els.forEach((e) => e.sil.classList.toggle("hi", i === a));
      cables[i].classList.toggle("hi", i === a);
      pulses[i].forEach((el) => el.setAttribute("class", a < 0 ? "dot m" : i === a ? "dot" : "dot off"));
    });
    read.textContent = a < 0 ? "rest" : sys[a].name;
    B.wake();
  }
  setActive(-1);

  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { lift = v; if (act >= 0) { tset(sys[act].z, lift, performance.now(), 0); B.wake(); } },
    destroy: bag.dispose,
  };
}

hairline({
  name: "deploy",
  means: "A client's estate with the Kestra block above it: point at a system and the block sets down, wired to it.",
  rules: [1, 4, 5, 7],
  range: [4, 10, 16],
  tour: [[120, 110], [290, 120], [110, 210], null],
  mount,
});
}
