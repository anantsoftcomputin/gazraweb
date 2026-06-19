import { SupportClient } from '../../src/next/sitePages';

export const metadata = {
  title: 'Gazra Support Fund | Financial Assistance for LGBTQIA+ Community in Gujarat',
  description:
    'Apply for Gazra Support Fund — confidential, compassionate financial and social assistance for LGBTQIA+ and marginalized community members in Gujarat. Submit your application online.',
  keywords: [
    'LGBTQ support fund India', 'financial assistance LGBTQ Gujarat',
    'Gazra support fund', 'queer community support Vadodara',
    'MCSU support program', 'LGBTQIA assistance India', 'social welfare Gujarat',
    'marginalized community support Vadodara',
  ],
  openGraph: {
    title: 'Gazra Support Fund | Assistance for LGBTQIA+ Community in Gujarat',
    description:
      'Confidential financial and social assistance for LGBTQIA+ and marginalized community members. Apply online.',
    url: 'https://gazra.org/gazra-support',
  },
  alternates: { canonical: 'https://gazra.org/gazra-support' },
};

export default function Page() {
  return <SupportClient />;
}
