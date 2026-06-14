import React from 'react';
import { ShieldCheck, CurrencyCircleDollar, ArrowCounterClockwise, Certificate, Truck } from '@phosphor-icons/react';
import { cn } from '../../utils';
import styles from './TrustBadges.module.css';

export interface TrustItem {
  key: string;
  icon: React.ReactNode;
  label: string;
  desc?: string;
  iconColor?: string; // semantic CSS variable or hex
}

export interface TrustBadgesProps {
  variant?: 'compact' | 'expanded';
  items?: TrustItem[];
  className?: string;
}

// Default ciamik.id trust items translated to Phosphor icons
const defaultTrustItems = (): TrustItem[] => [
  {
    key: 'secure',
    icon: <ShieldCheck />,
    label: 'Pembayaran Aman',
    desc: 'Transaksi dilindungi enkripsi SSL 256-bit',
    iconColor: 'var(--ciamik-primary)',
  },
  {
    key: 'cod',
    icon: <CurrencyCircleDollar />,
    label: 'COD Tersedia',
    desc: 'Bayar di tempat untuk area terjangkau',
    iconColor: 'var(--ciamik-warning-text)',
  },
  {
    key: 'return',
    icon: <ArrowCounterClockwise />,
    label: 'Bisa Retur',
    desc: 'Tukar atau kembalikan dalam 7 hari',
    iconColor: 'var(--ciamik-accent)',
  },
  {
    key: 'verified',
    icon: <Certificate />,
    label: 'Toko Terverifikasi',
    desc: 'Sudah diverifikasi oleh tim ciamik.id',
    iconColor: 'var(--ciamik-primary)',
  },
  {
    key: 'shipping',
    icon: <Truck />,
    label: 'Gratis Ongkir',
    desc: 'Untuk pesanan di atas Rp 150.000',
    iconColor: 'var(--ciamik-accent-press)',
  },
];

export const TrustBadges: React.FC<TrustBadgesProps> = ({
  variant = 'expanded',
  items,
  className,
}) => {
  const displayItems = items || defaultTrustItems();

  return (
    <div
      className={cn(
        variant === 'compact' ? styles.compact : styles.expanded,
        className
      )}
    >
      {displayItems.map((item) => (
        <div key={item.key} className={styles.tb}>
          <div
            className={styles.tbIcon}
            style={{ color: item.iconColor }}
          >
            {item.icon}
          </div>
          <div className={styles.tbText}>
            <h4>{item.label}</h4>
            {variant === 'expanded' && item.desc && <p>{item.desc}</p>}
          </div>
        </div>
      ))}
    </div>
  );
};

TrustBadges.displayName = 'TrustBadges';
