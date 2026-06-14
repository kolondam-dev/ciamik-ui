import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { CiamikProvider } from '../../src/provider/CiamikProvider';
import { Sidebar } from '../../src/patterns/Sidebar/Sidebar';
import { SearchFilterBar } from '../../src/patterns/SearchFilterBar/SearchFilterBar';
import { DataTable } from '../../src/patterns/DataTable/DataTable';
import { Modal } from '../../src/primitives/Modal/Modal';
import { Input } from '../../src/primitives/Input/Input';
import { Select } from '../../src/primitives/Select/Select';
import { Button } from '../../src/primitives/Button/Button';
import { Badge } from '../../src/primitives/Badge/Badge';
import { useToast } from '../../src/hooks/useToast';
import {
  House,
  ShoppingCart,
  Truck,
  Tag,
  ChartBar,
  Gear,
  PencilSimple,
  Plus,
} from '@phosphor-icons/react';

const sidebarGroups = [
  {
    title: 'Menu Utama',
    items: [
      { key: 'dashboard', label: 'Dashboard', icon: <House size={18} /> },
      { key: 'orders', label: 'Pesanan', icon: <ShoppingCart size={18} /> },
      { key: 'fulfillment', label: 'Fulfillment', icon: <Truck size={18} /> },
      { key: 'catalog', label: 'Katalog', icon: <Tag size={18} />, isActive: true },
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

const initialProducts = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&q=80',
    name: 'Sepatu Sneakers Running Ultra Boost',
    category: 'Fashion',
    price: 450000,
    stock: 12,
    status: 'ACTIVE',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&q=80',
    name: 'Kaos Polos Premium 30s Katun',
    category: 'Fashion',
    price: 89000,
    stock: 120,
    status: 'ACTIVE',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=100&q=80',
    name: 'Wireless Headphone Noise Cancel Pro X2',
    category: 'Elektronik',
    price: 1200000,
    stock: 8,
    status: 'ACTIVE',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&q=80',
    name: 'Smart Watch Fitness Tracker Pro Series',
    category: 'Elektronik',
    price: 890000,
    stock: 0,
    status: 'INACTIVE',
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=100&q=80',
    name: 'Parfum Homme Classic Wood Edition 100ml',
    category: 'Kecantikan',
    price: 385000,
    stock: 25,
    status: 'DRAFT',
  },
];

const categoryOptions = [
  { value: 'Fashion', label: 'Fashion' },
  { value: 'Elektronik', label: 'Elektronik' },
  { value: 'Kecantikan', label: 'Kecantikan' },
  { value: 'Kesehatan', label: 'Kesehatan' },
];

const filterOptions = [
  { key: 'all', label: 'Semua Status' },
  { key: 'ACTIVE', label: 'Aktif' },
  { key: 'DRAFT', label: 'Draft' },
  { key: 'INACTIVE', label: 'Nonaktif' },
];

const CatalogShowcase = () => {
  const { toast } = useToast();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [products, setProducts] = useState(initialProducts);
  const [searchValue, setSearchValue] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  // Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<typeof initialProducts[0] | null>(null);
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('Fashion');
  const [formPrice, setFormPrice] = useState('');
  const [formStock, setFormStock] = useState('');
  const [formStatus, setFormStatus] = useState('ACTIVE');

  // Filter products
  const filteredProducts = products.filter((prod) => {
    const matchesSearch = prod.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      prod.category.toLowerCase().includes(searchValue.toLowerCase());
    const matchesFilter = activeFilter === 'all' || prod.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const openAddModal = () => {
    setEditingProduct(null);
    setFormName('');
    setFormCategory('Fashion');
    setFormPrice('');
    setFormStock('');
    setFormStatus('ACTIVE');
    setIsModalOpen(true);
  };

  const openEditModal = (product: typeof initialProducts[0]) => {
    setEditingProduct(product);
    setFormName(product.name);
    setFormCategory(product.category);
    setFormPrice(product.price.toString());
    setFormStock(product.stock.toString());
    setFormStatus(product.status);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formName.trim()) {
      toast('Nama produk wajib diisi!', 'error');
      return;
    }

    const priceNum = parseFloat(formPrice);
    const stockNum = parseInt(formStock);

    if (isNaN(priceNum) || priceNum <= 0) {
      toast('Harga produk harus angka positif!', 'error');
      return;
    }
    if (isNaN(stockNum) || stockNum < 0) {
      toast('Stok produk harus berupa angka!', 'error');
      return;
    }

    if (editingProduct) {
      // Edit
      setProducts(prev =>
        prev.map(p => p.id === editingProduct.id
          ? {
              ...p,
              name: formName,
              category: formCategory,
              price: priceNum,
              stock: stockNum,
              status: formStatus,
            }
          : p
        )
      );
      toast(`Produk "${formName}" berhasil diperbarui!`, 'success');
    } else {
      // Add
      const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
      const newProduct = {
        id: newId,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&q=80', // default watch placeholder
        name: formName,
        category: formCategory,
        price: priceNum,
        stock: stockNum,
        status: formStatus,
      };
      setProducts(prev => [...prev, newProduct]);
      toast(`Produk "${formName}" berhasil ditambahkan ke katalog!`, 'success');
    }

    setIsModalOpen(false);
  };

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
        {/* Title & Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <div>
            <h1 style={{ font: 'var(--text-h1)', color: 'var(--ciamik-ink)', marginBottom: 4 }}>
              Katalog Produk
            </h1>
            <p style={{ font: 'var(--text-small)', color: 'var(--ciamik-text-secondary)' }}>
              Kelola item produk, perbarui ketersediaan stok, harga jual, dan status publikasi.
            </p>
          </div>
          <Button variant="primary" onClick={openAddModal}>
            <Plus size={16} weight="bold" /> Tambah Produk
          </Button>
        </div>

        {/* Filter Bar */}
        <div style={{ marginBottom: 16 }}>
          <SearchFilterBar
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            placeholder="Cari produk berdasarkan nama atau kategori..."
            filterOptions={filterOptions}
            activeFilterKey={activeFilter}
            onFilterKeyChange={setActiveFilter}
          />
        </div>

        {/* Product List Table */}
        <DataTable
          columns={[
            {
              key: 'image',
              label: 'Foto',
              render: (row) => (
                <img
                  src={row.image}
                  alt={row.name}
                  style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 'var(--r-sm)' }}
                />
              ),
            },
            { key: 'name', label: 'Nama Produk' },
            { key: 'category', label: 'Kategori' },
            {
              key: 'price',
              label: 'Harga',
              render: (row) => <span className="tabnum">Rp {row.price.toLocaleString('id-ID')}</span>,
            },
            {
              key: 'stock',
              label: 'Stok',
              render: (row) => (
                <span style={{ color: row.stock === 0 ? 'var(--ciamik-danger)' : 'var(--ciamik-ink)', fontWeight: 500 }}>
                  {row.stock}
                </span>
              ),
            },
            {
              key: 'status',
              label: 'Status',
              render: (row) => {
                let badgeVar: 'success' | 'warning' | 'neutral' = 'neutral';
                if (row.status === 'ACTIVE') badgeVar = 'success';
                if (row.status === 'DRAFT') badgeVar = 'warning';
                return (
                  <Badge variant={badgeVar}>
                    {row.status === 'ACTIVE' ? 'Aktif' : row.status === 'DRAFT' ? 'Draft' : 'Nonaktif'}
                  </Badge>
                );
              },
            },
            {
              key: 'action',
              label: 'Aksi',
              render: (row) => (
                <Button
                  variant="ghost"
                  onClick={() => openEditModal(row)}
                  style={{ padding: 6, minWidth: 'auto' }}
                >
                  <PencilSimple size={16} />
                </Button>
              ),
            },
          ]}
          data={filteredProducts}
          keyExtractor={(row) => row.id.toString()}
          selectable
        />
      </div>

      {/* Product Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? 'Ubah Informasi Produk' : 'Tambah Produk Baru'}
        confirmLabel={editingProduct ? 'Simpan Perubahan' : 'Tambahkan Produk'}
        onConfirm={handleSave}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input
            label="Nama Produk"
            placeholder="Masukkan nama produk..."
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ font: 'var(--text-caption)', fontWeight: 600, color: 'var(--ciamik-text-secondary)', display: 'block', marginBottom: 6 }}>
                Kategori
              </label>
              <Select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
              >
                {categoryOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </Select>
            </div>
            <div>
              <label style={{ font: 'var(--text-caption)', fontWeight: 600, color: 'var(--ciamik-text-secondary)', display: 'block', marginBottom: 6 }}>
                Status Publikasi
              </label>
              <Select
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value)}
              >
                <option value="ACTIVE">Aktif</option>
                <option value="DRAFT">Draft</option>
                <option value="INACTIVE">Nonaktif</option>
              </Select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Input
              label="Harga Produk (Rp)"
              placeholder="Contoh: 150000"
              value={formPrice}
              onChange={(e) => setFormPrice(e.target.value)}
            />
            <Input
              label="Kuantitas Stok"
              placeholder="Contoh: 50"
              value={formStock}
              onChange={(e) => setFormStock(e.target.value)}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

const CatalogPage = () => {
  return (
    <CiamikProvider>
      <CatalogShowcase />
    </CiamikProvider>
  );
};

const meta: Meta = {
  title: 'Showcase/Backoffice Catalog',
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj;

export const Desktop: Story = {
  render: () => <CatalogPage />,
};
