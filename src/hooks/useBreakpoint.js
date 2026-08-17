import { useState, useEffect } from 'react';

/**
 * useBreakpoint — returns current screen size category.
 * isMobile  : width < 768px
 * isTablet  : 768px <= width < 1024px
 * isDesktop : width >= 1024px
 */
export function useBreakpoint() {
  const [width, setWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1280
  );

  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return {
    isMobile:  width < 768,
    isTablet:  width >= 768 && width < 1024,
    isDesktop: width >= 1024,
    width,
  };
}
