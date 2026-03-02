import { useState } from 'react';
import { motion } from 'motion/react';
import SectionHeading from '@/src/components/SectionHeading';
import ProjectCard from '@/src/components/ProjectCard';
import { projects } from '@/src/data/projects';
import { ArrowRight } from 'lucide-react';

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredProjects = activeFilter === 'All' 
    ? projects 
    : projects.filter(p => p.category === activeFilter);

  return (
    <div className="px-6 py-20">
      <div className="max-w-7xl mx-auto">
        <SectionHeading 
          title="The Archive." 
          subtitle="Stuff I've Built"
        />

        <div className="mb-12 flex flex-wrap gap-4">
          {['All', 'MarTech', 'Development'].map(filter => (
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-2 text-[10px] uppercase tracking-widest font-bold transition-all cursor-pointer ${
                activeFilter === filter 
                  ? 'bg-brand-ink text-brand-bg' 
                  : 'border border-brand-ink/10 text-brand-ink hover:bg-brand-ink hover:text-brand-bg'
              }`}
            >
              {filter}
            </motion.button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <ProjectCard 
              key={project.id}
              title={project.title}
              description={project.description}
              tech={project.tech}
              github={project.github}
              image={project.image}
              className={index === 0 ? "md:col-span-2 lg:col-span-1" : ""}
            />
          ))}
        </div>

        <section className="mt-32 py-20 border-t border-brand-ink/10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6">
              <h3 className="text-4xl font-serif mb-6">Got a cool idea?</h3>
              <p className="text-brand-ink/60 leading-relaxed mb-8">
                I'm always down to chat about new projects, creative ideas, or how to make your tech stack less of a nightmare.
              </p>
              <motion.a 
                whileHover={{ x: 5 }}
                href="/about#contact" 
                className="inline-flex items-center gap-3 text-xs uppercase tracking-widest font-bold cursor-pointer"
              >
                Let's talk <ArrowRight size={14} />
              </motion.a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
