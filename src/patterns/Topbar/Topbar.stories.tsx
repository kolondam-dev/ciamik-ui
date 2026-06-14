import type { Meta, StoryObj } from '@storybook/react';
import { Topbar } from './Topbar';
import { ShoppingBag, Bell, User } from '@phosphor-icons/react';

const meta: Meta<typeof Topbar> = {
  title: 'Patterns/Topbar',
  component: Topbar,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Topbar>;

export const Storefront: Story = {
  args: {
    leftNode: <span style={{ fontWeight: 800, color: 'var(--ciamik-primary)', fontSize: '18px' }}>CIAMIK STORE</span>,
    centerNode: <input type="text" placeholder="Cari baju, sepatu..." style={{ width: '280px', padding: '6px 12px', borderRadius: 'var(--r-pill)', border: '1px solid var(--ciamik-border)', outline: 'none' }} />,
    rightNode: (
      <div style={{ display: 'flex', gap: '12px', color: 'var(--ciamik-text-secondary)' }}>
        <ShoppingBag size={22} cursor="pointer" />
        <User size={22} cursor="pointer" />
      </div>
    ),
  },
};

export const Backoffice: Story = {
  args: {
    leftNode: <span style={{ fontWeight: 700, fontSize: '15px' }}>Dashboard Analitik</span>,
    rightNode: (
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <Bell size={20} cursor="pointer" style={{ color: 'var(--ciamik-text-secondary)' }} />
        <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--ciamik-primary)', display: 'flex', alignItems: 'center', justifyItems: 'center', color: '#fff', fontWeight: 600, fontSize: '13px', justifyContent: 'center' }}>FK</div>
      </div>
    ),
  },
};
