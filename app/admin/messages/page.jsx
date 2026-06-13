import { AdminMessagesClient } from '../../../src/next/sitePages';

export const metadata = { title: 'Admin Messages | Project Gazra', robots: { index: false, follow: false } };

export default function Page() {
  return <AdminMessagesClient />;
}
