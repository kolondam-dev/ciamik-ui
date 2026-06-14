import type { Meta, StoryObj } from '@storybook/react';
import { TrustBadges } from './TrustBadges';

const meta: Meta<typeof TrustBadges> = {
  title: 'Blocks/TrustBadges',
  component: TrustBadges,
  decorators: [
    (Story) => (
      <div style={{ padding: '24px', backgroundColor: 'var(--ciamik-bg)', maxWidth: '800px', borderRadius: '8px' }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TrustBadges>;

export const Expanded: Story = {
  args: {
    variant: 'expanded',
  },
};

export const Compact: Story = {
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '240px', padding: '16px', backgroundColor: 'var(--ciamik-surface)', border: '1px solid var(--ciamik-border-faint)', borderRadius: '8px' }}>
        <Story />
      </div>
    ),
  ],
  args: {
    variant: 'compact',
  },
};
