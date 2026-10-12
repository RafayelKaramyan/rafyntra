import { useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import { ACESFilmicToneMapping } from 'three';
import { getQualityProfile } from '../lib/experience';
import { Sculpture } from './Sculpture';
import type { SculptureProps } from './Sculpture';

type SceneProps = SculptureProps & {
  visible: boolean;
  onReady: () => void;
  onContextLost: () => void;
};

function Lifecycle({ onReady, onContextLost }: Pick<SceneProps, 'onReady' | 'onContextLost'>) {
  const canvas = useThree((state) => state.gl.domElement);
  useEffect(() => {
    const lost = (event: Event) => {
      event.preventDefault();
      onContextLost();
    };
    canvas.addEventListener('webglcontextlost', lost, false);
    onReady();
    return () => canvas.removeEventListener('webglcontextlost', lost, false);
  }, [canvas, onReady, onContextLost]);
  return null;
}

export default function Scene({ visible, onReady, onContextLost, ...props }: SceneProps) {
  const quality = getQualityProfile(props.compact);
  return (
    <Canvas
      camera={{ position: [0, 0, 7.7], fov: 39, near: 0.1, far: 30 }}
      dpr={[1, quality.dpr]}
      frameloop={!visible ? 'never' : props.reducedMotion ? 'demand' : 'always'}
      gl={{
        antialias: !props.compact,
        alpha: true,
        powerPreference: 'high-performance',
        toneMapping: ACESFilmicToneMapping,
        toneMappingExposure: 1.25,
      }}
      aria-hidden="true"
    >
      <Lifecycle onReady={onReady} onContextLost={onContextLost} />
      <ambientLight intensity={0.28} />
      <directionalLight position={[3, 5, 4]} color="#d9f6d5" intensity={3} />
      <directionalLight position={[-5, -1, 1]} color="#7b9384" intensity={1.6} />
      <Environment resolution={quality.environmentResolution} frames={1}>
        <Lightformer
          position={[0, 4, -3]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[10, 6, 1]}
          intensity={3}
        />
        <Lightformer
          position={[-4, 1, 2]}
          rotation={[0, Math.PI / 2, 0]}
          scale={[3, 7, 1]}
          intensity={3}
        />
        <Lightformer
          position={[4, 2, 0]}
          rotation={[0, -Math.PI / 2, 0]}
          scale={[2, 8, 1]}
          color="#c8e9c2"
          intensity={4}
        />
        <Lightformer
          position={[0, -4, 1]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={[8, 3, 1]}
          intensity={0.8}
        />
      </Environment>
      <Sculpture {...props} />
    </Canvas>
  );
}
