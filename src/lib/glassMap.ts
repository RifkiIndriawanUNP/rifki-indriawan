/**
 * Membuat displacement map (data URL) untuk efek refraksi "liquid glass".
 * Channel R/G menyimpan arah pergeseran; makin dekat ke tepi, makin kuat.
 */
export function makeDisplacementMap(w: number, h: number, radius: number, bezel: number): string {
  const s = 0.5; // resolusi setengah agar ringan
  const cw = Math.max(2, Math.round(w * s));
  const ch = Math.max(2, Math.round(h * s));
  const canvas = document.createElement('canvas');
  canvas.width = cw;
  canvas.height = ch;
  const ctx = canvas.getContext('2d')!;
  const img = ctx.createImageData(cw, ch);
  const r = Math.min(radius, w / 2, h / 2);
  const b = Math.min(bezel, w / 2, h / 2);

  for (let y = 0; y < ch; y++) {
    for (let x = 0; x < cw; x++) {
      const px = (x + 0.5) / s - w / 2;
      const py = (y + 0.5) / s - h / 2;
      const qx = Math.abs(px) - (w / 2 - r);
      const qy = Math.abs(py) - (h / 2 - r);
      const out = Math.hypot(Math.max(qx, 0), Math.max(qy, 0));
      const depth = -(Math.min(Math.max(qx, qy), 0) + out - r); // jarak ke tepi (di dalam > 0)
      let nx = 0;
      let ny = 0;
      let m = 0;
      if (depth < b) {
        m = Math.pow(1 - Math.max(0, depth) / b, 2.2);
        if (qx > 0 && qy > 0) {
          nx = (Math.sign(px) * qx) / out;
          ny = (Math.sign(py) * qy) / out;
        } else if (qx > qy) {
          nx = Math.sign(px);
        } else {
          ny = Math.sign(py);
        }
      }
      const i = (y * cw + x) * 4;
      img.data[i] = 128 + nx * m * 127;
      img.data[i + 1] = 128 + ny * m * 127;
      img.data[i + 2] = 128;
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return canvas.toDataURL();
}
