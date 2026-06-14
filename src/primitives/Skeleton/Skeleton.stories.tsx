import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton } from './Skeleton';

const meta: Meta<typeof Skeleton> = {
  title: 'Primitives/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['text', 'circle', 'rect', 'card'],
    },
    animated: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Text: Story = {
  args: {
    variant: 'text',
    width: '60%',
  },
};

export const Circle: Story = {
  args: {
    variant: 'circle',
    width: 64,
    height: 64,
  },
};

export const Rectangle: Story = {
  args: {
    variant: 'rect',
    width: '100%',
    height: 150,
  },
};

export const CardMock: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', padding: '16px', border: '1px solid var(--ciamik-border)', borderRadius: 'var(--r-lg)', width: '350px' }}>
      <Skeleton variant="circle" width={50} height={50} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Skeleton variant="text" width="80%" height={16} />
        <Skeleton variant="text" width="50%" height={12} />
        <Skeleton variant="rect" width="100%" height={80} style={{ marginTop: '4px' }} />
      </div>
    </div>
  ),
};
