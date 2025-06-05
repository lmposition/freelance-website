import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';

export default function BlogPage() {
  const posts = fs.readdirSync(path.join(process.cwd(), 'content/blog'))
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => {
      const source = fs.readFileSync(path.join(process.cwd(), 'content/blog', file));
      const { data } = matter(source);
      return { slug: file.replace(/\.mdx$/, ''), ...data } as any;
    });

  return (
    <div>
      <h1>Blog</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={`/blog/${post.slug}`}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
