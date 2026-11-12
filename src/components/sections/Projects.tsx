import Glass from '@/components/glass/Glass';
import Media from '@/components/ui/Media';
import { projects } from '@/data/projects';

export default function Projects() {
  return (
    <section id="project" className="section">
      <h2 data-reveal="">Project</h2>
      <div className="projects">
        {projects.map((p) => (
          <Glass key={p.title} radius={30} bezel={26}>
            <a className="project" href={p.repo} target="_blank" rel="noreferrer">
              <Media src={p.image} alt={p.title} />
              <h3>
                {p.title}
                {p.subtitle && <span>, {p.subtitle}</span>}
              </h3>
              <p>{p.description}</p>
            </a>
          </Glass>
        ))}
      </div>
    </section>
  );
}
