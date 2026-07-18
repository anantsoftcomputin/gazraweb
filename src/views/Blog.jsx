import { useState, useEffect, useMemo } from 'react';
import { Link } from '../lib/routerCompat';
import { motion } from 'framer-motion';
import { Calendar, User, FileText, Star, Search, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useFirestore } from '../hooks/useFirestore';

const CATEGORIES = [
  { id: 'all',      label: 'All' },
  { id: 'news',     label: 'News' },
  { id: 'stories',  label: 'Stories' },
  { id: 'updates',  label: 'Updates' },
  { id: 'events',   label: 'Events' },
];

const PAGE_SIZE = 6;

const dateValue = (value) => {
  if (value?.toDate) return value.toDate().getTime();
  if (typeof value?.seconds === 'number') return value.seconds * 1000;
  return new Date(value || 0).getTime() || 0;
};

const formatDate = (iso) => {
  if (!iso) return '';
  try {
    const value = iso?.toDate ? iso.toDate() : (typeof iso?.seconds === 'number' ? new Date(iso.seconds * 1000) : new Date(iso));
    return value.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return '';
  }
};

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCat, setFilterCat] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [page, setPage] = useState(1);
  const { getDocuments } = useFirestore('blogs');

  useEffect(() => {
    const loadPosts = async () => {
      const result = await getDocuments();
      if (result.success) {
        const published = result.data
          .filter(p => p.status === 'published')
          .sort((a, b) => new Date(b.publishedDate || b.createdAt) - new Date(a.publishedDate || a.createdAt));
        setPosts(published);
      }
      setLoading(false);
    };
    loadPosts();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const filteredPosts = useMemo(() => {
    const needle = searchTerm.trim().toLowerCase();
    const matches = posts.filter((post) => {
      if (filterCat !== 'all' && post.category !== filterCat) return false;
      if (!needle) return true;
      const keywords = Array.isArray(post.seoKeywords) ? post.seoKeywords.join(' ') : (post.seoKeywords || '');
      return [post.title, post.excerpt, post.author, post.category, keywords]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(needle);
    });
    return [...matches].sort((a, b) => {
      if (sortOrder === 'featured') return Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || dateValue(b.publishedDate || b.createdAt) - dateValue(a.publishedDate || a.createdAt);
      const difference = dateValue(b.publishedDate || b.createdAt) - dateValue(a.publishedDate || a.createdAt);
      return sortOrder === 'oldest' ? -difference : difference;
    });
  }, [filterCat, posts, searchTerm, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / PAGE_SIZE));
  const displayed = filteredPosts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => { setPage(1); }, [filterCat, searchTerm, sortOrder]);
  useEffect(() => { setPage(current => Math.min(current, totalPages)); }, [totalPages]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      {/* Hero */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-display font-bold text-neutral-800"
          >
            Stories & Updates
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-lg text-neutral-600 max-w-2xl mx-auto"
          >
            News, stories, and updates from Project Gazra and the community we serve.
          </motion.p>
        </div>
      </section>

      {/* Search and filters */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row">
            <label className="relative flex-1">
              <span className="sr-only">Search blog posts</span>
              <Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search stories, topics or keywords…"
                className="w-full rounded-xl border border-neutral-300 py-3 pl-11 pr-11 text-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
              />
              {searchTerm && (
                <button type="button" onClick={() => setSearchTerm('')} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700">
                  <X className="h-4 w-4" />
                </button>
              )}
            </label>
            <label>
              <span className="sr-only">Sort blog posts</span>
              <select value={sortOrder} onChange={(event) => setSortOrder(event.target.value)} className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm font-medium text-neutral-700 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 lg:w-44">
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="featured">Featured first</option>
              </select>
            </label>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setFilterCat(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  filterCat === cat.id
                    ? 'bg-primary-600 text-white shadow'
                    : 'bg-neutral-50 border border-neutral-200 text-neutral-600 hover:border-primary-300 hover:text-primary-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
            {!loading && <span className="ml-auto text-sm text-neutral-500">{filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'}</span>}
          </div>
        </div>
      </div>

      {/* Posts grid */}
      <section className="pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500" />
            </div>
          ) : displayed.length === 0 ? (
            <div className="text-center py-20">
              <FileText className="w-14 h-14 text-neutral-200 mx-auto mb-4" />
              <p className="text-neutral-500 font-medium">No matching posts</p>
              <p className="text-neutral-400 text-sm mt-1">Try a different keyword or category.</p>
              {(searchTerm || filterCat !== 'all') && (
                <button type="button" onClick={() => { setSearchTerm(''); setFilterCat('all'); }} className="mt-4 text-sm font-semibold text-primary-700 hover:text-primary-800">Clear filters</button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayed.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={`/blog/${post.id}`}
                    className="group relative block heritage-paper rounded-lg border border-neutral-300 shadow-lg hover:shadow-xl hover:border-primary-500 hover:-translate-y-2 transition-all duration-300 overflow-hidden h-full"
                  >
                    <div className="heritage-rule absolute left-0 top-0 z-10 h-1 w-full" />
                    <div className="aspect-video bg-neutral-100 relative overflow-hidden">
                      {post.featuredImage ? (
                        <img
                          src={post.featuredImage}
                          alt={post.imageAlt || post.title}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FileText className="w-10 h-10 text-neutral-300" />
                        </div>
                      )}
                      {post.featured && (
                        <span className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 bg-amber-400 text-amber-900 text-[11px] font-bold rounded-full">
                          <Star size={10} className="fill-current" /> Featured
                        </span>
                      )}
                    </div>
                    <div className="p-5">
                      <p className="text-xs font-semibold text-primary-600 uppercase tracking-wide">{post.category}</p>
                      <h3 className="text-lg font-bold text-neutral-800 mt-1.5 line-clamp-2">{post.title}</h3>
                      {post.excerpt && (
                        <p className="text-sm text-neutral-500 mt-2 line-clamp-2">{post.excerpt}</p>
                      )}
                      <div className="flex items-center gap-4 mt-4 text-xs text-neutral-400">
                        {post.author && (
                          <span className="flex items-center gap-1"><User size={12} /> {post.author}</span>
                        )}
                        {post.publishedDate && (
                          <span className="flex items-center gap-1"><Calendar size={12} /> {formatDate(post.publishedDate)}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
          {!loading && filteredPosts.length > PAGE_SIZE && (
            <nav aria-label="Blog pagination" className="mt-10 flex flex-wrap items-center justify-center gap-2">
              <button type="button" onClick={() => setPage(current => Math.max(1, current - 1))} disabled={page === 1} className="inline-flex items-center gap-1 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-semibold text-neutral-700 disabled:cursor-not-allowed disabled:opacity-40">
                <ChevronLeft className="h-4 w-4" /> Previous
              </button>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map(pageNumber => (
                <button key={pageNumber} type="button" onClick={() => setPage(pageNumber)} aria-current={pageNumber === page ? 'page' : undefined} className={`h-10 min-w-10 rounded-lg px-3 text-sm font-bold ${pageNumber === page ? 'bg-primary-600 text-white' : 'border border-neutral-300 bg-white text-neutral-700 hover:border-primary-400'}`}>
                  {pageNumber}
                </button>
              ))}
              <button type="button" onClick={() => setPage(current => Math.min(totalPages, current + 1))} disabled={page === totalPages} className="inline-flex items-center gap-1 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-semibold text-neutral-700 disabled:cursor-not-allowed disabled:opacity-40">
                Next <ChevronRight className="h-4 w-4" />
              </button>
            </nav>
          )}
        </div>
      </section>
    </div>
  );
};

export default Blog;
