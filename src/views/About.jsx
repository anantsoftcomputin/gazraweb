import { ArrowRight, Heart, Users, Shield, Coffee, BookOpen, Globe, Sparkles } from 'lucide-react';
import { Link } from '../lib/routerCompat';
import { motion } from 'framer-motion';

const fadeUp = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.55 } };

/* ─── Section label pill ───────────────────────────────────────────── */
const SectionLabel = ({ icon: Icon, children }) => (
  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded border border-primary-200/60
                  bg-[rgba(251,244,231,0.92)] text-xs font-bold uppercase tracking-wide text-accent-terracotta
                  shadow-sm backdrop-blur-md mb-5">
    {Icon && <Icon className="w-3.5 h-3.5" />}
    {children}
  </div>
);

/* ─── Stat chip ────────────────────────────────────────────────────── */
const StatChip = ({ icon: Icon, value, label }) => (
  <div className="flex items-center gap-3 heritage-paper border border-neutral-300
                  rounded-lg p-4 shadow-sm">
    <div className="w-10 h-10 rounded bg-primary-600 flex items-center justify-center flex-shrink-0">
      <Icon className="w-5 h-5 text-white" />
    </div>
    <div>
      <p className="font-display text-lg font-black text-primary-700 leading-none">{value}</p>
      <p className="text-xs text-neutral-500 mt-0.5">{label}</p>
    </div>
  </div>
);

/* ─── Value card ───────────────────────────────────────────────────── */
const ValueCard = ({ icon: Icon, title, body, accent }) => (
  <motion.div {...fadeUp}
    className="group relative heritage-paper overflow-hidden border border-neutral-300 rounded-lg p-6 shadow-lg
               hover:shadow-xl hover:border-primary-500 hover:-translate-y-2 transition-all duration-300">
    <div className="heritage-rule absolute left-0 top-0 h-1 w-full" />
    <div className={`w-12 h-12 rounded flex items-center justify-center mb-4 ${accent}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <h3 className="font-display text-lg font-bold text-neutral-900 mb-2">{title}</h3>
    <p className="text-sm text-neutral-600 leading-relaxed">{body}</p>
    <div className="mt-4 h-[2px] w-0 group-hover:w-full transition-all duration-500 rounded"
         style={{ background: 'linear-gradient(90deg,#9F2F28,#D9A13A,#2F6B45)' }} />
  </motion.div>
);

/* ─── Initiative card ──────────────────────────────────────────────── */
const InitiativeCard = ({ image, title, body, link, linkLabel }) => (
  <motion.div {...fadeUp}
    className="group relative heritage-paper border border-neutral-300 rounded-lg shadow-lg
               overflow-hidden hover:shadow-xl hover:border-primary-500 hover:-translate-y-2 transition-all duration-300">
    <div className="heritage-rule absolute left-0 top-0 z-10 h-1 w-full" />
    <div className="relative h-48 overflow-hidden">
      <img src={image} alt={title} loading="lazy" decoding="async"
           className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-500" />
      <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/60 to-transparent" />
    </div>
    <div className="p-6">
      <h3 className="font-display text-lg font-bold text-neutral-900 mb-2">{title}</h3>
      <p className="text-sm text-neutral-600 leading-relaxed mb-4">{body}</p>
      <Link to={link} className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600
                                 hover:text-primary-700 transition-colors group">
        {linkLabel}
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  </motion.div>
);

/* ─── Main About page ──────────────────────────────────────────────── */
const About = () => {
  return (
    <div className="w-full">

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative min-h-[80vh] overflow-hidden bg-neutral-950 flex items-center">
        <img src="/images/image13.jpg" alt="Maharani Chimnabai legacy"
             className="absolute inset-0 w-full h-full object-cover object-top" />
        {/* Darkening scrim — image is bright enough to wash out white hero text */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/30 to-black/40" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[var(--gazra-paper)] to-transparent" />

        <div className="relative z-10 container mx-auto px-4 sm:px-8 py-20 lg:py-24">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
                      className="max-w-2xl space-y-6">
            <SectionLabel icon={Heart}>Welcome to Gazra</SectionLabel>

            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] text-white
                           drop-shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
              Embracing
              <span className="block text-primary-300">Inclusion</span>
              <span className="block">& Dignity</span>
            </h1>

            <p className="text-base sm:text-lg text-primary-100/80 leading-relaxed max-w-lg">
              An initiative by Shri Maharani Chimnabai Stree Udyogalaya — creating safe spaces,
              fostering understanding, and celebrating diversity in Vadodara since 1914.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <a href="#mission"
                 className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white
                            font-semibold px-6 py-3 rounded-lg shadow-lg transition-colors duration-200">
                Explore Our Mission
                <ArrowRight className="w-4 h-4" />
              </a>
              <a href="#story"
                 className="inline-flex items-center gap-2 border-2 border-primary-100/60
                            bg-neutral-950/20 hover:bg-primary-600 text-primary-50 hover:text-white
                            font-semibold px-6 py-3 rounded-lg backdrop-blur-md transition-all duration-200">
                Our Story
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Legacy ───────────────────────────────────────────────── */}
      <section id="story" className="bg-[var(--gazra-paper)] py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="gazra-folk-chain max-w-xs mx-auto mb-14" />

          <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
            {/* Image */}
            <motion.div {...fadeUp} className="relative">
              <div className="absolute -inset-3 rounded-xl opacity-40"
                   style={{ background: 'linear-gradient(135deg,#9F2F28,#D9A13A,#2F6B45)' }} />
              <div className="relative rounded-lg overflow-hidden border-4 border-[var(--gazra-paper)] shadow-2xl">
                <div className="absolute inset-x-0 top-0 h-[4px]"
                     style={{ background: 'linear-gradient(90deg,#9F2F28,#D9A13A,#2F6B45,#D9A13A,#9F2F28)' }} />
                <img src="/images/image13.jpg" alt="Historical MCSU photograph"
                     loading="lazy" decoding="async"
                     className="w-full object-contain max-h-[520px]" />
              </div>
            </motion.div>

            {/* Text */}
            <motion.div {...fadeUp} className="space-y-6">
              <SectionLabel icon={Sparkles}>Our Legacy</SectionLabel>
              <h2 className="font-display text-3xl sm:text-4xl font-black text-neutral-900 leading-tight">
                A Century of<br />
                <span className="text-primary-600">Empowerment & Service</span>
              </h2>
              <p className="text-neutral-600 leading-relaxed">
                Founded in 1914, Shri Maharani Chimnabai Stree Udyogalaya has been at the forefront
                of social reform and women's empowerment — adapting to changing times while preserving
                its core values of dignity, equality, and service.
              </p>
              <p className="text-neutral-600 leading-relaxed">
                Under Project Gazra, we continue this legacy by creating inclusive spaces where every
                individual — regardless of gender identity, sexual orientation, or background — can
                find community, purpose, and belonging.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <StatChip icon={Users} value="100+" label="Years of Service" />
                <StatChip icon={Globe} value="Countless" label="Lives Touched" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Toran divider ────────────────────────────────────────── */}
      <div className="h-[2px] w-full" style={{ background: 'linear-gradient(90deg,transparent,#9F2F28,#D9A13A,#2F6B45,#D9A13A,#9F2F28,transparent)' }} />

      {/* ── Mission & Vision ──────────────────────────────────────── */}
      <section id="mission" className="py-20 bg-neutral-900 relative overflow-hidden">
        <img src="/images/image7.webp" alt="" loading="lazy" decoding="async"
             className="absolute inset-0 w-full h-full object-cover opacity-15" />
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-950/90 to-neutral-900/80" />

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <SectionLabel icon={BookOpen}>Our Purpose</SectionLabel>
            <h2 className="font-display text-3xl sm:text-4xl font-black text-white">Mission & Vision</h2>
            <p className="mt-4 text-primary-100/70 max-w-xl mx-auto leading-relaxed">
              Guided by compassion, inclusion, and dignity, we strive to create lasting positive change.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Mission */}
            <motion.div {...fadeUp}
              className="bg-[rgba(251,244,231,0.07)] backdrop-blur-md border border-primary-200/20
                         rounded-lg p-8 hover:bg-[rgba(251,244,231,0.1)] transition-colors duration-300">
              <div className="w-14 h-14 rounded bg-primary-600 flex items-center justify-center mb-6">
                <Heart className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-display text-2xl font-bold text-white mb-4">Our Mission</h3>
              <p className="text-primary-100/75 leading-relaxed mb-3">
                To create safe, inclusive spaces where individuals of all genders, orientations, and
                backgrounds can find community, support, and opportunities for growth.
              </p>
              <p className="text-primary-100/75 leading-relaxed">
                Through Gazra Cafe and our initiatives, we build bridges of understanding, challenge
                prejudice, and cultivate a culture where every individual is treated with dignity.
              </p>
            </motion.div>

            {/* Vision */}
            <motion.div {...fadeUp} transition={{ duration: 0.55, delay: 0.12 }}
              className="bg-[rgba(251,244,231,0.07)] backdrop-blur-md border border-primary-200/20
                         rounded-lg p-8 hover:bg-[rgba(251,244,231,0.1)] transition-colors duration-300">
              <div className="w-14 h-14 rounded bg-accent-terracotta flex items-center justify-center mb-6">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-display text-2xl font-bold text-white mb-4">Our Vision</h3>
              <p className="text-primary-100/75 leading-relaxed mb-3">
                A world where every individual, regardless of gender identity or sexual orientation,
                can live authentically without fear of discrimination or prejudice.
              </p>
              <p className="text-primary-100/75 leading-relaxed">
                By continuing the legacy of MCSU, we aspire to be a catalyst for social transformation —
                creating ripples of acceptance that extend far beyond our physical spaces.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Core Values ──────────────────────────────────────────── */}
      <section className="bg-[var(--gazra-paper)] py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-14 lg:gap-20 items-start">
            {/* Heading col */}
            <div className="lg:w-72 flex-shrink-0">
              <SectionLabel>Core Values</SectionLabel>
              <h2 className="font-display text-3xl sm:text-4xl font-black text-neutral-900 leading-tight mt-2">
                Principles that<br />
                <span className="text-primary-600">guide every step</span>
              </h2>
              <p className="mt-4 text-neutral-600 leading-relaxed text-sm">
                These values shape every initiative we undertake and every interaction we have
                with our community.
              </p>
              <div className="mt-8">
                <img src="/images/image9.webp" alt="Community" loading="lazy" decoding="async"
                     className="w-full rounded-lg object-cover h-56 shadow-lg border border-[rgba(184,121,44,0.2)]" />
              </div>
            </div>

            {/* Cards grid */}
            <div className="flex-1 grid sm:grid-cols-2 gap-5">
              <ValueCard icon={Heart}   title="Inclusivity"  accent="bg-primary-600"
                body="Embracing diversity and creating spaces where everyone feels welcomed, valued, and represented without condition." />
              <ValueCard icon={Users}   title="Community"    accent="bg-secondary-600"
                body="Building strong connections and support networks that foster belonging, solidarity, and mutual care." />
              <ValueCard icon={Shield}  title="Safe Space"   accent="bg-accent-terracotta"
                body="Providing secure environments for authentic expression — free from judgment, discrimination, or fear." />
              <ValueCard icon={Coffee}  title="Connection"   accent="bg-primary-600"
                body="Fostering meaningful relationships and understanding across diverse perspectives, one conversation at a time." />
            </div>
          </div>
        </div>
      </section>

      {/* ── Folk divider ──────────────────────────────────────────── */}
      <div className="bg-[var(--gazra-paper)] pb-4">
        <div className="gazra-folk-chain max-w-md mx-auto" />
      </div>

      {/* ── Our Initiatives ───────────────────────────────────────── */}
      <section className="bg-[var(--gazra-paper)] pt-6 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <SectionLabel icon={Sparkles}>Our Work</SectionLabel>
            <h2 className="font-display text-3xl sm:text-4xl font-black text-neutral-900">
              Initiatives that matter
            </h2>
            <p className="mt-4 text-neutral-600 max-w-xl mx-auto">
              Each programme carries the same soul — service, dignity, and community.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <InitiativeCard
              image="/images/image10.webp"
              title="Gazra Cafe"
              body="A warm, inclusive café where Gujarati hospitality meets modern community spirit. Every cup serves a larger purpose."
              link="/cafe"
              linkLabel="Visit the Cafe" />
            <InitiativeCard
              image="/images/image-four.jpg"
              title="Community Events"
              body="Regular meetups, workshops, and cultural celebrations that bring people together and foster understanding."
              link="/events"
              linkLabel="Browse Events" />
            <InitiativeCard
              image="/images/skill1.webp"
              title="Gazra Skill Hub"
              body="Empowering individuals with livelihood skills, professional training, and pathways to economic independence."
              link="/gazra-skills"
              linkLabel="Explore Skills" />
          </div>
        </div>
      </section>

      {/* ── Join Us CTA ───────────────────────────────────────────── */}
      <section className="py-16 bg-primary-600 relative overflow-hidden">
        <div className="absolute inset-0 gazra-jaali opacity-20" />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="gazra-folk-chain gazra-folk-chain--on-brown max-w-xs mx-auto mb-8" />
          <h2 className="font-display text-3xl sm:text-4xl font-black text-white mb-4">
            Join Our Community
          </h2>
          <p className="text-primary-100/80 max-w-xl mx-auto mb-8 leading-relaxed">
            Be part of a movement that celebrates diversity, fosters inclusion, and creates positive change.
            Whether you're looking for support, connection, or ways to contribute — there's a place for you at Gazra.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/volunteer"
              className="inline-flex items-center gap-2 bg-white text-primary-700 font-bold px-6 py-3
                         rounded-lg shadow-lg hover:bg-primary-50 transition-colors duration-200">
              Volunteer With Us
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/events"
              className="inline-flex items-center gap-2 border-2 border-primary-100/60 text-primary-50
                         font-semibold px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors duration-200">
              Attend Events
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="gazra-folk-chain gazra-folk-chain--on-brown max-w-xs mx-auto mt-8" />
        </div>
      </section>

    </div>
  );
};

export default About;
