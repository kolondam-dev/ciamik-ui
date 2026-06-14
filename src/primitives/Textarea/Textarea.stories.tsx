import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from './Textarea';

const meta: Meta<typeof Textarea> = {
  title: 'Primitives/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    helperText: { control: 'text' },
    errorText: { control: 'text' },
    rows: { control: 'number' },
  },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: {
    label: 'Catatan Pengiriman',
    placeholder: 'Contoh: Titipkan di pos satpam depan rumah...',
    helperText: 'Tulis instruksi khusus untuk kurir (maksimal 200 karakter).',
  },
};

export const ErrorState: Story = {
  args: {
    label: 'Alamat Lengkap',
    defaultValue: 'Jl. Merdeka',
    errorText: 'Alamat harus diisi lengkap beserta nomor rumah.',
  },
};

export const DisabledState: Story = {
  args: {
    label: 'Alamat Kantor (Terkunci)',
    defaultValue: 'Gedung Menara Baru, Lt. 12, Kav. 21, Jakarta Selatan',
    disabled: true,
  },
};
