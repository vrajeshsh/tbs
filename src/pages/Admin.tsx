import { useState } from 'react';
import { motion } from 'motion/react';
import SectionHeading from '@/src/components/SectionHeading';
import { LayoutDashboard, FileText, FolderKanban, Users, LogOut, Plus, Trash2, Edit, Download } from 'lucide-react';
import { cn } from '@/src/lib/utils';

type Tab = 'posts' | 'projects' | 'subscribers';

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('posts');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') { // Placeholder password
      setIsLoggedIn(true);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-white border border-brand-ink/5 p-12">
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-brand-ink text-brand-bg flex items-center justify-center rounded-full mx-auto mb-6 font-serif text-2xl font-bold">
              VS
            </div>
            <h2 className="text-3xl font-serif italic">Admin Access.</h2>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-brand-ink/40">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-b border-brand-ink/10 py-3 focus:border-brand-ink outline-none transition-colors font-serif text-lg"
                placeholder="••••••••"
              />
            </div>
            <button className="w-full py-4 bg-brand-ink text-brand-bg text-xs uppercase tracking-widest font-bold hover:bg-brand-accent transition-colors">
              Enter Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Sidebar */}
          <aside className="w-full md:w-64 space-y-2">
            <button 
              onClick={() => setActiveTab('posts')}
              className={cn(
                "w-full flex items-center gap-4 px-6 py-4 text-xs uppercase tracking-widest font-bold transition-all",
                activeTab === 'posts' ? "bg-brand-ink text-brand-bg" : "text-brand-ink/40 hover:bg-brand-ink/5"
              )}
            >
              <FileText size={16} /> Blog Posts
            </button>
            <button 
              onClick={() => setActiveTab('projects')}
              className={cn(
                "w-full flex items-center gap-4 px-6 py-4 text-xs uppercase tracking-widest font-bold transition-all",
                activeTab === 'projects' ? "bg-brand-ink text-brand-bg" : "text-brand-ink/40 hover:bg-brand-ink/5"
              )}
            >
              <FolderKanban size={16} /> Projects
            </button>
            <button 
              onClick={() => setActiveTab('subscribers')}
              className={cn(
                "w-full flex items-center gap-4 px-6 py-4 text-xs uppercase tracking-widest font-bold transition-all",
                activeTab === 'subscribers' ? "bg-brand-ink text-brand-bg" : "text-brand-ink/40 hover:bg-brand-ink/5"
              )}
            >
              <Users size={16} /> Subscribers
            </button>
            <div className="pt-8">
              <button 
                onClick={() => setIsLoggedIn(false)}
                className="w-full flex items-center gap-4 px-6 py-4 text-xs uppercase tracking-widest font-bold text-red-500 hover:bg-red-50 transition-all"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-grow bg-white border border-brand-ink/5 p-10">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-3xl font-serif italic capitalize">{activeTab}</h2>
              {activeTab !== 'subscribers' && (
                <button className="flex items-center gap-2 px-6 py-3 bg-brand-ink text-brand-bg text-[10px] uppercase tracking-widest font-bold hover:bg-brand-accent transition-colors">
                  <Plus size={14} /> Add New
                </button>
              )}
              {activeTab === 'subscribers' && (
                <button className="flex items-center gap-2 px-6 py-3 border border-brand-ink/10 text-brand-ink text-[10px] uppercase tracking-widest font-bold hover:bg-brand-ink hover:text-brand-bg transition-all">
                  <Download size={14} /> Export CSV
                </button>
              )}
            </div>

            {/* Table/List Placeholder */}
            <div className="space-y-4">
              {activeTab === 'posts' && (
                [1, 2, 3].map(i => (
                  <div key={i} className="flex items-center justify-between p-6 border border-brand-ink/5 hover:border-brand-ink/20 transition-all">
                    <div>
                      <h4 className="font-serif text-xl mb-1">Blog Post Title {i}</h4>
                      <p className="text-[10px] uppercase tracking-widest text-brand-ink/30 font-bold">Published: Feb 28, 2026</p>
                    </div>
                    <div className="flex gap-4">
                      <button className="p-2 text-brand-ink/40 hover:text-brand-ink transition-colors"><Edit size={18} /></button>
                      <button className="p-2 text-brand-ink/40 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                    </div>
                  </div>
                ))
              )}

              {activeTab === 'projects' && (
                [1, 2].map(i => (
                  <div key={i} className="flex items-center justify-between p-6 border border-brand-ink/5 hover:border-brand-ink/20 transition-all">
                    <div>
                      <h4 className="font-serif text-xl mb-1">Project Name {i}</h4>
                      <p className="text-[10px] uppercase tracking-widest text-brand-ink/30 font-bold">Featured: Yes</p>
                    </div>
                    <div className="flex gap-4">
                      <button className="p-2 text-brand-ink/40 hover:text-brand-ink transition-colors"><Edit size={18} /></button>
                      <button className="p-2 text-brand-ink/40 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                    </div>
                  </div>
                ))
              )}

              {activeTab === 'subscribers' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-brand-ink/10">
                        <th className="py-4 text-[10px] uppercase tracking-widest font-bold text-brand-ink/40">Email</th>
                        <th className="py-4 text-[10px] uppercase tracking-widest font-bold text-brand-ink/40">Joined</th>
                        <th className="py-4 text-[10px] uppercase tracking-widest font-bold text-brand-ink/40 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[1, 2, 3, 4, 5].map(i => (
                        <tr key={i} className="border-b border-brand-ink/5 hover:bg-brand-ink/5 transition-colors">
                          <td className="py-4 font-serif">subscriber{i}@example.com</td>
                          <td className="py-4 text-xs text-brand-ink/60">Feb 28, 2026</td>
                          <td className="py-4 text-right">
                            <button className="text-red-500 hover:text-red-700 transition-colors"><Trash2 size={16} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
