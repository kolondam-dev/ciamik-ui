import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusBadge } from './StatusBadge';

describe('StatusBadge', () => {
  it('renders correct label for status', () => {
    render(<StatusBadge status="PENDING_PAYMENT" />);
    expect(screen.getByText('Menunggu bayar')).toBeInTheDocument();
  });

  it('renders icon by default', () => {
    render(<StatusBadge status="COMPLETED" />);
    expect(screen.getByTestId('status-badge-icon')).toBeInTheDocument();
  });

  it('hides icon when hideIcon is true', () => {
    render(<StatusBadge status="COMPLETED" hideIcon={true} />);
    expect(screen.queryByTestId('status-badge-icon')).not.toBeInTheDocument();
  });

  it('renders fallback for unknown statuses', () => {
    render(<StatusBadge status={"UNKNOWN_STATE" as any} />);
    expect(screen.getByText('UNKNOWN_STATE')).toBeInTheDocument();
  });
});
