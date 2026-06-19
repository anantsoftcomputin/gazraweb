import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Mail, Phone, Clock, Send, MessageSquare, ArrowRight } from 'lucide-react';
import PhoneVerification from '../components/shared/PhoneVerification';

const fadeUp = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5 } };

const GAZRA_ADDRESS = 'Gazra Cafe, Shri Maharani Chimnabai Stree Udyogalaya, Opp. Sursagar, Mandvi, Vadodara, Gujarat 390001';
const GAZRA_PHONE   = '+91 82003 06871';
const GAZRA_EMAIL   = 'hello@gazra.org';
const MAPS_URL      = 'https://maps.google.com/?q=Shri+Maharani+Chimnabai+Stree+Udyogalaya+Vadodara';
const MAPS_EMBED    = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3691.548806266471!2d73.19829807507117!3d22.29503642968911!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395fc5bbe3f0607b%3A0x33ac28417835816d!2sShri%20Maharani%20Chimnabai%20Stree%20Udyogalaya!5e0!3m2!1sen!2sin!4v1716886941234!5m2!1sen!2sin';

/* ─── Info card ─────────────────────────────────────────────────────── */
const InfoCard = ({ icon: Icon, title, children, href, delay = 0 }) => {
  const inner = (
    <div className="flex items-start gap-4 p-5 bg-[var(--gazra-paper)] border border-[rgba(184,121,44,0.2)]
                    rounded-lg h-full hover:shadow-md hover:border-primary-300/50 transition-all duration-300">
      <div className="w-11 h-11 flex-shrink-0 rounded bg-primary-600 flex items-center justify-center">
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="min-w-0">
        <h3 className="font-bold text-neutral-900 text-sm mb-1">{title}</h3>
        <div className="text-sm text-neutral-600 leading-relaxed">{children}</div>
      </div>
    </div>
  );
  return (
    <motion.div {...fadeUp} transition={{ duration: 0.5, delay }}>
      {href ? <a href={href} target="_blank" rel="noopener noreferrer" className="block h-full">{inner}</a> : inner}
    </motion.div>
  );
};

/* ─── Form field ────────────────────────────────────────────────────── */
const Field = ({ id, label, type = 'text', placeholder, value, onChange, textarea }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-semibold text-neutral-700 mb-1.5">{label}</label>
    {textarea ? (
      <textarea id={id} name={id} value={value} onChange={onChange} rows={4} placeholder={placeholder}
        className="w-full px-4 py-3 rounded-lg border border-[rgba(184,121,44,0.3)]
                   bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-100
                   transition-all duration-200 text-sm placeholder-neutral-400 outline-none resize-none" />
    ) : (
      <input type={type} id={id} name={id} value={value} onChange={onChange} placeholder={placeholder}
        className="w-full px-4 py-3 rounded-lg border border-[rgba(184,121,44,0.3)]
                   bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-100
                   transition-all duration-200 text-sm placeholder-neutral-400 outline-none" />
    )}
  </div>
);

/* ─── Main Contact page ─────────────────────────────────────────────── */
const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!phoneVerified) { alert('Please verify your phone number before submitting.'); return; }
    setSubmitted(true);
    setTimeout(() => {
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
      setSubmitted(false);
      setPhoneVerified(false);
    }, 4000);
  };

  return (
    <div className="w-full">

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative min-h-[50vh] flex items-center bg-neutral-950 overflow-hidden">
        <img src="/images/image7.webp" alt=""
             className="absolute inset-0 w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/95 via-neutral-950/70 to-neutral-950/30" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[var(--gazra-paper)] to-transparent" />

        <div className="relative z-10 container mx-auto px-4 sm:px-8 py-20">
          <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}
                      className="max-w-xl">
            <div className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded border border-primary-200/40
                            bg-[rgba(251,244,231,0.88)] text-xs font-bold uppercase tracking-wide
                            text-accent-terracotta shadow-lg backdrop-blur-md">
              <MessageSquare className="w-3.5 h-3.5" />
              We're here to help
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight
                           drop-shadow-[0_4px_18px_rgba(0,0,0,0.55)]">
              Connect with<br /><span className="text-primary-300">Gazra</span>
            </h1>
            <p className="mt-4 text-primary-100/80 text-base sm:text-lg leading-relaxed">
              Whether you have a question, feedback, or just want to say hello — we're all ears.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Contact info cards ───────────────────────────────────── */}
      <section className="bg-[var(--gazra-paper)] py-14">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <InfoCard icon={MapPin} title="Visit Us" href={MAPS_URL} delay={0}>
              <p className="mb-1.5">{GAZRA_ADDRESS}</p>
              <span className="inline-flex items-center text-primary-600 text-xs font-semibold">
                Get Directions <ArrowRight className="w-3 h-3 ml-1" />
              </span>
            </InfoCard>
            <InfoCard icon={Mail} title="Email Us" href={`mailto:${GAZRA_EMAIL}`} delay={0.08}>
              <p className="break-all mb-1.5">{GAZRA_EMAIL}</p>
              <span className="inline-flex items-center text-primary-600 text-xs font-semibold">
                Send an Email <ArrowRight className="w-3 h-3 ml-1" />
              </span>
            </InfoCard>
            <InfoCard icon={Phone} title="Call Us" href={`tel:${GAZRA_PHONE.replace(/\s/g, '')}`} delay={0.16}>
              <p className="mb-1.5">{GAZRA_PHONE}</p>
              <span className="inline-flex items-center text-primary-600 text-xs font-semibold">
                Call Now <ArrowRight className="w-3 h-3 ml-1" />
              </span>
            </InfoCard>
            <InfoCard icon={Clock} title="Opening Hours" delay={0.24}>
              <p>Mon – Sun</p>
              <p className="font-semibold text-neutral-800">9:00 AM – 10:00 PM</p>
              <p className="text-xs text-neutral-400 mt-1">Kitchen closes at 9:30 PM</p>
            </InfoCard>
          </div>
        </div>
      </section>

      {/* ── toran stripe divider ──────────────────────────────────── */}
      <div className="h-[2px]" style={{ background: 'linear-gradient(90deg,transparent,#9F2F28,#D9A13A,#2F6B45,#D9A13A,#9F2F28,transparent)' }} />

      {/* ── Form & Map ───────────────────────────────────────────── */}
      <section className="bg-[var(--gazra-paper)] py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">

            {/* Contact Form */}
            <motion.div {...fadeUp}
              className="bg-white border border-[rgba(184,121,44,0.15)] rounded-lg overflow-hidden shadow-lg">
              {/* Toran top accent */}
              <div className="h-[4px]"
                   style={{ background: 'linear-gradient(90deg,#9F2F28,#D9A13A,#2F6B45,#D9A13A,#9F2F28)' }} />
              <div className="p-7 sm:p-8">
                <h2 className="font-display text-2xl font-bold text-neutral-900 mb-6">Send us a Message</h2>

                {submitted ? (
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    className="text-center py-12 bg-primary-50 rounded-lg border border-primary-100">
                    <div className="w-14 h-14 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Send className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-display text-xl font-bold text-primary-700 mb-2">Message Sent!</h3>
                    <p className="text-neutral-600 text-sm">We'll get back to you as soon as possible.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field id="name"  label="Your Name"      placeholder="Amita Patel"
                             value={form.name}  onChange={handleChange} />
                      <Field id="email" label="Email Address"  type="email" placeholder="you@email.com"
                             value={form.email} onChange={handleChange} />
                    </div>
                    <Field id="phone" label="Phone Number" type="tel" placeholder="98765 43210"
                           value={form.phone} onChange={handleChange} />

                    <div className="bg-primary-50 border border-primary-100 rounded-lg p-4">
                      <PhoneVerification
                        phoneNumber={form.phone}
                        onPhoneChange={(phone) => setForm((p) => ({ ...p, phone }))}
                        onVerified={() => setPhoneVerified(true)}
                      />
                    </div>

                    <Field id="subject" label="Subject" placeholder="How can we help you?"
                           value={form.subject} onChange={handleChange} />
                    <Field id="message" label="Your Message"
                           placeholder="Tell us more about your inquiry..."
                           value={form.message} onChange={handleChange} textarea />

                    <button type="submit"
                      className="w-full inline-flex items-center justify-center gap-2 bg-primary-600
                                 hover:bg-primary-700 text-white font-semibold px-6 py-3 rounded-lg
                                 shadow-md hover:shadow-lg transition-all duration-200">
                      Send Message
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                )}
              </div>
            </motion.div>

            {/* Location & Map */}
            <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.1 }} className="space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded border border-primary-200/60
                                bg-[rgba(251,244,231,0.92)] text-xs font-bold uppercase tracking-wide
                                text-accent-terracotta mb-4">
                  Visit Us
                </div>
                <h2 className="font-display text-3xl font-black text-neutral-900">
                  Come Experience<br />
                  <span className="text-primary-600">The Magic</span>
                </h2>
              </div>

              <div className="space-y-4">
                {[
                  { icon: MapPin, label: 'Location', body: GAZRA_ADDRESS, link: { href: MAPS_URL, text: 'Get Directions' } },
                  { icon: Clock,  label: 'Hours',    body: 'Monday – Sunday: 9:00 AM – 10:00 PM', sub: 'Kitchen closes at 9:30 PM' },
                  { icon: Phone,  label: 'Phone',    body: GAZRA_PHONE, link: { href: `tel:${GAZRA_PHONE.replace(/\s/g,'')}`, text: 'Call Now' } },
                ].map(({ icon: Icon, label, body, sub, link }) => (
                  <div key={label} className="flex items-start gap-4">
                    <div className="w-10 h-10 flex-shrink-0 rounded bg-primary-600 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-neutral-900 text-sm">{label}</h4>
                      <p className="text-neutral-600 text-sm">{body}</p>
                      {sub && <p className="text-neutral-500 text-xs mt-0.5">{sub}</p>}
                      {link && (
                        <a href={link.href} target="_blank" rel="noopener noreferrer"
                           className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600
                                      hover:text-primary-700 mt-1 transition-colors">
                          {link.text} <ArrowRight className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Map */}
              <div className="relative rounded-lg overflow-hidden shadow-lg border-2 border-[rgba(184,121,44,0.2)] h-[320px]">
                <div className="absolute inset-x-0 top-0 h-[3px] z-10"
                     style={{ background: 'linear-gradient(90deg,#9F2F28,#D9A13A,#2F6B45,#D9A13A,#9F2F28)' }} />
                <iframe
                  src={MAPS_EMBED}
                  width="100%" height="100%"
                  style={{ border: 0 }}
                  allowFullScreen="" loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Gazra Cafe Location"
                />
                <div className="absolute bottom-0 inset-x-0 bg-[rgba(251,244,231,0.95)] backdrop-blur-md p-3
                                border-t border-[rgba(184,121,44,0.2)] pointer-events-none">
                  <p className="font-bold text-center text-neutral-900 text-sm">Gazra Cafe</p>
                  <p className="text-xs text-center text-neutral-500">Opp. Sursagar, Mandvi, Vadodara</p>
                </div>
              </div>

              <a href={MAPS_URL} target="_blank" rel="noopener noreferrer"
                 className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700
                            text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-colors duration-200">
                Get Directions
                <ArrowRight className="w-4 h-4" />
              </a>
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default ContactPage;
