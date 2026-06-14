import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MetricCard } from './MetricCard';

describe('MetricCard', () => {
  it('renders title and value', () => {
    render(<MetricCard title="Total Penjualan" value="Rp 12.500.000" />);
    expect(screen.getByText('Total Penjualan')).toBeInTheDocument();
    expect(screen.getByText('Rp 12.500.000')).toBeInTheDocument();
  });

  it('renders positive delta correctly', () => {
    render(<MetricCard title="Pengunjung" value={1420} delta={12.4} deltaLabel="vs minggu lalu" />);
    expect(screen.getByText('12.4%')).toBeInTheDocument();
    expect(screen.getByText('vs minggu lalu')).toBeInTheDocument();
  });

  it('renders recommendation if provided', () => {
    render(
      <MetricCard
        title="Konversi"
        value="2.4%"
        recommendation="Saran: Naikkan promo diskon untuk memicu checkout rate."
      />
    );
    expect(screen.getByText('Saran: Naikkan promo diskon untuk memicu checkout rate.')).toBeInTheDocument();
  });
});
