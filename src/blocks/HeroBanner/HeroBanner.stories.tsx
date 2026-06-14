import type { Meta, StoryObj } from '@storybook/react';
import { HeroBanner } from './HeroBanner';

const meta: Meta<typeof HeroBanner> = {
  title: 'Blocks/HeroBanner',
  component: HeroBanner,
  decorators: [
    (Story) => (
      <div style={{ padding: '16px', maxWidth: '1000px', margin: '0 auto' }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof HeroBanner>;

const mockSlides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80',
    eyebrow: 'Koleksi Terbaru',
    title: 'Diskon Akhir Pekan Hingga 50%!',
    description: 'Temukan tren fashion terbaru dengan harga terbaik. Gunakan kode voucher CIAMIK50 saat checkout.',
    ctaText: 'Belanja Sekarang',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&q=80',
    eyebrow: 'Elektronik Pilihan',
    title: 'Audio Premium untuk Anda',
    description: 'Dapatkan headphone noise-cancelling wireless berkualitas tinggi untuk produktivitas Anda.',
    ctaText: 'Lihat Detail',
  },
];

export const Default: Story = {
  args: {
    slides: mockSlides,
    autoPlay: true,
    interval: 5000,
  },
};

export const SingleSlide: Story = {
  args: {
    slides: [mockSlides[0]],
    autoPlay: false,
  },
};
