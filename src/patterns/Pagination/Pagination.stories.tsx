import type { Meta, StoryObj } from '@storybook/react';
import { Pagination } from './Pagination';
import React from 'react';

const meta: Meta<typeof Pagination> = {
  title: 'Patterns/Pagination',
  component: Pagination,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Pagination>;

export const Numbered: Story = {
  render: (args) => {
    const [page, setPage] = React.useState(2);
    return <Pagination {...args} currentPage={page} onPageChange={setPage} />;
  },
  args: {
    strategy: 'numbered',
    totalPages: 8,
  },
};

export const LoadMore: Story = {
  render: (args) => {
    const [loading, setLoading] = React.useState(false);
    const handleLoadMore = () => {
      setLoading(true);
      setTimeout(() => setLoading(false), 1500);
    };
    return <Pagination {...args} isLoading={loading} onLoadMore={handleLoadMore} />;
  },
  args: {
    strategy: 'load-more',
    hasMore: true,
  },
};
