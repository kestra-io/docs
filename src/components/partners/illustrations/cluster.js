// @ts-nocheck
/* eslint-disable */
export default function define(HL, hairline) {
const {
  Cam, circ, facing, fillet, fit, poly, seg, prism, proj, rings, rrect, tdone, tset, tval, tween,
  mk, pointer, put, register, disposer, solid,
} = HL;

const H = 30, UH = 18, REST = 4, N = 3;
const HR = 24;

function helm(P, z) {
  const w = (u, v) => [(u + v) / Math.SQRT2, (v - u) / Math.SQRT2];
  const at = (u, v) => { const [x, y] = w(u * HR, v * HR); return P(x, y, z); };
  const ang = (k) => -Math.PI / 2 + (k * 2 * Math.PI) / 7;
  const hept = fillet(Array.from({ length: 7 }, (_, k) => [Math.cos(ang(k)), Math.sin(ang(k))]), Array(7).fill(0.18), 4);
  const ring = (r, cx = 0, cy = 0) => poly(circ(r, 28).map((q) => at(cx + q.u, cy + q.v)));
  const spokes = Array.from({ length: 7 }, (_, k) => seg(at(Math.cos(ang(k)) * 0.14, Math.sin(ang(k)) * 0.14), at(Math.cos(ang(k)) * 0.78, Math.sin(ang(k)) * 0.78))).join("");
  const tips = Array.from({ length: 7 }, (_, k) => ring(0.075, Math.cos(ang(k)) * 0.78, Math.sin(ang(k)) * 0.78)).join("");
  return { hept: poly(hept.map(([u, v]) => at(u, v))), wheel: ring(0.5) + spokes, hub: ring(0.12) + tips };
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
  const units = Array.from({ length: N }, () => {
    const el = solid(g);
    const leds = mk("path", { class: "dot m" }, g);
    return { el, leds, z: tween(0), drawn: NaN };
  });
  const heptEl = mk("path", { class: "nf" }, g), wheelEl = mk("path", { class: "hi nf" }, g), hubEl = mk("path", { class: "dot" }, g);
  const led = (x, z) => poly(circ(1.5, 10).map((q) => P(H, x + q.u, z + q.v)));

  function drawUnit(u, i, L) {
    if (L === u.drawn) return;
    u.drawn = L;
    const z0 = base(i) + L;
    put(u.el, prism(P, front, ring, inner, z0, z0 + UH));
    u.leds.setAttribute("d", led(H - 9, z0 + UH / 2) + led(H - 15, z0 + UH / 2));
    if (i === N - 1) {
      const h = helm(P, z0 + UH);
      heptEl.setAttribute("d", h.hept);
      wheelEl.setAttribute("d", h.wheel);
      hubEl.setAttribute("d", h.hub);
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
    units.forEach((u, i) => tset(u.z, s >= 0 && i > s ? gap : 0, now, s >= 0 && i > s ? (i - s - 1) * 45 : 0));
    units.forEach((u, i) => u.el.sil.classList.toggle("hi", i === s + 1 && s >= 0));
    wheelEl.setAttribute("class", s >= 0 ? "nf" : "hi nf");
    hubEl.setAttribute("class", s >= 0 ? "dot m" : "dot");
    read.textContent = s < 0 ? "rest" : `gap ${s + 1}`;
    B.wake();
  }
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
  name: "cluster",
  means: "A cluster of nodes, the Kubernetes helm on top: point at a seam and the nodes above lift away.",
  rules: [1, 2, 4, 5],
  range: [8, 16, 24],
  tour: [[205, 200], [195, 165], null],
  mount,
});
}
