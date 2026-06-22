import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Search, Scale, Brain, Stethoscope, Briefcase, Landmark, HeartHandshake,
  Globe, Phone, Mail, ExternalLink, LifeBuoy,
} from 'lucide-react';
import { increment } from 'firebase/firestore';
import { useFirestore } from '../hooks/useFirestore';

const CATEGORIES = [
  { id: 'all', label: 'All Categories', icon: LifeBuoy },
  { id: 'legal', label: 'Legal Aid', icon: Scale },
  { id: 'mental-health', label: 'Mental Health', icon: Brain },
  { id: 'medical', label: 'Medical Aid', icon: Stethoscope },
  { id: 'jobs', label: 'Jobs & Livelihood', icon: Briefcase },
];

const FUNDING_TYPES = [
  { id: 'all', label: 'All' },
  { id: 'government', label: 'Government' },
  { id: 'private', label: 'Private & NGO' },
];

const categoryMeta = (id) => CATEGORIES.find((c) => c.id === id) || CATEGORIES[0];

const ResourceCard = ({ resource, onVisit }) => {
  const { icon: Icon } = categoryMeta(resource.category);
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative heritage-paper overflow-hidden rounded-lg border border-neutral-300 p-6 shadow-lg flex flex-col gap-4 transition-all duration-300 hover:border-primary-500 hover:shadow-xl hover:-translate-y-2"
    >
      <div className="heritage-rule absolute left-0 top-0 h-1 w-full" />
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-primary-600 flex items-center justify-center flex-shrink-0">
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-display font-bold text-neutral-900 leading-snug">{resource.orgName || resource.name}</h3>
            <p className="text-xs text-neutral-500">{categoryMeta(resource.category).label}</p>
          </div>
        </div>
        <span
          className={`shrink-0 text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full ${
            resource.fundingType === 'government'
              ? 'bg-[rgba(47,107,69,0.12)] text-[#2F6B45]'
              : 'bg-[rgba(184,121,44,0.14)] text-accent-terracotta'
          }`}
        >
          {resource.fundingType === 'government' ? 'Govt' : 'Private/NGO'}
        </span>
      </div>

      <p className="text-sm text-neutral-600 leading-relaxed flex-1">{resource.description}</p>

      {resource.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {resource.tags.map((tag) => (
            <span key={tag} className="text-[11px] px-2 py-0.5 rounded-full bg-primary-50 text-primary-600 border border-primary-100">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="space-y-1.5 text-sm text-neutral-600 border-t border-[rgba(184,121,44,0.12)] pt-3">
        {resource.phone && (
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-primary-500 flex-shrink-0" />
            <span>{resource.phone}</span>
          </div>
        )}
        {resource.email && (
          <div className="flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 text-primary-500 flex-shrink-0" />
            <span className="truncate">{resource.email}</span>
          </div>
        )}
      </div>

      <button
        onClick={() => onVisit(resource)}
        className="group inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
      >
        Visit
        <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
      </button>
    </motion.div>
  );
};

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [fundingType, setFundingType] = useState('all');
  const { getDocuments, updateDocument } = useFirestore('resources');

  useEffect(() => {
    const load = async () => {
      const result = await getDocuments();
      if (result.success) {
        setResources(result.data.filter((r) => r.status !== 'inactive'));
      }
      setLoading(false);
    };
    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return resources.filter((r) => {
      if (category !== 'all' && r.category !== category) return false;
      if (fundingType !== 'all' && r.fundingType !== fundingType) return false;
      if (!q) return true;
      const haystack = [r.name, r.orgName, r.description, ...(r.tags || [])].join(' ').toLowerCase();
      return haystack.includes(q);
    });
  }, [resources, search, category, fundingType]);

  const handleVisit = (resource) => {
    // Fire-and-forget view counter — don't block the outbound navigation on it.
    updateDocument(resource.id, { viewCount: increment(1) });
    const target = resource.website || (resource.phone ? `tel:${resource.phone}` : resource.email ? `mailto:${resource.email}` : null);
    if (target) window.open(target, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="relative min-h-[45vh] overflow-hidden bg-neutral-950 flex items-center">
        <img src="/images/art-therapy.png" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/35 to-black/45" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[var(--gazra-paper)] to-transparent" />

        <div className="relative z-10 container mx-auto px-4 sm:px-8 py-16">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded border border-primary-200/60 bg-[rgba(251,244,231,0.92)] text-xs font-bold uppercase tracking-wide text-accent-terracotta shadow-sm backdrop-blur-md">
              <HeartHandshake className="w-3.5 h-3.5" />
              LGBTQIA+ Resources Directory
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.05] text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
              Support, When <span className="text-primary-300">You Need It</span>
            </h1>
            <p className="text-base sm:text-lg text-white/85 max-w-xl">
              Legal aid, mental health support, medical care, and job opportunities for the LGBTQIA+ community — from government schemes and trusted NGOs across India.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-10 bg-[var(--gazra-paper)]">
        <div className="container mx-auto px-4 sm:px-8 space-y-5">
          <div className="relative max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, organization, or keyword…"
              className="w-full pl-10 pr-4 py-3 border border-[rgba(184,121,44,0.25)] rounded-lg text-sm focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none bg-white"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  category === c.id ? 'bg-primary-600 text-white shadow' : 'bg-white border border-neutral-200 text-neutral-600 hover:border-primary-300'
                }`}
              >
                <c.icon className="w-3.5 h-3.5" />
                {c.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {FUNDING_TYPES.map((f) => (
              <button
                key={f.id}
                onClick={() => setFundingType(f.id)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  fundingType === f.id ? 'bg-neutral-800 text-white shadow' : 'bg-white border border-neutral-200 text-neutral-600 hover:border-neutral-400'
                }`}
              >
                {f.id === 'government' && <Landmark className="w-3.5 h-3.5" />}
                {f.id === 'private' && <Globe className="w-3.5 h-3.5" />}
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-10 bg-white">
        <div className="container mx-auto px-4 sm:px-8">
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-64 bg-neutral-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 bg-neutral-50 rounded-lg border border-neutral-100">
              <LifeBuoy className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
              <p className="text-neutral-600 font-medium">No resources match your filters</p>
              <p className="text-neutral-400 text-sm mt-1">Try a different search term or category</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} onVisit={handleVisit} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Resources;
