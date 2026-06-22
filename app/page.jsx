import { HomeClient } from '../src/next/sitePages';

export const metadata = {
  title: 'Community, Care, Culture & Connection in Vadodara',
  description:
    "Project Gazra — Gujarat's first queer-led community cafe at MCSU, Vadodara. Authentic Gujarati & Maharashtrian food, inclusive events, skill programs & more. Open daily 9AM–10PM, Opp. Sursagar Lake.",
  keywords: [
    'Gazra', 'Gazra cafe', 'community cafe Vadodara', 'LGBTQ Gujarat',
    'inclusive space Vadodara', 'Sursagar cafe', 'Project Gazra',
    'MCSU Vadodara', 'queer cafe India', 'LGBTQIA+ community Vadodara',
    'queer-friendly Vadodara', 'transgender support Gujarat',
  ],
  openGraph: {
    title: 'Project Gazra — Community Cafe & Inclusive Space in Vadodara',
    description:
      "Gujarat's first queer-led community cafe. Authentic food, inclusive events, skills & support at MCSU, Opp. Sursagar Lake, Vadodara.",
    url: 'https://gazra.org',
  },
  alternates: { canonical: 'https://gazra.org' },
};

export default function Page() {
  return <HomeClient />;
}
