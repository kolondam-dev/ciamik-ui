import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../../primitives/Card';
import { Badge } from '../../primitives/Badge';
import { TrendUp, TrendDown, Minus, Info } from '@phosphor-icons/react';
import { cn } from '../../utils';
import styles from './MetricCard.module.css';

export interface MetricCardProps {
  title: string;
  value: string | number;
  delta?: number; // percentage change, e.g. +12.4 or -3.2
  deltaLabel?: string; // e.g. "vs bulan lalu"
  recommendation?: string;
  sparkline?: React.ReactNode;
  variant?: 'dashboard' | 'simple';
  isActive?: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
  badgeColor?: 'teal' | 'navy' | 'coral' | 'mustard' | 'red' | 'default';
  children?: React.ReactNode;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  delta,
  deltaLabel,
  recommendation,
  sparkline,
  variant = 'dashboard',
  isActive = false,
  onClick,
  icon,
  badgeColor = 'default',
  children,
  className,
}) => {
  const hasDelta = delta !== undefined;
  const isPositive = hasDelta && delta! > 0;
  const isNegative = hasDelta && delta! < 0;
  const isZero = hasDelta && delta! === 0;

  // Motion variants for active state — very smooth, no scaling
  const cardMotion = {
    rest: {
      y: 0,
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      borderColor: 'var(--ciamik-border-faint)',
    },
    hover: {
      y: -1,
      boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
      transition: { duration: 0.2, ease: 'easeOut' },
    },
    active: {
      y: 0,
      boxShadow: '0 0 0 3px rgba(47, 122, 120, 0.14)',
      transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
    },
    tap: {
      y: 0,
      transition: { duration: 0.1 },
    },
  };

  if (variant === 'simple') {
    return (
      <motion.div
        className={cn(
          styles.cardSimple,
          isActive && styles.activeCard,
          onClick && styles.clickable,
          className
        )}
        onClick={onClick}
        initial="rest"
        animate={isActive ? 'active' : 'rest'}
        whileHover={onClick ? 'hover' : undefined}
        whileTap={onClick ? 'tap' : undefined}
        variants={cardMotion}
        layout
        transition={{ layout: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } }}
      >
        <Card
          className={styles.simpleInner}
          interactive={!!onClick}
        >
          <div className={styles.simpleContainer}>
            {icon && (
              <motion.div
                className={styles.simpleIcon}
                animate={{ color: isActive ? 'var(--ciamik-primary)' : 'var(--ciamik-text-secondary)' }}
                transition={{ duration: 0.3 }}
              >
                {icon}
              </motion.div>
            )}
            {icon && <div className={styles.verticalDivider} />}
            <div className={styles.simpleData}>
              <motion.span
                className={styles.simpleValue}
                key={String(value)}
                initial={{ opacity: 0.5, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
              >
                {value}
              </motion.span>
              <span className={styles.simpleTitle}>{title}</span>
              {children}
            </div>
          </div>

          {/* Active indicator bar */}
          <AnimatePresence>
            {isActive && (
              <motion.div
                className={styles.activeIndicator}
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                exit={{ scaleX: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              />
            )}
          </AnimatePresence>
        </Card>
      </motion.div>
    );
  }

  // Dashboard variant (default)
  return (
    <motion.div
      className={cn(
        styles.card,
        isActive && styles.activeCard,
        onClick && styles.clickable,
        className
      )}
      onClick={onClick}
      initial="rest"
      animate={isActive ? 'active' : 'rest'}
      whileHover={onClick ? 'hover' : undefined}
      whileTap={onClick ? 'tap' : undefined}
      variants={cardMotion}
      layout
      transition={{ layout: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } }}
    >
      <Card
        className={styles.dashboardInner}
        interactive={!!onClick}
      >
        {/* Edge-to-edge solid rectangle badge title for dashboard metrics */}
        <div className={styles.cardHeader}>
          <div className={styles.metricTitleGroup}>
            <span className={cn(styles.badgeTitle, styles[`badge_${badgeColor}`])}>
              {title}
            </span>
            <button
              type="button"
              className={styles.metricInfoBtn}
              aria-label="Info metrik"
              onClick={(e) => e.stopPropagation()}
              style={{ border: 'none', background: 'none', cursor: 'pointer', display: 'inline-flex', padding: 0 }}
            >
              <Info size={14} className={styles.infoIcon} />
            </button>
          </div>
          {icon && <span className={styles.metricIcon}>{icon}</span>}
        </div>

        <div className={styles.metricBody}>
          <div className={styles.value}>
            <motion.span
              key={String(value)}
              initial={{ opacity: 0.5, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              {value}
            </motion.span>
          </div>
          
          {sparkline && <div className={styles.metricSparkline}>{sparkline}</div>}

          <div className={styles.metricFoot}>
            {hasDelta && (
              <Badge
                variant={isPositive ? 'success' : isNegative ? 'danger' : 'neutral'}
                pill
                className={styles.deltaBadge}
              >
                <span className={styles.deltaInner}>
                  {isPositive && <TrendUp size={10} weight="bold" />}
                  {isNegative && <TrendDown size={10} weight="bold" />}
                  {isZero && <Minus size={10} weight="bold" />}
                  <span>{Math.abs(delta!)}%</span>
                </span>
              </Badge>
            )}
            {deltaLabel && <span className={styles.deltaLabel}>{deltaLabel}</span>}
          </div>
        </div>

        {children}

        {recommendation && (
          <div className={styles.recommendationWrapper}>
            <p className={styles.recommendation}>{recommendation}</p>
          </div>
        )}

        {/* Active indicator bar for dashboard variant */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              className={styles.activeIndicator}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              exit={{ scaleX: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            />
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};

MetricCard.displayName = 'MetricCard';
