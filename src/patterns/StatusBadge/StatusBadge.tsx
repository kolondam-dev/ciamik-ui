import React from 'react';
import {
  Clock,
  Money,
  Gear,
  Package,
  Truck,
  MapPin,
  CheckCircle,
  Prohibit,
  ArrowBendUpLeft,
  Gavel,
  X,
  CurrencyDollar,
  ArrowsLeftRight,
} from '@phosphor-icons/react';
import { Badge } from '../../primitives/Badge';
import { STATUS_MAP } from '../../constants/statusMap';
import styles from './StatusBadge.module.css';

const ICON_COMPONENTS: Record<string, React.ComponentType<any>> = {
  Clock,
  Money,
  Gear,
  Package,
  Truck,
  MapPin,
  CheckCircle,
  Prohibit,
  ArrowBendUpLeft,
  Gavel,
  X,
  CurrencyDollar,
  ArrowsLeftRight,
};

export interface StatusBadgeProps {
  status: keyof typeof STATUS_MAP;
  className?: string;
  hideIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className,
  hideIcon = false,
}) => {
  const config = STATUS_MAP[status];

  if (!config) {
    // Fallback if status is unknown
    return (
      <Badge variant="neutral" className={className}>
        {status}
      </Badge>
    );
  }

  // Get matching icon component
  const IconComponent = ICON_COMPONENTS[config.icon];

  return (
    <Badge
      variant={config.intent === 'neutral' ? 'neutral' : config.intent}
      className={className}
      pill={true}
    >
      <span className={styles.inner}>
        {!hideIcon && IconComponent && (
          <span className={styles.iconWrapper} data-testid="status-badge-icon">
            <IconComponent size={13} weight="bold" />
          </span>
        )}
        <span>{config.label}</span>
      </span>
    </Badge>
  );
};
