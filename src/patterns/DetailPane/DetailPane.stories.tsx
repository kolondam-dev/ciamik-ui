import type { Meta, StoryObj } from '@storybook/react';
import { DetailPane } from './DetailPane';
import { useState } from 'react';
import { Button } from '../../primitives/Button';

const meta: Meta<typeof DetailPane> = {
  title: 'Patterns/DetailPane',
  component: DetailPane,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DetailPane>;

export const Default: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    const [tab, setTab] = useState('details');
    return (
      <div style={{ height: '400px', position: 'relative', overflow: 'hidden', border: '1px solid var(--ciamik-border)' }}>
        <div style={{ padding: '16px' }}>
          <Button onClick={() => setIsOpen(true)}>Buka Detail Pane</Button>
        </div>
        <DetailPane
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Detail Pesanan #1002"
          tabs={[
            { key: 'details', label: 'Info Utama' },
            { key: 'customer', label: 'Pelanggan' },
          ]}
          activeTab={tab}
          onTabChange={setTab}
          hasNavigation={true}
          onPrevRecord={() => alert('Prev record')}
          onNextRecord={() => alert('Next record')}
        >
          {tab === 'details' ? (
            <div>
              <p><strong>Status:</strong> Dikirim</p>
              <p><strong>Kurir:</strong> JNE Express</p>
              <p><strong>Resi:</strong> JP-99887722</p>
            </div>
          ) : (
            <div>
              <p><strong>Nama:</strong> Franky Kolondam</p>
              <p><strong>Alamat:</strong> Jl. Mangga Besar 12, Jakarta</p>
            </div>
          )}
        </DetailPane>
      </div>
    );
  },
};
