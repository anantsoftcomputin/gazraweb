/**
 * ToranBorder — Gujarati toran (तोरण) decorative stripe
 * A layered textile band in brand colours: terracotta / marigold / heritage-green.
 */

const FOLK_PATTERN_URI = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='24'%3E%3Cpolygon points='30,1 59,12 30,23 1,12' fill='none' stroke='rgba(255%2C248%2C232%2C0.28)' stroke-width='1.2'/%3E%3Ccircle cx='30' cy='12' r='2.2' fill='rgba(255%2C248%2C232%2C0.42)'/%3E%3Ccircle cx='1' cy='12' r='1.4' fill='rgba(217%2C161%2C58%2C0.48)'/%3E%3Ccircle cx='59' cy='12' r='1.4' fill='rgba(217%2C161%2C58%2C0.48)'/%3E%3Ccircle cx='30' cy='0' r='1.4' fill='rgba(217%2C161%2C58%2C0.32)'/%3E%3Ccircle cx='30' cy='24' r='1.4' fill='rgba(217%2C161%2C58%2C0.32)'/%3E%3C%2Fsvg%3E")`;

const ToranBorder = ({ className = '' }) => {
  return (
    <div className={`w-full overflow-hidden select-none ${className}`} aria-hidden="true">
      {/* ── Stripe band ─────────────────────────────────────────── */}
      <div style={{ height: 4, background: '#9F2F28' }} />
      <div style={{ height: 2, background: '#D9A13A' }} />
      <div
        style={{
          height: 24,
          background: `${FOLK_PATTERN_URI}, #2F6B45`,
          backgroundSize: '60px 24px, auto',
        }}
      />
      <div style={{ height: 2, background: '#D9A13A' }} />
      <div style={{ height: 4, background: '#9F2F28' }} />

    </div>
  );
};

export default ToranBorder;
