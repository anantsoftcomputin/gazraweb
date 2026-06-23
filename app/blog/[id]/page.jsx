import { BlogDetailClient } from '../../../src/next/sitePages';

const PROJECT_ID = 'gazraweb-33d32';
const SITE_URL = 'https://gazra.org';

async function fetchPost(id) {
  try {
    const res = await fetch(
      `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/blogs/${id}`,
      { cache: 'no-store' }
    );
    if (!res.ok) return null;
    const doc = await res.json();
    const fields = doc.fields || {};
    return {
      title: fields.title?.stringValue,
      excerpt: fields.excerpt?.stringValue,
      category: fields.category?.stringValue,
      featuredImage: fields.featuredImage?.stringValue,
      status: fields.status?.stringValue,
    };
  } catch {
    return null;
  }
}

const FALLBACK_METADATA = {
  title: 'Blog Post | Project Gazra',
  description: 'Read the full story on the Project Gazra blog.',
  keywords: ['Gazra blog', 'LGBTQIA+ stories India', 'community news Vadodara'],
  robots: { index: true, follow: true },
};

export async function generateMetadata({ params }) {
  const { id } = await params;
  const post = await fetchPost(id);

  if (!post || post.status !== 'published') {
    return FALLBACK_METADATA;
  }

  const title = `${post.title} | Project Gazra Blog`;
  const description = post.excerpt || FALLBACK_METADATA.description;
  const imageUrl = post.featuredImage
    ? (post.featuredImage.startsWith('http') ? post.featuredImage : `${SITE_URL}${post.featuredImage}`)
    : undefined;
  const url = `${SITE_URL}/blog/${id}`;

  return {
    title,
    description,
    keywords: ['Gazra blog', 'LGBTQIA+ stories India', 'community news Vadodara', post.category].filter(Boolean),
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      images: imageUrl ? [imageUrl] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
    alternates: { canonical: url },
    robots: { index: true, follow: true },
  };
}

export default function Page() {
  return <BlogDetailClient />;
}
