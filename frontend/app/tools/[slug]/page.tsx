import { tools } from '../../../data/tools';

export default function ToolPage({ params }: any) {
  const tool = tools.find((t) => t.slug === params.slug);
  if (!tool) return <div>Outil non trouvé</div>;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 16 }}>
      <div style={{ background: tool.color, padding: 16, display: 'flex', alignItems: 'center' }}>
        <h1 style={{ margin: 0 }}>{tool.name}</h1>
      </div>
      <p>{tool.description}</p>
      <iframe width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="YouTube video" allowFullScreen></iframe>
      <div style={{ marginTop: 16 }}>
        <a href={tool.url} target="_blank" rel="noopener" style={{ background: '#0070f3', color: '#fff', padding: '8px 16px', borderRadius: 4 }}>Accéder au site</a>
      </div>
    </div>
  );
}
