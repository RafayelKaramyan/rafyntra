import { describe, expect, it } from 'vitest';
import { clamp, damp, experienceReducer, getQualityProfile, initialState } from './experience';

describe('experience state', () => {
  it('preserves the material and expansion when the specimen changes', () => {
    const state = { ...initialState, material: 'copper' as const, expansion: 0.8 };
    expect(experienceReducer(state, { type: 'specimen', value: 'orbit' })).toEqual({
      ...state,
      specimen: 'orbit',
    });
  });
  it.each([-3, 4, NaN, Infinity])('bounds expansion for invalid input %s', (value) => {
    const state = experienceReducer(initialState, { type: 'expansion', value });
    expect(state.expansion).toBeGreaterThanOrEqual(0);
    expect(state.expansion).toBeLessThanOrEqual(1);
  });
  it('resets all controls without mutating the initial state', () => {
    const state = experienceReducer(
      { specimen: 'pulse', material: 'copper', expansion: 1, paused: true },
      { type: 'reset' },
    );
    expect(state).toEqual(initialState);
    expect(state).not.toBe(initialState);
  });
  it('toggles the motion state independently of the selected form', () => {
    expect(experienceReducer(initialState, { type: 'pause' })).toEqual({
      ...initialState,
      paused: true,
    });
  });
});

describe('rendering policy', () => {
  it('reduces geometry and pixel ratio on compact screens', () => {
    const desktop = getQualityProfile(false);
    const mobile = getQualityProfile(true);
    expect(mobile.dpr).toBeLessThan(desktop.dpr);
    expect(mobile.tubularSegments).toBeLessThan(desktop.tubularSegments);
  });
  it('uses refresh-rate-independent damping', () => {
    let at30Hz = 0;
    let at60Hz = 0;
    for (let i = 0; i < 30; i++) at30Hz = damp(at30Hz, 1, 4, 1 / 30);
    for (let i = 0; i < 60; i++) at60Hz = damp(at60Hz, 1, 4, 1 / 60);
    expect(at30Hz).toBeCloseTo(at60Hz, 8);
  });
  it('bounds unusually large frame deltas and invalid values', () => {
    expect(damp(0, 1, 4, 30)).toBe(damp(0, 1, 4, 0.05));
    expect(clamp(NaN, 0, 1)).toBe(0);
    expect(damp(0, 1, 4, -1)).toBe(0);
  });
});
