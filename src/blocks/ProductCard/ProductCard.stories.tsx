import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ProductCard } from './ProductCard';

const meta: Meta<typeof ProductCard> = {
  title: 'Blocks/ProductCard',
  component: ProductCard,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '280px', padding: '16px', backgroundColor: 'var(--ciamik-bg)' }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ProductCard>;

export const Default: Story = {
  args: {
    id: 1,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
    name: 'Sepatu Sneakers Running Ultra Ringan',
    category: 'Fashion',
    rating: 4.8,
    soldCount: 340,
    price: 450000,
    stock: 10,
    badges: [
      { type: 'free', text: '🚚 Bebas Ongkir' },
      { type: 'instant', text: '🚀 Instan' },
    ],
  },
};

export const Discounted: Story = {
  args: {
    id: 2,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80',
    name: 'Kaos Polos Premium 30s Katun Bamboo S-XL',
    category: 'Fashion',
    rating: 4.9,
    soldCount: 1520,
    price: 89000,
    originalPrice: 127000,
    discountPercent: 30,
    stock: 25,
    badges: [
      { type: 'flash', text: '⚡ Flash Sale' },
      { type: 'discount', text: '🎁 Hemat 30%' },
      { type: 'free', text: '🚚 Bebas Ongkir' },
    ],
  },
};

export const LowStock: Story = {
  args: {
    id: 3,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80',
    name: 'Smart Watch Fitness Tracker Pro 44mm Active',
    category: 'Elektronik',
    rating: 4.6,
    soldCount: 340,
    price: 890000,
    originalPrice: 1200000,
    discountPercent: 26,
    stock: 2,
    badges: [
      { type: 'instant', text: '🚀 Instan' },
    ],
  },
};

export const OutOfStock: Story = {
  args: {
    id: 4,
    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=400&q=80',
    name: 'Jaket Denim Vintage Washed Classic fit',
    category: 'Fashion',
    rating: 4.7,
    soldCount: 180,
    price: 399000,
    stock: 0,
  },
};

// Interactive state wrapper for cart/wishlist toggling
export const Interactive: React.FC = () => {
  const [cartQty, setCartQty] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  return (
    <ProductCard
      id={5}
      image="https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400&q=80"
      name="Keyboard Mechanical RGB 75% Gateron Brown"
      category="Elektronik"
      rating={4.9}
      soldCount={205}
      price={750000}
      originalPrice={950000}
      discountPercent={21}
      stock={5}
      cartQty={cartQty}
      isWishlisted={isLiked}
      badges={[
        { type: 'free', text: '🚚 Bebas Ongkir' },
        { type: 'instant', text: '🚀 Instan' },
      ]}
      onAddToCart={() => setCartQty(1)}
      onUpdateCartQty={(_, qty) => setCartQty(qty)}
      onWishlistToggle={() => setIsLiked(!isLiked)}
    />
  );
};
