import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { CiamikProvider } from '../../src/provider/CiamikProvider';
import { Sidebar } from '../../src/patterns/Sidebar/Sidebar';
import { KanbanBoard, KanbanCardType, KanbanColumnType } from '../../src/patterns/KanbanBoard/KanbanBoard';
import { DetailPane } from '../../src/patterns/DetailPane/DetailPane';
import { StatusBadge } from '../../src/patterns/StatusBadge/StatusBadge';
import { Button } from '../../src/primitives/Button/Button';
import { Card } from '../../src/primitives/Card/Card';
import { useToast } from '../../src/hooks/useToast';
import {
  House,
  ShoppingCart,
  Truck,
  Tag,
  ChartBar,
  Gear,
  User,
  MapPin,
  Barcode,
} from '@phosphor-icons/react';

const sidebarGroups = [
  {
    title: 'Menu Utama',
    items: [
      { key: 'dashboard', label: 'Dashboard', icon: <House size={18} /> },
      { key: 'orders', label: 'Pesanan', icon: <ShoppingCart size={18} /> },
      { key: 'fulfillment', label: 'Fulfillment', icon: <Truck size={18} />, isActive: true },
      { key: 'catalog', label: 'Katalog', icon: <Tag size={18} /> },
    ],
  },
  {
    title: 'Lainnya',
    items: [
      { key: 'reports', label: 'Laporan', icon: <ChartBar size={18} /> },
      { key: 'settings', label: 'Pengaturan', icon: <Gear size={18} /> },
    ],
  },
];

const initialColumns: KanbanColumnType[] = [
  {
    id: 'PAID',
    title: '📥 Pesanan Baru',
    cards: [
      { id: 'ORD-2405', title: 'ORD-2405', customer: 'Ahmad Maulana', itemsCount: 3, courier: 'Reguler (JNE)', date: '14 Jun, 15:30' },
      { id: 'ORD-2406', title: 'ORD-2406', customer: 'Siti Rahma', itemsCount: 1, courier: 'Instant (GoSend)', date: '14 Jun, 16:00' },
    ],
  },
  {
    id: 'PROCESSING',
    title: '⚙️ Diproses',
    cards: [
      { id: 'ORD-2403', title: 'ORD-2403', customer: 'Budi Santoso', itemsCount: 2, courier: 'Express (SiCepat)', date: '14 Jun, 11:20' },
    ],
  },
  {
    id: 'PACKED',
    title: '📦 Siap Dikirim',
    cards: [
      { id: 'ORD-2402', title: 'ORD-2402', customer: 'Dewi Lestari', itemsCount: 4, courier: 'Reguler (J&T)', date: '13 Jun, 19:40' },
    ],
  },
  {
    id: 'SHIPPED',
    title: '🚚 Dalam Pengiriman',
    cards: [
      { id: 'ORD-2401', title: 'ORD-2401', customer: 'Rina Kartika', itemsCount: 1, courier: 'Reguler (JNE)', date: '13 Jun, 10:15' },
    ],
  },
];

const FulfillmentShowcase = () => {
  const { toast } = useToast();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [columns, setColumns] = useState<KanbanColumnType[]>(initialColumns);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  // Linear progression order: PAID -> PROCESSING -> PACKED -> SHIPPED
  const columnOrder = ['PAID', 'PROCESSING', 'PACKED', 'SHIPPED'];

  const validateMove = (cardId: string, fromColumnId: string, toColumnId: string): boolean => {
    const fromIndex = columnOrder.indexOf(fromColumnId);
    const toIndex = columnOrder.indexOf(toColumnId);

    // Reject regression or skipping stages
    if (toIndex !== fromIndex + 1) {
      toast(`Gagal memindahkan ${cardId}: Alur status harus berurutan (${fromColumnId} ➔ ${toColumnId} tidak valid).`, 'error');
      return false;
    }
    return true;
  };

  const handleCardMove = (cardId: string, fromColumnId: string, toColumnId: string) => {
    setColumns((prevCols) => {
      // Find card details
      let movingCard: KanbanCardType | undefined;
      const updatedCols = prevCols.map((col) => {
        if (col.id === fromColumnId) {
          movingCard = col.cards.find((c) => c.id === cardId);
          return {
            ...col,
            cards: col.cards.filter((c) => c.id !== cardId),
          };
        }
        return col;
      });

      if (!movingCard) return prevCols;

      // Add to new column
      const result = updatedCols.map((col) => {
        if (col.id === toColumnId) {
          return {
            ...col,
            cards: [...col.cards, movingCard!],
          };
        }
        return col;
      });

      toast(`Status pesanan ${cardId} diperbarui ke ${toColumnId.replace('_', ' ')}!`, 'success');
      return result;
    });
  };

  // Find selected card in all columns
  let selectedCard: KanbanCardType | undefined;
  let selectedColumnId = '';
  for (const col of columns) {
    const found = col.cards.find((c) => c.id === selectedCardId);
    if (found) {
      selectedCard = found;
      selectedColumnId = col.id;
      break;
    }
  }

  const renderFulfillmentCard = (card: KanbanCardType) => (
    <Card
      interactive
      onClick={() => setSelectedCardId(card.id)}
      style={{
        padding: 14,
        marginBottom: 10,
        backgroundColor: 'var(--ciamik-surface)',
        border: '1px solid var(--ciamik-border-faint)',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ font: 'var(--text-small)', fontWeight: 700, color: 'var(--ciamik-primary)' }}>
          {card.id}
        </span>
        <span style={{ font: 'var(--text-caption)', color: 'var(--ciamik-text-tertiary)', fontSize: 10 }}>
          {card.date}
        </span>
      </div>

      <div style={{ font: 'var(--text-body)', fontWeight: 500, color: 'var(--ciamik-ink)' }}>
        {card.customer}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
        <span style={{ font: 'var(--text-caption)', color: 'var(--ciamik-text-secondary)', backgroundColor: 'var(--ciamik-bg)', padding: '2px 6px', borderRadius: 'var(--r-sm)' }}>
          📦 {card.itemsCount} Item
        </span>
        <span style={{ font: 'var(--text-caption)', color: 'var(--ciamik-accent)', fontWeight: 600 }}>
          {card.courier}
        </span>
      </div>
    </Card>
  );

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: 'var(--ciamik-bg)', fontFamily: 'var(--font-family)' }}>
      {/* Sidebar */}
      <Sidebar
        isCollapsed={isCollapsed}
        onCollapseToggle={() => setIsCollapsed(!isCollapsed)}
        groups={sidebarGroups}
        logo={
          <span style={{ font: 'var(--text-h3)', color: 'var(--ciamik-surface)', fontWeight: 700 }}>
            ciamik.id
          </span>
        }
      />

      {/* Main Content Area */}
      <div style={{ flex: 1, overflow: 'auto', padding: 24, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ font: 'var(--text-h1)', color: 'var(--ciamik-ink)', marginBottom: 4 }}>
            Fulfillment & Logistik
          </h1>
          <p style={{ font: 'var(--text-small)', color: 'var(--ciamik-text-secondary)' }}>
            Lacak alur pengiriman barang secara linear. Tarik dan lepas kartu pesanan untuk memperbarui status pengiriman.
          </p>
        </div>

        {/* Board */}
        <div style={{ flex: 1, overflow: 'auto' }}>
          <KanbanBoard
            columns={columns}
            onCardMove={handleCardMove}
            validateMove={validateMove}
            renderCard={renderFulfillmentCard}
          />
        </div>
      </div>

      {/* Logistics Detail Pane */}
      <DetailPane
        isOpen={selectedCardId !== null}
        onClose={() => setSelectedCardId(null)}
        title={selectedCard ? `Fulfillment: ${selectedCard.id}` : ''}
      >
        {selectedCard && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <span style={{ font: 'var(--text-caption)', color: 'var(--ciamik-text-secondary)', display: 'block', marginBottom: 4 }}>
                Status Logistik Saat Ini
              </span>
              <StatusBadge status={selectedColumnId} />
            </div>

            <div style={{ borderTop: '1px solid var(--ciamik-border-faint)', paddingTop: 16 }}>
              <h4 style={{ font: 'var(--text-body)', fontWeight: 600, color: 'var(--ciamik-ink)', marginBottom: 12 }}>
                Informasi Pelanggan
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, font: 'var(--text-small)' }}>
                  <User size={16} color="var(--ciamik-text-secondary)" />
                  <span style={{ color: 'var(--ciamik-ink)', fontWeight: 500 }}>{selectedCard.customer}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, font: 'var(--text-small)' }}>
                  <MapPin size={16} color="var(--ciamik-text-secondary)" style={{ marginTop: 2 }} />
                  <span style={{ color: 'var(--ciamik-text-secondary)' }}>
                    Jl. Sudirman Raya No. 123, Menteng, DKI Jakarta
                  </span>
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--ciamik-border-faint)', paddingTop: 16 }}>
              <h4 style={{ font: 'var(--text-body)', fontWeight: 600, color: 'var(--ciamik-ink)', marginBottom: 12 }}>
                Detail Pengiriman
              </h4>
              <table style={{ width: '100%', font: 'var(--text-small)', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--ciamik-border-faint)' }}>
                    <td style={{ padding: '8px 0', color: 'var(--ciamik-text-secondary)' }}>Ekspedisi</td>
                    <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 600, color: 'var(--ciamik-ink)' }}>{selectedCard.courier}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--ciamik-border-faint)' }}>
                    <td style={{ padding: '8px 0', color: 'var(--ciamik-text-secondary)' }}>No. Resi</td>
                    <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 600, color: 'var(--ciamik-primary)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
                      <Barcode size={16} /> TJNE-102938475
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px 0', color: 'var(--ciamik-text-secondary)' }}>Waktu Order</td>
                    <td style={{ padding: '8px 0', textAlign: 'right', color: 'var(--ciamik-text-secondary)' }}>{selectedCard.date}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style={{ borderTop: '1px solid var(--ciamik-border-faint)', paddingTop: 16, display: 'flex', gap: 12 }}>
              <Button
                variant="secondary"
                onClick={() => {
                  toast(`Resi untuk ${selectedCard?.id} berhasil dicetak!`, 'success');
                }}
                style={{ flex: 1 }}
              >
                Cetak Resi
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  // Auto-advance logic
                  const currentIndex = columnOrder.indexOf(selectedColumnId);
                  if (currentIndex < columnOrder.length - 1) {
                    handleCardMove(selectedCard!.id, selectedColumnId, columnOrder[currentIndex + 1]);
                    setSelectedCardId(null);
                  } else {
                    toast('Pesanan sudah berada di tahap akhir pengiriman.', 'info');
                  }
                }}
                style={{ flex: 1 }}
                disabled={selectedColumnId === 'SHIPPED'}
              >
                Proses Lanjut
              </Button>
            </div>
          </div>
        )}
      </DetailPane>
    </div>
  );
};

const FulfillmentPage = () => {
  return (
    <CiamikProvider>
      <FulfillmentShowcase />
    </CiamikProvider>
  );
};

const meta: Meta = {
  title: 'Showcase/Backoffice Fulfillment',
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj;

export const Desktop: Story = {
  render: () => <FulfillmentPage />,
};
