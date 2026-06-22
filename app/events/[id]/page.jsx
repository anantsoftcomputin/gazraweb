import { EventDetailClient } from '../../../src/next/sitePages';

export const metadata = {
  title: 'Event Details | Project Gazra Vadodara',
  description:
    'View full event details, schedule, and RSVP for this inclusive community event at Project Gazra, Vadodara. Theater, workshops, cultural gatherings & more.',
  keywords: ['Gazra event', 'LGBTQIA+ event Vadodara', 'community gathering Gujarat'],
  robots: { index: true, follow: true },
};

export default function Page() {
  return <EventDetailClient />;
}
