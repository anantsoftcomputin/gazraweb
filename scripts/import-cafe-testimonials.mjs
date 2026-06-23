import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const now = new Date().toISOString();
const googleParentReviewsUrl = 'https://www.google.com/maps/place/SHREE+MAHARANI+CHIMNABAI+STREE+UDYOGALAYA/@22.3018535,73.2034227,17z/data=!4m8!3m7!1s0x395fc5f564000001:0x209077d9d0bca2cf!8m2!3d22.3018535!4d73.2034227!9m1!1b1!16s%2Fg%2F11s7w9bmpn?hl=en';
const googleCafeReviewsUrl = 'https://www.google.com/maps/place/Gazra+Cafe/@22.3018535,73.2034227,17z/data=!4m8!3m7!1s0x395fcfe1106f6777:0x53b7d21be54db67a!8m2!3d22.3018535!4d73.2034227!9m1!1b1!16s%2Fg%2F11l1d66ftl?hl=en';
const wanderlogUrl = 'https://wanderlog.com/place/details/16669118/shree-maharani-chimnabai-stree-udyogalaya';
const justdialUrl = 'https://www.justdial.com/Vadodara/Shri-Maharani-Chimnabai-Stree-Udyogalaya-Near-Tower-Raopura/0265PX265-X265-230205034523-Q3C5_BZDET';

const testimonials = [
  {
    id: 'google-cafe-yashwant-raizada',
    name: 'Yashwant Raizada',
    role: 'Gazra Cafe guest',
    comment: 'A pleasant cafe experience with warm, aesthetic ambience, charming decor, and a relaxed spot for friends or work.',
    rating: 5,
    dish: 'Cafe ambience',
    order: 1,
    source: 'Google Maps review',
    sourceUrl: googleCafeReviewsUrl
  },
  {
    id: 'google-cafe-prachi-thakor',
    name: 'Prachi Thakor',
    role: 'Gazra Cafe guest',
    comment: 'A heritage cafe with a calming atmosphere and a mesmerizing Sursagar lake view in the evening.',
    rating: 5,
    dish: 'Heritage cafe ambience',
    order: 2,
    source: 'Google Maps review',
    sourceUrl: googleCafeReviewsUrl
  },
  {
    id: 'google-cafe-vandna-patel',
    name: 'Vandna Patel',
    role: 'Gazra Cafe guest',
    comment: 'A family visit made memorable by delicious Gujarati and Marathi dishes, especially Kothambir Vadi and ratalu chaat.',
    rating: 5,
    dish: 'Kothambir Vadi and ratalu chaat',
    order: 3,
    source: 'Google Maps review',
    sourceUrl: googleCafeReviewsUrl
  },
  {
    id: 'google-cafe-pooja-temkar',
    name: 'Pooja Temkar',
    role: 'Gazra Cafe guest',
    comment: 'A Mumbai guest loved finding Marathi cuisine this satisfying outside Mumbai and called the food truly excellent.',
    rating: 5,
    dish: 'Marathi cuisine',
    order: 4,
    source: 'Google Maps review',
    sourceUrl: googleCafeReviewsUrl
  },
  {
    id: 'google-cafe-theuniversalfoodie',
    name: 'TheUniversalFoodie',
    role: 'Gazra Cafe guest',
    comment: 'Authentic Maharashtrian cuisine, lovely seating, greenery around the cafe, and standout sabudana vada with marble soda.',
    rating: 5,
    dish: 'Sabudana Vada and marble soda',
    order: 5,
    source: 'Google Maps review',
    sourceUrl: googleCafeReviewsUrl
  },
  {
    id: 'google-cafe-pallavi-mohour',
    name: 'Pallavi Mohour',
    role: 'Gazra Cafe guest',
    comment: 'Worth the hype, peaceful, picture-friendly, and satisfying for the taste buds even on a short Baroda visit.',
    rating: 5,
    dish: 'Gazra Cafe experience',
    order: 6,
    source: 'Google Maps review',
    sourceUrl: googleCafeReviewsUrl
  },
  {
    id: 'google-cafe-anumita-mukherjee',
    name: 'Anumita Mukherjee',
    role: 'Gazra Cafe guest',
    comment: 'Wonderful ambience and aura, subtle well-prepared food, and a peaceful setting for a lovely meal.',
    rating: 5,
    dish: 'Peaceful meal',
    order: 7,
    source: 'Google Maps review',
    sourceUrl: googleCafeReviewsUrl
  },
  {
    id: 'google-cafe-dj',
    name: 'D J',
    role: 'Gazra Cafe guest',
    comment: 'Great ambience with a superb lake view outside, making the cafe experience feel special.',
    rating: 5,
    dish: 'Lake-view ambience',
    order: 8,
    source: 'Google Maps review',
    sourceUrl: googleCafeReviewsUrl
  },
  {
    id: 'google-review-minal-a',
    name: 'Minal Agarwal',
    role: 'Gazra Cafe guest',
    comment: 'Simple, nostalgic cafe. My favorite was the vada pav and rose water cold drink - amazing cafe.',
    rating: 5,
    dish: 'Vada Pav and rose water cold drink',
    order: 9,
    source: 'Google Maps review',
    sourceUrl: googleParentReviewsUrl
  },
  {
    id: 'google-review-yashodhan-l',
    name: 'Yashodhan Lakhe',
    role: 'Gazra Cafe guest',
    comment: 'Excellent food, soothing old-world ambience, and heartfelt service. A warm experience we would happily return for.',
    rating: 5,
    dish: 'Cafe experience',
    order: 10,
    source: 'Google Maps review',
    sourceUrl: googleParentReviewsUrl
  },
  {
    id: 'google-parent-harshit-jain',
    name: 'Harshit Jain',
    role: 'Gazra Cafe guest',
    comment: 'A quiet place in the middle of the crowded city, with a calm environment and delicious food.',
    rating: 5,
    dish: 'Cafe food and ambience',
    order: 11,
    source: 'Google Maps review',
    sourceUrl: googleParentReviewsUrl
  },
  {
    id: 'google-review-punit-g',
    name: 'Punit S. Gajera',
    role: 'Gazra Cafe guest',
    comment: 'A lovely Baroda spot with rajwadi ambience, lake views, sabudana wada, and authentic Marathi flavours.',
    rating: 5,
    dish: 'Sabudana Wada',
    order: 12,
    source: 'Google Maps review',
    sourceUrl: googleParentReviewsUrl
  },
  {
    id: 'google-parent-maria-jessica-sharma',
    name: 'Maria Jessica Sharma',
    role: 'Visitor',
    comment: 'A well-set-up inclusive organisation promoting entrepreneurship and skill development in Maharani Chimnabai spirit.',
    rating: 5,
    dish: 'Inclusive community experience',
    order: 13,
    source: 'Google Maps review',
    sourceUrl: googleParentReviewsUrl
  },
  {
    id: 'google-parent-tushar-mokani',
    name: 'Tushar Mokani',
    role: 'Visitor',
    comment: 'Lovely place near the old city with an awesome atmosphere.',
    rating: 5,
    dish: 'Cafe atmosphere',
    order: 14,
    source: 'Google Maps review',
    sourceUrl: googleParentReviewsUrl
  },
  {
    id: 'google-review-sanket-m',
    name: 'Sanket M',
    role: 'Gazra Cafe guest',
    comment: 'Beautiful rajwada-style ambience, best food, good service, and a memorable inclusive cafe experience.',
    rating: 5,
    dish: 'Heritage cafe experience',
    order: 15,
    source: 'Wanderlog / Google review',
    sourceUrl: wanderlogUrl
  },
  {
    id: 'google-review-ananya-ghosh',
    name: 'Ananya Ghosh',
    role: 'Gazra Cafe guest',
    comment: 'Easy to locate opposite Sursagar Lake, with Gazra Cafe hosted inside the heritage building.',
    rating: 5,
    dish: 'Heritage cafe visit',
    order: 16,
    source: 'Google Maps review',
    sourceUrl: googleParentReviewsUrl
  },
  {
    id: 'google-topic-vada-pav',
    name: 'Guest Review Topic',
    role: 'Popular dish',
    comment: 'Vada pav is one of the most-mentioned cafe favourites in Google review topics.',
    rating: 5,
    dish: 'Vada Pav',
    order: 17,
    source: 'Google Maps review topic',
    sourceUrl: googleCafeReviewsUrl
  },
  {
    id: 'google-topic-maharashtrian-food',
    name: 'Guest Review Topic',
    role: 'Popular cuisine',
    comment: 'Authentic Maharashtrian food appears repeatedly in guest review topics and written cafe reviews.',
    rating: 5,
    dish: 'Authentic Maharashtrian food',
    order: 18,
    source: 'Google Maps review topic',
    sourceUrl: googleCafeReviewsUrl
  },
  {
    id: 'google-topic-misal-pav',
    name: 'Guest Review Topic',
    role: 'Popular dish',
    comment: 'Misal pav is highlighted by guests as a recognizable favourite from the cafe menu.',
    rating: 5,
    dish: 'Misal Pav',
    order: 19,
    source: 'Google Maps review topic',
    sourceUrl: googleCafeReviewsUrl
  },
  {
    id: 'google-topic-puran-poli',
    name: 'Guest Review Topic',
    role: 'Popular dish',
    comment: 'Puran poli is called out in guest review topics, adding a sweet traditional note to the cafe experience.',
    rating: 5,
    dish: 'Puran Poli',
    order: 20,
    source: 'Google Maps review topic',
    sourceUrl: googleCafeReviewsUrl
  },
  {
    id: 'google-topic-mogra-shikanji',
    name: 'Guest Review Topic',
    role: 'Popular drink',
    comment: 'Mogra shikanji is one of the review-topic drinks guests associate with Gazra Cafe.',
    rating: 5,
    dish: 'Mogra Shikanji',
    order: 21,
    source: 'Google Maps review topic',
    sourceUrl: googleCafeReviewsUrl
  },
  {
    id: 'public-review-food-variety',
    name: 'Public Review Highlight',
    role: 'Food and variety',
    comment: 'Guests praise the delicious food, variety of offerings, authentic Marathi cuisines, and unique dishes.',
    rating: 5,
    dish: 'Gazra Cafe menu',
    order: 22,
    source: 'Justdial review insights',
    sourceUrl: justdialUrl
  },
  {
    id: 'public-review-ambience-service',
    name: 'Public Review Highlight',
    role: 'Ambience and service',
    comment: 'Visitors often highlight the warm heritage decor, cozy ambience, and friendly service from the heart.',
    rating: 5,
    dish: 'Ambience and service',
    order: 23,
    source: 'Justdial review insights',
    sourceUrl: justdialUrl
  }
];

function loadEnv() {
  const env = {};
  const raw = fs.readFileSync('.env', 'utf8');
  for (const line of raw.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const index = trimmed.indexOf('=');
    if (index === -1) continue;
    env[trimmed.slice(0, index)] = trimmed.slice(index + 1);
  }
  return env;
}

function getProjectId() {
  const env = loadEnv();
  return env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || env.VITE_FIREBASE_PROJECT_ID;
}

function getFirebaseCliAccessToken() {
  execFileSync('firebase', ['projects:list', '--json'], { stdio: 'ignore' });
  const configPath = `${process.env.HOME}/.config/configstore/firebase-tools.json`;
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  return config.tokens.access_token;
}

function firestoreValue(value) {
  if (value === null) return { nullValue: null };
  if (typeof value === 'boolean') return { booleanValue: value };
  if (typeof value === 'number') return Number.isInteger(value) ? { integerValue: value } : { doubleValue: value };
  if (Array.isArray(value)) return { arrayValue: { values: value.map(firestoreValue) } };
  if (value instanceof Date) return { timestampValue: value.toISOString() };
  return { stringValue: String(value) };
}

function firestoreFields(data) {
  return {
    fields: Object.fromEntries(Object.entries(data).map(([key, value]) => [key, firestoreValue(value)]))
  };
}

function fromFirestoreValue(value) {
  if ('stringValue' in value) return value.stringValue;
  if ('integerValue' in value) return Number(value.integerValue);
  if ('doubleValue' in value) return value.doubleValue;
  if ('booleanValue' in value) return value.booleanValue;
  if ('arrayValue' in value) return (value.arrayValue.values || []).map(fromFirestoreValue);
  if ('timestampValue' in value) return value.timestampValue;
  return null;
}

function fromFirestoreDocument(document) {
  const id = document.name.split('/').pop();
  const fields = {};
  for (const [key, value] of Object.entries(document.fields || {})) {
    fields[key] = fromFirestoreValue(value);
  }
  return { id, path: document.name, ...fields };
}

async function firestoreRequest(path, options = {}) {
  const response = await fetch(`https://firestore.googleapis.com/v1/${path}`, {
    ...options,
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': 'application/json',
      ...(options.headers || {})
    }
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(`${options.method || 'GET'} ${path} failed: ${JSON.stringify(body)}`);
  }
  return body;
}

async function listCollection(collectionName) {
  const body = await firestoreRequest(`${databasePath}/documents/${collectionName}?pageSize=1000`);
  return (body.documents || []).map(fromFirestoreDocument);
}

async function batchWrite(writes) {
  return firestoreRequest(`${databasePath}/documents:batchWrite`, {
    method: 'POST',
    body: JSON.stringify({ writes })
  });
}

const projectId = getProjectId();
if (!projectId) {
  throw new Error('Missing NEXT_PUBLIC_FIREBASE_PROJECT_ID in .env');
}

const token = getFirebaseCliAccessToken();
const databasePath = `projects/${projectId}/databases/(default)`;

console.log(`Using Firebase project ${projectId}`);
console.log('Reading existing cafe testimonials...');
const existingTestimonials = await listCollection('cafeTestimonials');

const writes = testimonials.map((testimonial) => {
  const existing = existingTestimonials.find((item) => item.id === testimonial.id);
  const documentPath = existing?.path || `${databasePath}/documents/cafeTestimonials/${testimonial.id}`;
  const data = {
    ...testimonial,
    image: existing?.image || '',
    imagePath: existing?.imagePath || '',
    featured: true,
    active: true,
    updatedAt: now,
    createdAt: existing?.createdAt || now
  };
  delete data.id;

  return { update: { name: documentPath, ...firestoreFields(data) } };
});

console.log(`Writing ${writes.length} testimonial documents...`);
await batchWrite(writes);

console.log(JSON.stringify({
  imported: testimonials.length,
  totalAfterImport: existingTestimonials.length + testimonials.filter(
    (testimonial) => !existingTestimonials.some((item) => item.id === testimonial.id)
  ).length
}, null, 2));
