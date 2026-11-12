import Glass from '@/components/glass/Glass';
import Media from '@/components/ui/Media';
import { FileIcon, GithubIcon, InstagramIcon, MailIcon } from '@/components/ui/Icons';
import { profile } from '@/data/profile';
import type { LinkKey } from '@/types';
import RotatingGreeting from './RotatingGreeting';

const ICONS: Record<LinkKey, () => React.JSX.Element> = {
  github: GithubIcon,
  cv: FileIcon,
  email: MailIcon,
  instagram: InstagramIcon,
};

export default function Hero() {
  return (
    <section id="home" className="section">
      <Glass className="hero" radius={32} bezel={32}>
        <Media src={profile.photo} alt={profile.name} className="hero__photo" />
        <RotatingGreeting words={profile.greeting} />
        {profile.about.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </Glass>

      <ul className="links">
        {profile.links.map(({ key, label, href }) => {
          const Icon = ICONS[key];
          const external = href.startsWith('http');
          return (
            <li key={key}>
              <Glass className="link" radius={28} bezel={18} scale={36}>
                <a href={href} {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}>
                  <Icon />
                  {label}
                </a>
              </Glass>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
