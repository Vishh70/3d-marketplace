"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import {
  Center,
  Environment,
  Html,
  OrbitControls,
  PerspectiveCamera,
  useProgress,
} from "@react-three/drei";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import * as THREE from "three";
import { Box, Pause, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";

function Loader() {
  const { progress } = useProgress();

  return (
    <Html center>
      <div className="flex flex-col items-center gap-3 text-white">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-white/20 border-t-primary" />
        <p className="text-sm font-bold">{progress.toFixed(0)}%</p>
      </div>
    </Html>
  );
}

function StlMesh({ url, autoRotate }: { url: string; autoRotate: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const geometry = useLoader(STLLoader, url);

  useEffect(() => {
    geometry.computeVertexNormals();
    geometry.center();
  }, [geometry]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    if (autoRotate) {
      meshRef.current.rotation.y += delta * 0.45;
    }

    meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.05;
    meshRef.current.scale.setScalar(THREE.MathUtils.lerp(meshRef.current.scale.x, hovered ? 1.04 : 1, 0.1));
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      castShadow
      receiveShadow
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <meshPhysicalMaterial
        color={hovered ? "#ff8b5c" : "#fa6831"}
        roughness={0.2}
        metalness={0.28}
        clearcoat={1}
        clearcoatRoughness={0.08}
      />
    </mesh>
  );
}

interface FoundryStlPreviewProps {
  url: string;
  title?: string;
  height?: string;
}

export function FoundryStlPreview({ url, title = "Generated STL Preview", height = "h-[360px] md:h-[420px]" }: FoundryStlPreviewProps) {
  const [autoRotate, setAutoRotate] = useState(true);
  const controlsRef = useRef<any>(null);

  const resetCamera = () => {
    controlsRef.current?.reset();
  };

  return (
    <div className={`group relative ${height} w-full overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-[#0c0c0c] to-[#050505] shadow-2xl`}>
      <div className="absolute left-4 top-4 z-10 flex items-center gap-2">
        <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-black/50 px-3 py-1.5 backdrop-blur-md">
          <Box className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-bold text-white">{title}</span>
        </div>
        <span className="rounded-full border border-primary/30 bg-primary/20 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-primary">
          Real STL
        </span>
      </div>

      <div className="absolute bottom-4 right-4 z-10 flex gap-2">
        <Button
          size="icon"
          variant="ghost"
          className="h-9 w-9 rounded-xl border border-white/10 bg-black/60 text-white backdrop-blur-md hover:bg-white/10"
          onClick={resetCamera}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-9 w-9 rounded-xl border border-white/10 bg-black/60 text-white backdrop-blur-md hover:bg-white/10"
          onClick={() => setAutoRotate((current) => !current)}
        >
          {autoRotate ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
      </div>

      <div className="absolute bottom-4 left-4 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <p className="text-[10px] font-medium text-white/40">Drag to rotate · Scroll to zoom</p>
      </div>

      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0.5, 3.5]} fov={45} />

        <Suspense fallback={<Loader />}>
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

          <Center>
            <StlMesh url={url} autoRotate={autoRotate} />
          </Center>

          <gridHelper args={[10, 10, "#fa6831", "#2a1d18"]} position={[0, -1.1, 0]} />
          <Environment preset="city" />

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
