import type { Meta, StoryObj } from '@storybook/react';
import { OTPFlow } from './OTPFlow';

const meta: Meta<typeof OTPFlow> = {
  title: 'Blocks/OTPFlow',
  component: OTPFlow,
  decorators: [
    (Story) => (
      <div style={{ padding: '24px', display: 'flex', justifyContent: 'center', backgroundColor: 'var(--ciamik-bg)', minHeight: '350px' }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof OTPFlow>;

export const Default: Story = {
  args: {
    initialPhone: '',
    onSendOTP: (phone) => {
      console.log('Sending OTP to', phone);
      return new Promise((resolve) => setTimeout(() => resolve(true), 1000));
    },
    onVerifyOTP: (code) => {
      console.log('Verifying code', code);
      return new Promise((resolve) => setTimeout(() => resolve(code === '1234'), 1000));
    },
    onSuccess: () => alert('OTP Verified Successfully!'),
    onCancel: () => alert('OTP Cancelled'),
  },
};
