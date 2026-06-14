import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductCard } from './ProductCard';

describe('ProductCard', () => {
  const defaultProps = {
    id: 1,
    image: 'https://example.com/image.jpg',
    name: 'Test Product Name',
    category: 'Fashion',
    rating: 4.5,
    soldCount: 120,
    price: 150000,
    stock: 10,
  };

  it('renders product name, price, rating and sold count', () => {
    render(<ProductCard {...defaultProps} />);
    expect(screen.getByText('Test Product Name')).toBeInTheDocument();
    expect(screen.getByText('Rp 150.000')).toBeInTheDocument();
    expect(screen.getByText('4.5 · 120 terjual')).toBeInTheDocument();
    expect(screen.getByText('Tersedia')).toBeInTheDocument();
  });

  it('renders correct badges', () => {
    const badges = [
      { type: 'flash', text: '⚡ Flash Sale' },
      { type: 'free', text: '🚚 Bebas Ongkir' },
    ];
    render(<ProductCard {...defaultProps} badges={badges} />);
    expect(screen.getByText('⚡ Flash Sale')).toBeInTheDocument();
    expect(screen.getByText('🚚 Bebas Ongkir')).toBeInTheDocument();
  });

  it('renders discount percentage and old price if provided', () => {
    render(
      <ProductCard
        {...defaultProps}
        originalPrice={200000}
        discountPercent={25}
      />
    );
    expect(screen.getByText('Rp 200.000')).toBeInTheDocument();
    expect(screen.getByText('-25%')).toBeInTheDocument();
  });

  it('displays out of stock overlay and wishlist cta when stock is 0', () => {
    render(<ProductCard {...defaultProps} stock={0} />);
    expect(screen.getByText('Stok habis')).toBeInTheDocument();
    expect(screen.getByText('Habis')).toBeInTheDocument();
    expect(screen.getByText('Beri tahu saya')).toBeInTheDocument();
  });

  it('triggers onAddToCart callback when cart button is clicked', () => {
    const onAddToCart = vi.fn();
    render(<ProductCard {...defaultProps} onAddToCart={onAddToCart} />);
    const atcBtn = screen.getByRole('button', { name: /Keranjang/i });
    fireEvent.click(atcBtn);
    expect(onAddToCart).toHaveBeenCalledWith(1);
  });

  it('renders stepper and triggers quantity adjustment callbacks when cartQty > 0', () => {
    const onUpdateCartQty = vi.fn();
    render(
      <ProductCard
        {...defaultProps}
        cartQty={2}
        onUpdateCartQty={onUpdateCartQty}
      />
    );
    // stepper quantity is rendered
    expect(screen.getByText('2')).toBeInTheDocument();

    // click minus button
    const minusBtn = screen.getByRole('button', { name: /Decrease quantity/i });
    fireEvent.click(minusBtn);
    expect(onUpdateCartQty).toHaveBeenCalledWith(1, 1);

    // click plus button
    const plusBtn = screen.getByRole('button', { name: /Increase quantity/i });
    fireEvent.click(plusBtn);
    expect(onUpdateCartQty).toHaveBeenCalledWith(1, 3);
  });

  it('triggers onWishlistToggle when heart icon is clicked', () => {
    const onWishlistToggle = vi.fn();
    render(<ProductCard {...defaultProps} onWishlistToggle={onWishlistToggle} />);
    const heartBtn = screen.getByRole('button', { name: /Toggle Wishlist/i });
    fireEvent.click(heartBtn);
    expect(onWishlistToggle).toHaveBeenCalledWith(1);
  });

  it('triggers onClick when the card body is clicked', () => {
    const onClick = vi.fn();
    render(<ProductCard {...defaultProps} onClick={onClick} />);
    // Click the card title, which should trigger the card click
    fireEvent.click(screen.getByText('Test Product Name'));
    expect(onClick).toHaveBeenCalledWith(1);
  });
});
