import { useEffect, useRef, useState } from 'react';

/** Fade/slide sections in when they enter the viewport */
export function useScrollReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: '0px 0px -48px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, visible];
}

export function ScrollReveal({ children, className = '', as: Tag = 'section' }) {
  const [ref, visible] = useScrollReveal();
  return (
    <Tag ref={ref} className={`scroll-reveal ${visible ? 'is-visible' : ''} ${className}`.trim()}>
      {children}
    </Tag>
  );
}
