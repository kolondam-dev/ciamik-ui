import type { Meta, StoryObj } from '@storybook/react';
import { Sidebar } from './Sidebar';
import { useState } from 'react';
import { House, ShoppingCart, Package, SignOut } from '@phosphor-icons/react';

const meta: Meta<typeof Sidebar> = {
  title: 'Patterns/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

export const Default: Story = {
  render: () => {
    const [collapsed, setCollapsed] = useState(false);
    const [active, setActive] = useState('home');

    const groups = [
      {
        title: 'Menu Utama',
        items: [
          { key: 'home', label: 'Dashboard', icon: <House size={20} />, isActive: active === 'home', onClick: () => setActive('home') },
          { key: 'orders', label: 'Pesanan', icon: <ShoppingCart size={20} />, isActive: active === 'orders', onClick: () => setActive('orders') },
          { key: 'catalog', label: 'Katalog Produk', icon: <Package size={20} />, isActive: active === 'catalog', onClick: () => setActive('catalog') },
        ],
      },
    ];

    return (
      <div style={{ height: '500px', position: 'relative', overflow: 'hidden', border: '1px solid var(--ciamik-border)' }}>
        <Sidebar
          isCollapsed={collapsed}
          onCollapseToggle={() => setCollapsed(!collapsed)}
          groups={groups}
          logo="CIAMIK BO"
          footer={
            <button
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                width: '100%',
                background: 'none',
                border: 'none',
                color: 'inherit',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '13px',
                padding: '4px 0',
              }}
              onClick={() => alert('Logout!')}
            >
              <SignOut size={20} />
              {!collapsed && <span>Keluar</span>}
            </button>
          }
        />
      </div>
    );
  },
};
