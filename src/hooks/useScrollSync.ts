import { useRef, useCallback, useEffect } from 'react';

/**
 * Hook to synchronize scrolling between timeline header and body
 */
export const useScrollSync = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);

  const syncScroll = useCallback((source: 'header' | 'body') => {
    if (isScrollingRef.current) return;

    isScrollingRef.current = true;

    if (source === 'body' && bodyRef.current && headerRef.current) {
      headerRef.current.scrollLeft = bodyRef.current.scrollLeft;
    } else if (source === 'header' && headerRef.current && bodyRef.current) {
      bodyRef.current.scrollLeft = headerRef.current.scrollLeft;
    }

    requestAnimationFrame(() => {
      isScrollingRef.current = false;
    });
  }, []);

  const handleBodyScroll = useCallback(() => {
    syncScroll('body');
  }, [syncScroll]);

  const handleHeaderScroll = useCallback(() => {
    syncScroll('header');
  }, [syncScroll]);

  // Attach scroll listeners
  useEffect(() => {
    const bodyElement = bodyRef.current;
    const headerElement = headerRef.current;

    if (bodyElement) {
      bodyElement.addEventListener('scroll', handleBodyScroll, { passive: true });
    }

    if (headerElement) {
      headerElement.addEventListener('scroll', handleHeaderScroll, { passive: true });
    }

    return () => {
      if (bodyElement) {
        bodyElement.removeEventListener('scroll', handleBodyScroll);
      }
      if (headerElement) {
        headerElement.removeEventListener('scroll', handleHeaderScroll);
      }
    };
  }, [handleBodyScroll, handleHeaderScroll]);

  const scrollToPosition = useCallback((scrollLeft: number) => {
    if (bodyRef.current) {
      bodyRef.current.scrollLeft = scrollLeft;
    }
    if (headerRef.current) {
      headerRef.current.scrollLeft = scrollLeft;
    }
  }, []);

  const scrollToToday = useCallback((todayPosition: number, containerWidth: number) => {
    const scrollPosition = Math.max(0, todayPosition - containerWidth / 2);
    scrollToPosition(scrollPosition);
  }, [scrollToPosition]);

  return {
    headerRef,
    bodyRef,
    scrollToPosition,
    scrollToToday,
  };
};

