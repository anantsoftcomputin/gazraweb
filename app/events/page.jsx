import { EventsClient } from '../../src/next/sitePages';

export const metadata = {
  title: 'Community Events in Vadodara | Theater, Workshops & Gatherings',
  description:
    "Join Gazra's inclusive community events in Vadodara — theater, Kathak dance, therapy circles, cultural gatherings, art workshops & more. LGBTQIA+-friendly. Register online.",
  keywords: [
    'events Vadodara', 'community events Gujarat', 'LGBTQ events Vadodara',
    'cultural events Vadodara', 'Gazra events', 'inclusive workshops Vadodara',
    'theater Vadodara', 'Kathak Vadodara', 'MCSU events', 'queer events Gujarat',
    'art events Vadodara', 'LGBTQIA+ events India', 'queer community gatherings Gujarat',
  ],
  openGraph: {
    title: 'Community Events in Vadodara | Project Gazra',
    description:
      'Theater, workshops, therapy circles & cultural gatherings at Gazra — inclusive, LGBTQIA+-friendly events in Vadodara.',
    url: 'https://gazra.org/events',
  },
  alternates: { canonical: 'https://gazra.org/events' },
};

export default function Page() {
  return <EventsClient />;
}
