import React, { useState } from 'react';
import { PromptItem } from '../types';
import { PROMPTS_DATA } from '../constants';
import { 
  Search, 
  Sparkles, 
  Zap, 
  FileText, 
  ExternalLink, 
  Play, 
  Copy, 
  MoreHorizontal,
  Clock,
  User
} from 'lucide-react';
import { Button } from '../components/UI';

export const PromptLibrary: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'recent' | 'shared' | 'favorites'>('recent');
  const [searchQuery, setSearchQuery] = useState('');

  const recommendedPrompts = PROMPTS_DATA.filter(p => p.isRecommended);
  const listPrompts = PROMPTS_DATA.filter(p => !p.isRecommended && p.title.toLowerCase().includes(searchQuery.toLowerCase()));

  // Icon logic based on semantic type
  const getTypeIcon = (type: PromptItem['type']) => {
    switch (type) {
      case 'workflow': return <Zap className="w-5 h-5 text-violet-400" />;
      case 'script': return <FileText className="w-5 h-5 text-cyan-400" />;
      case 'link': return <ExternalLink className="w-5 h-5 text-emerald-400" />;
    }
  };

  const getTypeStyle = (type: PromptItem['type']) => {
    switch (type) {
        case 'workflow': return 'bg-violet-500/10 border-violet-500/20';
        case 'script': return 'bg-cyan-500/10 border-cyan-500/20';
        case 'link': return 'bg-emerald-500/10 border-emerald-500/20';
    }
  };

  return (
    <div className="w-full max-w-full mx-auto pb-20 space-y-12">
      
      {/* 1. HERO SEARCH (The Brain) */}
      <div className="relative w-full max-w-2xl mx-auto mt-6">
        <div className="relative group">
            {/* Glow effect on focus */}
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-cyan-500 rounded-full blur opacity-20 group-focus-within:opacity-75 transition duration-500"></div>
            
            <div className="relative flex items-center bg-zinc-900 border border-white/10 rounded-full shadow-2xl">
                <div className="pl-6 text-zinc-400">
                    <Sparkles className="w-5 h-5" />
                </div>
                <input 
                    type="text" 
                    placeholder="Describe what you want to create..." 
                    className="w-full h-14 bg-transparent border-none focus:ring-0 text-white placeholder-zinc-500 px-4 text-lg"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="pr-2">
                    <button className="p-2 bg-zinc-800 hover:bg-violet-600 rounded-full text-white transition-colors">
                        <Search className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
        <p className="text-center text-zinc-500 text-xs mt-3 tracking-wide">
            Try "Generate a response to a complaint" or "Create a sales script"
        </p>
      </div>

      {/* 2. RECOMMENDED (Smart Suggestions) */}
      <div className="animate-fade-in-up">
        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4 px-1">Recommended for You</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendedPrompts.map(prompt => (
                <div key={prompt.id} className="relative group p-6 rounded-2xl bg-zinc-900/40 border border-white/5 hover:border-violet-500/30 overflow-hidden transition-all duration-300">
                    {/* Blob Effect */}
                    <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-full blur-3xl opacity-0 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none" />
                    
                    <div className="relative z-10 flex flex-col h-full">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${getTypeStyle(prompt.type)}`}>
                                {getTypeIcon(prompt.type)}
                            </div>
                            <button className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/10 hover:bg-white/20 p-2 rounded-lg text-white">
                                <Play className="w-4 h-4 fill-white" />
                            </button>
                        </div>
                        
                        <div className="mt-auto">
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1 block">{prompt.category}</span>
                            <h4 className="text-lg font-bold text-white leading-tight mb-2 group-hover:text-violet-200 transition-colors">
                                {prompt.title}
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-zinc-500">
                                <Clock className="w-3 h-3" /> {prompt.lastModified}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* 3. FILE EXPLORER 2.0 */}
      <div className="flex flex-col animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        
        {/* Tabs */}
        <div className="flex items-center gap-8 border-b border-white/5 px-2 mb-4">
            {['recent', 'shared', 'favorites'].map((tab) => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`pb-3 text-sm font-medium transition-all relative ${
                        activeTab === tab ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    {activeTab === tab && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.5)] rounded-full" />
                    )}
                </button>
            ))}
        </div>

        {/* List Container */}
        <div className="w-full bg-zinc-900/30 rounded-2xl border border-white/5 overflow-hidden backdrop-blur-sm">
            
            {/* List Header */}
            <div className="grid grid-cols-12 px-6 py-3 bg-white/[0.02] border-b border-white/5 text-[10px] uppercase font-bold text-zinc-500 tracking-widest">
                <div className="col-span-6">Name</div>
                <div className="col-span-3">Modified</div>
                <div className="col-span-2">Author</div>
                <div className="col-span-1 text-right">Actions</div>
            </div>

            {/* List Rows */}
            <div className="divide-y divide-white/5">
                {listPrompts.length > 0 ? (
                    listPrompts.map(prompt => (
                        <div key={prompt.id} className="group grid grid-cols-12 items-center px-6 py-4 hover:bg-white/[0.04] transition-colors cursor-pointer">
                            
                            {/* Name Column */}
                            <div className="col-span-6 flex items-center gap-4">
                                <div className={`p-2 rounded-lg ${getTypeStyle(prompt.type).replace('border', '')} bg-opacity-50`}>
                                    {getTypeIcon(prompt.type)}
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">
                                        {prompt.title}
                                    </h4>
                                    <p className="text-xs text-zinc-500 line-clamp-1">{prompt.content.substring(0, 40)}...</p>
                                </div>
                            </div>

                            {/* Modified Column */}
                            <div className="col-span-3 text-xs text-zinc-500">
                                {prompt.lastModified}
                            </div>

                            {/* Author Column */}
                            <div className="col-span-2 flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] text-zinc-400">
                                    <User className="w-3 h-3" />
                                </div>
                                <span className="text-xs text-zinc-400">{prompt.author}</span>
                            </div>

                            {/* Actions Column (Hover Reveal) */}
                            <div className="col-span-1 flex justify-end opacity-0 group-hover:opacity-100 transition-all duration-200">
                                <div className="flex items-center gap-1">
                                    <button className="p-2 rounded-lg hover:bg-violet-600/20 hover:text-violet-400 text-zinc-400 transition-colors" title="Run Prompt">
                                        <Play className="w-4 h-4" />
                                    </button>
                                    <button className="p-2 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors" title="Copy">
                                        <Copy className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                        </div>
                    ))
                ) : (
                    <div className="p-12 text-center">
                        <p className="text-zinc-500 text-sm">No items found matching your criteria.</p>
                    </div>
                )}
            </div>

        </div>

      </div>

    </div>
  );
};