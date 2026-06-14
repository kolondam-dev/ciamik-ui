import type { Meta, StoryObj } from '@storybook/react';
import { ProductGrid } from './ProductGrid';
import { ProductCard } from '../ProductCard/ProductCard';

const meta: Meta<typeof ProductGrid> = {
  title: 'Blocks/ProductGrid',
  component: ProductGrid,
  decorators: [
    (Story) => (
      <div style={{ padding: '24px', backgroundColor: 'var(--ciamik-bg)', minHeight: '100vh' }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ProductGrid>;

export const Default: Story = {
  render: (args) => (
    <ProductGrid {...args}>
      <ProductCard
        id={1}
        image="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80"
        name="Sepatu Sneakers Running Ultra"
        category="Fashion"
        rating={4.8}
        soldCount={340}
        price={450000}
        badges={[{ type: 'free', text: '🚚 Bebas Ongkir' }]}
      />
      <ProductCard
        id={2}
        image="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80"
        name="Kaos Polos Premium 30s Katun"
        category="Fashion"
        rating={4.9}
        soldCount={1500}
        price={89000}
        originalPrice={127000}
        discountPercent={30}
        badges={[
          { type: 'flash', text: '⚡ Flash Sale' },
          { type: 'discount', text: '🎁 Hemat 30%' }
        ]}
      />
      <ProductCard
        id={3}
        image="https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&q=80"
        name="Wireless Headphone Noise Cancel"
        category="Elektronik"
        rating={4.7}
        soldCount={85}
        price={1200000}
        badges={[{ type: 'instant', text: '🚀 Instan' }]}
      />
      <ProductCard
        id={4}
        image="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80"
        name="Smart Watch Fitness Tracker Pro"
        category="Elektronik"
        rating={4.6}
        soldCount={340}
        price={890000}
        stock={2}
      />
    </ProductGrid>
  ),
  args: {
    title: 'Rekomendasi Produk',
    seeAllHref: '#katalog',
  },
};
