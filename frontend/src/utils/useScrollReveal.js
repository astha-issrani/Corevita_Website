import { useEffect, useRef, useState } from 'react';

/** Fade/slide sections in when they enter the viewport (for components that need visible state) */
export function useScrollReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: '0px 0px -5% 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, visible];
}

/** Wrapper that adds scroll-reveal classes — visibility handled by GlobalMotion */
export function ScrollReveal({ children, className = '', as: Tag = 'section', delay = '' }) {
  const delayClass = delay ? `scroll-reveal-delay-${delay}` : '';
  return (
    <Tag className={`scroll-reveal ${delayClass} ${className}`.trim()}>
      {children}
    </Tag>
  );
}
