# @ciamik/ui — Consumer Use-Case Reference Guide

Panduan praktis bagi developer untuk mengintegrasikan dan menggunakan `@ciamik/ui` dalam membangun aplikasi storefront maupun backoffice.

---

## 📦 1. Setup Awal

### Instalasi Library
Install library `@ciamik/ui` beserta peer dependencies yang dibutuhkan:

```bash
npm install @ciamik/ui react react-dom framer-motion @phosphor-icons/react
```

### Registrasi CSS Tokens
Import stylesheet utama di file entry-point aplikasi Anda (misalnya `main.tsx` atau `_app.tsx`):

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Import CSS tokens & styles ciamik
import '@ciamik/ui/dist/style.css';

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
import { CiamikProvider, Button } from '@ciamik/ui';

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

### Contoh Kustomisasi Brand (Layer 3 Override)
Jika Anda memiliki sistem multi-tenant di mana setiap toko (merchant) memiliki warna tema unik:

```tsx
import { CiamikProvider, Card, Button } from '@ciamik/ui';

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
import { ProductGrid, ProductCard, useToast, CiamikProvider } from '@ciamik/ui';

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
import { OTPFlow, TrustBadges, useToast, Button } from '@ciamik/ui';

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
import { Sidebar, DataTable, DetailPane, StatusBadge, Select, Button } from '@ciamik/ui';
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
import { KanbanBoard, useToast, Card } from '@ciamik/ui';

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
