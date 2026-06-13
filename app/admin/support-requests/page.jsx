import { AdminSupportRequestsClient } from '../../../src/next/sitePages';

export const metadata = { title: 'Admin Support Requests | Project Gazra', robots: { index: false, follow: false } };

export default function Page() {
  return <AdminSupportRequestsClient />;
}
