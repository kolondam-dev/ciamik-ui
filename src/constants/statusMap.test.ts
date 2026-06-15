import { describe, it, expect } from 'vitest';
import { STATUS_MAP, ORDER_STATUSES, RETURN_STATUSES } from './statusMap';

describe('STATUS_MAP', () => {
  it('should contain exact 15 canonical keys including all return flows', () => {
    const keys = Object.keys(STATUS_MAP);
    expect(keys.length).toBe(15);
    
    const canonicalKeys = [
      'PENDING_PAYMENT', 'PAID', 'PROCESSING', 'PACKED', 'SHIPPED', 'DELIVERED', 'COMPLETED',
      'CANCELLED', 'RETURN_REQUESTED', 'DISPUTED', 'RETURN_IN_TRANSIT', 'RETURN_RECEIVED',
      'RETURN_REJECTED', 'REFUNDED', 'EXCHANGED'
    ];

    canonicalKeys.forEach(key => {
      expect(keys).toContain(key);
    });
  });

  it('should separate order and return statuses correctly', () => {
    expect(ORDER_STATUSES.length + RETURN_STATUSES.length).toBe(15);
  });

  it('should define correct properties for each status configuration', () => {
    const pendingPayment = STATUS_MAP.PENDING_PAYMENT;
    expect(pendingPayment.label).toBe('Menunggu bayar');
    expect(pendingPayment.intent).toBe('warning');
    expect(pendingPayment.isFinal).toBe(false);

    const completed = STATUS_MAP.COMPLETED;
    expect(completed.intent).toBe('success');
    expect(completed.isFinal).toBe(true);
  });
});
