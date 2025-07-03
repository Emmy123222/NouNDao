import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Sphere, Stars, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function AnimatedStars() {
  const ref = useRef<THREE.Points>(null);
  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(8000 * 3);
    const colors = new Float32Array(8000 * 3);
    
    for (let i = 0; i < 8000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 200;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 200;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 200;
      
      const colorChoice = Math.random();
      if (colorChoice < 0.3) {
        // Purple stars
        colors[i * 3] = 0.5 + Math.random() * 0.5;
        colors[i * 3 + 1] = 0.2 + Math.random() * 0.3;
        colors[i * 3 + 2] = 0.8 + Math.random() * 0.2;
      } else if (colorChoice < 0.6) {
        // Blue stars
        colors[i * 3] = 0.2 + Math.random() * 0.3;
        colors[i * 3 + 1] = 0.4 + Math.random() * 0.4;
        colors[i * 3 + 2] = 0.8 + Math.random() * 0.2;
      } else {
        // White/cyan stars
        colors[i * 3] = 0.8 + Math.random() * 0.2;
        colors[i * 3 + 1] = 0.9 + Math.random() * 0.1;
        colors[i * 3 + 2] = 1.0;
      }
    }
    
    return [positions, colors];
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.05;
      ref.current.rotation.y = state.clock.elapsedTime * 0.08;
    }
  });

  return (
    <Points ref={ref} positions={positions} colors={colors} stride={3} frustumCulled>
      <PointMaterial
        transparent
        color="#ffffff"
        size={1.2}
        sizeAttenuation={true}
        depthWrite={false}
        vertexColors
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

function CosmicEarth() {
  const earthRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (earthRef.current) {
      earthRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    }
  });

  return (
    <group position={[12, 2, -15]} scale={[1.5, 1.5, 1.5]}>
      {/* Earth Core */}
      <Sphere ref={earthRef} args={[3, 64, 64]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color="#2563eb"
          roughness={0.8}
          metalness={0.2}
          transparent
          opacity={0.9}
        />
      </Sphere>
      
      {/* Clouds */}
      <Sphere ref={cloudsRef} args={[3.1, 32, 32]} position={[0, 0, 0]}>
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.1}
          side={THREE.DoubleSide}
        />
      </Sphere>
      
      {/* Atmosphere */}
      <Sphere ref={atmosphereRef} args={[3.3, 32, 32]} position={[0, 0, 0]}>
        <meshBasicMaterial
          color="#06b6d4"
          transparent
          opacity={0.2}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </Sphere>
      
      {/* Outer Glow */}
      <Sphere args={[3.6, 32, 32]} position={[0, 0, 0]}>
        <meshBasicMaterial
          color="#8b5cf6"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </Sphere>
    </group>
  );
}

function FloatingNouns() {
  const nounsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (nounsRef.current) {
      nounsRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      nounsRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 2;
    }
  });

  return (
    <group ref={nounsRef} position={[-8, 0, -10]}>
      {/* Floating Noun-like cubes */}
      {Array.from({ length: 5 }).map((_, i) => (
        <Sphere
          key={i}
          args={[0.5, 8, 8]}
          position={[
            Math.cos(i * 1.26) * 4,
            Math.sin(i * 1.26) * 2,
            Math.sin(i * 0.8) * 3
          ]}
        >
          <meshStandardMaterial
            color={i % 2 === 0 ? "#ec4899" : "#f59e0b"}
            roughness={0.3}
            metalness={0.7}
            emissive={i % 2 === 0 ? "#ec4899" : "#f59e0b"}
            emissiveIntensity={0.2}
          />
        </Sphere>
      ))}
    </group>
  );
}

export function CosmicBackground() {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 20], fov: 75 }}
        style={{ 
          background: 'radial-gradient(ellipse at center, #1a1a2e 0%, #0f0f1e 50%, #000000 100%)' 
        }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#8b5cf6" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#06b6d4" />
        <directionalLight position={[5, 5, 5]} intensity={0.5} color="#ffffff" />
        
        <AnimatedStars />
        <CosmicEarth />
        <FloatingNouns />
        
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={true}
          autoRotate={true}
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
      </Canvas>
      
      {/* Overlay gradients for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 via-transparent to-blue-900/10 pointer-events-none" />
    </div>
  );
}