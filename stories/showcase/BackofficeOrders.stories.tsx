import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Sidebar } from '../../src/patterns/Sidebar/Sidebar';
import { SearchFilterBar } from '../../src/patterns/SearchFilterBar/SearchFilterBar';
import { DataTable } from '../../src/patterns/DataTable/DataTable';
import { StatusBadge } from '../../src/patterns/StatusBadge/StatusBadge';
import { DetailPane } from '../../src/patterns/DetailPane/DetailPane';
import { Select } from '../../src/primitives/Select/Select';
import { Button } from '../../src/primitives/Button/Button';
import {
  House,
  ShoppingCart,
  Truck,
  Tag,
  ChartBar,
  Gear,
  User,
  MapPin,
  Clock,
  Circle,
} from '@phosphor-icons/react';

const sidebarGroups = [
  {
    title: 'Menu Utama',
    items: [
      { key: 'dashboard', label: 'Dashboard', icon: <House size={18} /> },
      { key: 'orders', label: 'Pesanan', icon: <ShoppingCart size={18} />, isActive: true },
      { key: 'fulfillment', label: 'Fulfillment', icon: <Truck size={18} /> },
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

const initialOrders = [
  {
    id: 'ORD-2401',
    customer: 'Ahmad Maulana',
    email: 'ahmad.maulana@gmail.com',
    phone: '+62 812 3456 7890',
    address: 'Jl. Sudirman No. 123, Menteng, Jakarta Pusat',
    total: 539000,
    status: 'PROCESSING' as const,
    date: '14 Jun 2026',
    courier: 'Reguler (JNE)',
    items: [
      { name: 'Sepatu Sneakers Running Ultra Boost', qty: 1, price: 450000 },
      { name: 'Kaos Polos Premium 30s Katun', qty: 2, price: 89000 },
    ],
    timeline: [
      { status: 'PAID', time: '14 Jun 2026, 10:15', label: 'Pembayaran diterima' },
      { status: 'PENDING_PAYMENT', time: '14 Jun 2026, 10:00', label: 'Pesanan dibuat oleh pembeli' },
    ],
  },
  {
    id: 'ORD-2400',
    customer: 'Siti Rahmawati',
    email: 'siti.rahma@yahoo.com',
    phone: '+62 878 9912 3345',
    address: 'Jl. Diponegoro No. 45, Bandung, Jawa Barat',
    total: 178000,
    status: 'SHIPPED' as const,
    date: '14 Jun 2026',
    courier: 'Express (SiCepat)',
    items: [
      { name: 'Kaos Polos Premium 30s Katun', qty: 2, price: 89000 },
    ],
    timeline: [
      { status: 'SHIPPED', time: '14 Jun 2026, 14:00', label: 'Paket diserahkan ke kurir' },
      { status: 'PACKED', time: '14 Jun 2026, 11:30', label: 'Pesanan telah dikemas' },
      { status: 'PAID', time: '14 Jun 2026, 09:20', label: 'Pembayaran diterima' },
      { status: 'PENDING_PAYMENT', time: '14 Jun 2026, 09:10', label: 'Pesanan dibuat oleh pembeli' },
    ],
  },
  {
    id: 'ORD-2399',
    customer: 'Budi Santoso',
    email: 'budi_s@outlook.com',
    phone: '+62 821 1144 5566',
    address: 'Apartemen Sudirman Tower A/12, Jakarta Selatan',
    total: 1200000,
    status: 'PENDING_PAYMENT' as const,
    date: '13 Jun 2026',
    courier: 'Instant (GoSend)',
    items: [
      { name: 'Wireless Headphone Noise Cancel Pro X2', qty: 1, price: 1200000 },
    ],
    timeline: [
      { status: 'PENDING_PAYMENT', time: '13 Jun 2026, 21:45', label: 'Menunggu pembayaran dari pembeli' },
    ],
  },
  {
    id: 'ORD-2398',
    customer: 'Dewi Lestari',
    email: 'dewi.lestari@gmail.com',
    phone: '+62 813 8899 0011',
    address: 'Griya Indah Blok C/10, Depok, Jawa Barat',
    total: 89000,
    status: 'COMPLETED' as const,
    date: '13 Jun 2026',
    courier: 'Reguler (JNT)',
    items: [
      { name: 'Kaos Polos Premium 30s Katun', qty: 1, price: 89000 },
    ],
    timeline: [
      { status: 'COMPLETED', time: '13 Jun 2026, 18:00', label: 'Pesanan telah selesai diterima pembeli' },
      { status: 'DELIVERED', time: '13 Jun 2026, 15:30', label: 'Kurir mengonfirmasi paket sampai tujuan' },
      { status: 'SHIPPED', time: '12 Jun 2026, 10:00', label: 'Paket diserahkan ke kurir' },
      { status: 'PACKED', time: '12 Jun 2026, 08:30', label: 'Pesanan telah dikemas' },
      { status: 'PAID', time: '11 Jun 2026, 19:40', label: 'Pembayaran diterima' },
    ],
  },
  {
    id: 'ORD-2397',
    customer: 'Rina Kartika',
    email: 'rina.k@gmail.com',
    phone: '+62 855 7788 9900',
    address: 'Perum Harapan Baru No. 8, Bekasi, Jawa Barat',
    total: 385000,
    status: 'DELIVERED' as const,
    date: '12 Jun 2026',
    courier: 'Reguler (SiCepat)',
    items: [
      { name: 'Parfum Homme Classic Wood Edition 100ml', qty: 1, price: 385000 },
    ],
    timeline: [
      { status: 'DELIVERED', time: '12 Jun 2026, 17:00', label: 'Kurir mengonfirmasi paket sampai tujuan' },
      { status: 'SHIPPED', time: '11 Jun 2026, 11:00', label: 'Paket diserahkan ke kurir' },
      { status: 'PACKED', time: '11 Jun 2026, 09:00', label: 'Pesanan telah dikemas' },
      { status: 'PAID', time: '10 Jun 2026, 14:15', label: 'Pembayaran diterima' },
    ],
  },
];

const filterOptions = [
  { key: 'all', label: 'Semua' },
  { key: 'PENDING_PAYMENT', label: 'Menunggu Bayar' },
  { key: 'PROCESSING', label: 'Diproses' },
  { key: 'SHIPPED', label: 'Dikirim' },
  { key: 'DELIVERED', label: 'Sampai' },
  { key: 'COMPLETED', label: 'Selesai' },
];

const OrdersShowcase = () => {
  const [orders, setOrders] = useState(initialOrders);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [detailTab, setDetailTab] = useState('detail');

  // Filter orders based on search and active tab filter
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchValue.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchValue.toLowerCase());
    const matchesFilter = activeFilter === 'all' || order.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const selectedOrder = orders.find((o) => o.id === selectedOrderId);
  const selectedIndex = filteredOrders.findIndex((o) => o.id === selectedOrderId);

  // Status options for select dropdown in detail panel
  const statusOptions = [
    { value: 'PENDING_PAYMENT', label: 'Menunggu bayar' },
    { value: 'PAID', label: 'Dibayar' },
    { value: 'PROCESSING', label: 'Diproses' },
    { value: 'PACKED', label: 'Dikemas' },
    { value: 'SHIPPED', label: 'Dikirim' },
    { value: 'DELIVERED', label: 'Sampai' },
    { value: 'COMPLETED', label: 'Selesai' },
    { value: 'CANCELLED', label: 'Dibatalkan' },
  ];

  const handleStatusChange = (newStatus: string) => {
    if (!selectedOrderId) return;
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === selectedOrderId) {
          const nowStr = new Date().toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          }) + `, ${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`;
          
          return {
            ...o,
            status: newStatus as any,
            timeline: [
              { status: newStatus, time: nowStr, label: `Status diperbarui ke ${newStatus}` },
              ...o.timeline,
            ],
          };
        }
        return o;
      })
    );
  };

  const handleNextRecord = () => {
    if (selectedIndex < filteredOrders.length - 1) {
      setSelectedOrderId(filteredOrders[selectedIndex + 1].id);
    }
  };

  const handlePrevRecord = () => {
    if (selectedIndex > 0) {
      setSelectedOrderId(filteredOrders[selectedIndex - 1].id);
    }
  };

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
      <div style={{ flex: 1, overflow: 'auto', padding: 24, transition: 'all 0.3s ease' }}>
        {/* Page Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <div>
            <h1 style={{ font: 'var(--text-h1)', color: 'var(--ciamik-ink)', marginBottom: 4 }}>
              Manajemen Pesanan
            </h1>
            <p style={{ font: 'var(--text-small)', color: 'var(--ciamik-text-secondary)' }}>
              Kelola pesanan masuk, proses pengemasan, dan lacak status pengiriman pelanggan.
            </p>
          </div>
          <Button variant="primary">
            + Pesanan Baru
          </Button>
        </div>

        {/* Filter Toolbar */}
        <div style={{ marginBottom: 16 }}>
          <SearchFilterBar
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            placeholder="Cari ID pesanan atau nama pelanggan..."
            filterOptions={filterOptions}
            activeFilterKey={activeFilter}
            onFilterKeyChange={setActiveFilter}
          />
        </div>

        {/* Data Table */}
        <DataTable
          columns={[
            { key: 'id', label: 'Order ID' },
            { key: 'date', label: 'Tanggal' },
            { key: 'customer', label: 'Pelanggan' },
            {
              key: 'total',
              label: 'Total Tagihan',
              render: (row) => <span className="tabnum">Rp {row.total.toLocaleString('id-ID')}</span>,
            },
            {
              key: 'status',
              label: 'Status',
              render: (row) => <StatusBadge status={row.status} />,
            },
            {
              key: 'action',
              label: 'Aksi',
              render: (row) => (
                <button
                  onClick={() => setSelectedOrderId(row.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--ciamik-primary)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    font: 'var(--text-caption)',
                  }}
                >
                  Detail
                </button>
              ),
            },
          ]}
          data={filteredOrders}
          keyExtractor={(row) => row.id}
          selectable
        />
      </div>

      {/* Order Detail Pane */}
      <DetailPane
        isOpen={selectedOrderId !== null}
        onClose={() => setSelectedOrderId(null)}
        title={selectedOrder ? `Detail Pesanan: ${selectedOrder.id}` : ''}
        hasNavigation={true}
        onNextRecord={handleNextRecord}
        onPrevRecord={handlePrevRecord}
        prevDisabled={selectedIndex <= 0}
        nextDisabled={selectedIndex >= filteredOrders.length - 1}
        tabs={[
          { key: 'detail', label: 'Informasi Pesanan' },
          { key: 'activity', label: 'Timeline Status' },
        ]}
        activeTab={detailTab}
        onTabChange={setDetailTab}
      >
        {selectedOrder && (
          <div>
            {detailTab === 'detail' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Status Section */}
                <div style={{
                  padding: 16,
                  backgroundColor: 'var(--ciamik-bg)',
                  borderRadius: 'var(--r-md)',
                  border: '1px solid var(--ciamik-border-faint)',
                }}>
                  <div style={{ font: 'var(--text-caption)', color: 'var(--ciamik-text-secondary)', marginBottom: 8, fontWeight: 600 }}>
                    Perbarui Status Pesanan
                  </div>
                  <Select
                    value={selectedOrder.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                  >
                    {statusOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </Select>
                </div>

                {/* Customer Information */}
                <div>
                  <h4 style={{ font: 'var(--text-body)', fontWeight: 600, color: 'var(--ciamik-ink)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <User size={16} /> Pelanggan
                  </h4>
                  <div style={{ font: 'var(--text-small)', color: 'var(--ciamik-ink)', fontWeight: 600 }}>
                    {selectedOrder.customer}
                  </div>
                  <div style={{ font: 'var(--text-caption)', color: 'var(--ciamik-text-secondary)' }}>
                    {selectedOrder.email} · {selectedOrder.phone}
                  </div>
                </div>

                {/* Shipping Address */}
                <div>
                  <h4 style={{ font: 'var(--text-body)', fontWeight: 600, color: 'var(--ciamik-ink)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <MapPin size={16} /> Alamat Pengiriman
                  </h4>
                  <div style={{ font: 'var(--text-small)', color: 'var(--ciamik-text-secondary)' }}>
                    {selectedOrder.address}
                  </div>
                  <div style={{ font: 'var(--text-caption)', color: 'var(--ciamik-text-tertiary)', marginTop: 4 }}>
                    Kurir: <strong>{selectedOrder.courier}</strong>
                  </div>
                </div>

                {/* Ordered Items */}
                <div>
                  <h4 style={{ font: 'var(--text-body)', fontWeight: 600, color: 'var(--ciamik-ink)', marginBottom: 8 }}>
                    Produk Dibeli ({selectedOrder.items.length})
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '8px 12px',
                        backgroundColor: 'var(--ciamik-bg)',
                        borderRadius: 'var(--r-sm)',
                        font: 'var(--text-small)',
                      }}>
                        <div style={{ flex: 1, paddingRight: 16 }}>
                          <div style={{ color: 'var(--ciamik-ink)', fontWeight: 500 }}>{item.name}</div>
                          <div style={{ color: 'var(--ciamik-text-secondary)', fontSize: 11 }}>
                            Rp {item.price.toLocaleString('id-ID')} x {item.qty}
                          </div>
                        </div>
                        <div style={{ color: 'var(--ciamik-ink)', fontWeight: 600 }} className="tabnum">
                          Rp {(item.price * item.qty).toLocaleString('id-ID')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total Invoice */}
                <div style={{
                  paddingTop: 12,
                  borderTop: '1px solid var(--ciamik-border-faint)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                }}>
                  <span style={{ font: 'var(--text-body)', fontWeight: 600, color: 'var(--ciamik-ink)' }}>Total Tagihan</span>
                  <span style={{ font: 'var(--text-h2)', color: 'var(--ciamik-primary)', fontWeight: 850 }} className="tabnum">
                    Rp {selectedOrder.total.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            ) : (
              /* Timeline Logs */
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingLeft: 8 }}>
                {selectedOrder.timeline.map((log, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: 12, position: 'relative' }}>
                    {idx !== selectedOrder.timeline.length - 1 && (
                      <div style={{
                        position: 'absolute',
                        left: 6,
                        top: 16,
                        bottom: -16,
                        width: 2,
                        backgroundColor: 'var(--ciamik-border-faint)',
                      }} />
                    )}
                    <div style={{ marginTop: 2, zIndex: 1, color: idx === 0 ? 'var(--ciamik-primary)' : 'var(--ciamik-text-tertiary)' }}>
                      <Circle size={14} weight={idx === 0 ? 'fill' : 'regular'} />
                    </div>
                    <div>
                      <div style={{ font: 'var(--text-small)', fontWeight: 600, color: 'var(--ciamik-ink)' }}>
                        {log.label}
                      </div>
                      <div style={{ font: 'var(--text-caption)', color: 'var(--ciamik-text-secondary)', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                        <Clock size={12} /> {log.time}
                      </div>
                      <div style={{ marginTop: 4 }}>
                        <StatusBadge status={log.status} hideIcon={true} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </DetailPane>
    </div>
  );
};

const meta: Meta = {
  title: 'Showcase/Backoffice Orders',
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj;

export const Desktop: Story = {
  render: () => <OrdersShowcase />,
};
