import type { Meta, StoryObj } from '@storybook/react';
import { SystemAlert } from './SystemAlert';
import { useState } from 'react';
import { Button } from '../../primitives/Button';

const meta: Meta<typeof SystemAlert> = {
  title: 'Patterns/SystemAlert',
  component: SystemAlert,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SystemAlert>;

export const Default: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Buka System Alert</Button>
        <SystemAlert
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          variant="warning"
          title="Pemeliharaan Server"
          autoDismissMs={4000}
        >
          Sistem akan offline sementara selama 5 menit. Alert ini akan hilang otomatis dalam 4 detik.
        </SystemAlert>
      </>
    );
  },
};
