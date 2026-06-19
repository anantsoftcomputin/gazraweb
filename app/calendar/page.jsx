import { CalendarClient } from '../../src/next/sitePages';

export const metadata = {
  title: 'Events Calendar | Upcoming Events at Project Gazra, Vadodara',
  description:
    'View the full calendar of upcoming events at Project Gazra, Vadodara — theater, dance, workshops, community meetups, therapy sessions & cultural celebrations.',
  keywords: [
    'Gazra events calendar', 'Vadodara events calendar', 'upcoming events Vadodara',
    'Gazra schedule', 'LGBTQ events calendar Gujarat', 'community events Vadodara',
  ],
  openGraph: {
    title: 'Events Calendar | Project Gazra, Vadodara',
    description:
      'Full calendar of upcoming community events — theater, workshops, meetups & cultural celebrations at Gazra, Vadodara.',
    url: 'https://gazra.org/calendar',
  },
  alternates: { canonical: 'https://gazra.org/calendar' },
};

export default function Page() {
  return <CalendarClient />;
}
