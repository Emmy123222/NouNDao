import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Sphere } from '@react-three/drei';
import * as THREE from 'three';

function Stars() {
  const ref = useRef<THREE.Points>(null);
  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(5000 * 3);
    const colors = new Float32Array(5000 * 3);
    
    for (let i = 0; i < 5000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
      
      colors[i * 3] = Math.random();
      colors[i * 3 + 1] = Math.random();
      colors[i * 3 + 2] = Math.random();
    }
    
    return [positions, colors];
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.1;
      ref.current.rotation.y = state.clock.elapsedTime * 0.15;
    }
  });

  return (
    <Points ref={ref} positions={positions} colors={colors} stride={3} frustumCulled>
      <PointMaterial
        transparent
        color="#ffffff"
        size={0.5}
        sizeAttenuation={true}
        depthWrite={false}
        vertexColors
      />
    </Points>
  );
}

function Earth() {
  const earthRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (earthRef.current) {
      earthRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <group position={[8, 0, -10]}>
      <Sphere ref={earthRef} args={[2, 64, 64]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color="#4A90E2"
          roughness={0.7}
          metalness={0.1}
          transparent
          opacity={0.8}
        />
      </Sphere>
      <Sphere ref={atmosphereRef} args={[2.1, 64, 64]} position={[0, 0, 0]}>
        <meshBasicMaterial
          color="#87CEEB"
          transparent
          opacity={0.3}
          side={THREE.BackSide}
        />
      </Sphere>
    </group>
  );
}

export function SpaceBackground() {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        style={{ background: 'radial-gradient(ellipse at center, #1a1a2e 0%, #0f0f1e 100%)' }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Stars />
        <Earth />
      </Canvas>
    </div>
  );
}