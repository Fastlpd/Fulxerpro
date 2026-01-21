import { Canvas, useThree } from '@react-three/fiber';
import { AmbientLight, BoxGeometry, Mesh, MeshStandardMaterial, PointLight } from 'three';
import { useEffect } from 'react';

function Experience() {
  const { scene } = useThree();
  useEffect(() => {
    const ambientLight = new AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new PointLight(0xffffff, 1, 100);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    const geometry = new BoxGeometry();
    const material = new MeshStandardMaterial({ color: '#8A2BE2', wireframe: true });
    const mesh = new Mesh(geometry, material);
    scene.add(mesh);

    return () => {
      scene.remove(ambientLight);
      scene.remove(pointLight);
      scene.remove(mesh);
    }
  }, [scene]);
  return null;
}

function Scene() {
  return (
    <Canvas>
      <Experience />
    </Canvas>
  );
}

export default Scene;
