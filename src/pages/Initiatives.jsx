import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  // Import Lucide icons
  Heart, Users, Leaf,
  Coffee, Book, HandHeart,
  ArrowRight, Globe, Sparkles,
  Lightbulb, MessageSquare, Target,
  Sprout, Calendar, Clock,
  Smartphone, Building, GraduationCap,
  FileText, Gavel, HeartPulse,
  Star, ChevronRight, ChevronUp,
  Shield, Map, MessageCircle, User, Search
} from 'lucide-react';

const InitiativesPage = () => {
  const [activeInitiative, setActiveInitiative] = useState(null);

  // Custom Brain icon as it's not in Lucide
  const Brain = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-1.04Z"></path>
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-1.04Z"></path>
    </svg>
  );

  // Rich color palette for an elegant design
  const colors = {
    primary: {
      gradient: 'from-primary-600 to-secondary-600',
      light: 'bg-primary-50',
      border: 'border-primary-100',
      text: 'text-primary-600',
      dark: 'bg-primary-600'
    },
    cafe: {
      gradient: 'from-amber-500 to-orange-500',
      light: 'bg-amber-50',
      border: 'border-amber-100',
      text: 'text-amber-600',
      dark: 'bg-amber-600'
    },
    app: {
      gradient: 'from-sky-500 to-blue-500',
      light: 'bg-sky-50',
      border: 'border-sky-100',
      text: 'text-sky-600',
      dark: 'bg-sky-600'
    },
    pink: {
      gradient: 'from-rose-500 to-pink-500',
      light: 'bg-rose-50',
      border: 'border-rose-100',
      text: 'text-rose-600',
      dark: 'bg-rose-600'
    },
    workshop: {
      gradient: 'from-emerald-500 to-teal-500',
      light: 'bg-emerald-50',
      border: 'border-emerald-100',
      text: 'text-emerald-600',
      dark: 'bg-emerald-600'
    }
  };

  // Initiatives data with appropriate color assignments
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
        'Creates livelihood opportunities for marginalized communities'
      ],
      image: '/api/placeholder/600/400', // <-- Replace Placeholder
      stats: {
        established: 'August 18, 2023',
        cuisine: 'Gujarati & Maharashtrian',
        management: '100% Queer-led'
      },
      status: 'Completed',
      colors: colors.cafe
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
        'Vetted resources to ensure safe and supportive experiences'
      ],
      image: '/api/placeholder/600/400', // <-- Replace Placeholder
      stats: {
        resources: '50+ professionals',
        categories: '5+ service types',
        availability: 'Coming Soon'
      },
      status: 'Upcoming',
      colors: colors.app
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
        'Community outreach and education initiatives'
      ],
      image: '/api/placeholder/600/400', // <-- Replace Placeholder
      stats: {
        focus: 'Safety & Visibility',
        approach: 'Community-centered',
        status: 'In development'
      },
      status: 'Upcoming',
      colors: colors.pink
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
        'Providing tools for creating inclusive environments'
      ],
      image: '/api/placeholder/600/400', // <-- Replace Placeholder
      stats: {
        approach: 'Interactive learning',
        targetAudience: 'Community-wide',
        facilitators: 'Trained professionals'
      },
      status: 'Upcoming',
      colors: colors.workshop
    }
  ];

  // Key statistics
  const impactStats = [
    {
      number: '100%',
      label: 'Queer-Managed Cafe',
      icon: Coffee,
      color: colors.cafe.text,
      bgColor: colors.cafe.light
    },
    {
      number: '5+',
      label: 'Professional Categories',
      icon: Smartphone,
      color: colors.app.text,
      bgColor: colors.app.light
    },
    {
      number: '1st',
      label: 'LGBTQIA+ Cafe in Gujarat',
      icon: Heart,
      color: colors.pink.text,
      bgColor: colors.pink.light
    },
    {
      number: '110+',
      label: 'Years of MCSU Legacy',
      icon: Building,
      color: colors.primary.text,
      bgColor: colors.primary.light
    }
  ];

  // Resource categories for the app
  const supportCategories = [
    {
      title: "Medical Support",
      icon: HeartPulse,
      description: "LGBTQIA+ friendly healthcare providers",
      resourceCount: "Doctors & Specialists"
    },
    {
      title: "Legal Assistance",
      icon: Gavel,
      description: "Legal professionals specialized in LGBTQIA+ rights",
      resourceCount: "Lawyers & Advisors"
    },
    {
      title: "Mental Health",
      icon: Brain,
      description: "Counselors experienced with gender and identity issues",
      resourceCount: "Therapists & Counselors"
    },
    {
      title: "Workplace Inclusion",
      icon: Users,
      description: "HR professionals promoting inclusive workplaces",
      resourceCount: "HR Consultants"
    },
    {
      title: "Education Resources",
      icon: Book,
      description: "Learning materials about gender and sexuality",
      resourceCount: "Educational Content"
    },
    {
      title: "Community Support",
      icon: HandHeart,
      description: "Peer support groups and community spaces",
      resourceCount: "Support Networks"
    }
  ];

  // Timeline of MCSU's legacy
  const timeline = [
    {
      year: "1914",
      title: "MCSU Founded",
      description: "Established by Maharani Chimnabai II to provide vocational skills to women",
      icon: Building
    },
    {
      year: "20th Century",
      title: "Women's Empowerment",
      description: "Decades of service focused on women's economic independence",
      icon: Leaf
    },
    {
      year: "21st Century",
      title: "Mission Expansion",
      description: "Broadened focus to include marginalized women, artisans, and LGBTQIA+ community",
      icon: Globe
    },
    {
      year: "2023-Present",
      title: "Gazra Initiatives",
      description: "Innovative projects for gender empowerment and inclusive opportunities",
      icon: Sparkles
    }
  ];

  // Workshop types
  const workshops = [
    {
      title: "Understanding Gender Identity",
      focus: "Basic Concepts",
      description: "An introduction to gender identity, expression, and the spectrum of experiences.",
      audience: "General Public",
      icon: GraduationCap
    },
    {
      title: "Creating Inclusive Environments",
      focus: "Practical Application",
      description: "Hands-on strategies for building spaces that welcome and affirm all gender identities.",
      audience: "Organizations & Institutions",
      icon: Building
    },
    {
      title: "Allyship in Action",
      focus: "Support Strategies",
      description: "Learn how to be an effective ally to transgender and gender-diverse individuals.",
      audience: "Allies & Supporters",
      icon: HandHeart
    }
  ];

  return (
    <div className="min-h-screen bg-[#FCFCFC]"> {/* Use a very light off-white background */}

      {/* Hero Section - Elegant design with background image */}
      <section className="relative py-28 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url("/images/background.jpg")', // <-- Replace Placeholder
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.8)'
          }}
        />

        {/* Elegant gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-primary-900/80 via-primary-800/70 to-secondary-800/60" />

        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-primary-400 to-secondary-300 -top-20 -right-20 opacity-20 blur-3xl" />
          <div className="absolute w-80 h-80 rounded-full bg-gradient-to-r from-accent-terracotta to-primary-300 bottom-0 -left-20 opacity-20 blur-3xl" />
        </div>

        <div className="relative container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-sm font-medium mb-6">
              <HandHeart className="w-4 h-4" />
              <span>MCSU & Gazra</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-display font-bold mb-8">
              <span className="text-white">Fostering</span>
              <span className="block mt-2 bg-gradient-to-r from-primary-300 to-secondary-200 bg-clip-text text-transparent">
                Inclusive Empowerment
              </span>
            </h1>

            <p className="text-xl text-white/90 mb-10 leading-relaxed">
              Building on MCSU's century-long legacy, Gazra leads innovative initiatives for the LGBTQIA+ community and marginalized groups, fostering inclusivity and economic independence.
            </p>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group inline-flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white/20 transition-all duration-300"
            >
              <span>Explore Our Initiatives</span>
              <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <ChevronRight className="w-4 h-4" />
              </span>
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* About Gazra at MCSU - Elegant design with subtle gradients */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Subtle decoration */}
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-bl from-primary-50 to-transparent opacity-70 rounded-bl-full"></div>
        <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-gradient-to-tr from-secondary-50 to-transparent opacity-70 rounded-tr-full"></div>

        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-700 rounded-full text-sm font-medium">
                <Star className="w-4 h-4" />
                <span>Our Heritage & Mission</span>
              </div>

              <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 leading-tight">
                Gazra: Advancing MCSU's Legacy of Empowerment
              </h2>

              <p className="text-gray-600 text-lg leading-relaxed">
                Founded in 1914 by Maharani Chimnabai II, Shri Maharani Chimnabai Stree Udyogalaya (MCSU) has evolved from its original focus on women's vocational training to embrace a broader mission of inclusivity.
              </p>

              <p className="text-gray-600 text-lg leading-relaxed">
                Today, Gazra represents MCSU's commitment to gender empowerment, creating safe spaces and opportunities for the LGBTQIA+ community while honoring the institution's century-old dedication to fostering independence and dignity.
              </p>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-white to-primary-50 rounded-2xl p-6 shadow-sm border border-primary-100/50">
                  <Building className="w-8 h-8 text-primary-600 mb-3" />
                  <div className="text-lg font-semibold text-gray-900">Est. 1914</div>
                  <div className="text-gray-600">MCSU Foundation</div>
                </div>

                <div className="bg-gradient-to-br from-white to-secondary-50 rounded-2xl p-6 shadow-sm border border-secondary-100/50">
                  <HandHeart className="w-8 h-8 text-secondary-600 mb-3" />
                  <div className="text-lg font-semibold text-gray-900">Gender Empowerment</div>
                  <div className="text-gray-600">Core Focus Area</div>
                </div>

                <div className="bg-gradient-to-br from-white to-amber-50 rounded-2xl p-6 shadow-sm border border-amber-100/50">
                  <Coffee className="w-8 h-8 text-amber-600 mb-3" />
                  <div className="text-lg font-semibold text-gray-900">August 2023</div>
                  <div className="text-gray-600">Gazra Cafe Launch</div>
                </div>

                <div className="bg-gradient-to-br from-white to-sky-50 rounded-2xl p-6 shadow-sm border border-sky-100/50">
                  <Smartphone className="w-8 h-8 text-sky-600 mb-3" />
                  <div className="text-lg font-semibold text-gray-900">Coming Soon</div>
                  <div className="text-gray-600">Gazra App</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative aspect-w-4 aspect-h-3 rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="/api/placeholder/800/600" // <-- Replace Placeholder
                  alt="MCSU Building"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/70 via-indigo-900/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <div className="text-sm font-medium mb-2 text-indigo-200">Historical Institution</div>
                  <div className="text-2xl font-bold">MCSU Campus, Vadodara</div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 rounded-xl border-2 border-indigo-100 -z-10"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-xl border-2 border-violet-100 -z-10"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Impact Stats - Elegant floating cards with gradients */}
      <section className="py-24 bg-gradient-to-b from-white to-indigo-50/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            {impactStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center group"
              >
                <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center ${stat.color} bg-white shadow-md border border-gray-100 group-hover:shadow-lg group-hover:scale-105 transition-all duration-300`}>
                  <stat.icon className="w-8 h-8" />
                </div>
                <div className="text-5xl font-bold bg-gradient-to-r from-indigo-700 to-violet-700 bg-clip-text text-transparent mb-3">{stat.number}</div>
                <div className="text-lg text-gray-700">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Initiatives Grid - Elegant cards with hover effects */}
      <section className="py-24 bg-white relative">
        {/* Decorative elements */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent"></div>
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent"></div>

        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              <span>Our Programs</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6">
              Gazra's Key Initiatives
            </h2>

            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Discover our innovative projects aimed at creating inclusive spaces, providing resources, and fostering understanding within the community.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {initiatives.map((initiative, index) => (
              <motion.div
                key={initiative.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`group relative bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer overflow-hidden ${
                  activeInitiative === initiative.id ? 'ring-2 ring-indigo-500 shadow-lg' : ''
                }`}
                onClick={() => setActiveInitiative(activeInitiative === initiative.id ? null : initiative.id)}
              >
                {/* Subtle background accent */}
                <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 -z-10"></div>

                {/* Status badge */}
                <span className={`absolute top-6 right-6 text-xs px-3 py-1.5 rounded-full ${
                  initiative.status === 'Completed'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50'
                    : 'bg-sky-50 text-sky-700 border border-sky-200/50'
                }`}>
                  {initiative.status}
                </span>

                {/* Icon with gradient background */}
                <div className={`w-16 h-16 mb-6 rounded-2xl flex items-center justify-center bg-gradient-to-br ${initiative.colors.gradient} text-white shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-300`}>
                  <initiative.icon className="w-8 h-8" />
                </div>

                {/* Category */}
                <span className={`inline-block px-3 py-1.5 ${initiative.colors.light} ${initiative.colors.text} text-xs rounded-full mb-4`}>
                  {initiative.category}
                </span>

                {/* Title and description */}
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{initiative.title}</h3>
                <p className="text-gray-600 mb-5">{initiative.description}</p>

                {/* Impact highlight */}
                <div className="flex items-center gap-2 text-sm font-medium bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent mb-5">
                  <Sparkles className="w-5 h-5 text-indigo-500" />
                  <span>{initiative.impact}</span>
                </div>

                {/* Expanded section */}
                {activeInitiative === initiative.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-6 pt-6 border-t border-gray-100"
                  >
                    <ul className="space-y-3 mb-6">
                      {initiative.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-gray-700">
                          <ChevronRight className={`w-5 h-5 mt-0.5 flex-shrink-0 ${initiative.colors.text}`} />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Stats grid */}
                    <div className="grid grid-cols-2 gap-3 mt-6">
                      {Object.entries(initiative.stats).map(([key, value], idx) => (
                        <div key={idx} className={`${initiative.colors.light} p-3 rounded-xl`}>
                          <div className="text-xs text-gray-500 capitalize mb-1">{key}</div>
                          <div className={`text-sm font-semibold ${initiative.colors.text}`}>{value}</div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Learn more button */}
                <div className="absolute bottom-6 right-6">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-8 h-8 rounded-full ${initiative.colors.light} ${initiative.colors.text} flex items-center justify-center transition-colors duration-300`}
                  >
                    {activeInitiative === initiative.id ?
                      <ChevronUp className="w-5 h-5" /> :
                      <ChevronRight className="w-5 h-5" />
                    }
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gazra App Focus - Elegant design with phone mockup */}
      <section className="py-24 bg-gradient-to-b from-white to-sky-50 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-gradient-to-br from-sky-200 to-blue-100 opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-gradient-to-tr from-indigo-200 to-sky-100 opacity-20 blur-3xl"></div>

        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left column - App info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-sky-50 text-sky-700 rounded-full text-sm font-medium">
                <Smartphone className="w-4 h-4" />
                <span>Coming Soon</span>
              </div>

              <h2 className="text-4xl font-display font-bold text-gray-900 leading-tight">
                Gazra App:
                <span className="block mt-1 bg-gradient-to-r from-sky-500 to-blue-500 bg-clip-text text-transparent">
                  One-Stop Resource Portal
                </span>
              </h2>

              <p className="text-gray-600 text-lg leading-relaxed">
                Connecting the LGBTQIA+ community with verified, supportive professionals across multiple categories. Our app ensures safe access to essential services through a carefully vetted network.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-3 p-4 bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-sky-100">
                  <div className="w-10 h-10 flex-shrink-0 rounded-full bg-gradient-to-br from-sky-500 to-blue-500 flex items-center justify-center text-white">
                    <Star className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Verified Professionals</div>
                    <div className="text-sm text-gray-600">Carefully screened providers</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-sky-100">
                  <div className="w-10 h-10 flex-shrink-0 rounded-full bg-gradient-to-br from-sky-500 to-blue-500 flex items-center justify-center text-white">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Safe Experience</div>
                    <div className="text-sm text-gray-600">Protected user privacy</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-sky-100">
                  <div className="w-10 h-10 flex-shrink-0 rounded-full bg-gradient-to-br from-sky-500 to-blue-500 flex items-center justify-center text-white">
                    <Map className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Location-Based</div>
                    <div className="text-sm text-gray-600">Find nearby resources</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-sky-100">
                  <div className="w-10 h-10 flex-shrink-0 rounded-full bg-gradient-to-br from-sky-500 to-blue-500 flex items-center justify-center text-white">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Community Reviews</div>
                    <div className="text-sm text-gray-600">Honest feedback system</div>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-8 py-4 bg-sky-600 hover:bg-sky-700 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300"
              >
                <span>Join the Waitlist</span>
                <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <ArrowRight className="w-4 h-4" />
                </span>
              </motion.button>
            </motion.div>

            {/* Right column - Phone mockup */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Phone mockup */}
              <div className="relative mx-auto w-[280px] h-[580px] bg-gray-900 rounded-[3rem] border-[14px] border-gray-900 shadow-xl overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-6 bg-gray-900 rounded-b-xl"></div>
                <div className="h-full bg-gradient-to-b from-sky-100 to-blue-50 overflow-y-auto">
                  {/* App UI mockup */}
                  <div className="p-4">
                    <div className="h-12 flex items-center justify-between mb-6">
                      <div className="font-bold text-lg text-gray-900">Gazra App</div>
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                        <User className="w-4 h-4 text-sky-600" />
                      </div>
                    </div>

                    <div className="relative h-10 mb-6">
                      <input
                        type="text"
                        className="w-full h-full rounded-xl bg-white pl-10 pr-4 shadow-sm border border-sky-100 text-sm"
                        placeholder="Search resources..."
                        disabled
                      />
                      <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    </div>

                    <h3 className="font-semibold text-gray-900 mb-3">Resource Categories</h3>

                    <div className="grid grid-cols-2 gap-3 mb-6">
                      {supportCategories.slice(0, 6).map((category, index) => (
                        <div
                          key={index}
                          className="bg-white rounded-xl p-4 shadow-sm flex flex-col items-center text-center"
                        >
                          <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 mb-2">
                            {React.createElement(category.icon, { className: "w-5 h-5" })}
                          </div>
                          <div className="font-medium text-sm text-gray-900 mb-1">{category.title}</div>
                          <div className="text-xs text-sky-600">{category.resourceCount}</div>
                        </div>
                      ))}
                    </div>

                    <h3 className="font-semibold text-gray-900 mb-3">Featured Professionals</h3>

                    <div className="space-y-3">
                      {[1, 2].map(i => (
                        <div key={i} className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gray-100"></div> {/* Placeholder avatar */}
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">Professional Name</div>
                            <div className="text-xs text-gray-500">Category • Location</div>
                            <div className="flex items-center mt-1">
                              {[1, 2, 3, 4, 5].map(star => (
                                <Star key={star} className="w-3 h-3 text-amber-400" fill="currentColor" />
                              ))}
                            </div>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center text-sky-600">
                            <ChevronRight className="w-4 h-4" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-8 -right-8 w-64 h-64 bg-gradient-to-br from-sky-500 to-blue-500 rounded-full blur-3xl opacity-10"></div>
              <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-gradient-to-tr from-indigo-500 to-sky-500 rounded-full blur-3xl opacity-10"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Gazra Cafe Spotlight - Elegant design with overlapping photos and testimonial */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-1/3 h-1/2 bg-gradient-to-br from-amber-50 to-transparent opacity-60"></div>
        <div className="absolute bottom-0 right-0 w-1/3 h-1/2 bg-gradient-to-tr from-amber-50 to-transparent opacity-60"></div>

        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            {/* Left column - Photos and testimonial */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative order-2 lg:order-1"
            >
              {/* Main image */}
              <div className="relative max-w-lg mx-auto">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0.8 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="relative rounded-2xl overflow-hidden shadow-2xl"
                >
                  <img
                    src="/api/placeholder/640/400" // <-- Replace Placeholder
                    alt="Gazra Cafe"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-amber-900/50 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md border border-white/20 rounded-full text-white text-sm font-medium mb-3">
                      <Coffee className="w-4 h-4" />
                      <span>Gazra Cafe</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white">Gujarat's First Queer-Led Cafe</h3>
                  </div>
                </motion.div>

                {/* Floating accent images */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="absolute -top-12 -right-12 w-32 h-32 rounded-xl overflow-hidden shadow-lg"
                >
                  <img src="/api/placeholder/128/128" alt="Cafe food" className="w-full h-full object-cover" /> {/* <-- Replace Placeholder */}
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="absolute -bottom-12 -left-12 w-40 h-32 rounded-xl overflow-hidden shadow-lg"
                >
                  <img src="/api/placeholder/160/128" alt="Cafe ambience" className="w-full h-full object-cover" /> {/* <-- Replace Placeholder */}
                </motion.div>
              </div>

              {/* Testimonial card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7 }}
                className="absolute bottom-4 right-4 md:bottom-8 md:right-0 bg-white rounded-xl p-6 shadow-xl max-w-xs"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img src="/api/placeholder/48/48" alt="Visitor" className="w-full h-full object-cover" /> {/* <-- Replace Placeholder */}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">Cafe Visitor</div>
                    <div className="text-xs text-amber-600">Community Member</div>
                  </div>
                </div>
                <p className="text-gray-600 italic text-sm">
                  "Gazra Cafe isn't just a place to eat - it's a space where I can truly be myself without judgment. The warmth and acceptance here are just as nourishing as the food."
                </p>
                <div className="mt-3 flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star key={star} className="w-4 h-4 text-amber-400" fill="currentColor" />
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* Right column - Cafe info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8 order-1 lg:order-2"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-full text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                <span>Spotlight Initiative</span>
              </div>

              <h2 className="text-4xl font-display font-bold text-gray-900 leading-tight">
                Gazra Cafe:
                <span className="block mt-1 bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                  Gujarat's First Queer-Led Cafe
                </span>
              </h2>

              <p className="text-gray-600 text-lg leading-relaxed">
                Launched on August 18, 2023, at the MCSU premises near Sursagar Lake in Vadodara, Gazra Cafe is a groundbreaking initiative that offers more than just culinary delights.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 flex-shrink-0 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Queer-Led Management</h3>
                    <p className="text-gray-600">The cafe is managed entirely by members of the LGBTQIA+ community, creating meaningful employment opportunities and a model for inclusive business practices.</p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 flex-shrink-0 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white">
                    <Coffee className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Regional Culinary Experience</h3>
                    <p className="text-gray-600">Specializing in authentic Gujarati and Maharashtrian cuisine, the cafe celebrates local culinary traditions while creating a unique dining experience.</p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 flex-shrink-0 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white">
                    <Heart className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Safe and Inclusive Space</h3>
                    <p className="text-gray-600">A welcoming environment where everyone can feel comfortable, respected, and valued regardless of their identity, fostering community connections.</p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 flex-shrink-0 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white">
                    <Building className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Royal Support</h3>
                    <p className="text-gray-600">Proud to have received the support of the Vadodara royal family, continuing MCSU's historic royal connections and bringing prestigious recognition to the initiative.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <span>Visit Gazra Cafe</span>
                  <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Add the other sections (Pink Line, Workshops, Legacy Timeline) here, using the formatted versions from above */}
      {/* ... Pink Line Project Preview Section ... */}
      {/* ... Workshops Preview Section ... */}
      {/* ... MCSU Legacy Timeline Section ... */}

      {/* Add Get Involved CTA and Newsletter sections if needed */}

    </div>
  );
};

export default InitiativesPage;