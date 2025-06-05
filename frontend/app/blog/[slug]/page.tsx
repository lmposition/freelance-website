import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote/rsc';

export function generateStaticParams() {
  return fs
    .readdirSync(path.join(process.cwd(), 'content/blog'))
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => ({ slug: f.replace(/\.mdx$/, '') }));
}

export default async function BlogPost({ params }: any) {
  const file = fs.readFileSync(
    path.join(process.cwd(), 'content/blog', `${params.slug}.mdx`)
  );
  const { content, data } = matter(file);
  return (
    <article>
      <h1>{data.title}</h1>
      <MDXRemote source={content} />
    </article>
  );
}
