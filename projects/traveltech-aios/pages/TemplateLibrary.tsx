import React, { useState } from 'react';
import { PageHeader, Button, CopyBlock, Badge, Card, Chip, tokens } from '../components/UI';
import { TemplateResource, DNAParams } from '../types';
import { Search, ChevronRight, Wand2, Info, ExternalLink, X, FileText, MessageSquare } from 'lucide-react';

interface TemplateLibraryProps {
    title: string;
    subtitle: string;
    data: TemplateResource[];
    dna: DNAParams;
}

export const TemplateLibrary: React.FC<TemplateLibraryProps> = ({ title, subtitle, data, dna }) => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState<TemplateResource | null>(null);

    // Extract Categories
    const categories = ['All', ...Array.from(new Set(data.map(i => i.category)))];

    // Filter Logic
    const filteredData = data.filter(item => {
        const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              item.purpose.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Template Processor
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
            {/* Screen 1: Library */}
            <PageHeader
                title={title}
                subtitle={subtitle}
                actions={
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <input
                            type="text"
                            placeholder="Search templates..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`pl-9 pr-4 py-2 h-10 ${tokens.bg.input} border ${tokens.border.default} ${tokens.radius.md} text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-violet-500 w-64 ${tokens.transition.default}`}
                        />
                    </div>
                }
            />

            {/* Filter Chips */}
            <div className="flex flex-wrap items-center gap-2 border-b border-white/5 pb-6">
                {categories.map(cat => (
                    <Chip
                        key={cat}
                        label={cat}
                        selected={selectedCategory === cat}
                        onClick={() => setSelectedCategory(cat)}
                    />
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredData.map(item => (
                    <Card
                        key={item.id}
                        hover
                        onClick={() => setSelectedTemplate(item)}
                        className="group flex flex-col h-full hover:-translate-y-1"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`w-10 h-10 ${tokens.radius.sm} bg-zinc-800/50 border border-white/5 flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:bg-violet-600 ${tokens.transition.default}`}>
                                {item.type === 'Script' ? <MessageSquare className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                            </div>
                            <Badge variant="neutral">{item.category}</Badge>
                        </div>

                        <h3 className={`text-lg font-bold ${tokens.text.primary} group-hover:text-white mb-2 leading-tight`}>
                            {item.title}
                        </h3>

                        <p className={`text-sm ${tokens.text.tertiary} line-clamp-2 mb-6 flex-1`}>
                            {item.purpose}
                        </p>

                        <div className={`flex items-center text-xs font-bold ${tokens.text.tertiary} group-hover:text-violet-400 uppercase tracking-widest ${tokens.transition.default}`}>
                            Open Template <ChevronRight className="w-3 h-3 ml-1" />
                        </div>
                    </Card>
                ))}
            </div>

            {/* Screen 2: Usage (Drawer) */}
            {selectedTemplate && (
                <div className="fixed inset-0 z-[100] flex justify-end">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedTemplate(null)} />
                    
                    <div className="relative w-full max-w-xl h-full bg-[#1C1C1F] shadow-2xl border-l border-white/10 flex flex-col animate-fade-in-up md:animate-none">
                        
                        {/* Drawer Header */}
                        <div className="p-8 border-b border-white/5">
                            <div className="flex justify-between items-start mb-6">
                                <Badge variant="neutral">{selectedTemplate.type}</Badge>
                                <button onClick={() => setSelectedTemplate(null)} className="p-2 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-2 leading-tight">{selectedTemplate.title}</h2>
                            <p className="text-zinc-400 text-lg">{selectedTemplate.purpose}</p>
                        </div>

                        {/* Drawer Body */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-8">
                            
                            {/* Instructions Box */}
                            <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5 space-y-4">
                                <div className="flex items-center gap-2 text-violet-400 font-bold text-xs uppercase tracking-widest">
                                    <Info className="w-4 h-4" /> Instructions
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <span className="block text-xs font-bold text-zinc-500 uppercase mb-1">When to use</span>
                                        <p className="text-sm text-zinc-300">{selectedTemplate.instructions.whenToUse}</p>
                                    </div>
                                    <div>
                                        <span className="block text-xs font-bold text-zinc-500 uppercase mb-1">How to use</span>
                                        <p className="text-sm text-zinc-300">{selectedTemplate.instructions.howToUse}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Prompt Section */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                     <div className="flex items-center gap-2 text-white font-bold text-sm">
                                        <Wand2 className="w-4 h-4 text-cyan-500" />
                                        Ready-to-Use Prompt
                                    </div>
                                    <span className="text-[10px] text-zinc-600 bg-zinc-950 px-2 py-1 rounded border border-zinc-800">
                                        Personalized with DNA
                                    </span>
                                </div>
                                
                                <CopyBlock content={processTemplate(selectedTemplate.prompt)} />
                                
                                <p className="text-xs text-zinc-500">
                                    Copy the text above and paste it into your AI tool. The prompt is already optimized for your company tone and industry.
                                </p>
                            </div>

                        </div>

                        {/* Drawer Footer */}
                        <div className="p-8 border-t border-white/5 bg-black/20">
                            <a href="https://chat.openai.com" target="_blank" rel="noreferrer">
                                <Button className="w-full h-12 text-base shadow-violet-500/20" variant="primary">
                                    Open ChatGPT & Generate <ExternalLink className="ml-2 w-4 h-4" />
                                </Button>
                            </a>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
};