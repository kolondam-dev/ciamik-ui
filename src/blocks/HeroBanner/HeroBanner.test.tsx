import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { HeroBanner } from './HeroBanner';

describe('HeroBanner', () => {
  const slides = [
    {
      id: 1,
      image: 'https://example.com/img1.jpg',
      eyebrow: 'PROMO 1',
      title: 'Slide Title One',
      description: 'Slide Desc One',
      ctaText: 'CTA One',
    },
    {
      id: 2,
      image: 'https://example.com/img2.jpg',
      eyebrow: 'PROMO 2',
      title: 'Slide Title Two',
      description: 'Slide Desc Two',
      ctaText: 'CTA Two',
    },
  ];

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders initial slide content correctly', () => {
    render(<HeroBanner slides={slides} autoPlay={false} />);

    expect(screen.getByText('PROMO 1')).toBeInTheDocument();
    expect(screen.getByText('Slide Title One')).toBeInTheDocument();
    expect(screen.getByText('Slide Desc One')).toBeInTheDocument();
    expect(screen.getByText('CTA One')).toBeInTheDocument();

    // Slide 2 content should also exist in track, but slide 1 is showing
    expect(screen.getByText('Slide Title Two')).toBeInTheDocument();
  });

  it('navigates next and back using arrow keys', () => {
    render(<HeroBanner slides={slides} autoPlay={false} />);

    const nextBtn = screen.getByLabelText('Next slide');
    const prevBtn = screen.getByLabelText('Previous slide');

    // Initially at index 0. Let's click next
    fireEvent.click(nextBtn);
    // Dot indicator index 2 should now have active style class, wait:
    const dots = screen.getAllByLabelText(/Go to slide/i);
    expect(dots[1]).toHaveClass(/activeDot/i);

    // Let's click back
    fireEvent.click(prevBtn);
    expect(dots[0]).toHaveClass(/activeDot/i);
  });

  it('navigates when clicking dots directly', () => {
    render(<HeroBanner slides={slides} autoPlay={false} />);

    const dots = screen.getAllByLabelText(/Go to slide/i);

    // Click second dot
    fireEvent.click(dots[1]);
    expect(dots[1]).toHaveClass(/activeDot/i);
    expect(dots[0]).not.toHaveClass(/activeDot/i);
  });

  it('advances automatically after interval when autoPlay is enabled', () => {
    render(<HeroBanner slides={slides} autoPlay={true} interval={3000} />);
    const dots = screen.getAllByLabelText(/Go to slide/i);

    expect(dots[0]).toHaveClass(/activeDot/i);

    // Advance time by 3 seconds
    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(dots[1]).toHaveClass(/activeDot/i);
  });

  it('pauses autoplay on mouse hover and resumes on leave', () => {
    const { container } = render(
      <HeroBanner slides={slides} autoPlay={true} interval={3000} />
    );
    const dots = screen.getAllByLabelText(/Go to slide/i);
    const banner = container.firstChild as HTMLElement;

    expect(dots[0]).toHaveClass(/activeDot/i);

    // Hover mouse
    fireEvent.mouseEnter(banner);

    // Advance time by 3 seconds (should NOT advance)
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(dots[0]).toHaveClass(/activeDot/i);

    // Leave mouse
    fireEvent.mouseLeave(banner);

    // Advance time by 3 seconds (should now advance)
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(dots[1]).toHaveClass(/activeDot/i);
  });
});
