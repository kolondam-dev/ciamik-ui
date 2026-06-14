import { describe, it, expect } from 'vitest';
import { STATUS_MAP, ALL_STATUSES, ORDER_STATUSES, RETURN_STATUSES } from './statusMap';

describe('STATUS_MAP', () => {
  it('should contain all 15 mapped statuses', () => {
    expect(ALL_STATUSES.length).toBe(15);
  });

  it('should separate order and return statuses correctly', () => {
    expect(ORDER_STATUSES).toContain('PENDING_PAYMENT');
    expect(ORDER_STATUSES).toContain('COMPLETED');
    expect(ORDER_STATUSES).toContain('CANCELLED');

    expect(RETURN_STATUSES).toContain('RETURN_REQUESTED');
    expect(RETURN_STATUSES).toContain('REFUNDED');
    expect(RETURN_STATUSES).toContain('EXCHANGED');

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
