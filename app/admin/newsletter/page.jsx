import { AdminNewsletterClient } from '../../../src/next/sitePages';

export const metadata = { title: 'Admin Newsletter | Project Gazra', robots: { index: false, follow: false } };

export default function Page() {
  return <AdminNewsletterClient />;
}
