import { EventsClient } from '../../src/next/sitePages';

export const metadata = {
  title: 'Events',
  description: 'Browse upcoming Project Gazra events, workshops, cultural programs, and community gatherings.'
};

export default function Page() {
  return <EventsClient />;
}
