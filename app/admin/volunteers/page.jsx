import { AdminVolunteersClient } from '../../../src/next/sitePages';

export const metadata = { title: 'Admin Volunteers | Project Gazra', robots: { index: false, follow: false } };

export default function Page() {
  return <AdminVolunteersClient />;
}
