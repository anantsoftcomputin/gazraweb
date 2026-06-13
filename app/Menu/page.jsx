import { MenuClient } from '../../src/next/sitePages';

export const metadata = {
  title: 'Menu',
  description: 'View the Gazra Cafe menu.'
};

export default function Page() {
  return <MenuClient />;
}
