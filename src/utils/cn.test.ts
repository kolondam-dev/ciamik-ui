import { describe, it, expect } from 'vitest';
import { cn } from './cn';

describe('cn', () => {
  it('should join single class names', () => {
    expect(cn('btn')).toBe('btn');
  });

  it('should join multiple class names', () => {
    expect(cn('btn', 'btn-primary')).toBe('btn btn-primary');
  });

  it('should filter out falsy values', () => {
    expect(cn('btn', false, null, undefined, 'active')).toBe('btn active');
  });

  it('should handle conditional object mappings', () => {
    expect(cn({ active: true, disabled: false })).toBe('active');
  });
});
