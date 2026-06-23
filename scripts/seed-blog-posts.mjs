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

const slugify = (title) =>
  title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
};

// 10 OREO-structured (Opinion → Reason → Example → Opinion), SEO-targeted
// posts covering Gazra's actual programs. Paragraphs are separated by a
// blank line — BlogDetail.jsx splits content on '\n' and drops empties.
const posts = [
  {
    title: 'Why Vadodara Needs More Queer-Friendly Cafes Like Gazra',
    excerpt: 'A genuinely queer-friendly cafe in Vadodara isn\'t a nice-to-have — it\'s essential infrastructure for a city\'s LGBTQIA+ community.',
    category: 'stories',
    featuredImage: '/images/image9.webp',
    content: `A genuinely queer-friendly cafe in Vadodara isn't a nice-to-have — it's essential infrastructure for a city's LGBTQIA+ community, and every city deserves at least one.

Here's why it matters more than it might seem: physical, public spaces where LGBTQIA+ people can exist without explaining themselves are rare in most Indian cities, including Vadodara. Isolation and the constant low-grade vigilance of "is this place safe?" take a real toll on mental health. A cafe that is openly, visibly inclusive removes that question before you've even ordered your chai.

Gazra Cafe, run from Shri Maharani Chimnabai Stree Udyogalaya (MCSU) near Sursagar Lake, was built on exactly that idea. It's Gujarat's first queer-led community cafe, staffed and managed by members of the LGBTQIA+ community, serving Gujarati and Maharashtrian comfort food in a 110-year-old heritage building. Regulars don't just come for the food — they come because they can have a long conversation, work quietly for an afternoon, or just sit without performing anything for anyone. That's the actual product a queer-friendly cafe sells: permission to be unremarkable in public.

A queer-friendly cafe in Vadodara, done well, becomes more than a cafe — it becomes a landmark for belonging. If you're in Vadodara, visit Gazra Cafe, opposite Sursagar Lake, and see what a space built around inclusion actually feels like from the inside.`,
  },
  {
    title: 'Why Every Transgender Person in India Should Know Their NALSA Rights',
    excerpt: 'Legal literacy is the first form of protection for transgender people in India — and most people affected don\'t know the NALSA judgment exists.',
    category: 'updates',
    featuredImage: '',
    content: `Legal literacy is the first form of protection for transgender people in India — and most people affected by discrimination don't know that the NALSA judgment, one of the strongest legal protections they have, even exists.

The reason this gap matters is simple: rights you don't know you have are rights you can't use. In 2014, the Supreme Court's NALSA v. Union of India judgment legally recognized the right to self-identified gender, affirmed transgender persons as a socially and economically backward class entitled to reservations, and directed the government to treat transgender welfare with the same seriousness as other protected groups. Despite this, many transgender individuals in India still don't know they can approach a District Legal Services Authority (DLSA) for completely free legal aid, or that organizations like the National Legal Services Authority itself exist specifically to enforce judgments like this one.

Consider what this looks like in practice: a transgender person facing discrimination at work, harassment from a landlord, or difficulty updating identity documents has a legal basis to fight back, and free legal aid available through the DLSA system to do it — most simply never find out in time. Project Gazra's Resources directory exists partly to close that gap, listing NALSA, DLSA, and legal aid organizations like Lawyers Collective and the Humsafar Trust's legal aid cell in one searchable place, specifically so this information isn't locked behind legal jargon or word-of-mouth luck.

Legal protection only works if people know it's there. If you or someone you know needs to understand their rights or find free legal aid, visit Project Gazra's Resources page — it's built exactly for this.`,
  },
  {
    title: 'Why Mental Health Support for LGBTQIA+ Youth in India Can\'t Wait',
    excerpt: 'LGBTQIA+ youth in India face mental health risks that are urgent, not abstract — and the helplines that can help are underused simply because people don\'t know they exist.',
    category: 'updates',
    featuredImage: '',
    content: `LGBTQIA+ youth in India face mental health risks that are urgent, not abstract — and the helplines and counsellors who can help are underused simply because people don't know they exist or don't trust they'll be understood.

The reasoning behind this urgency isn't complicated: minority stress — the chronic strain of hiding, anticipating rejection, or actually experiencing it from family and community — is one of the most well-documented drivers of anxiety and depression among LGBTQIA+ youth specifically. Add family rejection, a justice system that only recently affirmed basic rights, and a near-total absence of LGBTQIA+-affirmative mental health training in mainstream healthcare, and the result is a generation of young queer and transgender people who often suffer in silence because asking for help feels riskier than not asking.

This is exactly why services like Tele-MANAS, the government's free 24/7 tele-mental-health helpline, and iCall, a confidential psychosocial counselling helpline run by TISS with counsellors trained in LGBTQIA+-affirmative practice, exist and deserve to be far better known. These aren't theoretical resources — they're staffed, free, and reachable by phone right now, in multiple Indian languages. Gazra's Resources directory lists these alongside community-run support groups like Humsafar Trust's Yaariyan (for young LGBTQ+ people) specifically so someone in crisis doesn't have to search blindly at 2am.

No one should have to face a mental health crisis without knowing where to turn. If you or someone you care about needs support, Gazra's Resources page lists verified, free mental health helplines — please don't wait to reach out.`,
  },
  {
    title: 'Why Skill Training Is the Most Underrated Form of Empowerment',
    excerpt: 'Of everything an inclusive organization can offer, a real, marketable skill might do more for someone\'s long-term safety and dignity than almost anything else.',
    category: 'updates',
    featuredImage: '/images/skill1.webp',
    content: `Of everything an inclusive organization can offer — community, visibility, advocacy — a real, marketable skill might do more for someone's long-term safety and dignity than almost anything else, because it leads directly to financial independence.

Here's the underlying logic: a huge share of the discrimination LGBTQIA+ and transgender people face in India is economic before it's anything else — exclusion from family support, from formal employment, from bank loans. Financial dependence is what traps people in unsafe situations longest. Skill training breaks that dependence directly, by giving someone a craft they can practice on their own terms, in their own time, often from home if needed.

This is precisely the model behind Gazra Skill Hub, run at MCSU in Vadodara. The Beauty Parlour course, taught by Mr. Dishit Rajput, trains students in makeup, hairstyling, and grooming over three months — graduates have gone on to open their own small salons or work independently doing bridal makeup. The Tailoring course, taught by Smt. Diptiben Vyas (30+ years of experience), even comes with loan assistance for a sewing machine after graduation specifically so the skill converts into income immediately. Music and Kathak Dance courses round out the program, building toward both livelihood and cultural pride.

A skill, once learned, can't be taken away the way a job can. If you're looking to build a sustainable, independent livelihood, explore the courses at Gazra Skill Hub — Beauty Parlour, Tailoring, Music, and Kathak Dance are open for enrollment now.`,
  },
  {
    title: 'Why Inclusive Hiring Should Be Every Indian Company\'s Priority in 2026',
    excerpt: 'Less than 2% of Indian companies have transgender-inclusive hiring policies — and that gap is a missed opportunity for businesses, not just a social failing.',
    category: 'updates',
    featuredImage: '',
    content: `Less than 2% of Indian companies have transgender-inclusive hiring policies — and that gap is a missed opportunity for businesses, not just a social failing.

The reasoning is straightforward once you look at the numbers: a 2017 study commissioned by India's National Human Rights Commission found only about 6% of transgender people were formally employed in either the private or NGO sector at the time, despite plenty of willing, skilled candidates. That's not a talent shortage — it's a hiring-practice shortage. Companies that build genuinely inclusive policies aren't taking on charity cases; they're accessing a motivated, underutilized talent pool that most of their competitors are still ignoring.

The proof that this works at scale already exists. Organizations like PeriFerry and Pride Circle now run placement programs and India's largest LGBTQ+ job fairs specifically to connect queer and transgender talent with willing employers — Pride Circle's events have placed hundreds of candidates. Godrej Properties grew its transgender employee representation from 18 to over 85 across levels after committing to inclusive hiring. The Keshav Suri Foundation runs skilling and sensitization programs specifically for the hospitality sector. None of this is hypothetical — it's already working where companies chose to try it.

Inclusive hiring isn't a favor to the LGBTQIA+ community — it's good business sense that most of corporate India hasn't caught up to yet. If you're an employer, the organizations listed in Gazra's Resources directory, under Jobs & Livelihood, are a real place to start.`,
  },
  {
    title: 'Why a 110-Year-Old Women\'s Institution Became Gujarat\'s First Queer Safe Haven',
    excerpt: 'A century-old vocational institute for women becoming the home of Gujarat\'s first queer-led cafe isn\'t a contradiction — it\'s the same mission, extended.',
    category: 'stories',
    featuredImage: '/images/chimnabai2.jpg',
    content: `A century-old vocational institute for women becoming the home of Gujarat's first queer-led cafe isn't a contradiction — it's the same founding mission, simply extended to the people who need it most today.

Here's why that continuity makes sense: Shri Maharani Chimnabai Stree Udyogalaya (MCSU) was founded in 1914 by Maharani Chimnabai II of the Gaekwad royal family, on the principle that women's economic independence — earning, not just learning — was the surest path to dignity. For over a century, that meant vocational training: tailoring, beauty, music, dance. The institution's entire reason for existing was giving people locked out of mainstream economic life a real, practical way in.

In 2023, that same logic extended naturally to the LGBTQIA+ community when Project Gazra launched Gazra Cafe — Gujarat's first cafe run entirely by members of the queer community, inside MCSU's own heritage building opposite Sursagar Lake. It wasn't a rebrand; it was the same 110-year-old idea — give people who are economically and socially excluded a real place to work and belong — applied to a community MCSU hadn't originally been built for, but whose needs turned out to be strikingly similar. The Gaekwad family's continued support for Gazra is, in that sense, MCSU simply doing in 2023 what it has always done.

Institutions with real heritage don't have to choose between honoring their history and serving people their founders never imagined. If you want to see a century of women's empowerment turn into queer inclusion in real time, visit Gazra Cafe and MCSU's story on the About page.`,
  },
  {
    title: 'Why Volunteering With an LGBTQIA+ Organization Changes You Too',
    excerpt: 'Volunteering at an LGBTQIA+ organization isn\'t one-directional charity — the people who show up regularly tend to say it changed how they see community itself.',
    category: 'stories',
    featuredImage: '/images/image-four.jpg',
    content: `Volunteering at an LGBTQIA+ organization isn't one-directional charity — the people who show up regularly tend to say it changed how they see community, allyship, and themselves just as much as it helped anyone else.

The reason for this is something most first-time volunteers don't expect: allyship in the abstract is easy to claim, but allyship in practice — showing up consistently, learning names, getting small things wrong and being corrected kindly, doing unglamorous tasks — is what actually builds empathy. It's the difference between supporting a cause and being part of a community, and that shift tends to surprise people in a good way.

At Gazra, volunteer roles are deliberately varied and low-barrier: Community Host (welcoming guests at events and the cafe), Events Support (helping run workshops, theatre nights, and cultural gatherings), Kitchen Assistant (hands-on cafe support), and Community Outreach (connecting Gazra with the wider Vadodara community). None of these require special expertise — just consistent commitment — and that's intentional, because the goal is genuine integration, not a one-time photo-op volunteering experience.

If you've been curious about getting involved with an inclusive community but weren't sure where to start, volunteering is the lowest-pressure, highest-impact way in. Gazra's Volunteer page lists current roles and the next steps to sign up — and most volunteers will tell you it gives back more than expected.`,
  },
  {
    title: 'Why Gender-Affirming Healthcare Access in India Still Has a Long Way to Go',
    excerpt: 'Despite real progress on paper — Ayushman Bharat TG Plus, NACO\'s HIV programs — gender-affirming healthcare in India remains hard to access without the right information.',
    category: 'updates',
    featuredImage: '',
    content: `Despite real progress on paper — the Ayushman Bharat TG Plus card, NACO's HIV treatment network — gender-affirming and transgender-inclusive healthcare in India remains genuinely hard to access in practice, and that gap deserves more attention than it gets.

The reason access still lags policy is discrimination at the point of care. Multiple studies, including reporting covered by aidsmap, have documented pervasive discrimination against LGBTQIA+ patients in Indian hospitals — refusal of treatment, hostile staff, and a near-total absence of provider training on transgender health needs. A scheme existing on paper doesn't help someone who is turned away or humiliated at the hospital desk before they even reach a doctor.

This is why specialized, community-trusted providers matter so much. The Humsafar Trust's Link ART Centre in Mumbai — India's first integrated community-based HIV treatment and holistic LGBTQ+ clinic — deliberately employs LGBTQ+ community members as receptionists, pharmacists, and counsellors, specifically so patients aren't navigating a hostile system alone. Organizations like SAATHII work directly with hospitals to train providers and build referral networks, slowly making mainstream healthcare safer by changing it from the inside rather than only building parallel systems.

Real healthcare access means more than an eligible scheme — it means a system that won't turn you away or mistreat you when you use it. Gazra's Resources directory lists verified, LGBTQIA+-friendly medical providers and schemes under Medical Aid, so you don't have to find out who's safe by trial and error.`,
  },
  {
    title: 'Why Authentic Gujarati Food Tastes Better When It\'s Made With Purpose',
    excerpt: 'Food cooked by a team building something bigger than a paycheck carries that intention into the plate — and Gazra Cafe\'s menu is a good argument for why purpose-driven food matters.',
    category: 'stories',
    featuredImage: '/images/food-image.webp',
    content: `Food cooked by a team building something bigger than a paycheck carries that intention into the plate, and Gazra Cafe's grandmother-recipe Gujarati and Maharashtrian menu is a genuinely good argument for why purpose-driven food matters, not just as a feel-good story but as a dining experience.

Here's the reasoning: cooking traditional regional food well requires real cultural memory — the kind that usually comes from someone's actual grandmother, not a recipe database. Gazra Cafe deliberately built its menu around exactly that: home-style Gujarati and Maharashtrian dishes made the way they're made in homes, by a team for whom getting it right is personal, not just professional. That care shows up as flavor, not just as a nice backstory.

Walk through the menu and the proof is concrete: Puneri Misal, a Pune favorite of sprouted moth beans in Godaa masala spice blend, topped with crunch and finished properly; thalis built around banana-leaf service the traditional way; chaas, theplas, and snacks that taste like they were made for a family meal rather than a tourist menu. Every purchase also directly funds Project Gazra's skill development and support programs — so the same plate that tastes like someone's actual grandmother's cooking is also funding someone else's vocational training.

Food tastes different — genuinely, not just sentimentally — when you know exactly who made it and why. If you're in Vadodara, visit Gazra Cafe opposite Sursagar Lake and taste the difference purpose makes.`,
  },
  {
    title: 'Why Support Funds Like Gazra\'s Are a Lifeline, Not Charity',
    excerpt: 'Calling financial support funds for the LGBTQIA+ community "charity" undersells what they actually do — they\'re crisis prevention, and that distinction matters.',
    category: 'updates',
    featuredImage: '/images/image-five.jpg',
    content: `Calling financial support funds for the LGBTQIA+ community "charity" undersells what they actually do — they're crisis prevention, and that distinction changes how we should think about both giving to them and using them.

The reasoning is about timing: LGBTQIA+ individuals in India disproportionately face sudden economic precarity — being disowned by family, losing housing, losing a job after coming out or being outed — at exactly the moments when they have the least financial cushion to absorb the shock. A support fund that can respond quickly, with minimal bureaucracy, is the difference between a temporary setback and a long-term crisis. That's not charitable generosity in the traditional sense; it's targeted, time-sensitive intervention.

Gazra Support Fund is built around exactly this principle — confidential, compassionate financial and social assistance for LGBTQIA+ and marginalized community members in Gujarat, with an online application process designed to be fast and low-friction rather than bureaucratic. It complements government schemes like SMILE (Support for Marginalized Individuals for Livelihood and Enterprise) and Garima Greh shelter homes, which provide longer-term structural support but can be slower to access — Gazra's fund is built to catch people in the gap.

If you're facing a financial crisis tied to your identity, asking for help from a fund built for exactly this situation isn't charity you should feel bad about — it's what it's there for. And if you're in a position to give, supporting a fund that prevents crises rather than just responding to them is some of the most effective help you can offer. Apply or contribute via Gazra's Support Fund page.`,
  },
  {
    title: 'Why Pride Isn\'t Just a Month — It\'s a Daily Practice in Vadodara',
    excerpt: 'Treating Pride as a once-a-year event misses the point — real visibility and safety come from showing up consistently, which is exactly what Gazra\'s year-round events build.',
    category: 'events',
    featuredImage: '/images/image-three.jpg',
    content: `Treating Pride as a once-a-year event misses the point — real visibility and safety for an LGBTQIA+ community come from showing up consistently, all year, which is exactly what a steady calendar of community events builds and a single annual march doesn't.

The reasoning here is about what actually changes minds and reduces isolation: one visible march a year is a powerful symbol, but the day-to-day work of being seen, welcomed, and included — at a cafe, a workshop, a community gathering — is what actually makes a city feel safer to live openly in. Consistency builds trust in a way a single annual event can't.

Gazra's calendar reflects that philosophy: theatre and dance nights, therapy circles, art workshops, cultural gatherings, and community meetups happen throughout the year, not just in June. The Sweekar initiative specifically calls on professionals committed to equality to build a holistic support network for women and the LGBTQIA+ community — the kind of ongoing, practical organizing that doesn't make headlines but does the real work. And when celebration does happen — like a community member proudly wrapped in a pride flag right outside MCSU's gates — it's the product of that year-round groundwork, not a substitute for it.

Pride, done right, is a practice, not a date on the calendar. Check Gazra's Events page and Calendar for what's coming up — and consider that showing up to the smaller, regular gatherings is what actually builds the community worth celebrating in June.`,
  },
];

async function createPost(token, data) {
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/blogs`;
  const body = firestoreFields(data);
  const response = await fetch(url, {
    method: 'POST',
    headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(`Failed to create post "${data.title}": ${JSON.stringify(result)}`);
  }
  return result;
}

async function main() {
  const token = getFirebaseCliAccessToken();
  console.log(`Seeding ${posts.length} blog posts into project ${projectId}...`);

  for (let i = 0; i < posts.length; i += 1) {
    const post = posts[i];
    const publishedDate = daysAgo(posts.length - i); // spread across recent days, oldest first
    const payload = {
      title: post.title,
      slug: slugify(post.title),
      excerpt: post.excerpt,
      content: post.content.trim(),
      author: 'Project Gazra Team',
      category: post.category,
      status: 'published',
      featured: i === 0 || i === 5, // feature the cafe-space and MCSU-heritage posts
      featuredImage: post.featuredImage || '',
      publishedDate,
      createdAt: publishedDate,
      updatedAt: publishedDate,
    };
    await createPost(token, payload);
    console.log(`✓ ${post.title}`);
  }
  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
