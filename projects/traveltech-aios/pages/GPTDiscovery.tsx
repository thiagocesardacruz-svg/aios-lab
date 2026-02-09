import React, { useState } from 'react';
import { GPTResource } from '../types';
import { PageHeader, Badge } from '../components/UI';
import { Search, ChevronRight } from 'lucide-react';
import { GPTDrawer } from '../components/GPTDrawer';

interface GPTDiscoveryProps {
    title: string;
    subtitle: string;
    data: GPTResource[];
    type: 'Tool' | 'Expert';
}

export const GPTDiscovery: React.FC<GPTDiscoveryProps> = ({ title, subtitle, data, type }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResource, setSelectedResource] = useState<GPTResource | null>(null);

  // Extract Categories
  const categories = ['All', ...Array.from(new Set(data.map(i => i.category)))];

  // Filter Logic
  const filteredData = data.filter(item => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full max-w-full mx-auto pb-20">
      <PageHeader 
        title={title} 
        subtitle={subtitle}
        actions={
            <div className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                 <input 
                    type="text" 
                    placeholder="Search..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 h-10 bg-zinc-900/50 border border-white/10 rounded-xl text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-violet-500 w-64 transition-all" 
                />
            </div>
        }
      />

      {/* Tabs / Chips */}
      <div className="flex flex-wrap items-center gap-2 mb-8 border-b border-white/5 pb-6">
        {categories.map(cat => (
            <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 border ${
                    selectedCategory === cat 
                    ? 'bg-white text-zinc-950 border-white shadow-lg shadow-white/10' 
                    : 'bg-zinc-900/50 text-zinc-400 border-white/5 hover:bg-zinc-800 hover:text-zinc-200'
                }`}
            >
                {cat}
            </button>
        ))}
      </div>

      {/* Grid Layout - Standardized to 3 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredData.map(resource => {
            const Icon = resource.icon;
            return (
                <div 
                    key={resource.id}
                    onClick={() => setSelectedResource(resource)}
                    className="group flex flex-col p-6 rounded-2xl bg-zinc-900/40 border border-white/5 hover:border-violet-500/30 hover:bg-zinc-800/60 cursor-pointer transition-all duration-300 hover:-translate-y-1 h-full"
                >
                    <div className="flex items-start justify-between mb-4">
                        <div className="w-10 h-10 rounded-lg bg-zinc-800/50 border border-white/5 flex items-center justify-center">
                            <Icon className={`w-5 h-5 ${resource.color}`} />
                        </div>
                        <Badge variant="neutral">{resource.category}</Badge>
                    </div>

                    <h3 className="text-lg font-bold text-zinc-200 group-hover:text-white mb-2 leading-tight">
                        {resource.title}
                    </h3>
                    
                    <p className="text-sm text-zinc-500 leading-relaxed line-clamp-2 mb-6 flex-1">
                        {resource.shortDescription}
                    </p>

                    <div className="flex items-center text-xs font-bold text-zinc-500 group-hover:text-violet-400 uppercase tracking-widest transition-colors">
                        View Details <ChevronRight className="w-3 h-3 ml-1" />
                    </div>
                </div>
            )
        })}
      </div>

      {/* Empty State */}
      {filteredData.length === 0 && (
          <div className="py-20 text-center text-zinc-500">
              <p>No resources found matching your search.</p>
          </div>
      )}

      {/* Layer 2: Notion-Style Panel */}
      <GPTDrawer 
        resource={selectedResource} 
        onClose={() => setSelectedResource(null)}
        type={type}
      />
    </div>
  );
};