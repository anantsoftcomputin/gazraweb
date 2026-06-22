import '../src/index.css';
import SplashScreen from '../src/components/shared/SplashScreen';

const SITE_URL = 'https://gazra.org';
const SITE_NAME = 'Project Gazra';
const OG_IMAGE = `${SITE_URL}/images/og-image.jpg`;

export const metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: `${SITE_NAME} — Inclusive Community Cafe & Space in Vadodara`,
    template: `%s | ${SITE_NAME}`,
  },

  description:
    "Project Gazra is Gujarat's first queer-led community cafe at MCSU, Vadodara — authentic Gujarati food, inclusive events, skill programs & volunteer opportunities. Opp. Sursagar Lake, Mandvi.",

  keywords: [
    'Gazra cafe', 'Gazra Vadodara', 'Project Gazra', 'LGBTQ cafe Gujarat',
    'inclusive cafe Vadodara', 'queer cafe Gujarat', 'MCSU cafe',
    'community space Vadodara', 'Sursagar cafe', 'Chimnabai Udyogalaya',
    'Maharani Chimnabai', 'LGBTQIA safe space Vadodara', 'Gujarati cafe',
    'community cafe India', 'inclusive restaurant Gujarat',
    'LGBTQIA+ community Vadodara', 'LGBTQIA+ support resources India',
    'transgender support Vadodara', 'queer community center Gujarat',
    'gender-affirming care India', 'queer-friendly Vadodara',
  ],

  authors: [{ name: 'Project Gazra', url: SITE_URL }],
  creator: 'Project Gazra',
  publisher: 'Shri Maharani Chimnabai Stree Udyogalaya',

  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Inclusive Community Cafe & Space in Vadodara`,
    description:
      "Gujarat's first queer-led community cafe at MCSU, Vadodara. Authentic Gujarati food, events, skill programs & support. Opp. Sursagar Lake.",
    url: SITE_URL,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'Project Gazra — Community Cafe in Vadodara',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    site: '@gazra_india',
    creator: '@gazra_india',
    title: `${SITE_NAME} — Inclusive Community Cafe in Vadodara`,
    description:
      "Gujarat's first queer-led community cafe. Authentic Gujarati food, inclusive events & skill programs at MCSU, Vadodara.",
    images: [OG_IMAGE],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  alternates: {
    canonical: SITE_URL,
    languages: {
      'en-IN': SITE_URL,
    },
  },

  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/logo.svg',    type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.svg',
    apple:    '/logo.svg',
  },

  category: 'food & community',
};

/* ── JSON-LD Structured Data ─────────────────────────────────────────────── */

const jsonLd = [
  // CafeOrCoffeeShop schema
  {
    '@context': 'https://schema.org',
    '@type': 'CafeOrCoffeeShop',
    '@id': `${SITE_URL}/#cafe`,
    name: 'Gazra Cafe',
    alternateName: ['Project Gazra', 'Gazra'],
    description:
      "Gujarat's first queer-led community cafe at MCSU, Vadodara — serving authentic Gujarati and Maharashtrian homestyle cuisine in a warm, inclusive space.",
    url: `${SITE_URL}/cafe`,
    telephone: '+918200306871',
    email: 'support@gazra.org',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Shri Maharani Chimnabai Stree Udyogalaya, Opp. Sursagar Lake, Mandvi',
      addressLocality: 'Vadodara',
      addressRegion: 'Gujarat',
      postalCode: '390001',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '22.295036',
      longitude: '73.198298',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
        opens: '09:00',
        closes: '22:00',
      },
    ],
    servesCuisine: ['Gujarati', 'Maharashtrian', 'Indian'],
    priceRange: '₹₹',
    image: [`${SITE_URL}/images/cafe1.webp`, `${SITE_URL}/images/image-six.jpg`],
    hasMap: 'https://maps.google.com/?q=Shri+Maharani+Chimnabai+Stree+Udyogalaya+Vadodara',
    sameAs: [
      'https://www.facebook.com/chimnabaiudyogalaya',
      'https://www.instagram.com/chimnabai_udyogalaya',
      'https://mcsu.in',
      'https://www.zomato.com/vadodara/gazra-mandvi',
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      bestRating: '5',
      ratingCount: '200',
    },
    parentOrganization: { '@id': `${SITE_URL}/#org` },
    foundingDate: '2023-08-18',
    keywords: 'LGBTQ cafe, queer-friendly cafe, inclusive cafe, Gujarati food, Vadodara, community space, transgender-friendly, LGBTQIA+ safe space',
  },

  // NGO / Organisation schema
  {
    '@context': 'https://schema.org',
    '@type': ['NGO', 'EducationalOrganization'],
    '@id': `${SITE_URL}/#org`,
    name: 'Shri Maharani Chimnabai Stree Udyogalaya',
    alternateName: ['MCSU', 'Project Gazra'],
    description:
      'Founded in 1914 by the Royal Gaekwad family of Vadodara, MCSU empowers women and LGBTQIA+ communities through education, vocational training, and inclusive social initiatives.',
    url: 'https://mcsu.in',
    foundingDate: '1914',
    telephone: '+918200306871',
    email: 'support@gazra.org',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Opp. Sursagar Lake, Mandvi',
      addressLocality: 'Vadodara',
      addressRegion: 'Gujarat',
      postalCode: '390001',
      addressCountry: 'IN',
    },
    sameAs: [
      'https://mcsu.in',
      'https://gazra.org',
      'https://www.facebook.com/chimnabaiudyogalaya',
      'https://www.instagram.com/chimnabai_udyogalaya',
    ],
  },

  // WebSite schema with SearchAction
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    description: "Gujarat's first queer-led community cafe and inclusive social initiative in Vadodara.",
    publisher: { '@id': `${SITE_URL}/#org` },
    inLanguage: ['en-IN', 'gu', 'hi'],
  },
];

export default function RootLayout({ children }) {
  return (
    <html lang="en-IN">
      <head>
        {/* Preconnect to key origins */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Geo meta tags for local SEO */}
        <meta name="geo.region"      content="IN-GJ" />
        <meta name="geo.placename"   content="Vadodara, Gujarat, India" />
        <meta name="geo.position"    content="22.295036;73.198298" />
        <meta name="ICBM"            content="22.295036, 73.198298" />

        {/* Language / locale signals */}
        <meta httpEquiv="content-language" content="en-IN" />
      </head>
      <body>
        <SplashScreen />
        {children}
      </body>
    </html>
  );
}
