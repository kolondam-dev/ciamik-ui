import React from 'react';
import { Card } from '../../primitives/Card';
import { Badge } from '../../primitives/Badge';
import { TrendUp, TrendDown, Minus } from '@phosphor-icons/react';
import { cn } from '../../utils';
import styles from './MetricCard.module.css';

export interface MetricCardProps {
  title: string;
  value: string | number;
  delta?: number; // percentage change, e.g. +12.4 or -3.2
  deltaLabel?: string; // e.g. "vs bulan lalu"
  recommendation?: string;
  sparkline?: React.ReactNode;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  delta,
  deltaLabel,
  recommendation,
  sparkline,
  className,
}) => {
  const hasDelta = delta !== undefined;
  const isPositive = hasDelta && delta! > 0;
  const isNegative = hasDelta && delta! < 0;
  const isZero = hasDelta && delta! === 0;

  return (
    <Card className={cn(styles.card, className)}>
      <div className={styles.header}>
        <span className={styles.title}>{title}</span>
      </div>
      <div className={styles.content}>
        <div className={styles.valueRow}>
          <span className={styles.value}>{value}</span>
          {hasDelta && (
            <div className={styles.deltaContainer}>
              <Badge
                variant={isPositive ? 'success' : isNegative ? 'danger' : 'neutral'}
                pill
                className={styles.deltaBadge}
              >
                <span className={styles.deltaInner}>
                  {isPositive && <TrendUp size={12} weight="bold" />}
                  {isNegative && <TrendDown size={12} weight="bold" />}
                  {isZero && <Minus size={12} weight="bold" />}
                  <span>{Math.abs(delta!)}%</span>
                </span>
              </Badge>
              {deltaLabel && <span className={styles.deltaLabel}>{deltaLabel}</span>}
            </div>
          )}
        </div>
        {sparkline && <div className={styles.sparklineSlot}>{sparkline}</div>}
      </div>
      {recommendation && (
        <div className={styles.recommendationWrapper}>
          <p className={styles.recommendation}>{recommendation}</p>
        </div>
      )}
    </Card>
  );
};
