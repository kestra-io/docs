// @ts-nocheck
/* eslint-disable */
/**
 * VM: a bare-metal host, and on its lid, seated in a socket, a virtual
 * machine carrying the Kestra mark. Point above the lid and the VM lifts out
 * of its host, dashed guides dropping back to the socket it came from; point
 * at the host and the host takes the bright edge while the VM stays seated.
 * At rest the VM sits just above its socket and the mark is the bright place.
 * The slider is the lift, in world units.
 */
export default function define(HL, hairline) {
const {
  Cam, circ, extremes, facing, fit, poly, prism, proj, rings, rrect, seg, tdone, tset, tval, tween,
  mk, pointer, put, register, disposer, solid,
} = HL;

const HX = 40, HY = 34, HH = 24, V = 17, VH = 15, REST = 2, MAX = 26;
const PIX = [[300, 147], [223, 224], [377, 224], [146, 301], [300, 301], [454, 301]];

function logo(P, s, z) {
  const w = (u, v) => { const du = (u - 300) * s, dv = (v - 300) * s; return [(du + dv) / Math.SQRT2, (dv - du) / Math.SQRT2]; };
  const h = 34 * s, [dx, dy] = w(300, 462);
  const pix = PIX.map(([u, v]) => { const [x, y] = w(u, v); return poly(rrect(x - h, y - h, x + h, y + h, h * 0.45, 3).map((q) => P(q.u, q.v, z))); }).join("");
  return { pix, dot: poly(circ(44 * s, 16).map((q) => P(q.u + dx, q.v + dy, z))) };
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lift = value, part = null;

  const C = Cam(45, 0.5, 2.5);
  fit(C, [[-HX, -HY, 0], [HX, HY, 0], [HX, -HY, 0], [-HX, HY, 0], [-V, -V, HH + MAX + VH], [V, V, HH + MAX + VH]], 200, 172);
  const P = proj(C), front = facing(C);

  const g = mk("g", {}, svg);
  const host = solid(g);
  const [hRing, hInner] = rings(-HX, -HY, HX, HY, 8, 1.8);
  put(host, prism(P, front, hRing, hInner, 0, HH));
  const led = (y, z) => poly(circ(1.6, 10).map((q) => P(HX, y + q.u, z + q.v)));
  mk("path", { class: "dot m", d: led(HY - 8, HH / 2) + led(HY - 14, HH / 2) }, g);
  mk("path", { class: "lo nf", d: poly(rrect(-V - 3, -V - 3, V + 3, V + 3, 6, 4).map((q) => P(q.u, q.v, HH))) }, g);

  const guides = mk("path", { class: "dash nf" }, g);
  const vm = solid(g);
  const [vRing, vInner] = rings(-V, -V, V, V, 5, 1.4);
  const drops = extremes(P, vRing);
  const pixEl = mk("path", { class: "dot" }, g), dotEl = mk("path", { class: "dot kpink" }, g);
  const z = tween(REST);
  let drawn = NaN;

  function draw(L) {
    if (L === drawn) return;
    drawn = L;
    const z0 = HH + L;
    put(vm, prism(P, front, vRing, vInner, z0, z0 + VH));
    guides.setAttribute("d", L > REST + 1 ? drops.map((q) => seg(P(q.u, q.v, HH), P(q.u, q.v, z0))).join("") : "");
    const lg = logo(P, 0.05, z0 + VH);
    pixEl.setAttribute("d", lg.pix);
    dotEl.setAttribute("d", lg.dot);
  }

  const B = register(stage, (dt, now) => {
    draw(tval(z, now));
    return !tdone(z, now);
  });
  bag.add(B.unregister);

  function choose(p) {
    if (p === part) return;
    part = p;
    tset(z, p === "vm" ? lift : REST, performance.now(), 0);
    vm.sil.classList.toggle("hi", p === "vm");
    host.sil.classList.toggle("hi", p === "host");
    pixEl.setAttribute("class", p ? "dot m" : "dot");
    read.textContent = p || "rest";
    B.wake();
  }

  const lid = P(0, 0, HH)[1];
  bag.add(pointer(stage, { move: ([, y]) => choose(y < lid ? "vm" : "host"), leave: () => choose("") }));
  bag.add(() => svg.replaceChildren());
  choose("");

  return {
    set: (v) => {
      lift = v;
      if (part === "vm") tset(z, lift, performance.now(), 0);
      B.wake();
    },
    destroy: bag.dispose,
  };
}

hairline({
  name: "vm",
  means: "A virtual machine seated on its bare-metal host: point above the lid and the VM lifts out of its socket.",
  rules: [1, 4, 5, 6],
  range: [10, 18, 26],
  tour: [[200, 120], [200, 220], null],
  mount,
});
}
