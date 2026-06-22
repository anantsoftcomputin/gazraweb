import { RefundPolicyClient } from '../../src/next/sitePages';

export const metadata = {
  title: 'Refund Policy | Project Gazra',
  description: 'Gazra Cafe refund and cancellation policy for orders, bookings, and online payments.',
  alternates: { canonical: 'https://gazra.org/refund-policy' },
};

export default function Page() {
  return <RefundPolicyClient />;
}
