import React, { useState, useEffect, useRef } from 'react';
import { WhatsappLogo, Key, CheckCircle, Spinner } from '@phosphor-icons/react';
import { cn } from '../../utils';
import { useCiamik } from '../../provider';
import styles from './OTPFlow.module.css';

export interface OTPFlowProps {
  initialPhone?: string;
  onSendOTP?: (phone: string) => Promise<boolean> | boolean | void;
  onVerifyOTP?: (code: string) => Promise<boolean> | boolean | void;
  onSuccess?: () => void;
  onCancel?: () => void;
  className?: string;
  translations?: {
    step1Title?: string;
    step1Desc?: string;
    step1Cta?: string;
    step1Placeholder?: string;
    step2Title?: string;
    step2Desc?: (phone: string) => string | React.ReactNode;
    step2Cta?: string;
    step2ResendText?: (timer: number) => string;
    step2ResendCta?: string;
    step3Title?: string;
    step3Desc?: string;
    errorInvalidPhone?: string;
    errorSendFail?: string;
    errorConnection?: string;
    errorIncomplete?: string;
    errorVerifyFail?: string;
    errorResendFail?: string;
    cancel?: string;
  };
}

export const OTPFlow: React.FC<OTPFlowProps> = ({
  initialPhone = '',
  onSendOTP,
  onVerifyOTP,
  onSuccess,
  onCancel,
  className,
  translations,
}) => {
  const { labels } = useCiamik();
  const t = {
    step1Title: translations?.step1Title || labels?.otpFlow?.step1Title || 'Verifikasi WhatsApp',
    step1Desc: translations?.step1Desc || labels?.otpFlow?.step1Desc || 'Masukkan nomor WhatsApp Anda untuk mengirimkan kode OTP verifikasi keamanan.',
    step1Cta: translations?.step1Cta || labels?.otpFlow?.step1Cta || 'Kirim Kode Verifikasi',
    step1Placeholder: translations?.step1Placeholder || labels?.otpFlow?.step1Placeholder || '8123456789',
    step2Title: translations?.step2Title || labels?.otpFlow?.step2Title || 'Masukkan Kode OTP',
    step2Desc: translations?.step2Desc || labels?.otpFlow?.step2Desc || ((p: string) => <>Kode verifikasi telah dikirimkan ke nomor{' '}<strong className={styles.phoneHighlight}>+62 {p}</strong></>),
    step2Cta: translations?.step2Cta || labels?.otpFlow?.step2Cta || 'Verifikasi & Lanjutkan',
    step2ResendText: translations?.step2ResendText || labels?.otpFlow?.step2ResendText || ((time: number) => `Kirim ulang kode dalam ${time} detik`),
    step2ResendCta: translations?.step2ResendCta || labels?.otpFlow?.step2ResendCta || 'Kirim Ulang Kode',
    step3Title: translations?.step3Title || labels?.otpFlow?.step3Title || 'Verifikasi Berhasil',
    step3Desc: translations?.step3Desc || labels?.otpFlow?.step3Desc || 'Akun Anda telah berhasil diverifikasi. Mengalihkan Anda secara otomatis...',
    errorInvalidPhone: translations?.errorInvalidPhone || labels?.otpFlow?.errorInvalidPhone || 'Nomor WhatsApp tidak valid. Harus dimulai dengan angka 8 dan berisi 9-13 digit.',
    errorSendFail: translations?.errorSendFail || labels?.otpFlow?.errorSendFail || 'Gagal mengirimkan kode OTP. Silakan coba lagi.',
    errorConnection: translations?.errorConnection || labels?.otpFlow?.errorConnection || 'Terjadi kesalahan koneksi.',
    errorIncomplete: translations?.errorIncomplete || labels?.otpFlow?.errorIncomplete || 'Masukkan 4 digit kode verifikasi yang lengkap.',
    errorVerifyFail: translations?.errorVerifyFail || labels?.otpFlow?.errorVerifyFail || 'Kode verifikasi salah atau kedaluwarsa.',
    errorResendFail: translations?.errorResendFail || labels?.otpFlow?.errorResendFail || 'Gagal mengirim ulang kode OTP.',
    cancel: translations?.cancel || labels?.otpFlow?.cancel || 'Batalkan',
  };

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [phone, setPhone] = useState(initialPhone);
  const [digits, setDigits] = useState<string[]>(['', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isErrorShake, setIsErrorShake] = useState(false);

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Focus utility
  const focusInput = (index: number) => {
    if (inputRefs.current[index]) {
      inputRefs.current[index]?.focus();
      inputRefs.current[index]?.select();
    }
  };

  // Step 2 Timer ticking
  useEffect(() => {
    if (step === 2 && timer > 0) {
      timerRef.current = setInterval(() => {
        setTimer((t) => t - 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [step, timer]);

  // Step 3 redirection trigger
  useEffect(() => {
    if (step === 3) {
      const successTimer = setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 1800);
      return () => clearTimeout(successTimer);
    }
  }, [step, onSuccess]);

  // Error shake helper
  const triggerShake = (msg: string) => {
    setErrorMsg(msg);
    setIsErrorShake(true);
    setTimeout(() => setIsErrorShake(false), 450);
  };

  // Step 1: Send OTP handler
  const handleSendClick = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validate phone: must start with 8 and be between 9-13 digits
    const cleanedPhone = phone.trim().replace(/\D/g, '');
    if (!cleanedPhone.startsWith('8') || cleanedPhone.length < 9 || cleanedPhone.length > 13) {
      triggerShake(t.errorInvalidPhone);
      return;
    }

    setIsLoading(true);
    try {
      const res = onSendOTP ? await onSendOTP(`+62${cleanedPhone}`) : true;
      if (res !== false) {
        setStep(2);
        setTimer(30);
        setDigits(['', '', '', '']);
        // Focus first digit after mounting step 2
        setTimeout(() => focusInput(0), 100);
      } else {
        triggerShake(t.errorSendFail);
      }
    } catch (err) {
      triggerShake(t.errorConnection);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Digit inputs handlers
  const handleDigitChange = (value: string, index: number) => {
    const cleanVal = value.replace(/\D/g, '').slice(-1);
    const newDigits = [...digits];
    newDigits[index] = cleanVal;
    setDigits(newDigits);

    if (cleanVal && index < 3) {
      focusInput(index + 1);
    }
  };

  const handleDigitKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        const newDigits = [...digits];
        newDigits[index - 1] = '';
        setDigits(newDigits);
        focusInput(index - 1);
      } else {
        const newDigits = [...digits];
        newDigits[index] = '';
        setDigits(newDigits);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      focusInput(index - 1);
    } else if (e.key === 'ArrowRight' && index < 3) {
      focusInput(index + 1);
    }
  };

  const handleDigitPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim().slice(0, 4).replace(/\D/g, '');
    if (pastedData) {
      const newDigits = [...digits];
      for (let i = 0; i < Math.min(pastedData.length, 4); i++) {
        newDigits[i] = pastedData[i];
      }
      setDigits(newDigits);
      // Focus the last pasted box or index 3
      const lastIdx = Math.min(pastedData.length - 1, 3);
      focusInput(lastIdx);
    }
  };

  // Step 2: Verify OTP code
  const handleVerifyClick = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const code = digits.join('');
    if (code.length < 4) {
      triggerShake(t.errorIncomplete);
      return;
    }

    setIsLoading(true);
    try {
      const res = onVerifyOTP ? await onVerifyOTP(code) : true;
      if (res !== false) {
        setStep(3);
      } else {
        triggerShake(t.errorVerifyFail);
        setDigits(['', '', '', '']);
        focusInput(0);
      }
    } catch (err) {
      triggerShake(t.errorConnection);
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP action
  const handleResendClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (timer > 0 || isLoading) return;

    setIsLoading(true);
    setErrorMsg(null);
    try {
      const cleanedPhone = phone.trim().replace(/\D/g, '');
      const res = onSendOTP ? await onSendOTP(`+62${cleanedPhone}`) : true;
      if (res !== false) {
        setTimer(30);
        setDigits(['', '', '', '']);
        focusInput(0);
      } else {
        triggerShake(t.errorResendFail);
      }
    } catch (err) {
      triggerShake(t.errorConnection);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn(styles.container, isErrorShake && styles.shake, className)}>
      {/* Step Progress Dots */}
      <div className={styles.progress}>
        <span className={cn(styles.dot, step === 1 && styles.activeDot)} />
        <span className={cn(styles.dot, step === 2 && styles.activeDot)} />
        <span className={cn(styles.dot, step === 3 && styles.activeDot)} />
      </div>

      {/* error message alert */}
      {errorMsg && <div className={styles.errorAlert}>{errorMsg}</div>}

      {/* Step 1: Input Phone */}
      {step === 1 && (
        <form onSubmit={handleSendClick} className={styles.step}>
          <div className={styles.iconWrapper}>
            <WhatsappLogo size={48} weight="fill" className={styles.waIcon} />
          </div>
          <h3 className={styles.title}>{t.step1Title}</h3>
          <p className={styles.desc}>
            {t.step1Desc}
          </p>

          <div className={styles.phoneGroup}>
            <span className={styles.prefix}>+62</span>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
              placeholder={t.step1Placeholder}
              className={styles.phoneInput}
              disabled={isLoading}
              autoFocus
            />
          </div>

          <button type="submit" className={styles.ctaBtn} disabled={isLoading}>
            {isLoading ? <Spinner className={styles.spinnerIcon} /> : t.step1Cta}
          </button>
        </form>
      )}

      {/* Step 2: Input Verification Code */}
      {step === 2 && (
        <form onSubmit={handleVerifyClick} className={styles.step}>
          <div className={styles.iconWrapper}>
            <Key size={48} weight="fill" className={styles.keyIcon} />
          </div>
          <h3 className={styles.title}>{t.step2Title}</h3>
          <p className={styles.desc}>
            {typeof t.step2Desc === 'function' ? t.step2Desc(phone) : t.step2Desc}
          </p>

          <div className={styles.digitContainer}>
            {digits.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => {
                  inputRefs.current[idx] = el;
                }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(e.target.value, idx)}
                onKeyDown={(e) => handleDigitKeyDown(e, idx)}
                onPaste={handleDigitPaste}
                className={cn(styles.digitInput, digit && styles.digitFilled)}
                disabled={isLoading}
              />
            ))}
          </div>

          <button type="submit" className={styles.ctaBtn} disabled={isLoading}>
            {isLoading ? <Spinner className={styles.spinnerIcon} /> : t.step2Cta}
          </button>

          <div className={styles.resendRow}>
            {timer > 0 ? (
              <span className={styles.timerText}>{t.step2ResendText(timer)}</span>
            ) : (
              <button
                type="button"
                onClick={handleResendClick}
                className={styles.resendLink}
                disabled={isLoading}
              >
                {t.step2ResendCta}
              </button>
            )}
          </div>
        </form>
      )}

      {/* Step 3: Success State */}
      {step === 3 && (
        <div className={cn(styles.step, styles.successStep)}>
          <div className={styles.successCheck}>
            <CheckCircle size={64} weight="fill" className={styles.checkIcon} />
          </div>
          <h3 className={styles.title}>{t.step3Title}</h3>
          <p className={styles.desc}>
            {t.step3Desc}
          </p>
        </div>
      )}

      {onCancel && step < 3 && (
        <button
          type="button"
          onClick={onCancel}
          className={styles.cancelBtn}
          disabled={isLoading}
        >
          {t.cancel}
        </button>
      )}
    </div>
  );
};

OTPFlow.displayName = 'OTPFlow';
