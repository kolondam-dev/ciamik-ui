import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Sheet } from './Sheet';
import { Button } from '../Button';

const meta: Meta<typeof Sheet> = {
  title: 'Primitives/Sheet',
  component: Sheet,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Sheet>;

export const Default: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Buka Bottom Sheet</Button>
        <Sheet
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Detail Produk"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ margin: 0 }}>
              Ini adalah konten di dalam Bottom Sheet. Di platform mobile, komponen ini sangat ideal untuk menampilkan pilihan varian, detail keranjang belanja, atau informasi pengiriman.
            </p>
            <p style={{ margin: 0, color: 'var(--ciamik-text-tertiary)', fontSize: '13px' }}>
              * Seret/drag handle abu-abu di atas ke arah bawah untuk menutup sheet ini secara intuitif.
            </p>
            <Button variant="primary" onClick={() => setIsOpen(false)}>
              Selesai & Tutup
            </Button>
          </div>
        </Sheet>
      </>
    );
  },
};
