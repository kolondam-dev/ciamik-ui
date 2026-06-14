import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Modal } from './Modal';
import { Button } from '../Button';

const meta: Meta<typeof Modal> = {
  title: 'Primitives/Modal',
  component: Modal,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const Default: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Buka Modal</Button>
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Konfirmasi Pesanan"
          onConfirm={() => {
            alert('Pesanan berhasil dibuat!');
            setIsOpen(false);
          }}
          confirmLabel="Buat Pesanan"
        >
          <p style={{ margin: 0 }}>Apakah Anda yakin ingin memproses pesanan ini? Aksi ini tidak dapat dibatalkan setelah pembayaran dikonfirmasi.</p>
        </Modal>
      </>
    );
  },
};

export const Destructive: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button variant="danger" onClick={() => setIsOpen(true)}>Hapus Alamat</Button>
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Hapus Alamat Pengiriman?"
          destructive={true}
          onDestructiveAction={() => {
            alert('Alamat berhasil dihapus!');
            setIsOpen(false);
          }}
          destructiveActionLabel="Ya, Hapus"
        >
          <p style={{ margin: 0 }}>Alamat "Rumah Utama" akan dihapus secara permanen dari daftar alamat pengiriman Anda.</p>
        </Modal>
      </>
    );
  },
};
