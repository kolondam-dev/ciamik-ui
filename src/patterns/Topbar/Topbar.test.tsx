import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Topbar } from './Topbar';

describe('Topbar', () => {
  it('renders children nodes correctly', () => {
    render(
      <Topbar
        leftNode={<div data-testid="left">Logo</div>}
        centerNode={<div data-testid="center">Search</div>}
        rightNode={<div data-testid="right">Profile</div>}
      />
    );

    expect(screen.getByTestId('left')).toHaveTextContent('Logo');
    expect(screen.getByTestId('center')).toHaveTextContent('Search');
    expect(screen.getByTestId('right')).toHaveTextContent('Profile');
  });

  it('applies sticky and blur styles by default', () => {
    const { container } = render(<Topbar />);
    const header = container.querySelector('header');
    expect(header).toHaveClass(/sticky/);
    expect(header).toHaveClass(/blur/);
  });
});
