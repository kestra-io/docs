// @ts-nocheck
/* eslint-disable */
/**
 * Cloud: a cloud-shaped slab carrying the Kestra mark, hovering over a plate
 * that holds a database, a server stack and a worker block. Dashed drops tie it to them and dots
 * run down the drops. At rest the mark is the bright place. The nearer the
 * pointer comes, the higher the cloud rises and the faster the dots fall,
 * and the drops and their dots take the bright. The slider is the rise, in
 * world units.
 */
export default function define(HL, hairline) {
const {
  Cam, circ, clamp, facing, fit, open, poly, prism, proj, ringAt, rings, rrect, run, seg,
  spring, stepS, disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const PL = 60, PB = 5, HOVER = 46, TH = 15, INSET = 0.8, CREASE = 2;
const PIX = [[300, 147], [223, 224], [377, 224], [146, 301], [300, 301], [454, 301]];
const R2 = Math.SQRT2;

// The cloud is drawn in its own frame: a runs across the screen, b away from
// the viewer. world() turns a point or a direction of that frame to the ground.
const world = (a, b) => [(a - b) / R2, (-a - b) / R2];
const turn = (ring, ca, cb) => ring.map((q) => {
  const [u, v] = world(q.u + ca, q.v + cb), [nu, nv] = world(q.nu, q.nv);
  return { u, v, nu, nv };
});

// Each piece of the cloud: its outline at an inset d, and whether a point of
// the cloud's frame lies inside it at that inset.
const puff = (ca, cb, r) => ({
  ring: (d) => turn(circ(r - d, 40), ca, cb),
  has: (a, b, d) => Math.hypot(a - ca, b - cb) < r - d,
});
const slab = (a0, b0, a1, b1, r) => ({
  ring: (d) => turn(rrect(a0 + d, b0 + d, a1 - d, b1 - d, r - d, 8), 0, 0),
  has: (a, b, d) => {
    const ia = clamp(a, a0 + r, a1 - r), ib = clamp(b, b0 + r, b1 - r);
    return Math.hypot(a - ia, b - ib) < r - d;
  },
});
const PIECES = [slab(-56, -22, 56, 11, 16.5), puff(-24, 11, 21), puff(9, 19, 29), puff(36, 8, 16)];
const local = (q) => [(q.u - q.v) / R2, -(q.u + q.v) / R2];

function logo(P, s, z) {
  const w = (u, v) => { const du = (u - 300) * s, dv = (v - 300) * s; return [(du + dv) / R2, (dv - du) / R2 - 4]; };
  const h = 34 * s, [dx, dy] = w(300, 462);
  const pix = PIX.map(([u, v]) => { const [x, y] = w(u, v); return poly(rrect(x - h, y - h, x + h, y + h, h * 0.45, 3).map((q) => P(q.u, q.v, z))); }).join("");
  return { pix, dot: poly(circ(44 * s, 16).map((q) => P(q.u + dx, q.v + dy - 4, z))) };
}

// A database at the back, a server stack on the left, a worker block in front.
const SYSTEMS = [
  { c: [30, -30], h: 24 },
  { c: [-34, 20], h: 28 },
  { c: [34, 34], h: 14 },
];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let rise = value;

  const C = Cam(45, 0.5, 1.84);
  fit(C, [[-PL, -PL, -PB], [PL, PL, -PB], [PL, -PL, -PB], [-PL, PL, -PB], [-44, -44, HOVER + TH + 18], [44, 44, HOVER + TH + 18]], 200, 170);
  const P = proj(C), front = facing(C);

  const g = mk("g", {}, svg);
  const [pr, pi] = rings(-PL, -PL, PL, PL, 12, 2.2);
  put(solid(g), prism(P, front, pr, pi, -PB, 0));

  // Back to front: the database, the server stack, the worker block.
  const [db, sv, wk] = SYSTEMS;
  const round = (r) => circ(r, 32).map((q) => ({ ...q, u: q.u + db.c[0], v: q.v + db.c[1] }));
  const dring = round(14), dinner = round(12.6);
  const stand = (ring, inner, z0, z1) => put(solid(g), prism(P, front, ring, inner, z0, z1));
  stand(dring, dinner, 0, db.h);
  [8, 16].forEach((z) => mk("path", { d: open(ringAt(P, run(dring, front), z)), class: "nf lo" }, g));
  [0, 1].forEach((i) => {
    const [ring, inner] = rings(sv.c[0] - 15, sv.c[1] - 15, sv.c[0] + 15, sv.c[1] + 15, 4.5, 1.3);
    stand(ring, inner, i * 15, i * 15 + 13);
    mk("path", { d: [0, 6].map((d) => poly(circ(1.3, 10).map((q) => P(sv.c[0] + 15, sv.c[1] + 8 - d + q.u, i * 15 + 6.5 + q.v)))).join(""), class: "dot m" }, g);
  });
  const [wr, wi] = rings(wk.c[0] - 11, wk.c[1] - 11, wk.c[0] + 11, wk.c[1] + 11, 4, 1.2);
  stand(wr, wi, 0, wk.h);

  const drops = SYSTEMS.map(() => mk("path", { class: "nf dash" }, g));
  const pg = mk("g", {}, g);
  const pulses = SYSTEMS.map(() => [0, 1].map(() => flatDot(pg, C, 1.7, "dot m")));
  const ph = [0, 0.35, 0.7];

  const cg = mk("g", {}, g);
  const edges = PIECES.map(() => mk("path", { class: "sil" }, cg));
  const fills = PIECES.map(() => mk("path", { class: "fo" }, cg));
  const crease = mk("path", { class: "nf lo" }, cg);
  const pixEl = mk("path", { class: "dot" }, cg), dotEl = mk("path", { class: "dot kpink" }, cg);

  const outer = PIECES.map((p) => p.ring(0));
  const inset = PIECES.map((p) => p.ring(INSET));
  // The lid's edge: each piece's front run, without what another piece covers.
  const lids = PIECES.map((p, i) => run(p.ring(CREASE), front).map((q) => {
    const [a, b] = local(q);
    return { q, seen: !PIECES.some((o, j) => j !== i && o.has(a, b, CREASE)) };
  }));

  const z = spring(HOVER, { k: 70, c: 14 });
  let drawn = NaN, near = 0;

  function drawCloud(h) {
    if (h === drawn) return;
    drawn = h;
    PIECES.forEach((_, i) => {
      edges[i].setAttribute("d", prism(P, front, outer[i], null, h, h + TH).sil);
      fills[i].setAttribute("d", prism(P, front, inset[i], null, h, h + TH).sil);
    });
    let d = "";
    lids.forEach((lid) => {
      for (let k = 1; k < lid.length; k++) {
        if (lid[k].seen && lid[k - 1].seen) d += seg(P(lid[k - 1].q.u, lid[k - 1].q.v, h + TH), P(lid[k].q.u, lid[k].q.v, h + TH));
      }
    });
    crease.setAttribute("d", d);
    const lg = logo(P, 0.078, h + TH);
    pixEl.setAttribute("d", lg.pix);
    dotEl.setAttribute("d", lg.dot);
    SYSTEMS.forEach((s, i) => drops[i].setAttribute("d", seg(P(s.c[0], s.c[1], s.h), P(s.c[0], s.c[1], h))));
  }

  const B = register(stage, (dt) => {
    stepS(z, dt);
    drawCloud(z.x);
    SYSTEMS.forEach((s, i) => {
      ph[i] = (ph[i] + dt * (0.35 + 0.8 * near)) % 1;
      pulses[i].forEach((el, k) => {
        const f = (ph[i] + k / 2) % 1;
        place(el, P(s.c[0], s.c[1], z.x - (z.x - s.h) * f));
      });
    });
    return true;
  });
  bag.add(B.unregister);

  function setNear(n) {
    near = n;
    z.t = HOVER + rise * n;
    const on = n > 0.5;
    drops.forEach((d) => d.classList.toggle("hi", on));
    pulses.forEach((ps) => ps.forEach((el) => el.setAttribute("class", on ? "dot" : "dot m")));
    read.textContent = n <= 0 ? "rest" : `rise ${Math.round(n * 100)}%`;
    B.wake();
  }

  // The cloud's centre at rest, which never moves.
  const centre = P(0, 0, HOVER + TH / 2);
  bag.add(pointer(stage, {
    move: ([x, y]) => setNear(clamp(1 - (Math.hypot(x - centre[0], y - centre[1]) - 30) / 110, 0, 1)),
    leave: () => setNear(0),
  }));
  bag.add(() => svg.replaceChildren());
  setNear(0);

  return {
    set: (v) => { rise = v; setNear(near); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "cloud",
  means: "A cloud carrying the Kestra mark over a database, a server and a worker: come near and it rises, and the dots run down faster.",
  rules: [1, 4, 5, 7],
  range: [8, 16, 24],
  tour: [[330, 250], [210, 130], [200, 110], null],
  mount,
});
}
