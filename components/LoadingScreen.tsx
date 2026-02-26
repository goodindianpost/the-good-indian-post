import React, { useState, useEffect, useRef } from 'react';

const taglines = [
  "Finding the good in every story...",
  "Stories that inspire, news that matters...",
  "Celebrating India, one story at a time...",
  "Where good news finds you...",
];

interface LoadingScreenProps {
  onLoadingComplete?: () => void;
  minDisplayTime?: number;
  isDataReady?: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  onLoadingComplete,
  minDisplayTime = 1500,
  isDataReady = false
}) => {
  const [currentTagline, setCurrentTagline] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const hasExited = useRef(false);

  // Rotate taglines
  useEffect(() => {
    const taglineInterval = setInterval(() => {
      setCurrentTagline((prev) => (prev + 1) % taglines.length);
    }, 2500);
    return () => clearInterval(taglineInterval);
  }, []);

  // Track minimum display time
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, minDisplayTime);
    return () => clearTimeout(timer);
  }, [minDisplayTime]);

  // Exit when both conditions are met
  useEffect(() => {
    if (minTimeElapsed && isDataReady && !hasExited.current) {
      hasExited.current = true;
      setIsExiting(true);
      setTimeout(() => {
        onLoadingComplete?.();
      }, 500); // Match fade-out duration
    }
  }, [minTimeElapsed, isDataReady, onLoadingComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-brand-white transition-opacity duration-500 ${
        isExiting ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Logo / Brand Name */}
      <div className="text-center mb-8">
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-brand-black">
          <span className="inline-block animate-fade-in-up">The</span>{' '}
          <span className="inline-block animate-fade-in-up animation-delay-100">Good</span>{' '}
          <span className="inline-block animate-fade-in-up animation-delay-200 text-brand-red">Indian</span>{' '}
          <span className="inline-block animate-fade-in-up animation-delay-300">Post</span>
        </h1>
      </div>

      {/* Animated line */}
      <div className="w-24 h-0.5 bg-gray-200 rounded-full overflow-hidden mb-8">
        <div className="h-full bg-brand-red animate-loading-bar" />
      </div>

      {/* Rotating tagline */}
      <p className="font-serif text-base sm:text-lg text-gray-medium animate-pulse-subtle max-w-xs text-center px-4">
        {taglines[currentTagline]}
      </p>
    </div>
  );
};

export default LoadingScreen;
