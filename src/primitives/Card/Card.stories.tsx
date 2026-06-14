import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';
import { Button } from '../Button';

const meta: Meta<typeof Card> = {
  title: 'Primitives/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    interactive: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    children: 'Ini adalah isi konten default dari sebuah Card component. Memiliki border faint dan padding standar.',
  },
};

export const WithHeaderAndFooter: Story = {
  args: {
    header: 'Informasi Merchant',
    children: 'Merchant Toko Ciamik berlokasi di Jakarta Selatan, dengan rating performa layanan pengiriman yang sangat baik.',
    footer: (
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
        <Button variant="secondary" size="sm">Batal</Button>
        <Button variant="primary" size="sm">Hubungi</Button>
      </div>
    ),
  },
};

export const Interactive: Story = {
  args: {
    interactive: true,
    header: 'Klik Saya',
    children: 'Card interactive akan menampilkan bayangan (shadow) dan sedikit naik ke atas (translate-y) saat kursor diarahkan (hover) ke atasnya.',
  },
};
