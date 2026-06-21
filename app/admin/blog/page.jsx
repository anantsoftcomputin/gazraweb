import { AdminBlogClient } from '../../../src/next/sitePages';

export const metadata = { title: 'Admin Blog | Project Gazra', robots: { index: false, follow: false } };

export default function Page() {
  return <AdminBlogClient />;
}
