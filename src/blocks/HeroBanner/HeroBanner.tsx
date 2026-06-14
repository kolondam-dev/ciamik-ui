import React, { useState, useEffect, useRef } from 'react';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import { cn } from '../../utils';
import styles from './HeroBanner.module.css';

export interface HeroSlide {
  id: string | number;
  image: string;
  eyebrow?: string;
  title: string;
  description?: string;
  ctaText?: string;
  ctaHref?: string;
  onCtaClick?: (id: string | number) => void;
}

export interface HeroBannerProps {
  slides: HeroSlide[];
  autoPlay?: boolean;
  interval?: number; // duration in ms
  className?: string;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  slides = [],
  autoPlay = true,
  interval = 5000,
  className,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const slideCount = slides.length;

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slideCount);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slideCount) % slideCount);
  };

  const selectSlide = (index: number) => {
    setCurrentIndex(index);
    setIsPaused(true); // stop autoplay upon manual selection
  };

  // Manage Autoplay timer
  useEffect(() => {
    if (slideCount <= 1 || !autoPlay || isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    // Check prefers-reduced-motion user settings
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      return;
    }

    timerRef.current = setInterval(nextSlide, interval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, isPaused, autoPlay, interval, slideCount]);

  if (slideCount === 0) return null;

  return (
    <div
      className={cn(styles.container, className)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides track */}
      <div
        className={styles.track}
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((slide, idx) => (
          <div
            key={slide.id}
            className={cn(styles.slide, idx === currentIndex && styles.activeSlide)}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            {/* Scrim Overlay */}
            <div className={styles.scrim} />

            <div className={styles.content}>
              {slide.eyebrow && <span className={styles.eyebrow}>{slide.eyebrow}</span>}
              <h2 className={styles.title}>{slide.title}</h2>
              {slide.description && <p className={styles.description}>{slide.description}</p>}
              {slide.ctaText && (
                <div className={styles.ctaWrapper}>
                  {slide.ctaHref ? (
                    <a
                      href={slide.ctaHref}
                      className={styles.ctaBtn}
                      onClick={() => slide.onCtaClick && slide.onCtaClick(slide.id)}
                    >
                      {slide.ctaText}
                    </a>
                  ) : (
                    <button
                      className={styles.ctaBtn}
                      onClick={() => slide.onCtaClick && slide.onCtaClick(slide.id)}
                    >
                      {slide.ctaText}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows (visible only when multiple slides exist) */}
      {slideCount > 1 && (
        <>
          <button
            className={cn(styles.arrowBtn, styles.leftArrow)}
            onClick={prevSlide}
            aria-label="Previous slide"
          >
            <CaretLeft size={20} weight="bold" />
          </button>
          <button
            className={cn(styles.arrowBtn, styles.rightArrow)}
            onClick={nextSlide}
            aria-label="Next slide"
          >
            <CaretRight size={20} weight="bold" />
          </button>
        </>
      )}

      {/* Navigation Dots Indicator */}
      {slideCount > 1 && (
        <div className={styles.dots}>
          {slides.map((_, idx) => (
            <button
              key={idx}
              className={cn(styles.dot, idx === currentIndex && styles.activeDot)}
              onClick={() => selectSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

HeroBanner.displayName = 'HeroBanner';
