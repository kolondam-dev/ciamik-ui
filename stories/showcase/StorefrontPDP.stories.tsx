import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Star,
  Heart,
  ShareNetwork,
  ShoppingCart,
  ChatCircleText,
  ArrowLeft,
  House,
  User,
  Plus,
  Minus,
  Trash,
  CaretRight,
  SignOut
} from '@phosphor-icons/react';
import { CiamikProvider } from '../../src/provider/CiamikProvider';
import { Button } from '../../src/primitives/Button/Button';
import { Sheet } from '../../src/primitives/Sheet/Sheet';
import { BottomNav } from '../../src/patterns/BottomNav/BottomNav';
import { useToast } from '../../src/hooks/useToast';
import { ProductCard } from '../../src/blocks/ProductCard/ProductCard';
import { ProductGrid } from '../../src/blocks/ProductGrid/ProductGrid';
import { TrustBadges } from '../../src/blocks/TrustBadges/TrustBadges';
import { OTPFlow } from '../../src/blocks/OTPFlow/OTPFlow';

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
];

const PDPSimple = () => {
  const { toast } = useToast();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedColor, setSelectedColor] = useState('Hitam');
  const [selectedSize, setSelectedSize] = useState('42');
  const [activeTab, setActiveTab] = useState<'desc' | 'spec'>('desc');
  
  // Sheet states
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  // Login states
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [showProfileOTP, setShowProfileOTP] = useState(false);
  const [phoneInput, setPhoneInput] = useState('');

  // Items State
  const [wishlistedRelatedIds, setWishlistedRelatedIds] = useState<number[]>([]);
  const [cartItems, setCartItems] = useState<{ id: number; qty: number; color?: string; size?: string }[]>([]);

  const wishlistCount = (isWishlisted ? 1 : 0) + wishlistedRelatedIds.length;
  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

  const colors = ['Hitam', 'Biru Navy', 'Putih'];
  const sizes = ['40', '41', '42', '43', '44'];

  const handleWishlist = () => {
    const nextState = !isWishlisted;
    setIsWishlisted(nextState);
    toast(
      nextState
        ? 'Produk berhasil ditambahkan ke Wishlist!'
        : 'Produk dihapus dari Wishlist.',
      nextState ? 'success' : 'info'
    );
  };

  const handleRelatedWishlistToggle = (id: number | string) => {
    const numId = Number(id);
    const isLiked = wishlistedRelatedIds.includes(numId);
    if (isLiked) {
      setWishlistedRelatedIds((prev) => prev.filter((x) => x !== numId));
      toast('Produk dihapus dari Wishlist.', 'info');
    } else {
      setWishlistedRelatedIds((prev) => [...prev, numId]);
      toast('Produk berhasil ditambahkan ke Wishlist!', 'success');
    }
  };

  const handleAddToCart = () => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === 1 && item.color === selectedColor && item.size === selectedSize);
      if (existing) {
        return prev.map((item) =>
          item.id === 1 && item.color === selectedColor && item.size === selectedSize
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }
      return [...prev, { id: 1, qty: 1, color: selectedColor, size: selectedSize }];
    });
    toast(`Berhasil menambahkan Sepatu Running Ultra Boost (${selectedColor} - Size ${selectedSize}) ke keranjang!`, 'success');
    setIsSheetOpen(false);
  };

  const handleAddRelatedToCart = (id: number) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === id);
      if (existing) {
        return prev.map((item) => (item.id === id ? { ...item, qty: item.qty + 1 } : item));
      }
      return [...prev, { id, qty: 1 }];
    });
    toast('Produk ditambahkan ke Keranjang!', 'success');
  };

  const handleBuyNow = () => {
    toast(`Lanjut ke pembayaran untuk Sepatu Running Ultra Boost (${selectedColor} - Size ${selectedSize})`, 'info');
    setIsSheetOpen(false);
  };

  const handleUpdateCartQty = (id: number, newQty: number, color?: string, size?: string) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === id && item.color === color && item.size === size);
      if (!existing) return prev;
      if (newQty <= 0) {
        return prev.filter((item) => !(item.id === id && item.color === color && item.size === size));
      }
      return prev.map((item) =>
        item.id === id && item.color === color && item.size === size ? { ...item, qty: newQty } : item
      );
    });
  };

  const cartSubtotal = cartItems.reduce((sum, item) => {
    if (item.id === 1) {
      return sum + 450000 * item.qty;
    }
    const rProd = relatedProducts.find((p) => p.id === item.id);
    return sum + (rProd ? rProd.price * item.qty : 0);
  }, 0);

  const bottomNavItems = [
    { key: 'home', label: 'Beranda', icon: <House size={20} />, onClick: () => { setIsCartOpen(false); setIsWishlistOpen(false); setIsProfileOpen(false); toast('Pindah ke Beranda', 'info'); } },
    { key: 'wishlist', label: 'Wishlist', icon: <Heart size={20} />, badgeCount: wishlistCount, onClick: () => { setIsWishlistOpen(true); setIsCartOpen(false); setIsProfileOpen(false); } },
    { key: 'cart', label: 'Cart', icon: <ShoppingCart size={20} />, badgeCount: cartCount, onClick: () => { setIsCartOpen(true); setIsWishlistOpen(false); setIsProfileOpen(false); } },
    { key: 'profile', label: 'Profil', icon: <User size={20} />, onClick: () => { setIsProfileOpen(true); setIsCartOpen(false); setIsWishlistOpen(false); } },
  ];

  const shouldShowStickyActionPanel = !isSheetOpen && !isCartOpen && !isWishlistOpen && !isProfileOpen;
  const shouldShowBottomNav = !isSheetOpen && !isCartOpen && !isWishlistOpen && !isProfileOpen;

  return (
    <div style={{
      maxWidth: 480,
      margin: '0 auto',
      backgroundColor: 'var(--ciamik-bg)',
      minHeight: '100vh',
      paddingBottom: 136,
      position: 'relative',
      overflow: 'hidden',
      overscrollBehaviorY: 'contain'
    }}>
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
          <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setIsCartOpen(true)}>
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
            <ProductCard
              key={p.id}
              {...p}
              id={p.id}
              isWishlisted={wishlistedRelatedIds.includes(p.id)}
              onWishlistToggle={handleRelatedWishlistToggle}
              onAddToCart={() => handleAddRelatedToCart(p.id)}
            />
          ))}
        </ProductGrid>
      </div>

      {/* Bottom Sticky Action Panel - shifted up by 56px to not overlap BottomNav, unless variant sheet is open */}
      {shouldShowStickyActionPanel && (
        <div style={{
          position: 'fixed',
          bottom: 56, // Sits exactly on top of bottom navbar
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
          zIndex: 890, // lower than BottomNav and Sheet overlay
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
      )}

      {/* Real Floating Bottom Navigation */}
      {shouldShowBottomNav && (
        <BottomNav items={bottomNavItems} />
      )}

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

      {/* Cart Bottom Sheet */}
      <Sheet isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} title="Keranjang Belanja">
        {cartItems.length === 0 ? (
          <div style={{ padding: '40px 16px', textAlign: 'center', color: 'var(--ciamik-text-secondary)' }}>
            <ShoppingCart size={48} style={{ opacity: 0.3, marginBottom: 12 }} />
            <p style={{ margin: 0, fontSize: 14 }}>Keranjang belanja Anda kosong.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 300, overflowY: 'auto' }}>
              {cartItems.map((item, idx) => {
                const isMain = item.id === 1;
                const name = isMain ? 'Sepatu Running Ultra Boost' : (relatedProducts.find((p) => p.id === item.id)?.name || 'Produk Terkait');
                const price = isMain ? 450000 : (relatedProducts.find((p) => p.id === item.id)?.price || 0);
                const image = isMain ? 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&q=80' : (relatedProducts.find((p) => p.id === item.id)?.image || '');
                const variantLabel = isMain ? `${item.color} / ${item.size}` : '';

                return (
                  <div key={idx} style={{ display: 'flex', gap: 12, alignItems: 'center', paddingBottom: 12, borderBottom: '1px solid var(--ciamik-border-faint)' }}>
                    <img src={image} alt={name} style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 'var(--r-sm)' }} />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: 13, fontWeight: 600, margin: 0, color: 'var(--ciamik-ink)' }}>{name}</h4>
                      {variantLabel && <p style={{ fontSize: 11, color: 'var(--ciamik-text-secondary)', margin: '2px 0 0' }}>{variantLabel}</p>}
                      <p style={{ fontSize: 12, color: 'var(--ciamik-primary)', fontWeight: 700, margin: '4px 0 0' }}>
                        Rp {price.toLocaleString('id-ID')}
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <button
                        onClick={() => handleUpdateCartQty(item.id, item.qty - 1, item.color, item.size)}
                        style={{ width: 24, height: 24, borderRadius: '50%', border: '1px solid var(--ciamik-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ciamik-ink)' }}
                      >
                        <Minus size={12} />
                      </button>
                      <span style={{ fontSize: 13, fontWeight: 600, minWidth: 16, textAlign: 'center' }}>{item.qty}</span>
                      <button
                        onClick={() => handleUpdateCartQty(item.id, item.qty + 1, item.color, item.size)}
                        style={{ width: 24, height: 24, borderRadius: '50%', border: '1px solid var(--ciamik-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ciamik-ink)' }}
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div style={{ marginTop: 8, padding: 12, backgroundColor: 'var(--ciamik-bg-hover)', borderRadius: 'var(--r-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 700, color: 'var(--ciamik-ink)' }}>
                <span>Subtotal</span>
                <span>Rp {cartSubtotal.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <button
              onClick={() => {
                toast('Melanjutkan ke Halaman Checkout...', 'info');
                setIsCartOpen(false);
              }}
              style={{ width: '100%', padding: '14px', backgroundColor: 'var(--ciamik-accent)', color: '#fff', borderRadius: 'var(--r-md)', fontWeight: 700, border: 'none', cursor: 'pointer', textAlign: 'center' }}
            >
              Lanjut ke Checkout
            </button>
          </div>
        )}
      </Sheet>

      {/* Wishlist Bottom Sheet */}
      <Sheet isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} title="Wishlist Saya">
        {wishlistCount === 0 ? (
          <div style={{ padding: '40px 16px', textAlign: 'center', color: 'var(--ciamik-text-secondary)' }}>
            <Heart size={48} style={{ opacity: 0.3, marginBottom: 12 }} />
            <p style={{ margin: 0, fontSize: 14 }}>Belum ada produk di wishlist.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 350, overflowY: 'auto' }}>
            {/* Main Product Wishlist */}
            {isWishlisted && (
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', paddingBottom: 12, borderBottom: '1px solid var(--ciamik-border-faint)' }}>
                <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&q=80" alt="Sepatu Running Ultra Boost" style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 'var(--r-sm)' }} />
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: 13, fontWeight: 600, margin: 0, color: 'var(--ciamik-ink)' }}>Sepatu Sneakers Running Ultra Boost</h4>
                  <p style={{ fontSize: 12, color: 'var(--ciamik-primary)', fontWeight: 700, margin: '4px 0 0' }}>
                    Rp 450.000
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    onClick={() => {
                      setIsSheetOpen(true);
                      setIsWishlisted(false);
                    }}
                    style={{ padding: '6px 10px', fontSize: 11, backgroundColor: 'var(--ciamik-primary)', color: '#fff', borderRadius: 'var(--r-sm)', fontWeight: 600 }}
                  >
                    + Keranjang
                  </button>
                  <button
                    onClick={() => handleWishlist()}
                    style={{ padding: '6px', backgroundColor: 'var(--ciamik-bg-hover)', border: '1px solid var(--ciamik-border-faint)', borderRadius: 'var(--r-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Trash size={14} color="var(--ciamik-red-600)" />
                  </button>
                </div>
              </div>
            )}

            {/* Related Products Wishlist */}
            {wishlistedRelatedIds.map((id) => {
              const prod = relatedProducts.find((p) => p.id === id);
              if (!prod) return null;
              return (
                <div key={id} style={{ display: 'flex', gap: 12, alignItems: 'center', paddingBottom: 12, borderBottom: '1px solid var(--ciamik-border-faint)' }}>
                  <img src={prod.image} alt={prod.name} style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 'var(--r-sm)' }} />
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: 13, fontWeight: 600, margin: 0, color: 'var(--ciamik-ink)' }}>{prod.name}</h4>
                    <p style={{ fontSize: 12, color: 'var(--ciamik-primary)', fontWeight: 700, margin: '4px 0 0' }}>
                      Rp {prod.price.toLocaleString('id-ID')}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      onClick={() => {
                        handleAddRelatedToCart(id);
                        handleRelatedWishlistToggle(id);
                      }}
                      style={{ padding: '6px 10px', fontSize: 11, backgroundColor: 'var(--ciamik-primary)', color: '#fff', borderRadius: 'var(--r-sm)', fontWeight: 600 }}
                    >
                      + Keranjang
                    </button>
                    <button
                      onClick={() => handleRelatedWishlistToggle(id)}
                      style={{ padding: '6px', backgroundColor: 'var(--ciamik-bg-hover)', border: '1px solid var(--ciamik-border-faint)', borderRadius: 'var(--r-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <Trash size={14} color="var(--ciamik-red-600)" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Sheet>

      {/* Profile Page (Full Right Sidebar Drawer) */}
      <AnimatePresence>
        {isProfileOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 220 }}
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              width: '100%',
              backgroundColor: 'var(--ciamik-surface)',
              zIndex: 1000,
              display: 'flex',
              flexDirection: 'column',
              overscrollBehaviorY: 'contain'
            }}
          >
            {/* Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              padding: '16px',
              borderBottom: '1px solid var(--ciamik-border-faint)',
              backgroundColor: 'var(--ciamik-surface)'
            }}>
              <button
                onClick={() => setIsProfileOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', marginRight: '12px' }}
              >
                <ArrowLeft size={20} weight="bold" color="var(--ciamik-ink)" />
              </button>
              <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--ciamik-ink)' }}>Profil Saya</span>
            </div>

            {/* Content Body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px', backgroundColor: 'var(--ciamik-bg)' }}>
              {isLoggedIn ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '16px',
                    padding: 16, backgroundColor: 'var(--ciamik-surface)',
                    borderRadius: 'var(--r-lg)', border: '1px solid var(--ciamik-border-faint)'
                  }}>
                    <div style={{
                      width: '56px', height: '56px', borderRadius: '50%',
                      backgroundColor: 'var(--ciamik-primary-bg)', display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      color: 'var(--ciamik-primary)', fontSize: '20px', fontWeight: 800
                    }}>
                      AM
                    </div>
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: 'var(--ciamik-ink)' }}>Ahmad Maulana</h3>
                      <p style={{ fontSize: '13px', color: 'var(--ciamik-text-secondary)', margin: '4px 0 0' }}>+62 812 3456 7890</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{
                      padding: 14, backgroundColor: 'var(--ciamik-surface)',
                      borderRadius: 'var(--r-md)', border: '1px solid var(--ciamik-border-faint)',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer'
                    }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ciamik-ink)' }}>Daftar Transaksi</span>
                      <CaretRight size={16} color="var(--ciamik-text-secondary)" />
                    </div>
                    <div style={{
                      padding: 14, backgroundColor: 'var(--ciamik-surface)',
                      borderRadius: 'var(--r-md)', border: '1px solid var(--ciamik-border-faint)',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer'
                    }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ciamik-ink)' }}>Daftar Alamat</span>
                      <CaretRight size={16} color="var(--ciamik-text-secondary)" />
                    </div>
                    <div style={{
                      padding: 14, backgroundColor: 'var(--ciamik-surface)',
                      borderRadius: 'var(--r-md)', border: '1px solid var(--ciamik-border-faint)',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer'
                    }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ciamik-ink)' }}>Kupon Saya</span>
                      <CaretRight size={16} color="var(--ciamik-text-secondary)" />
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setIsLoggedIn(false);
                      toast('Berhasil keluar akun.', 'info');
                    }}
                    style={{
                      width: '100%', padding: '14px', border: 'none',
                      backgroundColor: 'var(--ciamik-danger-bg, #FCE8E6)',
                      color: 'var(--ciamik-danger, #C0392B)',
                      borderRadius: 'var(--r-md)', fontWeight: 700, fontSize: 13,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer'
                    }}
                  >
                    <SignOut size={16} /> Keluar Akun
                  </button>
                </div>
              ) : (
                <div style={{
                  padding: 20, backgroundColor: 'var(--ciamik-surface)',
                  borderRadius: 'var(--r-lg)', border: '1px solid var(--ciamik-border-faint)'
                }}>
                  {showProfileOTP ? (
                    <OTPFlow
                      initialPhone={phoneInput}
                      onSendOTP={async () => { await new Promise((r) => setTimeout(r, 600)); return true; }}
                      onVerifyOTP={async (code) => { await new Promise((r) => setTimeout(r, 600)); return code === '1234'; }}
                      onSuccess={() => {
                        setIsLoggedIn(true);
                        setShowProfileOTP(false);
                        toast('Login berhasil!', 'success');
                      }}
                      onCancel={() => setShowProfileOTP(false)}
                    />
                  ) : (
                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px', color: 'var(--ciamik-ink)' }}>Masuk ke ciamik.id</h3>
                      <p style={{ fontSize: '12px', color: 'var(--ciamik-text-secondary)', marginBottom: '20px', lineHeight: 1.5 }}>
                        Nikmati kemudahan transaksi, pelacakan pesanan, dan berbagai voucher diskon khusus.
                      </p>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '6px', color: 'var(--ciamik-text-secondary)', textTransform: 'uppercase' }}>Nomor Ponsel</label>
                          <input
                            type="tel"
                            placeholder="Contoh: 081234567890"
                            value={phoneInput}
                            onChange={(e) => setPhoneInput(e.target.value)}
                            style={{
                              width: '100%', padding: '12px', border: '1.5px solid var(--ciamik-border)',
                              borderRadius: 'var(--r-md)', fontSize: '14px', backgroundColor: 'var(--ciamik-bg)',
                              color: 'var(--ciamik-ink)', outline: 'none'
                            }}
                          />
                        </div>
                        
                        <button
                          onClick={() => {
                            if (!phoneInput) {
                              toast('Nomor ponsel wajib diisi!', 'error');
                              return;
                            }
                            setShowProfileOTP(true);
                          }}
                          style={{
                            width: '100%', padding: '14px', border: 'none',
                            backgroundColor: 'var(--ciamik-primary)', color: '#fff',
                            borderRadius: 'var(--r-md)', fontWeight: 700, fontSize: '14px', cursor: 'pointer'
                          }}
                        >
                          Lanjut dengan OTP
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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

