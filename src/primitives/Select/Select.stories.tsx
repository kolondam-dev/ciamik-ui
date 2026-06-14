import type { Meta, StoryObj } from '@storybook/react';
import { Select } from './Select';

const meta: Meta<typeof Select> = {
  title: 'Primitives/Select',
  component: Select,
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    helperText: { control: 'text' },
    errorText: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {
  render: (args) => (
    <Select {...args}>
      <option value="">Pilih opsi...</option>
      <option value="1">JNE (Reguler)</option>
      <option value="2">J&T (Express)</option>
      <option value="3">GoSend (Instant)</option>
    </Select>
  ),
  args: {
    label: 'Kurir Pengiriman',
    helperText: 'Pilih opsi pengiriman yang tersedia.',
  },
};

export const ErrorState: Story = {
  render: (args) => (
    <Select {...args}>
      <option value="">Pilih metode...</option>
      <option value="1">Transfer Bank</option>
      <option value="2">E-Wallet (OVO/Dana)</option>
    </Select>
  ),
  args: {
    label: 'Metode Pembayaran',
    errorText: 'Metode pembayaran wajib dipilih.',
  },
};

export const DisabledState: Story = {
  render: (args) => (
    <Select {...args}>
      <option value="1">Indonesia</option>
      <option value="2">Malaysia</option>
    </Select>
  ),
  args: {
    label: 'Negara Asal',
    disabled: true,
  },
};
