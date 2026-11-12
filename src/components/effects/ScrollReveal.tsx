'use client';
import { useEffect } from 'react';

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

/**
 * Elemen [data-reveal]: blur-in saat masuk dari bawah, blur-out saat keluar lewat atas.
 * Dihitung dari posisi elemen terhadap viewport pada setiap scroll.
 */
export default function ScrollReveal() {
  useEffect(() => {
    let raf = 0;
    const apply = () => {
      raf = 0;
      const vh = window.innerHeight;
      document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
        const r = el.getBoundingClientRect();
        const p = Math.min(clamp((vh - r.top) / (vh * 0.28), 0, 1), clamp(r.bottom / (vh * 0.28), 0, 1));
        const e = p * p * (3 - 2 * p);
        el.style.filter = e > 0.995 ? '' : `blur(${((1 - e) * 14).toFixed(2)}px)`;
        el.style.opacity = e > 0.995 ? '' : String(0.25 + 0.75 * e);
      });
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };
    apply();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => {
      window.removeEventListener('scroll', on);
      window.removeEventListener('resize', on);
      cancelAnimationFrame(raf);
    };
  }, []);
  return null;
}
