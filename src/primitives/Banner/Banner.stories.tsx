import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Banner } from './Banner';

const meta: Meta<typeof Banner> = {
  title: 'Primitives/Banner',
  component: Banner,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['success', 'warning', 'danger', 'info'],
    },
    isClosable: { control: 'boolean' },
    title: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof Banner>;

export const Info: Story = {
  args: {
    variant: 'info',
    title: 'Pembaruan Sistem',
    children: 'Sistem akan mengalami pemeliharaan rutin pada hari Minggu pukul 02:00 WIB.',
    isClosable: true,
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
    title: 'Pembayaran Berhasil',
    children: 'Terima kasih, pembayaran untuk pesanan #109283 telah berhasil kami terima.',
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    title: 'Stok Terbatas',
    children: 'Tinggal 2 produk tersisa di keranjang Anda. Selesaikan transaksi segera.',
    isClosable: true,
  },
};

export const Danger: Story = {
  args: {
    variant: 'danger',
    title: 'Gagal Menghubungkan',
    children: 'Tidak dapat menyinkronkan data katalog. Coba muat ulang beberapa saat lagi.',
    isClosable: true,
  },
};
