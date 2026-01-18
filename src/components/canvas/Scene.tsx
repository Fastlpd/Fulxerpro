import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Torus } from '@react-three/drei';

const SpinningTorus = () => {
  const ref = useRef<any>();

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.x += 0.001;
      ref.current.rotation.y += 0.005;
    }
  });

  return (
    <Torus ref={ref} args={[1.5, 0.3, 16, 100]} position={[0, 0, 0]}>
      <meshStandardMaterial color="#8A2BE2" wireframe />
    </Torus>
  );
};

const Scene = () => {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <SpinningTorus />
    </Canvas>
  );
};

export default Scene;
