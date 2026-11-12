'use client';
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import Glass from '@/components/glass/Glass';
import { BriefcaseIcon, GridIcon, HomeIcon } from '@/components/ui/Icons';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const ITEMS = [
  { id: 'home', label: 'Home', Icon: HomeIcon },
  { id: 'project', label: 'Projects', Icon: GridIcon },
  { id: 'experience', label: 'Experience', Icon: BriefcaseIcon },
];
const SIZE = 56; // ukuran tiap item (px), harus sama dengan CSS
const PAD = 6;
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

/** Navigasi liquid glass: klik atau geser "lensa" untuk memilih, halaman ikut scroll. */
export default function Navbar() {
  const horizontal = useMediaQuery('(max-width: 760px)');
  const trackRef = useRef<HTMLDivElement>(null);
  const lockUntil = useRef(0);
  const [pos, setPos] = useState(0);
  const [drag, setDrag] = useState(false);

  // Ikuti section yang sedang terlihat
  useEffect(() => {
    const sync = () => {
      if (drag || performance.now() < lockUntil.current) return;
      const line = window.innerHeight * 0.45;
      let active = 0;
      ITEMS.forEach((it, i) => {
        const el = document.getElementById(it.id);
        if (el && el.getBoundingClientRect().top <= line) active = i;
      });
      setPos(active);
    };
    sync();
    window.addEventListener('scroll', sync, { passive: true });
    return () => window.removeEventListener('scroll', sync);
  }, [drag]);

  const toPos = (e: PointerEvent) => {
    const r = trackRef.current!.getBoundingClientRect();
    const rel = (horizontal ? e.clientX - r.left : e.clientY - r.top) - PAD - SIZE / 2;
    return clamp(rel / SIZE, 0, ITEMS.length - 1);
  };

  const go = (i: number) => {
    lockUntil.current = performance.now() + 900;
    if (i === 0) window.scrollTo({ top: 0, behavior: 'smooth' });
    else document.getElementById(ITEMS[i].id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const active = Math.round(pos);

  return (
    <Glass reveal={false} radius={32} bezel={28} scale={44} className={`nav ${horizontal ? 'nav--h' : ''}`}>
      <div
        ref={trackRef}
        className="nav__track"
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          setDrag(true);
          setPos(toPos(e));
        }}
        onPointerMove={(e) => drag && setPos(toPos(e))}
        onPointerUp={(e) => {
          const i = Math.round(toPos(e));
          setDrag(false);
          setPos(i);
          go(i);
        }}
        onPointerCancel={() => setDrag(false)}
      >
        <span className={`nav__thumb ${drag ? 'is-drag' : ''}`} style={{ '--p': pos } as CSSProperties} />
        {ITEMS.map(({ id, label, Icon }, i) => (
          <button
            key={id}
            type="button"
            className={`nav__item ${active === i ? 'is-active' : ''}`}
            aria-label={label}
            title={label}
            onClick={() => {
              setPos(i);
              go(i);
            }}
          >
            <Icon />
          </button>
        ))}
      </div>
    </Glass>
  );
}
