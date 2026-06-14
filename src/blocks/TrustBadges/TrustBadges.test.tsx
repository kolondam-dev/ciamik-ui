import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TrustBadges } from './TrustBadges';
import { ShieldCheck } from '@phosphor-icons/react';

describe('TrustBadges', () => {
  it('renders default trust items in expanded layout', () => {
    render(<TrustBadges variant="expanded" />);

    // Verify title is rendered
    expect(screen.getByText('Pembayaran Aman')).toBeInTheDocument();
    expect(screen.getByText('COD Tersedia')).toBeInTheDocument();

    // Verify description is rendered in expanded
    expect(screen.getByText('Transaksi dilindungi enkripsi SSL 256-bit')).toBeInTheDocument();
  });

  it('renders compact layout and hides descriptions', () => {
    render(<TrustBadges variant="compact" />);

    // Verify title is rendered
    expect(screen.getByText('Pembayaran Aman')).toBeInTheDocument();

    // Verify description is NOT rendered in compact
    expect(screen.queryByText('Transaksi dilindungi enkripsi SSL 256-bit')).not.toBeInTheDocument();
  });

  it('renders custom items correctly', () => {
    const customItems = [
      {
        key: 'custom-1',
        icon: <ShieldCheck data-testid="custom-icon" />,
        label: 'Custom Guard Title',
        desc: 'Custom detailed description',
        iconColor: '#ff0000',
      },
    ];

    render(<TrustBadges variant="expanded" items={customItems} />);

    expect(screen.getByText('Custom Guard Title')).toBeInTheDocument();
    expect(screen.getByText('Custom detailed description')).toBeInTheDocument();
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });
});
