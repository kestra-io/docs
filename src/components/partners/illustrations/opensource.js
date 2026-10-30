// @ts-nocheck
/* eslint-disable */
/**
 * Open source: a box between two code brackets, the Kestra mark inside. The
 * nearer the pointer comes, the wider its four top flaps unfold, the higher
 * the mark rises into view, and the brackets step apart. At rest the box is
 * closed and the brackets are the bright place; once open, the mark
 * is. The slider is the reach, in viewBox units.
 */
export default function define(HL, hairline) {
const {
  Cam, circ, clamp, facing, fillet, fit, open, poly, prism, proj, rings, rrect, rad,
  spring, stepS, mk, pointer, put, register, disposer, solid,
} = HL;

const A = 22, H = 40, AJAR = 0.03, OPEN = rad(118);
const L = 20, TH = rad(52), W = 4.5, GAP = 40, SPREAD = 9;
const PIX = [[300, 147], [223, 224], [377, 224], [146, 301], [300, 301], [454, 301]];
const SIDES = [[-1, 0], [0, -1], [1, 0], [0, 1]]; // back flaps first

function logo(P, s, z) {
  const w = (u, v) => { const du = (u - 300) * s, dv = (v - 300) * s; return [(du + dv) / Math.SQRT2, (dv - du) / Math.SQRT2]; };
  const h = 34 * s, [dx, dy] = w(300, 462);
  const pix = PIX.map(([u, v]) => { const [x, y] = w(u, v); return poly(rrect(x - h, y - h, x + h, y + h, h * 0.45, 3).map((q) => P(q.u, q.v, z))); }).join("");
  return { pix, dot: poly(circ(44 * s, 16).map((q) => P(q.u + dx, q.v + dy, z))) };
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let R = value, over = null;

  const C = Cam(45, 0.5, 2.3);
  // Along e, a direction that runs flat across the screen at this camera.
  const E = (s, z) => [s / Math.SQRT2, -s / Math.SQRT2, z];
  const far = GAP + SPREAD + L * Math.cos(TH) + W;
  fit(C, [[-A, -A, 0], [A, A, 0], [A, -A, 0], [-A, A, 0], [0, 0, H + A], E(-far, H / 2), E(far, H / 2)], 200, 156);
  const P = proj(C), front = facing(C);

  // A bracket: two bars meeting at a point, standing in the plane across the screen.
  const k = W / Math.sin(TH), cu = L * Math.cos(TH), su = L * Math.sin(TH);
  const shape = fillet([[0, 0], [cu, su], [cu + k, su], [k, 0], [cu + k, -su], [cu, -su]], [1, 1, 1, 1.5, 1, 1], 3);
  const bracket = (dir, off) => poly(shape.map(([s, z]) => P(...E(dir * (off + cu + k - s), H / 2 + z))));

  const g = mk("g", {}, svg);
  const left = mk("path", { class: "sil" }, g), right = mk("path", { class: "sil" }, g);
  const [br, bi] = rings(-A, -A, A, A, 3, 1.2);
  put(solid(g), prism(P, front, br, bi, 0, H));
  // Back flaps behind the mark, near flaps in front of everything.
  const back = SIDES.slice(0, 2).map(() => mk("path", { class: "sil" }, g));
  const pixEl = mk("path", { class: "dot" }, g), dotEl = mk("path", { class: "dot kpink" }, g);
  // The two near walls again, so the rising mark stays inside the box.
  mk("path", { class: "sil", d: poly([P(A, -A, 0), P(A, A, 0), P(-A, A, 0), P(-A, A, H), P(A, A, H), P(A, -A, H)]) }, g);
  const near = SIDES.slice(2).map(() => mk("path", { class: "sil" }, g));
  const flapEls = [...back, ...near];

  function flap([nx, ny], phi) {
    const tx = -ny, ty = nx, c = Math.cos(phi), s = Math.sin(phi), t = A - 0.6;
    const pt = (along, d) => P(nx * (A - d * c) + tx * along, ny * (A - d * c) + ty * along, H + d * s);
    return poly([pt(-A + 1, 0), pt(A - 1, 0), pt(A - 1, t), pt(-A + 1, t)]);
  }

  const sp = spring(AJAR, { eps: 0.002 });
  let drawn = NaN;
  function draw() {
    const o = clamp(sp.x, 0, 1);
    if (o === drawn) return;
    drawn = o;
    const phi = OPEN * o;
    flapEls.forEach((el, i) => el.setAttribute("d", flap(SIDES[i], phi)));
    left.setAttribute("d", bracket(-1, GAP + SPREAD * o));
    right.setAttribute("d", bracket(1, GAP + SPREAD * o));
    // The mark rises from the floor of the box; hidden until the flaps part.
    const up = o > 0.3;
    const lg = logo(P, 0.07, H - 12 + 24 * o);
    pixEl.setAttribute("d", up ? lg.pix : "");
    dotEl.setAttribute("d", up ? lg.dot : "");
    const lit = o > 0.5;
    left.classList.toggle("hi", !lit);
    right.classList.toggle("hi", !lit);
    pixEl.setAttribute("class", lit ? "dot" : "dot m");
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);

  // The box never moves, so the pointer is measured to its top at rest.
  const lid = P(0, 0, H);
  function retarget() {
    if (!over) { sp.t = AJAR; read.textContent = "rest"; B.wake(); return; }
    const d = Math.hypot(over[0] - lid[0], over[1] - lid[1]);
    sp.t = Math.max(AJAR, clamp((R - d) / (R * 0.7), 0, 1));
    read.textContent = sp.t > 0.95 ? "open" : sp.t > AJAR + 0.05 ? "opening" : "closed";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => { over = p; retarget(); },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  draw();

  return {
    set: (v) => { R = v; retarget(); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "opensource",
  means: "A box between two code brackets: bring the pointer near and its flaps unfold on the Kestra mark inside.",
  rules: [1, 3, 4, 5],
  range: [70, 110, 160],
  tour: [[330, 90], [250, 130], [200, 140], null],
  mount,
});
}
