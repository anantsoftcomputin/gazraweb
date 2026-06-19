/**
 * ParrotDecor — Stylised Indian Ring-Necked Parakeet (तोते)
 * Decorative brand motif referencing the parrots in Gazra's "Gazra Ki Khabar" visual identity.
 * Props:
 *   size    — base width in px (height is ~1.4× the width)
 *   flip    — mirror horizontally (for a pair facing each other)
 *   opacity — overall opacity (default 1)
 *   className — extra Tailwind / CSS classes
 */
const ParrotDecor = ({
  size = 56,
  flip = false,
  opacity = 1,
  className = '',
}) => {
  const h = Math.round(size * 1.45);

  return (
    <svg
      width={size}
      height={h}
      viewBox="0 0 56 82"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      fill="none"
      className={className}
      style={{
        opacity,
        transform: flip ? 'scaleX(-1)' : undefined,
        flexShrink: 0,
      }}
    >
      {/* ── Tail feathers (behind body) ────────────────────────── */}
      <path
        d="M 19 60 C 15 70 13 80 17 76 C 19 72 21 68 23 74 C 24 78 26 76 23 68 C 27 76 29 74 26 70 C 25 66 24 60 24 60"
        fill="#1A5030"
        stroke="#2F6B45"
        strokeWidth="0.6"
      />

      {/* ── Body ───────────────────────────────────────────────── */}
      <ellipse cx="22" cy="45" rx="13" ry="18" fill="#2F6B45" />

      {/* Wing shadow / depth */}
      <path
        d="M 12 38 Q 9 50 12 60 Q 17 62 21 58 Q 17 48 14 38 Z"
        fill="#1A5030"
        opacity="0.45"
      />

      {/* ── Head ───────────────────────────────────────────────── */}
      <circle cx="28" cy="24" r="12" fill="#2F6B45" />

      {/* Cheek highlight */}
      <ellipse cx="24" cy="27" rx="4" ry="3" fill="#3E8055" opacity="0.4" />

      {/* ── Eye ────────────────────────────────────────────────── */}
      {/* White sclerotic ring — distinctive of Indian parakeets */}
      <circle cx="32" cy="21" r="5"   fill="white"   />
      <circle cx="32" cy="21" r="3.5" fill="#171311" />
      {/* Catchlight */}
      <circle cx="33" cy="20" r="1.1" fill="white"   />

      {/* ── Beak (hooked, terracotta-red) ──────────────────────── */}
      <path
        d="M 37 24 C 43 22 45 27 42 30 C 40 31 37 28 37 24 Z"
        fill="#9F2F28"
      />
      <path
        d="M 37 27 C 39 30 40 31 37 30 Z"
        fill="#7A2520"
      />

      {/* ── Neck rings — black outer + rose inner ──────────────── */}
      <path
        d="M 17 32 Q 22 38 33 36 Q 37 33 36 30 Q 31 33 21 31 Q 18 29 17 32 Z"
        fill="#171311"
        opacity="0.55"
      />
      <path
        d="M 18 30 Q 23 35 33 33 Q 36 30 35 28 Q 30 31 22 29 Q 19 27 18 30 Z"
        fill="#C86060"
        opacity="0.4"
      />

      {/* ── Feet / perch claws ─────────────────────────────────── */}
      <line x1="17" y1="62" x2="12" y2="68" stroke="#3E2314" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="17" y1="62" x2="14" y2="70" stroke="#3E2314" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="17" y1="62" x2="19" y2="70" stroke="#3E2314" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
};

export default ParrotDecor;
