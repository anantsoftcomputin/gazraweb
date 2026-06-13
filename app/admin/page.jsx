import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Admin | Project Gazra',
  robots: { index: false, follow: false }
};

export default function Page() {
  redirect('/admin/login');
}
