"use client";

import { Suspense, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  PerspectiveCamera,
  Grid,
  Center,
  useProgress,
  Html,
} from "@react-three/drei";
import * as THREE from "three";
import { RotateCcw, Play, Pause, Box, Eye } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────
// Loading overlay shown inside the Canvas
// ─────────────────────────────────────────────
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3 text-white">
        <div className="w-12 h-12 border-2 border-white/20 border-t-primary rounded-full animate-spin" />
        <p className="text-sm font-bold">{progress.toFixed(0)}%</p>
      </div>
    </Html>
  );
}

// ─────────────────────────────────────────────
// Procedural 3D shape representing different product types
// ─────────────────────────────────────────────
function ProductMesh({ type = "figurine", autoRotate, wireframe }: { type?: string; autoRotate: boolean; wireframe: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    if (autoRotate) {
      meshRef.current.rotation.y += delta * 0.5;
    }
    // Gentle floating
    meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.05;
    // Scale on hover
    meshRef.current.scale.setScalar(
      THREE.MathUtils.lerp(meshRef.current.scale.x, hovered ? 1.05 : 1, 0.1)
    );
  });

  const getGeometry = () => {
    switch (type) {
      case "keychain":
        return <torusGeometry args={[0.6, 0.18, 16, 64]} />;
      case "statue":
      case "figurine":
        return <capsuleGeometry args={[0.4, 1.2, 8, 32]} />;
      case "mechanical":
        return <cylinderGeometry args={[0.5, 0.5, 1.2, 32]} />;
      case "fidget":
        return <dodecahedronGeometry args={[0.7]} />;
      case "organizer":
        return <boxGeometry args={[1.2, 0.8, 0.8]} />;
      default:
        return <sphereGeometry args={[0.7, 64, 64]} />;
    }
  };

  return (
    <mesh
      ref={meshRef}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      castShadow
    >
      {getGeometry()}
      <meshPhysicalMaterial
        color={hovered ? "#fa8c45" : "#fa6831"}
        roughness={0.15}
        metalness={0.4}
        reflectivity={1}
        clearcoat={1}
        clearcoatRoughness={0.1}
        wireframe={wireframe}
      />
    </mesh>
  );
}

// ─────────────────────────────────────────────
// Ambient particle field for depth
// ─────────────────────────────────────────────
function ParticleField() {
  const points = useRef<THREE.Points>(null);

  useFrame((_, delta) => {
    if (points.current) points.current.rotation.y += delta * 0.02;
  });

  const [positions] = useState(() => {
    const values = new Float32Array(300 * 3);
    for (let index = 0; index < values.length; index += 1) {
      values[index] = (Math.random() - 0.5) * 10;
    }
    return values;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.015} color="#fa6831" sizeAttenuation transparent opacity={0.4} />
    </points>
  );
}

// ─────────────────────────────────────────────
// Main exported viewer
// ─────────────────────────────────────────────
interface ModelViewer3DProps {
  title?: string;
  type?: string;
  height?: string;
}

export function ModelViewer3D({ title = "3D Preview", type = "figurine", height = "h-[480px]" }: ModelViewer3DProps) {
  const [autoRotate, setAutoRotate] = useState(true);
  const [wireframe, setWireframe] = useState(false);
  const controlsRef = useRef<THREE.EventDispatcher>(null);

  const resetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  return (
    <div className={`relative ${height} w-full rounded-3xl overflow-hidden bg-gradient-to-b from-[#0c0c0c] to-[#050505] border border-white/10 shadow-2xl group`}>
      {/* Top controls overlay */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
        <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full">
          <Box className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-bold text-white">{title}</span>
        </div>
        <span className="bg-primary/20 border border-primary/30 text-primary text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-wider">
          Interactive 3D
        </span>
      </div>

      {/* Control buttons */}
      <div className="absolute bottom-4 right-4 z-10 flex gap-2">
        <Button
          size="icon"
          variant="ghost"
          className="h-9 w-9 bg-black/60 backdrop-blur-md border border-white/10 hover:bg-white/10 text-white rounded-xl"
          onClick={resetCamera}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className={cn("h-9 w-9 bg-black/60 backdrop-blur-md border border-white/10 hover:bg-white/10 text-white rounded-xl transition-all", wireframe && "bg-primary border-primary")}
          onClick={() => setWireframe(!wireframe)}
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-9 w-9 bg-black/60 backdrop-blur-md border border-white/10 hover:bg-white/10 text-white rounded-xl"
          onClick={() => setAutoRotate(!autoRotate)}
        >
          {autoRotate ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
      </div>

      {/* Hint */}
      <div className="absolute bottom-4 left-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <p className="text-[10px] text-white/40 font-medium">Drag to rotate · Scroll to zoom</p>
      </div>

      {/* Canvas */}
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0.5, 3.5]} fov={45} />

        <Suspense fallback={<Loader />}>
          {/* Lighting */}
          <ambientLight intensity={0.3} />
          <directionalLight
            position={[5, 10, 5]}
            intensity={2}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          <pointLight position={[-3, 3, -3]} intensity={1} color="#fa6831" />
          <pointLight position={[3, -2, 3]} intensity={0.5} color="#60a5fa" />
          <spotLight position={[0, 8, 0]} intensity={1.5} angle={0.5} penumbra={0.5} castShadow />

          {/* Model */}
          <Center>
            <ProductMesh type={type} autoRotate={autoRotate} wireframe={wireframe} />
          </Center>

          {/* Floor grid */}
          <Grid
            args={[10, 10]}
            position={[0, -1.1, 0]}
            cellSize={0.5}
            cellThickness={0.3}
            cellColor="#fa6831"
            sectionSize={2}
            sectionThickness={0.8}
            sectionColor="#fa6831"
            fadeDistance={8}
            fadeStrength={1}
            followCamera={false}
            infiniteGrid
          />

          {/* Particles */}
          <ParticleField />

          {/* Environment for reflections */}
          <Environment preset="city" />

          {/* Controls */}
          <OrbitControls
            ref={controlsRef}
            enablePan={false}
            minDistance={1.5}
            maxDistance={6}
            maxPolarAngle={Math.PI / 1.8}
            autoRotate={autoRotate}
            autoRotateSpeed={2}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
