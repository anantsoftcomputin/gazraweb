import { Link } from '../../lib/routerCompat';
import { ArrowRight, Sparkles, Heart, Coffee, Users } from 'lucide-react';

const QuickOverview = () => {
  return (
    <section className="relative overflow-hidden bg-[var(--gazra-paper)] py-16">
      <div className="heritage-rule absolute left-0 top-0 h-1.5 w-full" />
      <div className="absolute inset-x-0 top-10 h-px bg-neutral-900/10" />
      <div className="absolute inset-x-0 bottom-10 h-px bg-neutral-900/10" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section title with animated sparkle */}
        <div className="text-center mb-12">
          <div className="mb-4">
            <div className="inline-flex items-center gap-2 rounded border border-secondary-700/20 bg-secondary-700 px-4 py-2 text-white shadow-md animate-pulse-slow">
              <Sparkles className="w-4 h-4 text-white" />
              <span className="text-sm font-bold uppercase tracking-wide">Explore Our World</span>
            </div>
          </div>
          <h2 className="relative inline-block font-display text-3xl font-black text-neutral-900 md:text-4xl">
            <span className="relative z-10">Discover Gazra</span>
            <span className="absolute bottom-2 left-0 -z-10 h-3 w-full -rotate-1 bg-primary-300/50"></span>
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-neutral-600">
            Where community, support, and authentic connections come together
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
          {/* About Gazra Card */}
          <div className="relative group transition-all duration-500 hover:-translate-y-2">
            <div className="heritage-paper relative overflow-hidden rounded-lg border border-neutral-300 p-6 shadow-lg transition-all duration-300 hover:border-primary-500 hover:shadow-xl md:p-8">
                <div className="heritage-rule absolute left-0 top-0 h-1 w-full"></div>

                <div className="relative z-10">
                  <div className="flex items-center mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded border border-accent-terracotta/25 bg-accent-terracotta text-white shadow-md">
                      <Heart className="w-6 h-6" />
                    </div>
                    <h3 className="ml-4 font-display text-2xl font-black text-neutral-900 md:text-3xl">
                      About Gazra
                    </h3>
                  </div>
                  
                  <div className="mb-5 h-1 w-16 rounded bg-accent-terracotta"></div>
                  
                  <p className="text-base md:text-lg text-neutral-600 mb-6">
                    Gazra is more than just a community space - it&apos;s a movement towards creating an inclusive society where everyone can be their authentic selves. We provide a safe, welcoming environment for the LGBTQIA+ community to connect, grow, and celebrate their identity.
                  </p>
                  <p className="text-base md:text-lg text-neutral-600 mb-6">
                    Founded on principles of respect, compassion, and understanding, our mission is to foster a world where diversity is celebrated.
                  </p>
                  
                  {/* Animated button */}
                  <Link
                    to="/about"
                    className="group inline-flex items-center rounded-lg bg-primary-600 px-5 py-2.5 text-white shadow-md transition-all duration-300 hover:bg-primary-700 hover:shadow-lg"
                  >
                    <span>Read Our Story</span>
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
                </div>
            </div>
          </div>

          {/* Gazra Cafe Card */}
          <div className="relative group transition-all duration-500 hover:-translate-y-2">
            <div className="heritage-paper relative rounded-lg border border-neutral-300 p-6 shadow-lg transition-all duration-300 hover:border-primary-500 hover:shadow-xl md:p-8">
                <div className="heritage-rule absolute left-0 top-0 h-1 w-full"></div>
                <div className="relative mb-6 overflow-hidden rounded-lg group">
                  {/* Fancy image frame with inner border */}
                  <div className="absolute inset-0 border-4 border-white z-10 rounded-lg shadow-inner"></div>
                  
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
                  <div className="flex h-12 w-12 items-center justify-center rounded border border-secondary-700/25 bg-secondary-700 text-white shadow-md">
                    <Coffee className="w-6 h-6" />
                  </div>
                  <h3 className="ml-4 font-display text-2xl font-black text-neutral-900 md:text-3xl">
                    Gazra Cafe
                  </h3>
                </div>
                
                <div className="mb-5 h-1 w-16 rounded bg-secondary-700"></div>
                
                <p className="text-base md:text-lg text-neutral-600 mb-6">
                  Our cafe is more than just a place to eat - it&apos;s a vibrant community hub where people can connect, share stories, and feel truly accepted. Enjoy great food and conversations in our welcoming space.
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
                  className="group inline-flex items-center rounded-lg bg-primary-600 px-5 py-2.5 text-white shadow-md transition-all duration-300 hover:bg-primary-700 hover:shadow-lg"
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
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-6xl text-primary-300 opacity-50">&quot;</div>
            <p className="text-xl md:text-2xl italic text-neutral-700 px-12">
              Celebrating diversity isn&apos;t just about tolerance - it&apos;s about embracing the beautiful tapestry of human experience that makes our community whole.
            </p>
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-6xl text-primary-300 opacity-50">&quot;</div>
          </div>
          <p className="mt-6 text-lg font-medium text-primary-600">The Gazra Community</p>
        </div>
      </div>
    </section>
  );
};

export default QuickOverview;
