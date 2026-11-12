/**
 * Kolam koi. Bentuk, ukuran, dan gerakan: koi awal (badan mengikuti tulang punggung).
 * Tampilan: siluet lembut seperti painter Flutter, yaitu satu gradien kepala→ekor,
 * transparan, dan tepinya di-blur (blur-nya lewat CSS `.koi--soft`, bukan ctx.filter). Klik = jatuhkan pelet, ikan terdekat menghampiri.
 */
const TAU = Math.PI * 2;
const ALPHA = 120 / 255; // sama dengan withAlpha(120) di Flutter

// [warna kepala, warna ekor]
const COLORS: [string, string][] = [
  ['#4285F4', '#34A853'],
  ['#EA4335', '#FBBC05'],
  ['#34A853', '#4285F4'],
  ['#FBBC05', '#EA4335'],
  ['#4285F4', '#EA4335'],
  ['#EA4335', '#4285F4'],
  ['#34A853', '#FBBC05'],
];
const WIDTH = [0.5, 0.85, 1, 1, 0.94, 0.84, 0.72, 0.6, 0.49, 0.4, 0.32, 0.26, 0.2, 0.15];
const SEGS = WIDTH.length;

type P = { x: number; y: number };
type Pellet = P & { age: number };
type Ripple = P & { age: number };

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const rgba = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`;
};

function trace(ctx: CanvasRenderingContext2D, pts: P[]) {
  for (let i = 0; i < pts.length - 1; i++) {
    ctx.quadraticCurveTo(pts[i].x, pts[i].y, (pts[i].x + pts[i + 1].x) / 2, (pts[i].y + pts[i + 1].y) / 2);
  }
  const l = pts[pts.length - 1];
  ctx.lineTo(l.x, l.y);
}

class Koi {
  seg: P[] = [];
  ang = Math.random() * TAU;
  turn = 0;
  swim = Math.random() * 10;
  target: Pellet | null = null;
  size = 11 + Math.random() * 6;
  speed = 32 + Math.random() * 18;

  constructor(readonly c1: string, readonly c2: string, x: number, y: number) {
    const len = this.size * 0.5;
    for (let i = 0; i < SEGS; i++) {
      this.seg.push({ x: x - Math.cos(this.ang) * len * i, y: y - Math.sin(this.ang) * len * i });
    }
  }

  get head() {
    return this.seg[0];
  }

  update(dt: number, w: number, h: number) {
    const head = this.seg[0];
    this.swim += dt * (this.target ? 9 : 5);
    let want: number | null = null;
    let spd = this.speed;

    if (this.target) {
      const dx = this.target.x - head.x;
      const dy = this.target.y - head.y;
      want = Math.atan2(dy, dx);
      spd = 38 + Math.min(70, Math.hypot(dx, dy));
    } else {
      this.turn = clamp(this.turn + (Math.random() - 0.5) * dt * 5, -0.7, 0.7);
      this.ang += this.turn * dt;
      const m = 90;
      if (head.x < m || head.x > w - m || head.y < m || head.y > h - m) {
        want = Math.atan2(h / 2 - head.y, w / 2 - head.x);
      }
    }
    if (want !== null) {
      const d = Math.atan2(Math.sin(want - this.ang), Math.cos(want - this.ang));
      this.ang += clamp(d, -dt * 3, dt * 3);
    }
    head.x += Math.cos(this.ang) * spd * dt;
    head.y += Math.sin(this.ang) * spd * dt;

    const len = this.size * 0.5;
    for (let i = 1; i < SEGS; i++) {
      const a = this.seg[i - 1];
      const b = this.seg[i];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const d = Math.hypot(dx, dy) || 1;
      b.x = a.x + (dx / d) * len;
      b.y = a.y + (dy / d) * len;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    const s = this.size;
    const t = this.swim;
    const pts = this.seg.map((p, i) => {
      const prv = this.seg[Math.max(i - 1, 0)];
      const nxt = this.seg[Math.min(i + 1, SEGS - 1)];
      let dx = prv.x - nxt.x;
      let dy = prv.y - nxt.y;
      const d = Math.hypot(dx, dy) || 1;
      dx /= d;
      dy /= d;
      const wob = Math.sin(t - i * 0.55) * s * 0.28 * (i / SEGS + 0.2);
      return { x: p.x - dy * wob, y: p.y + dx * wob, dx, dy, w: s * WIDTH[i] };
    });
    const L = pts.map((p) => ({ x: p.x - p.dy * p.w, y: p.y + p.dx * p.w }));
    const R = pts.map((p) => ({ x: p.x + p.dy * p.w, y: p.y - p.dx * p.w })).reverse();
    const h0 = pts[0];
    const last = pts[SEGS - 1];
    const tip = { x: h0.x + h0.dx * s * 0.7, y: h0.y + h0.dy * s * 0.7 };
    const sw = Math.sin(t - SEGS * 0.55);
    const fin = (a: number, b: number) => ({
      x: last.x - last.dx * s * a - last.dy * s * b,
      y: last.y - last.dy * s * a + last.dx * s * b,
    });
    const tipL = fin(2.6, 1.0 + sw * 0.6);
    const tipR = fin(2.6, -1.0 + sw * 0.6);
    const notch = fin(1.5, sw * 0.4);
    const tailEnd = fin(2.6, sw * 0.6);

    // Arah gambar badan (shoelace) → sirip dibuat searah supaya jadi satu bentuk gabungan, bukan lubang
    const outline = [tip, ...L, tipL, notch, tipR, ...R];
    let area = 0;
    for (let i = 0; i < outline.length; i++) {
      const a = outline[i];
      const b = outline[(i + 1) % outline.length];
      area += a.x * b.y - b.x * a.y;
    }
    const ccw = area < 0;

    // Gradien kepala → ekor, transparan
    const g = ctx.createLinearGradient(tip.x, tip.y, tailEnd.x, tailEnd.y);
    g.addColorStop(0, rgba(this.c1, ALPHA));
    g.addColorStop(1, rgba(this.c2, ALPHA));
    ctx.fillStyle = g;

    // Satu path: badan + ekor + dua sirip dada → alpha tidak menumpuk di area overlap
    ctx.beginPath();
    ctx.moveTo(tip.x, tip.y);
    trace(ctx, L);
    ctx.lineTo(tipL.x, tipL.y);
    ctx.lineTo(notch.x, notch.y);
    ctx.lineTo(tipR.x, tipR.y);
    trace(ctx, R);
    ctx.closePath();

    const f = pts[2];
    const a = Math.atan2(f.dy, f.dx);
    const flap = Math.sin(t * 0.9) * 0.25;
    for (const k of [1, -1]) {
      const th = a + k * (2.5 + flap);
      const cx = f.x - f.dy * f.w * k * 0.8 + Math.cos(th) * s * 0.7;
      const cy = f.y + f.dx * f.w * k * 0.8 + Math.sin(th) * s * 0.7;
      ctx.moveTo(cx + Math.cos(th) * s * 1.1, cy + Math.sin(th) * s * 1.1);
      ctx.ellipse(cx, cy, s * 1.1, s * 0.34, th, 0, TAU, ccw);
    }
    ctx.fill();
  }
}

export class KoiPond {
  private ctx: CanvasRenderingContext2D; // ikan (di-blur oleh CSS)
  private fx: CanvasRenderingContext2D; // riak & pelet (tetap tajam)
  private fish: Koi[] = [];
  private pellets: Pellet[] = [];
  private ripples: Ripple[] = [];
  private raf = 0;
  private last = 0;
  private w = 0;
  private h = 0;

  constructor(private canvas: HTMLCanvasElement, private fxCanvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext('2d')!;
    this.fx = fxCanvas.getContext('2d')!;
    this.resize();
    COLORS.forEach(([c1, c2]) => this.fish.push(new Koi(c1, c2, Math.random() * this.w, Math.random() * this.h)));
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    for (const [cv, cx] of [[this.canvas, this.ctx], [this.fxCanvas, this.fx]] as const) {
      cv.width = this.w * dpr;
      cv.height = this.h * dpr;
      cx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
  }

  /** Jatuhkan pelet; 3 ikan terdekat menghampiri. */
  drop(x: number, y: number) {
    const pellet: Pellet = { x, y, age: 0 };
    this.pellets.push(pellet);
    this.ripples.push({ x, y, age: 0 });
    if (this.pellets.length > 6) this.pellets.shift();
    [...this.fish]
      .sort((a, b) => Math.hypot(a.head.x - x, a.head.y - y) - Math.hypot(b.head.x - x, b.head.y - y))
      .slice(0, 3)
      .forEach((f) => (f.target = pellet));
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

  private update(dt: number) {
    this.pellets.forEach((p) => (p.age += dt));
    this.ripples.forEach((r) => (r.age += dt));
    this.ripples = this.ripples.filter((r) => r.age < 1.8);

    for (const f of this.fish) {
      f.update(dt, this.w, this.h);
      const p = f.target;
      if (p && Math.hypot(f.head.x - p.x, f.head.y - p.y) < 12) {
        p.age = 99; // termakan
        this.ripples.push({ x: p.x, y: p.y, age: 0.9 });
      }
    }
    this.pellets = this.pellets.filter((p) => p.age < 14);
    for (const f of this.fish) if (f.target && !this.pellets.includes(f.target)) f.target = null;
  }

  private draw() {
    this.ctx.clearRect(0, 0, this.w, this.h);
    this.fish.forEach((f) => f.draw(this.ctx));

    const ctx = this.fx;
    ctx.clearRect(0, 0, this.w, this.h);

    ctx.lineWidth = 1.5;
    for (const r of this.ripples) {
      for (const delay of [0, 0.25]) {
        const a = r.age - delay;
        if (a <= 0) continue;
        ctx.strokeStyle = `rgba(91,125,177,${Math.max(0, (1 - a / 1.6) * 0.4)})`;
        ctx.beginPath();
        ctx.arc(r.x, r.y, a * 38, 0, TAU);
        ctx.stroke();
      }
    }

    for (const p of this.pellets) {
      const pop = p.age < 0.35 ? 1 + (1 - p.age / 0.35) : 1;
      ctx.globalAlpha = clamp((14 - p.age) / 2, 0, 1);
      ctx.fillStyle = '#8a6a4f';
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3.4 * pop, 0, TAU);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
}