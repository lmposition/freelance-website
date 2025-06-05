import Link from 'next/link';
import { Tool } from '../data/tools';

export default function ToolCard({ tool }: { tool: Tool }) {
  return (
    <div style={{ border: '1px solid #ccc', borderRadius: 8, marginBottom: 16 }}>
      <div style={{ height: 4, background: tool.color }} />
      <div style={{ padding: 16 }}>
        <h3>{tool.name}</h3>
        <p>{tool.description}</p>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link href={`/tools/${tool.slug}`} style={{ background: '#0070f3', color: '#fff', padding: '4px 8px', borderRadius: 4 }}>En savoir plus</Link>
          <a href={tool.url} target="_blank" rel="noopener" style={{ padding: '4px 8px', border: '1px solid #0070f3', borderRadius: 4 }}>Accéder</a>
        </div>
      </div>
    </div>
  );
}
