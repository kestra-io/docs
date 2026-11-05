// @ts-nocheck
/* eslint-disable */
/**
 * Patch: a floor of tiles with one missing, the hole a vulnerability, and the
 * Kestra tile hovering above it. The nearer the pointer comes to the hole, the
 * lower the tile sinks, until it sets into place and the floor is whole. At
 * rest the hole is open and the mark is the bright place; once patched, the
 * bright goes to the tile's edge. The slider is the reach, in world units.
 */
export default function define(HL, hairline) {
const {
  Cam, circ, clamp, extremes, fit, facing, poly, prism, proj, rings, rrect, seg, unproj,
  spring, stepS, mk, pointer, put, register, disposer, solid,
} = HL;

const N = 3, CELL = 28, FOOT = 23, TH = 7, PB = 4, HOVER = 46;
const HOLE = [1, 0];
const EXT = N * CELL;
const PIX = [[300, 147], [223, 224], [377, 224], [146, 301], [300, 301], [454, 301]];

function logo(P, s, cx, cy, z) {
  const w = (u, v) => { const du = (u - 300) * s, dv = (v - 300) * s; return [cx + (du + dv) / Math.SQRT2, cy + (dv - du) / Math.SQRT2]; };
  const h = 34 * s, [dx, dy] = w(300, 462);
  const pix = PIX.map(([u, v]) => { const [x, y] = w(u, v); return poly(rrect(x - h, y - h, x + h, y + h, h * 0.45, 3).map((q) => P(q.u, q.v, z))); }).join("");
  return { pix, dot: poly(circ(44 * s, 16).map((q) => P(q.u + dx, q.v + dy, z))) };
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let R = value, over = null;

  const C = Cam(45, 0.5, 2.0);
  const hc = [(HOLE[0] + 0.5) * CELL, (HOLE[1] + 0.5) * CELL];
  fit(C, [[-5, -5, -PB], [EXT + 5, EXT + 5, -PB], [EXT + 5, -5, -PB], [-5, EXT + 5, -PB], [hc[0], hc[1], HOVER + TH + 8]], 200, 166);
  const P = proj(C), front = facing(C);

  const g = mk("g", {}, svg);
  const [pr, pi] = rings(-5, -5, EXT + 5, EXT + 5, 8, 2);
  put(solid(g), prism(P, front, pr, pi, -PB, 0));

  const off = (CELL - FOOT) / 2;
  const tileRings = (i, j) => rings(i * CELL + off, j * CELL + off, i * CELL + off + FOOT, j * CELL + off + FOOT, 3.5, 1.1);

  // The hole: a dashed outline on the floor, where the missing tile stood.
  const [hr] = tileRings(...HOLE);
  // Diagonal by diagonal from the back corner, so appending paints back to front.
  let holeTile = null;
  for (let s = 0; s <= 2 * (N - 1); s++) for (let i = 0; i < N; i++) {
    const j = s - i;
    if (j < 0 || j >= N) continue;
    if (i === HOLE[0] && j === HOLE[1]) {
      holeTile = mk("path", { d: poly(hr.map((q) => P(q.u, q.v, 0))), class: "nf dash" }, g);
      continue;
    }
    // A slight swell across the floor, so rest is not flat.
    const h = TH - 1.5 + 3 * Math.exp(-((i - 0.3) ** 2 + (j - 1.8) ** 2) / 1.6);
    const [r, ri] = tileRings(i, j);
    put(solid(g), prism(P, front, r, ri, 0, h));
  }

  const [kr, ki] = tileRings(...HOLE);
  // Dashed drops from the tile's outer corners to the hole: where it belongs.
  const drops = mk("path", { class: "nf dash" }, g);
  const ends = extremes(P, kr);
  const patch = mk("g", {}, g);
  const tile = solid(patch);
  const pixEl = mk("path", { class: "dot" }, patch), dotEl = mk("path", { class: "dot kpink" }, patch);
  let inPlace = null;

  const sp = spring(HOVER, { eps: 0.02 });
  let drawn = NaN;
  function draw() {
    const z = clamp(sp.x, 0, HOVER);
    if (z === drawn) return;
    drawn = z;
    // Low, it takes its place in the paint order; high, it is over everything.
    const low = z < TH + 2;
    if (low !== inPlace) { inPlace = low; if (low) holeTile.after(drops, patch); else g.append(drops, patch); }
    drops.setAttribute("d", z < 1 ? "" : ends.map((q) => seg(P(q.u, q.v, 0), P(q.u, q.v, z))).join(""));
    put(tile, prism(P, front, kr, ki, z, z + TH));
    const lg = logo(P, 0.052, hc[0], hc[1], z + TH);
    pixEl.setAttribute("d", lg.pix);
    dotEl.setAttribute("d", lg.dot);
    const set = z < 0.5;
    tile.sil.classList.toggle("hi", set);
    pixEl.setAttribute("class", set ? "dot m" : "dot");
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);

  // The pointer is put on the ground, which never moves, and measured to the hole.
  function retarget() {
    if (!over) { sp.t = HOVER; read.textContent = "rest"; B.wake(); return; }
    const d = Math.hypot(over[0] - hc[0], over[1] - hc[1]);
    sp.t = HOVER * clamp((d - CELL * 0.4) / R, 0, 1);
    read.textContent = sp.t < 0.5 ? "patched" : sp.t < HOVER * 0.9 ? "patching" : "open";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => { over = unproj(C, p[0], p[1], 0); retarget(); },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  draw();

  return {
    set: (v) => { R = v; if (over) retarget(); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "patch",
  means: "A floor of tiles with one missing: bring the pointer to the hole and the Kestra tile sets into place.",
  rules: [1, 3, 4, 5],
  range: [40, 70, 110],
  tour: [[90, 200], [190, 195], [240, 172], null],
  mount,
});
}
