"use client";

import * as React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage, Center } from "@react-three/drei";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

// This is a placeholder for the actual STL/OBJ loading logic
// which would use useLoader(STLLoader, url)
function ModelPlaceholder() {
  return (
    <mesh castShadow receiveShadow>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="#059669" roughness={0.3} metalness={0.2} />
    </mesh>
  );
}

export function ModelViewer3D({ url }: { url?: string }) {
  return (
    <div className="relative w-full h-full min-h-[400px] bg-secondary/20 rounded-xl overflow-hidden border border-border/50">
      <React.Suspense fallback={
        <div className="absolute inset-0 flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      }>
        <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 45 }}>
          <color attach="background" args={['transparent']} />
          <Stage environment="city" intensity={0.5} adjustCamera>
            <Center>
              {/* If url was provided, we would load the actual model here */}
              <ModelPlaceholder />
            </Center>
          </Stage>
          <OrbitControls 
            makeDefault 
            autoRotate 
            autoRotateSpeed={0.5}
            enablePan={false}
            minDistance={2}
            maxDistance={10}
          />
        </Canvas>
      </React.Suspense>
      
      <div className="absolute bottom-4 left-4 right-4 flex justify-center pointer-events-none">
        <div className="bg-background/80 backdrop-blur-sm rounded-full px-4 py-1.5 text-xs text-muted-foreground shadow-sm border pointer-events-auto">
          Drag to rotate • Scroll to zoom
        </div>
      </div>
    </div>
  );
}
