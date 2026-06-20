import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, Coffee, Users, Calendar, Images, ChevronLeft, ChevronRight, Star } from 'lucide-react';
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
const Lightbox = ({ images, index, onClose, onPrev, onNext, onGoTo }) => {
  const img = images[index];

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape')      onClose();
      if (e.key === 'ArrowLeft')   onPrev();
      if (e.key === 'ArrowRight')  onNext();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handler);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handler);
    };
  }, [onClose, onPrev, onNext]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[999] bg-neutral-950/98 backdrop-blur-md flex items-center justify-center"
      onClick={onClose}
    >
      {/* Top bar */}
      <div className="absolute top-0 inset-x-0 flex items-center justify-between px-5 py-4 z-10">
        <span className="text-xs text-white/40 font-mono">{index + 1} / {images.length}</span>
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Prev / Next */}
      <button
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        className="absolute left-3 sm:left-6 z-10 p-3 rounded-full bg-white/8 hover:bg-white/18 border border-white/10 text-white transition-all hover:scale-105"
        aria-label="Previous"
      >
        <ChevronLeft size={22} />
      </button>

      {/* Image container */}
      <AnimatePresence mode="wait">
        <motion.div
          key={img.id}
          initial={{ opacity: 0, scale: 0.97, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.97, x: -20 }}
          transition={{ duration: 0.22 }}
          className="relative max-w-5xl w-full mx-16 sm:mx-24 flex flex-col items-center gap-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Toran frame accent */}
          <div className="absolute -top-[2px] inset-x-0 h-[3px] rounded-t-lg"
               style={{ background: 'linear-gradient(90deg,#9F2F28,#D9A13A,#2F6B45,#D9A13A,#9F2F28)' }} />

          <img
            src={img.src}
            alt={img.caption || ''}
            className="max-w-full max-h-[78vh] object-contain rounded-lg shadow-[0_24px_80px_rgba(0,0,0,0.7)]"
          />

          {/* Caption + category */}
          {(img.caption || img.category) && (
            <div className="flex items-center gap-3 px-5 py-2.5 bg-white/6 backdrop-blur-md rounded-full border border-white/10">
              {img.category && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary-300 border border-primary-400/30 px-2 py-0.5 rounded-full">
                  {img.category}
                </span>
              )}
              {img.caption && (
                <p className="text-sm text-white/80 italic leading-snug">{img.caption}</p>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <button
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        className="absolute right-3 sm:right-6 z-10 p-3 rounded-full bg-white/8 hover:bg-white/18 border border-white/10 text-white transition-all hover:scale-105"
        aria-label="Next"
      >
        <ChevronRight size={22} />
      </button>

      {/* Dot strip */}
      <div className="absolute bottom-5 inset-x-0 flex justify-center gap-1.5">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={(e) => { e.stopPropagation(); onGoTo(i); }}
            className={`rounded-full transition-all ${
              i === index ? 'w-5 h-1.5 bg-primary-400' : 'w-1.5 h-1.5 bg-white/25 hover:bg-white/50'
            }`}
          />
        ))}
      </div>
    </motion.div>
  );
};

/* ─── Gallery card ─────────────────────────────────────────────────── */
const GalleryCard = ({ image, onClick, index, isFeatured }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-40px' }}
    transition={{ duration: 0.4, delay: (index % 8) * 0.045 }}
    className={`group relative overflow-hidden rounded-xl cursor-pointer break-inside-avoid mb-3
                ${isFeatured ? 'ring-2 ring-amber-400/60 ring-offset-2 ring-offset-[var(--gazra-paper)]' : ''}`}
    onClick={onClick}
  >
    {/* Toran stripe on hover */}
    <div className="absolute inset-x-0 top-0 h-[3px] z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
         style={{ background: 'linear-gradient(90deg,#9F2F28,#D9A13A,#2F6B45,#D9A13A,#9F2F28)' }} />

    <img
      src={image.src}
      alt={image.caption || ''}
      className="w-full h-auto block object-cover transition-transform duration-500 group-hover:scale-[1.05]"
      loading="lazy"
    />

    {/* Featured star */}
    {isFeatured && (
      <div className="absolute top-2.5 left-2.5 z-10 p-1.5 bg-amber-400 rounded-full shadow-lg">
        <Star size={10} className="text-amber-900 fill-current" />
      </div>
    )}

    {/* Category chip */}
    <div className="absolute top-2.5 right-2.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
      <span className="px-2 py-0.5 bg-black/50 text-white text-[10px] font-bold uppercase tracking-wide rounded-full backdrop-blur-sm">
        {image.category}
      </span>
    </div>

    {/* Hover overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/85 via-neutral-950/20 to-transparent
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <div className="absolute inset-x-0 bottom-0 p-3 flex items-end gap-2">
        <ZoomIn size={15} className="text-primary-300 flex-shrink-0 mb-0.5" />
        {image.caption && (
          <p className="text-[12px] text-white/90 italic leading-snug line-clamp-2">{image.caption}</p>
        )}
      </div>
    </div>
  </motion.div>
);

/* ─── Featured strip (top row) ─────────────────────────────────────── */
const FeaturedStrip = ({ images, onOpen }) => {
  if (!images.length) return null;
  return (
    <section className="bg-[var(--gazra-paper)] pt-8 pb-2">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-2 mb-4">
          <Star size={14} className="text-amber-500 fill-current" />
          <span className="text-xs font-bold uppercase tracking-widest text-amber-600">Featured Moments</span>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {images.map((img, i) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="relative flex-shrink-0 w-48 h-32 sm:w-64 sm:h-44 rounded-xl overflow-hidden cursor-pointer group ring-2 ring-amber-400/50"
              onClick={() => onOpen(img)}
            >
              <img src={img.src} alt={img.caption || ''} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              {img.caption && (
                <p className="absolute bottom-0 inset-x-0 p-2 text-[11px] text-white italic opacity-0 group-hover:opacity-100 transition-opacity leading-snug line-clamp-2">
                  {img.caption}
                </p>
              )}
              <div className="absolute top-2 left-2 p-1 bg-amber-400 rounded-full">
                <Star size={9} className="text-amber-900 fill-current" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─── Main Gallery page ─────────────────────────────────────────────── */
const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [lightboxImage, setLightboxImage]   = useState(null);   // { images, index }
  const [firestoreImages, setFirestoreImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getDocuments } = useFirestore('gallery');

  useEffect(() => {
    getDocuments()
      .then((res) => {
        if (res?.success && res.data?.length) {
          const mapped = res.data.map((d) => ({
            id:       `fs-${d.id}`,
            src:      d.imageUrl || d.url || d.src,
            category: d.category || 'community',
            caption:  d.caption || d.title || '',
            featured: d.featured || false,
          })).filter((d) => d.src);
          setFirestoreImages(mapped);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const allImages = firestoreImages.length ? [...firestoreImages, ...SEED] : SEED;
  const featuredImages = allImages.filter(i => i.featured);

  const displayed = activeCategory === 'all'
    ? allImages
    : allImages.filter((i) => i.category === activeCategory);

  const openLightbox = useCallback((img, images) => {
    const idx = images.findIndex(i => i.id === img.id);
    setLightboxImage({ images, index: idx >= 0 ? idx : 0 });
  }, []);

  const closeLightbox = useCallback(() => setLightboxImage(null), []);

  const prevImage = useCallback(() => {
    setLightboxImage(prev => ({
      ...prev,
      index: (prev.index - 1 + prev.images.length) % prev.images.length
    }));
  }, []);

  const nextImage = useCallback(() => {
    setLightboxImage(prev => ({
      ...prev,
      index: (prev.index + 1) % prev.images.length
    }));
  }, []);

  const goToImage = useCallback((i) => {
    setLightboxImage(prev => ({ ...prev, index: i }));
  }, []);

  const counts = {
    all:       allImages.length,
    cafe:      allImages.filter(i => i.category === 'cafe').length,
    events:    allImages.filter(i => i.category === 'events').length,
    community: allImages.filter(i => i.category === 'community').length,
  };

  return (
    <div className="w-full">

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden min-h-[48vh] flex items-end bg-neutral-950 pb-10">
        <img
          src="/images/image9.webp"
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[var(--gazra-paper)] to-transparent" />

        {/* Floating photo collage — top right decoration */}
        <div className="absolute top-8 right-4 sm:right-10 flex gap-2 opacity-70 pointer-events-none hidden sm:flex">
          {['/images/image-one.jpg', '/images/image8.webp', '/images/skill1.webp'].map((src, i) => (
            <div
              key={i}
              className="w-20 h-28 rounded-xl overflow-hidden shadow-2xl border border-white/10"
              style={{ transform: `rotate(${[-4, 2, -2][i]}deg) translateY(${[8, 0, 12][i]}px)` }}
            >
              <img src={src} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-8">
          <div className="inline-flex items-center gap-2 mb-4 rounded border border-primary-200/40
                          bg-[rgba(251,244,231,0.88)] px-4 py-1.5 text-xs font-bold uppercase
                          tracking-wide text-accent-terracotta shadow-lg backdrop-blur-md">
            <Images className="w-3.5 h-3.5" />
            Moments from Gazra
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black leading-tight text-white
                         drop-shadow-[0_4px_18px_rgba(0,0,0,0.55)] max-w-2xl">
            Our Story<br className="hidden sm:block" /> in Pictures
          </h1>
          <p className="mt-3 max-w-lg text-primary-100/75 text-base sm:text-lg leading-relaxed">
            Every frame is a memory. Every smile, a promise.
          </p>

          {/* Mini stats */}
          <div className="mt-6 flex flex-wrap gap-3">
            {[
              { label: 'Photos', value: allImages.length },
              { label: 'Cafe moments', value: counts.cafe },
              { label: 'Events', value: counts.events },
              { label: 'Community', value: counts.community },
            ].map(s => (
              <div key={s.label} className="px-3 py-1.5 bg-white/8 backdrop-blur-md rounded-lg border border-white/10 text-center min-w-[64px]">
                <div className="text-lg font-black text-white leading-none">{s.value}</div>
                <div className="text-[10px] text-white/50 uppercase tracking-wide mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured strip ──────────────────────────────────────── */}
      {featuredImages.length > 0 && (
        <FeaturedStrip images={featuredImages} onOpen={(img) => openLightbox(img, featuredImages)} />
      )}

      {/* ── Category filters ─────────────────────────────────────── */}
      <section className="sticky top-[134px] lg:top-[80px] z-40 bg-[rgba(251,244,231,0.97)] backdrop-blur-xl
                          border-b border-[rgba(184,121,44,0.2)] shadow-[0_4px_16px_rgba(45,33,20,0.08)]">
        <div className="h-[2px]"
             style={{ background: 'linear-gradient(90deg,#9F2F28,#D9A13A,#2F6B45,#D9A13A,#9F2F28)' }} />
        <div className="container mx-auto px-4 py-3 flex gap-2 overflow-x-auto">
          {CATEGORIES.map((cat) => {
            const active = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold
                            whitespace-nowrap transition-all duration-200 flex-shrink-0
                            ${active
                              ? 'bg-primary-600 text-white shadow-md'
                              : 'bg-transparent text-neutral-600 hover:bg-primary-50 hover:text-primary-700'}`}
              >
                <cat.icon size={14} strokeWidth={active ? 2.5 : 1.8} />
                {cat.label}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  active ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-400'
                }`}>{counts[cat.id]}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Masonry grid ─────────────────────────────────────────── */}
      <section className="bg-[var(--gazra-paper)] py-8 min-h-[40vh]">
        <div className="container mx-auto px-4 sm:px-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="columns-2 sm:columns-3 lg:columns-4 gap-3"
            >
              {displayed.map((image, idx) => (
                <GalleryCard
                  key={image.id}
                  image={image}
                  index={idx}
                  isFeatured={image.featured}
                  onClick={() => openLightbox(image, displayed)}
                />
              ))}
            </motion.div>
          </AnimatePresence>

          {!isLoading && displayed.length === 0 && (
            <div className="text-center py-24">
              <Images size={44} className="mx-auto mb-4 text-neutral-300" />
              <p className="text-neutral-500 font-medium">No photos in this category yet.</p>
            </div>
          )}

          {isLoading && (
            <div className="columns-2 sm:columns-3 lg:columns-4 gap-3">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="break-inside-avoid mb-3 rounded-xl bg-neutral-200 animate-pulse"
                  style={{ height: `${[180, 240, 160, 220, 200, 180][i % 6]}px` }}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Quote banner ─────────────────────────────────────────── */}
      <section className="py-16 bg-primary-600 relative overflow-hidden">
        <div className="absolute inset-0 gazra-jaali opacity-20" />
        {/* decorative photo grid blur */}
        <div className="absolute inset-0 flex items-center justify-end pr-8 opacity-10 pointer-events-none hidden lg:flex">
          <div className="grid grid-cols-3 gap-1.5">
            {SEED.slice(0, 9).map((s, i) => (
              <div key={i} className="w-20 h-20 rounded overflow-hidden">
                <img src={s.src} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        <div className="relative container mx-auto px-4 text-center">
          <div className="gazra-folk-chain mx-auto mb-6 max-w-xs" />
          <p className="font-display text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-snug max-w-2xl mx-auto">
            "यादें हमारी, किस्से आपके,<br className="hidden sm:block" /> जगह हम सबकी"
          </p>
          <p className="mt-3 text-primary-100/80 text-sm tracking-wide">
            Memories ours · Stories yours · Place everyone's
          </p>
          <div className="gazra-folk-chain mx-auto mt-6 max-w-xs" />
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxImage && (
          <Lightbox
            images={lightboxImage.images}
            index={lightboxImage.index}
            onClose={closeLightbox}
            onPrev={prevImage}
            onNext={nextImage}
            onGoTo={goToImage}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
