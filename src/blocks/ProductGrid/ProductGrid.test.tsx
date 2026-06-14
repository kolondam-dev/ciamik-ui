import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductGrid } from './ProductGrid';

describe('ProductGrid', () => {
  it('renders title and grid children', () => {
    render(
      <ProductGrid title="Rekomendasi Terbaik">
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
      </ProductGrid>
    );

    expect(screen.getByText('Rekomendasi Terbaik')).toBeInTheDocument();
    expect(screen.getByTestId('child-1')).toBeInTheDocument();
    expect(screen.getByTestId('child-2')).toBeInTheDocument();
  });

  it('renders custom badge beside title', () => {
    render(
      <ProductGrid title="Flash Sale" badge={<span data-testid="test-badge">Countdown</span>}>
        <div>Child</div>
      </ProductGrid>
    );

    expect(screen.getByTestId('test-badge')).toBeInTheDocument();
  });

  it('renders see all button and handles callback clicks', () => {
    const onSeeAllClick = vi.fn();
    render(
      <ProductGrid title="Popular Items" onSeeAllClick={onSeeAllClick}>
        <div>Child</div>
      </ProductGrid>
    );

    const seeAllBtn = screen.getByText('Lihat semua');
    expect(seeAllBtn).toBeInTheDocument();

    fireEvent.click(seeAllBtn);
    expect(onSeeAllClick).toHaveBeenCalled();
  });
});
