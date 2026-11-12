'use client';
import { useEffect, useRef, useState } from 'react';
import type { Greeting } from '@/types';

const HOLD = 2800; // lama tiap sapaan sebelum berganti (ms)
const FADE = 380; // lama transisi keluar (ms)

/** Sapaan yang berganti bahasa. Urutan mengikuti array `greetings` (mulai dari indeks 0). */
export default function RotatingGreeting({ words }: { words: Greeting[] }) {
  const [i, setI] = useState(0);
  const [out, setOut] = useState(false);
  const timer = useRef(0);

  useEffect(() => {
    // Tidak berganti bila hanya satu kata atau pengguna memilih "reduce motion"
    if (words.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const loop = window.setInterval(() => {
      setOut(true);
      timer.current = window.setTimeout(() => {
        setI((n) => (n + 1) % words.length);
        setOut(false);
      }, FADE);
    }, HOLD);
    return () => {
      window.clearInterval(loop);
      window.clearTimeout(timer.current);
    };
  }, [words.length]);

  const w = words[i];
  return (
    <h1>
      {/* pembaca layar cukup membaca satu sapaan tetap */}
      <span className="sr-only">{words[0].text}</span>
      <span key={i} lang={w.lang} className={`greeting ${out ? 'is-out' : 'is-in'}`} aria-hidden="true">
        {w.text}
      </span>
    </h1>
  );
}