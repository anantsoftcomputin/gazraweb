import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const reduceMotionQuery = '(prefers-reduced-motion: reduce)';

const AmbientThreeScene = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || typeof window === 'undefined') return undefined;

    const reduceMotion = window.matchMedia(reduceMotionQuery).matches;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 18);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setClearAlpha(0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const count = 74;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const palette = [
      new THREE.Color('#171311'),
      new THREE.Color('#9f2f28'),
      new THREE.Color('#2f6b45'),
      new THREE.Color('#d9a13a')
    ];

    for (let index = 0; index < count; index += 1) {
      const angle = index * 0.73;
      const radius = 4.5 + (index % 11) * 0.42;
      positions[index * 3] = Math.cos(angle) * radius;
      positions[index * 3 + 1] = Math.sin(angle * 0.83) * radius * 0.58;
      positions[index * 3 + 2] = -3 - (index % 9) * 0.42;

      const color = palette[index % palette.length];
      colors[index * 3] = color.r;
      colors[index * 3 + 1] = color.g;
      colors[index * 3 + 2] = color.b;
    }

    const pointsGeometry = new THREE.BufferGeometry();
    pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pointsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const points = new THREE.Points(
      pointsGeometry,
      new THREE.PointsMaterial({
        size: 0.13,
        vertexColors: true,
        transparent: true,
        opacity: 0.55,
        depthWrite: false
      })
    );
    group.add(points);

    const ringMaterial = new THREE.LineBasicMaterial({
      color: '#171311',
      transparent: true,
      opacity: 0.1
    });
    const accentMaterial = new THREE.LineBasicMaterial({
      color: '#9f2f28',
      transparent: true,
      opacity: 0.12
    });

    const rings = [4.2, 6.3, 8.6].map((radius, index) => {
      const curve = new THREE.EllipseCurve(0, 0, radius, radius * 0.52, 0, Math.PI * 2);
      const geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(140));
      const line = new THREE.Line(geometry, index === 1 ? accentMaterial : ringMaterial);
      line.rotation.z = index * 0.42;
      line.position.z = -4 - index * 0.85;
      group.add(line);
      return line;
    });

    const pointer = { x: 0, y: 0 };
    const handlePointerMove = (event) => {
      pointer.x = (event.clientX / window.innerWidth - 0.5) * 2;
      pointer.y = (event.clientY / window.innerHeight - 0.5) * 2;
    };

    const resize = () => {
      const width = mount.clientWidth || window.innerWidth;
      const height = mount.clientHeight || window.innerHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    resize();

    let frameId = 0;
    let tabHidden = document.hidden;
    const startedAt = performance.now();

    const renderFrame = () => {
      if (tabHidden) {
        frameId = window.requestAnimationFrame(renderFrame);
        return;
      }

      const elapsed = (performance.now() - startedAt) / 1000;
      group.rotation.y += ((pointer.x * 0.12) - group.rotation.y) * 0.025;
      group.rotation.x += ((-pointer.y * 0.08) - group.rotation.x) * 0.025;

      if (!reduceMotion) {
        points.rotation.z = elapsed * 0.025;
        rings.forEach((ring, index) => {
          ring.rotation.z += 0.0008 * (index + 1);
        });
      }

      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(renderFrame);
    };

    const handleVisibilityChange = () => {
      tabHidden = document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    renderFrame();

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      mount.removeChild(renderer.domElement);
      pointsGeometry.dispose();
      points.material.dispose();
      rings.forEach((ring) => ring.geometry.dispose());
      ringMaterial.dispose();
      accentMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-20 opacity-20 mix-blend-multiply"
      style={{
        maskImage: 'radial-gradient(circle at 82% 22%, black 0%, black 30%, transparent 56%), radial-gradient(circle at 12% 78%, black 0%, black 22%, transparent 48%)',
        WebkitMaskImage: 'radial-gradient(circle at 82% 22%, black 0%, black 30%, transparent 56%), radial-gradient(circle at 12% 78%, black 0%, black 22%, transparent 48%)'
      }}
    />
  );
};

export default AmbientThreeScene;
