import { EventDetailClient } from '../../../src/next/sitePages';

export const metadata = {
  title: 'Event Details',
  description: 'View event details, schedule, location, and RSVP options for a Project Gazra event.'
};

export default function Page() {
  return <EventDetailClient />;
}
