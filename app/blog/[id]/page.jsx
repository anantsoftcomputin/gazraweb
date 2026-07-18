import { cache } from 'react';
import { BlogDetailClient } from '../../../src/next/sitePages';

const PROJECT_ID = 'gazraweb-33d32';
const SITE_URL = process.env.SITE_URL || 'https://gazra.org';
const FIREBASE_API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

const fetchPost = cache(async (id) => {
  try {
    const endpoint = new URL(`https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/blogs/${encodeURIComponent(id)}`);
    if (FIREBASE_API_KEY) endpoint.searchParams.set('key', FIREBASE_API_KEY);
    const res = await fetch(endpoint, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    const doc = await res.json();
    const fields = doc.fields || {};
    const stringArray = (field) => field?.arrayValue?.values?.map(value => value.stringValue).filter(Boolean) || [];
    return {
      title: fields.title?.stringValue,
      excerpt: fields.excerpt?.stringValue,
      seoTitle: fields.seoTitle?.stringValue,
      seoDescription: fields.seoDescription?.stringValue,
      seoKeywords: stringArray(fields.seoKeywords),
      category: fields.category?.stringValue,
      featuredImage: fields.featuredImage?.stringValue,
      imageAlt: fields.imageAlt?.stringValue,
      author: fields.author?.stringValue,
      publishedDate: fields.publishedDate?.stringValue,
      updatedAt: fields.updatedAt?.stringValue,
      wordCount: Number(fields.wordCount?.integerValue || 0),
      status: fields.status?.stringValue,
    };
  } catch {
    return null;
  }
});

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

  const title = post.seoTitle || `${post.title} | Project Gazra`;
  const description = post.seoDescription || post.excerpt || FALLBACK_METADATA.description;
  const imageUrl = post.featuredImage
    ? (post.featuredImage.startsWith('http') ? post.featuredImage : `${SITE_URL}${post.featuredImage}`)
    : `${SITE_URL}/images/og-image.jpg`;
  const url = `${SITE_URL}/blog/${id}`;
  const keywords = [...new Set([
    ...post.seoKeywords,
    'Project Gazra',
    'Vadvarso',
    post.category,
  ].filter(Boolean))];

  return {
    title: { absolute: title },
    description,
    keywords,
    authors: [{ name: post.author || 'Project Gazra Editorial Team', url: SITE_URL }],
    creator: post.author || 'Project Gazra Editorial Team',
    publisher: 'Project Gazra',
    category: post.category,
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      siteName: 'Project Gazra',
      locale: 'en_IN',
      publishedTime: post.publishedDate,
      modifiedTime: post.updatedAt || post.publishedDate,
      authors: [post.author || 'Project Gazra Editorial Team'],
      section: post.category,
      tags: keywords,
      images: [{
        url: imageUrl,
        secureUrl: imageUrl,
        width: 1600,
        height: 900,
        alt: post.imageAlt || post.title,
        type: 'image/jpeg',
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
      creator: '@gazra_india',
    },
    alternates: { canonical: url },
    robots: { index: true, follow: true },
  };
}

export default async function Page({ params }) {
  const { id } = await params;
  const post = await fetchPost(id);
  const imageUrl = post?.featuredImage
    ? (post.featuredImage.startsWith('http') ? post.featuredImage : `${SITE_URL}${post.featuredImage}`)
    : `${SITE_URL}/images/og-image.jpg`;
  const articleUrl = `${SITE_URL}/blog/${id}`;
  const jsonLd = post?.status === 'published' ? {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${articleUrl}#article`,
    headline: post.title,
    description: post.seoDescription || post.excerpt,
    image: [imageUrl],
    datePublished: post.publishedDate,
    dateModified: post.updatedAt || post.publishedDate,
    wordCount: post.wordCount || undefined,
    articleSection: post.category,
    keywords: post.seoKeywords.join(', '),
    inLanguage: 'en-IN',
    author: { '@type': 'Organization', name: post.author || 'Project Gazra Editorial Team', url: SITE_URL },
    publisher: {
      '@type': 'Organization',
      name: 'Project Gazra',
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.svg` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': articleUrl },
  } : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
        />
      )}
      <BlogDetailClient />
    </>
  );
}
