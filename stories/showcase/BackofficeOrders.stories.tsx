import { useState, useMemo } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Sidebar } from '../../src/patterns/Sidebar/Sidebar';
import { SearchFilterBar } from '../../src/patterns/SearchFilterBar/SearchFilterBar';
import { DataTable } from '../../src/patterns/DataTable/DataTable';
import { StatusBadge } from '../../src/patterns/StatusBadge/StatusBadge';
import { DetailPane } from '../../src/patterns/DetailPane/DetailPane';
import { Select } from '../../src/primitives/Select/Select';
import { Button } from '../../src/primitives/Button/Button';
import { MetricCard } from '../../src/patterns/MetricCard/MetricCard';
import { ViewSwitcher } from '../../src/patterns/ViewSwitcher/ViewSwitcher';
import { DateRangePicker } from '../../src/patterns/DateRangePicker/DateRangePicker';
import { KanbanBoard } from '../../src/patterns/KanbanBoard/KanbanBoard';
import { useMediaQuery } from '../../src/hooks/useMediaQuery';
import {
  House, ShoppingCart, Truck, Tag, ChartBar, Gear,
  User, MapPin, Clock, Circle, CreditCard, Columns
} from '@phosphor-icons/react';

const sidebarGroups = [
  {
    title: 'Menu Utama',
    items: [
      { key: 'dashboard', label: 'Dashboard', icon: <House size={18} weight="duotone" /> },
      { key: 'orders', label: 'Pesanan', icon: <ShoppingCart size={18} weight="duotone" />, isActive: true },
      { key: 'fulfillment', label: 'Fulfillment', icon: <Truck size={18} weight="duotone" /> },
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
    dateStr: '2026-06-14',
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
    dateStr: '2026-06-14',
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
    dateStr: '2026-06-13',
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
    dateStr: '2026-06-13',
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
    dateStr: '2026-06-12',
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
  { key: 'all', label: 'Semua Status' },
  { key: 'PENDING_PAYMENT', label: 'Menunggu Bayar' },
  { key: 'PROCESSING', label: 'Diproses' },
  { key: 'SHIPPED', label: 'Dikirim' },
  { key: 'DELIVERED', label: 'Sampai' },
  { key: 'COMPLETED', label: 'Selesai' },
];

const OrdersShowcase = () => {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const [isCollapsed, setIsCollapsed] = useState(false);

  // States
  const [orders, setOrders] = useState(initialOrders);
  const [searchValue, setSearchValue] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [detailTab, setDetailTab] = useState('detail');
  
  // View Switcher state
  const [activeView, setActiveView] = useState('table');

  // Date Range state
  const [startDate, setStartDate] = useState<Date | null>(() => {
    const d = new Date('2026-06-10');
    return d;
  });
  const [endDate, setEndDate] = useState<Date | null>(() => new Date('2026-06-16'));

  // Kanban Column selection state
  const [visibleKanbanCols, setVisibleKanbanCols] = useState<string[]>(['PENDING_PAYMENT', 'PROCESSING', 'SHIPPED', 'DELIVERED']);
  const [isColumnSelectorOpen, setIsColumnSelectorOpen] = useState(false);

  // Sorting States
  const [sortKey, setSortKey] = useState<string>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Filter logic based on Date, Search, and Status Badge filters
  const filteredOrders = orders.filter((order) => {
    // Search match
    const matchesSearch =
      order.id.toLowerCase().includes(searchValue.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchValue.toLowerCase());

    // Status match
    const matchesFilter = activeFilter === 'all' || order.status === activeFilter;

    // Date range match
    let matchesDate = true;
    if (startDate && endDate) {
      const orderTime = new Date(order.dateStr).getTime();
      const sTime = new Date(startDate.toISOString().slice(0, 10)).getTime();
      const eTime = new Date(endDate.toISOString().slice(0, 10)).getTime();
      matchesDate = orderTime >= sTime && orderTime <= eTime;
    }

    return matchesSearch && matchesFilter && matchesDate;
  });

  // Client-side sorting logic for DataTable
  const sortedOrders = useMemo(() => {
    return [...filteredOrders].sort((a, b) => {
      let comp = 0;
      if (sortKey === 'id') {
        comp = a.id.localeCompare(b.id);
      } else if (sortKey === 'customer') {
        comp = a.customer.localeCompare(b.customer);
      } else if (sortKey === 'total') {
        comp = a.total - b.total;
      } else if (sortKey === 'date') {
        comp = a.dateStr.localeCompare(b.dateStr);
      } else if (sortKey === 'status') {
        comp = a.status.localeCompare(b.status);
      }
      return sortDirection === 'asc' ? comp : -comp;
    });
  }, [filteredOrders, sortKey, sortDirection]);

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

  // KPI calculations
  const totalPaidRevenue = orders
    .filter(o => ['PROCESSING', 'SHIPPED', 'DELIVERED', 'COMPLETED'].includes(o.status))
    .reduce((sum, o) => sum + o.total, 0);

  const processingCount = orders.filter(o => o.status === 'PROCESSING').length;
  const shippedCount = orders.filter(o => o.status === 'SHIPPED').length;
  const pendingCount = orders.filter(o => o.status === 'PENDING_PAYMENT').length;

  // Kanban column preparation
  const getKanbanColumns = () => {
    const statuses = [
      { id: 'PENDING_PAYMENT', title: 'Menunggu Bayar' },
      { id: 'PROCESSING', title: 'Diproses' },
      { id: 'SHIPPED', title: 'Dikirim' },
      { id: 'DELIVERED', title: 'Sampai/Selesai' }, // Combine or map completed too
    ].filter(col => visibleKanbanCols.includes(col.id));

    return statuses.map(col => {
      const colCards = filteredOrders
        .filter(o => {
          if (col.id === 'DELIVERED') {
            return o.status === 'DELIVERED' || o.status === 'COMPLETED';
          }
          return o.status === col.id;
        })
        .map(o => ({
          id: o.id,
          title: `${o.id} - ${o.customer}`,
          order: o,
        }));
      return {
        id: col.id,
        title: col.title,
        cards: colCards,
      };
    });
  };

  const handleCardMove = (cardId: string, _fromColumnId: string, toColumnId: string) => {
    setOrders(prev =>
      prev.map(o => {
        if (o.id === cardId) {
          let targetStatus = toColumnId;
          if (toColumnId === 'DELIVERED') {
            targetStatus = 'DELIVERED';
          }
          return {
            ...o,
            status: targetStatus as any,
          };
        }
        return o;
      })
    );
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: 'var(--ciamik-bg)', fontFamily: 'var(--font-family)', overflow: 'hidden' }}>
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
        overflowY: 'auto',
        padding: 24,
        transition: 'margin-left 0.3s ease, margin-right 0.3s ease',
        marginLeft: isDesktop ? (isCollapsed ? 64 : 240) : 0,
        marginRight: selectedOrderId !== null && isDesktop ? 440 : 0,
      }}>
        {/* Page Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
          <div>
            <h1 style={{ font: 'var(--text-h1)', color: 'var(--ciamik-ink)', marginBottom: 4 }}>
              Manajemen Pesanan
            </h1>
            <p style={{ font: 'var(--text-small)', color: 'var(--ciamik-text-secondary)' }}>
              Kelola pesanan masuk, proses pengemasan, dan lacak status pengiriman pelanggan.
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <DateRangePicker
              startDate={startDate}
              endDate={endDate}
              onChange={(start, end) => {
                setStartDate(start);
                setEndDate(end);
              }}
            />
            <Button variant="primary">
              + Pesanan Baru
            </Button>
          </div>
        </div>

        {/* 2-Column Simpler KPI Cards at the Top of Halaman Lain */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: 16,
          marginBottom: 24,
        }}>
          <MetricCard
            title="Omset Berhasil"
            value={`Rp ${totalPaidRevenue.toLocaleString('id-ID')}`}
            variant="simple"
            icon={<ShoppingCart size={24} />}
            recommendation="Total dari transaksi lunas/diproses."
            isActive={activeFilter === 'all'}
            onClick={() => setActiveFilter('all')}
          />
          <MetricCard
            title="Diproses"
            value={processingCount}
            variant="simple"
            icon={<Clock size={24} />}
            recommendation="Pesanan sedang dikemas di gudang."
            isActive={activeFilter === 'PROCESSING'}
            onClick={() => setActiveFilter('PROCESSING')}
          />
          <MetricCard
            title="Dikirim"
            value={shippedCount}
            variant="simple"
            icon={<Truck size={24} />}
            recommendation="Paket sedang dibawa kurir logistik."
            isActive={activeFilter === 'SHIPPED'}
            onClick={() => setActiveFilter('SHIPPED')}
          />
          <MetricCard
            title="Menunggu Bayar"
            value={pendingCount}
            variant="simple"
            icon={<CreditCard size={24} />}
            recommendation="Menunggu transfer dana pembeli."
            isActive={activeFilter === 'PENDING_PAYMENT'}
            onClick={() => setActiveFilter('PENDING_PAYMENT')}
          />
        </div>

        {/* Filter Toolbar + View Switcher */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          marginBottom: 16,
          padding: 16,
          backgroundColor: 'var(--ciamik-surface)',
          borderRadius: 'var(--r-lg)',
          border: '1px solid var(--ciamik-border-faint)',
        }}>
          {/* Row 1: Search & View Switcher */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 16,
            flexWrap: 'wrap',
            width: '100%',
          }}>
            <div style={{ flex: 1, minWidth: 280 }}>
              <SearchFilterBar
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                placeholder="Cari ID pesanan atau nama pelanggan..."
              />
            </div>
            
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
                          { id: 'PENDING_PAYMENT', title: 'Menunggu Bayar' },
                          { id: 'PROCESSING', title: 'Diproses' },
                          { id: 'SHIPPED', title: 'Dikirim' },
                          { id: 'DELIVERED', title: 'Sampai/Selesai' },
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

          {/* Row 2: Filter Chips */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            flexWrap: 'wrap',
            paddingTop: 12,
            borderTop: '1px solid var(--ciamik-border-faint)',
          }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--ciamik-text-secondary)', marginRight: 4 }}>
              Status:
            </span>
            {filterOptions.map((opt) => {
              const isActive = activeFilter === opt.key;
              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setActiveFilter(opt.key)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 'var(--r-sm)',
                    border: '1px solid ' + (isActive ? 'var(--ciamik-primary)' : 'var(--ciamik-border)'),
                    backgroundColor: isActive ? 'var(--ciamik-bg-hover)' : 'var(--ciamik-surface)',
                    color: isActive ? 'var(--ciamik-primary)' : 'var(--ciamik-text-secondary)',
                    font: 'var(--text-small)',
                    fontWeight: isActive ? 600 : 500,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    transition: 'all 0.2s',
                  }}
                >
                  {opt.label}
                  {isActive && (
                    <span style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      backgroundColor: 'var(--ciamik-primary)',
                      display: 'inline-block',
                    }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Switch View Renderers */}
        {activeView === 'table' && (
          <DataTable
            columns={[
              { key: 'id', label: 'Order ID', sortable: true },
              { key: 'date', label: 'Tanggal', sortable: true },
              { key: 'customer', label: 'Pelanggan', sortable: true },
              {
                key: 'total',
                label: 'Total Tagihan',
                sortable: true,
                render: (row: any) => <span className="tabnum">Rp {row.total.toLocaleString('id-ID')}</span>,
              },
              {
                key: 'status',
                label: 'Status',
                sortable: true,
                render: (row: any) => <StatusBadge status={row.status} />,
              },
            ]}
            data={sortedOrders}
            keyExtractor={(row: any) => row.id}
            selectable
            sortKey={sortKey}
            sortDirection={sortDirection}
            onSortChange={(key, dir) => {
              setSortKey(key);
              setSortDirection(dir);
            }}
            onRowClick={(row: any) => setSelectedOrderId(row.id)}
          />
        )}

        {activeView === 'list' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filteredOrders.length === 0 ? (
              <div style={{ padding: 40, textAlign: 'center', backgroundColor: 'var(--ciamik-surface)', borderRadius: 'var(--r-lg)', color: 'var(--ciamik-text-secondary)' }}>
                Tidak ada data pesanan.
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div
                  key={order.id}
                  onClick={() => setSelectedOrderId(order.id)}
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: '50%', backgroundColor: 'var(--ciamik-bg)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--ciamik-primary)'
                    }}>
                      {order.customer.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--ciamik-ink)' }}>{order.id} — {order.customer}</div>
                      <div style={{ fontSize: 12, color: 'var(--ciamik-text-secondary)' }}>
                        {order.date} · Kurir: {order.courier}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 700, color: 'var(--ciamik-primary)' }}>Rp {order.total.toLocaleString('id-ID')}</div>
                      <div style={{ fontSize: 11, color: 'var(--ciamik-text-tertiary)' }}>{order.items.length} item</div>
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
            {filteredOrders.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', padding: 40, textAlign: 'center', backgroundColor: 'var(--ciamik-surface)', borderRadius: 'var(--r-lg)', color: 'var(--ciamik-text-secondary)' }}>
                Tidak ada data pesanan.
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div
                  key={order.id}
                  onClick={() => setSelectedOrderId(order.id)}
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
                    <span style={{ fontSize: 12, color: 'var(--ciamik-text-tertiary)' }}>{order.items.length} item</span>
                    <span style={{ fontWeight: 700, color: 'var(--ciamik-primary)' }}>Rp {order.total.toLocaleString('id-ID')}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeView === 'kanban' && (
          <KanbanBoard
            columns={getKanbanColumns()}
            onCardMove={handleCardMove}
            renderCard={(card) => {
              const order = card.order;
              return (
                <div
                  onClick={() => setSelectedOrderId(order.id)}
                  style={{
                    backgroundColor: 'var(--ciamik-surface)',
                    border: '1px solid var(--ciamik-border-faint)',
                    borderRadius: 'var(--r-md)',
                    padding: 12,
                    cursor: 'grab',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                    boxShadow: 'var(--sh-sm)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ciamik-text-secondary)' }}>{order.id}</span>
                    <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 'var(--r-sm)', backgroundColor: 'var(--ciamik-bg)', color: 'var(--ciamik-ink)' }}>
                      {order.items.length} item
                    </span>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ciamik-ink)' }}>{order.customer}</div>
                  <div style={{ fontSize: 11, color: 'var(--ciamik-text-secondary)' }}>{order.courier}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                    <span style={{ fontWeight: 700, color: 'var(--ciamik-primary)', fontSize: 13 }}>Rp {order.total.toLocaleString('id-ID')}</span>
                    <StatusBadge status={order.status} hideIcon={true} />
                  </div>
                </div>
              );
            }}
          />
        )}
      </div>

      {/* Order Detail Pane */}
      <DetailPane
        isOpen={selectedOrderId !== null}
        onClose={() => setSelectedOrderId(null)}
        mode="push"
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
