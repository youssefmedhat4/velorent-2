"use client";

import { Suspense, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows, Float, Html } from "@react-three/drei";
import { motion } from "framer-motion";
import { SearchBar } from "./SearchBar";

function HeroCarModel() {
  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
      {/* Placeholder geometric car shape when no GLB is loaded */}
      <group>
        {/* Car body */}
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[3, 0.6, 1.4]} />
          <meshStandardMaterial color="#0E2D4A" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Car roof */}
        <mesh position={[0, 0.55, 0]} castShadow>
          <boxGeometry args={[1.8, 0.5, 1.2]} />
          <meshStandardMaterial color="#163352" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Wheels */}
        {[[-1.1, -0.35, 0.8], [1.1, -0.35, 0.8], [-1.1, -0.35, -0.8], [1.1, -0.35, -0.8]].map(
          ([x, y, z], i) => (
            <mesh key={i} position={[x, y, z]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.35, 0.35, 0.25, 32]} />
              <meshStandardMaterial color="#0B2540" metalness={0.6} roughness={0.4} />
            </mesh>
          )
        )}
        {/* Accent strip */}
        <mesh position={[0, 0.05, 0.71]}>
          <boxGeometry args={[2.8, 0.05, 0.02]} />
          <meshStandardMaterial color="#FDF5AA" emissive="#FDF5AA" emissiveIntensity={0.5} />
        </mesh>
      </group>
    </Float>
  );
}

function CanvasLoader() {
  return (
    <Html center>
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-transparent border-t-[#FDF5AA]" />
    </Html>
  );
}

export function HeroSection() {
  const [autoRotate, setAutoRotate] = useState(true);

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#0B2540]">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(88,160,200,0.08)_0%,_transparent_70%)]" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#58A0C8]/30 to-transparent" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(rgba(88,160,200,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(88,160,200,0.3) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Hero Text */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 pt-24">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#FDF5AA]/20 bg-[#FDF5AA]/5 px-4 py-1.5"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#FDF5AA] animate-pulse" />
          <span className="text-xs font-medium text-[#FDF5AA]">500+ Premium Vehicles Available</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display text-6xl font-black uppercase leading-none tracking-tight text-white sm:text-7xl lg:text-8xl"
        >
          Drive the
          <br />
          <span className="text-[#FDF5AA]">Future</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-6 max-w-lg text-base text-slate-300 sm:text-lg"
        >
          Premium car rental for those who demand the extraordinary.
          From sleek sports cars to powerful SUVs — your perfect ride awaits.
        </motion.p>
      </div>

      {/* 3D Canvas */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="relative z-10 h-[40vh] w-full max-w-3xl"
        onMouseEnter={() => setAutoRotate(false)}
        onMouseLeave={() => setAutoRotate(true)}
      >
        <Canvas
          camera={{ position: [5, 2, 5], fov: 40 }}
          shadows
          gl={{ antialias: true, alpha: true }}
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1.5} castShadow />
          <directionalLight position={[-5, 3, -5]} intensity={0.5} color="#58A0C8" />
          <pointLight position={[0, 5, 0]} intensity={0.5} color="#FDF5AA" />

          <Suspense fallback={<CanvasLoader />}>
            <HeroCarModel />
            <Environment preset="city" />
            <ContactShadows
              position={[0, -0.8, 0]}
              opacity={0.3}
              scale={12}
              blur={2.5}
            />
          </Suspense>

          <OrbitControls
            enablePan={false}
            enableZoom={false}
            maxPolarAngle={Math.PI / 2.2}
            autoRotate={autoRotate}
            autoRotateSpeed={1}
          />
        </Canvas>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
        className="relative z-10 w-full max-w-4xl px-4 pb-16"
      >
        <SearchBar />
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
      >
        <span className="text-xs text-slate-500">Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="h-4 w-0.5 rounded-full bg-[#1a4f7a]"
        />
      </motion.div>
    </section>
  );
}
