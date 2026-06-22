import { InitiativesClient } from '../../src/next/sitePages';

export const metadata = {
  title: 'Initiatives | Project Gazra, Vadodara',
  description: 'Discover Project Gazra initiatives and programs supporting the LGBTQIA+ community in Vadodara — Gazra Mitra, Support Fund, Cafe, and Skill Hub.',
  keywords: [
    'Gazra initiatives', 'LGBTQIA+ programs Vadodara', 'community initiatives Gujarat',
    'Gazra Mitra', 'queer support programs India',
  ],
  alternates: { canonical: 'https://gazra.org/initiatives' },
};

export default function Page() {
  return <InitiativesClient />;
}
