import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DateRangePicker } from './DateRangePicker';

describe('DateRangePicker', () => {
  const mockOnChange = vi.fn();
  const start = new Date(2026, 5, 1); // June 1, 2026
  const end = new Date(2026, 5, 7);   // June 7, 2026

  it('renders correctly with trigger label', () => {
    render(
      <DateRangePicker
        startDate={start}
        endDate={end}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByTestId('datepicker-trigger-btn')).toBeInTheDocument();
  });

  it('toggles dropdown panel on trigger click', () => {
    render(
      <DateRangePicker
        startDate={start}
        endDate={end}
        onChange={mockOnChange}
      />
    );

    const trigger = screen.getByTestId('datepicker-trigger-btn');
    expect(screen.queryByTestId('datepicker-dropdown')).not.toBeInTheDocument();

    fireEvent.click(trigger);
    expect(screen.getByTestId('datepicker-dropdown')).toBeInTheDocument();

    fireEvent.click(trigger);
    expect(screen.queryByTestId('datepicker-dropdown')).not.toBeInTheDocument();
  });

  it('calls onChange with correct values when preset is clicked', () => {
    render(
      <DateRangePicker
        startDate={start}
        endDate={end}
        onChange={mockOnChange}
      />
    );

    fireEvent.click(screen.getByTestId('datepicker-trigger-btn'));
    const todayPresetBtn = screen.getByText('Hari Ini');
    fireEvent.click(todayPresetBtn);

    expect(mockOnChange).toHaveBeenCalled();
  });

  it('renders custom range inputs when custom is clicked', () => {
    render(
      <DateRangePicker
        startDate={start}
        endDate={end}
        onChange={mockOnChange}
      />
    );

    fireEvent.click(screen.getByTestId('datepicker-trigger-btn'));
    fireEvent.click(screen.getByText('Kustom'));

    expect(screen.getByTestId('custom-inputs')).toBeInTheDocument();
  });
});
