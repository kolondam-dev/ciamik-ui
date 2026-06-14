import type { Meta, StoryObj } from '@storybook/react';
import { ViewSwitcher } from './ViewSwitcher';
import React from 'react';

const meta: Meta<typeof ViewSwitcher> = {
  title: 'Patterns/ViewSwitcher',
  component: ViewSwitcher,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ViewSwitcher>;

export const Default: Story = {
  render: (args) => {
    const [view, setView] = React.useState('table');
    return <ViewSwitcher {...args} activeView={view} onChange={setView} />;
  },
  args: {
    options: [
      { key: 'table', label: 'Tabel' },
      { key: 'grid', label: 'Grid' },
      { key: 'kanban', label: 'Kanban' },
    ],
  },
};
