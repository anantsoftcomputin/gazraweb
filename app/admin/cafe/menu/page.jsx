import { AdminCafeClient } from '../../../../src/next/sitePages';

export const metadata = { title: 'Admin Cafe Menu | Project Gazra', robots: { index: false, follow: false } };

export default function Page() {
  return <AdminCafeClient />;
}
