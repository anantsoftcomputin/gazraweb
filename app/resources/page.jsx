import { ResourcesClient } from '../../src/next/sitePages';

export const metadata = {
  title: 'LGBTQIA+ Support Resources | Project Gazra',
  description: 'Free legal aid, mental health helplines, medical care, and job opportunities for the LGBTQIA+ community in India — government schemes and trusted NGOs, searchable by category.',
  keywords: [
    'LGBTQIA+ resources India', 'transgender legal aid India', 'queer mental health helpline India',
    'NALSA transgender rights', 'SMILE scheme transgender', 'Garima Greh', 'gender-affirming care India',
    'LGBTQ+ support Vadodara', 'transgender employment India', 'queer-friendly NGO India',
  ],
  openGraph: {
    title: 'LGBTQIA+ Support Resources | Project Gazra',
    description: 'A searchable directory of government and NGO resources for legal aid, mental health, medical care, and jobs for the LGBTQIA+ community.',
    url: 'https://gazra.org/resources',
    type: 'website',
  },
  alternates: { canonical: 'https://gazra.org/resources' },
};

export default function Page() {
  return <ResourcesClient />;
}
