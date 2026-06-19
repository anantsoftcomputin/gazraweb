import { AboutClient } from '../../src/next/sitePages';

export const metadata = {
  title: 'About Project Gazra | MCSU\'s Inclusive Community Since 1914',
  description:
    'Project Gazra is an initiative by Shri Maharani Chimnabai Stree Udyogalaya (MCSU), Vadodara — creating safe, inclusive spaces for the LGBTQIA+ community since 2023, built on 110+ years of social reform and women\'s empowerment.',
  keywords: [
    'About Gazra', 'MCSU history', 'Chimnabai Udyogalaya', 'LGBTQ Vadodara',
    'queer inclusive space Gujarat', 'MCSU 1914', 'Gaekwad royal family Vadodara',
    'social reform Gujarat', 'women empowerment Vadodara',
  ],
  openGraph: {
    title: 'About Project Gazra | MCSU\'s Inclusive Community Since 1914',
    description:
      'An initiative by MCSU, Vadodara — creating safe, inclusive spaces for LGBTQIA+ community since 2023 on 110+ years of social reform.',
    url: 'https://gazra.org/about',
  },
  alternates: { canonical: 'https://gazra.org/about' },
};

export default function Page() {
  return <AboutClient />;
}
