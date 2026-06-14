import type { Meta, StoryObj } from '@storybook/react';
import { BottomNav } from './BottomNav';
import { useState } from 'react';
import { House, ShoppingCart, User, Storefront } from '@phosphor-icons/react';

const meta: Meta<typeof BottomNav> = {
  title: 'Patterns/BottomNav',
  component: BottomNav,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof BottomNav>;

export const Default: Story = {
  render: () => {
    const [active, setActive] = useState('home');
    const items = [
      { key: 'home', label: 'Beranda', icon: <House />, isActive: active === 'home', onClick: () => setActive('home') },
      { key: 'shop', label: 'Belanja', icon: <Storefront />, isActive: active === 'shop', onClick: () => setActive('shop') },
      { key: 'cart', label: 'Keranjang', icon: <ShoppingCart />, badgeCount: 4, isActive: active === 'cart', onClick: () => setActive('cart') },
      { key: 'profile', label: 'Akun', icon: <User />, isActive: active === 'profile', onClick: () => setActive('profile') },
    ];

    return (
      <div style={{ position: 'relative', height: '150px', border: '1px solid var(--ciamik-border)', overflow: 'hidden' }}>
        <p style={{ textAlign: 'center', padding: '16px', color: 'var(--ciamik-text-secondary)' }}>Bottom navigation hanya tampil pada perangkat mobile (layar kecil).</p>
        <BottomNav items={items} />
      </div>
    );
  },
};
