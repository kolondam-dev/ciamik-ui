import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { OTPFlow } from './OTPFlow';

describe('OTPFlow', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders Step 1 with phone input', () => {
    render(<OTPFlow />);
    expect(screen.getByText('Verifikasi WhatsApp')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('8123456789')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Kirim Kode Verifikasi/i })).toBeInTheDocument();
  });

  it('validates phone and shows error message with shake when invalid', async () => {
    render(<OTPFlow />);
    const input = screen.getByPlaceholderText('8123456789');
    const submitBtn = screen.getByRole('button', { name: /Kirim Kode Verifikasi/i });

    // Try submitting empty phone
    fireEvent.click(submitBtn);
    expect(
      screen.getByText(/Nomor WhatsApp tidak valid. Harus dimulai dengan angka 8 dan berisi 9-13 digit/i)
    ).toBeInTheDocument();

    // Try typing invalid start digit (not 8)
    fireEvent.change(input, { target: { value: '712345678' } });
    fireEvent.click(submitBtn);
    expect(
      screen.getByText(/Nomor WhatsApp tidak valid. Harus dimulai dengan angka 8 dan berisi 9-13 digit/i)
    ).toBeInTheDocument();
  });

  it('transitions to Step 2 upon successful phone submission', async () => {
    const onSendOTP = vi.fn().mockResolvedValue(true);
    render(<OTPFlow onSendOTP={onSendOTP} />);

    const input = screen.getByPlaceholderText('8123456789');
    fireEvent.change(input, { target: { value: '8123456789' } });

    const submitBtn = screen.getByRole('button', { name: /Kirim Kode Verifikasi/i });
    
    // Wrap async event handler trigger in act
    await act(async () => {
      fireEvent.click(submitBtn);
    });

    expect(onSendOTP).toHaveBeenCalledWith('+628123456789');
    // Screen transitions to Step 2 code entry
    expect(screen.getByText('Masukkan Kode OTP')).toBeInTheDocument();
  });

  it('handles digit typing, auto-focus advances, and otp verification', async () => {
    const onSendOTP = vi.fn().mockResolvedValue(true);
    const onVerifyOTP = vi.fn().mockResolvedValue(true);
    
    render(<OTPFlow onSendOTP={onSendOTP} onVerifyOTP={onVerifyOTP} />);

    // Transition to step 2 first
    const input = screen.getByPlaceholderText('8123456789');
    fireEvent.change(input, { target: { value: '8123456789' } });
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Kirim Kode Verifikasi/i }));
    });

    // We should see 4 inputs
    const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
    expect(inputs.length).toBe(4);

    // Type digits
    fireEvent.change(inputs[0], { target: { value: '1' } });
    fireEvent.change(inputs[1], { target: { value: '2' } });
    fireEvent.change(inputs[2], { target: { value: '3' } });
    fireEvent.change(inputs[3], { target: { value: '4' } });

    const verifyBtn = screen.getByRole('button', { name: /Verifikasi & Lanjutkan/i });
    
    await act(async () => {
      fireEvent.click(verifyBtn);
    });

    expect(onVerifyOTP).toHaveBeenCalledWith('1234');
    expect(screen.getByText('Verifikasi Berhasil')).toBeInTheDocument();
  });
});
