import { useState } from 'react';
import { Link } from '../../lib/routerCompat';
import { ArrowRight, CheckCircle2, Heart, Mail, MapPin, Phone } from 'lucide-react';
import { FaFacebook, FaInstagram } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { useFirestore } from '../../hooks/useFirestore';

const footerGroups = [
  {
    title: 'Explore',
    links: [
      { label: 'About Us', to: '/about' },
      { label: 'Events', to: '/events' },
      { label: 'Gallery', to: '/gallery' },
      { label: 'Volunteer', to: '/volunteer' }
    ]
  },
  {
    title: 'Programs',
    links: [
      { label: 'Gazra Mitra', to: 'https://mitra.gazra.org', external: true },
      { label: 'Gazra Cafe', to: '/cafe' },
      { label: 'Gazra Skill Hub', to: '/gazra-skills' },
      { label: 'Gazra Support Fund', to: '/gazra-support' }
    ]
  }
];

const Footer = () => {
  const year = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null); // 'success' | 'error' | null
  const { addDocument } = useFirestore('newsletter');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setSubmitting(true);
    setStatus(null);
    const result = await addDocument({ email: email.trim().toLowerCase(), source: 'footer' });
    setSubmitting(false);

    if (result.success) {
      setStatus('success');
      setEmail('');
    } else {
      setStatus('error');
    }
  };

  return (
    <footer className="relative overflow-hidden border-t border-neutral-900/10 bg-[var(--gazra-paper)] text-neutral-900">
      <div className="absolute inset-0 heritage-paper opacity-70" />
      <div className="gazra-rainbow-line relative h-1" />

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid gap-8 lg:grid-cols-[1.35fr_0.8fr_0.8fr_1.1fr]">
          <div>
            <Link to="/" className="inline-flex items-center gap-3">
              <img src="/logo.svg" alt="Gazra Logo" className="h-14 w-14 object-contain" />
              <div>
                <div className="font-display text-2xl font-black text-primary-700">Project Gazra</div>
                <div className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-accent-terracotta">Stories & community</div>
              </div>
            </Link>

            <p className="mt-5 max-w-md text-sm leading-6 text-neutral-700">
              A warm, inclusive space for conversations, gatherings, learning, food, and belonging in Vadodara.
            </p>

            {status === 'success' ? (
              <div className="mt-6 flex max-w-md items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-2.5 text-sm font-medium text-green-700">
                <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                You're subscribed! Thanks for joining us.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="mt-6 flex max-w-md flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="min-h-11 flex-1 rounded-lg border border-neutral-900/15 bg-primary-50/70 px-4 text-sm outline-none transition placeholder:text-neutral-500 focus:border-primary-600 focus:ring-2 focus:ring-primary-200"
                  aria-label="Email address"
                  required
                  disabled={submitting}
                />
                <button type="submit" disabled={submitting} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary-600 px-5 text-sm font-bold text-white shadow-md transition hover:bg-primary-700 disabled:opacity-60">
                  {submitting ? 'Following…' : 'Follow'}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            )}
            {status === 'error' && (
              <p className="mt-2 text-xs text-red-600">Something went wrong. Please try again.</p>
            )}
          </div>

          {footerGroups.map((group) => (
            <div key={group.title}>
              <h3 className="font-display text-lg font-black text-neutral-900">{group.title}</h3>
              <ul className="mt-4 space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a href={link.to} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-2 text-sm font-semibold text-neutral-700 transition hover:text-accent-terracotta">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary-600 transition group-hover:bg-accent-terracotta" />
                        {link.label}
                      </a>
                    ) : (
                      <Link to={link.to} className="group inline-flex items-center gap-2 text-sm font-semibold text-neutral-700 transition hover:text-accent-terracotta">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary-600 transition group-hover:bg-accent-terracotta" />
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="font-display text-lg font-black text-neutral-900">Visit Us</h3>
            <ul className="mt-4 space-y-4 text-sm text-neutral-700">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent-terracotta" />
                <span>Gazra Cafe, Shri Maharani Chimnabai Stree Udyogalaya, Opp. Sursagar, Mandvi, Vadodara, Gujarat 390001</span>
              </li>
              <li className="flex gap-3">
                <Mail className="h-5 w-5 flex-shrink-0 text-accent-terracotta" />
                <a href="mailto:support@gazra.org" className="font-semibold hover:text-accent-terracotta">support@gazra.org</a>
              </li>
              <li className="flex gap-3">
                <Phone className="h-5 w-5 flex-shrink-0 text-accent-terracotta" />
                <a href="tel:+918200306871" className="font-semibold hover:text-accent-terracotta">82003 06871</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="heritage-textile mt-10 h-2" />

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-semibold text-neutral-600">
          <Link to="/terms-and-conditions" className="hover:text-accent-terracotta transition">Terms & Conditions</Link>
          <Link to="/privacy-policy" className="hover:text-accent-terracotta transition">Privacy Policy</Link>
          <Link to="/refund-policy" className="hover:text-accent-terracotta transition">Refund Policy</Link>
        </div>

        <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-neutral-900/10 pt-6 text-center text-sm text-neutral-700 md:flex-row">
          <p>© {year} Project Gazra. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <a href="https://www.facebook.com/chimnabaiudyogalaya/?profile_tab_item_selected=about&_rdr" target="_blank" rel="noopener noreferrer" className="rounded border border-neutral-900/10 bg-primary-50 p-2 text-primary-700 transition hover:bg-primary-600 hover:text-white" aria-label="Facebook">
              <FaFacebook className="h-4 w-4" />
            </a>
            <a href="https://www.instagram.com/chimnabai_udyogalaya/?hl=en" target="_blank" rel="noopener noreferrer" className="rounded border border-neutral-900/10 bg-primary-50 p-2 text-primary-700 transition hover:bg-primary-600 hover:text-white" aria-label="Instagram">
              <FaInstagram className="h-4 w-4" />
            </a>
            <a href="https://g.co/kgs/uX2R5uP" target="_blank" rel="noopener noreferrer" className="rounded border border-neutral-900/10 bg-primary-50 p-2 transition hover:bg-primary-100" aria-label="Google">
              <FcGoogle className="h-4 w-4" />
            </a>
          </div>
          <p className="inline-flex items-center gap-1">
            Made with <Heart className="h-4 w-4 fill-accent-terracotta text-accent-terracotta" /> by the community
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
