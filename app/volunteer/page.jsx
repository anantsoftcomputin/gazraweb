import { VolunteerClient } from '../../src/next/sitePages';

export const metadata = {
  title: 'Volunteer with Project Gazra | Join the Inclusive Movement in Vadodara',
  description:
    "Make a difference — volunteer with Project Gazra in Vadodara. Contribute to community outreach, events, social media, research, fundraising or technical support. Join MCSU's 110-year legacy of social reform.",
  keywords: [
    'volunteer Vadodara', 'volunteer LGBTQ India', 'NGO volunteer Gujarat',
    'Gazra volunteer', 'community service Vadodara', 'MCSU volunteer',
    'inclusive organisation volunteer India', 'social work Vadodara',
    'LGBTQIA+ volunteer opportunities India', 'transgender ally volunteer India',
  ],
  openGraph: {
    title: 'Volunteer with Project Gazra | Vadodara',
    description:
      "Join MCSU's inclusive movement — volunteer in outreach, events, social media, research & more.",
    url: 'https://gazra.org/volunteer',
  },
  alternates: { canonical: 'https://gazra.org/volunteer' },
};

export default function Page() {
  return <VolunteerClient />;
}
