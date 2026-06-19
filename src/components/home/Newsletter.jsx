import { Send, Mail } from 'lucide-react';

const Newsletter = () => {
  return (
    <section className="py-20 bg-neutral-950 relative overflow-hidden">
      <img src="/images/image-three.jpg" alt=""
           className="absolute inset-0 w-full h-full object-cover opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-950/90 to-neutral-900/80" />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="gazra-folk-chain max-w-xs mx-auto mb-8" />

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded border border-primary-200/40
                          bg-[rgba(251,244,231,0.12)] text-xs font-bold uppercase tracking-wide
                          text-primary-200 backdrop-blur-md mb-5">
            <Mail className="w-3.5 h-3.5" />
            Stay Connected
          </div>

          <h2 className="font-display text-3xl sm:text-4xl font-black text-white mb-4 leading-tight">
            Stay Updated with<br />
            <span className="text-primary-300">Our Latest News & Events</span>
          </h2>
          <p className="text-primary-100/75 mb-8 leading-relaxed max-w-lg mx-auto">
            Join our newsletter and be part of our growing community. Get updates about events, initiatives, and stories that matter.
          </p>

          <form className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-5 py-3 rounded-lg border border-primary-200/30 bg-white/10 backdrop-blur-sm
                           text-white placeholder-primary-100/50 focus:outline-none focus:border-primary-300/60
                           transition-all duration-200 text-sm"
                required
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600
                           hover:bg-primary-700 text-white font-bold rounded-lg shadow-lg
                           transition-colors duration-200 whitespace-nowrap text-sm"
              >
                Subscribe
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-primary-200/50">
              By subscribing, you agree to our Privacy Policy and consent to receive updates from Gazra.
            </p>
          </form>

          <div className="gazra-folk-chain max-w-xs mx-auto mt-8" />
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
