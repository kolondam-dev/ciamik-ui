import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BottomNav, BottomNavItem } from './BottomNav';
import { House, ShoppingCart } from '@phosphor-icons/react';

const items: BottomNavItem[] = [
  { key: 'home', label: 'Home', icon: <House data-testid="icon-home" />, isActive: true },
  { key: 'cart', label: 'Keranjang', icon: <ShoppingCart data-testid="icon-cart" />, badgeCount: 5 },
];

describe('BottomNav', () => {
  it('renders menu items and icons', () => {
    render(<BottomNav items={items} />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Keranjang')).toBeInTheDocument();
    expect(screen.getByTestId('icon-home')).toBeInTheDocument();
  });

  it('renders badge count correctly', () => {
    render(<BottomNav items={items} />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('triggers item onClick callback', () => {
    const onClick = vi.fn();
    const testItems = [
      { key: 'home', label: 'Home', icon: <House />, onClick },
    ];
    render(<BottomNav items={testItems} />);
    fireEvent.click(screen.getByText('Home'));
    expect(onClick).toHaveBeenCalled();
  });
});
