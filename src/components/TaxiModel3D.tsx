import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const TaxiCar = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.2;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.2;
    }
  });

  return (
    <group>
      {/* Car Body with enhanced visibility */}
      <mesh ref={meshRef} position={[0, 0.5, 0]}>
        <boxGeometry args={[2, 0.8, 4]} />
        <meshStandardMaterial 
          color="#FFD700" 
          metalness={0.3}
          roughness={0.2}
          emissive="#FFD700"
          emissiveIntensity={0.1}
        />
      </mesh>
      
      {/* Car Top */}
      <mesh position={[0, 1.2, -0.5]}>
        <boxGeometry args={[1.8, 0.8, 2]} />
        <meshStandardMaterial 
          color="#FFD700" 
          metalness={0.3}
          roughness={0.2}
          emissive="#FFD700"
          emissiveIntensity={0.1}
        />
      </mesh>
      
      {/* Wheels with glow */}
      <mesh position={[-0.8, 0.2, 1.2]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
        <meshStandardMaterial 
          color="#333333" 
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>
      <mesh position={[0.8, 0.2, 1.2]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
        <meshStandardMaterial 
          color="#333333" 
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>
      <mesh position={[-0.8, 0.2, -1.2]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
        <meshStandardMaterial 
          color="#333333" 
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>
      <mesh position={[0.8, 0.2, -1.2]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
        <meshStandardMaterial 
          color="#333333" 
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>
      
      {/* Enhanced Taxi Sign with glow */}
      <mesh position={[0, 2.2, 0]}>
        <boxGeometry args={[1, 0.3, 0.6]} />
        <meshStandardMaterial 
          color="#000000" 
          emissive="#FFD700"
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Taxi Text with stronger glow */}
      <mesh position={[0, 2.25, 0.31]}>
        <planeGeometry args={[0.8, 0.2]} />
        <meshStandardMaterial 
          color="#FFD700" 
          emissive="#FFD700"
          emissiveIntensity={0.5}
        />
      </mesh>
      
      {/* Enhanced Headlights with stronger glow */}
      <mesh position={[-0.5, 0.8, 2.1]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial 
          color="#FFFFFF" 
          emissive="#FFFFFF" 
          emissiveIntensity={0.8}
          metalness={0.1}
          roughness={0.1}
        />
      </mesh>
      <mesh position={[0.5, 0.8, 2.1]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial 
          color="#FFFFFF" 
          emissive="#FFFFFF" 
          emissiveIntensity={0.8}
          metalness={0.1}
          roughness={0.1}
        />
      </mesh>
    </group>
  );
};

interface TaxiModel3DProps {
  className?: string;
}

const TaxiModel3D: React.FC<TaxiModel3DProps> = ({ className = "" }) => {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas camera={{ position: [5, 3, 5], fov: 50 }}>
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />
        <spotLight position={[0, 10, 0]} intensity={1} angle={0.3} penumbra={1} />
        <TaxiCar />
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          autoRotate
          autoRotateSpeed={3}
        />
      </Canvas>
    </div>
  );
};

export default TaxiModel3D;