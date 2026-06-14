import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CartItem } from './CartItem';

describe('CartItem', () => {
  const defaultProps = {
    id: 1,
    image: 'https://example.com/item.jpg',
    name: 'Cart Product Test Name',
    variantLabel: 'Size XL, Black',
    price: 150000,
    quantity: 2,
    maxQuantity: 5,
  };

  it('renders item details correctly', () => {
    render(<CartItem {...defaultProps} />);

    expect(screen.getByText('Cart Product Test Name')).toBeInTheDocument();
    expect(screen.getByText('Size XL, Black')).toBeInTheDocument();
    expect(screen.getByText('Rp 150.000')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('triggers onQuantityChange decrease and increase clicks', () => {
    const onQuantityChange = vi.fn();
    render(<CartItem {...defaultProps} onQuantityChange={onQuantityChange} />);

    const decBtn = screen.getByRole('button', { name: /Decrease quantity/i });
    const incBtn = screen.getByRole('button', { name: /Increase quantity/i });

    fireEvent.click(decBtn);
    expect(onQuantityChange).toHaveBeenCalledWith(1, 1);

    fireEvent.click(incBtn);
    expect(onQuantityChange).toHaveBeenCalledWith(1, 3);
  });

  it('disables increase button when quantity reaches maxQuantity limit', () => {
    render(<CartItem {...defaultProps} quantity={5} maxQuantity={5} />);
    const incBtn = screen.getByRole('button', { name: /Increase quantity/i });
    expect(incBtn).toBeDisabled();
  });

  it('triggers onRemove callback on trash button click', () => {
    const onRemove = vi.fn();
    render(<CartItem {...defaultProps} onRemove={onRemove} />);

    const removeBtn = screen.getByRole('button', { name: /Hapus item/i });
    fireEvent.click(removeBtn);
    expect(onRemove).toHaveBeenCalledWith(1);
  });
});
