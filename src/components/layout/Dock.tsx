'use client';
import { useState } from 'react';
import Glass from '@/components/glass/Glass';
import Minigame from '@/components/game/Minigame';
import { GamepadIcon } from '@/components/ui/Icons';
import Navbar from './Navbar';

/** Navigasi + tombol minigame (pojok kanan). */
export default function Dock() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="dock">
        <Navbar />
        <Glass reveal={false} radius={999} bezel={26} scale={40} className="dock__game">
          <button type="button" data-game-toggle="" aria-label="Open minigame" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
            <GamepadIcon />
          </button>
        </Glass>
      </div>
      {open && <Minigame onClose={() => setOpen(false)} />}
    </>
  );
}
