import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, User, Share2 } from 'lucide-react';
import { formatDate } from '@/src/lib/utils';
import ReactMarkdown from 'react-markdown';

export default function BlogDetail() {
  const { slug } = useParams();

  // In a real app, fetch post by slug
  const post = {
    title: slug?.replace(/-/g, ' ') || 'Blog Post Title',
    content: `
# The Future of MarTech Infrastructure

The landscape of marketing technology is shifting. No longer is it enough to simply have a collection of tools; you need a unified infrastructure that allows for seamless data flow and actionable insights.

## The Rise of the "Boring Stack"

We've seen a trend toward what I call the "Boring Stack." These are foundational tools that have stood the test of time. They aren't flashy, but they are reliable, scalable, and well-documented.

### Why Reliability Wins

In a world of shiny new AI tools, the companies that are winning are the ones with the best data foundations. You can't leverage AI effectively if your customer data is scattered across five different platforms with no common identifier.

1. **Data Integrity**: Ensuring your data is clean and consistent.
2. **Scalability**: Building systems that grow with your business.
3. **Actionability**: Turning raw data into clear marketing decisions.

## Conclusion

As we move further into 2026, the focus will continue to shift away from tool acquisition and toward infrastructure optimization. The "Boring Stack" is the secret weapon of high-growth companies.
    `,
    published_at: '2026-02-28',
    author: 'Vrajesh Shah',
    image_url: 'https://picsum.photos/seed/martech/1200/600'
  };

  return (
    <div className="px-6 py-20">
      <div className="max-w-3xl mx-auto">
        <Link to="/blog" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-brand-ink/40 hover:text-brand-ink transition-colors mb-12">
          <ArrowLeft size={14} /> Back to Insights
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-6 mb-8">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-brand-ink/30">
              <Calendar size={12} /> {formatDate(post.published_at)}
            </div>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-brand-ink/30">
              <User size={12} /> By {post.author}
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-serif mb-12 leading-tight capitalize">
            {post.title}
          </h1>

          <div className="aspect-[2/1] bg-brand-ink/5 mb-16 relative overflow-hidden">
            <img 
              src={post.image_url} 
              alt={post.title}
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="prose prose-lg max-w-none text-brand-ink/80 font-serif leading-relaxed prose-headings:font-serif prose-headings:font-normal prose-strong:text-brand-ink prose-a:text-brand-ink">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>

          <div className="mt-20 pt-12 border-t border-brand-ink/5 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-brand-ink rounded-full flex items-center justify-center text-brand-bg font-serif text-xl">
                VS
              </div>
              <div>
                <h4 className="font-serif text-lg italic">Vrajesh Shah</h4>
                <p className="text-xs uppercase tracking-widest text-brand-ink/40 font-bold">MarTech Analyst</p>
              </div>
            </div>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-brand-ink/40 hover:text-brand-ink transition-colors cursor-pointer"
            >
              <Share2 size={14} /> Share Post
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
