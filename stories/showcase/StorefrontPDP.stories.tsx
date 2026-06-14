import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Star, Heart, ShareNetwork, ShoppingCart, ChatCircleText, ArrowLeft } from '@phosphor-icons/react';
import { CiamikProvider } from '../../src/provider/CiamikProvider';
import { Button } from '../../src/primitives/Button/Button';
import { Sheet } from '../../src/primitives/Sheet/Sheet';
import { useToast } from '../../src/hooks/useToast';
import { ProductCard } from '../../src/blocks/ProductCard/ProductCard';
import { ProductGrid } from '../../src/blocks/ProductGrid/ProductGrid';
import { TrustBadges } from '../../src/blocks/TrustBadges/TrustBadges';

const relatedProducts = [
  {
    id: 101,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
    name: 'Sepatu Sneakers Running Boost V2',
    category: 'Fashion',
    rating: 4.7,
    soldCount: 120,
    price: 399000,
    originalPrice: 499000,
    discountPercent: 20,
    badges: [{ type: 'free', text: '🚚 Bebas Ongkir' }],
  },
  {
    id: 102,
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&q=80',
    name: 'Sepatu Running Primeknit Premium',
    category: 'Fashion',
    rating: 4.8,
    soldCount: 95,
    price: 650000,
    badges: [{ type: 'instant', text: '🚀 Instan' }],
  },
  {
    id: 103,
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&q=80',
    name: 'Sneakers Casual Pastel Edition',
    category: 'Fashion',
    rating: 4.9,
    soldCount: 450,
    price: 499000,
  },
];

const PDPSimple = () => {
  const { toast } = useToast();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedColor, setSelectedColor] = useState('Hitam');
  const [selectedSize, setSelectedSize] = useState('42');
  const [activeTab, setActiveTab] = useState<'desc' | 'spec'>('desc');
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const colors = ['Hitam', 'Biru Navy', 'Putih'];
  const sizes = ['40', '41', '42', '43', '44'];

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast(
      !isWishlisted
        ? 'Produk berhasil ditambahkan ke Wishlist!'
        : 'Produk dihapus dari Wishlist.',
      !isWishlisted ? 'success' : 'info'
    );
  };

  const handleAddToCart = () => {
    setCartCount(prev => prev + 1);
    toast(`Berhasil menambahkan Sepatu Running Ultra Boost (${selectedColor} - Size ${selectedSize}) ke keranjang!`, 'success');
    setIsSheetOpen(false);
  };

  const handleBuyNow = () => {
    toast(`Lanjut ke pembayaran untuk Sepatu Running Ultra Boost (${selectedColor} - Size ${selectedSize})`, 'info');
    setIsSheetOpen(false);
  };

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', backgroundColor: 'var(--ciamik-bg)', minHeight: '100vh', paddingBottom: 80, position: 'relative' }}>
      {/* Top Navigation */}
      <div style={{
        padding: '12px 16px',
        backgroundColor: 'var(--ciamik-surface)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--ciamik-border-faint)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ciamik-ink)' }}>
          <ArrowLeft size={20} weight="bold" />
        </button>
        <span style={{ font: 'var(--text-h3)', color: 'var(--ciamik-ink)', fontWeight: 600 }}>Detail Produk</span>
        <div style={{ display: 'flex', gap: 12 }}>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ciamik-ink)' }}>
            <ShareNetwork size={20} />
          </button>
          <div style={{ position: 'relative' }}>
            <ShoppingCart size={20} color="var(--ciamik-ink)" />
            {cartCount > 0 && (
              <span style={{
                position: 'absolute',
                top: -6,
                right: -6,
                backgroundColor: 'var(--ciamik-accent)',
                color: 'white',
                fontSize: 10,
                fontWeight: 'bold',
                padding: '2px 6px',
                borderRadius: 'var(--r-pill)',
              }}>
                {cartCount}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Image Gallery */}
      <div style={{ position: 'relative', backgroundColor: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <img
          src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80"
          alt="Sepatu Running Ultra Boost"
          style={{ width: '100%', height: 320, objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute',
          bottom: 12,
          right: 12,
          backgroundColor: 'rgba(0,0,0,0.6)',
          color: 'white',
          padding: '4px 8px',
          borderRadius: 'var(--r-sm)',
          font: 'var(--text-caption)',
        }}>
          1 / 3
        </div>
      </div>

      {/* Product Information */}
      <div style={{ padding: 16, backgroundColor: 'var(--ciamik-surface)', marginBottom: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span style={{
              backgroundColor: 'var(--ciamik-primary-bg)',
              color: 'var(--ciamik-primary-text)',
              font: 'var(--text-caption)',
              fontWeight: 600,
              padding: '4px 8px',
              borderRadius: 'var(--r-sm)',
            }}>⚡ Flash Sale</span>
            <span style={{
              backgroundColor: 'var(--ciamik-success-bg, #E8F5E9)',
              color: 'var(--ciamik-success, #2E7D32)',
              font: 'var(--text-caption)',
              fontWeight: 600,
              padding: '4px 8px',
              borderRadius: 'var(--r-sm)',
            }}>🚚 Bebas Ongkir</span>
          </div>
          <button
            onClick={handleWishlist}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: isWishlisted ? 'var(--ciamik-red-600, #C0392B)' : 'var(--ciamik-text-tertiary)' }}
          >
            <Heart size={24} weight={isWishlisted ? 'fill' : 'regular'} />
          </button>
        </div>

        <h1 style={{ font: 'var(--text-h2)', color: 'var(--ciamik-ink)', marginBottom: 8, fontWeight: 700 }}>
          Sepatu Sneakers Running Ultra Boost
        </h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', color: '#FFB300' }}>
            <Star size={16} weight="fill" />
            <span style={{ font: 'var(--text-body)', fontWeight: 600, color: 'var(--ciamik-ink)', marginLeft: 4 }}>4.9</span>
          </div>
          <span style={{ font: 'var(--text-caption)', color: 'var(--ciamik-text-secondary)' }}>·</span>
          <span style={{ font: 'var(--text-caption)', color: 'var(--ciamik-text-secondary)' }}>1.2rb Rating</span>
          <span style={{ font: 'var(--text-caption)', color: 'var(--ciamik-text-secondary)' }}>·</span>
          <span style={{ font: 'var(--text-caption)', color: 'var(--ciamik-text-secondary)' }}>3.4rb Terjual</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ font: 'var(--text-display)', color: 'var(--ciamik-primary)', fontWeight: 800 }}>Rp 450.000</span>
          <span style={{ font: 'var(--text-body)', color: 'var(--ciamik-text-tertiary)', textDecoration: 'line-through' }}>Rp 900.000</span>
          <span style={{
            fontSize: 11,
            fontWeight: 700,
            color: 'var(--ciamik-accent)',
            backgroundColor: 'var(--ciamik-accent-bg, #FFEEE6)',
            padding: '2px 6px',
            borderRadius: 'var(--r-sm)',
          }}>-50%</span>
        </div>
      </div>

      {/* Variant Selector Button Trigger */}
      <div
        onClick={() => setIsSheetOpen(true)}
        style={{
          padding: 16,
          backgroundColor: 'var(--ciamik-surface)',
          marginBottom: 8,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          borderBottom: '1px solid var(--ciamik-border-faint)',
        }}
      >
        <div>
          <span style={{ font: 'var(--text-small)', color: 'var(--ciamik-text-secondary)', display: 'block' }}>Pilih Varian</span>
          <span style={{ font: 'var(--text-body)', fontWeight: 600, color: 'var(--ciamik-ink)' }}>
            Warna: {selectedColor}, Ukuran: {selectedSize}
          </span>
        </div>
        <span style={{ font: 'var(--text-h3)', color: 'var(--ciamik-text-secondary)' }}>›</span>
      </div>

      {/* Tab Description / Spec */}
      <div style={{ backgroundColor: 'var(--ciamik-surface)', marginBottom: 8 }}>
        <div style={{ display: 'flex', borderBottom: '1px solid var(--ciamik-border-faint)' }}>
          <button
            onClick={() => setActiveTab('desc')}
            style={{
              flex: 1,
              padding: 14,
              background: 'none',
              border: 'none',
              font: 'var(--text-body)',
              fontWeight: activeTab === 'desc' ? 600 : 400,
              color: activeTab === 'desc' ? 'var(--ciamik-primary)' : 'var(--ciamik-text-secondary)',
              borderBottom: activeTab === 'desc' ? '2px solid var(--ciamik-primary)' : 'none',
              cursor: 'pointer',
            }}
          >
            Deskripsi
          </button>
          <button
            onClick={() => setActiveTab('spec')}
            style={{
              flex: 1,
              padding: 14,
              background: 'none',
              border: 'none',
              font: 'var(--text-body)',
              fontWeight: activeTab === 'spec' ? 600 : 400,
              color: activeTab === 'spec' ? 'var(--ciamik-primary)' : 'var(--ciamik-text-secondary)',
              borderBottom: activeTab === 'spec' ? '2px solid var(--ciamik-primary)' : 'none',
              cursor: 'pointer',
            }}
          >
            Spesifikasi
          </button>
        </div>
        <div style={{ padding: 16 }}>
          {activeTab === 'desc' ? (
            <p style={{ font: 'var(--text-small)', color: 'var(--ciamik-text-secondary)', lineHeight: '1.6' }}>
              Sepatu Sneakers Running Ultra Boost dirancang khusus untuk performa lari maksimal dan kenyamanan sehari-hari. 
              Dilengkapi dengan teknologi upper rajut Primeknit yang fleksibel menyesuaikan bentuk kaki, serta midsole Boost 
              responsif yang mengembalikan energi pada setiap langkah Anda. Cocok untuk lari jarak jauh maupun aktivitas santai.
            </p>
          ) : (
            <table style={{ width: '100%', font: 'var(--text-small)', borderCollapse: 'collapse', color: 'var(--ciamik-text-secondary)' }}>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--ciamik-border-faint)' }}>
                  <td style={{ padding: '8px 0', fontWeight: 600 }}>Bahan Upper</td>
                  <td style={{ padding: '8px 0', textAlign: 'right' }}>Primeknit Rajut Premium</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--ciamik-border-faint)' }}>
                  <td style={{ padding: '8px 0', fontWeight: 600 }}>Midsole</td>
                  <td style={{ padding: '8px 0', textAlign: 'right' }}>Ultra Boost Energy Return</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--ciamik-border-faint)' }}>
                  <td style={{ padding: '8px 0', fontWeight: 600 }}>Outsole</td>
                  <td style={{ padding: '8px 0', textAlign: 'right' }}>Continental™ Rubber</td>
                </tr>
                <tr>
                  <td style={{ padding: '8px 0', fontWeight: 600 }}>Rekomendasi</td>
                  <td style={{ padding: '8px 0', textAlign: 'right' }}>Running & Lifestyle</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Trust Badges */}
      <div style={{ padding: '8px 16px', backgroundColor: 'var(--ciamik-surface)', marginBottom: 8 }}>
        <TrustBadges variant="compact" />
      </div>

      {/* Related Products */}
      <div style={{ padding: 16, backgroundColor: 'var(--ciamik-surface)' }}>
        <ProductGrid title="Produk Terkait" seeAllHref="#related">
          {relatedProducts.map(p => (
            <ProductCard key={p.id} {...p} />
          ))}
        </ProductGrid>
      </div>

      {/* Bottom Sticky Action Panel */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 480,
        padding: '12px 16px',
        backgroundColor: 'var(--ciamik-surface)',
        borderTop: '1px solid var(--ciamik-border-faint)',
        display: 'flex',
        gap: 12,
        alignItems: 'center',
        boxShadow: 'var(--sh-up)',
        zIndex: 10,
      }}>
        <button style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'none',
          border: 'none',
          color: 'var(--ciamik-text-secondary)',
          cursor: 'pointer',
        }}>
          <ChatCircleText size={20} />
          <span style={{ fontSize: 10, marginTop: 2 }}>Chat</span>
        </button>
        
        <div style={{ height: 24, borderRight: '1px solid var(--ciamik-border-faint)' }} />

        <Button
          variant="secondary"
          onClick={() => setIsSheetOpen(true)}
          style={{ flex: 1 }}
        >
          Beli Langsung
        </Button>
        <Button
          variant="primary"
          onClick={() => setIsSheetOpen(true)}
          style={{ flex: 1 }}
        >
          + Keranjang
        </Button>
      </div>

      {/* Variant Bottom Sheet Drawer */}
      <Sheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        title="Pilih Warna & Ukuran"
      >
        <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
          <img
            src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&q=80"
            alt="Product Preview"
            style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 'var(--r-md)' }}
          />
          <div>
            <h4 style={{ font: 'var(--text-body)', fontWeight: 600, color: 'var(--ciamik-ink)', margin: 0 }}>
              Sepatu Running Ultra Boost
            </h4>
            <div style={{ font: 'var(--text-h3)', color: 'var(--ciamik-primary)', fontWeight: 700, marginTop: 4 }}>
              Rp 450.000
            </div>
            <div style={{ font: 'var(--text-caption)', color: 'var(--ciamik-text-secondary)', marginTop: 4 }}>
              Stok: Tersedia (Sisa 12)
            </div>
          </div>
        </div>

        {/* Color Options */}
        <div style={{ marginBottom: 20 }}>
          <span style={{ font: 'var(--text-small)', fontWeight: 600, color: 'var(--ciamik-ink)', display: 'block', marginBottom: 8 }}>
            Warna
          </span>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {colors.map(color => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 'var(--r-md)',
                  font: 'var(--text-small)',
                  cursor: 'pointer',
                  border: selectedColor === color ? '1.5px solid var(--ciamik-primary)' : '1px solid var(--ciamik-border-faint)',
                  backgroundColor: selectedColor === color ? 'var(--ciamik-primary-bg)' : 'var(--ciamik-surface)',
                  color: selectedColor === color ? 'var(--ciamik-primary-text)' : 'var(--ciamik-ink)',
                  fontWeight: selectedColor === color ? 600 : 400,
                  transition: 'all var(--dur-base) var(--ease)',
                }}
              >
                {color}
              </button>
            ))}
          </div>
        </div>

        {/* Size Options */}
        <div style={{ marginBottom: 32 }}>
          <span style={{ font: 'var(--text-small)', fontWeight: 600, color: 'var(--ciamik-ink)', display: 'block', marginBottom: 8 }}>
            Ukuran
          </span>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {sizes.map(size => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 'var(--r-md)',
                  font: 'var(--text-small)',
                  cursor: 'pointer',
                  border: selectedSize === size ? '1.5px solid var(--ciamik-primary)' : '1px solid var(--ciamik-border-faint)',
                  backgroundColor: selectedSize === size ? 'var(--ciamik-primary-bg)' : 'var(--ciamik-surface)',
                  color: selectedSize === size ? 'var(--ciamik-primary-text)' : 'var(--ciamik-ink)',
                  fontWeight: selectedSize === size ? 600 : 400,
                  transition: 'all var(--dur-base) var(--ease)',
                }}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Purchase / Add to Cart CTA inside Bottom Sheet */}
        <div style={{ display: 'flex', gap: 12 }}>
          <Button
            variant="secondary"
            onClick={handleBuyNow}
            style={{ flex: 1 }}
          >
            Beli Sekarang
          </Button>
          <Button
            variant="primary"
            onClick={handleAddToCart}
            style={{ flex: 1 }}
          >
            Tambah ke Keranjang
          </Button>
        </div>
      </Sheet>
    </div>
  );
};

const StorefrontPDPPage = () => {
  return (
    <CiamikProvider>
      <PDPSimple />
    </CiamikProvider>
  );
};

const meta: Meta = {
  title: 'Showcase/Storefront PDP',
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj;

export const Mobile: Story = {
  render: () => <StorefrontPDPPage />,
};
