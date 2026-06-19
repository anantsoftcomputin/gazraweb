import { MenuClient } from '../../src/next/sitePages';

export const metadata = {
  title: 'Menu | Gazra Cafe — Authentic Gujarati & Maharashtrian Food, Vadodara',
  description:
    "Browse Gazra Cafe's full menu — authentic Gujarati and Maharashtrian homestyle dishes, beverages and chef's specials. Traditional recipes made with love at MCSU, Vadodara.",
  keywords: [
    'Gazra cafe menu', 'Gujarati food menu Vadodara', 'Maharashtrian food menu',
    'homestyle Indian food Vadodara', 'Gazra food items', 'cafe menu Sursagar',
  ],
  openGraph: {
    title: 'Gazra Cafe Menu | Authentic Gujarati & Maharashtrian Food',
    description: 'Traditional Gujarati and Maharashtrian homestyle dishes at Gazra Cafe, Vadodara.',
    url: 'https://gazra.org/Menu',
  },
  alternates: { canonical: 'https://gazra.org/Menu' },
};

export default function Page() {
  return <MenuClient />;
}
