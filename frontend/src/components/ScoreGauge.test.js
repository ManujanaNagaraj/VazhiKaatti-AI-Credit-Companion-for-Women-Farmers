import React from 'react';
import { render } from '@testing-library/react';
import ScoreGauge from './ScoreGauge';

describe('ScoreGauge Component', () => {
  test('renders score correctly', () => {
    const { container } = render(<ScoreGauge score={680} />);
    expect(container.textContent).toContain('680');
  });

  test('displays score within valid range', () => {
    const { container } = render(<ScoreGauge score={850} />);
    expect(container.textContent).toContain('850');
  });

  test('renders color legend', () => {
    const { container } = render(<ScoreGauge score={680} />);
    expect(container.textContent).toContain('300-549');
    expect(container.textContent).toContain('750-900');
  });
});
