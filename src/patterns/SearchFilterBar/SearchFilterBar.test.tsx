import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { SearchFilterBar } from './SearchFilterBar';

describe('SearchFilterBar', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders input placeholder and filter chips', () => {
    const filterOptions = [
      { key: 'all', label: 'Semua' },
      { key: 'active', label: 'Aktif' },
    ];

    render(
      <SearchFilterBar
        searchValue=""
        onSearchChange={() => {}}
        placeholder="Cari transaksi..."
        filterOptions={filterOptions}
        activeFilterKey="all"
        onFilterKeyChange={() => {}}
      />
    );

    expect(screen.getByPlaceholderText('Cari transaksi...')).toBeInTheDocument();
    expect(screen.getByText('Semua')).toBeInTheDocument();
    expect(screen.getByText('Aktif')).toBeInTheDocument();
    expect(screen.getByTestId('active-filter-dot')).toBeInTheDocument();
  });

  it('calls onSearchChange with debounced value', () => {
    const onSearchChange = vi.fn();
    render(<SearchFilterBar searchValue="" onSearchChange={onSearchChange} debounceMs={300} />);

    const input = screen.getByPlaceholderText('Cari...');
    fireEvent.change(input, { target: { value: 'kopi' } });

    // Not triggered immediately due to debounce
    expect(onSearchChange).not.toHaveBeenCalled();

    // Fast-forward time
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(onSearchChange).toHaveBeenCalledWith('kopi');
  });

  it('calls onFilterKeyChange when chip is clicked', () => {
    const onFilterKeyChange = vi.fn();
    const filterOptions = [
      { key: 'all', label: 'Semua' },
      { key: 'pending', label: 'Menunggu' },
    ];

    render(
      <SearchFilterBar
        searchValue=""
        onSearchChange={() => {}}
        filterOptions={filterOptions}
        activeFilterKey="all"
        onFilterKeyChange={onFilterKeyChange}
      />
    );

    const pendingChip = screen.getByText('Menunggu');
    fireEvent.click(pendingChip);
    expect(onFilterKeyChange).toHaveBeenCalledWith('pending');
  });

  it('clears search when clear button is clicked', () => {
    const onSearchChange = vi.fn();
    render(<SearchFilterBar searchValue="teh manis" onSearchChange={onSearchChange} />);

    const clearButton = screen.getByTestId('search-clear-btn');
    fireEvent.click(clearButton);

    expect(onSearchChange).toHaveBeenCalledWith('');
  });
});
