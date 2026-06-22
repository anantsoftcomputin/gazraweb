import { PrivacyClient } from '../../src/next/sitePages';

export const metadata = {
  title: 'Privacy Policy | Project Gazra',
  description: 'How Project Gazra and Gazra Cafe collect, use, and protect your personal information.',
  alternates: { canonical: 'https://gazra.org/privacy-policy' },
};

export default function Page() {
  return <PrivacyClient />;
}
