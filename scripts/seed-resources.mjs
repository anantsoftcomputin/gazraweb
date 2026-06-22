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
      fields[key] = { arrayValue: { values: value.map((item) => ({ stringValue: String(item) })) } };
    } else {
      fields[key] = { stringValue: String(value) };
    }
  }
  return { fields };
}

// Real, verifiable LGBTQIA+ support resources for India — researched and
// cross-checked against organization websites / public reporting. Contact
// fields are left blank where a precise public number/email wasn't
// confirmed; the website link is the primary point of contact in that case.
const resources = [
  // ── Legal Aid ──────────────────────────────────────────────
  {
    name: 'NALSA Free Legal Aid',
    orgName: 'National Legal Services Authority (NALSA)',
    description: 'Statutory body providing free legal aid and representation to transgender and other marginalized persons, following the landmark NALSA v. Union of India (2014) judgment on gender self-identification.',
    category: 'legal', fundingType: 'government',
    website: 'https://nalsa.gov.in', phone: '', email: '',
    tags: ['legal aid', 'transgender rights', 'NALSA'], status: 'active', viewCount: 0,
  },
  {
    name: 'District Legal Services Authority (DLSA)',
    orgName: 'District Legal Services Authority, Vadodara',
    description: 'Local statutory body offering free legal aid, mediation, and representation for transgender and LGBTQIA+ individuals facing discrimination, harassment, or family disputes.',
    category: 'legal', fundingType: 'government',
    website: 'https://nalsa.gov.in/lsams-cell/dlsa', phone: '', email: '',
    tags: ['legal aid', 'Vadodara', 'mediation'], status: 'active', viewCount: 0,
  },
  {
    name: 'National Council for Transgender Persons',
    orgName: 'Ministry of Social Justice & Empowerment, Govt. of India',
    description: 'Central advisory body overseeing implementation of the Transgender Persons (Protection of Rights) Act, including grievance redress and welfare scheme coordination.',
    category: 'legal', fundingType: 'government',
    website: 'https://socialjustice.gov.in', phone: '', email: '',
    tags: ['transgender rights', 'policy', 'grievance redress'], status: 'active', viewCount: 0,
  },
  {
    name: 'Lawyers Collective',
    orgName: 'Lawyers Collective',
    description: 'Legal advocacy organization providing litigation support and legal counsel on LGBTQIA+ rights, including Section 377 litigation history and ongoing gender-identity cases.',
    category: 'legal', fundingType: 'private',
    website: 'https://lawyerscollective.org', phone: '', email: '',
    tags: ['litigation', 'advocacy', 'LGBTQ rights'], status: 'active', viewCount: 0,
  },
  {
    name: 'Humsafar Trust — Legal Aid Cell',
    orgName: 'The Humsafar Trust',
    description: 'Provides legal counselling and aid to LGBTQIA+ individuals facing discrimination, family disputes, or harassment, alongside its health and community programs.',
    category: 'legal', fundingType: 'private',
    website: 'https://humsafar.org', phone: '', email: '',
    tags: ['legal aid', 'counselling', 'Mumbai'], status: 'active', viewCount: 0,
  },

  // ── Mental Health ──────────────────────────────────────────
  {
    name: 'Tele-MANAS',
    orgName: 'National Tele Mental Health Programme, Govt. of India',
    description: '24/7 toll-free tele-mental-health helpline offering free counselling in multiple Indian languages, inclusive of LGBTQIA+ callers.',
    category: 'mental-health', fundingType: 'government',
    website: 'https://telemanas.mohfw.gov.in', phone: '1800-891-4416', email: '',
    tags: ['helpline', '24/7', 'counselling'], status: 'active', viewCount: 0,
  },
  {
    name: 'iCall Helpline',
    orgName: 'iCall, Tata Institute of Social Sciences (TISS)',
    description: 'Free, confidential psychosocial counselling helpline run by TISS, with counsellors trained in LGBTQIA+ affirmative practice.',
    category: 'mental-health', fundingType: 'private',
    website: 'https://icallhelpline.org', phone: '9152987821', email: 'icall@tiss.edu',
    tags: ['helpline', 'counselling', 'affirmative therapy'], status: 'active', viewCount: 0,
  },
  {
    name: 'Mariwala Health Initiative',
    orgName: 'Mariwala Health Initiative',
    description: 'Funds and partners with grassroots groups to expand access to affirmative mental health care for LGBTQIA+ communities across India.',
    category: 'mental-health', fundingType: 'private',
    website: 'https://mhi.org.in', phone: '', email: '',
    tags: ['affirmative therapy', 'grants', 'community mental health'], status: 'active', viewCount: 0,
  },
  {
    name: 'Sappho for Equality',
    orgName: 'Sappho for Equality',
    description: 'Kolkata-based support organization for lesbian, bisexual, and transmasculine persons, running a dedicated mental health helpline and peer support groups.',
    category: 'mental-health', fundingType: 'private',
    website: 'https://sapphokolkata.in', phone: '98315 18320', email: '',
    tags: ['peer support', 'helpline', 'Kolkata'], status: 'active', viewCount: 0,
  },
  {
    name: 'Yaariyan / Umang / Sanjeevani Support Groups',
    orgName: 'The Humsafar Trust',
    description: 'Peer support groups for young LGBTQ+ persons (Yaariyan), LBT persons (Umang), and people living with HIV (Sanjeevani), offering community and emotional support.',
    category: 'mental-health', fundingType: 'private',
    website: 'https://humsafar.org', phone: '', email: '',
    tags: ['peer support', 'community', 'Mumbai'], status: 'active', viewCount: 0,
  },

  // ── Medical Aid ────────────────────────────────────────────
  {
    name: 'Ayushman Bharat TG Plus Card',
    orgName: 'Ministry of Social Justice & Empowerment / National Health Authority',
    description: 'Links the SMILE scheme with Ayushman Bharat to give transgender persons access to 50+ free health facilities, including gender-affirming care.',
    category: 'medical', fundingType: 'government',
    website: 'https://pmjay.gov.in', phone: '', email: '',
    tags: ['health insurance', 'gender-affirming care', 'SMILE scheme'], status: 'active', viewCount: 0,
  },
  {
    name: 'National AIDS Control Organisation (NACO)',
    orgName: 'NACO, Ministry of Health & Family Welfare',
    description: 'Coordinates free HIV testing, treatment, and care across India, including targeted interventions for transgender persons and MSM communities.',
    category: 'medical', fundingType: 'government',
    website: 'https://naco.gov.in', phone: '1097', email: '',
    tags: ['HIV care', 'free testing', 'targeted intervention'], status: 'active', viewCount: 0,
  },
  {
    name: 'Humsafar Trust Link ART Centre',
    orgName: 'The Humsafar Trust, Santacruz, Mumbai',
    description: "India's first integrated community-based HIV treatment and holistic LGBTQ+ clinic, offering free antiretroviral therapy via NACO with an LGBTQ+-staffed, non-discriminatory environment.",
    category: 'medical', fundingType: 'private',
    website: 'https://humsafar.org/health', phone: '', email: '',
    tags: ['HIV treatment', 'gender-affirming care', 'Mumbai'], status: 'active', viewCount: 0,
  },
  {
    name: 'SAATHII',
    orgName: 'Solidarity and Action Against The HIV Infection in India (SAATHII)',
    description: 'Works with government and private hospitals to improve LGBTQIA+ healthcare access, training providers and supporting referral networks for gender-affirming and HIV care.',
    category: 'medical', fundingType: 'private',
    website: 'https://saathii.in', phone: '', email: '',
    tags: ['healthcare access', 'provider training', 'HIV care'], status: 'active', viewCount: 0,
  },

  // ── Jobs & Livelihood ──────────────────────────────────────
  {
    name: 'SMILE Scheme & Garima Greh',
    orgName: 'Ministry of Social Justice & Empowerment, Govt. of India',
    description: 'Government scheme supporting livelihood, skill development, and shelter (Garima Greh homes) for transgender persons across India.',
    category: 'jobs', fundingType: 'government',
    website: 'https://socialjustice.gov.in', phone: '', email: '',
    tags: ['livelihood', 'skill development', 'shelter homes'], status: 'active', viewCount: 0,
  },
  {
    name: 'PeriFerry',
    orgName: 'PeriFerry',
    description: 'Skilling and placement organization connecting transgender and LGBTQIA+ job seekers with inclusive employers across India, also running corporate DEI training.',
    category: 'jobs', fundingType: 'private',
    website: 'https://www.periferry.com', phone: '', email: '',
    tags: ['placement', 'skilling', 'DEI training'], status: 'active', viewCount: 0,
  },
  {
    name: 'Pride Circle',
    orgName: 'Pride Circle',
    description: 'Organizes India\'s largest LGBTQ+ job fairs and corporate inclusion programs, connecting queer talent with employers committed to inclusive hiring.',
    category: 'jobs', fundingType: 'private',
    website: 'https://pridecircle.com', phone: '', email: '',
    tags: ['job fair', 'corporate inclusion', 'employment'], status: 'active', viewCount: 0,
  },
  {
    name: 'Keshav Suri Foundation',
    orgName: 'Keshav Suri Foundation',
    description: 'Runs skilling, sensitization, and employment programs for the LGBTQIA+ community in the hospitality sector and beyond.',
    category: 'jobs', fundingType: 'private',
    website: 'https://keshavsurifoundation.com', phone: '', email: '',
    tags: ['hospitality jobs', 'skilling', 'sensitization'], status: 'active', viewCount: 0,
  },
  {
    name: 'Sahodari Foundation',
    orgName: 'Sahodari Foundation',
    description: 'Tamil Nadu-based organization supporting transgender livelihood, education, and entrepreneurship through training and advocacy.',
    category: 'jobs', fundingType: 'private',
    website: 'https://sahodari.org', phone: '', email: '',
    tags: ['livelihood', 'entrepreneurship', 'Tamil Nadu'], status: 'active', viewCount: 0,
  },
];

async function createResource(token, data) {
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/resources`;
  const body = firestoreFields({ ...data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
  const response = await fetch(url, {
    method: 'POST',
    headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(`Failed to create resource "${data.name}": ${JSON.stringify(result)}`);
  }
  return result;
}

async function main() {
  const token = getFirebaseCliAccessToken();
  console.log(`Seeding ${resources.length} resources into project ${projectId}...`);
  for (const resource of resources) {
    await createResource(token, resource);
    console.log(`✓ ${resource.name}`);
  }
  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
