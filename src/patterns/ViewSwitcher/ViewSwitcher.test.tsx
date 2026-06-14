import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ViewSwitcher } from './ViewSwitcher';

describe('ViewSwitcher', () => {
  it('renders options and handles clicks', () => {
    const onChange = vi.fn();
    render(<ViewSwitcher activeView="table" onChange={onChange} />);

    expect(screen.getByText('Tabel')).toBeInTheDocument();
    expect(screen.getByText('Grid')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Grid'));
    expect(onChange).toHaveBeenCalledWith('grid');
  });

  it('marks active view correctly', () => {
    render(<ViewSwitcher activeView="grid" onChange={() => {}} />);
    const gridBtn = screen.getByRole('tab', { selected: true });
    expect(gridBtn).toHaveTextContent('Grid');
  });
});
