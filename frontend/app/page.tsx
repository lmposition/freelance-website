import ToolCard from '../components/ToolCard';
import { tools } from '../data/tools';

export default function Home() {
  return (
    <main style={{ maxWidth: 800, margin: '0 auto', padding: 16 }}>
      <h1>Outils pour entrepreneurs</h1>
      {tools.map((tool) => (
        <ToolCard key={tool.slug} tool={tool} />
      ))}
    </main>
  );
}
