import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Pagination } from './Pagination';

describe('Pagination', () => {
  it('renders numbered pagination and handles clicks', () => {
    const onPageChange = vi.fn();
    render(
      <Pagination
        strategy="numbered"
        currentPage={2}
        totalPages={5}
        onPageChange={onPageChange}
      />
    );

    expect(screen.getByText('2')).toHaveClass(/activePageBtn/);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();

    fireEvent.click(screen.getByText('3'));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it('disables previous button on first page', () => {
    render(<Pagination strategy="numbered" currentPage={1} totalPages={3} />);
    const prevButton = screen.getByRole('button', { name: /halaman sebelumnya/i });
    expect(prevButton).toBeDisabled();
  });

  it('renders load-more button and handles clicks', () => {
    const onLoadMore = vi.fn();
    render(
      <Pagination
        strategy="load-more"
        hasMore={true}
        onLoadMore={onLoadMore}
        isLoading={false}
      />
    );

    const loadMoreBtn = screen.getByRole('button', { name: /muat lebih banyak/i });
    expect(loadMoreBtn).toBeInTheDocument();
    fireEvent.click(loadMoreBtn);
    expect(onLoadMore).toHaveBeenCalled();
  });
});
