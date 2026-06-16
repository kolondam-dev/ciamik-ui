# @kolondam-dev/ciamik-ui — Consumer Use-Case Reference Guide

Panduan praktis bagi developer untuk mengintegrasikan dan menggunakan `@kolondam-dev/ciamik-ui` dalam membangun aplikasi storefront maupun backoffice.

---

## 📦 1. Setup Awal

### Instalasi Library
Karena pustaka ini dipublikasikan secara privat melalui **GitHub Packages**, Anda harus mengonfigurasi autentikasi terlebih dahulu.

1. Buat berkas `.npmrc` di root aplikasi Anda:
```ini
@kolondam-dev:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```
2. Pastikan variabel lingkungan `GITHUB_TOKEN` terisi dengan Personal Access Token (PAT) GitHub yang memiliki akses `read:packages`.
3. Install library `@kolondam-dev/ciamik-ui` beserta peer dependencies yang dibutuhkan:

```bash
npm install @kolondam-dev/ciamik-ui react react-dom framer-motion @phosphor-icons/react
```

### Registrasi CSS Tokens
Import stylesheet utama di file entry-point aplikasi Anda (misalnya `main.tsx` atau `_app.tsx`):

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Import CSS tokens & styles ciamik
import '@kolondam-dev/ciamik-ui/dist/style.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

---

## 🎨 2. Enforcing Theme & Multi-tenant

Wrap aplikasi Anda dengan `CiamikProvider` untuk mengaktifkan state management global (seperti Toast notifications) dan mendukung override token visual.

### Contoh Toggle Mode Gelap Dinamis
```tsx
import { useState } from 'react';
import { CiamikProvider, Button } from '@kolondam-dev/ciamik-ui';

export default function Root() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <CiamikProvider darkMode={darkMode}>
      <div style={{ padding: 24, minHeight: '100vh', backgroundColor: 'var(--ciamik-bg)' }}>
        <Button onClick={() => setDarkMode(!darkMode)}>
          Ubah ke Mode {darkMode ? 'Terang' : 'Gelap'}
        </Button>
      </div>
    </CiamikProvider>
  );
}
```

> [!NOTE]
> **Server-Side Rendering (SSR)**: Karena `CiamikProvider` menggunakan `useEffect` (client-side) untuk mengatur atribut tema, Anda mungkin akan mengalami *flash of incorrect theme* pada saat muatan pertama (*first paint*) di aplikasi berbasis SSR seperti Next.js. Untuk menghindarinya, Anda dapat mengatur `data-theme="dark"` secara langsung pada elemen `<html>` di sisi server.

### Contoh Kustomisasi Brand (Layer 3 Override)
Jika Anda memiliki sistem multi-tenant di mana setiap toko (merchant) memiliki warna tema unik:

```tsx
import { CiamikProvider, Card, Button } from '@kolondam-dev/ciamik-ui';

function MerchantStorefront() {
  // Misalnya data warna ini diambil dari API toko merchant
  const merchantTheme = {
    primary: '#D32F2F',       // Merah Tua untuk warna utama
    primaryHover: '#C2185B',  // Hover warna utama
    accent: '#F57C00',        // Orange untuk badge diskon / CTA sekunder
    surface: '#FFF8F8',       // Sedikit kemerahan untuk surface card
  };

  return (
    <CiamikProvider brand={merchantTheme}>
      <Card style={{ maxWidth: 320, padding: 16 }}>
        <h3 style={{ color: 'var(--ciamik-primary)' }}>Selamat Datang di Toko Kami!</h3>
        <Button variant="primary">Belanja Sekarang</Button>
      </Card>
    </CiamikProvider>
  );
}
```

---

## 🛒 3. Storefront: Katalog Produk & Keranjang

Halaman katalog storefront responsif yang menampilkan grid produk, stepper kuantitas keranjang, dan feedback Toast saat produk ditambahkan.

```tsx
import { useState } from 'react';
import { ProductGrid, ProductCard, useToast, CiamikProvider } from '@kolondam-dev/ciamik-ui';

const SAMPLE_PRODUCTS = [
  { id: 1, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80', name: 'Running Shoes X-1', category: 'Fashion', price: 450000, rating: 4.8, soldCount: 320, stock: 5 },
  { id: 2, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80', name: 'Cotton Shirt Prime', category: 'Fashion', price: 89000, rating: 4.9, soldCount: 1500, stock: 45 },
];

export default function Catalog() {
  const { toast } = useToast();
  const [cart, setCart] = useState<Record<number, number>>({});
  const [wishlist, setWishlist] = useState<number[]>([]);

  const handleAddToCart = (id: number) => {
    setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    toast('Produk berhasil ditambahkan ke keranjang!', 'success');
  };

  const handleUpdateQty = (id: number, qty: number) => {
    setCart(prev => ({ ...prev, [id]: qty }));
  };

  const handleToggleWishlist = (id: number) => {
    setWishlist(prev => {
      const exists = prev.includes(id);
      const updated = exists ? prev.filter(item => item !== id) : [...prev, id];
      toast(exists ? 'Dihapus dari Wishlist' : 'Ditambahkan ke Wishlist', exists ? 'info' : 'success');
      return updated;
    });
  };

  return (
    <div style={{ padding: 16, maxWidth: 600, margin: '0 auto' }}>
      <ProductGrid title="✨ Produk Unggulan">
        {SAMPLE_PRODUCTS.map(p => (
          <ProductCard
            key={p.id}
            id={p.id}
            image={p.image}
            name={p.name}
            category={p.category}
            price={p.price}
            rating={p.rating}
            soldCount={p.soldCount}
            stock={p.stock}
            isWishlisted={wishlist.includes(p.id)}
            cartQty={cart[p.id] || 0}
            onAddToCart={() => handleAddToCart(p.id)}
            onUpdateCartQty={(id, qty) => handleUpdateQty(id as number, qty)}
            onWishlistToggle={() => handleToggleWishlist(p.id)}
          />
        ))}
      </ProductGrid>
    </div>
  );
}
```

---

## 🔒 4. Checkout & OTP Flow

Orkestrasi pembayaran storefront dengan checkout summary dan OTP verification modal step.

```tsx
import { useState } from 'react';
import { OTPFlow, TrustBadges, useToast, Button } from '@kolondam-dev/ciamik-ui';

export function CheckoutContainer() {
  const { toast } = useToast();
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSendOTP = async (phone: string) => {
    // Simulasi hit API OTP kirim SMS/WA
    await new Promise(r => setTimeout(r, 1000));
    console.log(`Mengirim OTP ke +62${phone}`);
    return true; // Berhasil terkirim
  };

  const handleVerifyOTP = async (code: string) => {
    // Simulasi verifikasi kode OTP
    await new Promise(r => setTimeout(r, 1000));
    return code === '1234'; // Benar jika kode = 1234
  };

  const handleSuccess = () => {
    toast('Autentikasi Berhasil! Pesanan diproses.', 'success');
    setIsVerifying(false);
  };

  return (
    <div style={{ padding: 16, maxWidth: 480, margin: '0 auto', backgroundColor: 'var(--ciamik-bg)' }}>
      {isVerifying ? (
        <OTPFlow
          initialPhone="81234567890"
          onSendOTP={handleSendOTP}
          onVerifyOTP={handleVerifyOTP}
          onSuccess={handleSuccess}
          onCancel={() => setIsVerifying(false)}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h3>Metode Pembayaran Aman</h3>
          <p>Anda akan diverifikasi menggunakan OTP melalui nomor HP terdaftar.</p>
          <TrustBadges variant="compact" />
          <Button variant="accent" onClick={() => setIsVerifying(true)}>
            Lanjut ke Verifikasi Keamanan
          </Button>
        </div>
      )}
    </div>
  );
}
```

---

## 📈 5. Backoffice: Dashboard & Order management

Penggunaan layout split, data table interaktif dengan bulk action, dan detail panel samping (DetailPane) untuk memproses detail item penjualan secara dinamis.

```tsx
import { useState } from 'react';
import { Sidebar, DataTable, DetailPane, StatusBadge, Select, Button } from '@kolondam-dev/ciamik-ui';
import { House, ShoppingCart, Truck, Tag } from '@phosphor-icons/react';

const sidebarMenu = [
  {
    title: 'Menu',
    items: [
      { key: 'dashboard', label: 'Dashboard', icon: <House size={18} /> },
      { key: 'orders', label: 'Orders', icon: <ShoppingCart size={18} />, isActive: true },
    ]
  }
];

export function OrdersDashboard() {
  const [orders, setOrders] = useState([
    { id: 'ORD-001', customer: 'Andi', total: 150000, status: 'PAID' as const },
    { id: 'ORD-002', customer: 'Budi', total: 280000, status: 'PROCESSING' as const },
  ]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const selectedOrder = orders.find(o => o.id === selectedOrderId);

  const updateOrderStatus = (newStatus: string) => {
    setOrders(prev =>
      prev.map(o => o.id === selectedOrderId ? { ...o, status: newStatus as any } : o)
    );
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: 'var(--ciamik-bg)' }}>
      <Sidebar isCollapsed={false} groups={sidebarMenu} logo={<strong>ciamik.id</strong>} />

      <div style={{ flex: 1, padding: 24, overflow: 'auto' }}>
        <h2>Pesanan Pelanggan</h2>
        <DataTable
          columns={[
            { key: 'id', label: 'ID Order' },
            { key: 'customer', label: 'Nama Pelanggan' },
            { key: 'total', label: 'Total', render: (row) => `Rp ${row.total.toLocaleString()}` },
            { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
          ]}
          data={orders}
          keyExtractor={(row) => row.id}
          onClickRow={(row) => setSelectedOrderId(row.id)}
        />
      </div>

      <DetailPane
        isOpen={selectedOrderId !== null}
        onClose={() => setSelectedOrderId(null)}
        title={`Status Order: ${selectedOrderId}`}
      >
        {selectedOrder && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <strong>Nama Pelanggan:</strong> {selectedOrder.customer}
            </div>
            <div>
              <strong>Total Transaksi:</strong> Rp {selectedOrder.total.toLocaleString()}
            </div>
            <div>
              <strong>Ubah Status Pengiriman:</strong>
              <Select
                value={selectedOrder.status}
                onChange={(e) => updateOrderStatus(e.target.value)}
                options={[
                  { value: 'PAID', label: 'Paid' },
                  { value: 'PROCESSING', label: 'Processing' },
                  { value: 'SHIPPED', label: 'Shipped' },
                  { value: 'COMPLETED', label: 'Completed' },
                ]}
              />
            </div>
          </div>
        )}
      </DetailPane>
    </div>
  );
}
```

---

## 🚚 6. Backoffice: Logistics Fulfillment Board

Mengelola pipeline pengiriman dengan Kanban Board dan me-reject perpindahan kartu jika melompati alur linear (misal: Pesanan baru harus diproses dulu sebelum langsung dikirim).

```tsx
import { useState } from 'react';
import { KanbanBoard, useToast, Card } from '@kolondam-dev/ciamik-ui';

interface Column {
  id: string;
  title: string;
  cards: { id: string; title: string; courier: string }[];
}

const steps = ['PAID', 'PROCESSING', 'PACKED', 'SHIPPED'];

export function FulfillmentBoard() {
  const { toast } = useToast();
  const [boardColumns, setBoardColumns] = useState<Column[]>([
    { id: 'PAID', title: 'Pesanan Baru', cards: [{ id: 'ORD-88', title: 'ORD-88', courier: 'JNE' }] },
    { id: 'PROCESSING', title: 'Diproses', cards: [] },
    { id: 'PACKED', title: 'Siap Kirim', cards: [] },
    { id: 'SHIPPED', title: 'Dalam Perjalanan', cards: [] },
  ]);

  const validateTransition = (cardId: string, fromCol: string, toCol: string) => {
    const fromIndex = steps.indexOf(fromCol);
    const toIndex = steps.indexOf(toCol);

    if (toIndex !== fromIndex + 1) {
      toast(`Gagal: Alur pengiriman ${cardId} harus berurutan!`, 'danger');
      return false;
    }
    return true;
  };

  const handleCardMove = (cardId: string, fromCol: string, toCol: string) => {
    setBoardColumns(prev => {
      let movedCard: any;
      const updated = prev.map(col => {
        if (col.id === fromCol) {
          movedCard = col.cards.find(c => c.id === cardId);
          return { ...col, cards: col.cards.filter(c => c.id !== cardId) };
        }
        return col;
      });

      if (!movedCard) return prev;

      return updated.map(col => {
        if (col.id === toCol) {
          return { ...col, cards: [...col.cards, movedCard] };
        }
        return col;
      });
    });

    toast(`Pesanan ${cardId} dipindahkan ke ${toCol}!`, 'success');
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Logistik & Pengiriman Barang</h2>
      <KanbanBoard
        columns={boardColumns}
        onCardMove={handleCardMove}
        validateMove={validateTransition}
        renderCard={(card) => (
          <Card style={{ padding: 12, border: '1px solid var(--ciamik-border-faint)' }}>
            <h4>{card.id}</h4>
            <small>Kurir: {card.courier}</small>
          </Card>
        )}
      />
    </div>
  );
}
```

---

## 🗺️ 7. Storefront: Desktop Layout & Cascading Address Flow

Panduan untuk mengimplementasikan layout storefront responsif (Mobile vs Desktop) dan Right Sidebar Drawer adaptif, serta formulir pengisian alamat dengan Region Selector berjenjang (Provinsi -> Kota -> Kecamatan -> Kelurahan).

### A. Right Sidebar Drawer Adaptif (`StorefrontDrawer`)

Component `StorefrontDrawer` secara dinamis berubah fungsi menjadi Bottom Sheet di mobile viewport dan Right Drawer di desktop viewport (`min-width: 1024px`).

```tsx
import { useState } from 'react';
import { useMediaQuery, Sheet, Button } from '@kolondam-dev/ciamik-ui';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from '@phosphor-icons/react';

// Wrapper Drawer Adaptif
export const StorefrontDrawer = ({
  isOpen,
  onClose,
  title,
  children
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) => {
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  if (isDesktop) {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop dengan blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              style={{
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: '#000',
                backdropFilter: 'blur(4px)',
                zIndex: 990,
              }}
            />
            {/* Right Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 220 }}
              style={{
                position: 'fixed',
                top: 0, right: 0, bottom: 0,
                width: '100%', maxWidth: 400,
                backgroundColor: 'var(--ciamik-surface)',
                boxShadow: 'var(--sh-lg)',
                borderLeft: '1px solid var(--ciamik-border-faint)',
                zIndex: 1000,
                display: 'flex', flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--ciamik-border-faint)' }}>
                <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--ciamik-ink)' }}>{title}</span>
                <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ciamik-text-secondary)' }}>
                  <X size={20} weight="bold" />
                </button>
              </div>
              {/* Content */}
              <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
                {children}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  // Fallback ke Bottom Sheet di Mobile
  return (
    <Sheet isOpen={isOpen} onClose={onClose} title={title}>
      {children}
    </Sheet>
  );
};
```

### B. Cascading Region Selector & Address Form

Berikut adalah cara menyusun state dan logika untuk region selector berjenjang yang menyaring data Provinsi -> Kota -> Kecamatan -> Kelurahan, serta mempopulasi Kode Pos secara otomatis.

```tsx
import { useState } from 'react';
import { useToast, Button, Input } from '@kolondam-dev/ciamik-ui';
import { CaretRight, MagnifyingGlass } from '@phosphor-icons/react';

// Database Mock Wilayah
const REGION_DATABASE = {
  'DKI Jakarta': {
    'Jakarta Pusat': {
      'Menteng': { 'Menteng': '10310', 'Cikini': '10330' }
    }
  },
  'Jawa Barat': {
    'Bandung': {
      'Coblong': { 'Dago': '40135', 'Sekeloa': '40134' }
    }
  }
};

export function AddressFormFlow() {
  const { toast } = useToast();
  const [view, setView] = useState<'form' | 'picker'>('form');
  const [pickerLevel, setPickerLevel] = useState<'provinsi' | 'kota' | 'kecamatan' | 'kelurahan'>('provinsi');
  const [searchQuery, setSearchQuery] = useState('');

  // Form States
  const [provinsi, setProvinsi] = useState('');
  const [kota, setKota] = useState('');
  const [kecamatan, setKecamatan] = useState('');
  const [kelurahan, setKelurahan] = useState('');
  const [postalCode, setPostalCode] = useState('');

  // Menghitung opsi yang tersedia berdasarkan pilihan sebelumnya
  const getOptions = () => {
    if (pickerLevel === 'provinsi') return Object.keys(REGION_DATABASE);
    if (pickerLevel === 'kota') return provinsi ? Object.keys((REGION_DATABASE as any)[provinsi] || {}) : [];
    if (pickerLevel === 'kecamatan') return (provinsi && kota) ? Object.keys((REGION_DATABASE as any)[provinsi]?.[kota] || {}) : [];
    if (pickerLevel === 'kelurahan') return (provinsi && kota && kecamatan) ? Object.keys((REGION_DATABASE as any)[provinsi]?.[kota]?.[kecamatan] || {}) : [];
    return [];
  };

  const handleSelectOption = (opt: string) => {
    if (pickerLevel === 'provinsi') {
      setProvinsi(opt); setKota(''); setKecamatan(''); setKelurahan(''); setPostalCode('');
      setPickerLevel('kota');
    } else if (pickerLevel === 'kota') {
      setKota(opt); setKecamatan(''); setKelurahan(''); setPostalCode('');
      setPickerLevel('kecamatan');
    } else if (pickerLevel === 'kecamatan') {
      setKecamatan(opt); setKelurahan(''); setPostalCode('');
      setPickerLevel('kelurahan');
    } else if (pickerLevel === 'kelurahan') {
      setKelurahan(opt);
      const code = (REGION_DATABASE as any)[provinsi]?.[kota]?.[kecamatan]?.[opt] || '';
      setPostalCode(code);
      setView('form'); // Kembali ke form utama
    }
    setSearchQuery('');
  };

  const options = getOptions().filter(o => o.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div style={{ padding: 16, maxWidth: 400, backgroundColor: 'var(--ciamik-surface)', borderRadius: 'var(--r-lg)' }}>
      {view === 'form' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h3>Formulir Alamat</h3>
          
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>Wilayah</label>
            <div
              onClick={() => { setPickerLevel('provinsi'); setView('picker'); }}
              style={{ padding: 12, border: '1px solid var(--ciamik-border)', borderRadius: 'var(--r-md)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}
            >
              <span>{provinsi ? `${provinsi}, ${kota}, ${kecamatan}, ${kelurahan}` : 'Pilih Wilayah...'}</span>
              <CaretRight size={16} />
            </div>
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>Kode Pos</label>
            <Input readOnly value={postalCode} placeholder="Kode pos terisi otomatis" />
          </div>

          <Button variant="primary" onClick={() => toast('Alamat berhasil disimpan!', 'success')}>
            Simpan Alamat
          </Button>
        </div>
      ) : (
        <div>
          <h3>Pilih {pickerLevel}</h3>
          
          {/* Input Search */}
          <div style={{ display: 'flex', gap: 8, padding: 8, border: '1px solid var(--ciamik-border)', borderRadius: 'var(--r-md)', marginBottom: 12 }}>
            <MagnifyingGlass size={18} />
            <input
              type="text"
              placeholder={`Cari ${pickerLevel}...`}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ border: 'none', width: '100%', outline: 'none', background: 'transparent' }}
            />
          </div>

          {/* Breadcrumbs */}
          <div style={{ display: 'flex', gap: 8, fontSize: 12, color: 'var(--ciamik-text-secondary)', marginBottom: 16 }}>
            <span style={{ cursor: 'pointer', fontWeight: pickerLevel === 'provinsi' ? 700 : 500 }} onClick={() => setPickerLevel('provinsi')}>Provinsi</span>
            {provinsi && <span onClick={() => setPickerLevel('kota')}>&gt; {provinsi}</span>}
            {kota && <span onClick={() => setPickerLevel('kecamatan')}>&gt; {kota}</span>}
          </div>

          {/* Options List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {options.map(opt => (
              <div
                key={opt}
                onClick={() => handleSelectOption(opt)}
                style={{ padding: 12, border: '1px solid var(--ciamik-border-faint)', borderRadius: 'var(--r-md)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}
              >
                <span>{opt}</span>
                <CaretRight size={14} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```
