import { useState, useEffect } from 'react';
import { useParams, useNavigate } from '../lib/routerCompat';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowLeft, Share2 } from 'lucide-react';
import { FaFacebook, FaTwitter, FaWhatsapp } from 'react-icons/fa';
import { useFirestore } from '../hooks/useFirestore';

const formatDate = (iso) => {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return '';
  }
};

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const { getDocument } = useFirestore('blogs');

  useEffect(() => {
    const loadPost = async () => {
      setLoading(true);
      const result = await getDocument(id);
      if (result.success) setPost(result.data);
      setLoading(false);
    };
    loadPost();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const sharePost = (platform) => {
    const url = window.location.href;
    const text = `Check out this post: ${post?.title}`;
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
    };
    if (shareUrls[platform]) window.open(shareUrls[platform], '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading post...</p>
        </div>
      </div>
    );
  }

  if (!post || post.status !== 'published') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-800 mb-4">Post Not Found</h2>
          <button
            onClick={() => navigate('/blog')}
            className="px-6 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors"
          >
            Back to Blog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <button
          onClick={() => navigate('/blog')}
          className="flex items-center text-neutral-600 hover:text-primary-600 transition-colors duration-300"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Blog
        </button>
      </div>

      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-hard overflow-hidden max-w-4xl mx-auto">
            {post.featuredImage && (
              <div className="h-64 sm:h-96 relative">
                <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white shadow-soft bg-primary-600 capitalize">
                    {post.category}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <div className="relative group">
                    <button className="p-2 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white/40 transition-colors duration-300">
                      <Share2 className="w-5 h-5" />
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-hard opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                      <div className="p-2 space-y-1">
                        <button onClick={() => sharePost('facebook')} className="w-full flex items-center gap-3 px-4 py-2 text-neutral-700 hover:bg-primary-50 rounded-lg transition-colors">
                          <FaFacebook className="w-5 h-5 text-blue-600" /> Facebook
                        </button>
                        <button onClick={() => sharePost('twitter')} className="w-full flex items-center gap-3 px-4 py-2 text-neutral-700 hover:bg-primary-50 rounded-lg transition-colors">
                          <FaTwitter className="w-5 h-5 text-blue-400" /> Twitter
                        </button>
                        <button onClick={() => sharePost('whatsapp')} className="w-full flex items-center gap-3 px-4 py-2 text-neutral-700 hover:bg-primary-50 rounded-lg transition-colors">
                          <FaWhatsapp className="w-5 h-5 text-green-500" /> WhatsApp
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h1 className="text-3xl sm:text-4xl font-display font-bold mb-3">{post.title}</h1>
                  <div className="flex flex-wrap gap-4 text-sm">
                    {post.author && (
                      <span className="flex items-center"><User className="w-4 h-4 mr-2" />{post.author}</span>
                    )}
                    {post.publishedDate && (
                      <span className="flex items-center"><Calendar className="w-4 h-4 mr-2" />{formatDate(post.publishedDate)}</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="p-6 sm:p-8 lg:p-12">
              {!post.featuredImage && (
                <div className="mb-8">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white bg-primary-600 capitalize mb-4">
                    {post.category}
                  </span>
                  <h1 className="text-3xl sm:text-4xl font-display font-bold text-neutral-800 mb-3">{post.title}</h1>
                  <div className="flex flex-wrap gap-4 text-sm text-neutral-500">
                    {post.author && (
                      <span className="flex items-center"><User className="w-4 h-4 mr-2" />{post.author}</span>
                    )}
                    {post.publishedDate && (
                      <span className="flex items-center"><Calendar className="w-4 h-4 mr-2" />{formatDate(post.publishedDate)}</span>
                    )}
                  </div>
                </div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="prose prose-neutral max-w-none"
              >
                {post.content.split('\n').filter(Boolean).map((paragraph, idx) => (
                  <p key={idx} className="text-neutral-700 leading-relaxed mb-4">{paragraph}</p>
                ))}
              </motion.div>

              <div className="flex justify-center pt-8 mt-8 border-t border-neutral-200">
                <button
                  onClick={() => navigate('/blog')}
                  className="px-8 py-4 bg-white border-2 border-neutral-200 text-neutral-700 rounded-xl hover:border-primary-500 hover:text-primary-600 transition-all duration-300 font-semibold"
                >
                  View All Posts
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogDetail;
