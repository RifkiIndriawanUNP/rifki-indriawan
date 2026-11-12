import type { ReactNode, SVGProps } from 'react';

const Stroke = ({ children, ...p }: { children: ReactNode } & SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>
    {children}
  </svg>
);

export const HomeIcon = () => (
  <Stroke>
    <path d="M3 11.5 12 4l9 7.5" />
    <path d="M5.5 10v9.5h13V10" />
  </Stroke>
);
export const GridIcon = () => (
  <Stroke>
    <rect x="4" y="4" width="7" height="7" rx="2" />
    <rect x="13" y="4" width="7" height="7" rx="2" />
    <rect x="4" y="13" width="7" height="7" rx="2" />
    <rect x="13" y="13" width="7" height="7" rx="2" />
  </Stroke>
);
export const BriefcaseIcon = () => (
  <Stroke>
    <rect x="3" y="7" width="18" height="13" rx="3" />
    <path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7" />
    <path d="M3 12.5h18" />
  </Stroke>
);
export const GamepadIcon = () => (
  <Stroke>
    <rect x="2.5" y="7" width="19" height="11" rx="5.5" />
    <path d="M7.5 10.5v4M5.5 12.5h4" />
    <circle cx="15.5" cy="11.5" r=".9" fill="currentColor" />
    <circle cx="18" cy="13.5" r=".9" fill="currentColor" />
  </Stroke>
);
export const FileIcon = () => (
  <Stroke>
    <path d="M7 3h7l5 5v13H7z" />
    <path d="M14 3v5h5" />
    <path d="M10 13h6M10 17h6" />
  </Stroke>
);
export const MailIcon = () => (
  <Stroke>
    <rect x="3" y="5" width="18" height="14" rx="3" />
    <path d="m4 7.5 8 6 8-6" />
  </Stroke>
);
export const InstagramIcon = () => (
  <Stroke>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17" cy="7" r=".8" fill="currentColor" />
  </Stroke>
);
export const GithubIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
    <path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.7 1.7.3 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3" />
  </svg>
);
