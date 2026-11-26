// @ts-nocheck
/* eslint-disable */
export default function define(HL, hairline) {
const {
  Cam, circ, clamp, facing, fillet, fit, hull, lerp, mk, poly, pointer, prism,
  proj, put, rad, register, rings, rrect, disposer, solid, spring, stepS,
} = HL;

const W = 46, D = 31, BH = 4, LD = 52, LT = 2.4, REST = 104, SHUT = 8;
const BOXES = [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [1, 1], [2, 1], [3, 1], [3, 2]];
const WHALE = [[-0.7, 0], [6.1, 0], [6.6, 0.45], [7.05, 1.3], [7.45, 0.55], [7.6, -0.35], [6.9, -1.65], [5.1, -2.75], [3, -3.1], [1, -2.9], [-0.35, -2.15], [-0.75, -1.1]];
const WR = [0.2, 0.5, 0.4, 0.15, 0.4, 0.6, 1.2, 1.2, 1.2, 1.2, 0.9, 0.5];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 1.95);
  const hingeY = -D + 3;
  fit(C, [[-W, -D, 0], [W, D, 0], [W, -D, 0], [-W, D, 0], [-W, hingeY - 14, BH + LD], [W, hingeY - 14, BH + LD]], 200, 170);
  const P = proj(C), front = facing(C);
  let top = value, over = null;

  const g = mk("g", {}, svg);
  const lidG = mk("g", {}, g), baseG = mk("g", {}, g);

  const [br, bi] = rings(-W, -D, W, D, 7, 1.6);
  put(solid(baseG), prism(P, front, br, bi, 0, BH));
  const flat = (x0, y0, x1, y1, r) => poly(rrect(x0, y0, x1, y1, r, 4).map((q) => P(q.u, q.v, BH)));
  mk("path", { d: flat(-W + 6, -D + 7, W - 6, 4, 2.5), class: "lo nf" }, baseG);
  mk("path", { d: flat(-13, 10, 13, D - 5, 2.5), class: "lo nf" }, baseG);

  const lid = solid(lidG);
  const screen = mk("path", { class: "lo nf" }, lidG);
  const whaleEl = mk("path", { class: "nf" }, lidG), boxEl = mk("path", { class: "dot" }, lidG), eyeEl = mk("path", { class: "dot" }, lidG);

  const outer = rrect(-W, 0, W, LD, 5, 4), bezel = rrect(-W + 4, 4, W - 4, LD - 6, 2.5, 4);
  let drawn = NaN;
  function draw(deg) {
    if (deg === drawn) return;
    drawn = deg;
    const a = rad(deg), dy = Math.cos(a), dz = Math.sin(a), ny = Math.sin(a), nz = -Math.cos(a);
    const at = (u, s, w) => P(u, hingeY + s * dy + w * ny, BH + s * dz + w * nz);
    const face = outer.map((q) => at(q.u, q.v, 0)), back = outer.map((q) => at(q.u, q.v, -LT));
    put(lid, { sil: poly(hull(face.concat(back))), crease: "" });
    const open = deg > 62;
    screen.setAttribute("d", open ? poly(bezel.map((q) => at(q.u, q.v, 0.1))) : "");
    const sc = 4.6, cu = 3.4, cv = 0.15, cs = LD * 0.48;
    const pos = (u, v) => [(u - cu) * sc, cs + (v - cv) * sc];
    const onScreen = (pts) => poly(pts.map(([u, v]) => { const [x, y] = pos(u, v); return at(x, y, 0.2); }));
    boxEl.setAttribute("d", open ? BOXES.map(([c, r]) => onScreen(rrect(c * 1.18, 0.14 + r * 1.18, c * 1.18 + 1, 1.14 + r * 1.18, 0.12, 2).map((q) => [q.u, q.v]))).join("") : "");
    whaleEl.setAttribute("d", open ? onScreen(fillet(WHALE, WR, 4)) : "");
    eyeEl.setAttribute("d", open ? onScreen(circ(0.24, 10).map((q) => [1.25 + q.u, -1.3 + q.v])) : "");
    if (deg > 90) g.prepend(lidG); else g.append(lidG);
  }

  const sp = spring(REST, { eps: 0.05 });
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);

  function retarget() {
    if (!over) {
      sp.t = REST;
      lid.sil.classList.remove("hi");
      boxEl.setAttribute("class", "dot");
      read.textContent = "rest";
    } else {
      const k = clamp((262 - over[1]) / 200, 0, 1);
      sp.t = Math.round(lerp(SHUT, top, k));
      lid.sil.classList.add("hi");
      boxEl.setAttribute("class", "dot m");
      read.textContent = `lid ${sp.t}°`;
    }
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => { over = p; retarget(); },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  draw(REST);

  return {
    set: (v) => { top = v; if (over) retarget(); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "laptop",
  means: "An open laptop with the Docker whale on its screen: raise or lower the pointer to open or close the lid.",
  rules: [1, 4, 5, 8],
  range: [96, 110, 124],
  tour: [[200, 70], [200, 230], [200, 120], null],
  mount,
});
}
