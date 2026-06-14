import type { Meta, StoryObj } from '@storybook/react';
import { ProductCard } from '../../src/blocks/ProductCard/ProductCard';
import { ProductGrid } from '../../src/blocks/ProductGrid/ProductGrid';
import { TrustBadges } from '../../src/blocks/TrustBadges/TrustBadges';
import { HeroBanner } from '../../src/blocks/HeroBanner/HeroBanner';

const heroSlides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80',
    eyebrow: 'Koleksi Terbaru',
    title: 'Diskon Akhir Pekan Hingga 50%!',
    description: 'Temukan tren fashion terbaru dengan harga terbaik. Gunakan kode voucher CIAMIK50.',
    ctaText: 'Belanja Sekarang',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&q=80',
    eyebrow: 'Elektronik Pilihan',
    title: 'Audio Premium untuk Anda',
    description: 'Headphone noise-cancelling wireless berkualitas tinggi.',
    ctaText: 'Lihat Detail',
  },
];

const products = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
    name: 'Sepatu Sneakers Running Ultra Boost',
    category: 'Fashion',
    rating: 4.8,
    soldCount: 340,
    price: 450000,
    badges: [{ type: 'free', text: '🚚 Bebas Ongkir' }],
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80',
    name: 'Kaos Polos Premium 30s Katun Combed',
    category: 'Fashion',
    rating: 4.9,
    soldCount: 1500,
    price: 89000,
    originalPrice: 127000,
    discountPercent: 30,
    badges: [
      { type: 'flash', text: '⚡ Flash Sale' },
      { type: 'discount', text: '🎁 Hemat 30%' },
    ],
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&q=80',
    name: 'Wireless Headphone Noise Cancel Pro X2',
    category: 'Elektronik',
    rating: 4.7,
    soldCount: 85,
    price: 1200000,
    badges: [{ type: 'instant', text: '🚀 Instan' }],
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80',
    name: 'Smart Watch Fitness Tracker Pro Series',
    category: 'Elektronik',
    rating: 4.6,
    soldCount: 220,
    price: 890000,
    stock: 2,
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&q=80',
    name: 'Parfum Homme Classic Wood Edition 100ml',
    category: 'Kecantikan',
    rating: 4.5,
    soldCount: 120,
    price: 385000,
    originalPrice: 550000,
    discountPercent: 30,
    badges: [{ type: 'discount', text: '🎁 Hemat 30%' }],
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&q=80',
    name: 'Kamera Polaroid Retro Instant Film',
    category: 'Elektronik',
    rating: 4.3,
    soldCount: 55,
    price: 750000,
    badges: [{ type: 'free', text: '🚚 Bebas Ongkir' }],
  },
];

const categoryChips = ['🔥 Semua', '👗 Fashion', '📱 Elektronik', '🏠 Rumah Tangga', '💄 Kecantikan', '🎮 Gaming'];

const StorefrontHomePage = () => (
  <div style={{ maxWidth: 480, margin: '0 auto', backgroundColor: 'var(--ciamik-bg)', minHeight: '100vh' }}>
    {/* Topbar placeholder */}
    <div style={{
      padding: '12px 16px', backgroundColor: 'var(--ciamik-surface)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      borderBottom: '1px solid var(--ciamik-border-faint)', position: 'sticky', top: 0, zIndex: 10,
    }}>
      <span style={{ font: 'var(--text-h3)', color: 'var(--ciamik-primary)', fontWeight: 700 }}>
        ciamik.id
      </span>
      <div style={{
        flex: 1, margin: '0 12px', padding: '8px 14px',
        backgroundColor: 'var(--ciamik-bg)', borderRadius: 'var(--r-pill)',
        font: 'var(--text-small)', color: 'var(--ciamik-text-tertiary)',
      }}>
        🔍 Cari produk...
      </div>
    </div>

    {/* Hero Banner */}
    <HeroBanner slides={heroSlides} autoPlay={false} />

    {/* Category Chips */}
    <div style={{
      padding: '16px', display: 'flex', gap: 8, overflowX: 'auto',
    }}>
      {categoryChips.map((chip, idx) => (
        <button key={idx} style={{
          padding: '8px 16px', borderRadius: 'var(--r-pill)', border: 'none',
          font: 'var(--text-small)', fontWeight: idx === 0 ? 600 : 400, whiteSpace: 'nowrap',
          backgroundColor: idx === 0 ? 'var(--ciamik-primary)' : 'var(--ciamik-surface)',
          color: idx === 0 ? '#fff' : 'var(--ciamik-ink)',
          cursor: 'pointer',
        }}>
          {chip}
        </button>
      ))}
    </div>

    {/* Product Grid */}
    <div style={{ padding: '0 16px' }}>
      <ProductGrid title="⚡ Flash Sale — Berakhir dalam 02:14:33" seeAllHref="#flash-sale">
        {products.slice(0, 4).map((p) => (
          <ProductCard key={p.id} {...p} />
        ))}
      </ProductGrid>
    </div>

    <div style={{ padding: '16px' }}>
      <ProductGrid title="✨ Rekomendasi Untukmu" seeAllHref="#rekomendasi">
        {products.map((p) => (
          <ProductCard key={p.id} {...p} />
        ))}
      </ProductGrid>
    </div>

    {/* Trust Badges */}
    <div style={{ padding: '16px' }}>
      <TrustBadges variant="expanded" />
    </div>

    {/* Footer */}
    <div style={{
      padding: '24px 16px', backgroundColor: 'var(--ciamik-surface)',
      borderTop: '1px solid var(--ciamik-border-faint)', textAlign: 'center',
      marginTop: 16,
    }}>
      <p style={{ font: 'var(--text-caption)', color: 'var(--ciamik-text-tertiary)' }}>
        © 2026 ciamik.id — Belanja dengan percaya diri.
      </p>
    </div>

    {/* Bottom Nav placeholder */}
    <div style={{
      position: 'sticky', bottom: 0, backgroundColor: 'var(--ciamik-surface)',
      padding: '10px 0', display: 'flex', justifyContent: 'space-around',
      borderTop: '1px solid var(--ciamik-border-faint)',
      font: 'var(--text-caption)', color: 'var(--ciamik-text-tertiary)',
    }}>
      {['🏠 Home', '🔍 Cari', '🛒 Cart', '❤️ Wishlist', '👤 Akun'].map((item) => (
        <span key={item} style={{ textAlign: 'center', fontSize: 11, cursor: 'pointer' }}>
          {item}
        </span>
      ))}
    </div>
  </div>
);

const meta: Meta = {
  title: 'Showcase/Storefront Home',
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj;

export const Mobile: Story = {
  render: () => <StorefrontHomePage />,
};
