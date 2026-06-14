import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  CheckCircle,
  Warning,
  XCircle,
  Info,
  X,
  ShieldWarning,
  Envelope,
  MagnifyingGlass,
  Lock,
  WifiSlash,
  CaretDown,
  CaretUp,
  CaretLeft,
  CaretRight,
  Package,
  House,
  ShoppingCart,
  SignOut,
  Bell,
  User,
  Storefront,
  Table,
  List,
  SquaresFour,
  Columns,
  ArrowRight,
  Trash,
  Plus,
  Minus,
  TrendUp,
  TrendDown,
  Calendar,
  ArrowUp,
  ArrowDown,
  ArrowsDownUp,
  ShieldCheck,
  CurrencyCircleDollar,
  ArrowCounterClockwise,
  Certificate,
  Truck,
  WhatsappLogo,
  Key,
  Spinner,
  Heart,
  Star,
  Flame,
  Lightning,
} from '@phosphor-icons/react';

const icons = [
  { name: 'CheckCircle', component: CheckCircle, category: 'Feedback' },
  { name: 'Warning', component: Warning, category: 'Feedback' },
  { name: 'XCircle', component: XCircle, category: 'Feedback' },
  { name: 'Info', component: Info, category: 'Feedback' },
  { name: 'ShieldWarning', component: ShieldWarning, category: 'Feedback' },
  { name: 'X', component: X, category: 'Navigation' },
  { name: 'CaretDown', component: CaretDown, category: 'Navigation' },
  { name: 'CaretUp', component: CaretUp, category: 'Navigation' },
  { name: 'CaretLeft', component: CaretLeft, category: 'Navigation' },
  { name: 'CaretRight', component: CaretRight, category: 'Navigation' },
  { name: 'ArrowRight', component: ArrowRight, category: 'Navigation' },
  { name: 'ArrowUp', component: ArrowUp, category: 'Navigation' },
  { name: 'ArrowDown', component: ArrowDown, category: 'Navigation' },
  { name: 'ArrowsDownUp', component: ArrowsDownUp, category: 'Navigation' },
  { name: 'ArrowCounterClockwise', component: ArrowCounterClockwise, category: 'Action' },
  { name: 'Plus', component: Plus, category: 'Action' },
  { name: 'Minus', component: Minus, category: 'Action' },
  { name: 'Trash', component: Trash, category: 'Action' },
  { name: 'MagnifyingGlass', component: MagnifyingGlass, category: 'Action' },
  { name: 'Calendar', component: Calendar, category: 'Action' },
  { name: 'Key', component: Key, category: 'Action' },
  { name: 'Spinner', component: Spinner, category: 'Action' },
  { name: 'Envelope', component: Envelope, category: 'Communication' },
  { name: 'WhatsappLogo', component: WhatsappLogo, category: 'Communication' },
  { name: 'Lock', component: Lock, category: 'Security' },
  { name: 'ShieldCheck', component: ShieldCheck, category: 'Security' },
  { name: 'WifiSlash', component: WifiSlash, category: 'System' },
  { name: 'Bell', component: Bell, category: 'System' },
  { name: 'User', component: User, category: 'Commerce' },
  { name: 'Storefront', component: Storefront, category: 'Commerce' },
  { name: 'ShoppingCart', component: ShoppingCart, category: 'Commerce' },
  { name: 'Package', component: Package, category: 'Commerce' },
  { name: 'Truck', component: Truck, category: 'Commerce' },
  { name: 'CurrencyCircleDollar', component: CurrencyCircleDollar, category: 'Commerce' },
  { name: 'Certificate', component: Certificate, category: 'Commerce' },
  { name: 'Heart', component: Heart, category: 'Commerce' },
  { name: 'Star', component: Star, category: 'Commerce' },
  { name: 'Flame', component: Flame, category: 'Commerce' },
  { name: 'Lightning', component: Lightning, category: 'Commerce' },
  { name: 'House', component: House, category: 'App Layout' },
  { name: 'SignOut', component: SignOut, category: 'App Layout' },
  { name: 'Table', component: Table, category: 'View Switcher' },
  { name: 'List', component: List, category: 'View Switcher' },
  { name: 'SquaresFour', component: SquaresFour, category: 'View Switcher' },
  { name: 'Columns', component: Columns, category: 'View Switcher' },
  { name: 'TrendUp', component: TrendUp, category: 'Metrics' },
  { name: 'TrendDown', component: TrendDown, category: 'Metrics' },
];

const IconsShowcase = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (name: string) => {
    navigator.clipboard.writeText(`<${name} />`);
    setCopied(name);
    setTimeout(() => setCopied(null), 2000);
  };

  const filteredIcons = icons.filter((icon) =>
    icon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    icon.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', fontFamily: 'var(--font-family)' }}>
      <h1 style={{ font: 'var(--text-display)', color: 'var(--ciamik-ink)', marginBottom: 8 }}>
        Icons Foundation
      </h1>
      <p style={{ font: 'var(--text-body)', color: 'var(--ciamik-text-secondary)', marginBottom: 24 }}>
        CIAMIK menggunakan library <strong>Phosphor Icons (React)</strong> untuk visualisasi icon di seluruh library.
        Klik pada kartu icon untuk menyalin tag JSX-nya.
      </p>

      <div style={{ marginBottom: 32 }}>
        <input
          type="text"
          placeholder="Cari icon berdasarkan nama atau kategori..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 16px',
            borderRadius: 'var(--r-md)',
            border: '1px solid var(--ciamik-border-faint)',
            backgroundColor: 'var(--ciamik-surface)',
            color: 'var(--ciamik-ink)',
            font: 'var(--text-body)',
            outline: 'none',
            boxShadow: 'var(--sh-sm)',
          }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 16 }}>
        {filteredIcons.map((icon) => {
          const IconComp = icon.component;
          return (
            <div
              key={icon.name}
              onClick={() => handleCopy(icon.name)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 16,
                backgroundColor: 'var(--ciamik-surface)',
                borderRadius: 'var(--r-lg)',
                border: '1px solid var(--ciamik-border-faint)',
                cursor: 'pointer',
                transition: 'all var(--dur-base) var(--ease)',
                boxShadow: 'var(--sh-sm)',
                position: 'relative',
              }}
              className="icon-card"
            >
              <style>{`
                .icon-card:hover {
                  border-color: var(--ciamik-primary);
                  transform: translateY(-2px);
                  box-shadow: var(--sh-md);
                }
              `}</style>
              
              <IconComp size={32} color="var(--ciamik-ink)" weight="regular" />
              
              <span style={{
                font: 'var(--text-caption)',
                color: 'var(--ciamik-ink)',
                marginTop: 12,
                fontWeight: 500,
                textAlign: 'center',
                fontSize: 12,
                wordBreak: 'break-word',
              }}>
                {icon.name}
              </span>
              
              <span style={{
                fontSize: 9,
                color: 'var(--ciamik-text-tertiary)',
                marginTop: 4,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}>
                {icon.category}
              </span>

              {copied === icon.name && (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: 'var(--ciamik-primary)',
                  borderRadius: 'var(--r-lg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  font: 'var(--text-caption)',
                  fontWeight: 600,
                  fontSize: 12,
                  zIndex: 2,
                }}>
                  Copied!
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredIcons.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '48px 0',
          color: 'var(--ciamik-text-secondary)',
          font: 'var(--text-body)',
        }}>
          Tidak ada icon yang cocok dengan pencarian Anda.
        </div>
      )}
    </div>
  );
};

const meta: Meta = {
  title: 'Foundations/Icons',
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj;

export const Overview: Story = {
  render: () => <IconsShowcase />,
};
