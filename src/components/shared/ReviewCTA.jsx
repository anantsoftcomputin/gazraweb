import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';

const REVIEW_URL = 'https://g.page/r/Cc-ivNDZd5AgEAE/review';

// Reusable "leave us a Google review" banner — QR + direct link, generated
// client-side from the same review URL so it always points somewhere real.
const ReviewCTA = ({ className = '' }) => {
  const [qrDataUrl, setQrDataUrl] = useState('');

  useEffect(() => {
    // Loaded on demand so the qrcode library isn't part of this page's
    // initial JS bundle — it's only needed once this component mounts.
    import('qrcode')
      .then(({ default: QRCode }) => QRCode.toDataURL(REVIEW_URL, { margin: 1, width: 160 }))
      .then(setQrDataUrl)
      .catch((error) => console.error('Review QR generation failed:', error));
  }, []);

  return (
    <div
      className={`relative heritage-paper overflow-hidden rounded-lg border border-neutral-300 shadow-lg p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 ${className}`}
    >
      <div className="heritage-rule absolute left-0 top-0 h-1 w-full" />

      {qrDataUrl && (
        <img
          src={qrDataUrl}
          alt="QR code to leave a Google review for Gazra Cafe"
          className="w-28 h-28 sm:w-32 sm:h-32 rounded-lg border border-neutral-200 bg-white p-2 shadow-sm flex-shrink-0"
        />
      )}

      <div className="flex-1 text-center sm:text-left">
        <div className="inline-flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
          ))}
        </div>
        <h3 className="font-display text-xl sm:text-2xl font-black text-neutral-900 mb-1.5">
          Please Give Us a Review
        </h3>
        <p className="text-sm sm:text-base text-neutral-600 max-w-md">
          Loved your visit? Scan the QR code or tap below to leave us a review on Google — it means the world to our community.
        </p>
      </div>

      <a
        href={REVIEW_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-white hover:bg-primary-50 border border-neutral-300 text-neutral-800 font-semibold px-5 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex-shrink-0"
      >
        <FcGoogle className="w-5 h-5" />
        Leave a Review
      </a>
    </div>
  );
};

export default ReviewCTA;
