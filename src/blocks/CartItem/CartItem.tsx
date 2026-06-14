import React from 'react';
import { Trash, Minus, Plus } from '@phosphor-icons/react';
import { cn, formatCurrency } from '../../utils';
import styles from './CartItem.module.css';

export interface CartItemProps {
  id: string | number;
  image: string;
  name: string;
  variantLabel?: string;
  price: number;
  quantity: number;
  maxQuantity?: number;
  onQuantityChange?: (id: string | number, newQty: number) => void;
  onRemove?: (id: string | number) => void;
  className?: string;
}

export const CartItem: React.FC<CartItemProps> = ({
  id,
  image,
  name,
  variantLabel,
  price,
  quantity,
  maxQuantity = 10,
  onQuantityChange,
  onRemove,
  className,
}) => {
  const handleDecrease = () => {
    if (onQuantityChange) {
      onQuantityChange(id, quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (onQuantityChange && quantity < maxQuantity) {
      onQuantityChange(id, quantity + 1);
    }
  };

  return (
    <div className={cn(styles.cartItem, className)}>
      <div className={styles.ciImg}>
        <img src={image} alt={name} loading="lazy" />
      </div>
      <div className={styles.ciInfo}>
        <h4 className={styles.ciName}>{name}</h4>
        {variantLabel && <div className={styles.ciVariant}>{variantLabel}</div>}
        <div className={styles.ciPrice}>{formatCurrency(price)}</div>
        <div className={styles.ciStepper}>
          <button
            onClick={handleDecrease}
            aria-label="Decrease quantity"
          >
            <Minus size={12} />
          </button>
          <span className={styles.qty}>{quantity}</span>
          <button
            onClick={handleIncrease}
            aria-label="Increase quantity"
            disabled={quantity >= maxQuantity}
          >
            <Plus size={12} />
          </button>
        </div>
      </div>
      <button
        className={styles.ciRemove}
        onClick={() => onRemove && onRemove(id)}
        aria-label="Hapus item"
      >
        <Trash size={18} />
      </button>
    </div>
  );
};

CartItem.displayName = 'CartItem';
