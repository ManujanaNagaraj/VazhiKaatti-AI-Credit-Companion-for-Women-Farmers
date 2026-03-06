import React from 'react';
import { render, screen } from '@testing-library/react';
import TamilText from './TamilText';

describe('TamilText Component', () => {
  test('renders Tamil text correctly', () => {
    render(<TamilText text="வழிகாட்டி" />);
    expect(screen.getByText('வழிகாட்டி')).toBeInTheDocument();
  });

  test('applies custom className', () => {
    const { container } = render(<TamilText text="வழிகாட்டி" className="custom-class" />);
    expect(container.firstChild).toHaveClass('tamil-text');
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
