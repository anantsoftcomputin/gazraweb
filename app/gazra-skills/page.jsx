import { SkillsClient } from '../../src/next/sitePages';

export const metadata = {
  title: 'Gazra Skill Hub | Vocational Training & Skill Development in Vadodara',
  description:
    'Enroll in Gazra Skill Hub — hospitality management, culinary arts & professional skill development for the LGBTQIA+ community and marginalized groups at MCSU, Vadodara.',
  keywords: [
    'skill development Vadodara', 'vocational training Gujarat',
    'hospitality course Vadodara', 'LGBTQ empowerment skills India',
    'Gazra skill hub', 'culinary training Vadodara', 'MCSU skill program',
    'community skill development Gujarat', 'restaurant management course Vadodara',
  ],
  openGraph: {
    title: 'Gazra Skill Hub | Vocational Training in Vadodara',
    description:
      'Professional skill development — hospitality, culinary arts & more for the LGBTQIA+ community at MCSU, Vadodara.',
    url: 'https://gazra.org/gazra-skills',
  },
  alternates: { canonical: 'https://gazra.org/gazra-skills' },
};

export default function Page() {
  return <SkillsClient />;
}
