'use client';
import { useState } from 'react';

/** Gambar dengan placeholder otomatis bila file belum ada. */
export default function Media({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  const [ok, setOk] = useState(true);
  return (
    <div className={`media ${className}`}>
      {ok ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} loading="lazy" draggable={false} onError={() => setOk(false)} />
      ) : (
        <span>{alt}</span>
      )}
    </div>
  );
}
