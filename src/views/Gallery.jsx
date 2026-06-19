import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, Coffee, Users, Calendar, Images, ChevronLeft, ChevronRight } from 'lucide-react';
import { useFirestore } from '../hooks/useFirestore';

/* ─── Static seed images ──────────────────────────────────────────── */
const SEED = [
  { id: 's1',  src: '/images/image-six.jpg',   category: 'cafe',      caption: 'Gazra Cafe — where every cup tells a story' },
  { id: 's2',  src: '/images/cafe1.webp',       category: 'cafe',      caption: 'The warm heart of Gazra' },
  { id: 's3',  src: '/images/image7.webp',      category: 'community', caption: 'Together we thrive' },
  { id: 's4',  src: '/images/image9.webp',      category: 'community', caption: 'Celebrating every identity' },
  { id: 's5',  src: '/images/image10.webp',     category: 'cafe',      caption: 'Inclusive space, authentic flavours' },
  { id: 's6',  src: '/images/image-four.jpg',   category: 'events',    caption: 'Community comes alive' },
  { id: 's7',  src: '/images/image-five.jpg',   category: 'community', caption: 'Stories worth sharing' },
  { id: 's8',  src: '/images/image8.webp',      category: 'cafe',      caption: 'Heritage on every plate' },
  { id: 's9',  src: '/images/image11.jpg',      category: 'events',    caption: 'Creating memories together' },
  { id: 's10', src: '/images/image12.jpg',      category: 'community', caption: 'Joy in every corner' },
  { id: 's11', src: '/images/food-image.webp',  category: 'cafe',      caption: "Grandmother's recipes, grandmother's love" },
  { id: 's12', src: '/images/food-1.png',       category: 'cafe',      caption: 'Gujarati soul food' },
  { id: 's13', src: '/images/art-therapy.png',  category: 'events',    caption: 'Art as healing' },
  { id: 's14', src: '/images/skill1.webp',      category: 'community', caption: 'Skills that change lives' },
  { id: 's15', src: '/images/image-one.jpg',    category: 'community', caption: 'Belonging begins here' },
  { id: 's16', src: '/images/image-three.jpg',  category: 'events',    caption: 'Every gathering, a memory' },
];

const CATEGORIES = [
  { id: 'all',       label: 'All Moments',   icon: Images },
  { id: 'cafe',      label: 'Cafe Life',     icon: Coffee },
  { id: 'events',    label: 'Events',        icon: Calendar },
  { id: 'community', label: 'Community',     icon: Users },
];

/* ─── Lightbox ─────────────────────────────────────────────────────── */
const Lightbox = ({ images, index, onClose, onPrev, onNext }) => {
  const img = images[index];
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, onPrev, onNext]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[999] flex items-center justify-center bg-neutral-950/95 backdrop-blur-sm px-4"
        onClick={onClose}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* Prev */}
        <button
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          className="absolute left-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          aria-label="Previous"
        >
          <ChevronLeft size={24} />
        </button>

        {/* Image */}
        <motion.div
          key={img.id}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="relative max-w-5xl w-full max-h-[85vh] flex flex-col items-center"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={img.src}
            alt={img.caption}
            className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl"
          />
          {img.caption && (
            <div className="mt-4 px-6 py-2 bg-[rgba(251,244,231,0.1)] backdrop-blur-md rounded-full border border-white/10">
              <p className="text-sm text-primary-100 text-center italic">{img.caption}</p>
            </div>
          )}
          <p className="mt-2 text-xs text-white/40">{index + 1} / {images.length}</p>
        </motion.div>

        {/* Next */}
        <button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="absolute right-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          aria-label="Next"
        >
          <ChevronRight size={24} />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

/* ─── Gallery card ─────────────────────────────────────────────────── */
const GalleryCard = ({ image, onClick, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.45, delay: (index % 6) * 0.06 }}
    className="group relative overflow-hidden rounded-lg cursor-pointer break-inside-avoid mb-3"
    onClick={onClick}
  >
    {/* Toran-colour top accent */}
    <div className="absolute inset-x-0 top-0 h-[3px] z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
         style={{ background: 'linear-gradient(90deg,#9F2F28,#D9A13A,#2F6B45,#D9A13A,#9F2F28)' }} />

    <img
      src={image.src}
      alt={image.caption}
      className="w-full h-auto block object-cover transition-transform duration-500 group-hover:scale-[1.04]"
      loading="lazy"
    />

    {/* Hover overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/80 via-neutral-900/20 to-transparent
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
      <div className="flex items-center gap-2">
        <ZoomIn size={16} className="text-primary-200 flex-shrink-0" />
        {image.caption && (
          <p className="text-sm text-white/90 italic leading-snug line-clamp-2">{image.caption}</p>
        )}
      </div>
    </div>
  </motion.div>
);

/* ─── Main Gallery page ─────────────────────────────────────────────── */
const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [firestoreImages, setFirestoreImages] = useState([]);
  const { getDocuments } = useFirestore('gallery');

  useEffect(() => {
    getDocuments()
      .then((res) => {
        if (res?.success && res.data?.length) {
          const mapped = res.data.map((d) => ({
            id: `fs-${d.id}`,
            src: d.imageUrl || d.url || d.src,
            category: d.category || 'community',
            caption: d.caption || d.title || '',
          })).filter((d) => d.src);
          setFirestoreImages(mapped);
        }
      })
      .catch(() => {});
  }, []);

  const allImages = firestoreImages.length ? [...firestoreImages, ...SEED] : SEED;

  const displayed = activeCategory === 'all'
    ? allImages
    : allImages.filter((i) => i.category === activeCategory);

  const openLightbox = useCallback((idx) => setLightboxIndex(idx), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const prevImage = useCallback(() => setLightboxIndex((i) => (i - 1 + displayed.length) % displayed.length), [displayed.length]);
  const nextImage = useCallback(() => setLightboxIndex((i) => (i + 1) % displayed.length), [displayed.length]);

  return (
    <div className="w-full">

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden min-h-[44vh] flex items-center bg-neutral-950">
        <img
          src="/images/image9.webp"
          alt="Gallery hero"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/90 via-neutral-950/60 to-neutral-950/30" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[var(--gazra-paper)] to-transparent" />

        <div className="relative z-10 container mx-auto px-4 sm:px-8 py-16">
          <div className="inline-flex items-center gap-2 mb-4 rounded border border-primary-200/40
                          bg-[rgba(251,244,231,0.88)] px-4 py-1.5 text-xs font-bold uppercase
                          tracking-wide text-accent-terracotta shadow-lg backdrop-blur-md">
            <Images className="w-3.5 h-3.5" />
            Moments from Gazra
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black leading-tight text-white
                         drop-shadow-[0_4px_18px_rgba(0,0,0,0.55)] max-w-2xl">
            Our Story in Pictures
          </h1>
          <p className="mt-4 max-w-xl text-primary-100/80 text-base sm:text-lg leading-relaxed">
            Every frame is a memory. Every smile, a promise. Welcome to the living archive of Gazra.
          </p>
        </div>
      </section>

      {/* ── Category filters ─────────────────────────────────────── */}
      <section className="sticky top-[134px] z-40 bg-[rgba(251,244,231,0.97)] backdrop-blur-xl
                          border-b border-[rgba(184,121,44,0.2)] shadow-[0_4px_16px_rgba(45,33,20,0.08)]">
        {/* mini toran stripe */}
        <div className="h-[2px]"
             style={{ background: 'linear-gradient(90deg,#9F2F28,#D9A13A,#2F6B45,#D9A13A,#9F2F28)' }} />
        <div className="container mx-auto px-4 py-3 flex gap-2 overflow-x-auto">
          {CATEGORIES.map((cat) => {
            const active = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold
                            whitespace-nowrap transition-all duration-200 flex-shrink-0
                            ${active
                              ? 'bg-primary-600 text-white shadow-md'
                              : 'bg-transparent text-neutral-600 hover:bg-primary-50 hover:text-primary-700'}`}
              >
                <cat.icon size={15} strokeWidth={active ? 2.5 : 1.8} />
                {cat.label}
              </button>
            );
          })}
          <span className="ml-auto flex-shrink-0 self-center text-xs text-neutral-400">
            {displayed.length} photo{displayed.length !== 1 ? 's' : ''}
          </span>
        </div>
      </section>

      {/* ── Masonry grid ─────────────────────────────────────────── */}
      <section className="bg-[var(--gazra-paper)] py-10">
        <div className="container mx-auto px-4 sm:px-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="columns-2 sm:columns-3 lg:columns-4 gap-3"
            >
              {displayed.map((image, idx) => (
                <GalleryCard
                  key={image.id}
                  image={image}
                  index={idx}
                  onClick={() => openLightbox(idx)}
                />
              ))}
            </motion.div>
          </AnimatePresence>

          {displayed.length === 0 && (
            <div className="text-center py-24">
              <Images size={48} className="mx-auto mb-4 text-neutral-300" />
              <p className="text-neutral-500 font-medium">No images in this category yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── Quote banner ─────────────────────────────────────────── */}
      <section className="py-14 bg-primary-600 relative overflow-hidden">
        <div className="absolute inset-0 gazra-jaali opacity-20" />
        <div className="relative container mx-auto px-4 text-center">
          <div className="gazra-folk-chain mx-auto mb-6 max-w-xs" />
          <p className="font-display text-2xl sm:text-3xl font-black text-white leading-snug max-w-2xl mx-auto">
            "यादें हमारी, किस्से आपके, जगह हम सबकी"
          </p>
          <p className="mt-3 text-primary-100 text-sm">
            Memories ours, stories yours, place everyone's
          </p>
          <div className="gazra-folk-chain mx-auto mt-6 max-w-xs" />
        </div>
      </section>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          images={displayed}
          index={lightboxIndex}
          onClose={closeLightbox}
          onPrev={prevImage}
          onNext={nextImage}
        />
      )}
    </div>
  );
};

export default Gallery;
