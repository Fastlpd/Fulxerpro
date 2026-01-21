import { useEffect } from 'react';
import Lenis from 'lenis';
import Features from './components/Features';
import Scene from './components/canvas/Scene';

function App() {
  useEffect(() => {
    const lenis = new Lenis();

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  }, []);

  return (
    <div>
      <Features />
      <Scene />
    </div>
  );
}

export default App;