'use client';
import { useEffect, useId, useRef, useState, type CSSProperties, type HTMLAttributes } from 'react';
import { makeDisplacementMap } from '@/lib/glassMap';

type Props = HTMLAttributes<HTMLDivElement> & {
  radius?: number; // radius sudut (px)
  bezel?: number; // lebar zona refraksi di tepi (px)
  scale?: number; // kekuatan pergeseran
  reveal?: boolean; // ikut efek blur saat scroll
  blur?: number; // blur
  style?: CSSProperties;
};

/**
 * Kartu "liquid glass". Di Chromium: backdrop-filter dengan SVG displacement map (refraksi nyata
 * terhadap koi di belakangnya). Browser lain: frosted glass biasa.
 */
export default function Glass({ children, className = '', radius = 32, bezel = 24, scale = 56, blur = 3, reveal = true, style, ...rest }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const fid = 'g' + useId().replace(/:/g, '');
  const [svgOk, setSvgOk] = useState(false);
  const [map, setMap] = useState<{ w: number; h: number; url: string } | null>(null);

  useEffect(() => {
    setSvgOk(typeof CSS !== 'undefined' && CSS.supports('backdrop-filter', 'url(#x)'));
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || !svgOk) return;
    let timer = 0;
    const build = () => {
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      if (w < 4 || h < 4) return;
      setMap({ w, h, url: makeDisplacementMap(w, h, radius, bezel) });
    };
    build();
    const ro = new ResizeObserver(() => {
      window.clearTimeout(timer);
      timer = window.setTimeout(build, 140);
    });
    ro.observe(el);
    return () => {
      ro.disconnect();
      window.clearTimeout(timer);
    };
  }, [svgOk, radius, bezel]);

  const filter =
  svgOk && map
    ? `url(#${fid}) blur(${blur}px) saturate(1.6) brightness(1.04)`
    : `blur(${blur + 12}px) saturate(1.6)`; // browser non-Chromium

  return (
    <div
      {...rest}
      ref={ref}
      data-glass=""
      data-reveal={reveal ? '' : undefined}
      className={`glass ${className}`}
      style={{ borderRadius: radius, backdropFilter: filter, WebkitBackdropFilter: filter, ...style }}
    >
      {svgOk && map && (
        <svg className="glass__defs" width="0" height="0" aria-hidden="true">
          <filter id={fid} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
            <feImage href={map.url} x="0" y="0" width={map.w} height={map.h} preserveAspectRatio="none" result="map" />
            <feDisplacementMap in="SourceGraphic" in2="map" scale={scale} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </svg>
      )}
      {children}
    </div>
  );
}
