import type { Dispatch } from 'react';
import { materials, specimens } from '../lib/experience';
import type { ExperienceAction, ExperienceState } from '../lib/experience';
import { Icon } from './Icon';

type ControlsProps = {
  state: ExperienceState;
  dispatch: Dispatch<ExperienceAction>;
  reducedMotion: boolean;
};

export function Controls({ state, dispatch, reducedMotion }: ControlsProps) {
  return (
    <div className="controls" aria-label="Sculpture controls">
      <div className="control-section">
        <div className="control-label">
          <span>01 / FORM</span>
          <span>SELECT A SPECIMEN</span>
        </div>
        <div className="specimen-options">
          {specimens.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={state.specimen === item.id}
              onClick={() => dispatch({ type: 'specimen', value: item.id })}
            >
              <span className="option-number">{item.number}</span>
              {item.name}
              <span className="option-dot" />
            </button>
          ))}
        </div>
      </div>
      <div className="control-section">
        <div className="control-label">
          <span>02 / FINISH</span>
          <span>LIGHT MEETS MATTER</span>
        </div>
        <div className="material-options">
          {materials.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={state.material === item.id}
              onClick={() => dispatch({ type: 'material', value: item.id })}
            >
              <span className="material-swatch" style={{ background: item.color }} />
              {item.name}
            </button>
          ))}
        </div>
      </div>
      <div className="control-section expansion-control">
        <div className="control-label">
          <label htmlFor="expansion">03 / EXPANSION</label>
          <output htmlFor="expansion">{Math.round(state.expansion * 100)}%</output>
        </div>
        <input
          id="expansion"
          type="range"
          min="0"
          max="100"
          step="1"
          value={Math.round(state.expansion * 100)}
          onChange={(event) =>
            dispatch({ type: 'expansion', value: Number(event.currentTarget.value) / 100 })
          }
        />
        <div className="range-labels">
          <span>COMPACT</span>
          <span>EXPANDED</span>
        </div>
      </div>
      <div className="control-actions">
        <button
          type="button"
          className="text-button"
          aria-label={state.paused ? 'Resume motion' : 'Pause motion'}
          aria-pressed={state.paused}
          onClick={() => dispatch({ type: 'pause' })}
          disabled={reducedMotion}
        >
          <Icon name={state.paused || reducedMotion ? 'play' : 'pause'} />
          {reducedMotion ? 'Reduced motion' : state.paused ? 'Resume motion' : 'Pause motion'}
        </button>
        <button type="button" className="text-button" onClick={() => dispatch({ type: 'reset' })}>
          <Icon name="reset" />
          Reset
        </button>
      </div>
    </div>
  );
}
