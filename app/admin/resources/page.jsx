import { AdminResourcesClient } from '../../../src/next/sitePages';

export const metadata = { title: 'Admin Resources | Project Gazra', robots: { index: false, follow: false } };

export default function Page() {
  return <AdminResourcesClient />;
}
