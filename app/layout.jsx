import '../src/index.css';

export const metadata = {
  metadataBase: new URL('https://gazraweb-33d32.web.app'),
  title: {
    default: 'Project Gazra',
    template: '%s | Project Gazra'
  },
  description: 'Project Gazra brings community programs, events, cafe experiences, skills initiatives, and support services together in Vadodara.',
  openGraph: {
    title: 'Project Gazra',
    description: 'Community programs, events, cafe experiences, and skills initiatives in Vadodara.',
    url: '/',
    siteName: 'Project Gazra',
    type: 'website'
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/logo.svg', type: 'image/svg+xml' }
    ],
    shortcut: '/favicon.svg',
    apple: '/logo.svg'
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
