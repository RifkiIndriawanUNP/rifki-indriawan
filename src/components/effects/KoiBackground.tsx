'use client';
import { useEffect, useRef } from 'react';
import { KoiPond } from '@/lib/koi';

/** Dua canvas: ikan (di-blur lewat CSS) dan efek pelet/riak (tajam). Klik kiri di luar kartu = jatuhkan pelet. */
export default function KoiBackground() {
  const fishRef = useRef<HTMLCanvasElement>(null);
  const fxRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const pond = new KoiPond(fishRef.current!, fxRef.current!);
    pond.start();
    const onResize = () => pond.resize();
    const onClick = (e: MouseEvent) => {
      if (e.button !== 0) return;
      const target = e.target as Element | null;
      if (target?.closest?.('[data-glass],a,button,input')) return;
      pond.drop(e.clientX, e.clientY);
    };
    window.addEventListener('resize', onResize);
    window.addEventListener('click', onClick);
    return () => {
      pond.stop();
      window.removeEventListener('resize', onResize);
      window.removeEventListener('click', onClick);
    };
  }, []);

  return (
    <>
      <canvas ref={fishRef} className="koi koi--soft" aria-hidden="true" />
      <canvas ref={fxRef} className="koi" aria-hidden="true" />
    </>
  );
}