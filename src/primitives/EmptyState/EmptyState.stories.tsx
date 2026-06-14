import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { EmptyState } from './EmptyState';
import { ShieldWarning } from '@phosphor-icons/react';

const meta: Meta<typeof EmptyState> = {
  title: 'Primitives/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['no-data', 'no-results', 'no-permission', 'no-connection'],
    },
    title: { control: 'text' },
    description: { control: 'text' },
    actionLabel: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const NoData: Story = {
  args: {
    variant: 'no-data',
    actionLabel: 'Tambah Data Baru',
    onAction: () => alert('Action clicked!'),
  },
};

export const NoResults: Story = {
  args: {
    variant: 'no-results',
    actionLabel: 'Reset Pencarian',
    onAction: () => alert('Reset filter clicked!'),
  },
};

export const NoPermission: Story = {
  args: {
    variant: 'no-permission',
    actionLabel: 'Minta Akses',
    onAction: () => alert('Request access clicked!'),
  },
};

export const NoConnection: Story = {
  args: {
    variant: 'no-connection',
    actionLabel: 'Muat Ulang Halaman',
    onAction: () => alert('Reload clicked!'),
  },
};

export const CustomIconAndContent: Story = {
  args: {
    icon: <ShieldWarning size={48} color="var(--ciamik-danger)" />,
    title: 'Keamanan Bermasalah',
    description: 'Sesi Anda telah kedaluwarsa karena alasan keamanan. Silakan masuk kembali.',
    actionLabel: 'Masuk Akun',
    onAction: () => alert('Redirect to login...'),
  },
};
