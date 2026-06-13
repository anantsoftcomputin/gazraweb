import { AdminLoginClient } from '../../../src/next/sitePages';

export const metadata = {
  title: 'Admin Login | Project Gazra',
  robots: { index: false, follow: false }
};

export default function Page() {
  return <AdminLoginClient />;
}
