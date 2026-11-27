// @ts-nocheck
/* eslint-disable */
export default function define(HL, hairline) {
const {
  Cam, circ, clamp, fit, hull, mk, poly, pointer, proj, register, rrect, disposer, spring, stepS,
} = HL;

const Z0 = 22, D = 20, PHI = 0.4, LIFT = 6, IN = 0.9, BEV = 3.2;
const PARTS = [
  { pill: [-38, 0, 38, 24, 12] },
  { c: [-18, 22, 15] },
  { c: [5, 30, 21] },
  { c: [26, 22, 13] },
];
const MARK = [[300, 147], [223, 224], [377, 224], [146, 301], [300, 301], [454, 301]];
const MC = [4, 26], MS = 0.056;

function shape(p, d) {
  if (p.pill) { const [x0, z0, x1, z1, r] = p.pill; return rrect(x0 + d, z0 + d, x1 - d, z1 - d, r - d, 10); }
  const [x, z, r] = p.c;
  return circ(r - d, 40).map((q) => ({ u: q.u + x, v: q.v + z }));
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.6);
  const W = (a, t, h) => [a * Math.cos(PHI) + t * Math.sin(PHI), t * Math.cos(PHI) - a * Math.sin(PHI), h];
  fit(C, [W(-40, 12, 0), W(40, 12, 0), W(-40, -D / 2, Z0 + 51 + LIFT), W(40, -D / 2, Z0 + 51 + LIFT), W(40, D / 2, Z0), W(-40, -D / 2, Z0)], 200, 160);
  const P = proj(C);
  let R = value, over = null, drawn = "";

  const g = mk("g", {}, svg);
  const shadow = mk("path", { class: "dash nf" }, g);
  const sideEls = PARTS.map(() => mk("path", { class: "sil" }, g));
  const sideFill = PARTS.map(() => mk("path", { class: "fo" }, g));
  const faceEls = PARTS.map(() => mk("path", { class: "nf" }, g));
  const faceFill = PARTS.map(() => mk("path", { class: "fo" }, g));
  const bevEls = PARTS.map(() => mk("path", { class: "lo nf" }, g));
  const bevFill = PARTS.map(() => mk("path", { class: "fo" }, g));
  const pixEl = mk("path", { class: "dot" }, g), dotEl = mk("path", { class: "dot kpink" }, g);

  const sx = spring(0, { eps: 0.03 }), sz = spring(0, { eps: 0.03 });

  function draw() {
    const ox = sx.x, oz = sz.x, key = `${ox.toFixed(2)} ${oz.toFixed(2)}`;
    if (key === drawn) return;
    drawn = key;
    const at = (a, t, h) => P(...W(a + ox, t, h + Z0 + oz));
    const face = (ring, y) => ring.map((q) => at(q.u, y, q.v));
    PARTS.forEach((p, i) => {
      const o = shape(p, 0), n = shape(p, IN);
      sideEls[i].setAttribute("d", poly(hull(face(o, D / 2).concat(face(o, -D / 2)))));
      sideFill[i].setAttribute("d", poly(hull(face(n, D / 2).concat(face(n, -D / 2)))));
      faceEls[i].setAttribute("d", poly(face(o, D / 2)));
      faceFill[i].setAttribute("d", poly(face(n, D / 2)));
      bevEls[i].setAttribute("d", poly(face(shape(p, BEV), D / 2)));
      bevFill[i].setAttribute("d", poly(face(shape(p, BEV + IN), D / 2)));
    });
    shadow.setAttribute("d", poly(circ(1, 40).map((q) => P(...W(ox + q.u * 40, q.v * 12, 0)))));
    const onFace = (u, v) => [MC[0] + (u - 300) * MS, MC[1] - (v - 300) * MS];
    const h = 34 * MS;
    pixEl.setAttribute("d", MARK.map(([u, v]) => {
      const [x, z] = onFace(u, v);
      return poly(rrect(-h, -h, h, h, h * 0.45, 3).map((q) => at(x + (q.u - q.v) / Math.SQRT2, D / 2 + 0.2, z + (q.u + q.v) / Math.SQRT2)));
    }).join(""));
    const [dx, dz] = onFace(300, 462);
    dotEl.setAttribute("d", poly(circ(44 * MS, 16).map((q) => at(dx + q.u, D / 2 + 0.2, dz + q.v))));
  }

  const B = register(stage, (dt) => {
    const a = stepS(sx, dt), b = stepS(sz, dt);
    draw();
    return a || b;
  });
  bag.add(B.unregister);

  function retarget() {
    if (!over) {
      sx.t = 0;
      sz.t = 0;
      read.textContent = "rest";
    } else {
      const k = clamp((over[0] - 200) / 130, -1, 1);
      sx.t = Math.round(k * R);
      sz.t = LIFT;
      read.textContent = sx.t === 0 ? "drift 0" : `drift ${sx.t > 0 ? "+" : ""}${sx.t}`;
    }
    sideEls.forEach((el) => el.setAttribute("class", over ? "hi" : "sil"));
    pixEl.setAttribute("class", over ? "dot m" : "dot");
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => { over = p; retarget(); },
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
  name: "cloud",
  means: "A cloud carrying the Kestra mark, floating over its shadow: move the pointer and it drifts after it.",
  rules: [1, 5, 8, 9],
  range: [6, 12, 18],
  tour: [[110, 150], [300, 140], [200, 120], null],
  mount,
});
}
