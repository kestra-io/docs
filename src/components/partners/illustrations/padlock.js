// @ts-nocheck
/* eslint-disable */
/**
 * Padlock: a padlock standing on its foot, the Kestra mark as its keyhole.
 * The nearer the pointer comes to the keyhole, the more the shackle lifts out
 * of the body and swings back on its long leg. At rest it is locked and the
 * mark is the bright place; once open, the bright goes to the shackle. The
 * slider is the reach, in viewBox units.
 */
export default function define(HL, hairline) {
const {
  Cam, clamp, facing, fit, prism, proj, rings, rrect, circ, poly, rad,
  spring, stepS, mk, pointer, put, register, disposer, solid,
} = HL;

const BW = 34, BD = 13, BH = 54; // body half width, half depth, height
const LEG = 18.5, BAR = 3.5, ARC = 76, LIFT = 14, SWING = 55;
const MARK = [[300, 147], [223, 224], [377, 224], [146, 301], [300, 301], [454, 301]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.25);
  const sw = rad(SWING);
  // Centred on the closed lock, its rest pose; the lifted shackle still has
  // room above it.
  fit(C, [[-BW, -BD, 0], [BW, BD, 0], [BW, -BD, 0], [-BW, BD, 0], [-LEG - BAR, 0, ARC + LEG + BAR]], 200, 157);
  const P = proj(C), front = facing(C);
  let R = value, over = null;

  const g = mk("g", {}, svg);
  const [br, bi] = rings(-BW, -BD, BW, BD, 9, 1.6);
  put(solid(g), prism(P, front, br, bi, 0, BH));

  // The shackle: a U-shaped bar in the plane of the body's middle, two plates
  // for its thickness, the far one painted first.
  const back = mk("path", {}, g), fore = mk("path", { class: "sil" }, g);
  function outline(lift, ang, ty) {
    const pts = [];
    const arc = (r, a0, a1) => {
      for (let k = 0; k <= 14; k++) { const a = a0 + ((a1 - a0) * k) / 14; pts.push([r * Math.cos(a), ARC + r * Math.sin(a)]); }
    };
    const o = LEG + BAR, i = LEG - BAR, zl = BH - lift, zr = BH;
    pts.push([-o, zl]); arc(o, Math.PI, 0); pts.push([o, zr], [i, zr]); arc(i, 0, Math.PI); pts.push([-i, zl]);
    const c = Math.cos(ang), s = Math.sin(ang);
    return poly(pts.map(([lx, lz]) => {
      const dx = lx + LEG; // from the long leg, the pivot
      return P(-LEG + dx * c + ty * s, -dx * s + ty * c, lz + lift);
    }));
  }

  // The keyhole is the Kestra mark: six diamonds and the round dot, in relief
  // on the front face.
  const sc = 0.082, cz = 30;
  const face = (u, v) => P(u, BD + 0.2, v);
  const at = (u, v) => [(u - 300) * sc, cz - (v - 300) * sc];
  const diamond = (cx, cv, h) => rrect(-h, -h, h, h, h * 0.45, 3).map((q) => {
    const a = (q.u - q.v) / Math.SQRT2, b = (q.u + q.v) / Math.SQRT2;
    return face(cx + a, cv - b);
  });
  const pix = MARK.map(([u, v]) => { const [x, z] = at(u, v); return poly(diamond(x, z, 34 * sc)); }).join("");
  const [dx, dz] = at(300, 462);
  const pixEl = mk("path", { d: pix, class: "dot" }, g);
  mk("path", { d: poly(circ(44 * sc, 16).map((q) => face(dx + q.u, dz + q.v))), class: "dot kpink" }, g);

  const sp = spring(0, { eps: 0.002 });
  let drawn = NaN;
  function draw() {
    const o = clamp(sp.x, 0, 1);
    if (o === drawn) return;
    drawn = o;
    const lift = LIFT * Math.min(1, o * 2), ang = sw * Math.max(0, o * 2 - 1);
    back.setAttribute("d", outline(lift, ang, -BAR));
    fore.setAttribute("d", outline(lift, ang, BAR));
    fore.classList.toggle("hi", o > 0.5);
    pixEl.setAttribute("class", o > 0.5 ? "dot m" : "dot");
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);

  // The keyhole never moves, so the pointer is measured against it at rest.
  const key = P(0, BD, cz);
  function retarget() {
    if (!over) { sp.t = 0; read.textContent = "rest"; B.wake(); return; }
    const d = Math.hypot(over[0] - key[0], over[1] - key[1]);
    sp.t = clamp((R - d) / (R * 0.7), 0, 1);
    read.textContent = sp.t > 0.95 ? "open" : sp.t > 0.05 ? "opening" : "locked";
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
  name: "padlock",
  means: "A padlock with the Kestra mark as its keyhole: bring the pointer near and the shackle lifts open.",
  rules: [1, 3, 4, 5],
  range: [70, 110, 160],
  tour: [[300, 90], [235, 170], [200, 200], null],
  mount,
});
}
