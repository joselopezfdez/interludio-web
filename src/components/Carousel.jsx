'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Premium Carousel Component
 * 
 * Features:
 * - Dynamic images via props
 * - Automatic sliding
 * - Responsive manual controls
 * - Pause on hover
 * - Smooth CSS transitions
 * - Modern indicator system
 */
export default function Carousel({
    images = [],
    autoSlideInterval = 5000,
    className = ""
}) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);

    // Minimum swipe distance (in pixels)
    const minSwipeDistance = 50;

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, [images.length]);

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    // Auto-slide logic
    useEffect(() => {
        if (isPaused || images.length <= 1) return;

        const interval = setInterval(nextSlide, autoSlideInterval);
        return () => clearInterval(interval);
    }, [nextSlide, autoSlideInterval, isPaused, images.length]);

    // Touch handlers for mobile swipe
    const onTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            nextSlide();
        } else if (isRightSwipe) {
            prevSlide();
        }
    };

    if (!images || images.length === 0) {
        return (
            <div className="w-full h-[400px] flex items-center justify-center bg-studio-card rounded-2xl border border-brand-primary/10">
                <p className="opacity-40 italic font-light tracking-widest text-sm uppercase">No images provided</p>
            </div>
        );
    }

    return (
        <div
            className={`relative w-full overflow-hidden group rounded-3xl border border-brand-primary/10 bg-studio-card shadow-2xl ${className}`}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
        >
            {/* Main Carousel Track */}
            <div
                className="flex transition-transform duration-1000 cubic-bezier(0.16, 1, 0.3, 1) h-full"
                style={{
                    transform: `translateX(-${currentIndex * 100}%)`,
                    transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)'
                }}
            >
                {images.map((image, index) => (
                    <div
                        key={index}
                        className="min-w-full relative aspect-[16/9] md:aspect-[21/9] overflow-hidden"
                    >
                        <img
                            src={image}
                            alt={`Slide ${index + 1}`}
                            className={`w-full h-full object-cover transition-transform duration-[2000ms] ease-out ${currentIndex === index ? 'scale-105' : 'scale-110'
                                }`}
                        />

                        {/* Overlay Gradient for depth */}
                        <div className="absolute inset-0 bg-gradient-to-t from-studio-bg via-transparent to-transparent opacity-60" />
                    </div>
                ))}
            </div>

            {/* Navigation Controls */}
            {images.length > 1 && (
                <>
                    {/* Previous Button */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center bg-white/20 backdrop-blur-xl border border-white/30 rounded-full text-brand-primary transition-all duration-300 opacity-0 group-hover:opacity-100 hover:bg-brand-primary hover:text-white hover:scale-110 active:scale-95 translate-x-4 group-hover:translate-x-0 shadow-lg"
                        aria-label="Previous slide"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                    </button>

                    {/* Next Button */}
                    <button
                        onClick={nextSlide}
                        className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center bg-white/20 backdrop-blur-xl border border-white/30 rounded-full text-brand-primary transition-all duration-300 opacity-0 group-hover:opacity-100 hover:bg-brand-primary hover:text-white hover:scale-110 active:scale-95 -translate-x-4 group-hover:translate-x-0 shadow-lg"
                        aria-label="Next slide"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </button>

                    {/* Progress Indicators */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
                        {images.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={`group relative h-1.5 transition-all duration-500 rounded-full overflow-hidden ${currentIndex === index ? 'w-10 bg-brand-primary' : 'w-2 bg-black/20 hover:bg-black/40'
                                    }`}
                                aria-label={`Go to slide ${index + 1}`}
                            >
                                {currentIndex === index && (
                                    <div
                                        className="absolute inset-0 bg-white/20 animate-pulse"
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                </>
            )}

            {/* Counter */}
            <div className="absolute top-6 right-6 z-20 px-3 py-1 bg-white/30 backdrop-blur-md border border-white/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-sm">
                <span className="text-[10px] font-bold tracking-widest opacity-60 uppercase text-brand-primary">
                    {currentIndex + 1} <span className="opacity-30 mx-1">/</span> {images.length}
                </span>
            </div>
        </div>
    );
}
