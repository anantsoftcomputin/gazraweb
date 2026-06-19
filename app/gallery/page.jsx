import { GalleryClient } from '../../src/next/sitePages';

export const metadata = {
  title: 'Gallery | Moments from Gazra Cafe & Community Events in Vadodara',
  description:
    'Explore photos and moments from Gazra Cafe, community events, art exhibitions & cultural gatherings at MCSU, Vadodara. Visual stories of inclusivity, art, and Gujarati culture.',
  keywords: [
    'Gazra gallery', 'Gazra cafe photos', 'LGBTQ community photos Vadodara',
    'Gazra events gallery', 'community cafe photos Gujarat',
    'inclusive cafe interior Vadodara', 'Gujarati culture photos',
  ],
  openGraph: {
    title: 'Gallery | Gazra Cafe & Community Moments',
    description: 'Photos and moments from Gazra Cafe and community gatherings in Vadodara.',
    url: 'https://gazra.org/gallery',
  },
  alternates: { canonical: 'https://gazra.org/gallery' },
};

export default function Page() {
  return <GalleryClient />;
}
