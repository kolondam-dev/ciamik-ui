import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { MetricCard } from '../../src/patterns/MetricCard/MetricCard';
import { DataTable } from '../../src/patterns/DataTable/DataTable';
import { StatusBadge } from '../../src/patterns/StatusBadge/StatusBadge';
import { Sidebar } from '../../src/patterns/Sidebar/Sidebar';
import { SearchFilterBar } from '../../src/patterns/SearchFilterBar/SearchFilterBar';
import {
  ChartBar, ShoppingCart,
  House, Truck, Tag, Gear,
} from '@phosphor-icons/react';

const sidebarGroups = [
  {
    title: 'Menu Utama',
    items: [
      { key: 'dashboard', label: 'Dashboard', icon: <House size={18} />, isActive: true },
      { key: 'orders', label: 'Pesanan', icon: <ShoppingCart size={18} /> },
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

const metrics = [
  { title: 'Total Penjualan', value: 'Rp 45.200.000', delta: 12.5 },
  { title: 'Pesanan Baru', value: '128', delta: 8.3 },
  { title: 'Pelanggan Baru', value: '43', delta: -2.1 },
  { title: 'Produk Terjual', value: '312', delta: 15.7 },
];

const recentOrders = [
  { id: 'ORD-2401', customer: 'Ahmad Maulana', total: 'Rp 539.000', status: 'PROCESSING', date: '14 Jun 2026' },
  { id: 'ORD-2400', customer: 'Siti Rahmawati', total: 'Rp 178.000', status: 'SHIPPED', date: '14 Jun 2026' },
  { id: 'ORD-2399', customer: 'Budi Santoso', total: 'Rp 1.200.000', status: 'PENDING_PAYMENT', date: '13 Jun 2026' },
  { id: 'ORD-2398', customer: 'Dewi Lestari', total: 'Rp 89.000', status: 'COMPLETED', date: '13 Jun 2026' },
  { id: 'ORD-2397', customer: 'Rina Kartika', total: 'Rp 385.000', status: 'DELIVERED', date: '12 Jun 2026' },
  { id: 'ORD-2396', customer: 'Joko Widodo', total: 'Rp 750.000', status: 'CANCELLED', date: '12 Jun 2026' },
];

const filterOptions = [
  { key: 'all', label: 'Semua' },
  { key: 'processing', label: 'Diproses' },
  { key: 'shipped', label: 'Dikirim' },
  { key: 'completed', label: 'Selesai' },
];

const DashboardPage = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

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

      {/* Main Content */}
      <div style={{ flex: 1, overflow: 'auto', padding: 24 }}>
        {/* Page Title */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ font: 'var(--text-h1)', color: 'var(--ciamik-ink)', marginBottom: 4 }}>
            Dashboard
          </h1>
          <p style={{ font: 'var(--text-small)', color: 'var(--ciamik-text-secondary)' }}>
            Ringkasan performa toko periode 7 hari terakhir
          </p>
        </div>

        {/* Metrics Grid */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: 16, marginBottom: 32,
        }}>
          {metrics.map((m, idx) => (
            <MetricCard
              key={idx}
              title={m.title}
              value={m.value}
              delta={m.delta}
              deltaLabel="vs minggu lalu"
            />
          ))}
        </div>

        {/* Chart Placeholder */}
        <div style={{
          backgroundColor: 'var(--ciamik-surface)', borderRadius: 'var(--r-lg)',
          border: '1px solid var(--ciamik-border-faint)', padding: 24, marginBottom: 32,
        }}>
          <h3 style={{ font: 'var(--text-h3)', color: 'var(--ciamik-ink)', marginBottom: 16 }}>
            📈 Tren Penjualan
          </h3>
          <div style={{
            height: 200, display: 'flex', alignItems: 'flex-end', gap: 8, paddingBottom: 8,
          }}>
            {[35, 50, 45, 60, 55, 80, 70, 90, 85, 95, 75, 100].map((h, idx) => (
              <div key={idx} style={{
                flex: 1, height: `${h}%`, borderRadius: 'var(--r-xs) var(--r-xs) 0 0',
                background: idx === 11
                  ? 'var(--ciamik-accent)'
                  : `rgba(var(--ciamik-primary-rgb), ${0.3 + (h / 200)})`,
                transition: 'height var(--dur-base) var(--ease)',
              }} />
            ))}
          </div>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            font: 'var(--text-caption)', color: 'var(--ciamik-text-tertiary)', paddingTop: 4,
          }}>
            {['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'].map(m => (
              <span key={m}>{m}</span>
            ))}
          </div>
        </div>

        {/* Search & Filter */}
        <div style={{ marginBottom: 16 }}>
          <SearchFilterBar
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            placeholder="Cari pesanan..."
            filterOptions={filterOptions}
            activeFilterKey={activeFilter}
            onFilterKeyChange={setActiveFilter}
          />
        </div>

        {/* Recent Orders Table */}
        <DataTable
          columns={[
            { key: 'id', label: 'Order ID' },
            { key: 'customer', label: 'Pelanggan' },
            { key: 'total', label: 'Total' },
            { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
            { key: 'date', label: 'Tanggal' },
          ]}
          data={recentOrders}
          keyExtractor={(row) => row.id}
          selectable
        />
      </div>
    </div>
  );
};

const meta: Meta = {
  title: 'Showcase/Backoffice Dashboard',
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj;

export const Desktop: Story = {
  render: () => <DashboardPage />,
};
