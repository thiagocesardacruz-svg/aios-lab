import React, { useState } from 'react';
import { PageHeader, Badge, Button, CopyBlock, Card, Chip, tokens } from '../components/UI';
import { PLATFORM_TOOLS_DATA } from '../constants';
import { PlatformTool, DNAParams } from '../types';
import { Search, ChevronRight, Instagram, Linkedin, Facebook, Youtube, Globe, MapPin, X, Info, Wand2, ExternalLink } from 'lucide-react';

interface PlatformsHubProps {
    dna: DNAParams;
}

export const PlatformsHub: React.FC<PlatformsHubProps> = ({ dna }) => {
  const [selectedPlatform, setSelectedPlatform] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTool, setSelectedTool] = useState<PlatformTool | null>(null);

  // Extract Platforms for the filter chips
  const platforms = ['All', ...Array.from(new Set(PLATFORM_TOOLS_DATA.map(i => i.platform)))];

  // Map icons to platforms
  const getPlatformIcon = (platform: string) => {
      switch(platform) {
          case 'Instagram': return Instagram;
          case 'Facebook': return Facebook;
          case 'LinkedIn': return Linkedin;
          case 'YouTube': return Youtube;
          case 'Google Business': return MapPin;
          default: return Globe;
      }
  };

  const filteredData = PLATFORM_TOOLS_DATA.filter(item => {
      const matchesPlatform = selectedPlatform === 'All' || item.platform === selectedPlatform;
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.purpose.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesPlatform && matchesSearch;
  });

  const processTemplate = (template: string) => {
    let result = template;
    result = result.replace('{{companyName}}', dna.companyName || '[Nome da Empresa]');
    result = result.replace('{{industry}}', dna.industry || '[Indústria]');
    result = result.replace('{{targetAudience}}', dna.targetAudience || '[Público]');
    result = result.replace('{{toneOfVoice}}', dna.toneOfVoice || '[Tom]');
    return result;
  };

  return (
    <div className={`w-full ${tokens.spacing.section} animate-fade-in-up`}>
      <PageHeader
        title="Digital Platforms"
        subtitle="Platform-specific workflows and prompts to master your online presence."
        actions={
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                    type="text"
                    placeholder="Search actions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`pl-9 pr-4 py-2 h-10 ${tokens.bg.input} border ${tokens.border.default} ${tokens.radius.md} text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-violet-500 w-64 ${tokens.transition.default}`}
                />
            </div>
        }
      />

      {/* Filter Chips */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/5 pb-6">
        {platforms.map(p => (
            <Chip
                key={p}
                label={p}
                selected={selectedPlatform === p}
                onClick={() => setSelectedPlatform(p)}
            />
        ))}
      </div>

      {/* 3-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredData.map(tool => {
            const Icon = getPlatformIcon(tool.platform);
            return (
                <Card
                    key={tool.id}
                    hover
                    onClick={() => setSelectedTool(tool)}
                    className="group flex flex-col h-full hover:-translate-y-1"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className={`w-10 h-10 ${tokens.radius.sm} bg-zinc-800/50 border border-white/5 flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:bg-violet-600 ${tokens.transition.default}`}>
                            <Icon className="w-5 h-5" />
                        </div>
                        <Badge variant="neutral">{tool.platform}</Badge>
                    </div>

                    <h3 className={`text-lg font-bold ${tokens.text.primary} group-hover:text-white mb-2 leading-tight`}>
                        {tool.title}
                    </h3>

                    <p className={`text-sm ${tokens.text.tertiary} line-clamp-2 mb-6 flex-1`}>
                        {tool.purpose}
                    </p>

                    <div className={`flex items-center text-xs font-bold ${tokens.text.tertiary} group-hover:text-violet-400 uppercase tracking-widest ${tokens.transition.default}`}>
                        Launch Action <ChevronRight className="w-3 h-3 ml-1" />
                    </div>
                </Card>
            );
        })}
      </div>

      {/* Drawer Detail View */}
      {selectedTool && (
        <div className="fixed inset-0 z-[100] flex justify-end">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedTool(null)} />
            
            <div className="relative w-full max-w-xl h-full bg-[#1C1C1F] shadow-2xl border-l border-white/10 flex flex-col animate-fade-in-up md:animate-none">
                
                {/* Header */}
                <div className="p-8 border-b border-white/5">
                    <div className="flex justify-between items-start mb-6">
                        <Badge variant="neutral">{selectedTool.category}</Badge>
                        <button onClick={() => setSelectedTool(null)} className="p-2 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                         {React.createElement(getPlatformIcon(selectedTool.platform), { className: "w-6 h-6 text-zinc-400" })}
                         <h2 className="text-3xl font-bold text-white leading-tight">{selectedTool.title}</h2>
                    </div>
                    <p className="text-zinc-400 text-lg">{selectedTool.purpose}</p>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-8">
                    
                    <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5 space-y-4">
                        <div className="flex items-center gap-2 text-violet-400 font-bold text-xs uppercase tracking-widest">
                            <Info className="w-4 h-4" /> Instructions
                        </div>
                        <p className="text-sm text-zinc-300">
                            {selectedTool.instructions}
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                             <div className="flex items-center gap-2 text-white font-bold text-sm">
                                <Wand2 className="w-4 h-4 text-cyan-500" />
                                Action Prompt
                            </div>
                            <span className="text-[10px] text-zinc-600 bg-zinc-950 px-2 py-1 rounded border border-zinc-800">
                                DNA Active
                            </span>
                        </div>
                        
                        <CopyBlock content={processTemplate(selectedTool.prompt)} />
                        
                        <p className="text-xs text-zinc-500">
                            Copy this prompt into your preferred AI model to execute this specific platform task.
                        </p>
                    </div>

                </div>

                {/* Footer */}
                <div className="p-8 border-t border-white/5 bg-black/20">
                    <a href="https://chat.openai.com" target="_blank" rel="noreferrer">
                        <Button className="w-full h-12 text-base shadow-violet-500/20" variant="primary">
                            Open ChatGPT & Execute <ExternalLink className="ml-2 w-4 h-4" />
                        </Button>
                    </a>
                </div>

            </div>
        </div>
      )}

    </div>
  );
};