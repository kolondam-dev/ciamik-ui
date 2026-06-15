import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { AnimatePresence, motion } from 'framer-motion';
import { ProductCard } from '../../src/blocks/ProductCard/ProductCard';
import { ProductGrid } from '../../src/blocks/ProductGrid/ProductGrid';
import { TrustBadges } from '../../src/blocks/TrustBadges/TrustBadges';
import { HeroBanner } from '../../src/blocks/HeroBanner/HeroBanner';
import { BottomNav } from '../../src/patterns/BottomNav/BottomNav';
import { CiamikProvider } from '../../src/provider/CiamikProvider';
import { useToast } from '../../src/hooks/useToast';
import { Sheet } from '../../src/primitives/Sheet/Sheet';
import { OTPFlow } from '../../src/blocks/OTPFlow/OTPFlow';
import { useMediaQuery } from '../../src/hooks/useMediaQuery';
import {
  House,
  Heart,
  ShoppingCart,
  User,
  MagnifyingGlass,
  ArrowLeft,
  SignOut,
  CaretRight,
  Trash,
  Plus,
  Minus,
  List,
  Pencil,
  X
} from '@phosphor-icons/react';

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

const initialProducts = [
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
];

const categoryChips = ['🔥 Semua', '👗 Fashion', '📱 Elektronik', '🏠 Rumah Tangga', '💄 Kecantikan', '🎮 Gaming', '⚽ Olahraga'];

// Mock Address & Cascading region database
const mockRegionData = {
  'DKI Jakarta': {
    'Jakarta Pusat': {
      'Menteng': {
        'Menteng': '10310',
        'Pegangsaan': '10320',
        'Cikini': '10330'
      },
      'Tanah Abang': {
        'Kebon Kacang': '10240',
        'Kampung Bali': '10250'
      }
    },
    'Jakarta Selatan': {
      'Kebayoran Baru': {
        'Selong': '12110',
        'Gunung': '12120'
      },
      'Tebet': {
        'Tebet Barat': '12810',
        'Tebet Timur': '12820'
      }
    }
  },
  'Jawa Barat': {
    'Bandung': {
      'Coblong': {
        'Dago': '40135',
        'Sekeloa': '40134'
      },
      'Sumur Bandung': {
        'Braga': '40111',
        'Kebon Pisang': '40112'
      }
    },
    'Bogor': {
      'Bogor Tengah': {
        'Babakan': '16128',
        'Paledang': '16122'
      }
    }
  }
};

interface StorefrontHomePageContentProps {
  isMobileOnly?: boolean;
}

// Adaptive Drawer that serves as a Bottom Sheet on Mobile and a Right Sidebar Drawer on Desktop
const StorefrontDrawer = ({
  isOpen,
  onClose,
  title,
  children,
  isDesktop
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  isDesktop: boolean;
}) => {
  if (isDesktop) {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: '#000',
                backdropFilter: 'blur(4px)',
                zIndex: 990,
              }}
            />
            {/* Right Sidebar Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 220 }}
              style={{
                position: 'fixed',
                top: 0,
                right: 0,
                bottom: 0,
                width: '100%',
                maxWidth: 400,
                backgroundColor: 'var(--ciamik-surface)',
                boxShadow: 'var(--sh-lg)',
                borderLeft: '1px solid var(--ciamik-border-faint)',
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              {/* Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                borderBottom: '1px solid var(--ciamik-border-faint)',
                backgroundColor: 'var(--ciamik-surface)',
                flexShrink: 0,
              }}>
                <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--ciamik-ink)' }}>{title}</span>
                <button
                  onClick={onClose}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 4, color: 'var(--ciamik-text-secondary)' }}
                >
                  <X size={20} weight="bold" />
                </button>
              </div>
              {/* Body */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                {children}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  return (
    <Sheet isOpen={isOpen} onClose={onClose} title={title}>
      {children}
    </Sheet>
  );
};

const StorefrontHomePageContent: React.FC<StorefrontHomePageContentProps> = ({ isMobileOnly = false }) => {
  const { toast } = useToast();
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistedIds, setWishlistedIds] = useState<number[]>([]);
  const [cartItems, setCartItems] = useState<{ id: number; qty: number }[]>([]);

  // Viewport checking
  const isDesktopQuery = useMediaQuery('(min-width: 1024px)');
  const isDesktop = !isMobileOnly && isDesktopQuery;

  // Navigation / Panel states
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [showProfileOTP, setShowProfileOTP] = useState(false);
  const [phoneInput, setPhoneInput] = useState('');
  const [activeCategoryIdx, setActiveCategoryIdx] = useState(0);

  // Address flow states
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      label: 'Rumah',
      receiverName: 'Ahmad Maulana',
      phone: '+62 812 3456 7890',
      provinsi: 'DKI Jakarta',
      kota: 'Jakarta Pusat',
      kecamatan: 'Menteng',
      kelurahan: 'Menteng',
      postalCode: '10310',
      fullAddress: 'Jl. Sudirman No. 123',
      isDefault: true,
    }
  ]);
  const [profileTab, setProfileTab] = useState<'menu' | 'addresses' | 'address-form' | 'region-picker'>('menu');
  const [addressFormMode, setAddressFormMode] = useState<'add' | 'edit'>('add');
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null);

  // Address inputs state
  const [formLabel, setFormLabel] = useState('Rumah');
  const [formReceiverName, setFormReceiverName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formProvinsi, setFormProvinsi] = useState('');
  const [formKota, setFormKota] = useState('');
  const [formKecamatan, setFormKecamatan] = useState('');
  const [formKelurahan, setFormKelurahan] = useState('');
  const [formPostalCode, setFormPostalCode] = useState('');
  const [formFullAddress, setFormFullAddress] = useState('');
  const [formIsDefault, setFormIsDefault] = useState(false);

  // Region picker states
  const [pickerLevel, setPickerLevel] = useState<'provinsi' | 'kota' | 'kecamatan' | 'kelurahan'>('provinsi');
  const [regionSearch, setRegionSearch] = useState('');

  const handleWishlistToggle = (id: number | string) => {
    const numId = Number(id);
    const isLiked = wishlistedIds.includes(numId);
    if (isLiked) {
      setWishlistedIds((prev) => prev.filter((x) => x !== numId));
      setWishlistCount((prev) => Math.max(0, prev - 1));
      toast('Produk dihapus dari Wishlist.', 'info');
    } else {
      setWishlistedIds((prev) => [...prev, numId]);
      setWishlistCount((prev) => prev + 1);
      toast('Produk berhasil ditambahkan ke Wishlist!', 'success');
    }
  };

  const handleAddToCart = (id: number | string) => {
    const numId = Number(id);
    setCartCount((prev) => prev + 1);
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === numId);
      if (existing) {
        return prev.map((item) => (item.id === numId ? { ...item, qty: item.qty + 1 } : item));
      }
      return [...prev, { id: numId, qty: 1 }];
    });
    toast('Produk ditambahkan ke Keranjang!', 'success');
  };

  const handleUpdateCartQty = (id: number | string, newQty: number) => {
    const numId = Number(id);
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === numId);
      const oldQty = existing ? existing.qty : 0;
      const diff = newQty - oldQty;

      setCartCount((prevCount) => Math.max(0, prevCount + diff));

      if (newQty <= 0) {
        return prev.filter((item) => item.id !== numId);
      }
      return prev.map((item) => (item.id === numId ? { ...item, qty: newQty } : item));
    });
  };

  const getProductCartQty = (id: number) => {
    const item = cartItems.find((ci) => ci.id === id);
    return item ? item.qty : 0;
  };

  const cartSubtotal = cartItems.reduce((sum, item) => {
    const prod = initialProducts.find((p) => p.id === item.id);
    return sum + (prod ? prod.price * item.qty : 0);
  }, 0);

  const bottomNavItems = [
    { key: 'home', label: 'Beranda', icon: <House size={20} weight="fill" />, isActive: !isCartOpen && !isWishlistOpen && !isProfileOpen, onClick: () => { setIsCartOpen(false); setIsWishlistOpen(false); setIsProfileOpen(false); } },
    { key: 'wishlist', label: 'Wishlist', icon: <Heart size={20} />, badgeCount: wishlistCount, onClick: () => { setIsWishlistOpen(true); setIsCartOpen(false); setIsProfileOpen(false); } },
    { key: 'cart', label: 'Cart', icon: <ShoppingCart size={20} />, badgeCount: cartCount, onClick: () => { setIsCartOpen(true); setIsWishlistOpen(false); setIsProfileOpen(false); } },
    { key: 'profile', label: 'Profil', icon: <User size={20} />, onClick: () => { setIsProfileOpen(true); setIsCartOpen(false); setIsWishlistOpen(false); } },
  ];

  const shouldShowBottomNav = !isCartOpen && !isProfileOpen && !isDesktop;

  // Address handlers
  const handleOpenAddAddress = () => {
    setAddressFormMode('add');
    setEditingAddressId(null);
    setFormLabel('Rumah');
    setFormReceiverName('');
    setFormPhone('');
    setFormProvinsi('');
    setFormKota('');
    setFormKecamatan('');
    setFormKelurahan('');
    setFormPostalCode('');
    setFormFullAddress('');
    setFormIsDefault(false);
    setProfileTab('address-form');
  };

  const handleOpenEditAddress = (addr: any) => {
    setAddressFormMode('edit');
    setEditingAddressId(addr.id);
    setFormLabel(addr.label);
    setFormReceiverName(addr.receiverName);
    setFormPhone(addr.phone);
    setFormProvinsi(addr.provinsi);
    setFormKota(addr.kota);
    setFormKecamatan(addr.kecamatan);
    setFormKelurahan(addr.kelurahan);
    setFormPostalCode(addr.postalCode);
    setFormFullAddress(addr.fullAddress);
    setFormIsDefault(addr.isDefault);
    setProfileTab('address-form');
  };

  const handleSaveAddress = () => {
    if (!formReceiverName.trim() || !formPhone.trim() || !formProvinsi || !formKota || !formKecamatan || !formKelurahan || !formFullAddress.trim()) {
      toast('Wajib mengisi semua field!', 'error');
      return;
    }

    if (addressFormMode === 'add') {
      const newAddr = {
        id: Date.now(),
        label: formLabel,
        receiverName: formReceiverName,
        phone: formPhone,
        provinsi: formProvinsi,
        kota: formKota,
        kecamatan: formKecamatan,
        kelurahan: formKelurahan,
        postalCode: formPostalCode,
        fullAddress: formFullAddress,
        isDefault: formIsDefault || addresses.length === 0,
      };

      let updated = [...addresses];
      if (newAddr.isDefault) {
        updated = updated.map(a => ({ ...a, isDefault: false }));
      }
      setAddresses([...updated, newAddr]);
      toast('Alamat berhasil ditambahkan!', 'success');
    } else {
      let updated = addresses.map(addr => {
        if (addr.id === editingAddressId) {
          return {
            ...addr,
            label: formLabel,
            receiverName: formReceiverName,
            phone: formPhone,
            provinsi: formProvinsi,
            kota: formKota,
            kecamatan: formKecamatan,
            kelurahan: formKelurahan,
            postalCode: formPostalCode,
            fullAddress: formFullAddress,
            isDefault: formIsDefault,
          };
        }
        return addr;
      });

      if (formIsDefault) {
        updated = updated.map(a => a.id === editingAddressId ? a : { ...a, isDefault: false });
      }
      setAddresses(updated);
      toast('Alamat berhasil diperbarui!', 'success');
    }

    setProfileTab('addresses');
  };

  const handleDeleteAddress = (id: number) => {
    const target = addresses.find(a => a.id === id);
    if (target?.isDefault) {
      toast('Alamat utama tidak boleh dihapus!', 'error');
      return;
    }
    setAddresses(addresses.filter(a => a.id !== id));
    toast('Alamat berhasil dihapus.', 'info');
  };

  const handleSetDefaultAddress = (id: number) => {
    setAddresses(addresses.map(a => ({
      ...a,
      isDefault: a.id === id
    })));
    toast('Alamat utama berhasil diubah.', 'success');
  };

  // Region cascading calculations
  const getOptionsForLevel = () => {
    if (pickerLevel === 'provinsi') {
      return Object.keys(mockRegionData);
    }
    if (pickerLevel === 'kota') {
      return formProvinsi ? Object.keys((mockRegionData as any)[formProvinsi] || {}) : [];
    }
    if (pickerLevel === 'kecamatan') {
      return (formProvinsi && formKota) ? Object.keys((mockRegionData as any)[formProvinsi]?.[formKota] || {}) : [];
    }
    if (pickerLevel === 'kelurahan') {
      return (formProvinsi && formKota && formKecamatan) ? Object.keys((mockRegionData as any)[formProvinsi]?.[formKota]?.[formKecamatan] || {}) : [];
    }
    return [];
  };

  const options = getOptionsForLevel();
  const filteredOptions = options.filter(opt => opt.toLowerCase().includes(regionSearch.toLowerCase()));

  const handleSelectOption = (opt: string) => {
    if (pickerLevel === 'provinsi') {
      setFormProvinsi(opt);
      setFormKota('');
      setFormKecamatan('');
      setFormKelurahan('');
      setFormPostalCode('');
      setPickerLevel('kota');
    } else if (pickerLevel === 'kota') {
      setFormKota(opt);
      setFormKecamatan('');
      setFormKelurahan('');
      setFormPostalCode('');
      setPickerLevel('kecamatan');
    } else if (pickerLevel === 'kecamatan') {
      setFormKecamatan(opt);
      setFormKelurahan('');
      setFormPostalCode('');
      setPickerLevel('kelurahan');
    } else if (pickerLevel === 'kelurahan') {
      setFormKelurahan(opt);
      const code = (mockRegionData as any)[formProvinsi]?.[formKota]?.[formKecamatan]?.[opt] || '';
      setFormPostalCode(code);
      setProfileTab('address-form');
    }
    setRegionSearch('');
  };

  return (
    <div style={{
      width: '100%',
      backgroundColor: 'var(--ciamik-bg)',
      minHeight: '100vh',
      position: 'relative',
      overflowX: 'hidden',
    }}>
      {/* Topbar Header */}
      {isDesktop ? (
        <div style={{
          width: '100%',
          backgroundColor: 'var(--ciamik-surface)',
          borderBottom: '1px solid var(--ciamik-border-faint)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}>
          <div style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: '12px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 28, flex: 1 }}>
              <span
                style={{ font: 'var(--text-h2)', color: 'var(--ciamik-primary)', fontWeight: 800, cursor: 'pointer', letterSpacing: '-0.02em' }}
                onClick={() => { setIsCartOpen(false); setIsWishlistOpen(false); setIsProfileOpen(false); }}
              >
                ciamik.id
              </span>
              <div style={{
                width: 320,
                padding: '8px 14px',
                backgroundColor: 'var(--ciamik-bg)',
                borderRadius: 'var(--r-pill)',
                fontSize: 13,
                color: 'var(--ciamik-text-tertiary)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                border: '1px solid var(--ciamik-border-faint)',
              }}>
                <MagnifyingGlass size={16} />
                <span style={{ color: 'var(--ciamik-text-tertiary)' }}>Cari produk...</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
              <div style={{ display: 'flex', gap: 24 }}>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 650,
                    color: !isCartOpen && !isWishlistOpen && !isProfileOpen ? 'var(--ciamik-primary)' : 'var(--ciamik-ink)',
                    cursor: 'pointer'
                  }}
                  onClick={() => { setIsCartOpen(false); setIsWishlistOpen(false); setIsProfileOpen(false); }}
                >
                  Beranda
                </span>
                <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--ciamik-ink)', cursor: 'pointer' }}>
                  Katalog
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                {/* Wishlist Icon */}
                <button
                  onClick={() => { setIsWishlistOpen(true); setIsCartOpen(false); setIsProfileOpen(false); }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative', padding: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  aria-label="Wishlist"
                >
                  <Heart size={22} color={isWishlistOpen ? 'var(--ciamik-primary)' : 'var(--ciamik-ink)'} weight={isWishlistOpen ? 'fill' : 'regular'} />
                  {wishlistCount > 0 && (
                    <span style={{
                      position: 'absolute',
                      top: -4,
                      right: -4,
                      backgroundColor: 'var(--ciamik-accent)',
                      color: 'white',
                      fontSize: 9,
                      fontWeight: 800,
                      minWidth: 16,
                      height: 16,
                      borderRadius: 'var(--r-pill)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '0 4px',
                    }}>
                      {wishlistCount}
                    </span>
                  )}
                </button>

                {/* Cart Icon */}
                <button
                  onClick={() => { setIsCartOpen(true); setIsWishlistOpen(false); setIsProfileOpen(false); }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative', padding: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  aria-label="Keranjang"
                >
                  <ShoppingCart size={22} color={isCartOpen ? 'var(--ciamik-primary)' : 'var(--ciamik-ink)'} weight={isCartOpen ? 'fill' : 'regular'} />
                  {cartCount > 0 && (
                    <span style={{
                      position: 'absolute',
                      top: -4,
                      right: -4,
                      backgroundColor: 'var(--ciamik-accent)',
                      color: 'white',
                      fontSize: 9,
                      fontWeight: 800,
                      minWidth: 16,
                      height: 16,
                      borderRadius: 'var(--r-pill)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '0 4px',
                    }}>
                      {cartCount}
                    </span>
                  )}
                </button>

                {/* User Icon */}
                <button
                  onClick={() => { setIsProfileOpen(true); setIsCartOpen(false); setIsWishlistOpen(false); }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  aria-label="Profil"
                >
                  <User size={22} color={isProfileOpen ? 'var(--ciamik-primary)' : 'var(--ciamik-ink)'} />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Mobile Header */
        <div style={{
          padding: '12px 16px', backgroundColor: 'var(--ciamik-surface)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderBottom: '1px solid var(--ciamik-border-faint)', position: 'sticky', top: 0, zIndex: 10,
        }}>
          <span style={{ font: 'var(--text-h3)', color: 'var(--ciamik-primary)', fontWeight: 700, cursor: 'pointer', flexShrink: 0 }} onClick={() => { setIsCartOpen(false); setIsWishlistOpen(false); setIsProfileOpen(false); }}>
            ciamik.id
          </span>
          <div style={{
            flex: 1, margin: '0 12px', padding: '8px 14px',
            backgroundColor: 'var(--ciamik-bg)', borderRadius: 'var(--r-pill)',
            fontSize: 12, color: 'var(--ciamik-text-tertiary)', display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <MagnifyingGlass size={14} /> Cari produk...
          </div>
          <button
            onClick={() => setIsProfileOpen(true)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 4,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--ciamik-text-secondary)',
              flexShrink: 0,
            }}
            aria-label="Menu"
            id="mobHamburger"
          >
            <List size={22} weight="bold" />
          </button>
        </div>
      )}

      {/* Main Contents Container */}
      <div style={{
        maxWidth: isDesktop ? 1200 : 480,
        margin: '0 auto',
        padding: isDesktop ? '24px 24px 80px 24px' : '0 0 80px 0',
      }}>
        {/* Banner Carousel */}
        <HeroBanner slides={heroSlides} autoPlay={false} />

        {/* Category Filter Chips */}
        <div style={{
          padding: isDesktop ? '24px 0' : '16px',
          display: 'flex',
          gap: 8,
          overflowX: 'auto',
          justifyContent: isDesktop ? 'center' : 'flex-start',
        }}>
          {categoryChips.map((chip, idx) => {
            const isActive = idx === activeCategoryIdx;
            return (
              <button
                key={idx}
                onClick={() => setActiveCategoryIdx(idx)}
                style={{
                  padding: '7px 16px',
                  borderRadius: 'var(--r-pill)',
                  border: isActive ? 'none' : '1px solid rgba(123, 130, 160, 0.15)',
                  fontSize: 13,
                  fontWeight: isActive ? 600 : 500,
                  whiteSpace: 'nowrap',
                  backgroundColor: isActive ? 'var(--ciamik-primary)' : 'transparent',
                  color: isActive ? '#fff' : 'var(--ciamik-text-secondary)',
                  cursor: 'pointer',
                  transition: 'all var(--dur-fast) var(--ease)',
                }}
              >
                {chip}
              </button>
            );
          })}
        </div>

        {/* Product Grids */}
        {/* Section 1: Flash Sale */}
        <div style={{ padding: isDesktop ? '0' : '0 16px' }}>
          <ProductGrid title="⚡ Flash Sale — Berakhir dalam 02:14:33" seeAllHref="#flash-sale">
            {initialProducts.map((p) => (
              <ProductCard
                key={p.id}
                {...p}
                id={p.id}
                isWishlisted={wishlistedIds.includes(p.id)}
                cartQty={getProductCartQty(p.id)}
                onWishlistToggle={handleWishlistToggle}
                onAddToCart={handleAddToCart}
                onUpdateCartQty={handleUpdateCartQty}
              />
            ))}
          </ProductGrid>
        </div>

        {/* Section 2: Terlaris Minggu Ini */}
        <div style={{ padding: isDesktop ? '24px 0' : '0 16px' }}>
          <ProductGrid title="🔥 Terlaris minggu ini" seeAllHref="#best-sellers">
            {initialProducts.map((p) => (
              <ProductCard
                key={`best-${p.id}`}
                {...p}
                id={p.id}
                isWishlisted={wishlistedIds.includes(p.id)}
                cartQty={getProductCartQty(p.id)}
                onWishlistToggle={handleWishlistToggle}
                onAddToCart={handleAddToCart}
                onUpdateCartQty={handleUpdateCartQty}
              />
            ))}
          </ProductGrid>
        </div>

        {/* Section 3: Rekomendasi Untukmu */}
        <div style={{ padding: isDesktop ? '24px 0' : '0 16px' }}>
          <ProductGrid title="✨ Rekomendasi untukmu" seeAllHref="#recommendations">
            {initialProducts.map((p) => (
              <ProductCard
                key={`rec-${p.id}`}
                {...p}
                id={p.id}
                isWishlisted={wishlistedIds.includes(p.id)}
                cartQty={getProductCartQty(p.id)}
                onWishlistToggle={handleWishlistToggle}
                onAddToCart={handleAddToCart}
                onUpdateCartQty={handleUpdateCartQty}
              />
            ))}
          </ProductGrid>
        </div>

        {/* Trust Badges */}
        <div style={{ padding: isDesktop ? '32px 0 16px' : '24px 16px 16px' }}>
          <TrustBadges variant="expanded" />
        </div>

        {/* Footer */}
        <div style={{
          padding: '40px 0 24px',
          borderTop: '1px solid var(--ciamik-border-faint)',
          marginTop: 32,
        }}>
          {isDesktop ? (
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40, textAlign: 'left', paddingBottom: 32, borderBottom: '1px solid var(--ciamik-border-faint)' }}>
              <div>
                <span style={{ font: 'var(--text-h3)', color: 'var(--ciamik-primary)', fontWeight: 800 }}>ciamik.id</span>
                <p style={{ fontSize: 13, color: 'var(--ciamik-text-secondary)', marginTop: 12, lineHeight: 1.6 }}>
                  Belanja aman, nyaman, dan terpercaya. Kami menjaga setiap transaksi dengan standar keamanan tertinggi.
                </p>
              </div>
              <div>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--ciamik-ink)', margin: '0 0 16px 0' }}>Tentang</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13, color: 'var(--ciamik-text-secondary)' }}>
                  <span style={{ cursor: 'pointer' }}>Tentang Kami</span>
                  <span style={{ cursor: 'pointer' }}>Syarat & Ketentuan</span>
                  <span style={{ cursor: 'pointer' }}>Kebijakan Privasi</span>
                </div>
              </div>
              <div>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--ciamik-ink)', margin: '0 0 16px 0' }}>Bantuan</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13, color: 'var(--ciamik-text-secondary)' }}>
                  <span style={{ cursor: 'pointer' }}>FAQ</span>
                  <span style={{ cursor: 'pointer' }}>Hubungi Kami</span>
                  <span style={{ cursor: 'pointer' }}>Info Pengiriman</span>
                </div>
              </div>
              <div>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--ciamik-ink)', margin: '0 0 16px 0' }}>Ikuti Kami</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13, color: 'var(--ciamik-text-secondary)' }}>
                  <span style={{ cursor: 'pointer' }}>Instagram</span>
                  <span style={{ cursor: 'pointer' }}>Twitter</span>
                  <span style={{ cursor: 'pointer' }}>TikTok</span>
                </div>
              </div>
            </div>
          ) : null}
          <div style={{
            display: 'flex',
            justifyContent: isDesktop ? 'space-between' : 'center',
            fontSize: 11,
            color: 'var(--ciamik-text-tertiary)',
            marginTop: isDesktop ? 24 : 0,
            textAlign: 'center',
          }}>
            <span>© 2026 ciamik.id. Hak cipta dilindungi.</span>
            {isDesktop && <span>Dibuat dengan ❤️ di Indonesia</span>}
          </div>
        </div>
      </div>

      {/* Cart Drawer Panel */}
      <StorefrontDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} title="Keranjang Belanja" isDesktop={isDesktop}>
        {cartItems.length === 0 ? (
          <div style={{ padding: '40px 16px', textAlign: 'center', color: 'var(--ciamik-text-secondary)' }}>
            <ShoppingCart size={48} style={{ opacity: 0.3, marginBottom: 12 }} />
            <p style={{ margin: 0, fontSize: 14 }}>Keranjang belanja Anda kosong.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 350, overflowY: 'auto' }}>
              {cartItems.map((item) => {
                const prod = initialProducts.find((p) => p.id === item.id);
                if (!prod) return null;
                return (
                  <div key={item.id} style={{ display: 'flex', gap: 12, alignItems: 'center', paddingBottom: 12, borderBottom: '1px solid var(--ciamik-border-faint)' }}>
                    <img src={prod.image} alt={prod.name} style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 'var(--r-sm)' }} />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: 13, fontWeight: 600, margin: 0, color: 'var(--ciamik-ink)' }}>{prod.name}</h4>
                      <p style={{ fontSize: 12, color: 'var(--ciamik-primary)', fontWeight: 700, margin: '4px 0 0' }}>
                        Rp {prod.price.toLocaleString('id-ID')}
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <button
                        onClick={() => handleUpdateCartQty(item.id, item.qty - 1)}
                        style={{ width: 24, height: 24, borderRadius: '50%', border: '1px solid var(--ciamik-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ciamik-ink)' }}
                      >
                        <Minus size={12} />
                      </button>
                      <span style={{ fontSize: 13, fontWeight: 600, minWidth: 16, textAlign: 'center' }}>{item.qty}</span>
                      <button
                        onClick={() => handleUpdateCartQty(item.id, item.qty + 1)}
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
      </StorefrontDrawer>

      {/* Wishlist Drawer Panel */}
      <StorefrontDrawer isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} title="Wishlist Saya" isDesktop={isDesktop}>
        {wishlistedIds.length === 0 ? (
          <div style={{ padding: '40px 16px', textAlign: 'center', color: 'var(--ciamik-text-secondary)' }}>
            <Heart size={48} style={{ opacity: 0.3, marginBottom: 12 }} />
            <p style={{ margin: 0, fontSize: 14 }}>Belum ada produk di wishlist.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 400, overflowY: 'auto' }}>
            {wishlistedIds.map((id) => {
              const prod = initialProducts.find((p) => p.id === id);
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
                        handleAddToCart(id);
                        handleWishlistToggle(id);
                      }}
                      style={{ padding: '6px 10px', fontSize: 11, backgroundColor: 'var(--ciamik-primary)', color: '#fff', borderRadius: 'var(--r-sm)', fontWeight: 600, border: 'none', cursor: 'pointer' }}
                    >
                      + Keranjang
                    </button>
                    <button
                      onClick={() => handleWishlistToggle(id)}
                      style={{ padding: '6px', backgroundColor: 'var(--ciamik-bg-hover)', border: '1px solid var(--ciamik-border-faint)', borderRadius: 'var(--r-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                    >
                      <Trash size={14} color="var(--ciamik-red-600)" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </StorefrontDrawer>

      {/* Backdrop for profile on desktop */}
      <AnimatePresence>
        {isProfileOpen && isDesktop && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsProfileOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: '#000',
              backdropFilter: 'blur(4px)',
              zIndex: 990,
            }}
          />
        )}
      </AnimatePresence>

      {/* Profile Sidebar Drawer */}
      <AnimatePresence>
        {isProfileOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 220 }}
            style={{
              position: isDesktop ? 'fixed' : 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              width: '100%',
              maxWidth: isDesktop ? 400 : '100%',
              backgroundColor: 'var(--ciamik-surface)',
              boxShadow: isDesktop ? 'var(--sh-lg)' : 'none',
              borderLeft: isDesktop ? '1px solid var(--ciamik-border-faint)' : 'none',
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
              padding: '16px 20px',
              borderBottom: '1px solid var(--ciamik-border-faint)',
              backgroundColor: 'var(--ciamik-surface)',
              flexShrink: 0
            }}>
              <button
                onClick={() => {
                  if (profileTab === 'addresses') {
                    setProfileTab('menu');
                  } else if (profileTab === 'address-form') {
                    setProfileTab('addresses');
                  } else if (profileTab === 'region-picker') {
                    setProfileTab('address-form');
                  } else {
                    setIsProfileOpen(false);
                  }
                }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', marginRight: '12px' }}
              >
                <ArrowLeft size={20} weight="bold" color="var(--ciamik-ink)" />
              </button>
              <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--ciamik-ink)' }}>
                {profileTab === 'addresses' && 'Daftar Alamat'}
                {profileTab === 'address-form' && (addressFormMode === 'add' ? 'Tambah Alamat' : 'Ubah Alamat')}
                {profileTab === 'region-picker' && `Pilih ${pickerLevel}`}
                {profileTab === 'menu' && 'Profil Saya'}
              </span>
            </div>

            {/* Content Body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px', backgroundColor: 'var(--ciamik-bg)' }}>
              {isLoggedIn ? (
                <>
                  {profileTab === 'menu' && (
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
                        <div
                          onClick={() => setProfileTab('addresses')}
                          style={{
                            padding: 14, backgroundColor: 'var(--ciamik-surface)',
                            borderRadius: 'var(--r-md)', border: '1px solid var(--ciamik-border-faint)',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer'
                          }}
                        >
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
                  )}

                  {profileTab === 'addresses' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {addresses.map(addr => (
                        <div key={addr.id} style={{
                          padding: 16, backgroundColor: 'var(--ciamik-surface)',
                          borderRadius: 'var(--r-lg)', border: addr.isDefault ? '1.5px solid var(--ciamik-primary)' : '1px solid var(--ciamik-border-faint)',
                          display: 'flex', flexDirection: 'column', gap: 6
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{
                              padding: '2px 8px', fontSize: 10, fontWeight: 750,
                              backgroundColor: addr.isDefault ? 'var(--ciamik-primary-bg)' : 'var(--ciamik-bg-hover)',
                              color: addr.isDefault ? 'var(--ciamik-primary)' : 'var(--ciamik-text-secondary)',
                              borderRadius: 'var(--r-sm)'
                            }}>{addr.label}</span>
                            {addr.isDefault && <span style={{ fontSize: 11, color: 'var(--ciamik-primary)', fontWeight: 700 }}>Utama</span>}
                          </div>
                          <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--ciamik-ink)', margin: '4px 0 0' }}>{addr.receiverName}</h4>
                          <p style={{ fontSize: 12, color: 'var(--ciamik-text-secondary)', margin: 0 }}>{addr.phone}</p>
                          <p style={{ fontSize: 12, color: 'var(--ciamik-text-secondary)', margin: '4px 0 0', lineHeight: 1.45 }}>
                            {addr.fullAddress}, Kel. {addr.kelurahan}, Kec. {addr.kecamatan}, {addr.kota}, {addr.provinsi} {addr.postalCode}
                          </p>
                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--ciamik-border-faint)' }}>
                            {!addr.isDefault && (
                              <button
                                onClick={() => handleSetDefaultAddress(addr.id)}
                                style={{ background: 'none', border: 'none', color: 'var(--ciamik-primary)', fontSize: 12, fontWeight: 600, cursor: 'pointer', padding: 0 }}
                              >
                                Set Utama
                              </button>
                            )}
                            <button
                              onClick={() => handleOpenEditAddress(addr)}
                              style={{ background: 'none', border: 'none', color: 'var(--ciamik-text-secondary)', fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, padding: 0 }}
                            >
                              <Pencil size={12} /> Ubah
                            </button>
                            {!addr.isDefault && (
                              <button
                                onClick={() => handleDeleteAddress(addr.id)}
                                style={{ background: 'none', border: 'none', color: 'var(--ciamik-red-600)', fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, padding: 0 }}
                              >
                                <Trash size={12} /> Hapus
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={handleOpenAddAddress}
                        style={{
                          width: '100%', padding: '12px', border: '1.5px dashed var(--ciamik-border)',
                          borderRadius: 'var(--r-lg)', backgroundColor: 'transparent',
                          color: 'var(--ciamik-primary)', fontWeight: 600, fontSize: 13, cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 8
                        }}
                      >
                        + Tambah Alamat Baru
                      </button>
                    </div>
                  )}

                  {profileTab === 'address-form' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      <div>
                        <label style={{ display: 'block', fontSize: 10, fontWeight: 750, marginBottom: 6, color: 'var(--ciamik-text-secondary)', textTransform: 'uppercase' }}>Label Alamat</label>
                        <div style={{ display: 'flex', gap: 8 }}>
                          {['Rumah', 'Kantor', 'Kos'].map(lbl => (
                            <button
                              key={lbl}
                              type="button"
                              onClick={() => setFormLabel(lbl)}
                              style={{
                                padding: '6px 14px', borderRadius: 'var(--r-pill)',
                                border: formLabel === lbl ? 'none' : '1px solid var(--ciamik-border)',
                                backgroundColor: formLabel === lbl ? 'var(--ciamik-primary)' : 'var(--ciamik-surface)',
                                color: formLabel === lbl ? '#fff' : 'var(--ciamik-text-secondary)',
                                fontSize: 12, fontWeight: 600, cursor: 'pointer'
                              }}
                            >
                              {lbl}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <label style={{ display: 'block', fontSize: 10, fontWeight: 750, marginBottom: 6, color: 'var(--ciamik-text-secondary)', textTransform: 'uppercase' }}>Nama Penerima</label>
                        <input
                          type="text"
                          placeholder="Contoh: Ahmad Maulana"
                          value={formReceiverName}
                          onChange={(e) => setFormReceiverName(e.target.value)}
                          style={{
                            width: '100%', padding: '11px 14px', border: '1.5px solid var(--ciamik-border)',
                            borderRadius: 'var(--r-md)', fontSize: '13px', backgroundColor: 'var(--ciamik-surface)',
                            color: 'var(--ciamik-ink)', outline: 'none'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: 10, fontWeight: 750, marginBottom: 6, color: 'var(--ciamik-text-secondary)', textTransform: 'uppercase' }}>Nomor Telepon</label>
                        <input
                          type="tel"
                          placeholder="Contoh: 081234567890"
                          value={formPhone}
                          onChange={(e) => setFormPhone(e.target.value)}
                          style={{
                            width: '100%', padding: '11px 14px', border: '1.5px solid var(--ciamik-border)',
                            borderRadius: 'var(--r-md)', fontSize: '13px', backgroundColor: 'var(--ciamik-surface)',
                            color: 'var(--ciamik-ink)', outline: 'none'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: 10, fontWeight: 750, marginBottom: 6, color: 'var(--ciamik-text-secondary)', textTransform: 'uppercase' }}>Pilih Wilayah (Provinsi, Kota, Kecamatan, Kelurahan)</label>
                        <div
                          onClick={() => { setPickerLevel('provinsi'); setRegionSearch(''); setProfileTab('region-picker'); }}
                          style={{
                            padding: '12px 14px', border: '1.5px solid var(--ciamik-border)',
                            borderRadius: 'var(--r-md)', fontSize: '13px', backgroundColor: 'var(--ciamik-surface)',
                            color: formProvinsi ? 'var(--ciamik-ink)' : 'var(--ciamik-text-tertiary)',
                            cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                          }}
                        >
                          <span>
                            {formProvinsi ? `${formProvinsi}, ${formKota}, ${formKecamatan}, ${formKelurahan}` : 'Pilih Wilayah...'}
                          </span>
                          <CaretRight size={14} color="var(--ciamik-text-secondary)" />
                        </div>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: 10, fontWeight: 750, marginBottom: 6, color: 'var(--ciamik-text-secondary)', textTransform: 'uppercase' }}>Alamat Lengkap</label>
                        <textarea
                          placeholder="Nama jalan, nomor rumah, RT/RW, nomor unit/blok"
                          value={formFullAddress}
                          onChange={(e) => setFormFullAddress(e.target.value)}
                          rows={3}
                          style={{
                            width: '100%', padding: '11px 14px', border: '1.5px solid var(--ciamik-border)',
                            borderRadius: 'var(--r-md)', fontSize: '13px', backgroundColor: 'var(--ciamik-surface)',
                            color: 'var(--ciamik-ink)', outline: 'none', resize: 'vertical'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: 10, fontWeight: 750, marginBottom: 6, color: 'var(--ciamik-text-secondary)', textTransform: 'uppercase' }}>Kode Pos</label>
                        <input
                          type="text"
                          placeholder="Kode pos terisi otomatis"
                          value={formPostalCode}
                          readOnly
                          style={{
                            width: '100%', padding: '11px 14px', border: '1.5px solid var(--ciamik-border)',
                            borderRadius: 'var(--r-md)', fontSize: '13px', backgroundColor: 'var(--ciamik-bg-hover)',
                            color: 'var(--ciamik-text-secondary)', outline: 'none', cursor: 'not-allowed'
                          }}
                        />
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <input
                          type="checkbox"
                          id="isDefaultCheckbox"
                          checked={formIsDefault}
                          onChange={(e) => setFormIsDefault(e.target.checked)}
                          disabled={addresses.find(a => a.id === editingAddressId)?.isDefault}
                          style={{ width: 16, height: 16, cursor: 'pointer' }}
                        />
                        <label htmlFor="isDefaultCheckbox" style={{ fontSize: 13, color: 'var(--ciamik-ink)', cursor: 'pointer', userSelect: 'none' }}>
                          Jadikan Alamat Utama
                        </label>
                      </div>

                      <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                        <button
                          onClick={handleSaveAddress}
                          style={{
                            flex: 1, padding: '12px', border: 'none',
                            backgroundColor: 'var(--ciamik-primary)', color: '#fff',
                            borderRadius: 'var(--r-md)', fontWeight: 700, fontSize: 13, cursor: 'pointer'
                          }}
                        >
                          Simpan Alamat
                        </button>
                        <button
                          onClick={() => setProfileTab('addresses')}
                          style={{
                            padding: '12px 18px', border: '1px solid var(--ciamik-border)',
                            backgroundColor: 'var(--ciamik-surface)', color: 'var(--ciamik-text-secondary)',
                            borderRadius: 'var(--r-md)', fontWeight: 600, fontSize: 13, cursor: 'pointer'
                          }}
                        >
                          Batal
                        </button>
                      </div>
                    </div>
                  )}

                  {profileTab === 'region-picker' && (
                    <div>
                      {/* Search region filter */}
                      <div style={{ display: 'flex', alignItems: 'center', padding: '10px 14px', backgroundColor: 'var(--ciamik-surface)', borderRadius: 'var(--r-md)', border: '1px solid var(--ciamik-border)', marginBottom: 12 }}>
                        <MagnifyingGlass size={16} color="var(--ciamik-text-secondary)" style={{ marginRight: 8 }} />
                        <input
                          type="text"
                          placeholder={`Cari ${pickerLevel}...`}
                          value={regionSearch}
                          onChange={(e) => setRegionSearch(e.target.value)}
                          style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '13px', color: 'var(--ciamik-ink)' }}
                        />
                      </div>

                      {/* Breadcrumbs */}
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', padding: '10px 14px', backgroundColor: 'var(--ciamik-surface)', borderRadius: 'var(--r-md)', border: '1px solid var(--ciamik-border-faint)', marginBottom: 16 }}>
                        <span
                          style={{ fontSize: 12, fontWeight: pickerLevel === 'provinsi' ? 700 : 500, color: pickerLevel === 'provinsi' ? 'var(--ciamik-primary)' : 'var(--ciamik-text-secondary)', cursor: 'pointer' }}
                          onClick={() => { setPickerLevel('provinsi'); setRegionSearch(''); }}
                        >
                          Provinsi
                        </span>
                        {formProvinsi && (
                          <>
                            <span style={{ fontSize: 11, color: 'var(--ciamik-text-tertiary)' }}>&gt;</span>
                            <span
                              style={{ fontSize: 12, fontWeight: pickerLevel === 'kota' ? 700 : 500, color: pickerLevel === 'kota' ? 'var(--ciamik-primary)' : 'var(--ciamik-text-secondary)', cursor: 'pointer' }}
                              onClick={() => { setPickerLevel('kota'); setRegionSearch(''); }}
                            >
                              {formProvinsi}
                            </span>
                          </>
                        )}
                        {formKota && (
                          <>
                            <span style={{ fontSize: 11, color: 'var(--ciamik-text-tertiary)' }}>&gt;</span>
                            <span
                              style={{ fontSize: 12, fontWeight: pickerLevel === 'kecamatan' ? 700 : 500, color: pickerLevel === 'kecamatan' ? 'var(--ciamik-primary)' : 'var(--ciamik-text-secondary)', cursor: 'pointer' }}
                              onClick={() => { setPickerLevel('kecamatan'); setRegionSearch(''); }}
                            >
                              {formKota}
                            </span>
                          </>
                        )}
                        {formKecamatan && (
                          <>
                            <span style={{ fontSize: 11, color: 'var(--ciamik-text-tertiary)' }}>&gt;</span>
                            <span
                              style={{ fontSize: 12, fontWeight: pickerLevel === 'kelurahan' ? 700 : 500, color: pickerLevel === 'kelurahan' ? 'var(--ciamik-primary)' : 'var(--ciamik-text-secondary)', cursor: 'pointer' }}
                              onClick={() => { setPickerLevel('kelurahan'); setRegionSearch(''); }}
                            >
                              {formKecamatan}
                            </span>
                          </>
                        )}
                      </div>

                      {/* Options List */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 320, overflowY: 'auto' }}>
                        {filteredOptions.length === 0 ? (
                          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--ciamik-text-tertiary)', fontSize: 13 }}>
                            Tidak ada hasil ditemukan.
                          </div>
                        ) : (
                          filteredOptions.map(opt => (
                            <div
                              key={opt}
                              onClick={() => handleSelectOption(opt)}
                              style={{
                                padding: '14px 16px',
                                backgroundColor: 'var(--ciamik-surface)',
                                borderRadius: 'var(--r-md)',
                                border: '1px solid var(--ciamik-border-faint)',
                                fontSize: 13,
                                fontWeight: 500,
                                color: 'var(--ciamik-ink)',
                                cursor: 'pointer',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                transition: 'all var(--dur-fast) var(--ease)'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = 'var(--ciamik-bg-hover)';
                                e.currentTarget.style.borderColor = 'var(--ciamik-border)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'var(--ciamik-surface)';
                                e.currentTarget.style.borderColor = 'var(--ciamik-border-faint)';
                              }}
                            >
                              <span>{opt}</span>
                              <CaretRight size={14} color="var(--ciamik-text-secondary)" />
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </>
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

      {/* Real Floating Bottom Navigation */}
      {shouldShowBottomNav && <BottomNav items={bottomNavItems} />}
    </div>
  );
};

const StorefrontHomePage = ({ isMobileOnly = false }: { isMobileOnly?: boolean }) => (
  <CiamikProvider>
    <StorefrontHomePageContent isMobileOnly={isMobileOnly} />
  </CiamikProvider>
);

const meta: Meta = {
  title: 'Showcase/Storefront Home',
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj;

export const Mobile: Story = {
  render: () => <StorefrontHomePage isMobileOnly={true} />,
};

export const Desktop: Story = {
  render: () => <StorefrontHomePage isMobileOnly={false} />,
  parameters: {
    viewport: {
      defaultViewport: 'desktop',
    },
  },
};
