import type { ExperienceItem } from '@/types';

// Item pertama selalu terbuka saat tidak ada yang di-hover.
export const experience: ExperienceItem[] = [
  {
    id: 'ic3',
    category: 'Achievement',
    label: 'IC3 Championship',
    title: 'IC3 Digital Literacy Championship',
    period: 'Hanoi, Vietnam · August 2026',
    description:
      'Second Runner-up (Individual) and First Runner-Up (Team) at the IC3 Digital Literacy International Championship 2026, held in Hanoi, Vietnam.',
    images: ['/images/experience/ic3-1.png', '/images/experience/ic3-2.png'],
  },
  {
    id: 'bps',
    category: 'PKL',
    label: 'BPS Kota Sukabumi',
    title: 'UI/UX Designer',
    period: 'Aug – Sep 2026',
    points: [
      'Designed the UI/UX of an inventory-tracking app to make recording and managing items easier.',
      'Designed an intuitive, functional interface that is easy to use.',
      'Mapped user flows for recording, searching, and managing item data.',
      'Collaborated with two team members to design and develop an effective inventory-tracking application.',
    ],
    images: ['/images/experience/bps-1.png', '/images/experience/bps-2.png'],
  },
  {
    id: 'nuansa',
    category: 'Organization',
    label: 'Jurnalis Nuansa',
    title: 'Koordinator Redaktur (Managing Editor)',
    period: 'Oct 2025 – Sep 2026',
    points: [
      'Edited and proofread manuscripts to keep writing accurate, polished, and readable.',
      'Coordinated with writers and the media team to keep content production running smoothly.',
      'Collaborated with a fellow writers to successfully publish 129 news articles within one editorial term.',
    ],
    images: ['/images/experience/nuansa-1.jpg', '/images/experience/nuansa-2.jpg'],
  },
  {
    id: 'eclub',
    category: 'Organization',
    label: 'English Club',
    title: 'Head of Media',
    period: 'Oct 2025 – Sep 2026',
    points: [
      "Managed the organization's Instagram to share information and activities with members.",
      'Handled visual design, posters, and social media video content in line with the organization’s identity.',
      'Coordinated with the team on planning and running programs.',
    ],
    images: ['/images/experience/eclub-1.jpg', '/images/experience/eclub-2.jpg'],
  },
  {
    id: 'misc',
    category: 'Misc',
    label: 'Others',
    title: 'Other achievements & certifications',
    points: [
      '##COMPETITIONS##',
      'Passed university-level selection for LIDM 2026 (Digital Technology Innovation).',
      'Passed university-level selection for ONMIPA 2026 in Mathematics.',
      'Participated in Satria Data 2026.',
      '##CERTIFICATIONS##',
      'Generative AI Foundations, Pearson (2026).',
      'IC3 Digital Literacy Master Certification, Certiport (2026).',
    ],
    images: [],
  },
];
