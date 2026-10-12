export const specimens = [
  {
    id: 'helix',
    number: '01',
    name: 'Helix',
    descriptor: 'Continuity in tension',
    formula: 'T(2, 3)',
    detail: 'One uninterrupted surface. Infinite ways to see it.',
  },
  {
    id: 'orbit',
    number: '02',
    name: 'Orbit',
    descriptor: 'A system in balance',
    formula: 'R × 3',
    detail: 'Three independent paths. A single centre of gravity.',
  },
  {
    id: 'pulse',
    number: '03',
    name: 'Pulse',
    descriptor: 'Order from repetition',
    formula: 'Σ 12',
    detail: 'Twelve concentric rings. Rhythm made tangible.',
  },
] as const;

export const materials = [
  { id: 'verdant', name: 'Verdant', color: '#b5d8ae', metalness: 0.85, roughness: 0.25 },
  { id: 'porcelain', name: 'Porcelain', color: '#e7e0d4', metalness: 0.3, roughness: 0.22 },
  { id: 'copper', name: 'Copper', color: '#e2a17b', metalness: 0.95, roughness: 0.29 },
] as const;

export type SpecimenId = (typeof specimens)[number]['id'];
export type MaterialId = (typeof materials)[number]['id'];
export type ExperienceState = {
  specimen: SpecimenId;
  material: MaterialId;
  expansion: number;
  paused: boolean;
};
export type ExperienceAction =
  | { type: 'specimen'; value: SpecimenId }
  | { type: 'material'; value: MaterialId }
  | { type: 'expansion'; value: number }
  | { type: 'pause' }
  | { type: 'reset' };

export const initialState: ExperienceState = {
  specimen: 'helix',
  material: 'verdant',
  expansion: 0.25,
  paused: false,
};

export function clamp(value: number, min: number, max: number): number {
  return Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : min;
}

export function experienceReducer(
  state: ExperienceState,
  action: ExperienceAction,
): ExperienceState {
  switch (action.type) {
    case 'specimen':
      return { ...state, specimen: action.value };
    case 'material':
      return { ...state, material: action.value };
    case 'expansion':
      return { ...state, expansion: clamp(action.value, 0, 1) };
    case 'pause':
      return { ...state, paused: !state.paused };
    case 'reset':
      return { ...initialState };
  }
}

/** Exponential damping keeps motion consistent across refresh rates. */
export function damp(current: number, target: number, speed: number, delta: number): number {
  return current + (target - current) * (1 - Math.exp(-speed * clamp(delta, 0, 0.05)));
}

export function getQualityProfile(compact: boolean) {
  return compact
    ? { dpr: 1.25, tubularSegments: 160, radialSegments: 24, environmentResolution: 128 }
    : { dpr: 1.75, tubularSegments: 256, radialSegments: 32, environmentResolution: 256 };
}
