'use client';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';

const DEFAULT_CHARSET =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';

export type TextScrambleProps = {
  children: string;
  duration?: number;
  speed?: number;
  characterSet?: string;
  className?: string;
  trigger?: boolean;
  onScrambleComplete?: () => void;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
};

export function TextScramble({
  children,
  duration = 0.8,
  speed = 0.04,
  characterSet = DEFAULT_CHARSET,
  className,
  trigger = true,
  onScrambleComplete,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: TextScrambleProps) {
  const [displayText, setDisplayText] = useState(children);
  const isAnimatingRef = useRef(false);

  const scramble = useCallback(() => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    const steps = Math.max(1, Math.round(duration / speed));
    let step = 0;

    const interval = setInterval(() => {
      const progress = step / steps;
      let scrambled = '';
      for (let i = 0; i < children.length; i++) {
        if (children[i] === ' ') {
          scrambled += ' ';
        } else if (progress * children.length > i) {
          scrambled += children[i];
        } else {
          scrambled += characterSet[Math.floor(Math.random() * characterSet.length)];
        }
      }
      setDisplayText(scrambled);
      step++;

      if (step > steps) {
        clearInterval(interval);
        setDisplayText(children);
        isAnimatingRef.current = false;
        onScrambleComplete?.();
      }
    }, speed * 1000);

    return () => {
      // Reset the guard on cleanup too, not just on natural completion —
      // otherwise React Strict Mode's dev-only mount/cleanup/remount cycle
      // clears this interval before it ever ticks, leaves the ref stuck
      // `true`, and the real second invocation refuses to start at all.
      clearInterval(interval);
      isAnimatingRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally re-created only via the trigger effect below
  }, [children, duration, speed, characterSet]);

  useEffect(() => {
    if (!trigger) return;
    const cancel = scramble();
    return cancel;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- re-scramble only when `trigger` flips, not on every scramble() identity change
  }, [trigger]);

  return (
    <motion.span
      className={cn('inline-block', className)}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {displayText}
    </motion.span>
  );
}
