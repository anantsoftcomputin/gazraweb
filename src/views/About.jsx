import React from 'react';
import { ArrowRight, Heart, Users, Shield, Coffee, Clock, BookOpen, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <div className="w-full">
      {/* Hero Section with Animated Background - Reduced Height */}
      <section className="relative min-h-[70vh] overflow-hidden bg-gradient-to-b from-white via-primary-50/50 to-white">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-[800px] h-[800px] -top-[400px] -left-[400px] bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"></div>
          <div className="absolute w-[800px] h-[800px] -bottom-[400px] -right-[400px] bg-accent-terracotta/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-100/20 via-transparent to-accent-ochre/20 animate-gradient"></div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-4 h-4 bg-primary-200 rounded-full animate-float"></div>
          <div className="absolute top-40 right-20 w-6 h-6 bg-accent-terracotta/30 rounded-full animate-float-delay-1"></div>
          <div className="absolute bottom-32 left-1/4 w-8 h-8 bg-accent-ochre/30 rounded-full animate-float-delay-2"></div>
          <div className="absolute top-1/3 right-1/3 w-5 h-5 bg-accent-sage/30 rounded-full animate-float-delay-3"></div>
        </div>

        {/* Main Content - Reduced Padding */}
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-16">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            {/* Text Content - Spans 7 columns */}
            <div className="lg:col-span-7 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-start space-y-4"
              >
                <span className="inline-flex items-center px-3 py-1.5 bg-white/80 backdrop-blur-sm 
                  border-2 border-primary-100 rounded-full text-primary-600 text-sm font-medium">
                  <Heart className="w-4 h-4 mr-2" strokeWidth={3} />
                  Welcome to Gazra
                </span>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight">
                  <span className="block text-neutral-900">Embracing</span>
                  <span className="block mt-2 bg-gradient-to-r from-primary-600 via-accent-sage to-accent-terracotta 
                    bg-clip-text text-transparent">
                    Inclusion & Dignity
                  </span>
                  <span className="block mt-2 text-neutral-900">Since 1914</span>
                </h1>

                <p className="text-lg text-neutral-600 max-w-xl">
                  An initiative by Shri Maharani Chimnabai Stree Udyogalaya, creating 
                  safe spaces, fostering understanding, and celebrating diversity in our vibrant community.
                </p>

                <div className="flex flex-wrap gap-6 pt-4">
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href="#mission"
                    className="relative group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-accent-terracotta 
                      rounded-2xl blur-sm opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative inline-flex items-center px-8 py-4 bg-white rounded-2xl
                      shadow-soft group-hover:shadow-lg transition-all duration-300">
                      <span className="bg-gradient-to-r from-primary-600 to-accent-terracotta bg-clip-text text-transparent 
                        font-semibold">Explore Our Mission</span>
                      <ArrowRight className="ml-2 w-5 h-5 text-primary-500" />
                    </div>
                  </motion.a>

                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href="#story"
                    className="inline-flex items-center px-8 py-4 border-2 border-primary-200 
                      text-primary-600 rounded-2xl hover:bg-primary-50 transition-all duration-300"
                  >
                    Our Story
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </motion.a>
                </div>
              </motion.div>
            </div>

            {/* Logo and Design Elements - Spans 5 columns - Reduced Size */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative">
                {/* Background Circles - Reduced Size */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-[300px] h-[300px] bg-gradient-to-r from-primary-100 to-accent-sage/30 
                    rounded-full animate-spin-slow opacity-30"></div>
                  <div className="absolute w-[220px] h-[220px] bg-gradient-to-r from-accent-ochre/30 to-primary-100 
                    rounded-full animate-reverse-spin opacity-30"></div>
                </div>

                {/* Logo Container - Reduced Padding */}
                <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-soft 
                  border border-primary-100 transform hover:scale-105 transition-transform duration-300">
                  <img 
                    src="/images/image7.webp"
                    alt="Gazra Logo"
                    className="w-122 h-72 mx-auto relative z-10 object-contain"
                  />
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-6 -right-6 w-12 h-12 bg-primary-100 rounded-full 
                  animate-bounce-soft"></div>
                <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-accent-terracotta/30 rounded-full 
                  animate-bounce-soft delay-100"></div>
              </div>

              <div>
                <img 
                  src="https://gazra.org/logo.png"
                  alt="Gazra Logo"
                  className="w-36 h-36 mx-auto relative z-10 object-contain"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Legacy Section */}
      <section id="story" className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-primary-50 border border-primary-100 rounded-full text-primary-600 text-sm font-medium mb-4">
              Our Legacy
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-6">
              A Century of Empowerment & Service
            </h2>
            <p className="text-lg text-neutral-600">
              Founded in 1914, Shri Maharani Chimnabai Stree Udyogalaya has been at the forefront of social reform and women's empowerment, adapting to changing times while preserving our core values.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-200 to-accent-sage/30 rounded-3xl transform rotate-3 group-hover:rotate-6 transition-transform duration-300"></div>
              <div className="relative rounded-3xl shadow-lg bg-white p-8 flex items-center justify-center min-h-[600px]">
                <img
                  src="/images/image13.png"
                  alt="Historical photo of Shri Maharani Chimnabai Stree Udyogalaya"
                  className="w-full h-auto max-h-[650px] object-contain"
                />
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-neutral-800">Continuing the Vision of Maharani Chimnabai</h3>
              <p className="text-neutral-600">
                What began as a pioneering institution for women's education and economic independence has evolved into a multifaceted organization addressing the needs of diverse communities. Throughout our journey, we have remained committed to the founding principles of dignity, equality, and empowerment.
              </p>
              <p className="text-neutral-600">
                Today, under Project Gazra, we extend this legacy by creating inclusive spaces like the Gazra Cafe that embraces all individuals regardless of gender identity, sexual orientation, or background. The same spirit of social reform that guided our founding now inspires our commitment to LGBTQIA+ inclusion and support.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="flex items-center gap-3 p-4 bg-primary-50 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-neutral-800">100+</h4>
                    <p className="text-sm text-neutral-600">Years of Service</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-primary-50 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-neutral-800">Countless</h4>
                    <p className="text-sm text-neutral-600">Lives Touched</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section id="mission" className="py-20 bg-gradient-to-b from-white to-primary-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-primary-50 border border-primary-100 rounded-full text-primary-600 text-sm font-medium mb-4">
              Our Purpose
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-6">
              Mission & Vision
            </h2>
            <p className="text-lg text-neutral-600">
              Guided by principles of compassion, inclusion, and dignity, we strive to create lasting positive change in our community.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-stretch">
            {/* Mission Card */}
            <div className="group relative h-full">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-100 to-accent-sage/30 rounded-2xl transform rotate-1 transition-transform group-hover:rotate-2"></div>
              <div className="relative h-full p-8 bg-white rounded-2xl shadow-soft border border-primary-100/50 hover:shadow-lg transition-all duration-300">
                <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center mb-6">
                  <Heart className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-4">Our Mission</h3>
                <p className="text-neutral-600 mb-4">
                  To create safe, inclusive spaces where individuals of all genders, orientations, and backgrounds can find community, support, and opportunities for growth. We strive to foster understanding, advocate for equality, and provide resources that empower marginalized communities to thrive.
                </p>
                <p className="text-neutral-600">
                  Through Gazra Cafe and our various initiatives, we aim to build bridges of understanding, challenge societal prejudices, and cultivate a culture where diversity is celebrated and every individual is treated with dignity and respect.
                </p>
              </div>
            </div>

            {/* Vision Card */}
            <div className="group relative h-full">
              <div className="absolute inset-0 bg-gradient-to-r from-accent-ochre/30 to-primary-100 rounded-2xl transform -rotate-1 transition-transform group-hover:-rotate-2"></div>
              <div className="relative h-full p-8 bg-white rounded-2xl shadow-soft border border-primary-100/50 hover:shadow-lg transition-all duration-300">
                <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center mb-6">
                  <BookOpen className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-4">Our Vision</h3>
                <p className="text-neutral-600 mb-4">
                  We envision a world where every individual, regardless of their gender identity or sexual orientation, can live authentically without fear of discrimination or prejudice. A society where diverse identities are not merely tolerated but valued as essential threads in our social fabric.
                </p>
                <p className="text-neutral-600">
                  By continuing the legacy of Shri Maharani Chimnabai Stree Udyogalaya, we aspire to be a catalyst for social transformation, creating ripples of acceptance and equality that extend far beyond our physical spaces, ultimately contributing to a more just and compassionate society.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-primary-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left side: Values Cards */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900">
                  Our Core Values
                </h2>
                <p className="text-lg text-neutral-600">
                  These principles guide every initiative we undertake and every interaction we have.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                {/* Value Card 1 */}
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-100 to-accent-terracotta/20 rounded-2xl transform rotate-1 transition-transform group-hover:rotate-2"></div>
                  <div className="relative p-6 bg-white rounded-2xl shadow-soft border border-primary-100/50 hover:shadow-lg transition-all duration-300">
                    <Heart className="w-8 h-8 text-primary-500 mb-4" />
                    <h3 className="text-xl font-bold text-neutral-900 mb-2">Inclusivity</h3>
                    <p className="text-neutral-600">Embracing diversity and creating spaces where everyone feels welcomed, valued, and represented.</p>
                  </div>
                </div>

                {/* Value Card 2 */}
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-accent-ochre/20 to-primary-100 rounded-2xl transform -rotate-1 transition-transform group-hover:-rotate-2"></div>
                  <div className="relative p-6 bg-white rounded-2xl shadow-soft border border-primary-100/50 hover:shadow-lg transition-all duration-300">
                    <Users className="w-8 h-8 text-primary-500 mb-4" />
                    <h3 className="text-xl font-bold text-neutral-900 mb-2">Community</h3>
                    <p className="text-neutral-600">Building strong connections and support networks that foster belonging and mutual care.</p>
                  </div>
                </div>

                {/* Value Card 3 */}
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-100 to-accent-sage/20 rounded-2xl transform rotate-1 transition-transform group-hover:rotate-2"></div>
                  <div className="relative p-6 bg-white rounded-2xl shadow-soft border border-primary-100/50 hover:shadow-lg transition-all duration-300">
                    <Shield className="w-8 h-8 text-primary-500 mb-4" />
                    <h3 className="text-xl font-bold text-neutral-900 mb-2">Safe Space</h3>
                    <p className="text-neutral-600">Providing secure environments for authentic expression free from judgment or discrimination.</p>
                  </div>
                </div>

                {/* Value Card 4 */}
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-accent-sage/20 to-accent-terracotta/20 rounded-2xl transform -rotate-1 transition-transform group-hover:-rotate-2"></div>
                  <div className="relative p-6 bg-white rounded-2xl shadow-soft border border-primary-100/50 hover:shadow-lg transition-all duration-300">
                    <Coffee className="w-8 h-8 text-primary-500 mb-4" />
                    <h3 className="text-xl font-bold text-neutral-900 mb-2">Connection</h3>
                    <p className="text-neutral-600">Fostering meaningful relationships and understanding across diverse perspectives.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side: Image */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-200 to-accent-ochre/20 rounded-3xl transform rotate-3 group-hover:rotate-6 transition-transform duration-300"></div>
              <img
                src="/images/image9.webp"
                alt="Community gathering"
                className="relative rounded-3xl shadow-lg object-cover w-full h-[600px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Gazra Cafe Section */}
      <section className="py-20 bg-gradient-to-b from-white to-primary-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-primary-50 border border-primary-100 rounded-full text-primary-600 text-sm font-medium mb-4">
              Our Initiative
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-6">
              Gazra Cafe: A Home Away From Home
            </h2>
            <p className="text-lg text-neutral-600">
              More than just a cafe - it's a sanctuary where stories are shared, friendships are forged, and community thrives under the larger mission of Shri Maharani Chimnabai Stree Udyogalaya.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <div className="group relative bg-white rounded-2xl shadow-soft border border-primary-100/50 overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src="/images/image10.webp"
                  alt="Cafe Space"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-neutral-900 mb-2">Safe Space</h3>
                <p className="text-neutral-600 mb-4">A welcoming environment where you can be yourself without judgment, embracing the core values that have guided our institution since 1914.</p>
                <div className="inline-flex items-center text-primary-600 font-medium hover:text-primary-700">
                  Learn More
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </div>
            </div>

            {/* Feature Card 2 */}
            <div className="group relative bg-white rounded-2xl shadow-soft border border-primary-100/50 overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src="/images/image-four.jpg"
                  alt="Community Events"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-neutral-900 mb-2">Community Events</h3>
                <p className="text-neutral-600 mb-4">Regular meetups, workshops, and cultural events that bring people together and foster understanding across diverse perspectives.</p>
                <div className="inline-flex items-center text-primary-600 font-medium hover:text-primary-700">
                  View Events
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </div>
            </div>

            {/* Feature Card 3 */}
            <div className="group relative bg-white rounded-2xl shadow-soft border border-primary-100/50 overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src="/images/food-image.webp"
                  alt="Cafe Menu"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-neutral-900 mb-2">Delicious Offerings</h3>
                <p className="text-neutral-600 mb-4">Enjoy our carefully curated menu of drinks and snacks in a cozy atmosphere that continues our tradition of hospitality and care.</p>
                <div className="inline-flex items-center text-primary-600 font-medium hover:text-primary-700">
                  See Menu
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center mt-12">
            <a
              href="/cafe"
              className="inline-flex items-center px-8 py-4 bg-white border-2 border-primary-200 text-primary-600 rounded-2xl shadow-soft hover:bg-primary-50 hover:border-primary-300 transition-all duration-300 font-medium"
            >
              Visit Gazra Cafe
              <ArrowRight className="ml-2 w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Join Us CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-50 to-accent-sage/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative max-w-4xl mx-auto bg-white rounded-3xl shadow-medium overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-accent-terracotta to-accent-ochre"></div>
            <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12">
              <div className="space-y-6">
                <h2 className="text-3xl font-display font-bold text-neutral-900">Join Our Community</h2>
                <p className="text-neutral-600">
                  Be part of a movement that celebrates diversity, fosters inclusion, and creates positive change. 
                  Whether you're looking for support, connection, or ways to contribute, there's a place for you at Gazra.
                </p>
                <div className="flex flex-wrap gap-4">
                  <a href="/volunteer" className="inline-flex items-center px-6 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors duration-300">
                    Volunteer With Us
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </a>
                  <a href="/events" className="inline-flex items-center px-6 py-3 border border-primary-200 text-primary-600 rounded-xl hover:bg-primary-50 transition-colors duration-300">
                    Attend Events
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </a>
                </div>
              </div>
              <div className="relative">
                <img 
                  src="/images/join-community.jpg" 
                  alt="Join our community" 
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;