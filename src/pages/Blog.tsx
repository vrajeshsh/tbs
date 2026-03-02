import { motion } from 'motion/react';
import SectionHeading from '@/src/components/SectionHeading';
import { ArrowRight, Mail, Search, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDate, cn } from '@/src/lib/utils';
import { useState, useMemo } from 'react';

const mockPosts = [
  {
    id: '1',
    title: 'The Future of MarTech Infrastructure',
    excerpt: 'Why foundational stacks are becoming the most important asset for small businesses in 2026.',
    published_at: '2026-02-15',
    tags: ['MarTech', 'Strategy'],
    slug: 'future-of-martech'
  },
  {
    id: '2',
    title: 'Building Editorial Experiences with React',
    excerpt: 'How to balance high-end design with technical performance using modern web tools.',
    published_at: '2026-01-28',
    tags: ['Design', 'Development'],
    slug: 'editorial-experiences-react'
  },
  {
    id: '3',
    title: 'The "Boring Stack" Manifesto',
    excerpt: 'A deep dive into why reliability and simplicity win over complex, shiny new tools every time.',
    published_at: '2026-01-10',
    tags: ['Philosophy', 'Infrastructure'],
    slug: 'boring-stack-manifesto'
  }
];

export default function Blog() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [tagSearchQuery, setTagSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('Email is required');
      return false;
    }
    if (!re.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateEmail(email)) {
      setSubscribed(true);
    }
  };
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    mockPosts.forEach(post => post.tags.forEach(tag => tags.add(tag)));
    return Array.from(tags);
  }, []);

  const filteredSidebarTags = useMemo(() => {
    return allTags.filter(tag => tag.toLowerCase().includes(tagSearchQuery.toLowerCase()));
  }, [allTags, tagSearchQuery]);

  const categories = useMemo(() => {
    const cats: Record<string, number> = {};
    mockPosts.forEach(post => {
      post.tags.forEach(tag => {
        cats[tag] = (cats[tag] || 0) + 1;
      });
    });
    return cats;
  }, []);

  const filteredPosts = useMemo(() => {
    return mockPosts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = !activeCategory || post.tags.includes(activeCategory);
      const matchesTag = !activeTag || post.tags.includes(activeTag);

      return matchesSearch && matchesCategory && matchesTag;
    });
  }, [searchQuery, activeCategory, activeTag]);

  return (
    <div className="px-6 py-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          <div className="lg:col-span-8">
            <SectionHeading 
              title="Thoughts & Notes." 
              subtitle="The Blog"
            />

            {/* Active Filters */}
            {(activeCategory || activeTag) && (
              <div className="mb-12 flex gap-4 items-center">
                <span className="text-[10px] uppercase tracking-widest font-bold text-brand-ink/40">Active Filters:</span>
                {activeCategory && (
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveCategory(null)}
                    className="flex items-center gap-2 px-3 py-1 bg-brand-ink text-brand-bg text-[10px] uppercase tracking-widest font-bold cursor-pointer"
                  >
                    Category: {activeCategory} <X size={10} />
                  </motion.button>
                )}
                {activeTag && (
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTag(null)}
                    className="flex items-center gap-2 px-3 py-1 bg-brand-accent text-brand-bg text-[10px] uppercase tracking-widest font-bold cursor-pointer"
                  >
                    Tag: {activeTag} <X size={10} />
                  </motion.button>
                )}
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { setActiveCategory(null); setActiveTag(null); }}
                  className="text-[10px] uppercase tracking-widest font-bold text-brand-ink/40 hover:text-brand-ink underline cursor-pointer"
                >
                  Clear All
                </motion.button>
              </div>
            )}

            <div className="space-y-20">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post, index) => (
                  <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    "group pb-20",
                    index !== filteredPosts.length - 1 && "border-b border-brand-ink/5"
                  )}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-brand-ink/30">
                      {formatDate(post.published_at)}
                    </span>
                    <div className="flex gap-2">
                      {post.tags.map(tag => (
                        <motion.button 
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          key={tag} 
                          onClick={() => setActiveTag(tag)}
                          className="text-[10px] uppercase tracking-widest font-bold text-brand-accent hover:underline cursor-pointer"
                        >
                          {tag}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                  
                  <Link to={`/blog/${post.slug}`}>
                    <h3 className="text-4xl md:text-5xl font-serif mb-6 hover:text-brand-accent transition-colors duration-500">
                      {post.title}
                    </h3>
                  </Link>
                  
                  <p className="text-brand-ink/60 text-lg leading-relaxed mb-8 max-w-2xl">
                    {post.excerpt}
                  </p>
                  
                  <Link to={`/blog/${post.slug}`}>
                    <motion.button
                      whileHover={{ x: 5 }}
                      className="inline-flex items-center gap-3 text-xs uppercase tracking-widest font-bold group/link cursor-pointer"
                    >
                      Read Post <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                    </motion.button>
                  </Link>
                </motion.article>
              ))
            ) : (
              <div className="py-20 text-center">
                <p className="text-brand-ink/40 font-serif text-2xl italic">No posts found</p>
              </div>
            )}
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-32 space-y-12">
              <div className="p-10 border border-brand-ink/5 bg-white">
                <h4 className="text-xs uppercase tracking-widest font-bold text-brand-ink/40 mb-6">Search</h4>
                <div className="relative">
                  <input 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search posts..."
                    className="w-full bg-transparent border-b border-brand-ink/10 py-3 pr-10 text-brand-ink outline-none focus:border-brand-ink transition-colors font-serif"
                  />
                  <Search className="absolute right-0 top-1/2 -translate-y-1/2 text-brand-ink/20" size={18} />
                </div>
              </div>

              <div className="p-10 border border-brand-ink/5 bg-white">
                <h4 className="text-xs uppercase tracking-widest font-bold text-brand-ink/40 mb-6">Tags</h4>
                <div className="mb-6 relative">
                  <input 
                    type="text"
                    value={tagSearchQuery}
                    placeholder="Filter tags..."
                    className="w-full bg-transparent border-b border-brand-ink/10 py-2 pr-8 text-xs uppercase tracking-widest font-bold outline-none focus:border-brand-ink transition-colors"
                    onChange={(e) => setTagSearchQuery(e.target.value)}
                  />
                  <Search className="absolute right-0 top-1/2 -translate-y-1/2 text-brand-ink/20" size={14} />
                </div>
                <div className="flex flex-wrap gap-2">
                  {filteredSidebarTags.map(tag => (
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      key={tag}
                      onClick={() => setActiveTag(tag)}
                      className={cn(
                        "px-3 py-1 text-[10px] uppercase tracking-widest font-bold transition-all cursor-pointer font-serif",
                        activeTag === tag 
                          ? "bg-brand-accent text-brand-bg" 
                          : "border border-brand-ink/10 text-brand-ink hover:bg-brand-ink hover:text-brand-bg"
                      )}
                    >
                      {tag}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="p-10 border border-brand-ink/5 bg-white">
                <h4 className="text-xs uppercase tracking-widest font-bold text-brand-ink/40 mb-6">Categories</h4>
                <ul className="space-y-4 text-sm font-serif">
                  {Object.entries(categories).map(([cat, count]) => (
                    <li 
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={cn(
                        "transition-colors cursor-pointer flex justify-between",
                        activeCategory === cat ? "text-brand-ink font-bold" : "text-brand-ink/40 hover:text-brand-ink"
                      )}
                    >
                      <span>{cat}</span>
                      <span>({count})</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Subscribe Section Moved to Bottom - Full Width */}
        <div className="mt-32 bg-brand-ink text-brand-bg p-12 md:p-20 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto text-center">
            <Mail className="mx-auto mb-8 text-brand-bg/40" size={48} />
            <h4 className="text-4xl md:text-6xl font-serif mb-8 leading-tight">Join the List.</h4>
            <p className="text-brand-bg/60 text-lg mb-12 leading-relaxed">
              Get my latest notes directly in your inbox. No spam, just high-signal updates on MarTech, design, and development.
            </p>
            
            {subscribed ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-brand-accent font-bold text-lg uppercase tracking-widest"
              >
                Thanks for subscribing!
              </motion.div>
            ) : (
              <form onSubmit={handleSubscribe} className="max-w-md mx-auto">
                <div className="relative mb-6">
                  <input 
                    required
                    type="email" 
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) validateEmail(e.target.value);
                    }}
                    onBlur={(e) => validateEmail(e.target.value)}
                    placeholder="email@example.com"
                    className={cn(
                      "w-full bg-transparent border-b py-4 text-brand-bg outline-none transition-colors font-serif text-xl text-center",
                      emailError ? "border-red-500" : "border-brand-bg/20 focus:border-brand-bg"
                    )}
                  />
                  {emailError && (
                    <p className="absolute left-0 right-0 -bottom-6 text-[10px] uppercase tracking-widest font-bold text-red-500">
                      {emailError}
                    </p>
                  )}
                </div>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full py-6 bg-brand-bg text-brand-ink text-xs uppercase tracking-widest font-bold hover:bg-brand-bg/90 transition-colors cursor-pointer"
                >
                  Subscribe Now
                </motion.button>
              </form>
            )}
          </div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-bg/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-bg/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
        </div>
      </div>
    </div>
  );
}
