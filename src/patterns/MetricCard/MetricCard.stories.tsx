import type { Meta, StoryObj } from '@storybook/react';
import { MetricCard } from './MetricCard';

const meta: Meta<typeof MetricCard> = {
  title: 'Patterns/MetricCard',
  component: MetricCard,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof MetricCard>;

export const Default: Story = {
  args: {
    title: 'Total Pendapatan',
    value: 'Rp 45.890.000',
    delta: 14.2,
    deltaLabel: 'vs bulan lalu',
  },
};

export const NegativeTrend: Story = {
  args: {
    title: 'Rasio Pembatalan',
    value: '0.85%',
    delta: -4.3,
    deltaLabel: 'vs target',
  },
};

export const WithRecommendation: Story = {
  args: {
    title: 'Produk Terjual',
    value: '1.240 Pcs',
    delta: 8.5,
    deltaLabel: 'vs minggu lalu',
    recommendation: 'Saran: Stok produk A-09 perlu ditambah sebelum Flash Sale besok.',
  },
};
