// This code comes from https://github.com/adobe/react-spectrum/blob/main/packages/%40react-aria/overlays/src/usePreventScroll.ts

import { useEffect, useLayoutEffect } from 'react';

function isMac(): boolean | undefined {
  return testPlatform(/^Mac/);
}

function isIPhone(): boolean | undefined {
  return testPlatform(/^iPhone/);
}

function isIPad(): boolean | undefined {
  return (
    testPlatform(/^iPad/) ||
    // iPadOS 13 lies and says it's a Mac, but we can distinguish by detecting touch support.
    (isMac() && navigator.maxTouchPoints > 1)
  );
}

function isIOS(): boolean | undefined {
  return isIPhone() || isIPad();
}

function testPlatform(re: RegExp): boolean | undefined {
  return typeof window !== 'undefined' && window.navigator != null
    ? re.test(window.navigator.platform)
    : undefined;
}

const KEYBOARD_BUFFER = 24;

export const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

interface PreventScrollOptions {
  /** Whether the scroll lock is disabled. */
  isDisabled?: boolean;
  focusCallback?: () => void;
}

function chain(...callbacks: any[]): (...args: any[]) => void {
  return (...args: any[]) => {
    for (const callback of callbacks) {
      if (typeof callback === 'function') {
        callback(...args);
      }
    }
  };
}

const visualViewport =
  typeof document !== 'undefined' && window.visualViewport;

export function isScrollable(node: Element): boolean {
  const style = window.getComputedStyle(node);
  return /(auto|scroll)/.test(
    style.overflow + style.overflowX + style.overflowY
  );
}

export function getScrollParent(node: Element): Element {
  if (isScrollable(node)) {
    node = node.parentElement as HTMLElement;
  }

  while (node && !isScrollable(node)) {
    node = node.parentElement as HTMLElement;
  }

  return node || document.scrollingElement || document.documentElement;
}

// HTML input types that do not cause the software keyboard to appear.
const nonTextInputTypes = new Set([
  'checkbox',
  'radio',
  'range',
  'color',
  'file',
  'image',
  'button',
  'submit',
  'reset',
]);

// The number of active usePreventScroll calls. Used to determine whether to revert back to the original page style/scroll position
let preventScrollCount = 0;
let restore: () => void;

/**
 * Prevents scrolling on the document body on mount, and
 * restores it on unmount. Also ensures that content does not
 * shift due to the scrollbars disappearing.
 */
export function usePreventScroll(options: PreventScrollOptions = {}) {
  const { isDisabled } = options;

  useIsomorphicLayoutEffect(() => {
    if (isDisabled) {
      return;
    }

    preventScrollCount++;
    if (preventScrollCount === 1) {
      if (isIOS()) {
        restore = preventScrollMobileSafari();
      }
    }

    return () => {
      preventScrollCount--;
      if (preventScrollCount === 0) {
        restore?.();
      }
    };
  }, [isDisabled]);
}

// Mobile Safari is a whole different beast. Even with overflow: hidden,
// it still scrolls the page in many situations, so we patch around it here.
function preventScrollMobileSafari() {
  let scrollable: Element;
  let lastY = 0;
  const onTouchStart = (e: TouchEvent) => {
    scrollable = getScrollParent(e.target as Element);
    if (
      scrollable === document.documentElement &&
      scrollable === document.body
    ) {
      return;
    }

    lastY = e.changedTouches[0].pageY;
  };

  const onTouchMove = (e: TouchEvent) => {
    if (
      !scrollable ||
      scrollable === document.documentElement ||
      scrollable === document.body
    ) {
      e.preventDefault();
      return;
    }

    const y = e.changedTouches[0].pageY;
    const scrollTop = scrollable.scrollTop;
    const bottom = scrollable.scrollHeight - scrollable.clientHeight;

    if (bottom === 0) {
      return;
    }

    if ((scrollTop <= 0 && y > lastY) || (scrollTop >= bottom && y < lastY)) {
      e.preventDefault();
    }

    lastY = y;
  };

  const onTouchEnd = (e: TouchEvent) => {
    const target = e.target as HTMLElement;

    if (isInput(target) && target !== document.activeElement) {
      e.preventDefault();

      target.style.transform = 'translateY(-2000px)';
      target.focus();
      requestAnimationFrame(() => {
        target.style.transform = '';
      });
    }
  };

  const onFocus = (e: FocusEvent) => {
    const target = e.target as HTMLElement;
    if (isInput(target)) {
      target.style.transform = 'translateY(-2000px)';
      requestAnimationFrame(() => {
        target.style.transform = '';

        if (visualViewport) {
          if (visualViewport.height < window.innerHeight) {
            requestAnimationFrame(() => {
              scrollIntoView(target);
            });
          } else {
            visualViewport.addEventListener(
              'resize',
              () => scrollIntoView(target),
              { once: true }
            );
          }
        }
      });
    }
  };

  const onWindowScroll = () => {
    window.scrollTo(0, 0);
  };

  const scrollX = window.pageXOffset;
  const scrollY = window.pageYOffset;

  const restoreStyles = chain(
    setStyle(
      document.documentElement,
      'paddingRight',
      `${window.innerWidth - document.documentElement.clientWidth}px`
    )
  );

  window.scrollTo(0, 0);

  const removeEvents = chain(
    addEvent(document, 'touchstart', onTouchStart, {
      passive: false,
      capture: true,
    }),
    addEvent(document, 'touchmove', onTouchMove, {
      passive: false,
      capture: true,
    }),
    addEvent(document, 'touchend', onTouchEnd, {
      passive: false,
      capture: true,
    }),
    addEvent(document, 'focus', onFocus, true),
    addEvent(window, 'scroll', onWindowScroll)
  );

  return () => {
    restoreStyles();
    removeEvents();
    window.scrollTo(scrollX, scrollY);
  };
}

function setStyle(
  element: HTMLElement,
  style: keyof React.CSSProperties,
  value: string
) {
  // @ts-expect-error - dynamic style key assignment
  const cur = element.style[style];
  // @ts-expect-error - dynamic style key assignment
  element.style[style] = value;

  return () => {
    // @ts-expect-error - dynamic style key assignment
    element.style[style] = cur;
  };
}

function addEvent<K extends keyof GlobalEventHandlersEventMap>(
  target: EventTarget,
  event: K,
  handler: (this: Document, ev: GlobalEventHandlersEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions
) {
  target.addEventListener(event, handler as EventListener, options);

  return () => {
    target.removeEventListener(event, handler as EventListener, options);
  };
}

function scrollIntoView(target: Element) {
  const root = document.scrollingElement || document.documentElement;
  while (target && target !== root) {
    const scrollable = getScrollParent(target);
    if (
      scrollable !== document.documentElement &&
      scrollable !== document.body &&
      scrollable !== target
    ) {
      const scrollableTop = scrollable.getBoundingClientRect().top;
      const targetTop = target.getBoundingClientRect().top;
      const targetBottom = target.getBoundingClientRect().bottom;
      const keyboardHeight =
        scrollable.getBoundingClientRect().bottom + KEYBOARD_BUFFER;

      if (targetBottom > keyboardHeight) {
        scrollable.scrollTop += targetTop - scrollableTop;
      }
    }

    target = scrollable.parentElement as Element;
  }
}

export function isInput(target: Element) {
  return (
    (target instanceof HTMLInputElement &&
      !nonTextInputTypes.has(target.type)) ||
    target instanceof HTMLTextAreaElement ||
    (target instanceof HTMLElement && target.isContentEditable)
  );
}
