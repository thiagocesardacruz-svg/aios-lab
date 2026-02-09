import React, { useState } from 'react';
import { GPTResource } from '../types';
import { X, ExternalLink, ChevronDown, ChevronRight, CheckCircle2, Box, Target, FileText, Zap } from 'lucide-react';
import { Button, Badge } from './UI';

interface GPTDrawerProps {
  resource: GPTResource | null;
  onClose: () => void;
  type: 'Tool' | 'Expert';
}

export const GPTDrawer: React.FC<GPTDrawerProps> = ({ resource, onClose, type }) => {
  if (!resource) return null;

  const Icon = resource.icon;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Drawer Panel */}
      <div className="relative w-full max-w-xl h-full bg-[#1C1C1F] shadow-2xl border-l border-white/10 flex flex-col transform transition-transform animate-fade-in-up md:animate-none">
        
        {/* Header */}
        <div className="p-8 border-b border-white/5">
            <div className="flex items-start justify-between mb-6">
                 <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center shadow-lg">
                    <Icon className={`w-8 h-8 ${resource.color}`} />
                 </div>
                 <button onClick={onClose} className="p-2 text-zinc-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                    <X className="w-6 h-6" />
                 </button>
            </div>
            
            <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">{resource.title}</h2>
            
            <div className="flex items-center gap-4 mb-6">
                <Badge variant="neutral">{resource.category}</Badge>
                <span className="text-xs text-zinc-500 uppercase tracking-widest">{type}</span>
            </div>

            <p className="text-zinc-400 text-lg leading-relaxed mb-6">
                {resource.shortDescription}
            </p>

            <a href={resource.externalUrl} target="_blank" rel="noreferrer" className="block">
                <Button className="w-full h-12 text-base shadow-violet-500/20" variant="primary">
                    Open GPT {type} <ExternalLink className="ml-2 w-4 h-4" />
                </Button>
            </a>
        </div>

        {/* Notion-Style Body Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-8">
            
            {/* 1. Overview */}
            <Section title="1. Tool Overview" isOpenDefault={true}>
                <div className="p-4 rounded-xl bg-zinc-900/50 border border-white/5 text-zinc-300 leading-relaxed">
                    {resource.details.overview}
                </div>
            </Section>

            {/* 2. When to Use */}
            <Section title="2. When to Use This Tool">
                <ul className="space-y-3">
                    {resource.details.whenToUse.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-zinc-400">
                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cyan-500 shrink-0" />
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            </Section>

            {/* 3. Objectives */}
            <Section title="3. Main Objectives & Outcomes">
                <div className="grid gap-3">
                     {resource.details.objectives.map((item, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                            <Target className="w-4 h-4 text-emerald-500" />
                            <span className="text-zinc-300 text-sm">{item}</span>
                        </div>
                    ))}
                </div>
            </Section>

            {/* 4. Requirements */}
            <Section title="4. What You Need">
                 <div className="grid gap-3">
                     {resource.details.requirements.map((item, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                            <Box className="w-4 h-4 text-amber-500" />
                            <span className="text-zinc-300 text-sm">{item}</span>
                        </div>
                    ))}
                </div>
            </Section>

             {/* 5. Deliverables */}
             <Section title="5. What the Tool Delivers">
                 <div className="grid gap-3">
                     {resource.details.deliverables.map((item, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                            <FileText className="w-4 h-4 text-violet-500" />
                            <span className="text-zinc-300 text-sm">{item}</span>
                        </div>
                    ))}
                </div>
            </Section>

        </div>
      </div>
    </div>
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode; isOpenDefault?: boolean }> = ({ title, children, isOpenDefault = false }) => {
    const [isOpen, setIsOpen] = useState(isOpenDefault);

    return (
        <div className="group">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center gap-2 py-2 text-zinc-200 font-bold hover:text-white transition-colors select-none"
            >
                {isOpen ? <ChevronDown className="w-5 h-5 text-zinc-500" /> : <ChevronRight className="w-5 h-5 text-zinc-500" />}
                {title}
            </button>
            {isOpen && (
                <div className="mt-4 pl-7 animate-fade-in-up duration-200">
                    {children}
                </div>
            )}
        </div>
    );
};