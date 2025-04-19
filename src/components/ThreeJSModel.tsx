
// import React, { useRef, useState, useEffect } from 'react';
// import { Canvas, useFrame } from '@react-three/fiber';
// import { OrbitControls, useAnimations, useGLTF } from '@react-three/drei';
// import * as THREE from 'three';

// interface ModelProps {
//   isSpeaking: boolean;
// }

// // This is a placeholder for a humanoid tutor model
// // In a real app, you would use a more realistic model
// function HumanoidModel({ isSpeaking }: ModelProps) {
//   const group = useRef<THREE.Group>(null);
//   const mixer = useRef<THREE.AnimationMixer | null>(null);
  
//   // Base color for the tutor
//   const materialProps = {
//     color: new THREE.Color('#6366f1'),
//     roughness: 0.5,
//     metalness: 0.2,
//   };
  
//   useFrame((_, delta) => {
//     if (mixer.current) {
//       mixer.current.update(delta);
//     }
    
//     // Add subtle movement when speaking
//     if (group.current && isSpeaking) {
//       group.current.rotation.y += delta * 0.2;
//     }
//   });
  
//   return (
//     <group ref={group}>
//       {/* Head */}
//       <mesh position={[0, 1.6, 0]}>
//         <sphereGeometry args={[0.5, 32, 32]} />
//         <meshStandardMaterial {...materialProps} />
//       </mesh>
      
//       {/* Body */}
//       <mesh position={[0, 0.7, 0]}>
//         <capsuleGeometry args={[0.3, 1.4, 8, 16]} />
//         <meshStandardMaterial {...materialProps} />
//       </mesh>
      
//       {/* Arms */}
//       <mesh position={[0.6, 0.7, 0]}>
//         <capsuleGeometry args={[0.15, 0.9, 8, 16]} />
//         <meshStandardMaterial {...materialProps} />
//       </mesh>
//       <mesh position={[-0.6, 0.7, 0]}>
//         <capsuleGeometry args={[0.15, 0.9, 8, 16]} />
//         <meshStandardMaterial {...materialProps} />
//       </mesh>
      
//       {/* Eyes */}
//       <mesh position={[0.15, 1.7, 0.4]}>
//         <sphereGeometry args={[0.08, 32, 32]} />
//         <meshStandardMaterial color="white" />
//       </mesh>
//       <mesh position={[-0.15, 1.7, 0.4]}>
//         <sphereGeometry args={[0.08, 32, 32]} />
//         <meshStandardMaterial color="white" />
//       </mesh>
      
//       {/* Pupils */}
//       <mesh position={[0.15, 1.7, 0.48]}>
//         <sphereGeometry args={[0.04, 32, 32]} />
//         <meshStandardMaterial color="black" />
//       </mesh>
//       <mesh position={[-0.15, 1.7, 0.48]}>
//         <sphereGeometry args={[0.04, 32, 32]} />
//         <meshStandardMaterial color="black" />
//       </mesh>
      
//       {/* Mouth (changes when speaking) */}
//       <mesh position={[0, 1.5, 0.4]} scale={[0.3, isSpeaking ? 0.1 : 0.02, 0.1]}>
//         <boxGeometry args={[1, 1, 1]} />
//         <meshStandardMaterial color="#f87171" />
//       </mesh>
//     </group>
//   );
// }

// const ThreeJSModel: React.FC<{ isSpeaking: boolean }> = ({ isSpeaking }) => {
//   return (
//     <div className="w-full h-full">
//       <Canvas camera={{ position: [0, 1, 5], fov: 50 }}>
//         <ambientLight intensity={0.5} />
//         <pointLight position={[10, 10, 10]} intensity={1} />
//         <HumanoidModel isSpeaking={isSpeaking} />
//         <OrbitControls 
//           enableZoom={false} 
//           enablePan={false} 
//           minPolarAngle={Math.PI / 3}
//           maxPolarAngle={Math.PI / 2}
//         />
//       </Canvas>
//     </div>
//   );
// };

// export default ThreeJSModel;
import React from 'react'

const ThreeJSModel = () => {
  return (
    <div>
      <h1>ThreeJS Model Placeholder</h1>
    </div>
  )
}

export default ThreeJSModel
