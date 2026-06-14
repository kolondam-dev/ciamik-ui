import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { CartItem } from './CartItem';

const meta: Meta<typeof CartItem> = {
  title: 'Blocks/CartItem',
  component: CartItem,
  decorators: [
    (Story) => (
      <div style={{ padding: '16px', maxWidth: '360px', backgroundColor: 'var(--ciamik-surface)', borderRadius: '8px', border: '1px solid var(--ciamik-border-faint)' }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CartItem>;

export const Default: Story = {
  args: {
    id: 1,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
    name: 'Sepatu Sneakers Running Ultra',
    variantLabel: 'Hitam, Size 41',
    price: 450000,
    quantity: 1,
    maxQuantity: 5,
  },
};

export const Interactive: React.FC = () => {
  const [qty, setQty] = useState(2);

  return (
    <CartItem
      id={2}
      image="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80"
      name="Kaos Polos Premium 30s Katun Bamboo S-XL"
      variantLabel="Putih, Size L"
      price={89000}
      quantity={qty}
      maxQuantity={10}
      onQuantityChange={(_, newQty) => setQty(newQty)}
      onRemove={(id) => alert(`Remove product ${id} from cart`)}
    />
  );
};
