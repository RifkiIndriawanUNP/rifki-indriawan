import type { Project } from '@/types';

const gh = 'https://github.com/RifkiIndriawanUNP';

export const projects: Project[] = [
  {
    title: 'SIPADU',
    subtitle: 'Regional Development Priority System',
    description:
      'A web-based application that evaluates infrastructure readiness across regencies and cities in West Java using Fuzzy Logic. Built with a Python backend and web interface, SIPADU generates infrastructure readiness scores and data-driven development priority recommendations.',
    image: '/images/projects/sipadu.png',
    repo: `${gh}/Sipadu`,
  },
  {
    title: 'Indonesian News Sentiment Analysis',
    description:
      'Developed a sentiment classification system for Indonesian news articles by comparing Naïve Bayes and SVM algorithms. Collected thousands of articles through web scraping, applied NLP preprocessing, and used TF-IDF for text feature extraction to evaluate model performance and accuracy.',
    image: '/images/projects/sentiment.png',
    repo: `${gh}/SentimenBerita`,
  },
  {
    title: 'WTS (Want to Sell, Want to Share) (WIP)',
    description:
      'A mobile application combining a micro-social network and COD marketplace for Nusa Putra University students. Built with Flutter and Supabase, it enables students to share information, buy, sell, and trade items directly on campus through a centralized platform.',
    image: '/images/projects/wts.png',
    repo: `${gh}/WTS-app`,
  },
  {
    title: 'Buruhku (WIP)',
    description:
      'A mobile application connecting clients with daily workers for non-certified jobs, featuring price negotiation through chat and escrow payments. Independently designed and developed, from system analysis to a functional prototype.',
    image: '/images/projects/buruhku.png',
    repo: `${gh}/buruhku`,
  },
];
