import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Observes all `.scroll-reveal` elements and adds `.is-visible` when they enter the viewport */
export default function GlobalMotion() {
  const { pathname } = useLocation();

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const revealAll = () => {
      document.querySelectorAll('.scroll-reveal:not(.is-visible)').forEach((el) => {
        el.classList.add('is-visible');
      });
    };

    if (reduced) {
      revealAll();
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            if (entry.target.classList.contains('reveal-stagger')) {
              entry.target.querySelectorAll(':scope > *').forEach((child, i) => {
                child.style.transitionDelay = `${i * 0.08}s`;
              });
            }
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -5% 0px' }
    );

    const bind = () => {
      document.querySelectorAll('.scroll-reveal:not(.is-visible)').forEach((el) => {
        observer.observe(el);
      });
    };

    bind();
    const raf = requestAnimationFrame(bind);

    const root = document.getElementById('root');
    const mo = new MutationObserver(() => bind());
    if (root) {
      mo.observe(root, { childList: true, subtree: true });
    }

    return () => {
      observer.disconnect();
      mo.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [pathname]);

  return null;
}
