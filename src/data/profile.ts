import type { Profile } from '@/types';

export const profile: Profile = {
  name: 'Mohammad Rifki Indriawan',
  greeting: [
    { text: 'Hello,', lang: 'en' },
    { text: 'Halo,', lang: 'id' },
    { text: 'Hola,', lang: 'es' },
    { text: 'Bonjour,', lang: 'fr' },
    { text: 'こんにちは、', lang: 'ja' },
    { text: 'Hallo,', lang: 'de' },
    { text: '안녕하세요,', lang: 'ko' },
    { text: 'Ciao,', lang: 'it' },
    { text: 'Olá,', lang: 'pt' },
    { text: 'Привет,', lang: 'ru' },
    { text: '你好，', lang: 'zh' },
    { text: 'नमस्ते,', lang: 'hi' },
    { text: 'Merhaba,', lang: 'tr' },
    { text: 'Xin chào,', lang: 'vi' },
    { text: 'สวัสดี,', lang: 'th' },
    { text: 'Sawubona,', lang: 'zu' },
],
  photo: '/images/profile.png',
  about: [
    "My name is Rifki Indriawan. I'm an Informatics Engineering student at Nusa Putra University with a strong interest in Data Science and Software Engineering. I enjoy building web and mobile applications, working with data, and using machine learning to solve real problems.",
    "Beyond code, I'm active in media: I edit articles as a campus journalist, create visual designs, and manage organizational content. Combining analytical and creative thinking helps me build solutions that don't just work, but are easy for people to understand and use.",
    'I love learning new things and adapting quickly to emerging technologies.',
  ],
  links: [
    { key: 'github', label: 'GitHub', href: 'https://github.com/RifkiIndriawanUNP' },
    { key: 'cv', label: 'CV', href: 'https://drive.google.com/drive/folders/1cf1PupptePdEtVn7IssEIxS-PTLu-4mj?usp=sharing' },
    { key: 'email', label: 'Email', href: 'mailto:rifki.indriawan.skz@gmail.com' },
    { key: 'instagram', label: 'Instagram', href: 'https://instagram.com/m.r.indriawan_' },
  ],
};
