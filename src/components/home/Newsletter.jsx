import { useState } from 'react';
import { Send, Mail, CheckCircle2 } from 'lucide-react';
import { useFirestore } from '../../hooks/useFirestore';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null); // 'success' | 'error' | null
  const { addDocument } = useFirestore('newsletter');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setSubmitting(true);
    setStatus(null);
    const result = await addDocument({ email: email.trim().toLowerCase(), source: 'home-newsletter' });
    setSubmitting(false);

    if (result.success) {
      setStatus('success');
      setEmail('');
    } else {
      setStatus('error');
    }
  };

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

          {status === 'success' ? (
            <div className="flex items-center justify-center gap-2 max-w-md mx-auto px-5 py-3 rounded-lg bg-green-500/15 border border-green-400/30 text-green-300 text-sm font-medium">
              <CheckCircle2 className="w-4 h-4" />
              You're subscribed! Thanks for joining us.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 px-5 py-3 rounded-lg border border-primary-200/30 bg-white/10 backdrop-blur-sm
                             text-white placeholder-primary-100/50 focus:outline-none focus:border-primary-300/60
                             transition-all duration-200 text-sm"
                  required
                  disabled={submitting}
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600
                             hover:bg-primary-700 disabled:opacity-60 text-white font-bold rounded-lg shadow-lg
                             transition-colors duration-200 whitespace-nowrap text-sm"
                >
                  {submitting ? 'Subscribing…' : 'Subscribe'}
                  <Send className="w-4 h-4" />
                </button>
              </div>
              {status === 'error' && (
                <p className="text-xs text-red-300">Something went wrong. Please try again.</p>
              )}
              <p className="text-xs text-primary-200/50">
                By subscribing, you agree to our Privacy Policy and consent to receive updates from Gazra.
              </p>
            </form>
          )}

          <div className="gazra-folk-chain max-w-xs mx-auto mt-8" />
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
