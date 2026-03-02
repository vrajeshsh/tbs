import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Github, ExternalLink, Calendar, Tag } from 'lucide-react';
import { formatDate } from '@/src/lib/utils';

export default function ProjectDetail() {
  const { slug } = useParams();
  
  // In a real app, fetch project by slug
  const project = {
    title: slug?.replace(/-/g, ' ') || 'Project Title',
    description: 'This is a detailed description of the project. It covers the challenges faced, the solutions implemented, and the final results achieved. We used a modern tech stack to ensure high performance and scalability.',
    tech: ['React', 'TypeScript', 'Tailwind', 'Supabase'],
    github: 'https://github.com/vrajeshsh',
    demo: 'https://example.com',
    date: '2026-02-28',
    content: `
      ## The Challenge
      The client needed a way to unify their marketing data from multiple sources. They were struggling with data silos and inconsistent reporting.

      ## The Solution
      We built a custom CDP integration that pulled data from their CRM, email platform, and e-commerce store into a single PostgreSQL database.

      ## The Result
      The client now has a real-time dashboard that shows customer lifetime value, churn rate, and attribution across all channels.
    `
  };

  return (
    <div className="px-6 py-20">
      <div className="max-w-4xl mx-auto">
        <Link to="/projects" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-brand-ink/40 hover:text-brand-ink transition-colors mb-12">
          <ArrowLeft size={14} /> Back to Archive
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-4 mb-6">
            <span className="text-[10px] uppercase tracking-widest font-bold text-brand-ink/30 flex items-center gap-2">
              <Calendar size={12} /> {formatDate(project.date)}
            </span>
            <div className="h-px w-8 bg-brand-ink/10" />
            <div className="flex gap-2">
              {project.tech.map(t => (
                <span key={t} className="text-[10px] uppercase tracking-widest font-bold text-brand-accent flex items-center gap-1">
                  <Tag size={10} /> {t}
                </span>
              ))}
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-serif mb-12 leading-tight capitalize">
            {project.title}
          </h1>

          <div className="aspect-video bg-brand-ink/5 mb-16 relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center text-brand-ink/10 font-serif text-4xl italic">
              Project Media Placeholder
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            <div className="md:col-span-8 prose prose-lg prose-brand-ink">
              <p className="text-xl text-brand-ink/60 leading-relaxed mb-12 italic">
                {project.description}
              </p>
              
              <div className="space-y-8 text-brand-ink/80 leading-relaxed">
                <h2 className="text-3xl font-serif italic">The Challenge</h2>
                <p>The client needed a way to unify their marketing data from multiple sources. They were struggling with data silos and inconsistent reporting.</p>
                
                <h2 className="text-3xl font-serif italic">The Solution</h2>
                <p>We built a custom CDP integration that pulled data from their CRM, email platform, and e-commerce store into a single PostgreSQL database.</p>
                
                <h2 className="text-3xl font-serif italic">The Result</h2>
                <p>The client now has a real-time dashboard that shows customer lifetime value, churn rate, and attribution across all channels.</p>
              </div>
            </div>

            <div className="md:col-span-4">
              <div className="sticky top-32 space-y-8">
                <div className="p-8 border border-brand-ink/5 bg-white">
                  <h4 className="text-xs uppercase tracking-widest font-bold text-brand-ink/40 mb-6">Links</h4>
                  <div className="space-y-4">
                    <a href={project.github} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between text-sm font-bold hover:text-brand-accent transition-colors">
                      GitHub Repository <Github size={16} />
                    </a>
                    <a href={project.demo} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between text-sm font-bold hover:text-brand-accent transition-colors">
                      Live Demo <ExternalLink size={16} />
                    </a>
                  </div>
                </div>

                <div className="p-8 border border-brand-ink/5 bg-white">
                  <h4 className="text-xs uppercase tracking-widest font-bold text-brand-ink/40 mb-6">Stack</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map(t => (
                      <span key={t} className="px-3 py-1 bg-brand-ink/5 text-[10px] uppercase tracking-widest font-bold text-brand-ink/60">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
