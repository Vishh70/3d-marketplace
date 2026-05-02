"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, PerspectiveCamera, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

function OrbitalShape({
  position,
  color,
  speed,
  geometry,
}: {
  position: [number, number, number];
  color: string;
  speed: number;
  geometry: "torus" | "box" | "sphere" | "cone" | "octahedron";
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = state.clock.elapsedTime * speed * 0.6;
    meshRef.current.rotation.y = state.clock.elapsedTime * speed;
  });

  const geo = (() => {
    switch (geometry) {
      case "torus":     return <torusGeometry args={[0.6, 0.22, 16, 64]} />;
      case "box":       return <boxGeometry args={[0.9, 0.9, 0.9]} />;
      case "sphere":    return <sphereGeometry args={[0.55, 32, 32]} />;
      case "cone":      return <coneGeometry args={[0.5, 1, 32]} />;
      case "octahedron":return <octahedronGeometry args={[0.65]} />;
    }
  })();

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8}>
      <mesh ref={meshRef} position={position} castShadow>
        {geo}
        <meshPhysicalMaterial
          color={color}
          roughness={0.1}
          metalness={0.6}
          reflectivity={1}
          clearcoat={1}
          clearcoatRoughness={0.05}
          transmission={geometry === "sphere" ? 0.2 : 0}
          thickness={0.5}
        />
      </mesh>
    </Float>
  );
}

function CentralCore() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    meshRef.current.rotation.z = state.clock.elapsedTime * 0.15;
  });

  return (
    <mesh ref={meshRef} castShadow>
      <icosahedronGeometry args={[1, 2]} />
      <MeshDistortMaterial
        color="#fa6831"
        roughness={0.1}
        metalness={0.7}
        distort={0.3}
        speed={2}
      />
    </mesh>
  );
}

export function HeroScene() {
  return (
    <div className="absolute inset-0 opacity-80 pointer-events-none">
      <Canvas dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
        <ambientLight intensity={0.2} />
        <pointLight position={[5, 5, 5]} intensity={3} color="#fa6831" />
        <pointLight position={[-5, -5, -5]} intensity={1.5} color="#60a5fa" />
        <spotLight position={[0, 10, 0]} intensity={2} angle={0.5} penumbra={1} castShadow />

        <Suspense fallback={null}>
          <CentralCore />
          <OrbitalShape position={[3.2, 0.5, -1]} color="#fa6831" speed={0.8} geometry="torus" />
          <OrbitalShape position={[-2.8, 1, -0.5]} color="#60a5fa" speed={0.6} geometry="box" />
          <OrbitalShape position={[1.5, -2.2, 0.5]} color="#a78bfa" speed={1.0} geometry="octahedron" />
          <OrbitalShape position={[-1.8, -1.8, -1]} color="#34d399" speed={0.7} geometry="cone" />
          <OrbitalShape position={[0.5, 2.8, 0]} color="#fb923c" speed={0.9} geometry="sphere" />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
