import { useState, useMemo } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { CiamikProvider } from '../../src/provider/CiamikProvider';
import { Sidebar } from '../../src/patterns/Sidebar/Sidebar';
import { KanbanBoard, KanbanCardType, KanbanColumnType } from '../../src/patterns/KanbanBoard/KanbanBoard';
import { DetailPane } from '../../src/patterns/DetailPane/DetailPane';
import { StatusBadge } from '../../src/patterns/StatusBadge/StatusBadge';
import { Button } from '../../src/primitives/Button/Button';
import { Card } from '../../src/primitives/Card/Card';
import { ViewSwitcher } from '../../src/patterns/ViewSwitcher/ViewSwitcher';
import { DataTable } from '../../src/patterns/DataTable/DataTable';
import { useToast } from '../../src/hooks/useToast';
import { useMediaQuery } from '../../src/hooks/useMediaQuery';
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
  Columns,
} from '@phosphor-icons/react';

const sidebarGroups = [
  {
    title: 'Menu Utama',
    items: [
      { key: 'dashboard', label: 'Dashboard', icon: <House size={18} weight="duotone" /> },
      { key: 'orders', label: 'Pesanan', icon: <ShoppingCart size={18} weight="duotone" /> },
      { key: 'fulfillment', label: 'Fulfillment', icon: <Truck size={18} weight="duotone" />, isActive: true },
      { key: 'catalog', label: 'Katalog', icon: <Tag size={18} weight="duotone" /> },
    ],
  },
  {
    title: 'Lainnya',
    items: [
      { key: 'reports', label: 'Laporan', icon: <ChartBar size={18} weight="duotone" /> },
      { key: 'settings', label: 'Pengaturan', icon: <Gear size={18} weight="duotone" /> },
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
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const [columns, setColumns] = useState<KanbanColumnType[]>(initialColumns);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  // View & Column selector states
  const [activeView, setActiveView] = useState<string>('kanban');
  const [visibleKanbanCols, setVisibleKanbanCols] = useState<string[]>(['PAID', 'PROCESSING', 'PACKED', 'SHIPPED']);
  const [isColumnSelectorOpen, setIsColumnSelectorOpen] = useState(false);

  // Sorting States
  const [sortKey, setSortKey] = useState<string>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

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

  // Flat data for other views
  const flatOrders = useMemo(() => {
    return columns.flatMap((col) =>
      col.cards.map((card) => ({
        id: card.id,
        customer: card.customer,
        itemsCount: card.itemsCount,
        courier: card.courier,
        date: card.date,
        status: col.id,
      }))
    );
  }, [columns]);

  // Sort flat data
  const sortedFlatOrders = useMemo(() => {
    return [...flatOrders].sort((a, b) => {
      let comp = 0;
      if (sortKey === 'id') {
        comp = a.id.localeCompare(b.id);
      } else if (sortKey === 'customer') {
        comp = a.customer.localeCompare(b.customer);
      } else if (sortKey === 'itemsCount') {
        comp = a.itemsCount - b.itemsCount;
      } else if (sortKey === 'courier') {
        comp = a.courier.localeCompare(b.courier);
      } else if (sortKey === 'date') {
        comp = a.date.localeCompare(b.date);
      }
      return sortDirection === 'asc' ? comp : -comp;
    });
  }, [flatOrders, sortKey, sortDirection]);

  // Columns for Kanban mode
  const getKanbanColumnsFulfillment = () => {
    const allCols = [
      { id: 'PAID', title: '📥 Pesanan Baru' },
      { id: 'PROCESSING', title: '⚙️ Diproses' },
      { id: 'PACKED', title: '📦 Siap Dikirim' },
      { id: 'SHIPPED', title: '🚚 Dalam Pengiriman' },
    ];
    return columns
      .filter((col) => visibleKanbanCols.includes(col.id))
      .map((col) => {
        const titleEmoji = allCols.find((x) => x.id === col.id)?.title || col.title;
        return {
          ...col,
          title: titleEmoji,
        };
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
      <div style={{
        flex: 1,
        overflow: 'auto',
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        transition: 'margin-left 0.3s ease, margin-right 0.3s ease',
        marginLeft: isDesktop ? (isCollapsed ? 64 : 240) : 0,
        marginRight: selectedCardId !== null && isDesktop ? 440 : 0,
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
          <div>
            <h1 style={{ font: 'var(--text-h1)', color: 'var(--ciamik-ink)', marginBottom: 4 }}>
              Fulfillment & Logistik
            </h1>
            <p style={{ font: 'var(--text-small)', color: 'var(--ciamik-text-secondary)' }}>
              Lacak alur pengiriman barang secara linear. Tarik dan lepas kartu pesanan untuk memperbarui status pengiriman.
            </p>
          </div>

          {/* View Switcher + Columns Dropdown wrapper */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ViewSwitcher
              activeView={activeView}
              onChange={setActiveView}
              options={[
                { key: 'table', label: 'Tabel' },
                { key: 'list', label: 'List' },
                { key: 'grid', label: 'Cards' },
                { key: 'kanban', label: 'Kanban' },
              ]}
            />
            {activeView === 'kanban' && (
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <Button
                  variant="secondary"
                  onClick={() => setIsColumnSelectorOpen(!isColumnSelectorOpen)}
                  style={{
                    width: 32,
                    height: 32,
                    padding: 0,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  title="Kolom Kanban"
                >
                  <Columns size={16} weight="duotone" />
                </Button>
                {isColumnSelectorOpen && (
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 6px)',
                    right: 0,
                    zIndex: 1000,
                    background: 'white',
                    border: '1px solid var(--ciamik-border)',
                    borderRadius: 'var(--r-lg)',
                    boxShadow: 'var(--sh-lg)',
                    padding: '12px 14px',
                    width: 220,
                  }}>
                    <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8, color: 'var(--ciamik-ink)' }}>
                      Pilih Kolom (Maks 4)
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {[
                        { id: 'PAID', title: 'Pesanan Baru' },
                        { id: 'PROCESSING', title: 'Diproses' },
                        { id: 'PACKED', title: 'Siap Dikirim' },
                        { id: 'SHIPPED', title: 'Dalam Pengiriman' },
                      ].map((col) => {
                        const isChecked = visibleKanbanCols.includes(col.id);
                        return (
                          <label key={col.id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--ciamik-ink)', cursor: 'pointer' }}>
                            <input
                              type="checkbox"
                              checked={isChecked}
                              disabled={!isChecked && visibleKanbanCols.length >= 4}
                              onChange={() => {
                                if (isChecked) {
                                  if (visibleKanbanCols.length > 1) {
                                    setVisibleKanbanCols(visibleKanbanCols.filter(id => id !== col.id));
                                  }
                                } else {
                                  if (visibleKanbanCols.length < 4) {
                                    setVisibleKanbanCols([...visibleKanbanCols, col.id]);
                                  }
                                }
                              }}
                              style={{ cursor: 'pointer' }}
                            />
                            <span>{col.title}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* View renderers */}
        {activeView === 'kanban' && (
          <div style={{ flex: 1, overflow: 'auto' }}>
            <KanbanBoard
              columns={getKanbanColumnsFulfillment()}
              onCardMove={handleCardMove}
              validateMove={validateMove}
              renderCard={renderFulfillmentCard}
            />
          </div>
        )}

        {activeView === 'table' && (
          <DataTable
            columns={[
              { key: 'id', label: 'Order ID', sortable: true },
              { key: 'customer', label: 'Pelanggan', sortable: true },
              { key: 'itemsCount', label: 'Item', sortable: true, render: (row) => <span>{row.itemsCount} Item</span> },
              { key: 'courier', label: 'Kurir', sortable: true },
              { key: 'date', label: 'Tanggal', sortable: true },
              {
                key: 'status',
                label: 'Status',
                render: (row) => <StatusBadge status={row.status} />,
              },
            ]}
            data={sortedFlatOrders}
            keyExtractor={(row) => row.id}
            selectable
            sortKey={sortKey}
            sortDirection={sortDirection}
            onSortChange={(key, dir) => {
              setSortKey(key);
              setSortDirection(dir);
            }}
            onRowClick={(row) => setSelectedCardId(row.id)}
          />
        )}

        {activeView === 'list' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {sortedFlatOrders.length === 0 ? (
              <div style={{ padding: 40, textAlign: 'center', backgroundColor: 'var(--ciamik-surface)', borderRadius: 'var(--r-lg)', color: 'var(--ciamik-text-secondary)' }}>
                Tidak ada data fulfillment.
              </div>
            ) : (
              sortedFlatOrders.map((order) => (
                <div
                  key={order.id}
                  onClick={() => setSelectedCardId(order.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 16,
                    backgroundColor: 'var(--ciamik-surface)',
                    border: '1px solid var(--ciamik-border-faint)',
                    borderRadius: 'var(--r-lg)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--ciamik-primary)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--ciamik-border-faint)'; }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 40,
                      height: 40,
                      borderRadius: 'var(--r-md)',
                      backgroundColor: 'var(--ciamik-bg)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--ciamik-primary)',
                      fontWeight: 'bold'
                    }}>
                      {order.id.slice(-2)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--ciamik-ink)', fontSize: 13 }}>{order.id}</div>
                      <div style={{ fontSize: 11, color: 'var(--ciamik-text-secondary)' }}>
                        {order.customer} · {order.courier}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ textAlign: 'right', marginRight: 12 }}>
                      <div style={{ fontWeight: 700, color: 'var(--ciamik-primary)' }}>{order.itemsCount} item</div>
                      <div style={{ fontSize: 11, color: 'var(--ciamik-text-tertiary)' }}>{order.date}</div>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeView === 'grid' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {sortedFlatOrders.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', padding: 40, textAlign: 'center', backgroundColor: 'var(--ciamik-surface)', borderRadius: 'var(--r-lg)', color: 'var(--ciamik-text-secondary)' }}>
                Tidak ada data fulfillment.
              </div>
            ) : (
              sortedFlatOrders.map((order) => (
                <div
                  key={order.id}
                  onClick={() => setSelectedCardId(order.id)}
                  style={{
                    backgroundColor: 'var(--ciamik-surface)',
                    border: '1px solid var(--ciamik-border-faint)',
                    borderRadius: 'var(--r-lg)',
                    padding: 16,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: 12,
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--ciamik-primary)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--ciamik-border-faint)'; }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, color: 'var(--ciamik-ink)' }}>{order.id}</span>
                    <StatusBadge status={order.status} />
                  </div>
                  <div>
                    <div style={{ font: 'var(--text-body)', fontWeight: 600, color: 'var(--ciamik-ink)' }}>{order.customer}</div>
                    <div style={{ fontSize: 12, color: 'var(--ciamik-text-secondary)', marginTop: 4 }}>
                      {order.date} · {order.courier}
                    </div>
                  </div>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    paddingTop: 12, borderTop: '1px solid var(--ciamik-border-faint)'
                  }}>
                    <span style={{ fontSize: 12, color: 'var(--ciamik-text-tertiary)' }}>{order.itemsCount} item</span>
                    <span style={{ fontWeight: 700, color: 'var(--ciamik-primary)' }}>{order.courier}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Logistics Detail Pane */}
      <DetailPane
        isOpen={selectedCardId !== null}
        onClose={() => setSelectedCardId(null)}
        mode="push"
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
