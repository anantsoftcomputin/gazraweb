import { SkillsClient } from '../../src/next/sitePages';

export const metadata = {
  title: 'Gazra Skill Hub',
  description: 'Explore Gazra Skill Hub courses, enrollments, and learning opportunities.'
};

export default function Page() {
  return <SkillsClient />;
}
