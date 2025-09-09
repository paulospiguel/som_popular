import React, { useEffect, useRef, useState } from "react";

interface AnimatedNumberProps {
  targetNumber: number;
  duration?: number;
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  targetNumber,
  duration = 1500,
}) => {
  const [currentNumber, setCurrentNumber] = useState(0);
  // Fix: The useRef hook requires an initial value. It was called with a generic but no arguments.
  const frameRef = useRef<number | undefined>(undefined);
  // Fix: The useRef hook requires an initial value. It was called with a generic but no arguments.
  const startTimeRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const startNumber = currentNumber;
    const animate = (timestamp: number) => {
      if (startTimeRef.current === undefined) {
        startTimeRef.current = timestamp;
      }
      const elapsedTime = timestamp - startTimeRef.current;
      const progress = Math.min(elapsedTime / duration, 1);

      const easedProgress = 1 - Math.pow(1 - progress, 3); // easeOutCubic

      const newDisplayNumber =
        startNumber + (targetNumber - startNumber) * easedProgress;

      setCurrentNumber(parseFloat(newDisplayNumber.toFixed(2)));

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setCurrentNumber(targetNumber); // Ensure it ends on the exact target
        startTimeRef.current = undefined;
      }
    };

    // Reset start time for new animation
    startTimeRef.current = undefined;
    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetNumber, duration]);

  return <span>{currentNumber.toFixed(2)}</span>;
};

export default AnimatedNumber;
