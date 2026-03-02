import { motion } from 'motion/react';
import { Github, ExternalLink, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/src/lib/utils';

interface ProjectCardProps {
  title: string;
  description: string;
  tech: string[];
  github?: string;
  demo?: string;
  image?: string;
  className?: string;
}

export default function ProjectCard({ title, description, tech, github, demo, image, className }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn("group relative bg-white border border-brand-ink/10 p-8 hover:border-brand-ink/30 transition-all duration-500", className)}
    >
      <div className="flex justify-between items-start mb-8">
        <div className="flex gap-4">
          {github && (
            <a href={github} target="_blank" rel="noopener noreferrer" className="text-brand-ink/60 hover:text-brand-ink transition-colors">
              <Github size={20} />
            </a>
          )}
          {demo && (
            <a href={demo} target="_blank" rel="noopener noreferrer" className="text-brand-ink/60 hover:text-brand-ink transition-colors">
              <ExternalLink size={20} />
            </a>
          )}
        </div>
        <div className="text-[10px] uppercase tracking-widest text-brand-ink/40 font-bold">
          Project / 01
        </div>
      </div>

      <h3 className="text-2xl font-serif mb-4 group-hover:translate-x-2 transition-transform duration-500">
        {title}
      </h3>
      
      <p className="text-brand-ink/80 text-sm leading-relaxed mb-8 line-clamp-3">
        {description}
      </p>

      <div className="flex flex-wrap gap-2 mb-8">
        {tech.slice(0, 4).map((t) => (
          <span key={t} className="text-[10px] uppercase tracking-widest px-2 py-1 bg-brand-ink/10 text-brand-ink/80 rounded">
            {t}
          </span>
        ))}
      </div>

      <Link to={`/projects/${title.toLowerCase().replace(/\s+/g, '-')}`} className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-bold group/link">
        View Details 
        <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
      </Link>
    </motion.div>
  );
}
