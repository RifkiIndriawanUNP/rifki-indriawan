export type LinkKey = 'github' | 'cv' | 'email' | 'instagram';
export type Greeting = { text: string; lang: string }; 
export type Profile = {
  name: string;
  greeting: Greeting[];
  photo: string;
  about: string[];
  links: { key: LinkKey; label: string; href: string }[];
};

export type Project = {
  title: string;
  subtitle?: string;
  description: string;
  image: string;
  repo?: string;
};

export type ExperienceItem = {
  id: string;
  category: string;
  label: string;
  title: string;
  period?: string;
  description?: string;
  points?: string[];
  images: string[];
};
