import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';

export const ConfettiEffect: React.FC = () => {
  useEffect(() => {
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#f5c518', '#e056fd', '#00cec9', '#0984e3']
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#f5c518', '#e056fd', '#00cec9', '#0984e3']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, []);

  return null;
};
