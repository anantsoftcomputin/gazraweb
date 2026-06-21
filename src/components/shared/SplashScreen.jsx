'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Coffee, Users, BookOpen, Heart } from 'lucide-react';

const STORAGE_KEY = 'gazra-splash-shown';

const PILLARS = [
  { icon: Coffee, label: 'Cafe' },
  { icon: Users, label: 'Community' },
  { icon: BookOpen, label: 'Skill Hub' },
  { icon: Heart, label: 'Support' },
];

const SplashScreen = () => {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  useEffect(() => {
    if (isAdminRoute) return;
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    setVisible(true);
    sessionStorage.setItem(STORAGE_KEY, '1');

    const timer = setTimeout(() => setVisible(false), 4000);
    return () => clearTimeout(timer);
  }, [isAdminRoute]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="gazra-canvas-texture fixed inset-0 z-[9999] flex flex-col items-center justify-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[rgba(243,236,217,0.92)] shadow-lg p-3 mb-4"
          >
            <img src="/logo.svg" alt="Gazra Logo" className="w-full h-full object-contain" />
          </motion.div>

          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 0.7, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--gazra-gold-soft)] mb-3"
          >
            The Gazra Project
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="font-display text-4xl sm:text-5xl font-black text-[var(--gazra-ivory)] text-center px-6"
          >
            The Art of <span className="italic text-[var(--gazra-gold-soft)]">Human Touch</span>
          </motion.h1>

          <div className="flex items-center gap-5 sm:gap-8 mt-9">
            {PILLARS.map(({ icon: Icon, label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, scale: 0.6, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.18, duration: 0.45, ease: 'backOut' }}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center border border-[rgba(243,236,217,0.25)] bg-[rgba(243,236,217,0.06)]">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--gazra-ivory)]" strokeWidth={1.6} />
                </div>
                <span className="text-[10px] uppercase tracking-wide text-[rgba(243,236,217,0.6)]">{label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
