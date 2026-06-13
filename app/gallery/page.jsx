import { GalleryClient } from '../../src/next/sitePages';

export const metadata = {
  title: 'Gallery',
  description: 'Explore photos and moments from Project Gazra programs, events, and community spaces.'
};

export default function Page() {
  return <GalleryClient />;
}
