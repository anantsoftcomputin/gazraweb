import { AdminDashboardClient } from '../../../src/next/sitePages';

export const metadata = { title: 'Admin Dashboard | Project Gazra', robots: { index: false, follow: false } };

export default function Page() {
  return <AdminDashboardClient />;
}
