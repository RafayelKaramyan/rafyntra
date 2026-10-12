import { useReducer } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Controls } from './Controls';
import { experienceReducer, initialState } from '../lib/experience';

function Harness({ reducedMotion = false }: { reducedMotion?: boolean }) {
  const [state, dispatch] = useReducer(experienceReducer, initialState);
  return <Controls state={state} dispatch={dispatch} reducedMotion={reducedMotion} />;
}

describe('accessible sculpture controls', () => {
  it('supports keyboard selection and announces the selected specimen', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const orbit = screen.getByRole('button', { name: /02.*Orbit/ });
    orbit.focus();
    await user.keyboard('{Enter}');
    expect(orbit).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: /01.*Helix/ })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });
  it('updates the finish and expansion and restores them with Reset', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole('button', { name: 'Copper' }));
    fireEvent.change(screen.getByRole('slider', { name: '03 / EXPANSION' }), {
      target: { value: '80' },
    });
    expect(screen.getByText('80%')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Copper' })).toHaveAttribute('aria-pressed', 'true');
    await user.click(screen.getByRole('button', { name: 'Reset' }));
    expect(screen.getByText('25%')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Verdant' })).toHaveAttribute('aria-pressed', 'true');
  });
  it('pauses and resumes motion with an accessible button label', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole('button', { name: 'Pause motion' }));
    expect(screen.getByRole('button', { name: 'Resume motion' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });
  it('does not allow automatic motion to override the reduced-motion preference', () => {
    render(<Harness reducedMotion />);
    expect(screen.getByRole('button', { name: 'Pause motion' })).toBeDisabled();
    expect(screen.getByText('Reduced motion')).toBeInTheDocument();
  });
});
