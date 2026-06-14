import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DataTable, DataTableColumn } from './DataTable';

interface TestRow {
  id: number;
  name: string;
  role: string;
}

const columns: DataTableColumn<TestRow>[] = [
  { key: 'name', label: 'Nama', sortable: true },
  { key: 'role', label: 'Peran' },
];

const data: TestRow[] = [
  { id: 1, name: 'Alice', role: 'Admin' },
  { id: 2, name: 'Bob', role: 'Staff' },
];

describe('DataTable', () => {
  it('renders table headers and rows correctly', () => {
    render(
      <DataTable
        columns={columns}
        data={data}
        keyExtractor={(row) => row.id}
      />
    );

    expect(screen.getByText('Nama')).toBeInTheDocument();
    expect(screen.getByText('Peran')).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('triggers sorting callback when header is clicked', () => {
    const onSortChange = vi.fn();
    render(
      <DataTable
        columns={columns}
        data={data}
        keyExtractor={(row) => row.id}
        sortKey="name"
        sortDirection="asc"
        onSortChange={onSortChange}
      />
    );

    const sortHeader = screen.getByText('Nama');
    fireEvent.click(sortHeader);
    expect(onSortChange).toHaveBeenCalledWith('name', 'desc');
  });

  it('shows checkbox selection and bulk action bar when items are selected', () => {
    const onSelectKeysChange = vi.fn();
    render(
      <DataTable
        columns={columns}
        data={data}
        keyExtractor={(row) => row.id}
        selectable={true}
        selectedKeys={[1]}
        onSelectKeysChange={onSelectKeysChange}
        bulkActions={<div>Hapus Masal</div>}
      />
    );

    expect(screen.getByText('1 baris terpilih')).toBeInTheDocument();
    expect(screen.getByText('Hapus Masal')).toBeInTheDocument();

    const checkAllBox = screen.getAllByRole('checkbox')[0];
    fireEvent.click(checkAllBox);
    expect(onSelectKeysChange).toHaveBeenCalled();
  });

  it('shows empty text when data is empty', () => {
    render(
      <DataTable
        columns={columns}
        data={[]}
        keyExtractor={(row) => row.id}
        emptyState={<div>Kosong coy</div>}
      />
    );

    expect(screen.getByText('Kosong coy')).toBeInTheDocument();
  });
});
