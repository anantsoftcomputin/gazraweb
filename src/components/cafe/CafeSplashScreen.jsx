'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const STORAGE_KEY = 'gazra-cafe-splash-shown';
const FALLBACK_DURATION = 4500; // in case autoplay is blocked or the video fails to load

// Plays once per session, the first time someone lands on /cafe — a quick,
// translucent video moment before the page itself fades in underneath.
const CafeSplashScreen = ({ onComplete }) => {
  const [visible, setVisible] = useState(false);
  const dismissedRef = useRef(false);

  const dismiss = () => {
    if (dismissedRef.current) return;
    dismissedRef.current = true;
    setVisible(false);
  };

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || sessionStorage.getItem(STORAGE_KEY)) {
      onComplete?.();
      return;
    }

    setVisible(true);
    sessionStorage.setItem(STORAGE_KEY, '1');

    const fallback = setTimeout(dismiss, FALLBACK_DURATION);
    return () => clearTimeout(fallback);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-neutral-950"
        >
          <video
            src="/video/gazra-soda-pop.mp4"
            autoPlay
            muted
            playsInline
            onEnded={dismiss}
            onError={dismiss}
            className="absolute inset-0 h-full w-full object-contain opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/35 via-transparent to-neutral-950/60" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CafeSplashScreen;
