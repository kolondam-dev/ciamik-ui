import React from 'react';
import { Heart, Star, ShoppingCart, Minus, Plus, Flame, Lightning } from '@phosphor-icons/react';
import { cn, formatCurrency } from '../../utils';
import styles from './ProductCard.module.css';

export interface ProductBadge {
  type: 'flash' | 'discount' | 'free' | 'instant' | string;
  text: string;
}

export interface ProductCardProps {
  id: string | number;
  image: string;
  name: string;
  category: string;
  rating: number;
  soldCount: number;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  stock?: number;
  isWishlisted?: boolean;
  cartQty?: number;
  badges?: ProductBadge[];
  onAddToCart?: (id: string | number) => void;
  onUpdateCartQty?: (id: string | number, newQty: number) => void;
  onWishlistToggle?: (id: string | number) => void;
  onClick?: (id: string | number) => void;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  image,
  name,
  category,
  rating,
  soldCount,
  price,
  originalPrice,
  discountPercent,
  stock = 10,
  isWishlisted = false,
  cartQty = 0,
  badges = [],
  onAddToCart,
  onUpdateCartQty,
  onWishlistToggle,
  onClick,
  className,
}) => {
  const isOos = stock === 0;
  const inCart = cartQty > 0;

  // Handle card area click (excluding interactive CTA/hearts buttons)
  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest(`.${styles.heart}`) || target.closest(`.${styles.ctaArea}`)) {
      return;
    }
    if (onClick) {
      onClick(id);
    }
  };

  // Stock indicator helper
  const renderStockIndicator = () => {
    if (isOos) {
      return (
        <span className={cn(styles.stockLabel, styles.stockOos)}>
          <span className={styles.dot} /> Habis
        </span>
      );
    } else if (stock <= 5) {
      return (
        <span className={cn(styles.stockLabel, styles.stockLow)}>
          <span className={cn(styles.dot, styles.pulseDot)} /> Sisa {stock}!
        </span>
      );
    } else {
      return (
        <span className={cn(styles.stockLabel, styles.stockAvailable)}>
          <span className={styles.dot} /> Tersedia
        </span>
      );
    }
  };

  // Group badges into quadrants to match mock storefront UI
  // Quadrant 1 (Top Left) holds the first 2 badges
  const topLeftBadges = badges.slice(0, 2);
  // Quadrant 2 (Bottom Left) holds the next 2 badges
  const bottomLeftBadges = badges.slice(2, 4);

  return (
    <div
      className={cn(styles.card, inCart && styles.inCart, className)}
      onClick={handleCardClick}
      data-id={id}
    >
      <div className={styles.pimg}>
        <img src={image} alt={name} loading="lazy" />

        {/* Top Left Badges Block */}
        {topLeftBadges.length > 0 && (
          <div className={styles.badgeColTop}>
            {topLeftBadges.map((badge, idx) => (
              <span
                key={idx}
                className={cn(styles.badge, styles[badge.type] || styles.defaultBadge)}
              >
                {badge.type === 'flash' && <Lightning size={10} weight="fill" />}
                {badge.text}
              </span>
            ))}
          </div>
        )}

        {/* Bottom Left Badges Block */}
        {bottomLeftBadges.length > 0 && (
          <div className={styles.badgeColBottom}>
            {bottomLeftBadges.map((badge, idx) => (
              <span
                key={idx}
                className={cn(styles.badge, styles[badge.type] || styles.defaultBadge)}
              >
                {badge.text}
              </span>
            ))}
          </div>
        )}

        {/* Terlaris badge in bottom-right corner if soldCount >= 300 */}
        {soldCount >= 300 && (
          <span className={cn(styles.badge, styles.terlaris)}>
            <Flame size={12} weight="fill" className={styles.flameIcon} /> Terlaris
          </span>
        )}

        {/* Wishlist Heart Overlay */}
        <button
          className={cn(styles.heart, isWishlisted && styles.liked)}
          onClick={() => onWishlistToggle && onWishlistToggle(id)}
          aria-label="Toggle Wishlist"
        >
          <Heart size={16} weight={isWishlisted ? 'fill' : 'regular'} />
        </button>

        {/* Out of Stock Scrim Overlay */}
        {isOos && <div className={styles.oosOverlay}>Stok habis</div>}
      </div>

      <div className={styles.pb}>
        {/* Category line */}
        <div className={styles.categoryRow}>
          <span className={styles.categoryLabel}>{category}</span>
        </div>

        {/* Product title */}
        <h4 className={styles.pn}>{name}</h4>

        {/* Rating and Stock Meta */}
        <div className={styles.pmeta}>
          <span className={styles.ratingText}>
            <Star size={12} weight="fill" className={styles.starIcon} />
            {rating.toFixed(1)} · {soldCount >= 1000 ? `${(soldCount / 1000).toFixed(1)}rb` : soldCount} terjual
          </span>
          {renderStockIndicator()}
        </div>

        {/* Price layout */}
        <div className={styles.priceContainer}>
          <div className={styles.pprice}>{formatCurrency(price)}</div>
          {originalPrice && discountPercent && (
            <div className={styles.discountRow}>
              <span className={styles.priceOld}>{formatCurrency(originalPrice)}</span>
              <span className={styles.discountBadge}>-{discountPercent}%</span>
            </div>
          )}
        </div>

        {/* Dynamic CTA controls */}
        <div className={styles.ctaArea}>
          {isOos ? (
            <button
              className={cn(styles.ctaBtn, isWishlisted ? styles.wishlistedBtn : styles.notifyBtn)}
              onClick={() => onWishlistToggle && onWishlistToggle(id)}
            >
              {isWishlisted ? 'Sudah di Wishlist' : 'Beri tahu saya'}
            </button>
          ) : inCart ? (
            <div className={styles.stepper}>
              <button
                onClick={() => onUpdateCartQty && onUpdateCartQty(id, cartQty - 1)}
                aria-label="Decrease quantity"
              >
                <Minus size={14} />
              </button>
              <span className={styles.qty}>{cartQty}</span>
              <button
                onClick={() => onUpdateCartQty && onUpdateCartQty(id, cartQty + 1)}
                aria-label="Increase quantity"
                disabled={cartQty >= stock}
              >
                <Plus size={14} />
              </button>
            </div>
          ) : (
            <button
              className={styles.ctaBtn}
              onClick={() => onAddToCart && onAddToCart(id)}
            >
              <ShoppingCart size={14} weight="fill" /> Keranjang
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

ProductCard.displayName = 'ProductCard';
