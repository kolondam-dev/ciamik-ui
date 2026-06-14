import type { Meta, StoryObj } from '@storybook/react';
import { SearchFilterBar } from './SearchFilterBar';
import React from 'react';

const meta: Meta<typeof SearchFilterBar> = {
  title: 'Patterns/SearchFilterBar',
  component: SearchFilterBar,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SearchFilterBar>;

export const Default: Story = {
  render: (args) => {
    const [search, setSearch] = React.useState('');
    const [filter, setFilter] = React.useState('all');
    return (
      <SearchFilterBar
        {...args}
        searchValue={search}
        onSearchChange={setSearch}
        activeFilterKey={filter}
        onFilterKeyChange={setFilter}
      />
    );
  },
  args: {
    placeholder: 'Cari transaksi pesanan...',
    filterOptions: [
      { key: 'all', label: 'Semua Pesanan' },
      { key: 'unpaid', label: 'Belum Bayar' },
      { key: 'processing', label: 'Diproses' },
      { key: 'completed', label: 'Selesai' },
    ],
  },
};
