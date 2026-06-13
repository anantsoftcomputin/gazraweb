import { AdminEventsClient } from '../../../src/next/sitePages';

export const metadata = { title: 'Admin Events | Project Gazra', robots: { index: false, follow: false } };

export default function Page() {
  return <AdminEventsClient />;
}
