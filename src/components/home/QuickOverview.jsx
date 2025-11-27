import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Heart, Coffee, Users } from 'lucide-react';

const QuickOverview = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-primary-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary-100 rounded-full opacity-40 blur-2xl transform -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-secondary-100 rounded-full opacity-30 blur-2xl transform translate-x-1/3 translate-y-1/3"></div>
      <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-accent-sage/20 rounded-full opacity-50 blur-xl"></div>
      
      {/* Floating particles */}
      <div className="absolute top-1/4 right-1/4 w-6 h-6 bg-primary-300/40 rounded-full animate-float" style={{animationDelay: '0s'}}></div>
      <div className="absolute top-3/4 left-1/4 w-4 h-4 bg-secondary-300/40 rounded-full animate-float" style={{animationDelay: '1.5s'}}></div>
      <div className="absolute bottom-1/4 right-2/3 w-8 h-8 bg-accent-ochre/30 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section title with animated sparkle */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-400 to-primary-500 text-white rounded-full shadow-md mb-4 animate-pulse-slow">
            <Sparkles className="w-4 h-4 text-white" />
            <span className="font-medium text-sm">EXPLORE OUR WORLD</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-800 relative inline-block">
            <span className="relative z-10">Discover Gazra</span>
            <span className="absolute bottom-2 left-0 w-full h-3 bg-primary-200/60 -z-10 transform -rotate-1"></span>
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-neutral-600">
            Where community, support, and authentic connections come together
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
          {/* About Gazra Card */}
          <div className="relative group transition-all duration-500 hover:-translate-y-2">
            <div className="relative bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-neutral-200 hover:border-primary-300 hover:shadow-xl transition-all duration-300 overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute -right-12 -top-12 w-32 h-32 bg-primary-100 rounded-full opacity-40"></div>
                <div className="absolute -left-6 -bottom-6 w-24 h-24 bg-secondary-100 rounded-full opacity-30"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-primary-500 rounded-full flex items-center justify-center text-white shadow-md">
                      <Heart className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-display font-bold text-neutral-800 ml-4">
                      About Gazra
                    </h3>
                  </div>
                  
                  <div className="h-1 w-16 bg-gradient-to-r from-pink-500 to-primary-500 rounded mb-5"></div>
                  
                  <p className="text-base md:text-lg text-neutral-600 mb-6">
                    Gazra is more than just a community space - it's a movement towards creating an inclusive society where everyone can be their authentic selves. We provide a safe, welcoming environment for the LGBTQIA+ community to connect, grow, and celebrate their identity.
                  </p>
                  <p className="text-base md:text-lg text-neutral-600 mb-6">
                    Founded on principles of respect, compassion, and understanding, our mission is to foster a world where diversity is celebrated.
                  </p>
                  
                  {/* Animated button */}
                  <Link
                    to="/about"
                    className="inline-flex items-center px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 group"
                  >
                    <span>Read Our Story</span>
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
                </div>
            </div>
          </div>

          {/* Gazra Cafe Card */}
          <div className="relative group transition-all duration-500 hover:-translate-y-2">
            <div className="relative bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-neutral-200 hover:border-primary-300 hover:shadow-xl transition-all duration-300">
                <div className="relative mb-6 overflow-hidden rounded-xl group">
                  {/* Fancy image frame with inner border */}
                  <div className="absolute inset-0 border-4 border-white z-10 rounded-xl shadow-inner"></div>
                  
                  <img
                    src="/images/image-six.jpg"
                    alt="Gazra Cafe"
                    className="w-full h-56 object-cover transform transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <span className="text-lg font-bold">Experience Community</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-full flex items-center justify-center text-white shadow-md">
                    <Coffee className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-display font-bold text-neutral-800 ml-4">
                    Gazra Cafe
                  </h3>
                </div>
                
                <div className="h-1 w-16 bg-gradient-to-r from-orange-400 to-yellow-400 rounded mb-5"></div>
                
                <p className="text-base md:text-lg text-neutral-600 mb-6">
                  Our cafe is more than just a place to eat - it's a vibrant community hub where people can connect, share stories, and feel truly accepted. Enjoy great food and conversations in our welcoming space.
                </p>
                
                <div className="flex flex-wrap gap-3 mb-6">
                  <span className="px-3 py-1.5 bg-primary-50 text-primary-700 text-sm rounded-full border border-primary-200 flex items-center">
                    <Users className="w-3.5 h-3.5 mr-1" />
                    Inclusive Space
                  </span>
                  <span className="px-3 py-1.5 bg-secondary-50 text-secondary-700 text-sm rounded-full border border-secondary-200 flex items-center">
                    <Coffee className="w-3.5 h-3.5 mr-1" />
                    Delicious Food
                  </span>
                  <span className="px-3 py-1.5 bg-accent-ochre/10 text-accent-ochre text-sm rounded-full border border-accent-ochre/20 flex items-center">
                    <Sparkles className="w-3.5 h-3.5 mr-1" />
                    Community Events
                  </span>
                </div>
                
                {/* Animated button */}
                <Link
                  to="/cafe"
                  className="inline-flex items-center px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 group"
                >
                  <span>Explore Our Cafe</span>
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
            </div>
          </div>
        </div>
        
        {/* Added inspirational quote */}
        <div className="mt-16 text-center max-w-3xl mx-auto">
          <div className="relative">
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-6xl text-primary-300 opacity-50">"</div>
            <p className="text-xl md:text-2xl italic text-neutral-700 px-12">
              Celebrating diversity isn't just about tolerance—it's about embracing the beautiful tapestry of human experience that makes our community whole.
            </p>
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-6xl text-primary-300 opacity-50">"</div>
          </div>
          <p className="mt-6 text-lg font-medium text-primary-600">The Gazra Community</p>
        </div>
      </div>
    </section>
  );
};

export default QuickOverview;