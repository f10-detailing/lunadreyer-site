(function () {
  "use strict";

  var container = document.getElementById("hero-scene");
  if (!container || typeof window.THREE === "undefined") return;

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Bail out quietly if WebGL isn't available; the hero copy works fine without it.
  function hasWebGL() {
    try {
      var c = document.createElement("canvas");
      return !!(window.WebGLRenderingContext && (c.getContext("webgl") || c.getContext("experimental-webgl")));
    } catch (e) {
      return false;
    }
  }
  if (!hasWebGL()) return;

  try {
    var THREE = window.THREE;

    var NAVY = 0x0e2140;
    var BRASS = 0x9a7b3c;
    var PAPER = 0xfbfaf6;
    var PAPER_EDGE = 0xd8d5ca;

    var scene = new THREE.Scene();

    var camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0.6, 6.2);
    camera.lookAt(0, 0, 0);

    var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.appendChild(renderer.domElement);

    // Lighting: soft ambient + one key light so the seal reads as embossed metal.
    // Intensities are tuned high because r155+ Three.js uses physically-correct
    // light units, where pre-r155-style values render almost black.
    scene.add(new THREE.AmbientLight(0xffffff, 1.6));
    scene.add(new THREE.HemisphereLight(0xffffff, NAVY, 2.2));
    var key = new THREE.DirectionalLight(0xffffff, 3.2);
    key.position.set(2.5, 3, 4);
    scene.add(key);
    var fill = new THREE.DirectionalLight(BRASS, 1.4);
    fill.position.set(-3, -1, 2);
    scene.add(fill);

    var group = new THREE.Group();
    scene.add(group);

    // The document: a flat card with a couple of embossed "text lines".
    var doc = new THREE.Mesh(
      new THREE.BoxGeometry(3.1, 0.06, 2.1),
      new THREE.MeshStandardMaterial({ color: PAPER, roughness: 0.85, metalness: 0.02 })
    );
    group.add(doc);

    var edge = new THREE.Mesh(
      new THREE.BoxGeometry(3.16, 0.03, 2.16),
      new THREE.MeshStandardMaterial({ color: PAPER_EDGE, roughness: 0.9, metalness: 0 })
    );
    edge.position.y = -0.02;
    group.add(edge);

    var lineMat = new THREE.MeshStandardMaterial({ color: NAVY, roughness: 0.6, transparent: true, opacity: 0.16 });
    [-0.55, -0.3, -0.05].forEach(function (z) {
      var line = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.02, 0.07), lineMat);
      line.position.set(-0.35, 0.035, z);
      group.add(line);
    });

    // The seal: two stacked brass cylinders for a subtle embossed look.
    var sealMat = new THREE.MeshStandardMaterial({ color: BRASS, roughness: 0.35, metalness: 0.65 });
    var sealBase = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.62, 0.08, 40), sealMat);
    sealBase.position.set(0.85, 0.07, 0.45);
    group.add(sealBase);
    var sealCap = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.5, 0.05, 40), sealMat);
    sealCap.position.set(0.85, 0.115, 0.45);
    group.add(sealCap);
    var sealRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.34, 0.035, 12, 40),
      new THREE.MeshStandardMaterial({ color: 0x7c6230, roughness: 0.4, metalness: 0.6 })
    );
    sealRing.rotation.x = Math.PI / 2;
    sealRing.position.set(0.85, 0.14, 0.45);
    group.add(sealRing);

    group.rotation.set(-0.5, 0.5, 0.12);

    // A slow wireframe globe orbiting behind the document, hinting at "international".
    var globe = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.9, 1),
      new THREE.MeshBasicMaterial({ color: BRASS, wireframe: true, transparent: true, opacity: 0.22 })
    );
    globe.position.set(-0.2, 0, -0.6);
    scene.add(globe);

    function resize() {
      var w = container.clientWidth || 1;
      var h = container.clientHeight || w;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    }
    resize();
    if (window.ResizeObserver) {
      new ResizeObserver(resize).observe(container);
    } else {
      window.addEventListener("resize", resize);
    }

    var mouseX = 0, mouseY = 0;
    window.addEventListener("pointermove", function (e) {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = (e.clientY / window.innerHeight) * 2 - 1;
    }, { passive: true });

    if (reduceMotion) {
      renderer.render(scene, camera);
      return;
    }

    var clock = new THREE.Clock();
    function animate() {
      requestAnimationFrame(animate);
      var t = clock.getElapsedTime();
      group.rotation.y = 0.5 + t * 0.18 + mouseX * 0.25;
      group.rotation.x = -0.5 + mouseY * 0.12;
      globe.rotation.y = t * 0.06;
      globe.rotation.x = t * 0.03;
      camera.position.x = mouseX * 0.3;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    }
    animate();
  } catch (e) {
    // Decorative only — never let a WebGL failure affect the page.
    if (container) container.innerHTML = "";
  }
})();
