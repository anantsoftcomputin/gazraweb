import { InitiativesClient } from '../../src/next/sitePages';

export const metadata = {
  title: 'Initiatives',
  description: 'Discover Project Gazra initiatives and programs supporting the community.'
};

export default function Page() {
  return <InitiativesClient />;
}
