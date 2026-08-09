'use client';
import { cn } from '@/lib/utils';
import { motion, TargetAndTransition, Transition } from 'motion/react';
import { useEffect, useState } from 'react';

export type TextRollProps = {
  children: string;
  duration?: number;
  getEnterDelay?: (index: number) => number;
  getExitDelay?: (index: number) => number;
  className?: string;
  transition?: Transition;
  variants?: {
    enter: {
      initial: TargetAndTransition;
      animate: TargetAndTransition;
    };
    exit: {
      initial: TargetAndTransition;
      animate: TargetAndTransition;
    };
  };
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  /** Fires once, when the mount-triggered roll-in finishes. */
  onDone?: () => void;
};

const defaultVariants = {
  enter: {
    initial: { rotateX: 0 },
    animate: { rotateX: 90 },
  },
  exit: {
    initial: { rotateX: 90 },
    animate: { rotateX: 0 },
  },
};

export function TextRoll({
  children,
  duration = 0.5,
  getEnterDelay = (i) => i * 0.1,
  getExitDelay = (i) => i * 0.1 + 0.05,
  className,
  transition = { ease: 'easeIn' },
  variants,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onDone,
}: TextRollProps) {
  const [isHovered, setIsHovered] = useState(false);

  const letters = children.split('');

  // Play the roll once on mount (page-open reveal), independent of hover.
  useEffect(() => {
    setIsHovered(true);
    const lastIndex = Math.max(letters.length - 1, 0);
    const lastDelay = Math.max(getEnterDelay(lastIndex), getExitDelay(lastIndex));
    const timeout = setTimeout(() => {
      setIsHovered(false);
      onDone?.();
    }, (lastDelay + duration) * 1000);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount only
  }, []);

  const enterVariants = {
    initial: variants?.enter?.initial || defaultVariants.enter.initial,
    animate: variants?.enter?.animate || defaultVariants.enter.animate,
  };
  const exitVariants = {
    initial: variants?.exit?.initial || defaultVariants.exit.initial,
    animate: variants?.exit?.animate || defaultVariants.exit.animate,
  };

  return (
    <span
      className={cn('relative block overflow-hidden', className)}
      style={{ perspective: '9999999px', transformStyle: 'preserve-3d' }}
      onMouseEnter={() => {
        setIsHovered(true);
        onMouseEnter?.();
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        onMouseLeave?.();
      }}
      onClick={onClick}
    >
      <span className="relative block">
        {letters.map((letter, i) => (
          <span
            className="relative inline-block"
            style={{ perspective: '9999999px', transformStyle: 'preserve-3d' }}
            key={i}
          >
            <motion.span
              className="inline-block"
              style={{ transformOrigin: '50% 25%', backfaceVisibility: 'hidden' }}
              initial={enterVariants.initial}
              animate={isHovered ? enterVariants.animate : enterVariants.initial}
              transition={{ ...transition, delay: getEnterDelay(i), duration }}
            >
              {letter === ' ' ? ' ' : letter}
            </motion.span>
            <motion.span
              className="absolute inset-0 inline-block"
              style={{ transformOrigin: '50% 100%', backfaceVisibility: 'hidden' }}
              initial={exitVariants.initial}
              animate={isHovered ? exitVariants.animate : exitVariants.initial}
              transition={{ ...transition, delay: getExitDelay(i), duration }}
            >
              {letter === ' ' ? ' ' : letter}
            </motion.span>
          </span>
        ))}
      </span>
    </span>
  );
}
