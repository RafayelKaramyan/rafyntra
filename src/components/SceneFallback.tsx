import { materials } from '../lib/experience';
import type { ExperienceState } from '../lib/experience';

export function SceneFallback({
  state,
  loading = false,
}: {
  state: ExperienceState;
  loading?: boolean;
}) {
  const color = materials.find((material) => material.id === state.material)?.color ?? '#b5d8ae';
  return (
    <div
      className="scene-fallback"
      role="img"
      aria-label={
        loading ? 'Preparing the 3D material study' : 'Static illustration of the selected material'
      }
    >
      <svg viewBox="0 0 600 600" aria-hidden="true">
        <defs>
          <linearGradient id="fallback-light" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor={color} />
            <stop offset="0.4" stopColor="#334139" />
            <stop offset="0.65" stopColor={color} />
            <stop offset="1" stopColor="#15221b" />
          </linearGradient>
        </defs>
        {[0, 60, 120].map((angle) => (
          <ellipse
            key={angle}
            cx="300"
            cy="300"
            rx={155 + state.expansion * 25}
            ry={85 + state.expansion * 10}
            fill="none"
            stroke="url(#fallback-light)"
            strokeWidth="44"
            transform={`rotate(${angle} 300 300)`}
          />
        ))}
      </svg>
      {loading && (
        <span className="loading-message" role="status">
          <span className="status-dot" />
          Preparing the study
        </span>
      )}
    </div>
  );
}
