"use client";

import { Suspense, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment, ContactShadows, Html } from "@react-three/drei";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { CarImageGallery } from "./CarImageGallery";
import { RotateCcw } from "lucide-react";
import type { Group } from "three";

interface Car3DViewerProps {
  modelUrl?: string | null;
  images?: string[];
  carName?: string;
}

function CarModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const ref = useRef<Group>(null);

  return (
    <primitive
      ref={ref}
      object={scene}
      scale={1.5}
      position={[0, -0.5, 0]}
    />
  );
}

function ModelLoader() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-2">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-transparent border-t-[#FDF5AA]" />
        <p className="text-xs text-slate-300">Loading 3D model...</p>
      </div>
    </Html>
  );
}

export function Car3DViewer({ modelUrl, images = [], carName }: Car3DViewerProps) {
  const [autoRotate, setAutoRotate] = useState(true);
  const [userInteracting, setUserInteracting] = useState(false);

  // If no 3D model, fall back to image gallery
  if (!modelUrl) {
    return <CarImageGallery images={images} carName={carName} />;
  }

  return (
    <div className="relative h-full w-full min-h-[400px] rounded-2xl overflow-hidden bg-gradient-to-b from-zinc-900 to-zinc-950">
      <Canvas
        camera={{ position: [4, 2, 4], fov: 45 }}
        shadows
        gl={{ antialias: true, alpha: true }}
        className="h-full w-full"
      >
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1.2}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <directionalLight position={[-5, 3, -5]} intensity={0.4} />

        <Suspense fallback={<ModelLoader />}>
          <CarModel url={modelUrl} />
          <Environment preset="city" />
          <ContactShadows
            position={[0, -0.8, 0]}
            opacity={0.4}
            scale={10}
            blur={2}
            far={4}
          />
        </Suspense>

        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={2}
          maxDistance={8}
          maxPolarAngle={Math.PI / 2}
          autoRotate={autoRotate && !userInteracting}
          autoRotateSpeed={1.5}
          onStart={() => {
            setUserInteracting(true);
            setAutoRotate(false);
          }}
          onEnd={() => {
            setUserInteracting(false);
            // Resume auto-rotate after 3 seconds of inactivity
            setTimeout(() => setAutoRotate(true), 3000);
          }}
        />
      </Canvas>

      {/* Controls hint */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1.5 backdrop-blur-sm">
        <RotateCcw className="h-3 w-3 text-slate-300" />
        <span className="text-xs text-slate-300">Drag to rotate · Scroll to zoom</span>
      </div>

      {/* 3D badge */}
      <div className="absolute top-4 right-4 rounded-md border border-[#FDF5AA]/30 bg-[#FDF5AA]/10 px-2 py-1">
        <span className="text-xs font-bold text-[#FDF5AA]">3D</span>
      </div>
    </div>
  );
}
