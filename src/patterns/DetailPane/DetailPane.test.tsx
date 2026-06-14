import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DetailPane } from './DetailPane';

const tabs = [
  { key: 'details', label: 'Rincian' },
  { key: 'history', label: 'Riwayat' },
];

describe('DetailPane', () => {
  it('renders title, content, and tabs when open', () => {
    const onTabChange = vi.fn();
    render(
      <DetailPane
        isOpen={true}
        onClose={() => {}}
        title="Detail Transaksi"
        tabs={tabs}
        activeTab="details"
        onTabChange={onTabChange}
      >
        Konten Transaksi
      </DetailPane>
    );

    expect(screen.getByText('Detail Transaksi')).toBeInTheDocument();
    expect(screen.getByText('Konten Transaksi')).toBeInTheDocument();
    expect(screen.getByText('Rincian')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Riwayat'));
    expect(onTabChange).toHaveBeenCalledWith('history');
  });

  it('handles prev and next record navigation', () => {
    const onPrev = vi.fn();
    const onNext = vi.fn();

    render(
      <DetailPane
        isOpen={true}
        onClose={() => {}}
        title="Detail"
        hasNavigation={true}
        onPrevRecord={onPrev}
        onNextRecord={onNext}
        prevDisabled={false}
        nextDisabled={true}
      >
        Konten
      </DetailPane>
    );

    const prevBtn = screen.getByTestId('pane-prev-btn');
    const nextBtn = screen.getByTestId('pane-next-btn');

    expect(prevBtn).toBeEnabled();
    expect(nextBtn).toBeDisabled();

    fireEvent.click(prevBtn);
    expect(onPrev).toHaveBeenCalled();
  });
});
