// @ts-nocheck
/* eslint-disable */
import airflow from "../../versus/assets/airflow-monograme.svg?url"
import ansible from "../../versus/assets/ansible-automation-platform-monograme.svg?url"
import vmware from "../../versus/assets/vmware-cloud-foundation-monograme.svg?url"
import controlM from "../../versus/assets/control-m-monograme.svg?url"

export default function define(HL, hairline) {
const {
  Cam, circ, extremes, facing, fit, poly, prism, proj, ringAt, rings, rrect, seg,
  tset, tval, tween, unproj, disposer, mk, pointer, put, reducedMotion, register, solid,
} = HL;

const PL = 62, PB = 5, K = 21, KH = 18, C0 = 27, MARK = 11.5, SWAP = 0.5;
const ease = (x) => { const t = Math.min(1, Math.max(0, x)); return t * t * (3 - 2 * t); };
const PIX = [[300, 147], [223, 224], [377, 224], [146, 301], [300, 301], [454, 301]];
const TOOLS = [
  { name: "Airflow", href: airflow, c: [-C0, -C0] },
  { name: "Ansible Tower", href: ansible, c: [C0, -C0] },
  { name: "VMware vRA/vRO", href: vmware, c: [-C0, C0] },
  { name: "Control-M", href: controlM, c: [C0, C0] },
];

function logo(P, s, cx, cy, z) {
  const w = (u, v) => { const du = (u - 300) * s, dv = (v - 300) * s; return [cx + (du + dv) / Math.SQRT2, cy + (dv - du) / Math.SQRT2]; };
  const h = 34 * s, [dx, dy] = w(300, 462);
  const pix = PIX.map(([u, v]) => { const [x, y] = w(u, v); return poly(rrect(x - h, y - h, x + h, y + h, h * 0.45, 3).map((q) => P(q.u, q.v, z))); }).join("");
  return { pix, dot: poly(circ(44 * s, 16).map((q) => P(q.u + dx, q.v + dy, z))) };
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lift = value;

  const C = Cam(45, 0.5, 1.9);
  fit(C, [[-PL, -PL, -PB], [PL, PL, -PB], [PL, -PL, -PB], [-PL, PL, -PB], [-C0 - K, -C0 - K, KH + 34]], 200, 145);
  const P = proj(C), front = facing(C);
  const R = Math.SQRT1_2;

  const g = mk("g", {}, svg);
  const [pr, pi] = rings(-PL, -PL, PL, PL, 12, 2.2);
  put(solid(g), prism(P, front, pr, pi, -PB, 0));

  let act = -2;
  const cubes = TOOLS.map((tool) => {
    const [cx, cy] = tool.c;
    const [ring, inner] = rings(cx - K, cy - K, cx + K, cy + K, 6, 1.6);
    const cg = mk("g", {}, g);
    const slot = mk("path", { d: poly(ringAt(P, ring, 0)), class: "nf dash" }, cg);
    const drops = mk("path", { class: "nf dash" }, cg);
    const body = solid(cg);
    const mark = mk("image", { href: tool.href, x: -MARK, y: -MARK, width: MARK * 2, height: MARK * 2, class: "tool-logo" }, cg);
    const pix = mk("path", { class: "dot" }, cg), dot = mk("path", { class: "dot kpink" }, cg);
    return { ...tool, ring, inner, slot, drops, body, mark, pix, dot, z: tween(0), k: 0, to: 0, at: 0, drawnZ: NaN, drawnK: NaN };
  });

  function draw(cube, z, k) {
    if (z !== cube.drawnZ) {
      cube.drawnZ = z;
      const [cx, cy] = cube.c, top = z + KH;
      put(cube.body, prism(P, front, cube.ring, cube.inner, z, top));
      cube.drops.setAttribute("d", z > 0.5 ? extremes(P, cube.ring).map((q) => seg(P(q.u, q.v, 0), P(q.u, q.v, z))).join("") : "");
      cube.slot.style.opacity = z > 0.5 ? 1 : 0;
      const o = P(cx, cy, top), ex = P(cx + R, cy - R, top), ey = P(cx + R, cy + R, top);
      cube.mark.setAttribute("transform", `matrix(${ex[0] - o[0]} ${ex[1] - o[1]} ${ey[0] - o[0]} ${ey[1] - o[1]} ${o[0]} ${o[1]})`);
      const lg = logo(P, 0.062, cx, cy, top);
      cube.pix.setAttribute("d", lg.pix);
      cube.dot.setAttribute("d", lg.dot);
    }
    if (k !== cube.drawnK) {
      cube.drawnK = k;
      const out = 1 - ease(k / 0.5), back = ease((k - 0.5) / 0.5);
      cube.mark.style.opacity = out;
      cube.pix.style.opacity = back;
      cube.dot.style.opacity = back;
    }
  }

  const B = register(stage, (dt, now) => {
    let moving = false;
    cubes.forEach((cube) => {
      const z = tval(cube.z, now);
      if (cube.k !== cube.to) {
        moving = true;
        if (reducedMotion()) cube.k = cube.to;
        else if (now >= cube.at) cube.k = cube.to > cube.k ? Math.min(cube.to, cube.k + dt / SWAP) : Math.max(cube.to, cube.k - dt / SWAP);
      }
      if (z !== cube.drawnZ) moving = true;
      draw(cube, z, cube.k);
    });
    return moving;
  });
  bag.add(B.unregister);

  function hit([x, y]) {
    let best = -1, bd = K * 1.15;
    cubes.forEach((cube, i) => {
      for (const z of [0, KH / 2, KH]) {
        const w = unproj(C, x, y, z), d = Math.hypot(w[0] - cube.c[0], w[1] - cube.c[1]);
        if (d < bd) { bd = d; best = i; }
      }
    });
    return best;
  }

  function setActive(a) {
    if (a === act) return;
    const from = act;
    act = a;
    const now = performance.now();
    cubes.forEach((cube, i) => {
      const far = from >= 0 ? Math.abs(i - from) : i;
      tset(cube.z, i === a ? lift : 0, now, 0);
      if (i === a && cube.to !== 1) { cube.to = 1; cube.at = now + 120; }
      else if (a < 0 && cube.to !== 0) { cube.to = 0; cube.at = now + 260 + far * 90; }
      cube.body.sil.classList.toggle("hi", i === a);
    });
    read.textContent = a < 0 ? "rest" : cubes[a].name;
    B.wake();
  }
  setActive(-1);

  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { lift = v; if (act >= 0) { tset(cubes[act].z, lift, performance.now(), 0); B.wake(); } },
    destroy: bag.dispose,
  };
}

const C1 = Cam(45, 0.5, 1.9);
fit(C1, [[-PL, -PL, -PB], [PL, PL, -PB], [PL, -PL, -PB], [-PL, PL, -PB], [-C0 - K, -C0 - K, KH + 34]], 200, 145);
const stop = ([x, y]) => proj(C1)(x, y, KH).map(Math.round);

hairline({
  name: "replace",
  means: "A tray of four legacy tools: Airflow, Ansible Tower, VMware vRA/vRO and Control-M. Each one lifts out and comes back as Kestra.",
  rules: [1, 2, 5, 7],
  range: [18, 26, 34],
  tour: [...TOOLS.map((tool) => stop(tool.c)), null],
  mount,
});
}
