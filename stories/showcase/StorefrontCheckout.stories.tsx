import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { CartItem } from '../../src/blocks/CartItem/CartItem';
import { OTPFlow } from '../../src/blocks/OTPFlow/OTPFlow';
import { TrustBadges } from '../../src/blocks/TrustBadges/TrustBadges';

const initialCartItems = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&q=80',
    name: 'Sepatu Sneakers Running Ultra Boost',
    variant: 'Hitam / 42',
    price: 450000,
    quantity: 1,
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&q=80',
    name: 'Kaos Polos Premium 30s Katun',
    variant: 'Putih / L',
    price: 89000,
    quantity: 2,
  },
];

const CheckoutPage = () => {
  const [items, setItems] = useState(initialCartItems);
  const [showOTP, setShowOTP] = useState(false);

  const handleQtyChange = (id: string, newQty: number) => {
    setItems((prev) => prev.map((item) => item.id === id ? { ...item, quantity: newQty } : item));
  };

  const handleRemove = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', backgroundColor: 'var(--ciamik-bg)', minHeight: '100vh' }}>
      {/* Topbar */}
      <div style={{
        padding: '12px 16px', backgroundColor: 'var(--ciamik-surface)',
        borderBottom: '1px solid var(--ciamik-border-faint)',
        font: 'var(--text-h3)', color: 'var(--ciamik-ink)', fontWeight: 600,
      }}>
        ← Checkout
      </div>

      {showOTP ? (
        <div style={{ padding: 16 }}>
          <OTPFlow
            initialPhone="81234567890"
            onSendOTP={async () => { await new Promise(r => setTimeout(r, 800)); return true; }}
            onVerifyOTP={async (code) => { await new Promise(r => setTimeout(r, 800)); return code === '1234'; }}
            onSuccess={() => alert('Pembayaran berhasil! Terima kasih.')}
            onCancel={() => setShowOTP(false)}
          />
        </div>
      ) : (
        <>
          {/* Address Section */}
          <div style={{
            margin: '12px 16px', padding: 16, backgroundColor: 'var(--ciamik-surface)',
            borderRadius: 'var(--r-lg)', border: '1px solid var(--ciamik-border-faint)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <h3 style={{ font: 'var(--text-h3)', color: 'var(--ciamik-ink)' }}>📍 Alamat Pengiriman</h3>
              <button style={{
                font: 'var(--text-caption)', color: 'var(--ciamik-primary)',
                background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600,
              }}>Ubah</button>
            </div>
            <p style={{ font: 'var(--text-small)', color: 'var(--ciamik-ink)', fontWeight: 600 }}>Ahmad Maulana</p>
            <p style={{ font: 'var(--text-small)', color: 'var(--ciamik-text-secondary)' }}>
              +62 812 3456 7890
            </p>
            <p style={{ font: 'var(--text-small)', color: 'var(--ciamik-text-secondary)', marginTop: 4 }}>
              Jl. Sudirman No. 123, Kel. Menteng, Kec. Menteng, Jakarta Pusat, DKI Jakarta 10110
            </p>
          </div>

          {/* Cart Items */}
          <div style={{ padding: '0 16px' }}>
            <h3 style={{ font: 'var(--text-h3)', color: 'var(--ciamik-ink)', margin: '16px 0 12px' }}>
              🛒 Pesanan ({items.length} item)
            </h3>
            {items.map((item) => (
              <CartItem
                key={item.id}
                id={item.id}
                image={item.image}
                name={item.name}
                variantLabel={item.variant}
                price={item.price}
                quantity={item.quantity}
                onQuantityChange={(id, qty) => handleQtyChange(id as string, qty)}
                onRemove={(id) => handleRemove(id as string)}
              />
            ))}
          </div>

          {/* Courier */}
          <div style={{
            margin: '12px 16px', padding: 16, backgroundColor: 'var(--ciamik-surface)',
            borderRadius: 'var(--r-lg)', border: '1px solid var(--ciamik-border-faint)',
          }}>
            <h3 style={{ font: 'var(--text-h3)', color: 'var(--ciamik-ink)', marginBottom: 12 }}>🚚 Pengiriman</h3>
            {['Reguler (Rp 15.000) — 3-5 hari', 'Express (Rp 25.000) — 1-2 hari'].map((option, idx) => (
              <label key={idx} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0',
                borderBottom: idx === 0 ? '1px solid var(--ciamik-border-faint)' : 'none',
                font: 'var(--text-small)', color: 'var(--ciamik-ink)', cursor: 'pointer',
              }}>
                <input type="radio" name="courier" defaultChecked={idx === 0} />
                {option}
              </label>
            ))}
          </div>

          {/* Summary & CTA */}
          <div style={{
            margin: '12px 16px 24px', padding: 16, backgroundColor: 'var(--ciamik-surface)',
            borderRadius: 'var(--r-lg)', border: '1px solid var(--ciamik-border-faint)',
          }}>
            <h3 style={{ font: 'var(--text-h3)', color: 'var(--ciamik-ink)', marginBottom: 12 }}>Ringkasan</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', font: 'var(--text-small)', color: 'var(--ciamik-text-secondary)', marginBottom: 4 }}>
              <span>Subtotal</span><span className="tabnum">Rp {subtotal.toLocaleString('id-ID')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', font: 'var(--text-small)', color: 'var(--ciamik-text-secondary)', marginBottom: 8 }}>
              <span>Ongkos Kirim</span><span className="tabnum">Rp 15.000</span>
            </div>
            <hr style={{ border: 'none', borderTop: '1px solid var(--ciamik-border-faint)', margin: '8px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', font: 'var(--text-h3)', color: 'var(--ciamik-ink)' }}>
              <span>Total</span><span className="tabnum">Rp {(subtotal + 15000).toLocaleString('id-ID')}</span>
            </div>
          </div>

          <div style={{ padding: '0 16px 24px' }}>
            <TrustBadges variant="compact" />
          </div>

          {/* Sticky Bottom CTA */}
          <div style={{
            position: 'sticky', bottom: 0, padding: '12px 16px',
            backgroundColor: 'var(--ciamik-surface)', borderTop: '1px solid var(--ciamik-border-faint)',
          }}>
            <button
              onClick={() => setShowOTP(true)}
              style={{
                width: '100%', padding: '14px', border: 'none', borderRadius: 'var(--r-md)',
                backgroundColor: 'var(--ciamik-accent)', color: '#fff',
                font: 'var(--text-h3)', fontWeight: 700, cursor: 'pointer',
              }}
            >
              Bayar Sekarang — Rp {(subtotal + 15000).toLocaleString('id-ID')}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const meta: Meta = {
  title: 'Showcase/Storefront Checkout',
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj;

export const Mobile: Story = {
  render: () => <CheckoutPage />,
};
