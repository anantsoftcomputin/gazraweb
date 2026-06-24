import { useState, useEffect } from 'react';
import { Link } from '../lib/routerCompat';
import { motion } from 'framer-motion';
import { Calendar, User, FileText, Star } from 'lucide-react';
import { useFirestore } from '../hooks/useFirestore';

const CATEGORIES = [
  { id: 'all',      label: 'All' },
  { id: 'news',     label: 'News' },
  { id: 'stories',  label: 'Stories' },
  { id: 'updates',  label: 'Updates' },
  { id: 'events',   label: 'Events' },
];

const formatDate = (iso) => {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return '';
  }
};

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCat, setFilterCat] = useState('all');
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

  const displayed = filterCat === 'all' ? posts : posts.filter(p => p.category === filterCat);

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

      {/* Category filter */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-2 flex-wrap justify-center mb-10">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setFilterCat(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                filterCat === cat.id
                  ? 'bg-primary-600 text-white shadow'
                  : 'bg-white border border-neutral-200 text-neutral-600 hover:border-primary-300 hover:text-primary-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
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
              <p className="text-neutral-500 font-medium">No posts yet</p>
              <p className="text-neutral-400 text-sm mt-1">Check back soon for updates.</p>
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
                          alt={post.title}
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
        </div>
      </section>
    </div>
  );
};

export default Blog;
