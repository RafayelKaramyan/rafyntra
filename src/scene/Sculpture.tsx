import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Color } from 'three';
import type { Group, Mesh, MeshStandardMaterial } from 'three';
import { damp, getQualityProfile, materials } from '../lib/experience';
import type { ExperienceState } from '../lib/experience';
import type { MutableRefObject } from 'react';

export type SceneSignals = { scroll: number; pointerX: number; pointerY: number };
export type SculptureProps = {
  state: ExperienceState;
  compact: boolean;
  reducedMotion: boolean;
  signals: MutableRefObject<SceneSignals>;
};

export function Sculpture({ state, compact, reducedMotion, signals }: SculptureProps) {
  const root = useRef<Group>(null);
  const form = useRef<Group>(null);
  const material = useRef<MeshStandardMaterial>(null);
  const rings = useRef<(Mesh | null)[]>([]);
  const time = useRef(0);
  const targetColor = useRef(new Color());
  const quality = getQualityProfile(compact);
  const finish = materials.find((item) => item.id === state.material) ?? materials[0];

  useEffect(() => {
    if (root.current && !reducedMotion) root.current.scale.setScalar(compact ? 0.62 : 0.68);
  }, [state.specimen, compact, reducedMotion]);

  useFrame((_, delta) => {
    if (!root.current || !form.current) return;
    const dt = Math.min(delta, 0.05);
    if (!state.paused && !reducedMotion) time.current += dt;
    const t = time.current;
    const smooth = (current: number, target: number) =>
      reducedMotion ? target : damp(current, target, 4, dt);
    root.current.rotation.x = smooth(
      root.current.rotation.x,
      0.22 + (reducedMotion ? 0 : signals.current.pointerY * 0.16),
    );
    root.current.rotation.y = smooth(
      root.current.rotation.y,
      -0.35 + (reducedMotion ? 0 : signals.current.pointerX * 0.3 + signals.current.scroll * 0.8),
    );
    form.current.rotation.y = t * 0.16;
    form.current.rotation.z = -0.18 + (reducedMotion ? 0 : Math.sin(t * 0.3) * 0.07);
    root.current.position.y = reducedMotion ? 0 : Math.sin(t * 0.7) * 0.065;
    const targetScale = (compact ? 0.72 : 0.78) * (1 + state.expansion * 0.12);
    root.current.scale.setScalar(smooth(root.current.scale.x, targetScale));
    rings.current.forEach((ring, index) => {
      if (ring)
        ring.position.z = smooth(ring.position.z, (index - 5.5) * (0.07 + state.expansion * 0.2));
    });
    if (material.current) {
      targetColor.current.set(finish.color);
      material.current.color.lerp(targetColor.current, reducedMotion ? 1 : 1 - Math.exp(-5 * dt));
      material.current.metalness = smooth(material.current.metalness, finish.metalness);
      material.current.roughness = smooth(material.current.roughness, finish.roughness);
    }
  });

  const surface = (
    <meshStandardMaterial
      ref={material}
      color={finish.color}
      metalness={finish.metalness}
      roughness={finish.roughness}
      envMapIntensity={1.65}
    />
  );

  return (
    <group ref={root} scale={compact ? 0.72 : 0.78}>
      <group ref={form}>
        {state.specimen === 'helix' && (
          <mesh rotation={[0.3, 0.1, 0.2]}>
            <torusKnotGeometry
              args={[
                1.48,
                0.47 + state.expansion * 0.08,
                quality.tubularSegments,
                quality.radialSegments,
                2,
                3,
              ]}
            />
            {surface}
          </mesh>
        )}
        {state.specimen === 'orbit' && (
          <group>
            <mesh rotation={[0.65, 0.2, 0.4]}>
              <torusGeometry args={[1.7, 0.18, quality.radialSegments, 160]} />
              {surface}
            </mesh>
            <mesh rotation={[-0.65, 0.95, -0.5]} scale={1 + state.expansion * 0.1}>
              <torusGeometry args={[1.7, 0.18, quality.radialSegments, 160]} />
              <meshStandardMaterial
                color={finish.color}
                metalness={finish.metalness}
                roughness={finish.roughness}
                envMapIntensity={1.65}
              />
            </mesh>
            <mesh rotation={[1.4, -0.4, 0.5]} scale={1 + state.expansion * 0.2}>
              <torusGeometry args={[1.7, 0.18, quality.radialSegments, 160]} />
              <meshStandardMaterial
                color={finish.color}
                metalness={finish.metalness}
                roughness={finish.roughness}
                envMapIntensity={1.65}
              />
            </mesh>
            <mesh>
              <sphereGeometry args={[0.6, 48, 32]} />
              <meshStandardMaterial color="#202823" metalness={0.95} roughness={0.15} />
            </mesh>
          </group>
        )}
        {state.specimen === 'pulse' && (
          <group rotation={[0.6, 0.45, 0]}>
            {Array.from({ length: 12 }, (_, i) => (
              <mesh
                key={i}
                ref={(mesh) => {
                  rings.current[i] = mesh;
                }}
                position={[0, 0, (i - 5.5) * (0.07 + state.expansion * 0.2)]}
              >
                <torusGeometry
                  args={[Math.sqrt(1 - Math.pow((i - 5.5) / 6.3, 2)) * 1.65, 0.075, 12, 96]}
                />
                <meshStandardMaterial
                  color={finish.color}
                  metalness={finish.metalness}
                  roughness={finish.roughness}
                  envMapIntensity={1.65}
                />
              </mesh>
            ))}
          </group>
        )}
      </group>
    </group>
  );
}
