// @ts-nocheck
/* eslint-disable */
/**
 * Servers: a stack of three server units, the Kestra mark on the top lid.
 * The pointer picks a seam by its height, and the units above it lift away
 * together, opening an air gap; the unit over the gap takes the bright edge.
 * At rest the stack stands slightly apart and the mark is the bright place.
 * The slider is the gap, in world units.
 */
export default function define(HL, hairline) {
const {
  Cam, circ, facing, fit, poly, prism, proj, rings, rrect, tdone, tset, tval, tween,
  mk, pointer, put, register, disposer, solid,
} = HL;

const H = 30, UH = 18, REST = 4, N = 3; // half side, unit height, rest gap
const PIX = [[300, 147], [223, 224], [377, 224], [146, 301], [300, 301], [454, 301]];

// The mark, lying on a lid at height z, turned to read upright at this camera.
function logo(P, s, z) {
  const w = (u, v) => { const du = (u - 300) * s, dv = (v - 300) * s; return [(du + dv) / Math.SQRT2, (dv - du) / Math.SQRT2]; };
  const h = 34 * s, [dx, dy] = w(300, 462);
  const pix = PIX.map(([u, v]) => { const [x, y] = w(u, v); return poly(rrect(x - h, y - h, x + h, y + h, h * 0.45, 3).map((q) => P(q.u, q.v, z))); }).join("");
  return { pix, dot: poly(circ(44 * s, 16).map((q) => P(q.u + dx, q.v + dy, z))) };
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let gap = value, seam = -1;

  const C = Cam(45, 0.5, 2.2);
  const top = N * UH + (N - 1) * REST;
  fit(C, [[-H, -H, 0], [H, H, 0], [H, -H, 0], [-H, H, 0], [-H, -H, top], [H, H, top]], 200, 176);
  const P = proj(C), front = facing(C);
  const base = (i) => i * (UH + REST);

  const g = mk("g", {}, svg);
  const [ring, inner] = rings(-H, -H, H, H, 7, 1.6);
  // Bottom unit first: each unit above covers the one below it.
  const units = Array.from({ length: N }, () => {
    const el = solid(g);
    const leds = mk("path", { class: "dot m" }, g);
    return { el, leds, z: tween(0), drawn: NaN };
  });
  const pixEl = mk("path", { class: "dot" }, g), dotEl = mk("path", { class: "dot kpink" }, g);

  // Two status lights at the right end of each unit's right face.
  const led = (x, z) => poly(circ(1.5, 10).map((q) => P(H, x + q.u, z + q.v)));

  function drawUnit(u, i, L) {
    if (L === u.drawn) return;
    u.drawn = L;
    const z0 = base(i) + L;
    put(u.el, prism(P, front, ring, inner, z0, z0 + UH));
    u.leds.setAttribute("d", led(H - 9, z0 + UH / 2) + led(H - 15, z0 + UH / 2));
    if (i === N - 1) {
      const lg = logo(P, 0.085, z0 + UH);
      pixEl.setAttribute("d", lg.pix);
      dotEl.setAttribute("d", lg.dot);
    }
  }

  const B = register(stage, (dt, now) => {
    units.forEach((u, i) => drawUnit(u, i, tval(u.z, now)));
    return units.some((u) => !tdone(u.z, now));
  });
  bag.add(B.unregister);

  function setSeam(s) {
    if (s === seam) return;
    seam = s;
    const now = performance.now();
    // Every unit above the seam lifts, the nearest first.
    units.forEach((u, i) => tset(u.z, s >= 0 && i > s ? gap : 0, now, s >= 0 && i > s ? (i - s - 1) * 45 : 0));
    units.forEach((u, i) => u.el.sil.classList.toggle("hi", i === s + 1 && s >= 0));
    pixEl.setAttribute("class", s >= 0 ? "dot m" : "dot");
    read.textContent = s < 0 ? "rest" : `gap ${s + 1}`;
    B.wake();
  }

  // The seams' heights on screen, from the rest pose, which never moves.
  const seams = Array.from({ length: N - 1 }, (_, i) => P(0, 0, base(i + 1) - REST / 2)[1]);
  function hit([, y]) {
    let best = 0;
    seams.forEach((sy, i) => { if (Math.abs(y - sy) < Math.abs(y - seams[best])) best = i; });
    return best;
  }

  bag.add(pointer(stage, { move: (p) => setSeam(hit(p)), leave: () => setSeam(-1) }));
  bag.add(() => svg.replaceChildren());
  setSeam(-1);

  return {
    set: (v) => {
      gap = v;
      const now = performance.now();
      units.forEach((u, i) => { if (seam >= 0 && i > seam) tset(u.z, gap, now, 0); });
      B.wake();
    },
    destroy: bag.dispose,
  };
}

hairline({
  name: "servers",
  means: "A stack of server units, the Kestra mark on top: point at a seam and the units above lift away, opening an air gap.",
  rules: [1, 2, 4, 5],
  range: [8, 16, 24],
  tour: [[205, 200], [195, 165], null],
  mount,
});
}
