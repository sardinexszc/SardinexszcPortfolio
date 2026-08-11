"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type * as THREE from "three";

type SceneProps = {
  reducedMotion: boolean;
  paused: boolean;
  scrollProgress: number;
};

type NodeDef = {
  key: string;
  label: string;
  position: [number, number, number];
  color: string;
};

const nodes: NodeDef[] = [
  { key: "web", label: "Web Applications", position: [-1.5, 1.2, 0], color: "#8ec5ff" },
  { key: "api", label: "APIs", position: [-0.85, 0.65, 0.15], color: "#7fe9d4" },
  { key: "db", label: "Databases", position: [-0.25, 0.1, -0.1], color: "#b8f38a" },
  { key: "ai", label: "AI / Automation", position: [0.4, -0.45, 0.1], color: "#ffe48c" },
  { key: "iot", label: "IoT", position: [1.05, -0.98, -0.15], color: "#ffb38f" },
  { key: "research", label: "Research Systems", position: [1.75, -1.45, 0], color: "#ff9fb3" },
];

const links: Array<[number, number]> = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5],
];

function EcosystemContent({ reducedMotion, paused, scrollProgress }: SceneProps) {
  const rootRef = useRef<THREE.Group | null>(null);
  const particleRef = useRef<THREE.Points | null>(null);
  const beadRefs = useRef<Array<THREE.Mesh | null>>([]);

  const linePositions = useMemo(() => {
    const values = new Float32Array(links.length * 2 * 3);
    links.forEach(([start, end], index) => {
      const startPos = nodes[start].position;
      const endPos = nodes[end].position;
      const offset = index * 6;
      values[offset] = startPos[0];
      values[offset + 1] = startPos[1];
      values[offset + 2] = startPos[2];
      values[offset + 3] = endPos[0];
      values[offset + 4] = endPos[1];
      values[offset + 5] = endPos[2];
    });
    return values;
  }, []);

  const particlePositions = useMemo(() => {
    const count = 56;
    const values = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const base = i * 3;
      const xWave = Math.sin(i * 1.7);
      const yWave = Math.cos(i * 1.13);
      const zWave = Math.sin(i * 0.79 + 0.6);
      values[base] = xWave * 2.1;
      values[base + 1] = yWave * 1.45;
      values[base + 2] = zWave * 0.95;
    }
    return values;
  }, []);

  useFrame((state, delta) => {
    const root = rootRef.current;
    if (!root) return;

    const pointerX = state.pointer.x;
    const pointerY = state.pointer.y;

    if (!paused && !reducedMotion) {
      const targetX = pointerY * 0.13 + scrollProgress * 0.07;
      const targetY = pointerX * 0.18;
      const targetZ = scrollProgress * 0.04;

      root.rotation.x += (targetX - root.rotation.x) * 0.06;
      root.rotation.y += (targetY - root.rotation.y) * 0.06;
      root.rotation.z += (targetZ - root.rotation.z) * 0.04;
      root.position.y = Math.sin(state.clock.elapsedTime * 0.45) * 0.035;

      if (particleRef.current) {
        particleRef.current.rotation.y += delta * 0.045;
      }

      links.forEach(([start, end], index) => {
        const bead = beadRefs.current[index];
        if (!bead) return;
        const startPos = nodes[start].position;
        const endPos = nodes[end].position;
        const t = (state.clock.elapsedTime * 0.35 + index * 0.18 + scrollProgress * 0.25) % 1;

        bead.position.set(
          startPos[0] + (endPos[0] - startPos[0]) * t,
          startPos[1] + (endPos[1] - startPos[1]) * t,
          startPos[2] + (endPos[2] - startPos[2]) * t,
        );
      });
    }
  });

  return (
    <group ref={rootRef}>
      <mesh position={[0.2, -2.15, -0.7]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[6, 4, 1, 1]} />
        <meshBasicMaterial color="#9ba7b5" transparent opacity={0.08} />
      </mesh>

      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#9aa7b3" transparent opacity={0.5} />
      </lineSegments>

      {nodes.map((node) => (
        <group key={node.key} position={node.position}>
          <mesh>
            <sphereGeometry args={[0.17, 14, 14]} />
            <meshStandardMaterial color={node.color} roughness={0.32} metalness={0.08} emissive={node.color} emissiveIntensity={0.18} />
          </mesh>
          <mesh scale={1.75}>
            <sphereGeometry args={[0.12, 10, 10]} />
            <meshBasicMaterial color={node.color} transparent opacity={0.12} />
          </mesh>
        </group>
      ))}

      {links.map(([start], index) => (
        <mesh
          key={`bead-${nodes[start].key}`}
          ref={(element: THREE.Mesh | null) => {
            beadRefs.current[index] = element;
          }}
          position={nodes[start].position}
        >
          <sphereGeometry args={[0.05, 10, 10]} />
          <meshStandardMaterial color="#f4f4f0" emissive="#f4f4f0" emissiveIntensity={0.34} roughness={0.2} metalness={0.05} />
        </mesh>
      ))}

      <points ref={particleRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[particlePositions, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.02} sizeAttenuation color="#b0bac3" transparent opacity={0.4} depthWrite={false} />
      </points>
    </group>
  );
}

export function EngineeringEcosystemScene({ reducedMotion, paused, scrollProgress }: SceneProps) {
  return (
    <Canvas
      className="ecosystem-canvas"
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 4.8], fov: 42 }}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[3, 4, 2]} intensity={0.82} />
      <pointLight position={[-2, -1, 1]} intensity={0.32} />
      <EcosystemContent reducedMotion={reducedMotion} paused={paused} scrollProgress={scrollProgress} />
    </Canvas>
  );
}
