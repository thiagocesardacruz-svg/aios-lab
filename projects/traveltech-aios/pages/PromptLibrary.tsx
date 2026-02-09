import React, { useState } from 'react';
import { PromptItem } from '../types';
import { PROMPTS_DATA } from '../constants';
import { useDNA } from '../contexts/DNAContext';
import { useClipboard } from '../hooks/useClipboard';
import {
  Search,
  Sparkles,
  Zap,
  FileText,
  ExternalLink,
  Copy,
  Check,
  Clock,
  User,
  X,
  ChevronRight,
  Tag,
  Wand2
} from 'lucide-react';
import { Button, Card, Chip, tokens } from '../components/UI';

// ============================================================================
// UTILITIES
// ============================================================================

// Highlight DNA variables in prompt text
const highlightVariables = (text: string, dna: any) => {
  const parts = text.split(/(\{\{[^}]+\}\})/g);

  return parts.map((part, i) => {
    const match = part.match(/\{\{([^}]+)\}\}/);
    if (match) {
      const varName = match[1];
      const value = getDNAValue(varName, dna);
      return (
        <span
          key={i}
          className="px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300 font-medium"
          title={value ? `Will be replaced with: ${value}` : 'Variable from your DNA'}
        >
          {part}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
};

// Get DNA value from variable name
const getDNAValue = (varName: string, dna: any): string => {
  if (!dna) return '';
  const mapping: Record<string, string> = {
    business_name: dna.business_name,
    location: dna.location,
    niche: dna.niche,
    target_audience: dna.target_audience,
    tone: dna.tone,
    segment: dna.segment,
  };
  return mapping[varName] || '';
};

// Substitute DNA variables in prompt
const substituteDNA = (text: string, dna: any): string => {
  if (!dna) return text;
  return text
    .replace(/\{\{business_name\}\}/g, dna.business_name || '{{business_name}}')
    .replace(/\{\{location\}\}/g, dna.location || '{{location}}')
    .replace(/\{\{niche\}\}/g, dna.niche || '{{niche}}')
    .replace(/\{\{target_audience\}\}/g, dna.target_audience || '{{target_audience}}')
    .replace(/\{\{tone\}\}/g, dna.tone || '{{tone}}')
    .replace(/\{\{segment\}\}/g, dna.segment || '{{segment}}');
};

// ============================================================================
// COMPONENTS
// ============================================================================

interface PromptDrawerProps {
  prompt: PromptItem | null;
  onClose: () => void;
}

const PromptDrawer: React.FC<PromptDrawerProps> = ({ prompt, onClose }) => {
  const { dna } = useDNA();
  const { copy, copied } = useClipboard();
  const [showPersonalized, setShowPersonalized] = useState(true);

  if (!prompt) return null;

  const displayContent = showPersonalized ? substituteDNA(prompt.content, dna) : prompt.content;

  const handleCopy = () => {
    copy(displayContent);
  };

  const getTypeIcon = (type: PromptItem['type']) => {
    switch (type) {
      case 'workflow':
        return <Zap className="w-5 h-5 text-violet-400" />;
      case 'script':
        return <FileText className="w-5 h-5 text-cyan-400" />;
      case 'link':
        return <ExternalLink className="w-5 h-5 text-emerald-400" />;
    }
  };

  const getTypeColor = (type: PromptItem['type']) => {
    switch (type) {
      case 'workflow':
        return 'text-violet-400 bg-violet-500/10';
      case 'script':
        return 'text-cyan-400 bg-cyan-500/10';
      case 'link':
        return 'text-emerald-400 bg-emerald-500/10';
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-zinc-900 border-l border-white/10 z-50 flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-white/5">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-xl ${getTypeColor(prompt.type)}`}>
              {getTypeIcon(prompt.type)}
            </div>
            <div>
              <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                {prompt.category}
              </span>
              <h2 className="text-xl font-bold text-white mt-1">{prompt.title}</h2>
              <div className="flex items-center gap-4 mt-2 text-sm text-zinc-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {prompt.lastModified}
                </span>
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5" /> {prompt.author}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tags */}
        <div className="px-6 py-4 border-b border-white/5 flex items-center gap-2">
          <Tag className="w-4 h-4 text-zinc-500" />
          {prompt.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 rounded-lg bg-zinc-800 text-xs text-zinc-400"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Toggle */}
        <div className="px-6 py-3 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <Wand2 className="w-4 h-4 text-violet-400" />
            <span className="text-zinc-400">Personalize with your DNA</span>
          </div>
          <button
            onClick={() => setShowPersonalized(!showPersonalized)}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              showPersonalized ? 'bg-violet-500' : 'bg-zinc-700'
            }`}
          >
            <div
              className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                showPersonalized ? 'left-7' : 'left-1'
              }`}
            />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="p-4 rounded-xl bg-black/30 border border-white/5">
            <pre className="whitespace-pre-wrap text-sm text-zinc-300 font-mono leading-relaxed">
              {showPersonalized ? displayContent : highlightVariables(prompt.content, dna)}
            </pre>
          </div>

          {/* DNA Variables Info */}
          {!showPersonalized && (
            <div className="mt-4 p-4 rounded-xl bg-violet-500/10 border border-violet-500/20">
              <p className="text-sm text-violet-300">
                <strong>Variables detected:</strong> These will be replaced with your DNA values when
                personalized.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/5 flex items-center gap-3">
          <Button onClick={handleCopy} className="flex-1">
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2" /> Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" /> Copy Prompt
              </>
            )}
          </Button>
          <button
            onClick={onClose}
            className="px-4 py-3 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const PromptLibrary: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'marketing' | 'sales' | 'ops'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState<PromptItem | null>(null);

  const filteredPrompts = PROMPTS_DATA.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'marketing' && p.category === 'Marketing') ||
      (activeTab === 'sales' && p.category === 'Sales') ||
      (activeTab === 'ops' && (p.category === 'Ops' || p.category === 'HR'));

    return matchesSearch && matchesTab;
  });

  const recommendedPrompts = filteredPrompts.filter((p) => p.isRecommended);
  const listPrompts = filteredPrompts.filter((p) => !p.isRecommended);

  const getTypeIcon = (type: PromptItem['type']) => {
    switch (type) {
      case 'workflow':
        return <Zap className="w-5 h-5 text-violet-400" />;
      case 'script':
        return <FileText className="w-5 h-5 text-cyan-400" />;
      case 'link':
        return <ExternalLink className="w-5 h-5 text-emerald-400" />;
    }
  };

  const getTypeStyle = (type: PromptItem['type']) => {
    switch (type) {
      case 'workflow':
        return 'bg-violet-500/10 border-violet-500/20';
      case 'script':
        return 'bg-cyan-500/10 border-cyan-500/20';
      case 'link':
        return 'bg-emerald-500/10 border-emerald-500/20';
    }
  };

  return (
    <div className={`w-full ${tokens.spacing.section} animate-fade-in-up`}>
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Prompt Library</h1>
          <p className="text-zinc-500">AI-powered templates personalized with your DNA</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative w-full max-w-2xl">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-cyan-500 rounded-2xl blur opacity-20 group-focus-within:opacity-50 transition duration-500"></div>
          <div className="relative flex items-center bg-zinc-900 border border-white/10 rounded-2xl">
            <div className="pl-4 text-zinc-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Search prompts..."
              className="w-full h-12 bg-transparent border-none focus:ring-0 text-white placeholder-zinc-500 px-4"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2">
        {[
          { id: 'all', label: 'All' },
          { id: 'marketing', label: 'Marketing' },
          { id: 'sales', label: 'Sales' },
          { id: 'ops', label: 'Operations' },
        ].map((tab) => (
          <Chip
            key={tab.id}
            label={tab.label}
            selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
          />
        ))}
      </div>

      {/* Recommended */}
      {recommendedPrompts.length > 0 && (
        <div className="animate-fade-in-up">
          <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">
            Recommended for You
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendedPrompts.map((prompt) => (
              <button
                key={prompt.id}
                onClick={() => setSelectedPrompt(prompt)}
                className="relative group p-5 rounded-2xl bg-zinc-900/40 border border-white/5 hover:border-violet-500/30 overflow-hidden transition-all duration-300 text-left"
              >
                <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none" />

                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center border ${getTypeStyle(
                        prompt.type
                      )}`}
                    >
                      {getTypeIcon(prompt.type)}
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-violet-400 transition-colors" />
                  </div>

                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                    {prompt.category}
                  </span>
                  <h4 className="text-base font-bold text-white leading-tight mt-1 group-hover:text-violet-200 transition-colors">
                    {prompt.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-zinc-500 mt-2">
                    <Clock className="w-3 h-3" /> {prompt.lastModified}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* All Prompts List */}
      <div className="animate-fade-in-up">
        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">
          All Prompts ({listPrompts.length})
        </h3>
        <div className="bg-zinc-900/30 rounded-2xl border border-white/5 overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-12 px-6 py-3 bg-white/[0.02] border-b border-white/5 text-[10px] uppercase font-bold text-zinc-500 tracking-widest">
            <div className="col-span-5">Name</div>
            <div className="col-span-2">Category</div>
            <div className="col-span-2">Modified</div>
            <div className="col-span-2">Author</div>
            <div className="col-span-1"></div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-white/5">
            {listPrompts.length > 0 ? (
              listPrompts.map((prompt) => (
                <button
                  key={prompt.id}
                  onClick={() => setSelectedPrompt(prompt)}
                  className="w-full group grid grid-cols-12 items-center px-6 py-4 hover:bg-white/[0.04] transition-colors text-left"
                >
                  <div className="col-span-5 flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${getTypeStyle(prompt.type)}`}>
                      {getTypeIcon(prompt.type)}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">
                        {prompt.title}
                      </h4>
                      <div className="flex items-center gap-1 mt-0.5">
                        {prompt.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="text-[10px] text-zinc-600">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="col-span-2 text-xs text-zinc-500">{prompt.category}</div>
                  <div className="col-span-2 text-xs text-zinc-500">{prompt.lastModified}</div>
                  <div className="col-span-2 text-xs text-zinc-400">{prompt.author}</div>

                  <div className="col-span-1 flex justify-end">
                    <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-violet-400 transition-colors" />
                  </div>
                </button>
              ))
            ) : (
              <div className="p-12 text-center">
                <p className="text-zinc-500 text-sm">No prompts found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Prompt Drawer */}
      <PromptDrawer prompt={selectedPrompt} onClose={() => setSelectedPrompt(null)} />

      {/* Add animation styles */}
      <style>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};
