"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type * as THREE from "three";

type SceneProps = {
  reducedMotion: boolean;
  paused: boolean;
  scrollProgress: number;
  hoveredNode: string | null;
  onNodeHover: (key: string | null) => void;
  onNodeSelect: (key: string) => void;
};

type NodeDef = {
  key: string;
  label: string;
  position: [number, number, number];
  color: string;
  accent: string;
  geometry: "box" | "cylinder" | "torus" | "sphere" | "octahedron";
  sectionId: string;
  summary: string;
};

const nodes: NodeDef[] = [
  { key: "web", label: "Product Interfaces", position: [-1.7, 1.2, 0.25], color: "#8ec5ff", accent: "#d9ebff", geometry: "box", sectionId: "work", summary: "Client-facing applications and operational workflows" },
  { key: "api", label: "Service Layer", position: [-0.8, 0.85, -0.05], color: "#7fe9d4", accent: "#dffbf6", geometry: "octahedron", sectionId: "about", summary: "Backend services, integrations, and application logic" },
  { key: "db", label: "Data Platform", position: [-0.2, 0.15, 0.2], color: "#b8f38a", accent: "#eafbcf", geometry: "torus", sectionId: "about", summary: "Persistent data structures and system state" },
  { key: "ai", label: "Intelligence & Automation", position: [0.65, -0.22, 0.18], color: "#ffe48c", accent: "#fff7d8", geometry: "sphere", sectionId: "work", summary: "Workflow automation and AI-enabled decision support" },
  { key: "iot", label: "Connected Systems", position: [1.1, -1.0, -0.15], color: "#ffb38f", accent: "#ffe8dc", geometry: "cylinder", sectionId: "work", summary: "Monitoring, telemetry, and device-connected operations" },
  { key: "research", label: "Research Infrastructure", position: [1.8, -1.45, 0.05], color: "#ff9fb3", accent: "#fde4ea", geometry: "box", sectionId: "about", summary: "Research workflows, evidence, and information systems" },
];

const links: Array<[number, number]> = [
  [0, 1],
  [1, 2],
  [1, 3],
  [2, 3],
  [3, 4],
  [3, 5],
  [2, 4],
];

const flowLinks = [0, 2, 4];

function NodeVisual({
  node,
  isActive,
  isConnected,
  reducedMotion,
  paused,
  onNodeHover,
  onNodeSelect,
}: {
  node: NodeDef;
  isActive: boolean;
  isConnected: boolean;
  reducedMotion: boolean;
  paused: boolean;
  onNodeHover: (key: string | null) => void;
  onNodeSelect: (key: string) => void;
}) {
  const groupRef = useRef<THREE.Group | null>(null);
  const shellRef = useRef<THREE.Mesh | null>(null);
  const coreRef = useRef<THREE.Mesh | null>(null);

  useFrame((state) => {
    const group = groupRef.current;
    const shell = shellRef.current;
    const core = coreRef.current;
    if (!group || !shell || !core) return;

    const time = state.clock.elapsedTime;
    if (!paused && !reducedMotion) {
      group.position.set(
        node.position[0] + Math.sin(time * 0.9 + node.position[0]) * 0.028,
        node.position[1] + Math.cos(time * 0.7 + node.position[1] * 2) * 0.02,
        node.position[2] + Math.sin(time * 0.6 + node.position[2]) * 0.018,
      );
      group.rotation.y = Math.sin(time * 0.5 + node.position[0]) * 0.06;
      group.rotation.z = Math.cos(time * 0.4 + node.position[1]) * 0.04;
    } else {
      group.position.set(node.position[0], node.position[1], node.position[2]);
      group.rotation.set(0, 0, 0);
    }

    const scale = isActive ? 1.18 : isConnected ? 1.05 : 0.92;
    const shellMaterial = (Array.isArray(shell.material) ? shell.material[0] : shell.material) as THREE.MeshStandardMaterial;
    const coreMaterial = (Array.isArray(core.material) ? core.material[0] : core.material) as THREE.MeshStandardMaterial;

    shell.scale.setScalar(scale * 1.16);
    core.scale.setScalar(scale);
    shellMaterial.opacity = isActive ? 0.85 : isConnected ? 0.62 : 0.34;
    coreMaterial.emissiveIntensity = isActive ? 0.34 : isConnected ? 0.2 : 0.12;
  });

  const renderGeometry = () => {
    switch (node.geometry) {
      case "box":
        return <boxGeometry args={[0.24, 0.24, 0.24]} />;
      case "cylinder":
        return <cylinderGeometry args={[0.16, 0.16, 0.25, 12]} />;
      case "torus":
        return <torusGeometry args={[0.16, 0.06, 10, 18]} />;
      case "octahedron":
        return <octahedronGeometry args={[0.17, 0]} />;
      default:
        return <sphereGeometry args={[0.16, 16, 16]} />;
    }
  };

  return (
    <group ref={groupRef}>
      <mesh
        ref={shellRef}
        onPointerOver={(event) => {
          event.stopPropagation();
          onNodeHover(node.key);
        }}
        onPointerOut={() => onNodeHover(null)}
        onClick={() => onNodeSelect(node.key)}
      >
        {renderGeometry()}
        <meshStandardMaterial color={node.accent} transparent opacity={0.48} roughness={0.25} metalness={0.08} />
      </mesh>
      <mesh ref={coreRef}>
        {renderGeometry()}
        <meshStandardMaterial color={node.color} roughness={0.28} metalness={0.08} emissive={node.color} emissiveIntensity={0.14} />
      </mesh>
      {node.key === "ai" ? (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.14, 0.19, 24]} />
          <meshBasicMaterial color={node.color} transparent opacity={0.24} depthWrite={false} />
        </mesh>
      ) : null}
      {node.key === "api" ? (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.16, 8]} />
          <meshBasicMaterial color={node.accent} transparent opacity={0.32} depthWrite={false} />
        </mesh>
      ) : null}
      {node.key === "db" ? (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.2, 8]} />
          <meshBasicMaterial color={node.color} transparent opacity={0.2} depthWrite={false} />
        </mesh>
      ) : null}
      {node.key === "iot" ? (
        <mesh position={[0.11, 0.08, 0.02]}>
          <boxGeometry args={[0.08, 0.08, 0.06]} />
          <meshBasicMaterial color={node.accent} transparent opacity={0.32} depthWrite={false} />
        </mesh>
      ) : null}
      {node.key === "research" ? (
        <mesh rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.18, 0.06, 0.06]} />
          <meshBasicMaterial color={node.color} transparent opacity={0.24} depthWrite={false} />
        </mesh>
      ) : null}
      <mesh scale={1.3}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color={node.color} transparent opacity={0.25} depthWrite={false} />
      </mesh>
    </group>
  );
}

function EcosystemContent({ reducedMotion, paused, scrollProgress, hoveredNode, onNodeHover, onNodeSelect }: SceneProps) {
  const rootRef = useRef<THREE.Group | null>(null);
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

  useFrame((state) => {
    const root = rootRef.current;
    if (!root) return;

    const pointerX = state.pointer.x;
    const pointerY = state.pointer.y;
    const time = state.clock.elapsedTime;

    if (!paused && !reducedMotion) {
      const targetX = pointerY * 0.16 + scrollProgress * 0.08;
      const targetY = pointerX * 0.12;
      const targetZ = scrollProgress * 0.04 + Math.sin(time * 0.7) * 0.04;

      root.rotation.x += (targetX - root.rotation.x) * 0.08;
      root.rotation.y += (targetY - root.rotation.y) * 0.08;
      root.rotation.z = targetZ;
      root.position.x = Math.sin(time * 0.52) * 0.05;
      root.position.y = Math.sin(time * 0.86) * 0.06;
      root.position.z = Math.cos(time * 0.62) * 0.04;
      root.scale.setScalar(1 + Math.sin(time * 1.1) * 0.015);
    } else {
      root.rotation.set(0.02, 0, 0);
      root.position.set(0, 0, 0);
      root.scale.setScalar(1);
    }

    flowLinks.forEach((linkIndex, beadIndex) => {
      const bead = beadRefs.current[beadIndex];
      if (!bead) return;
      const [start, end] = links[linkIndex];
      const startPos = nodes[start].position;
      const endPos = nodes[end].position;
      const progress = (time * 0.18 + beadIndex * 0.16 + scrollProgress * 0.08) % 1;
      bead.position.set(
        startPos[0] + (endPos[0] - startPos[0]) * progress,
        startPos[1] + (endPos[1] - startPos[1]) * progress,
        startPos[2] + (endPos[2] - startPos[2]) * progress,
      );
      bead.scale.setScalar(1 + 0.5 * Math.sin(time * 6 + beadIndex));
    });
  });

  const hoveredIndex = hoveredNode ? nodes.findIndex((node) => node.key === hoveredNode) : -1;

  return (
    <group ref={rootRef}>
      <mesh position={[0.15, -2.05, -0.9]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[6.4, 4.2, 1, 1]} />
        <meshStandardMaterial color="#8c95a3" transparent opacity={0.08} roughness={0.9} />
      </mesh>

      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#95a3b0" transparent opacity={0.44} depthWrite={false} />
      </lineSegments>

      {links.map(([start, end], index) => {
        const isHighlight = hoveredIndex >= 0 && (start === hoveredIndex || end === hoveredIndex);
        return (
          <line key={`link-${index}`}>
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" args={[new Float32Array([nodes[start].position[0], nodes[start].position[1], nodes[start].position[2], nodes[end].position[0], nodes[end].position[1], nodes[end].position[2]]), 3]} />
            </bufferGeometry>
            <lineBasicMaterial color={isHighlight ? "#1f2937" : "#7c8795"} transparent opacity={isHighlight ? 0.7 : 0.32} depthWrite={false} />
          </line>
        );
      })}

      {nodes.map((node) => {
        const nodeIndex = nodes.findIndex((candidate) => candidate.key === node.key);
        const isActive = hoveredNode === node.key;
        const isConnected = hoveredIndex >= 0 && links.some(([start, end]) => (start === hoveredIndex && (end === nodeIndex)) || (end === hoveredIndex && (start === nodeIndex)));
        return (
          <NodeVisual
            key={node.key}
            node={node}
            isActive={isActive}
            isConnected={isConnected}
            reducedMotion={reducedMotion}
            paused={paused}
            onNodeHover={onNodeHover}
            onNodeSelect={onNodeSelect}
          />
        );
      })}

      {flowLinks.map((linkIndex, beadIndex) => {
        const [start] = links[linkIndex];
        return (
          <mesh
            key={`bead-${beadIndex}`}
            ref={(element: THREE.Mesh | null) => {
              beadRefs.current[beadIndex] = element;
            }}
            position={nodes[start].position}
          >
            <sphereGeometry args={[0.035, 10, 10]} />
            <meshStandardMaterial color="#f4f4f0" emissive="#f4f4f0" emissiveIntensity={0.32} roughness={0.2} metalness={0.04} />
          </mesh>
        );
      })}
    </group>
  );
}

export function EngineeringEcosystemScene({ reducedMotion, paused, scrollProgress, hoveredNode, onNodeHover, onNodeSelect }: SceneProps) {
  return (
    <Canvas
      className="ecosystem-canvas"
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 5.2], fov: 38 }}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
    >
      <ambientLight intensity={0.58} />
      <directionalLight position={[3, 4, 2]} intensity={0.9} />
      <directionalLight position={[-3, -2, 1]} intensity={0.24} />
      <pointLight position={[-2, -1, 1]} intensity={0.24} />
      <EcosystemContent reducedMotion={reducedMotion} paused={paused} scrollProgress={scrollProgress} hoveredNode={hoveredNode} onNodeHover={onNodeHover} onNodeSelect={onNodeSelect} />
    </Canvas>
  );
}
