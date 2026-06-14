import type { Meta, StoryObj } from '@storybook/react';
import { Spinner } from './Spinner';

const meta: Meta<typeof Spinner> = {
  title: 'Primitives/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    variant: {
      control: { type: 'select' },
      options: ['primary', 'accent', 'neutral', 'current'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Default: Story = {
  args: {
    size: 'md',
    variant: 'primary',
  },
};

export const Accent: Story = {
  args: {
    size: 'md',
    variant: 'accent',
  },
};

export const LargeNeutral: Story = {
  args: {
    size: 'lg',
    variant: 'neutral',
  },
};

export const SmallCurrentColor: Story = {
  render: (args) => (
    <div style={{ color: 'var(--ciamik-danger)', display: 'flex', alignItems: 'center', gap: '8px' }}>
      <Spinner {...args} />
      <span>Loading content...</span>
    </div>
  ),
  args: {
    size: 'sm',
    variant: 'current',
  },
};
