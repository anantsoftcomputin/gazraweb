import { ContactClient } from '../../src/next/sitePages';

export const metadata = {
  title: 'Contact Gazra | Visit Us at Sursagar Lake, Mandvi, Vadodara',
  description:
    'Get in touch with Project Gazra. Visit Gazra Cafe at MCSU, Opp. Sursagar Lake, Mandvi, Vadodara — 390001. Email: info@mcsu.in | Phone: +91 82003 06871. Open daily 9AM–10PM.',
  keywords: [
    'Gazra contact', 'Gazra cafe address', 'MCSU Vadodara address',
    'Sursagar cafe location', 'contact Gazra', 'Gazra phone number',
    'Gazra email', 'how to reach Gazra cafe Vadodara',
  ],
  openGraph: {
    title: 'Contact Project Gazra | Sursagar Lake, Vadodara',
    description:
      'Visit us at MCSU, Opp. Sursagar Lake, Mandvi, Vadodara. Email info@mcsu.in or call +91 82003 06871.',
    url: 'https://gazra.org/contact',
  },
  alternates: { canonical: 'https://gazra.org/contact' },
};

export default function Page() {
  return <ContactClient />;
}
