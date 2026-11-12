'use client';
import { useEffect, useRef } from 'react';

// Elemen yang membuat kursor "membesar"
const INTERACTIVE = 'a, button, [role="button"], [data-glass][tabindex], .nav__track';

/** Kursor kustom: cincin kaca + titik pusat. Titik mengikuti mouse persis, cincin mengejar dengan sedikit delay. */
export default function Cursor() {
  const root = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLSpanElement>(null);
  const dot = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Hanya untuk perangkat dengan mouse
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const el = root.current!;
    const ringEl = ring.current!;
    const dotEl = dot.current!;
    const html = document.documentElement;
    let tx = -100, ty = -100, rx = -100, ry = -100;
    let seen = false;
    let raf = 0;
    let last = performance.now();

    const move = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!seen) {
        seen = true;
        rx = tx;
        ry = ty;
        html.classList.add('has-cursor'); // baru sembunyikan kursor asli setelah kursor kustom siap
        el.classList.add('is-on');
      }
      el.classList.toggle('is-link', !!(e.target as Element | null)?.closest?.(INTERACTIVE));
    };
    const down = () => el.classList.add('is-down');
    const up = () => el.classList.remove('is-down');
    const leave = () => el.classList.remove('is-on');
    const enter = () => seen && el.classList.add('is-on');

    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const k = 1 - Math.pow(0.0005, dt); // ±12% per frame di 60fps
      rx += (tx - rx) * k;
      ry += (ty - ry) * k;
      dotEl.style.translate = `${tx}px ${ty}px`;
      ringEl.style.translate = `${rx}px ${ry}px`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener('pointermove', move);
    window.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', up);
    html.addEventListener('mouseleave', leave);
    html.addEventListener('mouseenter', enter);
    return () => {
      cancelAnimationFrame(raf);
      html.classList.remove('has-cursor');
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
      html.removeEventListener('mouseleave', leave);
      html.removeEventListener('mouseenter', enter);
    };
  }, []);

  return (
    <div ref={root} className="cursor" aria-hidden="true">
      <span ref={ring} className="cursor__ring" />
      <span ref={dot} className="cursor__dot" />
    </div>
  );
}