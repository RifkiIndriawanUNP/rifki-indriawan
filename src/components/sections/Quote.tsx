import Glass from '@/components/glass/Glass';

export default function Quote() {
  return (
    <section className="section">
      <Glass className="quote" radius={32} bezel={32}>
        <blockquote>&ldquo;The only way to do great work is to love what you do. If you haven&rsquo;t found it yet, keep looking. Don&rsquo;t settle.&rdquo;</blockquote>
        <cite>&mdash;Steve Jobs</cite>
      </Glass>
    </section>
  );
}
