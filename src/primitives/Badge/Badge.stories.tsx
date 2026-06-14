import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';

const meta: Meta<typeof Badge> = {
  title: 'Primitives/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['neutral', 'success', 'warning', 'danger', 'info', 'highlight'],
    },
    pill: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: {
    variant: 'neutral',
    children: 'Draft',
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
    children: 'Selesai',
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    children: 'Menunggu',
  },
};

export const Danger: Story = {
  args: {
    variant: 'danger',
    children: 'Batal',
  },
};

export const Info: Story = {
  args: {
    variant: 'info',
    children: 'Diproses',
  },
};

export const Highlight: Story = {
  args: {
    variant: 'highlight',
    children: 'Terbaru',
  },
};

export const PillShape: Story = {
  args: {
    variant: 'success',
    pill: true,
    children: 'Lunas',
  },
};
