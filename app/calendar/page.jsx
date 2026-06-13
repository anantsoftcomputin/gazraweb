import { CalendarClient } from '../../src/next/sitePages';

export const metadata = {
  title: 'Event Calendar',
  description: 'See Project Gazra events in calendar view.'
};

export default function Page() {
  return <CalendarClient />;
}
