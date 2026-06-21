import { BlogClient } from '../../src/next/sitePages';

export const metadata = {
  title: 'Blog | Project Gazra',
  description: 'Stories, news, and updates from Project Gazra and the community we serve in Vadodara.'
};

export default function Page() {
  return <BlogClient />;
}
