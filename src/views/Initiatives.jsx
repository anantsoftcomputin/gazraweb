/* eslint-disable react/prop-types */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from '../lib/routerCompat';
import {
  Heart, Users, Leaf,
  Coffee, Book, HandHeart,
  ArrowRight, Globe, Sparkles,
  Target, Calendar,
  Smartphone, Building, GraduationCap,
  Gavel, HeartPulse,
  Star, ChevronRight, ChevronUp,
  Shield, Map, MessageCircle, User, Search, Brain
} from 'lucide-react';

const fadeUp = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.55 } };

/* ─── Section label pill (matches About page) ──────────────────────── */
const SectionLabel = ({ icon: Icon, children }) => (
  <div className="mb-5">
    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded border border-primary-200/60
                    bg-[rgba(251,244,231,0.92)] text-xs font-bold uppercase tracking-wide text-accent-terracotta
                    shadow-sm backdrop-blur-md">
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {children}
    </div>
  </div>
);

/* ─── Heritage colour assignments per initiative ───────────────────── */
const palettes = {
  cafe: {
    icon: 'bg-primary-600',
    chip: 'bg-primary-50 text-primary-700 border border-primary-200',
    text: 'text-primary-700',
    light: 'bg-primary-50',
  },
  app: {
    icon: 'bg-accent-indigo',
    chip: 'bg-accent-indigo/10 text-accent-indigo border border-accent-indigo/25',
    text: 'text-accent-indigo',
    light: 'bg-accent-indigo/10',
  },
  pink: {
    icon: 'bg-accent-terracotta',
    chip: 'bg-accent-terracotta/10 text-accent-terracotta border border-accent-terracotta/25',
    text: 'text-accent-terracotta',
    light: 'bg-accent-terracotta/10',
  },
  workshop: {
    icon: 'bg-secondary-600',
    chip: 'bg-secondary-50 text-secondary-700 border border-secondary-200',
    text: 'text-secondary-700',
    light: 'bg-secondary-50',
  },
};

/* ─── Content data ─────────────────────────────────────────────────── */
const initiatives = [
  {
    id: 'gazra-cafe',
    title: 'Gazra Cafe',
    icon: Coffee,
    category: 'Gender Empowerment',
    description: "Gujarat's first queer-led cafe, providing a safe inclusive space and employment opportunities for the LGBTQIA+ community.",
    impact: 'First queer-led cafe in Gujarat',
    details: [
      'Located at MCSU premises near Sursagar Lake, Vadodara',
      'Managed entirely by members of the queer community',
      'Specializes in Gujarati and Maharashtrian cuisine',
      'Supported by the Vadodara royal family',
      'Creates livelihood opportunities for marginalized communities',
    ],
    stats: {
      established: 'August 18, 2023',
      cuisine: 'Gujarati & Maharashtrian',
      management: '100% Queer-led',
    },
    status: 'Running',
    palette: palettes.cafe,
  },
  {
    id: 'gazra-app',
    title: 'Gazra App',
    icon: Smartphone,
    category: 'Resource Portal',
    description: 'One-stop resource portal for verified support services catered to the LGBTQIA+ community and marginalized groups.',
    impact: 'Comprehensive support network',
    details: [
      'Verified listing of LGBTQIA+ friendly professionals',
      'Categories include doctors, lawyers, mental health counselors',
      'Human resource professionals for workplace inclusion',
      'Soon to be available on Android and Apple app stores',
      'Vetted resources to ensure safe and supportive experiences',
    ],
    stats: {
      resources: '50+ professionals',
      categories: '5+ service types',
      availability: 'Coming Soon',
    },
    status: 'Upcoming',
    palette: palettes.app,
  },
  {
    id: 'pink-line-project',
    title: 'Pink Line Project',
    icon: Target,
    category: 'Gender Empowerment',
    description: 'An initiative focused on establishing boundaries, safety, and increased visibility for marginalized gender identities.',
    impact: 'Creating safe spaces and awareness',
    details: [
      'Safety campaigns for vulnerable gender identities',
      'Establishing support systems and networks',
      'Awareness programs about gender-based discrimination',
      'Community outreach and education initiatives',
    ],
    stats: {
      focus: 'Safety & Visibility',
      approach: 'Community-centered',
      status: 'In development',
    },
    status: 'Upcoming',
    palette: palettes.pink,
  },
  {
    id: 'gender-sensitization',
    title: 'Gender Sensitization Workshops',
    icon: GraduationCap,
    category: 'Education & Awareness',
    description: 'Workshops designed to promote understanding of gender issues, challenge stereotypes, and foster inclusivity.',
    impact: 'Building a gender-sensitive community',
    details: [
      'Interactive sessions on gender identity and expression',
      'Dismantling harmful stereotypes and misconceptions',
      'Creating allies through education and empathy',
      'Providing tools for creating inclusive environments',
    ],
    stats: {
      approach: 'Interactive learning',
      targetAudience: 'Community-wide',
      facilitators: 'Trained professionals',
    },
    status: 'Upcoming',
    palette: palettes.workshop,
  },
];

const impactStats = [
  { number: '100%', label: 'Queer-Managed Cafe', icon: Coffee },
  { number: '5+', label: 'Professional Categories', icon: Smartphone },
  { number: '1st', label: 'LGBTQIA+ Cafe in Gujarat', icon: Heart },
  { number: '110+', label: 'Years of MCSU Legacy', icon: Building },
];

const supportCategories = [
  { title: 'Medical Support', icon: HeartPulse, resourceCount: 'Doctors & Specialists' },
  { title: 'Legal Assistance', icon: Gavel, resourceCount: 'Lawyers & Advisors' },
  { title: 'Mental Health', icon: Brain, resourceCount: 'Therapists & Counselors' },
  { title: 'Workplace Inclusion', icon: Users, resourceCount: 'HR Consultants' },
  { title: 'Education Resources', icon: Book, resourceCount: 'Educational Content' },
  { title: 'Community Support', icon: HandHeart, resourceCount: 'Support Networks' },
];

const appFeatures = [
  { icon: Star, title: 'Verified Professionals', body: 'Carefully screened providers' },
  { icon: Shield, title: 'Safe Experience', body: 'Protected user privacy' },
  { icon: Map, title: 'Location-Based', body: 'Find nearby resources' },
  { icon: MessageCircle, title: 'Community Reviews', body: 'Honest feedback system' },
];

const timeline = [
  { year: '1914', title: 'MCSU Founded', description: 'Established by Maharani Chimnabai II to provide vocational skills to women', icon: Building },
  { year: '20th Century', title: "Women's Empowerment", description: "Decades of service focused on women's economic independence", icon: Leaf },
  { year: '21st Century', title: 'Mission Expansion', description: 'Broadened focus to include marginalized women, artisans, and LGBTQIA+ community', icon: Globe },
  { year: '2023 – Present', title: 'Gazra Initiatives', description: 'Innovative projects for gender empowerment and inclusive opportunities', icon: Sparkles },
];

const workshops = [
  {
    title: 'Understanding Gender Identity',
    focus: 'Basic Concepts',
    description: 'An introduction to gender identity, expression, and the spectrum of experiences.',
    audience: 'General Public',
    icon: GraduationCap,
  },
  {
    title: 'Creating Inclusive Environments',
    focus: 'Practical Application',
    description: 'Hands-on strategies for building spaces that welcome and affirm all gender identities.',
    audience: 'Organizations & Institutions',
    icon: Building,
  },
  {
    title: 'Allyship in Action',
    focus: 'Support Strategies',
    description: 'Learn how to be an effective ally to transgender and gender-diverse individuals.',
    audience: 'Allies & Supporters',
    icon: HandHeart,
  },
];

/* ─── Cafe spotlight feature rows ──────────────────────────────────── */
const cafeHighlights = [
  {
    icon: Users,
    title: 'Queer-Led Management',
    body: 'The cafe is managed entirely by members of the LGBTQIA+ community, creating meaningful employment opportunities and a model for inclusive business practices.',
  },
  {
    icon: Coffee,
    title: 'Regional Culinary Experience',
    body: 'Specializing in authentic Gujarati and Maharashtrian cuisine, the cafe celebrates local culinary traditions while creating a unique dining experience.',
  },
  {
    icon: Heart,
    title: 'Safe and Inclusive Space',
    body: 'A welcoming environment where everyone can feel comfortable, respected, and valued regardless of their identity, fostering community connections.',
  },
  {
    icon: Building,
    title: 'Royal Support',
    body: "Proud to have received the support of the Vadodara royal family, continuing MCSU's historic royal connections and bringing prestigious recognition to the initiative.",
  },
];

const InitiativesPage = () => {
  const [activeInitiative, setActiveInitiative] = useState(null);

  const scrollToInitiatives = () => {
    document.getElementById('initiatives-grid')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[var(--gazra-paper)]">

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative min-h-[72vh] overflow-hidden bg-neutral-950 flex items-center">
        <img src="/images/chimnabai2.jpg" alt="Statue of Maharani Chimnabai II"
             className="absolute inset-0 w-full h-full object-cover object-[center_22%]" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/20" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(251,244,231,0.08)_1px,transparent_1px)] bg-[length:100%_5px] opacity-30 mix-blend-soft-light" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[var(--gazra-paper)] to-transparent" />

        <div className="relative z-10 container mx-auto px-4 sm:px-8 py-20 lg:py-24">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
                      className="max-w-2xl space-y-6">
            <SectionLabel icon={HandHeart}>MCSU &amp; Gazra</SectionLabel>

            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] text-white
                           drop-shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
              Fostering
              <span className="block mt-1 text-accent-ochre">Inclusive Empowerment</span>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-primary-50 max-w-xl leading-relaxed
                          drop-shadow-[0_3px_14px_rgba(0,0,0,0.65)]">
              Building on MCSU&apos;s century-long legacy, Gazra leads innovative initiatives for the LGBTQIA+
              community and marginalized groups, fostering inclusivity and economic independence.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <button onClick={scrollToInitiatives}
                className="group inline-flex items-center gap-2 rounded-lg bg-primary-600 px-7 py-3.5 font-semibold text-white
                           shadow-md transition-all duration-300 hover:bg-primary-700">
                Explore Our Initiatives
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <Link to="/volunteer"
                className="inline-flex items-center gap-2 rounded-lg border-2 border-primary-100/80 bg-neutral-950/20 px-7 py-3.5
                           font-semibold text-primary-50 backdrop-blur-md transition-all duration-300 hover:bg-primary-600 hover:text-white">
                Get Involved
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Heritage & Mission ───────────────────────────────────── */}
      <section className="relative py-20 overflow-hidden">
        <div className="heritage-rule absolute left-0 top-0 h-1.5 w-full" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div {...fadeUp} className="space-y-6">
              <SectionLabel icon={Star}>Our Heritage &amp; Mission</SectionLabel>

              <h2 className="font-display text-3xl md:text-4xl font-black text-neutral-900 leading-tight">
                Gazra: Advancing MCSU&apos;s
                <span className="relative inline-block ml-2">
                  <span className="relative z-10">Legacy</span>
                  <span className="absolute bottom-1 left-0 -z-10 h-3 w-full -rotate-1 bg-primary-300/50" />
                </span>
                {' '}of Empowerment
              </h2>

              <p className="text-neutral-600 text-base md:text-lg leading-relaxed">
                Founded in 1914 by Maharani Chimnabai II, Shri Maharani Chimnabai Stree Udyogalaya (MCSU) has
                evolved from its original focus on women&apos;s vocational training to embrace a broader mission of inclusivity.
              </p>

              <p className="text-neutral-600 text-base md:text-lg leading-relaxed">
                Today, Gazra represents MCSU&apos;s commitment to gender empowerment, creating safe spaces and
                opportunities for the LGBTQIA+ community while honoring the institution&apos;s century-old dedication
                to fostering independence and dignity.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Building, value: 'Est. 1914', label: 'MCSU Foundation', accent: 'bg-primary-600' },
                  { icon: HandHeart, value: 'Gender Empowerment', label: 'Core Focus Area', accent: 'bg-secondary-600' },
                  { icon: Coffee, value: 'August 2023', label: 'Gazra Cafe Launch', accent: 'bg-accent-terracotta' },
                  { icon: Smartphone, value: 'Coming Soon', label: 'Gazra App', accent: 'bg-accent-indigo' },
                ].map((chip) => (
                  <div key={chip.label}
                       className="flex items-center gap-3 heritage-paper border border-neutral-300 rounded-lg p-4 shadow-sm">
                    <div className={`w-10 h-10 rounded flex items-center justify-center flex-shrink-0 ${chip.accent}`}>
                      <chip.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-display text-sm sm:text-base font-black text-neutral-900 leading-tight">{chip.value}</p>
                      <p className="text-xs text-neutral-500 mt-0.5">{chip.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div {...fadeUp} className="relative">
              <div className="relative overflow-hidden rounded-lg border border-neutral-300 shadow-hard">
                <div className="heritage-rule absolute left-0 top-0 z-10 h-1 w-full" />
                <img src="/images/join-community.jpg" alt="The Gazra Cafe team at MCSU"
                     loading="lazy" decoding="async"
                     className="w-full h-[420px] lg:h-[520px] object-cover object-top" />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/75 via-neutral-900/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-7 text-white">
                  <p className="text-xs font-bold uppercase tracking-wide text-accent-ochre mb-1.5">Historic Institution</p>
                  <p className="font-display text-2xl font-black">MCSU Campus, Vadodara</p>
                </div>
              </div>
              <div className="gazra-folk-chain max-w-xs mx-auto mt-6" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Impact stats band ────────────────────────────────────── */}
      <section className="relative py-16 bg-primary-600 overflow-hidden">
        <div className="absolute inset-0 gazra-jaali opacity-20" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="gazra-folk-chain gazra-folk-chain--on-brown max-w-xs mx-auto mb-10" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {impactStats.map((stat, index) => (
              <motion.div key={stat.label} {...fadeUp} transition={{ duration: 0.55, delay: index * 0.08 }}
                          className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded border border-primary-100/30 bg-[rgba(251,244,231,0.14)]
                                flex items-center justify-center text-primary-50 backdrop-blur-sm">
                  <stat.icon className="w-6 h-6" />
                </div>
                <p className="font-display text-4xl md:text-5xl font-black text-white mb-2">{stat.number}</p>
                <p className="text-sm text-primary-100/90">{stat.label}</p>
              </motion.div>
            ))}
          </div>
          <div className="gazra-folk-chain gazra-folk-chain--on-brown max-w-xs mx-auto mt-10" />
        </div>
      </section>

      {/* ── Key initiatives grid ─────────────────────────────────── */}
      <section id="initiatives-grid" className="py-20 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <SectionLabel icon={Sparkles}>Our Programs</SectionLabel>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-black text-neutral-900 mb-4">
              Gazra&apos;s Key Initiatives
            </h2>
            <p className="text-neutral-600 max-w-2xl mx-auto text-base md:text-lg">
              Discover our innovative projects aimed at creating inclusive spaces, providing resources,
              and fostering understanding within the community.
            </p>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
            {initiatives.map((initiative, index) => {
              const open = activeInitiative === initiative.id;
              return (
                <motion.div key={initiative.id} {...fadeUp} transition={{ duration: 0.55, delay: index * 0.08 }}
                  onClick={() => setActiveInitiative(open ? null : initiative.id)}
                  className={`group relative heritage-paper self-start overflow-hidden rounded-lg border p-6 pb-16 shadow-lg cursor-pointer
                              transition-all duration-300 hover:shadow-xl hover:-translate-y-1
                              ${open ? 'border-primary-500 shadow-xl' : 'border-neutral-300 hover:border-primary-500'}`}>
                  <div className="heritage-rule absolute left-0 top-0 h-1 w-full" />

                  <span className={`absolute top-5 right-5 text-xs font-bold px-3 py-1 rounded border
                    ${initiative.status === 'Running'
                      ? 'bg-secondary-50 text-secondary-700 border-secondary-200'
                      : 'bg-accent-ochre/10 text-primary-700 border-accent-ochre/30'}`}>
                    {initiative.status}
                  </span>

                  <div className={`w-14 h-14 mb-5 rounded flex items-center justify-center text-white shadow-md ${initiative.palette.icon}`}>
                    <initiative.icon className="w-7 h-7" />
                  </div>

                  <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full mb-4 ${initiative.palette.chip}`}>
                    {initiative.category}
                  </span>

                  <h3 className="font-display text-xl font-black text-neutral-900 mb-2">{initiative.title}</h3>
                  <p className="text-sm text-neutral-600 leading-relaxed mb-4">{initiative.description}</p>

                  <div className={`flex items-center gap-2 text-sm font-semibold ${initiative.palette.text}`}>
                    <Sparkles className="w-4 h-4 flex-shrink-0" />
                    <span>{initiative.impact}</span>
                  </div>

                  {open && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                                className="mt-5 pt-5 border-t border-[rgba(184,121,44,0.2)]">
                      <ul className="space-y-2.5 mb-5">
                        {initiative.details.map((detail) => (
                          <li key={detail} className="flex items-start gap-2 text-sm text-neutral-700">
                            <ChevronRight className={`w-4 h-4 mt-0.5 flex-shrink-0 ${initiative.palette.text}`} />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="grid grid-cols-2 gap-2.5">
                        {Object.entries(initiative.stats).map(([key, value]) => (
                          <div key={key} className={`p-3 rounded ${initiative.palette.light}`}>
                            <p className="text-[11px] uppercase tracking-wide text-neutral-500 mb-0.5">{key}</p>
                            <p className={`text-sm font-semibold ${initiative.palette.text}`}>{value}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  <span className={`absolute bottom-5 right-5 w-8 h-8 rounded-full flex items-center justify-center
                                    transition-transform duration-300 group-hover:scale-110
                                    ${initiative.palette.light} ${initiative.palette.text}`}>
                    {open ? <ChevronUp className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Legacy timeline ──────────────────────────────────────── */}
      <section className="relative py-20 gazra-folk-bg overflow-hidden">
        <div className="gazra-toran-stripe absolute left-0 top-0 w-full" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <SectionLabel icon={Calendar}>A Century of Service</SectionLabel>
            <h2 className="font-display text-3xl md:text-4xl font-black text-neutral-900 mb-4">
              From 1914 to Today
            </h2>
            <p className="text-neutral-600 max-w-2xl mx-auto text-base md:text-lg">
              Each Gazra initiative continues a story that began over a century ago.
            </p>
          </div>

          <div className="relative max-w-3xl mx-auto">
            <div className="absolute left-5 sm:left-1/2 top-0 bottom-0 w-px bg-[rgba(159,47,40,0.3)] sm:-translate-x-1/2" />
            <div className="space-y-10">
              {timeline.map((item, index) => (
                <motion.div key={item.year} {...fadeUp} transition={{ duration: 0.55, delay: index * 0.08 }}
                            className={`relative flex sm:items-center gap-6 ${index % 2 ? 'sm:flex-row-reverse' : ''}`}>
                  <span className={`absolute left-5 sm:left-1/2 top-6 sm:top-1/2 -translate-x-1/2 sm:-translate-y-1/2
                                    gazra-rosette flex-shrink-0
                                    ${index % 2 ? 'text-secondary-600' : 'text-accent-terracotta'}`} />
                  <div className="hidden sm:block sm:w-1/2" />
                  <div className={`ml-12 sm:ml-0 sm:w-1/2 ${index % 2 ? 'sm:pr-10' : 'sm:pl-10'}`}>
                    <div className="heritage-paper relative overflow-hidden rounded-lg border border-neutral-300 p-5 shadow-lg
                                    hover:border-primary-500 hover:shadow-xl transition-all duration-300">
                      <div className="heritage-rule absolute left-0 top-0 h-1 w-full" />
                      <div className="flex items-center gap-3 mb-2.5">
                        <div className="w-9 h-9 rounded bg-primary-600 flex items-center justify-center flex-shrink-0">
                          <item.icon className="w-5 h-5 text-white" />
                        </div>
                        <p className="font-display text-lg font-black text-primary-700">{item.year}</p>
                      </div>
                      <h3 className="font-display text-base font-bold text-neutral-900 mb-1.5">{item.title}</h3>
                      <p className="text-sm text-neutral-600 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Gazra App spotlight ──────────────────────────────────── */}
      <section className="relative py-20 overflow-hidden">
        <div className="heritage-rule absolute left-0 top-0 h-1.5 w-full" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <motion.div {...fadeUp} className="space-y-6">
              <SectionLabel icon={Smartphone}>Coming Soon</SectionLabel>

              <h2 className="font-display text-3xl md:text-4xl font-black text-neutral-900 leading-tight">
                Gazra App:
                <span className="block mt-1 text-accent-indigo">One-Stop Resource Portal</span>
              </h2>

              <p className="text-neutral-600 text-base md:text-lg leading-relaxed">
                Connecting the LGBTQIA+ community with verified, supportive professionals across multiple
                categories. Our app ensures safe access to essential services through a carefully vetted network.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                {appFeatures.map((feature) => (
                  <div key={feature.title}
                       className="flex items-center gap-3 heritage-paper border border-neutral-300 rounded-lg p-4 shadow-sm">
                    <div className="w-10 h-10 flex-shrink-0 rounded bg-accent-indigo flex items-center justify-center text-white">
                      <feature.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-neutral-900">{feature.title}</p>
                      <p className="text-xs text-neutral-500 mt-0.5">{feature.body}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link to="/contact"
                className="group inline-flex items-center gap-2 rounded-lg bg-primary-600 px-7 py-3.5 font-semibold text-white
                           shadow-md transition-all duration-300 hover:bg-primary-700">
                Join the Waitlist
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            {/* Phone mockup — heritage skin */}
            <motion.div {...fadeUp} className="relative">
              <div className="relative mx-auto w-[280px] h-[580px] bg-neutral-900 rounded-[3rem] border-[14px] border-neutral-900 shadow-hard overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-6 bg-neutral-900 rounded-b-xl z-10" />
                <div className="h-full heritage-paper overflow-hidden">
                  <div className="p-4">
                    <div className="h-12 flex items-center justify-between mb-5">
                      <p className="font-display font-black text-lg text-neutral-900">Gazra App</p>
                      <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center shadow-sm">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    </div>

                    <div className="relative h-10 mb-5">
                      <div className="w-full h-full rounded-lg bg-white/80 pl-10 pr-4 border border-[rgba(184,121,44,0.3)]
                                      flex items-center text-sm text-neutral-400">
                        Search resources…
                      </div>
                      <Search className="absolute left-3 top-3 w-4 h-4 text-primary-600" />
                    </div>

                    <p className="font-display font-bold text-sm text-neutral-900 mb-3">Resource Categories</p>
                    <div className="grid grid-cols-2 gap-2.5 mb-5">
                      {supportCategories.slice(0, 6).map((category) => (
                        <div key={category.title}
                             className="bg-white/80 rounded-lg border border-[rgba(184,121,44,0.18)] p-3 flex flex-col items-center text-center">
                          <div className="w-9 h-9 rounded bg-primary-50 border border-primary-200 flex items-center justify-center text-primary-700 mb-1.5">
                            <category.icon className="w-4 h-4" />
                          </div>
                          <p className="font-semibold text-[11px] text-neutral-900 leading-tight mb-0.5">{category.title}</p>
                          <p className="text-[10px] text-accent-terracotta">{category.resourceCount}</p>
                        </div>
                      ))}
                    </div>

                    <p className="font-display font-bold text-sm text-neutral-900 mb-3">Featured Professionals</p>
                    <div className="space-y-2.5">
                      {[1, 2].map((i) => (
                        <div key={i} className="bg-white/80 rounded-lg border border-[rgba(184,121,44,0.18)] p-3 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                            <User className="w-5 h-5 text-primary-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-xs text-neutral-900">Professional Name</p>
                            <p className="text-[10px] text-neutral-500">Category • Location</p>
                            <div className="flex items-center mt-0.5">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} className="w-3 h-3 text-accent-ochre" fill="currentColor" />
                              ))}
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-primary-600 flex-shrink-0" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="gazra-folk-chain max-w-[280px] mx-auto mt-6" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Gazra Cafe spotlight ─────────────────────────────────── */}
      <section className="relative py-20 overflow-hidden">
        <div className="gazra-toran-stripe absolute left-0 top-0 w-full" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
            {/* Photos + testimonial */}
            <motion.div {...fadeUp} className="relative order-2 lg:order-1 pb-24 sm:pb-20">
              <div className="relative max-w-lg mx-auto">
                <div className="relative overflow-hidden rounded-lg border border-neutral-300 shadow-hard">
                  <div className="heritage-rule absolute left-0 top-0 z-10 h-1 w-full" />
                  <img src="/images/image-six.jpg" alt="Inside Gazra Cafe" loading="lazy" decoding="async"
                       className="w-full h-[340px] object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/75 via-neutral-900/15 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded border border-primary-100/40
                                    bg-neutral-950/40 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wide">
                      <Coffee className="w-3.5 h-3.5" />
                      Gazra Cafe
                    </div>
                  </div>
                </div>

                <motion.div initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}
                            transition={{ delay: 0.25, duration: 0.6 }}
                            className="absolute -top-8 -right-4 sm:-right-10 w-28 h-28 sm:w-32 sm:h-32 rounded-lg overflow-hidden
                                       border-4 border-[var(--gazra-paper)] shadow-hard rotate-3">
                  <img src="/images/food-1.jpg" alt="Cafe food" loading="lazy" decoding="async" className="w-full h-full object-cover" />
                </motion.div>

                <motion.div initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                            className="absolute -bottom-10 -left-4 sm:-left-10 w-36 h-28 rounded-lg overflow-hidden
                                       border-4 border-[var(--gazra-paper)] shadow-hard -rotate-3">
                  <img src="/images/image12.jpg" alt="Cafe ambience by candlelight" loading="lazy" decoding="async"
                       className="w-full h-full object-cover" />
                </motion.div>
              </div>

              <motion.div {...fadeUp} transition={{ duration: 0.55, delay: 0.5 }}
                          className="absolute -bottom-10 right-0 sm:right-4 heritage-paper rounded-lg border border-neutral-300
                                     p-5 shadow-hard max-w-[17rem]">
                <div className="heritage-rule absolute left-0 top-0 h-1 w-full rounded-t-lg" />
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-accent-terracotta flex items-center justify-center flex-shrink-0">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-neutral-900">Cafe Visitor</p>
                    <p className="text-xs text-accent-terracotta">Community Member</p>
                  </div>
                </div>
                <p className="text-neutral-600 italic text-xs leading-relaxed">
                  “Gazra Cafe isn&apos;t just a place to eat — it&apos;s a space where I can truly be myself without judgment.
                  The warmth and acceptance here are just as nourishing as the food.”
                </p>
                <div className="mt-2.5 flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-3.5 h-3.5 text-accent-ochre" fill="currentColor" />
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* Cafe info */}
            <motion.div {...fadeUp} className="space-y-6 order-1 lg:order-2">
              <SectionLabel icon={Sparkles}>Spotlight Initiative</SectionLabel>

              <h2 className="font-display text-3xl md:text-4xl font-black text-neutral-900 leading-tight">
                Gazra Cafe:
                <span className="block mt-1 text-primary-600">Gujarat&apos;s First Queer-Led Cafe</span>
              </h2>

              <p className="text-neutral-600 text-base md:text-lg leading-relaxed">
                Launched on August 18, 2023, at the MCSU premises near Sursagar Lake in Vadodara, Gazra Cafe
                is a groundbreaking initiative that offers more than just culinary delights.
              </p>

              <div className="space-y-5">
                {cafeHighlights.map((highlight) => (
                  <div key={highlight.title} className="flex items-start gap-4">
                    <div className="w-11 h-11 flex-shrink-0 rounded bg-primary-600 flex items-center justify-center text-white shadow-md">
                      <highlight.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-bold text-neutral-900 mb-1">{highlight.title}</h3>
                      <p className="text-sm text-neutral-600 leading-relaxed">{highlight.body}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link to="/cafe"
                className="group inline-flex items-center gap-2 rounded-lg bg-primary-600 px-7 py-3.5 font-semibold text-white
                           shadow-md transition-all duration-300 hover:bg-primary-700">
                Visit Gazra Cafe
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Workshops ────────────────────────────────────────────── */}
      <section className="relative py-20 gazra-folk-bg overflow-hidden">
        <div className="heritage-rule absolute left-0 top-0 h-1.5 w-full" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <SectionLabel icon={GraduationCap}>Education &amp; Awareness</SectionLabel>
            <h2 className="font-display text-3xl md:text-4xl font-black text-neutral-900 mb-4">
              Gender Sensitization Workshops
            </h2>
            <p className="text-neutral-600 max-w-2xl mx-auto text-base md:text-lg">
              Interactive sessions that challenge stereotypes and build empathy — for individuals,
              organizations, and allies.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {workshops.map((workshop, index) => (
              <motion.div key={workshop.title} {...fadeUp} transition={{ duration: 0.55, delay: index * 0.08 }}
                          className="group relative heritage-paper overflow-hidden rounded-lg border border-neutral-300 p-6 shadow-lg
                                     hover:border-primary-500 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                <div className="heritage-rule absolute left-0 top-0 h-1 w-full" />
                <div className="w-12 h-12 rounded bg-secondary-600 flex items-center justify-center mb-4 shadow-md">
                  <workshop.icon className="w-6 h-6 text-white" />
                </div>
                <span className="inline-block px-3 py-1 bg-secondary-50 text-secondary-700 border border-secondary-200
                                 text-xs font-semibold rounded-full mb-3">
                  {workshop.focus}
                </span>
                <h3 className="font-display text-lg font-bold text-neutral-900 mb-2">{workshop.title}</h3>
                <p className="text-sm text-neutral-600 leading-relaxed mb-4">{workshop.description}</p>
                <p className="flex items-center gap-2 text-xs font-semibold text-neutral-500">
                  <Users className="w-3.5 h-3.5 text-secondary-600" />
                  {workshop.audience}
                </p>
                <div className="mt-4 h-[2px] w-0 group-hover:w-full transition-all duration-500 rounded"
                     style={{ background: 'linear-gradient(90deg,#9F2F28,#D9A13A,#2F6B45)' }} />
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/contact"
              className="group inline-flex items-center gap-2 rounded-lg bg-secondary-600 px-7 py-3.5 font-semibold text-white
                         shadow-md transition-all duration-300 hover:bg-secondary-700">
              Book a Workshop
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────── */}
      <section className="relative py-20 gazra-canvas-texture overflow-hidden">
        <div className="gazra-toran-stripe absolute left-0 top-0 w-full" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="gazra-folk-chain gazra-folk-chain--on-brown max-w-xs mx-auto mb-8" />
          {/* `text-white` is required here — the global .heritage-site h2 rule repaints any heading
              without it in dark ink, which is invisible on this dark canvas */}
          <h2 className="font-display text-3xl md:text-4xl font-black text-white mb-4">
            Be Part of the Story
          </h2>
          <p className="text-[rgba(243,236,217,0.75)] max-w-xl mx-auto mb-9 text-base md:text-lg">
            Every initiative grows through people like you — volunteer, collaborate, or simply
            share a meal at the cafe.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/volunteer"
              className="inline-flex items-center justify-center gap-2 bg-[var(--gazra-gold-soft)] text-neutral-900
                         font-bold px-8 py-3.5 rounded-lg shadow-lg hover:brightness-110 transition-all duration-200">
              Volunteer With Us
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/contact"
              className="inline-flex items-center justify-center gap-2 border-2 border-[rgba(243,236,217,0.4)]
                         text-[color:var(--gazra-ivory)] font-semibold px-8 py-3.5 rounded-lg
                         hover:bg-[rgba(243,236,217,0.1)] transition-colors duration-200">
              Get in Touch
            </Link>
          </div>
          <div className="gazra-folk-chain gazra-folk-chain--on-brown max-w-xs mx-auto mt-8" />
        </div>
      </section>

    </div>
  );
};

export default InitiativesPage;
