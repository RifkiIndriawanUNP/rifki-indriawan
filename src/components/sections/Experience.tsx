'use client';
import { useState } from 'react';
import Glass from '@/components/glass/Glass';
import Media from '@/components/ui/Media';
import { experience } from '@/data/experience';

/** Accordion horizontal: panel di-hover membuka, keluar kursor kembali ke panel pertama (tidak pernah tertutup semua). */
export default function Experience() {
  const [active, setActive] = useState(0);
  const cols = experience.map((_, i) => (i === active ? '7fr' : '1fr')).join(' ');

  return (
    <section id="experience" className="section">
      <h2 data-reveal="">Experience</h2>
      <div className="accordion" style={{ gridTemplateColumns: cols }}>
        {experience.map((item, i) => (
          <Glass
            key={item.id}
            radius={15}
            bezel={24}
            className={`panel ${i === active ? 'is-open' : ''}`}
            tabIndex={0}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onClick={() => setActive(i)}
          >
            <div className="panel__label" aria-hidden={i === active}>
              <span>{item.category}</span>
              <span>{item.label}</span>
            </div>
            <div className="panel__body">
              {item.images.length > 0 && (
                <div className="strip">
                  {item.images.map((src, n) => (
                    <Media key={src} src={src} alt={`${item.label} ${n + 1}`} />
                  ))}
                </div>
              )}
              <h3>{item.title}</h3>
              {item.period && <small>{item.period}</small>}
              {item.description && <p>{item.description}</p>}
              {item.points && (
              <ul>
                {item.points.map((pt) => {
                  const isHeading = pt.startsWith('##') && pt.endsWith('##');

                  return (
                    <li key={pt} className={isHeading ? 'point-heading' : ''}>
                      {isHeading ? pt.replace(/##/g, '') : pt}
                    </li>
                  );
                })}
              </ul>
            )}
            </div>
          </Glass>
        ))}
      </div>
    </section>
  );
}
