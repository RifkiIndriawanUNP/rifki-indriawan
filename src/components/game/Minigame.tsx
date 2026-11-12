'use client';
import { useEffect, useRef, useState } from 'react';
import Glass from '@/components/glass/Glass';
import { FishGame, type HudState } from '@/lib/fishGame';

/** Kotak minigame di pojok kanan bawah. Klik di luar kotak (atau Esc) untuk menutup. */
export default function Minigame({ onClose }: { onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<FishGame | null>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  const [hud, setHud] = useState<HudState>({ score: 0, phase: 1, over: false });

  useEffect(() => {
    const game = new FishGame(canvasRef.current!, setHud);
    gameRef.current = game;
    game.start();

    const onDown = (e: PointerEvent) => {
      const t = e.target as Element;
      if (boxRef.current?.contains(t) || t.closest('[data-game-toggle]')) return;
      closeRef.current();
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeRef.current();
    document.addEventListener('pointerdown', onDown);
    window.addEventListener('keydown', onKey);
    return () => {
      game.stop();
      document.removeEventListener('pointerdown', onDown);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  return (
    <Glass reveal={false} radius={36} bezel={26} scale={48} className="game">
      <div ref={boxRef}>
        <canvas
          ref={canvasRef}
          onPointerMove={(e) => gameRef.current?.aim(e.clientX, e.clientY)}
          onPointerDown={(e) => {
            gameRef.current?.aim(e.clientX, e.clientY);
            gameRef.current?.shoot();
          }}
        />
        <div className="game__hud">
          <span>Score {hud.score}</span>
          <span>Phase {hud.phase}</span>
        </div>
        {hud.over && (
          <div className="game__over">
            <strong>Game over</strong>
            <span>Score {hud.score}. Tap to play again.</span>
          </div>
        )}
      </div>
    </Glass>
  );
}
