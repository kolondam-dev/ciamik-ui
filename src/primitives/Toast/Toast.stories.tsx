import type { Meta, StoryObj } from '@storybook/react';
import { ToastProvider, useToastContext } from './ToastContext';
import { Button } from '../Button';

const meta: Meta = {
  title: 'Primitives/Toast',
  decorators: [
    (Story) => (
      <ToastProvider>
        <Story />
      </ToastProvider>
    ),
  ],
  tags: ['autodocs'],
};

export default meta;

export const Demo: StoryObj = {
  render: () => {
    const { toast } = useToastContext();
    return (
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <Button
          variant="secondary"
          onClick={() => toast('Informasi: Sistem berjalan normal.', 'info')}
        >
          Toast Info
        </Button>
        <Button
          variant="primary"
          onClick={() => toast('Sukses: Data berhasil disimpan!', 'success')}
        >
          Toast Sukses
        </Button>
        <Button
          variant="accent"
          onClick={() => toast('Peringatan: Kuota produk menipis!', 'warning')}
        >
          Toast Peringatan
        </Button>
        <Button
          variant="danger"
          onClick={() => toast('Error: Gagal memproses data.', 'error')}
        >
          Toast Error
        </Button>
      </div>
    );
  },
};
