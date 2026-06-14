import type { Meta, StoryObj } from '@storybook/react';
import { StatusBadge } from './StatusBadge';
import { ALL_STATUSES } from '../../constants/statusMap';

const meta: Meta<typeof StatusBadge> = {
  title: 'Patterns/StatusBadge',
  component: StatusBadge,
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: { type: 'select' },
      options: ALL_STATUSES,
    },
    hideIcon: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof StatusBadge>;

export const PendingPayment: Story = {
  args: {
    status: 'PENDING_PAYMENT',
  },
};

export const Completed: Story = {
  args: {
    status: 'COMPLETED',
  },
};

export const Cancelled: Story = {
  args: {
    status: 'CANCELLED',
  },
};

export const ReturnRequested: Story = {
  args: {
    status: 'RETURN_REQUESTED',
  },
};
