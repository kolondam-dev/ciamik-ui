import type { Meta, StoryObj } from '@storybook/react';
import { DataTable } from './DataTable';
import React from 'react';

const meta: Meta<typeof DataTable> = {
  title: 'Patterns/DataTable',
  component: DataTable,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DataTable>;

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: string;
}

const cols = [
  { key: 'name', label: 'Nama Pengguna', sortable: true },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Peran' },
];

const mockUsers: UserRow[] = [
  { id: '1', name: 'Franky Kolondam', email: 'franky@kolondam.dev', role: 'Owner' },
  { id: '2', name: 'Alice Cooper', email: 'alice@rock.com', role: 'Administrator' },
  { id: '3', name: 'Bob Marley', email: 'bob@reggae.org', role: 'Fulfillment Staff' },
];

export const Default: Story = {
  render: (args) => <DataTable {...args} />,
  args: {
    columns: cols,
    data: mockUsers,
    keyExtractor: (row: any) => row.id,
  },
};

export const Selectable: Story = {
  render: (args) => {
    const [selectedKeys, setSelectedKeys] = React.useState<(string | number)[]>(['2']);
    return (
      <DataTable
        {...args}
        selectedKeys={selectedKeys}
        onSelectKeysChange={setSelectedKeys}
      />
    );
  },
  args: {
    columns: cols,
    data: mockUsers,
    keyExtractor: (row: any) => row.id,
    selectable: true,
    bulkActions: <button style={{ background: 'var(--ciamik-danger)', color: '#fff', border: 'none', padding: '4px 12px', borderRadius: '4px', fontWeight: 600, cursor: 'pointer' }} onClick={() => alert('Bulk Delete!')}>Hapus</button>,
  },
};
