import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const projectId = 'gazraweb-33d32';

function getFirebaseCliAccessToken() {
  execFileSync('firebase', ['projects:list', '--json'], { stdio: 'ignore' });
  const configPath = `${process.env.HOME}/.config/configstore/firebase-tools.json`;
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  return config.tokens.access_token;
}

function firestoreFields(data) {
  const fields = {};
  for (const [key, value] of Object.entries(data)) {
    if (value === null || value === undefined) fields[key] = { nullValue: null };
    else if (typeof value === 'boolean') fields[key] = { booleanValue: value };
    else if (typeof value === 'number') fields[key] = { doubleValue: value };
    else if (Array.isArray(value)) {
      if (value.length > 0 && typeof value[0] === 'object') {
        fields[key] = { arrayValue: { values: value.map((item) => ({ mapValue: firestoreFields(item) })) } };
      } else {
        fields[key] = { arrayValue: { values: value.map((item) => ({ stringValue: String(item) })) } };
      }
    } else {
      fields[key] = { stringValue: String(value) };
    }
  }
  return { fields };
}

// Real courses currently offered by MCSU (mcsu.in), researched from the
// site's /parlour/, /tailoring/, /music-course/, and /kathak-course/ pages.
const courses = [
  {
    title: 'Beauty Parlour Course',
    tagline: 'Become a certified makeup and hair artist',
    instructor: 'Mr. Dishit Rajput',
    category: 'beauty-parlour',
    icon: 'Scissors',
    duration: '3 Months (12 Weeks, 24 Sessions)',
    batchSize: 'Contact MCSU for current batch size',
    schedule: 'Contact MCSU for current timings',
    placementSupport: true,
    overview: 'Become a certified makeup and hair artist. Students develop skills in makeup application, hairstyling, skincare, and grooming, enabling graduates to open salons, work independently, or provide home-based services. Trained by Mr. Dishit Rajput, who specializes in bridal makeup and mehendi artistry.',
    skills: [
      'Makeup application and hairstyling',
      'Manicure and pedicure',
      'Skin analysis and facial treatments',
      'Threading, waxing, and eyebrow shaping',
      'Hair coloring and straightening',
      'Bridal and creative hairstyling',
    ],
    careerOpportunities: [
      'Open your own beauty salon',
      'Work independently as a freelance artist',
      'Provide home-based beauty services',
      'Join an established salon',
    ],
    modules: [
      { title: 'Grooming, Hygiene & Safety', duration: '', topics: ['Grooming, hygiene, and safety protocols', 'Manicure and pedicure services'] },
      { title: 'Hair & Skin Techniques', duration: '', topics: ['Hair cutting and styling techniques', 'Skin analysis and treatments', 'Hair spa and damage treatments', 'Hair coloring and straightening'] },
      { title: 'Bridal & Creative Styling', duration: '', topics: ['Bridal and creative hairstyling', 'Threading and eyebrow shaping', 'Facial treatments and waxing', 'Saree draping'] },
    ],
    featured: true,
    active: true,
  },
  {
    title: 'Tailoring Course',
    tagline: 'Turn design ideas into wearable garments',
    instructor: 'Smt. Diptiben Vyas',
    category: 'tailoring',
    icon: 'Shirt',
    duration: '3 Months (12 Weeks, 24 Sessions)',
    batchSize: 'Contact MCSU for current batch size',
    schedule: 'Contact MCSU for current timings',
    placementSupport: true,
    overview: 'Stitching is the basic skill that transforms a design concept into a wearable garment. This program trains participants in sewing techniques used in apparel manufacturing and related industries like upholstery and furnishing, covering kurtas, salwars, petticoats, and chaniyas. Taught by Smt. Diptiben Vyas, who has over 30 years of experience in tailoring and embroidery and a degree in Home Science from MVM College, Rajkot. Post-completion loan assistance is available for purchasing a sewing machine.',
    skills: [
      'Fabric selection and design fundamentals',
      'Measurement and pattern creation',
      'Fabric cutting procedures',
      'Sewing machine operation',
      'Garment assembly and finishing',
    ],
    careerOpportunities: [
      'Start a home-based tailoring business',
      'Join a stitching facility',
      'Work in apparel manufacturing',
    ],
    modules: [
      { title: 'Fabric & Pattern Fundamentals', duration: '', topics: ['Fabric selection and design fundamentals', 'Fabric properties (shrinkage, grain, bias)', 'Measurement techniques', 'Pattern creation and layout'] },
      { title: 'Cutting & Sewing', duration: '', topics: ['Fabric cutting procedures', 'Sewing machine operation basics', 'Garment assembly'] },
      { title: 'Finishing & Final Garments', duration: '', topics: ['Finishing techniques', 'Kurtas, Salwars, Petticoats, Chaniyas', 'Final presentation'] },
    ],
    featured: true,
    active: true,
  },
  {
    title: 'Music Course',
    tagline: 'Learn to play Tabla, Harmonium, Sitar, Keyboard, Jaltarang & Vocal',
    instructor: '',
    category: 'music',
    icon: 'Music',
    duration: 'Contact MCSU for current duration',
    batchSize: 'Contact MCSU for current batch size',
    schedule: 'Morning: 10:00 AM - 11:00 AM (Daily) · Evening: 7:00 PM - 8:00 PM (Daily)',
    placementSupport: false,
    overview: 'Become a certified musician by learning to play different instruments, including Tabla, Harmonium, Sitar, Keyboard, Jaltarang/Kaachtarang, and Vocal.',
    skills: [
      'Tabla',
      'Harmonium',
      'Sitar',
      'Keyboard',
      'Jaltarang / Kaachtarang',
      'Vocal music',
    ],
    careerOpportunities: [
      'Perform professionally',
      'Teach music classes',
      'Join a musical ensemble',
    ],
    modules: [],
    featured: true,
    active: true,
  },
  {
    title: 'Kathak Dance Course',
    tagline: "Become a professional Kathak dancer, rooted in our culture's tradition",
    instructor: 'Ms. Pashmina Vyas',
    category: 'kathak',
    icon: 'PersonStanding',
    duration: '6 Months',
    batchSize: 'Contact MCSU for current batch size',
    schedule: 'Morning: 10:00 AM - 11:30 AM · Evening: 5:00 PM - 6:30 PM',
    placementSupport: false,
    overview: "Learn our culture's traditional dance and become a professional Kathak dancer. Covers both theory (origin and history of the art form, study of different Gharanas) and practical training (footwork, circles, hand gestures, Toda, Tukada, Paran, Tihai, and basics of notation). Taught by Ms. Pashmina Vyas, a trained and qualified Kathak dancer.",
    skills: [
      'Footwork, circles & hand gestures',
      'Toda, Tukada, Paran, and Tihai',
      'Expression and recitation of rhythmic syllables',
      'Basics of notation',
      'History and Gharana traditions of Kathak',
    ],
    careerOpportunities: [
      'Perform professionally',
      'Teach Kathak dance classes',
      'Pursue advanced classical dance training',
    ],
    modules: [
      { title: 'Theory', duration: '', topics: ['Origin and historical context of the art form', "Study of different Gharanas (classical traditions)", 'Theoretical foundational elements'] },
      { title: 'Practical', duration: '', topics: ['Footwork, circles & hand gestures', 'Toda, Tukada, Paran, and Tihai', 'Expression and recitation of rhythmic syllables', 'Basics of notation'] },
    ],
    featured: true,
    active: true,
  },
];

async function createCourse(token, data) {
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/skillsCourses`;
  const body = firestoreFields({ ...data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
  const response = await fetch(url, {
    method: 'POST',
    headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(`Failed to create course "${data.title}": ${JSON.stringify(result)}`);
  }
  return result;
}

async function main() {
  const token = getFirebaseCliAccessToken();
  console.log(`Seeding ${courses.length} skills courses into project ${projectId}...`);
  for (const course of courses) {
    await createCourse(token, course);
    console.log(`✓ ${course.title}`);
  }
  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
