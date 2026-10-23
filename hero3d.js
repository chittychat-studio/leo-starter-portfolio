/*
  hero3d.js: the faceted stone in the hero, drawn with three.js.
  Loaded lazily by main.js only when WebGL works and reduced motion is off.
  - Device pixel ratio is capped so phones do not overheat.
  - Rendering pauses when the hero is off screen or the tab is hidden.
  - Tilts toward the pointer and turns as you scroll.
  Original code for Leo's starter, MIT licence (see LICENSE).
*/
import {
  WebGLRenderer, Scene, PerspectiveCamera, IcosahedronGeometry, MeshStandardMaterial,
  Mesh, EdgesGeometry, LineSegments, LineBasicMaterial, AmbientLight, DirectionalLight,
  Group, BufferGeometry, Float32BufferAttribute, Points, PointsMaterial, Color, MathUtils
} from "./vendor/three/three.module.js";

/* Turn any CSS colour (including oklch) into an sRGB hex number. */
function cssColor(value) {
  const c = document.createElement("canvas");
  c.width = c.height = 1;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#000";
  ctx.fillStyle = value;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  return (r << 16) | (g << 8) | b;
}

function readPalette() {
  const s = getComputedStyle(document.documentElement);
  return {
    accent: cssColor(s.getPropertyValue("--accent").trim()),
    ink: cssColor(s.getPropertyValue("--ink").trim()),
    bg: cssColor(s.getPropertyValue("--bg").trim())
  };
}

export function startHero(stage, { onReady } = {}) {
  const renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  stage.appendChild(renderer.domElement);

  const scene = new Scene();
  const camera = new PerspectiveCamera(35, 1, 0.1, 50);
  camera.position.set(0, 0, 7.2);

  const group = new Group();
  scene.add(group);

  // The stone: a low-poly icosahedron, flat shaded so every facet catches light.
  const geo = new IcosahedronGeometry(1.55, 1);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    // Nudge vertices a little so it reads as a cut stone, not a perfect sphere.
    // The offset depends on the position, so shared corners move together and no cracks open.
    const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
    const k = 1 + Math.sin(x * 7.1 + y * 3.7 + z * 5.3) * 0.06;
    pos.setXYZ(i, x * k, y * k, z * k);
  }
  geo.computeVertexNormals();

  const stoneMat = new MeshStandardMaterial({ flatShading: true, roughness: 0.55, metalness: 0.08 });
  const stone = new Mesh(geo, stoneMat);
  group.add(stone);

  const edgeMat = new LineBasicMaterial({ transparent: true, opacity: 0.35 });
  const edges = new LineSegments(new EdgesGeometry(geo, 1), edgeMat);
  edges.scale.setScalar(1.002);
  group.add(edges);

  // A loose orbit of points around it.
  const count = 260;
  const pts = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = 2.3 + Math.random() * 0.9;
    pts[i * 3] = Math.cos(a) * r;
    pts[i * 3 + 1] = (Math.random() - 0.5) * 0.7;
    pts[i * 3 + 2] = Math.sin(a) * r;
  }
  const ringGeo = new BufferGeometry();
  ringGeo.setAttribute("position", new Float32BufferAttribute(pts, 3));
  const ringMat = new PointsMaterial({ size: 0.035, transparent: true, opacity: 0.7, sizeAttenuation: true });
  const ring = new Points(ringGeo, ringMat);
  ring.rotation.x = 0.42;
  group.add(ring);

  scene.add(new AmbientLight(0xffffff, 0.55));
  const key = new DirectionalLight(0xffffff, 2.1);
  key.position.set(3, 4, 5);
  scene.add(key);
  const rim = new DirectionalLight(0xffffff, 0.8);
  rim.position.set(-4, -2, -3);
  scene.add(rim);

  function applyTheme() {
    const p = readPalette();
    stoneMat.color = new Color(p.accent);
    edgeMat.color = new Color(p.ink);
    ringMat.color = new Color(p.ink);
    rim.color = new Color(p.accent);
  }
  applyTheme();
  new MutationObserver(applyTheme).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  function resize() {
    // offsetWidth ignores CSS transforms, so an intro scale does not shrink the buffer.
    const width = stage.offsetWidth, height = stage.offsetHeight;
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
  resize();
  new ResizeObserver(resize).observe(stage);

  // Pointer and scroll input, eased toward in the render loop.
  const target = { x: 0, y: 0 };
  const current = { x: 0, y: 0 };
  window.addEventListener("pointermove", (e) => {
    target.x = (e.clientX / window.innerWidth) * 2 - 1;
    target.y = (e.clientY / window.innerHeight) * 2 - 1;
  }, { passive: true });

  let visible = true;
  let running = false;
  let last = performance.now();
  let spin = 0;
  let intro = 0; // 0 to 1, the first second of life

  function frame(now) {
    if (!running) return;
    // rAF timestamps can be slightly older than performance.now(), so clamp to 0..50 ms.
    const dt = Math.max(0, Math.min((now - last) / 1000, 0.05));
    last = now;
    intro = Math.min(intro + dt * 0.9, 1);
    const easeIntro = 1 - Math.pow(1 - intro, 4);

    current.x += (target.x - current.x) * 0.05;
    current.y += (target.y - current.y) * 0.05;
    const scroll = Math.min(window.scrollY / window.innerHeight, 1.5);

    spin += dt * 0.18;
    group.rotation.y = spin + current.x * 0.45 + scroll * 1.2 + (1 - easeIntro) * -1.6;
    group.rotation.x = current.y * 0.3 + scroll * 0.35;
    ring.rotation.y = -spin * 0.6;
    const s = MathUtils.lerp(0.7, 1, easeIntro) * (1 - scroll * 0.12);
    group.scale.setScalar(s);
    group.position.y = scroll * 0.6;

    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  }

  function setRunning(on) {
    if (on === running) return;
    running = on;
    if (on) { last = performance.now(); requestAnimationFrame(frame); }
  }

  new IntersectionObserver((entries) => {
    visible = entries[0].isIntersecting;
    setRunning(visible && !document.hidden);
  }).observe(stage);
  document.addEventListener("visibilitychange", () => setRunning(visible && !document.hidden));

  renderer.domElement.addEventListener("webglcontextlost", (e) => {
    e.preventDefault();
    setRunning(false);
    stage.classList.remove("has-3d");
  });

  renderer.render(scene, camera);
  stage.classList.add("has-3d");
  setRunning(true);
  if (onReady) onReady();
}
