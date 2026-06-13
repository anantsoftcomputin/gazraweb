import { HomeClient } from '../src/next/sitePages';

export const metadata = {
  title: 'Community, Care, Culture, and Skills',
  description: 'Explore Project Gazra programs, events, cafe, volunteering, and community initiatives.'
};

export default function Page() {
  return <HomeClient />;
}
