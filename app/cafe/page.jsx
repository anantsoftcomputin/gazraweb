import { CafeClient } from '../../src/next/sitePages';

export const metadata = {
  title: 'Gazra Cafe',
  description: 'View Gazra Cafe menu, moments, features, testimonials, and table booking options.'
};

export default function Page() {
  return <CafeClient />;
}
