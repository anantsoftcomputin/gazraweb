import { CafeClient } from '../../src/next/sitePages';

export const metadata = {
  title: 'Gazra Cafe | Authentic Gujarati Food & Table Booking in Vadodara',
  description:
    "Visit Gazra Cafe at MCSU — authentic Gujarati & Maharashtrian homestyle cuisine in Gujarat's first queer-led cafe. View menu, book a table & experience Vadodara's most inclusive dining space. Open daily 9AM–10PM, Opp. Sursagar Lake.",
  keywords: [
    'Gazra cafe menu', 'Gujarati cafe Vadodara', 'Maharashtrian food Vadodara',
    'book table Gazra', 'Sursagar cafe Vadodara', 'queer cafe Gujarat',
    'inclusive restaurant Vadodara', 'homestyle Gujarati food', 'community cafe MCSU',
    'cafe near Sursagar lake',
  ],
  openGraph: {
    title: 'Gazra Cafe | Authentic Gujarati Food in Vadodara',
    description:
      "Authentic Gujarati & Maharashtrian homestyle food at Gujarat's first queer-led cafe. Book your table at MCSU, Opp. Sursagar Lake.",
    url: 'https://gazra.org/cafe',
  },
  alternates: { canonical: 'https://gazra.org/cafe' },
};

export default function Page() {
  return <CafeClient />;
}
