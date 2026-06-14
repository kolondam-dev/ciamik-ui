import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';
import { Envelope, MagnifyingGlass, Lock } from '@phosphor-icons/react';

const meta: Meta<typeof Input> = {
  title: 'Primitives/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
    label: { control: 'text' },
    helperText: { control: 'text' },
    errorText: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    label: 'Nama Lengkap',
    placeholder: 'Masukkan nama lengkap Anda...',
    helperText: 'Tulis nama sesuai KTP.',
  },
};

export const WithPrefix: Story = {
  args: {
    label: 'Alamat Email',
    placeholder: 'contoh@email.com',
    prefixNode: <Envelope size={18} />,
  },
};

export const Search: Story = {
  args: {
    placeholder: 'Cari produk...',
    prefixNode: <MagnifyingGlass size={18} />,
  },
};

export const Password: Story = {
  args: {
    label: 'Kata Sandi',
    type: 'password',
    placeholder: '••••••••',
    prefixNode: <Lock size={18} />,
    suffixNode: (
      <button
        type="button"
        style={{
          border: 'none',
          background: 'none',
          cursor: 'pointer',
          padding: 0,
          color: 'var(--ciamik-text-secondary)',
          fontSize: '12px',
          fontWeight: 600,
        }}
        onClick={() => alert('Toggle show/hide password')}
      >
        LIHAT
      </button>
    ),
  },
};

export const ErrorState: Story = {
  args: {
    label: 'Nomor Telepon',
    defaultValue: '0812345',
    errorText: 'Nomor telepon minimal 10 digit.',
  },
};

export const DisabledState: Story = {
  args: {
    label: 'ID Transaksi',
    defaultValue: 'TRX-9988776655',
    disabled: true,
  },
};
