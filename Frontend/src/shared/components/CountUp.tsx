"use client";

import React, { useEffect, useState } from "react";

interface CountUpProps {
  value: number;
  duration?: number; // duration in milliseconds, default 1200ms
  className?: string;
  prefix?: string;
  suffix?: string;
}

/**
 * Animated number counter component that smoothly ticks up from 0 to the target value
 * whenever the component mounts or when live statistics update.
 */
export default function CountUp({
  value,
  duration = 1200,
  className = "",
  prefix = "",
  suffix = ""
}: CountUpProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const initialValue = 0;
    const targetValue = value;

    if (targetValue === 0) {
      setDisplayValue(0);
      return;
    }

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Smooth easeOutQuart formula for rapid start and elegant slowdown at conclusion
      const easeOut = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(easeOut * (targetValue - initialValue) + initialValue);
      
      setDisplayValue(current);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setDisplayValue(targetValue);
      }
    };

    const animationId = window.requestAnimationFrame(step);

    return () => {
      window.cancelAnimationFrame(animationId);
    };
  }, [value, duration]);

  return (
    <span className={className}>
      {prefix}{displayValue.toLocaleString()}{suffix}
    </span>
  );
}
