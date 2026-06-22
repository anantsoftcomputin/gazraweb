import { motion } from 'framer-motion';
import { ScrollText } from 'lucide-react';

const LegalPageShell = ({ title, highlight, description, lastUpdated, children }) => {
  return (
    <div className="w-full">
      {/* Hero */}
      <section className="relative min-h-[36vh] flex items-center bg-neutral-950 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-neutral-950 to-neutral-950" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[var(--gazra-paper)] to-transparent" />

        <div className="relative z-10 container mx-auto px-4 sm:px-8 py-16">
          <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }} className="max-w-2xl">
            <div className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded border border-primary-200/40
                            bg-[rgba(251,244,231,0.88)] text-xs font-bold uppercase tracking-wide
                            text-accent-terracotta shadow-lg backdrop-blur-md">
              <ScrollText className="w-3.5 h-3.5" />
              Legal
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-black text-white leading-tight drop-shadow-[0_4px_18px_rgba(0,0,0,0.55)]">
              {title}{highlight && <><br /><span className="text-primary-300">{highlight}</span></>}
            </h1>
            {description && (
              <p className="mt-4 text-primary-100/80 text-base sm:text-lg leading-relaxed">{description}</p>
            )}
            {lastUpdated && (
              <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-primary-200/60">Last updated: {lastUpdated}</p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Toran stripe divider */}
      <div className="h-[2px]" style={{ background: 'linear-gradient(90deg,transparent,#9F2F28,#D9A13A,#2F6B45,#D9A13A,#9F2F28,transparent)' }} />

      {/* Content */}
      <section className="bg-[var(--gazra-paper)] py-14">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto bg-white border border-[rgba(184,121,44,0.15)] rounded-lg shadow-lg p-6 sm:p-10 space-y-8"
          >
            {children}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export const LegalSection = ({ title, children }) => (
  <div>
    <h2 className="font-display text-xl sm:text-2xl font-bold text-neutral-900 mb-3">{title}</h2>
    <div className="text-sm sm:text-base text-neutral-600 leading-relaxed space-y-3">{children}</div>
  </div>
);

export default LegalPageShell;
