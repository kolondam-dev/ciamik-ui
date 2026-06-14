import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { SystemAlert } from './SystemAlert';

describe('SystemAlert', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders alert when isOpen is true', () => {
    render(
      <SystemAlert isOpen={true} onClose={() => {}} title="Koneksi Bermasalah">
        Silakan cek wifi Anda
      </SystemAlert>
    );

    expect(screen.getByText('Koneksi Bermasalah')).toBeInTheDocument();
    expect(screen.getByText('Silakan cek wifi Anda')).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    render(<SystemAlert isOpen={false} onClose={() => {}} title="Tutup" />);
    expect(screen.queryByText('Tutup')).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(<SystemAlert isOpen={true} onClose={onClose} title="Close Me" />);

    const closeBtn = screen.getByTestId('alert-close-btn');
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose automatically after autoDismissMs', () => {
    const onClose = vi.fn();
    render(<SystemAlert isOpen={true} onClose={onClose} title="Timer Alert" autoDismissMs={1000} />);

    expect(onClose).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(onClose).toHaveBeenCalled();
  });
});
