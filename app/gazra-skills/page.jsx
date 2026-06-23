import { SkillsClient } from '../../src/next/sitePages';

export const metadata = {
  title: 'Gazra Skill Hub | Beauty, Tailoring, Music & Kathak Courses in Vadodara',
  description:
    'Enroll in Gazra Skill Hub at MCSU, Vadodara — Beauty Parlour, Tailoring, Music, and Kathak Dance courses for the LGBTQIA+ community and marginalized groups, taught by experienced instructors.',
  keywords: [
    'skill development Vadodara', 'vocational training Gujarat',
    'beauty parlour course Vadodara', 'tailoring course Vadodara',
    'music classes Vadodara', 'kathak dance classes Vadodara',
    'LGBTQ empowerment skills India', 'Gazra skill hub', 'MCSU skill program',
    'community skill development Gujarat', 'transgender employment training India',
    'queer job skills India',
  ],
  openGraph: {
    title: 'Gazra Skill Hub | Beauty, Tailoring, Music & Kathak Courses in Vadodara',
    description:
      'Beauty Parlour, Tailoring, Music, and Kathak Dance courses for the LGBTQIA+ community at MCSU, Vadodara.',
    url: 'https://gazra.org/gazra-skills',
  },
  alternates: { canonical: 'https://gazra.org/gazra-skills' },
};

export default function Page() {
  return <SkillsClient />;
}
