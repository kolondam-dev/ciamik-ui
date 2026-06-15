import { useState, useEffect, useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { MetricCard } from '../../src/patterns/MetricCard/MetricCard';
import { DataTable } from '../../src/patterns/DataTable/DataTable';
import { StatusBadge } from '../../src/patterns/StatusBadge/StatusBadge';
import { Sidebar } from '../../src/patterns/Sidebar/Sidebar';
import { DetailPane } from '../../src/patterns/DetailPane/DetailPane';
import { DateRangePicker } from '../../src/patterns/DateRangePicker/DateRangePicker';
import { useMediaQuery } from '../../src/hooks/useMediaQuery';
import {
  House, ShoppingCart, Truck, Tag, ChartBar, Gear,
  CurrencyCircleDollar, Package, Receipt, Funnel, Heartbeat, ArrowCounterClockwise,
  DownloadSimple, FileText
} from '@phosphor-icons/react';

const sidebarGroups = [
  {
    title: 'Menu Utama',
    items: [
      { key: 'dashboard', label: 'Dashboard', icon: <House size={18} weight="duotone" />, isActive: true },
      { key: 'orders', label: 'Pesanan', icon: <ShoppingCart size={18} weight="duotone" /> },
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

// Seed random number generator for consistent dummy data
const seedRandom = (seed: number) => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

// Generate 90 days of daily data for dashboard period switcher
const generateDailyData = () => {
  const days = 90;
  const result = [];
  let revenue = 16.5; // base ~14–20 jt/day
  let orders = 120;

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dow = d.getDay();
    const weekend = (dow === 0 || dow === 6) ? 0.72 : 1.0;
    const trend = 1.0 + ((days - 1 - i) / days) * 0.28;
    const noise = 0.85 + seedRandom(i) * 0.3;

    revenue = Math.max(5.0, (revenue * 0.82 + (15 + seedRandom(i + 50) * 8) * 0.18)) * weekend * noise * trend;
    orders = Math.max(30, Math.round((orders * 0.78 + (110 + seedRandom(i + 100) * 40) * 0.22) * weekend * noise * trend));

    const dateStr = d.toISOString().slice(0, 10);

    result.push({
      date: d,
      dateStr,
      revenue: Math.round(revenue * 10) / 10, // in Millions
      orders,
      aov: Math.round((revenue * 1000000) / orders),
      conversion: Math.round((3.1 + seedRandom(i + 150) * 1.8) * 10) / 10,
      health: Math.min(100, Math.round(86 + seedRandom(i + 200) * 12)),
      retur: Math.round((0.9 + seedRandom(i + 250) * 0.8) * 10) / 10,
    });
  }
  return result;
};

const DAILY_DATA = generateDailyData();

const recentOrders = [
  { id: 'ORD-2401', customer: 'Ahmad Maulana', total: 'Rp 539.000', status: 'PROCESSING', date: '14 Jun 2026' },
  { id: 'ORD-2400', customer: 'Siti Rahmawati', total: 'Rp 178.000', status: 'SHIPPED', date: '14 Jun 2026' },
  { id: 'ORD-2399', customer: 'Budi Santoso', total: 'Rp 1.200.000', status: 'PENDING_PAYMENT', date: '13 Jun 2026' },
  { id: 'ORD-2398', customer: 'Dewi Lestari', total: 'Rp 89.000', status: 'COMPLETED', date: '13 Jun 2026' },
  { id: 'ORD-2397', customer: 'Rina Kartika', total: 'Rp 385.000', status: 'DELIVERED', date: '12 Jun 2026' },
  { id: 'ORD-2396', customer: 'Joko Widodo', total: 'Rp 750.000', status: 'CANCELLED', date: '12 Jun 2026' },
];

const Sparkline = ({ data, color = 'var(--ciamik-primary)', areaColor = 'rgba(47, 122, 120, 0.08)', id }: { data: number[], color?: string, areaColor?: string, id: string }) => {
  if (data.length === 0) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 280;
  const height = 44;
  const points = data.map((val, index) => {
    const x = (index / (data.length - 1)) * (width - 4) + 2;
    const y = height - 4 - ((val - min) / range) * (height - 8);
    return `${x},${y}`;
  });
  const pathData = `M ${points.join(' L ')}`;
  const areaPathData = `${pathData} L ${width - 2},${height} L 2,${height} Z`;

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id={`sparkline-grad-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={areaColor} stopOpacity={0.4} />
          <stop offset="100%" stopColor={areaColor} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={areaPathData} fill={`url(#sparkline-grad-${id})`} />
      <path d={pathData} fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

const DashboardShowcase = () => {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Date Range State (default to last 7 days)
  const [startDate, setStartDate] = useState<Date | null>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 6);
    return d;
  });
  const [endDate, setEndDate] = useState<Date | null>(() => new Date());
  const [compare, setCompare] = useState(false);

  // Loading state for top-bar loading simulation
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 850);
    return () => clearTimeout(timer);
  }, [startDate, endDate, compare]);

  // Selected Metric for Right DetailPane Drilldown
  const [selectedMetric, setSelectedMetric] = useState<string>('revenue');
  const [isPaneOpen, setIsPaneOpen] = useState(false);

  // ECharts references
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<any>(null);

  // Filter daily data based on selected date range
  const getFilteredData = () => {
    if (!startDate || !endDate) return DAILY_DATA.slice(-7);
    const startStr = startDate.toISOString().slice(0, 10);
    const endStr = endDate.toISOString().slice(0, 10);
    return DAILY_DATA.filter(d => d.dateStr >= startStr && d.dateStr <= endStr);
  };

  const currentSlice = getFilteredData();

  // Aggregate stats
  const aggregateStats = (slice: typeof DAILY_DATA) => {
    if (slice.length === 0) {
      return { revenue: 'Rp 0', orders: 0, aov: 'Rp 0', conversion: '0%', health: 90, retur: '0%' };
    }
    const totalRev = slice.reduce((sum, d) => sum + d.revenue, 0);
    const totalOrd = slice.reduce((sum, d) => sum + d.orders, 0);
    const avgAov = Math.round((totalRev * 1000000) / totalOrd);
    const avgConv = slice.reduce((sum, d) => sum + d.conversion, 0) / slice.length;
    const avgHealth = Math.round(slice.reduce((sum, d) => sum + d.health, 0) / slice.length);
    const avgRetur = slice.reduce((sum, d) => sum + d.retur, 0) / slice.length;

    return {
      revenue: `Rp ${totalRev.toLocaleString('id-ID', { maximumFractionDigits: 1 })}jt`,
      orders: totalOrd.toLocaleString('id-ID'),
      aov: `Rp ${avgAov.toLocaleString('id-ID')}`,
      conversion: `${avgConv.toFixed(1)}%`,
      health: `${avgHealth}/100`,
      retur: `${avgRetur.toFixed(1)}%`,
    };
  };

  const stats = aggregateStats(currentSlice);

  // Chart initialization and update
  const updateChart = () => {
    if (!chartRef.current || !(window as any).echarts) return;

    if (!chartInstance.current) {
      chartInstance.current = (window as any).echarts.init(chartRef.current);
    }

    const labels = currentSlice.map(d =>
      d.date.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' })
    );

    const option: Record<string, any> = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#1B264F',
        borderColor: 'transparent',
        textStyle: { color: '#C2C6D6', fontSize: 11 },
        formatter(params: any[]) {
          const rev = params.find(p => p.seriesName === 'Revenue');
          const ord = params.find(p => p.seriesName === 'Order');
          return `<b>${params[0].name}</b><br/>
            Revenue: <b>Rp ${rev.value}jt</b><br/>
            Order: <b>${ord.value}</b>`;
        }
      },
      legend: { show: false },
      grid: { top: 16, right: 16, bottom: 32, left: 64, containLabel: false },
      xAxis: {
        type: 'category',
        data: labels,
        axisLine: { lineStyle: { color: 'var(--ciamik-border-faint)' } },
        axisTick: { show: false },
        axisLabel: { color: 'var(--ciamik-text-secondary)', fontSize: 10, margin: 10 }
      },
      yAxis: [
        {
          type: 'value',
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: { lineStyle: { color: 'var(--ciamik-border-faint)', type: 'dashed' } },
          axisLabel: { color: 'var(--ciamik-text-secondary)', fontSize: 10, formatter: 'Rp {value}jt' }
        },
        {
          type: 'value',
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: { show: false },
          axisLabel: { color: 'var(--ciamik-text-secondary)', fontSize: 10 }
        }
      ],
      series: [
        {
          name: 'Revenue',
          type: 'line',
          smooth: true,
          data: currentSlice.map(d => d.revenue),
          itemStyle: { color: '#2F7A78' },
          lineStyle: { width: 3 },
          areaStyle: {
            color: {
              type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(47,122,120,0.18)' },
                { offset: 1, color: 'rgba(47,122,120,0)' }
              ]
            }
          }
        },
        {
          name: 'Order',
          type: 'bar',
          yAxisIndex: 1,
          barMaxWidth: 18,
          itemStyle: {
            color: {
              type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(255, 127, 80, 0.50)' },
                { offset: 1, color: 'rgba(255, 127, 80, 0.05)' }
              ]
            },
            borderRadius: [4, 4, 0, 0]
          },
          data: currentSlice.map(d => d.orders)
        }
      ]
    };

    chartInstance.current.setOption(option, { notMerge: false });
  };

  // Dynamically load ECharts from CDN
  useEffect(() => {
    const handleResize = () => {
      if (chartInstance.current) {
        chartInstance.current.resize();
      }
    };

    if ((window as any).echarts) {
      updateChart();
      window.addEventListener('resize', handleResize);
    } else {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js';
      script.async = true;
      script.onload = () => {
        updateChart();
        window.addEventListener('resize', handleResize);
      };
      document.body.appendChild(script);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [currentSlice]);

  // Handle drilldown click on metric card
  const handleMetricClick = (key: string) => {
    setSelectedMetric(key);
    setIsPaneOpen(true);
  };

  const getMetricDetailContent = () => {
    switch (selectedMetric) {
      case 'revenue':
        return {
          title: 'Total Revenue (GMV)',
          desc: 'Total nilai transaksi kotor sebelum pemotongan diskon marketplace dan biaya operasional. Mengacu pada pesanan terkonfirmasi.',
          statLabel: 'Total Pendapatan',
          statVal: stats.revenue,
          insight: 'Penjualan menunjukkan stabilitas dengan kenaikan tipis saat akhir pekan dibantu promosi cashback. Kontribusi terbesar disumbang oleh platform Shopee Store.',
        };
      case 'orders':
        return {
          title: 'Total Pesanan Masuk',
          desc: 'Volume total pesanan yang terbuat oleh sistem dari seluruh kanal marketplace terintegrasi.',
          statLabel: 'Jumlah Order',
          statVal: stats.orders,
          insight: 'Rata-rata order harian stabil. Jam operasional puncak tercatat antara pukul 10.00 hingga 14.00 WIB.',
        };
      case 'aov':
        return {
          title: 'Avg. Order Value (AOV)',
          desc: 'Rata-rata nilai pengeluaran pelanggan per transaksi belanja. Dihitung dengan total pendapatan dibagi jumlah order.',
          statLabel: 'Rata-Rata Keranjang',
          statVal: stats.aov,
          insight: 'Nilai AOV stabil. Pengenalan produk bundle "Fashion Hemat" dianjurkan untuk mendongkrak AOV ke level Rp 200rb.',
        };
      case 'conversion':
        return {
          title: 'Tingkat Konversi Toko',
          desc: 'Rasio pengunjung toko yang menyelesaikan proses checkout pembayaran dibandingkan total kunjungan produk harian.',
          statLabel: 'Conversion Rate',
          statVal: stats.conversion,
          insight: 'Tingkat konversi 3.8% masuk dalam batas industri fashion normal. Periksa halaman produk dengan tingkat pantulan tinggi.',
        };
      case 'health':
        return {
          title: 'Shop Health Score',
          desc: 'Indikator kepuasan pelanggan, performa kecepatan pengemasan, SLA pengiriman kurir, dan rata-rata rating review.',
          statLabel: 'Skor Kesehatan',
          statVal: stats.health,
          insight: 'Kategori "Sangat Baik". Waktu respon chat di bawah 15 menit dan tingkat komplain pembeli tercatat di bawah 0.5%.',
        };
      case 'retur':
        return {
          title: 'Rasio Retur Barang',
          desc: 'Persentase order produk yang dikembalikan oleh pembeli karena rusak, salah ukuran, atau tidak sesuai pesanan.',
          statLabel: 'Retur Rate',
          statVal: stats.retur,
          insight: 'Rasio retur berada jauh di bawah ambang batas toleransi 2%, membuktikan kualitas quality control (QC) dan packaging kokoh.',
        };
      default:
        return { title: '', desc: '', statLabel: '', statVal: '', insight: '' };
    }
  };

  const metricDetail = getMetricDetailContent();

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: 'var(--ciamik-bg)', fontFamily: 'var(--font-family)', overflow: 'hidden', position: 'relative' }}>
      {/* Simulated loading bar */}
      {isLoading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: 'linear-gradient(90deg, transparent, var(--ciamik-primary), transparent)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite linear',
          zIndex: 9999,
        }} />
      )}
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

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
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: 24,
        transition: 'margin-left 0.3s ease, margin-right 0.3s ease',
        marginLeft: isDesktop ? (isCollapsed ? 64 : 240) : 0,
        marginRight: isPaneOpen && isDesktop ? 440 : 0,
      }}>
        {/* Page Header Area */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
          <div>
            <h1 style={{ font: 'var(--text-h1)', color: 'var(--ciamik-ink)', marginBottom: 4 }}>
              Ringkasan Dashboard
            </h1>
            <p style={{ font: 'var(--text-small)', color: 'var(--ciamik-text-secondary)' }}>
              Pemantauan performa bisnis utama, pendapatan, pesanan, dan operasional logistik terpadu.
            </p>
          </div>
          
          {/* Period Control Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <DateRangePicker
              startDate={startDate}
              endDate={endDate}
              onChange={(start, end) => {
                setStartDate(start);
                setEndDate(end);
              }}
              compare={compare}
              onCompareChange={setCompare}
            />
            <button
              onClick={() => alert('Mengekspor laporan dashboard...')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '9px 16px', borderRadius: 'var(--r-md)',
                backgroundColor: 'var(--ciamik-surface)', border: '1px solid var(--ciamik-border)',
                color: 'var(--ciamik-text-secondary)', cursor: 'pointer', font: 'var(--text-small)', fontWeight: 600,
                boxShadow: 'var(--sh-sm)', transition: 'background 0.2s',
              }}
            >
              <DownloadSimple size={16} /> Export
            </button>
          </div>
        </div>

        {/* Dashboard Metrics Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 16,
          marginBottom: 32,
        }}>
          <MetricCard
            title="Revenue (GMV)"
            value={stats.revenue}
            delta={18.3}
            deltaLabel="vs mgg lalu"
            recommendation="💡 Tren naik konsisten — pertahankan stok produk terlaris."
            badgeColor="teal"
            icon={<CurrencyCircleDollar size={20} weight="duotone" className="metric-icon teal" />}
            isActive={isPaneOpen && selectedMetric === 'revenue'}
            onClick={() => handleMetricClick('revenue')}
            sparkline={<Sparkline id="rev" data={currentSlice.map(d => d.revenue)} color="var(--ciamik-teal-600, #2f7a78)" areaColor="rgba(47, 122, 120, 0.1)" />}
          />
          <MetricCard
            title="Total Order"
            value={stats.orders}
            delta={12.1}
            deltaLabel="vs mgg lalu"
            recommendation="⚡ 12 order menunggu konfirmasi kurir pengiriman."
            badgeColor="navy"
            icon={<Package size={20} weight="duotone" className="metric-icon navy" />}
            isActive={isPaneOpen && selectedMetric === 'orders'}
            onClick={() => handleMetricClick('orders')}
            sparkline={<Sparkline id="ord" data={currentSlice.map(d => d.orders)} color="var(--ciamik-navy-600, #263059)" areaColor="rgba(61, 72, 112, 0.1)" />}
          />
          <MetricCard
            title="Avg. Order Value"
            value={stats.aov}
            delta={5.4}
            deltaLabel="vs mgg lalu"
            recommendation="💡 Coba bundling produk untuk tingkatkan AOV toko."
            badgeColor="coral"
            icon={<Receipt size={20} weight="duotone" className="metric-icon coral" />}
            isActive={isPaneOpen && selectedMetric === 'aov'}
            onClick={() => handleMetricClick('aov')}
            sparkline={<Sparkline id="aov" data={currentSlice.map(d => d.aov)} color="#E06336" areaColor="rgba(255, 127, 80, 0.1)" />}
          />
          <MetricCard
            title="Konversi Rate"
            value={stats.conversion}
            delta={-0.3}
            deltaLabel="vs mgg lalu"
            recommendation="⚠️ Cek deskripsi produk dengan bounce rate tinggi."
            badgeColor="mustard"
            icon={<Funnel size={20} weight="duotone" className="metric-icon mustard" />}
            isActive={isPaneOpen && selectedMetric === 'conversion'}
            onClick={() => handleMetricClick('conversion')}
            sparkline={<Sparkline id="conv" data={currentSlice.map(d => d.conversion)} color="#B3860F" areaColor="rgba(212, 160, 23, 0.1)" />}
          />
          <MetricCard
            title="Shop Health Score"
            value={stats.health}
            delta={4.0}
            deltaLabel="pts vs bln lalu"
            recommendation="✅ Excellent! Kecepatan respon chat pembeli < 15 menit."
            badgeColor="teal"
            icon={<Heartbeat size={20} weight="duotone" className="metric-icon teal" />}
            isActive={isPaneOpen && selectedMetric === 'health'}
            onClick={() => handleMetricClick('health')}
            sparkline={<Sparkline id="health" data={currentSlice.map(d => d.health)} color="var(--ciamik-teal-600, #2f7a78)" areaColor="rgba(47, 122, 120, 0.1)" />}
          />
          <MetricCard
            title="Retur Rate"
            value={stats.retur}
            delta={-0.2}
            deltaLabel="vs bln lalu"
            recommendation="✅ Di bawah target maksimal toleransi retur 2.0%."
            badgeColor="red"
            icon={<ArrowCounterClockwise size={20} weight="duotone" className="metric-icon red" />}
            isActive={isPaneOpen && selectedMetric === 'retur'}
            onClick={() => handleMetricClick('retur')}
            sparkline={<Sparkline id="retur" data={currentSlice.map(d => d.retur)} color="var(--ciamik-red-600, #c0392b)" areaColor="rgba(192, 57, 43, 0.1)" />}
          />
        </div>

        {/* ECharts Revenue Trend Chart */}
        <div style={{
          backgroundColor: 'var(--ciamik-surface)', borderRadius: 'var(--r-lg)',
          border: '1px solid var(--ciamik-border-faint)', padding: '24px 24px 16px', marginBottom: 32,
          boxShadow: 'var(--sh-sm)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h3 style={{ font: 'var(--text-h3)', color: 'var(--ciamik-ink)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                📈 Tren Pendapatan & Order
              </h3>
              <p style={{ font: 'var(--text-caption)', color: 'var(--ciamik-text-secondary)', marginTop: 4 }}>
                Grafik visual pergerakan nilai GMV (Juta Rupiah) vs jumlah kuantiti pesanan harian.
              </p>
            </div>
            
            {/* Chart Legend */}
            <div style={{ display: 'flex', gap: 16, fontSize: 12, fontWeight: 600 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--ciamik-text-secondary)' }}>
                <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', backgroundColor: '#2F7A78' }} /> Revenue
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--ciamik-text-secondary)' }}>
                <span style={{ display: 'inline-block', width: 10, height: 4, borderRadius: 1, backgroundColor: '#FF7F50' }} /> Order
              </div>
            </div>
          </div>
          
          {/* ECharts Dom Element */}
          <div ref={chartRef} style={{ height: 280, width: '100%' }} />
        </div>

        {/* Recent Orders Section */}
        <div style={{
          backgroundColor: 'var(--ciamik-surface)', borderRadius: 'var(--r-lg)',
          border: '1px solid var(--ciamik-border-faint)', padding: 24, boxShadow: 'var(--sh-sm)',
        }}>
          <h3 style={{ font: 'var(--text-h3)', color: 'var(--ciamik-ink)', fontWeight: 700, marginBottom: 16 }}>
            📦 Pesanan Terbaru Masuk
          </h3>
          <DataTable
            columns={[
              { key: 'id', label: 'Order ID' },
              { key: 'customer', label: 'Pelanggan' },
              { key: 'total', label: 'Total Belanja' },
              { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
              { key: 'date', label: 'Tanggal Transaksi' },
            ]}
            data={recentOrders}
            keyExtractor={(row) => row.id}
            selectable
          />
        </div>
      </div>

      {/* Drilldown Right DetailPane */}
      <DetailPane
        isOpen={isPaneOpen}
        onClose={() => setIsPaneOpen(false)}
        mode="push"
        title={metricDetail.title}
        tabs={[
          { key: 'summary', label: 'Penjelasan Metrik' },
        ]}
        activeTab="summary"
        onTabChange={() => {}}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Main Stat Card */}
          <div style={{
            padding: 18,
            backgroundColor: 'var(--ciamik-bg)',
            borderRadius: 'var(--r-lg)',
            border: '1px solid var(--ciamik-border-faint)',
            textAlign: 'center',
          }}>
            <span style={{ font: 'var(--text-small)', color: 'var(--ciamik-text-secondary)', display: 'block', marginBottom: 6 }}>
              {metricDetail.statLabel} ({currentSlice.length} Hari)
            </span>
            <span style={{ font: 'var(--text-display)', color: 'var(--ciamik-primary)', fontWeight: 850 }}>
              {metricDetail.statVal}
            </span>
          </div>

          {/* Description */}
          <div>
            <h4 style={{ font: 'var(--text-body)', fontWeight: 750, color: 'var(--ciamik-ink)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              <FileText size={16} /> Definisi Metrik
            </h4>
            <p style={{ font: 'var(--text-small)', color: 'var(--ciamik-text-secondary)', lineHeight: 1.5, margin: 0 }}>
              {metricDetail.desc}
            </p>
          </div>

          {/* Business Insights */}
          <div style={{
            padding: 16,
            borderRadius: 'var(--r-md)',
            backgroundColor: 'rgba(var(--ciamik-primary-rgb, 47, 122, 120), 0.04)',
            borderLeft: '4px solid var(--ciamik-primary)',
          }}>
            <h4 style={{ font: 'var(--text-body)', fontWeight: 750, color: 'var(--ciamik-primary)', marginBottom: 6 }}>
              💡 Insight Bisnis
            </h4>
            <p style={{ font: 'var(--text-small)', color: 'var(--ciamik-ink)', lineHeight: 1.5, margin: 0 }}>
              {metricDetail.insight}
            </p>
          </div>

          {/* Date Picker Hint */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 12, backgroundColor: 'var(--ciamik-bg)', borderRadius: 'var(--r-sm)', fontSize: 11, color: 'var(--ciamik-text-tertiary)' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--ciamik-accent)' }} />
            Data di atas disaring secara real-time berdasarkan period picker aktif.
          </div>
        </div>
      </DetailPane>
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
  render: () => <DashboardShowcase />,
};
