import { BlogDetailClient } from '../../../src/next/sitePages';

export const metadata = {
  title: 'Blog Post | Project Gazra',
  description: 'Read the full story on the Project Gazra blog.',
  keywords: ['Gazra blog', 'LGBTQIA+ stories India', 'community news Vadodara'],
  robots: { index: true, follow: true },
};

export default function Page() {
  return <BlogDetailClient />;
}
