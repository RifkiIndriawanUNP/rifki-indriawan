/**
 * Minigame: ikan di dalam air menembakkan air ke serangga terbang.
 * Serangga yang tertembak jatuh ke air lalu dimakan ikan. Jangan tembak paruh burung / ular!
 */
export type HudState = { score: number; phase: number; over: boolean };

const W = 320;
const H = 400;
const SURFACE = 250;
const FISH_Y = 330;
const TAU = Math.PI * 2;
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

type Insect = { x: number; y: number; vx: number; base: number; ph: number; mode: 'fly' | 'fall' | 'sink'; vy: number; rot: number };
type Bullet = { x: number; y: number; vx: number; vy: number; life: number };
type Hazard = { kind: 'beak' | 'snake'; x: number; y: number; by: number; vx: number; age: number; life: number; trail: { x: number; y: number }[] };
type Spark = { x: number; y: number; vx: number; vy: number; life: number; color: string };

export class FishGame {
  private ctx: CanvasRenderingContext2D;
  private raf = 0;
  private last = 0;
  private t = 0;

  private score = 0;
  private over = false;
  private shown = false;
  private lungeT = 0;
  private killer: Hazard | null = null;

  private fx = W / 2;
  private facing = 1;
  private chomp = 0;
  private hidden = false;
  private ax = W / 2;
  private ay = 120;
  private cool = 0;

  private bullets: Bullet[] = [];
  private insects: Insect[] = [];
  private hazards: Hazard[] = [];
  private sparks: Spark[] = [];
  private spawnIn = 0.5;
  private hazardIn = 6;

  constructor(private canvas: HTMLCanvasElement, private onHud: (h: HudState) => void) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    this.ctx = canvas.getContext('2d')!;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.emit();
  }

  private get phase() {
    return 1 + Math.floor(this.score / 4);
  }
  private get speed() {
    return Math.min(55 + 30 * (this.phase - 1), 220);
  }

  private emit() {
    this.onHud({ score: this.score, phase: this.phase, over: this.shown });
  }

  start() {
    this.last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min((now - this.last) / 1000, 0.05);
      this.last = now;
      this.update(dt);
      this.draw();
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  stop() {
    cancelAnimationFrame(this.raf);
  }

  aim(clientX: number, clientY: number) {
    const r = this.canvas.getBoundingClientRect();
    this.ax = ((clientX - r.left) * W) / r.width;
    this.ay = ((clientY - r.top) * H) / r.height;
  }

  shoot() {
    if (this.over) {
      if (this.shown) this.reset();
      return;
    }
    if (this.cool > 0) return;
    this.cool = 0.32;
    const y0 = FISH_Y - 10;
    const dx = this.ax - this.fx;
    const dy = Math.min(this.ay - y0, -20); // selalu menembak ke atas
    const d = Math.hypot(dx, dy);
    this.bullets.push({ x: this.fx, y: y0, vx: (dx / d) * 520, vy: (dy / d) * 520, life: 1.1 });
    this.chomp = 0.12;
  }

  private reset() {
    this.score = 0;
    this.over = false;
    this.shown = false;
    this.hidden = false;
    this.killer = null;
    this.lungeT = 0;
    this.fx = W / 2;
    this.bullets = [];
    this.insects = [];
    this.hazards = [];
    this.sparks = [];
    this.spawnIn = 0.5;
    this.hazardIn = 6;
    this.emit();
  }

  private burst(x: number, y: number, n: number, color: string) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * TAU;
      const v = 40 + Math.random() * 90;
      this.sparks.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 30, life: 0.5 + Math.random() * 0.3, color });
    }
  }

  private spawnInsect() {
    const left = Math.random() < 0.5;
    this.insects.push({
      x: left ? -14 : W + 14,
      y: 0,
      base: 45 + Math.random() * 150,
      vx: (left ? 1 : -1) * this.speed * (0.8 + Math.random() * 0.4),
      ph: Math.random() * 6,
      mode: 'fly',
      vy: 0,
      rot: 0,
    });
  }

  private spawnHazard() {
    if (Math.random() < 0.5) {
      this.hazards.push({ kind: 'beak', x: 50 + Math.random() * (W - 100), y: 34, by: 34, vx: (Math.random() - 0.5) * 30, age: 0, life: 4.5, trail: [] });
    } else {
      const left = Math.random() < 0.5;
      const by = 90 + Math.random() * 90;
      this.hazards.push({ kind: 'snake', x: left ? -10 : W + 10, y: by, by, vx: (left ? 1 : -1) * (45 + this.phase * 8), age: 0, life: 12, trail: [] });
    }
  }

  private update(dt: number) {
    this.t += dt;
    this.cool -= dt;
    this.chomp = Math.max(0, this.chomp - dt);

    // ikan mengikuti kursor (horizontal)
    if (!this.over) {
      const dx = clamp(this.ax, 24, W - 24) - this.fx;
      const step = Math.sign(dx) * Math.min(Math.abs(dx), 230 * dt);
      this.fx += step;
      if (Math.abs(step) > 0.1) this.facing = Math.sign(step);
    }

    if (!this.over) {
      this.spawnIn -= dt;
      if (this.spawnIn <= 0) {
        this.spawnIn = Math.max(0.55, 1.5 - 0.12 * (this.phase - 1));
        this.spawnInsect();
      }
      this.hazardIn -= dt;
      if (this.hazardIn <= 0) {
        this.hazardIn = 9 + Math.random() * 6;
        this.spawnHazard();
      }
    }

    // serangga
    this.insects = this.insects.filter((s) => {
      if (s.mode === 'fly') {
        s.x += s.vx * dt;
        s.y = s.base + Math.sin(this.t * 4 + s.ph) * 16;
        return s.x > -30 && s.x < W + 30;
      }
      if (s.mode === 'fall') {
        s.vy += 700 * dt;
        s.y += s.vy * dt;
        s.x += s.vx * 0.15 * dt;
        s.rot += dt * 8;
        if (s.y >= SURFACE) {
          s.mode = 'sink';
          s.vy = 34;
          this.burst(s.x, SURFACE, 6, '#4285F4');
        }
        return true;
      }
      s.y += s.vy * dt;
      s.x += Math.sin(this.t * 3 + s.ph) * 8 * dt;
      if (!this.over && Math.hypot(s.x - this.fx, s.y - FISH_Y) < 24) {
        this.score++;
        this.chomp = 0.3;
        this.burst(s.x, s.y, 8, '#FBBC05');
        this.emit();
        return false;
      }
      return s.y < H - 8;
    });

    // bahaya (paruh / ular)
    for (const h of this.hazards) {
      if (h === this.killer) {
        h.x += (this.fx - h.x) * 5 * dt;
        h.by += (FISH_Y - h.by) * 5 * dt;
        h.y = h.by;
        continue;
      }
      h.age += dt;
      h.x += h.vx * dt;
      if (h.kind === 'snake') {
        h.y = h.by + Math.sin(h.age * 3) * 14;
        const l = h.trail[h.trail.length - 1];
        if (!l || Math.hypot(l.x - h.x, l.y - h.y) > 5) {
          h.trail.push({ x: h.x, y: h.y });
          if (h.trail.length > 12) h.trail.shift();
        }
      } else {
        h.y = h.by + Math.sin(h.age * 2) * 3;
      }
    }
    this.hazards = this.hazards.filter((h) => h === this.killer || (h.age < h.life && h.x > -40 && h.x < W + 40));

    // peluru air
    this.bullets = this.bullets.filter((b) => {
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      b.life -= dt;
      if (b.life <= 0 || b.x < -10 || b.x > W + 10 || b.y < -10) return false;
      if (b.y < SURFACE) {
        for (const s of this.insects) {
          if (s.mode === 'fly' && Math.hypot(s.x - b.x, s.y - b.y) < 15) {
            s.mode = 'fall';
            s.vy = -60;
            this.burst(s.x, s.y, 6, '#4285F4');
            return false;
          }
        }
        if (!this.over) {
          for (const h of this.hazards) {
            if (Math.hypot(h.x - b.x, h.y - b.y) < 22) {
              this.over = true;
              this.killer = h;
              this.lungeT = 0;
              return false;
            }
          }
        }
      }
      return true;
    });

    // ikan dimakan
    if (this.killer) {
      this.lungeT += dt;
      if (this.lungeT > 0.6 && !this.hidden) {
        this.hidden = true;
        this.burst(this.fx, FISH_Y, 16, '#EA4335');
      }
      if (this.lungeT > 1 && !this.shown) {
        this.shown = true;
        this.emit();
      }
    }

    this.sparks = this.sparks.filter((p) => {
      p.life -= dt;
      p.vy += 260 * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      return p.life > 0;
    });
  }

  private draw() {
    const c = this.ctx;
    const t = this.t;
    c.clearRect(0, 0, W, H);

    // air
    const g = c.createLinearGradient(0, SURFACE, 0, H);
    g.addColorStop(0, 'rgba(66,133,244,.30)');
    g.addColorStop(1, 'rgba(66,133,244,.12)');
    c.fillStyle = g;
    c.beginPath();
    c.moveTo(0, SURFACE);
    for (let x = 0; x <= W; x += 8) c.lineTo(x, SURFACE + Math.sin(x * 0.05 + t * 2) * 2.2);
    c.lineTo(W, H);
    c.lineTo(0, H);
    c.fill();

    // pembidik
    if (!this.over && this.ay < SURFACE) {
      c.strokeStyle = 'rgba(60,64,67,.35)';
      c.lineWidth = 1.2;
      c.beginPath();
      c.arc(this.ax, this.ay, 7, 0, TAU);
      c.moveTo(this.ax - 11, this.ay);
      c.lineTo(this.ax + 11, this.ay);
      c.moveTo(this.ax, this.ay - 11);
      c.lineTo(this.ax, this.ay + 11);
      c.stroke();
    }

    // serangga
    for (const s of this.insects) {
      c.save();
      c.translate(s.x, s.y);
      c.rotate(s.rot);
      const flap = s.mode === 'fly' ? Math.sin(t * 40 + s.ph) * 0.6 : 0.2;
      c.fillStyle = 'rgba(66,133,244,.55)';
      c.beginPath();
      c.ellipse(-2, -4, 6, 2.5, -0.6 + flap, 0, TAU);
      c.ellipse(2, -4, 6, 2.5, 0.6 - flap, 0, TAU);
      c.fill();
      c.fillStyle = '#3c4043';
      c.beginPath();
      c.ellipse(0, 0, 5.5, 3.2, 0, 0, TAU);
      c.fill();
      c.restore();
    }

    // bahaya
    for (const h of this.hazards) {
      if (h.kind === 'beak') {
        const e = h === this.killer ? 1 : clamp(Math.min(h.age, h.life - h.age) / 0.4, 0, 1);
        c.save();
        c.translate(h.x, h.y - (1 - e) * 50);
        c.fillStyle = '#5f6368';
        c.beginPath();
        c.ellipse(0, -26, 17, 15, 0, 0, TAU);
        c.fill();
        c.fillStyle = '#F29900';
        c.beginPath();
        c.moveTo(-9, -16);
        c.lineTo(9, -16);
        c.lineTo(0, 18);
        c.closePath();
        c.fill();
        c.fillStyle = '#fff';
        c.beginPath();
        c.arc(-7, -29, 3, 0, TAU);
        c.arc(7, -29, 3, 0, TAU);
        c.fill();
        c.fillStyle = '#202124';
        c.beginPath();
        c.arc(-7, -29, 1.3, 0, TAU);
        c.arc(7, -29, 1.3, 0, TAU);
        c.fill();
        c.restore();
      } else {
        c.strokeStyle = '#34A853';
        c.lineWidth = 11;
        c.lineCap = 'round';
        c.lineJoin = 'round';
        c.beginPath();
        c.moveTo(h.x, h.y);
        for (let i = h.trail.length - 1; i >= 0; i--) c.lineTo(h.trail[i].x, h.trail[i].y);
        c.stroke();
        c.fillStyle = '#2d8a47';
        c.beginPath();
        c.arc(h.x, h.y, 8.5, 0, TAU);
        c.fill();
        c.fillStyle = '#fff';
        c.beginPath();
        c.arc(h.x + 3, h.y - 3, 2.2, 0, TAU);
        c.arc(h.x + 3, h.y + 3, 2.2, 0, TAU);
        c.fill();
        c.strokeStyle = '#EA4335';
        c.lineWidth = 1.5;
        c.beginPath();
        c.moveTo(h.x + 8, h.y);
        c.lineTo(h.x + 14, h.y);
        c.stroke();
      }
    }

    // ikan
    if (!this.hidden) {
      c.save();
      c.translate(this.fx, FISH_Y);
      c.scale(this.facing, 1);
      c.fillStyle = '#FBBC05';
      c.beginPath();
      c.moveTo(-17, 0);
      c.lineTo(-32, -10 + Math.sin(t * 9) * 3);
      c.lineTo(-32, 10 + Math.sin(t * 9) * 3);
      c.closePath();
      c.fill();
      c.fillStyle = '#EA4335';
      c.beginPath();
      c.ellipse(0, 0, 21, 11, 0, 0, TAU);
      c.fill();
      c.fillStyle = 'rgba(255,255,255,.7)';
      c.beginPath();
      c.ellipse(-4, -3, 7, 4, 0.2, 0, TAU);
      c.fill();
      c.fillStyle = '#fff';
      c.beginPath();
      c.arc(12, -3, 3, 0, TAU);
      c.fill();
      c.fillStyle = '#202124';
      c.beginPath();
      c.arc(13, -3, 1.4, 0, TAU);
      c.fill();
      if (this.chomp > 0) {
        c.fillStyle = '#8c1d18';
        c.beginPath();
        c.ellipse(20, 2, 4, 3, 0, 0, TAU);
        c.fill();
      }
      c.restore();
    }

    // peluru
    for (const b of this.bullets) {
      c.strokeStyle = 'rgba(66,133,244,.4)';
      c.lineWidth = 3;
      c.lineCap = 'round';
      c.beginPath();
      c.moveTo(b.x - b.vx * 0.03, b.y - b.vy * 0.03);
      c.lineTo(b.x, b.y);
      c.stroke();
      c.fillStyle = 'rgba(66,133,244,.9)';
      c.beginPath();
      c.arc(b.x, b.y, 3.6, 0, TAU);
      c.fill();
    }

    for (const p of this.sparks) {
      c.globalAlpha = clamp(p.life * 2, 0, 1);
      c.fillStyle = p.color;
      c.beginPath();
      c.arc(p.x, p.y, 2.2, 0, TAU);
      c.fill();
    }
    c.globalAlpha = 1;
  }
}
