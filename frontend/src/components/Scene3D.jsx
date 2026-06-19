// Scene3D uses React.createElement (no JSX) to bypass the Emergent visual-edits babel plugin
// which injects x-line-number attributes that conflict with R3F's reconciler.
import React, { useRef, useMemo, createElement as h } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Candlesticks({ count = 14 }) {
  const group = useRef();
  const data = useMemo(() => (
    new Array(count).fill(0).map(() => ({
      x: (Math.random() - 0.5) * 9,
      y: (Math.random() - 0.5) * 4,
      z: (Math.random() - 0.5) * 4 - 1.5,
      h: 0.3 + Math.random() * 1.3,
      up: Math.random() > 0.45,
      speed: 0.2 + Math.random() * 0.4,
      phase: Math.random() * Math.PI * 2,
    }))
  ), [count]);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();
    group.current.rotation.y = t * 0.04;
    group.current.children.forEach((c, i) => {
      c.position.y = data[i].y + Math.sin(t * data[i].speed + data[i].phase) * 0.18;
    });
  });

  return h("group", { ref: group },
    data.map((c, i) =>
      h("mesh", { key: i, position: [c.x, c.y, c.z] },
        h("boxGeometry", { args: [0.08, c.h, 0.08] }),
        h("meshBasicMaterial", { color: c.up ? "#22d3a3" : "#ef4444", transparent: true, opacity: 0.9 })
      )
    )
  );
}

function AssetSphere({ position, color, size = 0.5, speed = 1 }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime() * speed;
    ref.current.position.x = position[0] + Math.cos(t) * 0.4;
    ref.current.position.y = position[1] + Math.sin(t * 1.2) * 0.3;
    ref.current.rotation.y += 0.008;
    ref.current.rotation.x += 0.004;
  });
  return h("mesh", { ref, position },
    h("icosahedronGeometry", { args: [size, 1] }),
    h("meshStandardMaterial", { color, emissive: color, emissiveIntensity: 0.4, metalness: 0.8, roughness: 0.3 })
  );
}

function ParticleRing({ count = 90, radius = 5 }) {
  const ref = useRef();
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      const r = radius + (Math.random() - 0.5) * 0.8;
      arr[i * 3] = Math.cos(a) * r;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 0.6;
      arr[i * 3 + 2] = Math.sin(a) * r;
    }
    return arr;
  }, [count, radius]);

  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * 0.06;
  });

  return h("points", { ref },
    h("bufferGeometry", null,
      h("bufferAttribute", { attach: "attributes-position", count, array: positions, itemSize: 3 })
    ),
    h("pointsMaterial", { size: 0.06, color: "#ffb088", transparent: true, opacity: 0.9, sizeAttenuation: true })
  );
}

function StarField({ count = 250 }) {
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 30;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 18;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 18 - 5;
    }
    return arr;
  }, [count]);
  return h("points", null,
    h("bufferGeometry", null,
      h("bufferAttribute", { attach: "attributes-position", count, array: positions, itemSize: 3 })
    ),
    h("pointsMaterial", { size: 0.035, color: "#ffffff", transparent: true, opacity: 0.55, sizeAttenuation: true })
  );
}

function ChartPanel({ position, rotation, color = "#22d3a3" }) {
  const lineObj = useMemo(() => {
    const points = [];
    for (let i = 0; i <= 40; i++) {
      const x = (i / 40 - 0.5) * 3;
      const y = Math.sin(i * 0.4) * 0.35 + (i / 40) * 0.7 - 0.35;
      points.push(new THREE.Vector3(x, y, 0));
    }
    const geom = new THREE.BufferGeometry().setFromPoints(points);
    const mat = new THREE.LineBasicMaterial({ color });
    return new THREE.Line(geom, mat);
  }, [color]);

  const groupRef = useRef();
  useFrame(({ clock }) => {
    if (groupRef.current) groupRef.current.rotation.y = rotation[1] + Math.sin(clock.getElapsedTime() * 0.3) * 0.08;
  });

  return h("group", { ref: groupRef, position, rotation },
    h("mesh", null,
      h("planeGeometry", { args: [3.2, 1.6] }),
      h("meshBasicMaterial", { color: "#0a1f1a", transparent: true, opacity: 0.2 })
    ),
    h("primitive", { object: lineObj })
  );
}

function SceneContent() {
  return [
    h("ambientLight", { key: "amb", intensity: 0.35 }),
    h("pointLight", { key: "p1", position: [5, 5, 5], intensity: 1, color: "#ffb088" }),
    h("pointLight", { key: "p2", position: [-5, -3, 3], intensity: 0.7, color: "#22d3a3" }),
    h(StarField, { key: "stars", count: 250 }),
    h(AssetSphere, { key: "s1", position: [-3, 1.2, 0], color: "#c25934", size: 0.7, speed: 0.4 }),
    h(AssetSphere, { key: "s2", position: [3.2, -0.8, -1], color: "#22d3a3", size: 0.55, speed: 0.6 }),
    h(AssetSphere, { key: "s3", position: [1.2, 2, -2], color: "#d4a373", size: 0.4, speed: 0.5 }),
    h(AssetSphere, { key: "s4", position: [-2.2, -1.5, 1], color: "#ffb088", size: 0.45, speed: 0.7 }),
    h(ChartPanel, { key: "c1", position: [-2.5, 0, -1.5], rotation: [0, 0.4, 0], color: "#22d3a3" }),
    h(ChartPanel, { key: "c2", position: [2.8, 0.5, -2], rotation: [0, -0.5, 0], color: "#c25934" }),
    h(Candlesticks, { key: "candles", count: 14 }),
    h(ParticleRing, { key: "ring", count: 90, radius: 5 }),
  ];
}

export default function Scene3D() {
  return h(Canvas, {
    camera: { position: [0, 0, 8], fov: 50 },
    dpr: [1, 1.3],
    gl: { antialias: true, alpha: true, powerPreference: "high-performance" },
    style: { width: "100%", height: "100%" },
  }, h(SceneContent));
}
