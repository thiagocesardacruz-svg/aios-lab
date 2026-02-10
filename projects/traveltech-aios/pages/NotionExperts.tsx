import React, { useState } from 'react';
import { useDNA } from '../contexts/DNAContext';
import { useClipboard } from '../hooks/useClipboard';
import {
  Search,
  LayoutGrid,
  List,
  ChevronDown,
  Copy,
  Check,
  X,
  ExternalLink,
  MessageSquare,
  Briefcase,
  TrendingUp,
  Users,
  Target,
  Heart,
  Settings,
  PenTool,
  BarChart3,
  Megaphone,
  Share2,
  Zap,
  Star
} from 'lucide-react';
import { tokens } from '../components/UI';

// =============================================================================
// EXPERTS DATABASE (Notion-style)
// =============================================================================

interface NotionExpert {
  id: string;
  icon: string;
  name: string;
  role: string;
  expertise: string;
  category: string;
  tags: string[];
  segment: string[];
  systemPrompt: string;
  starterQuestions: string[];
  useCases: string[];
  status: 'available' | 'beta' | 'coming-soon';
  rating: number;
  conversations: number;
}

const NOTION_EXPERTS: NotionExpert[] = [
  {
    id: 'exp1',
    icon: '🎯',
    name: 'Senior Marketing Strategist',
    role: 'Chief Marketing Officer',
    expertise: 'Brand positioning, campaigns, market analysis',
    category: 'Marketing',
    tags: ['strategy', 'branding', 'campaigns'],
    segment: ['hotel', 'resort', 'agency'],
    systemPrompt: `You are a Senior Marketing Strategist with 20+ years of experience in luxury travel and hospitality.

Your expertise includes:
- Brand positioning and repositioning
- Multi-channel campaign strategy
- Market analysis and segmentation
- Budget allocation and ROI optimization
- Seasonal marketing planning

When advising {{business_name}}, consider:
- Their niche: {{niche}}
- Location: {{location}}
- Target audience: {{target_audience}}
- Desired tone: {{tone}}

Communication style:
- Strategic and data-driven
- Provide frameworks and methodologies
- Ask clarifying questions before giving advice
- Use travel/hospitality industry examples`,
    starterQuestions: [
      'Help me create a marketing strategy for the next quarter',
      'How should I position my property against competitors?',
      'What marketing channels should I prioritize with a limited budget?',
      'Review my current marketing plan and suggest improvements'
    ],
    useCases: [
      'Annual marketing planning',
      'Rebranding initiatives',
      'New market entry',
      'Campaign performance review'
    ],
    status: 'available',
    rating: 4.9,
    conversations: 2341
  },
  {
    id: 'exp2',
    icon: '🔍',
    name: 'SEO & Content Specialist',
    role: 'Digital Marketing Manager',
    expertise: 'SEO, content strategy, travel blogging',
    category: 'Marketing',
    tags: ['seo', 'content', 'blogging'],
    segment: ['hotel', 'dmc', 'dmo'],
    systemPrompt: `You are an SEO and Content Specialist with deep expertise in travel and hospitality digital marketing.

Your expertise includes:
- Technical SEO audits and fixes
- Content strategy and calendar planning
- Travel blog optimization
- Local SEO for hospitality
- Destination keyword research

When advising {{business_name}}, consider:
- Their niche: {{niche}}
- Location: {{location}} (for local SEO)
- Target audience: {{target_audience}}

Communication style:
- Technical but accessible
- Provide actionable recommendations
- Share specific examples and tools
- Focus on quick wins and long-term gains`,
    starterQuestions: [
      'Audit my website for SEO issues',
      'Create a content strategy for my blog',
      'What keywords should I target for my destination?',
      'How can I improve my Google Business Profile?'
    ],
    useCases: [
      'Website SEO audit',
      'Blog content planning',
      'Local search optimization',
      'Competitor keyword analysis'
    ],
    status: 'available',
    rating: 4.8,
    conversations: 1876
  },
  {
    id: 'exp3',
    icon: '✍️',
    name: 'Hospitality Copywriter',
    role: 'Senior Copywriter',
    expertise: 'Descriptions, storytelling, persuasive copy',
    category: 'Content',
    tags: ['copywriting', 'storytelling', 'descriptions'],
    segment: ['hotel', 'resort', 'rental'],
    systemPrompt: `You are a Hospitality Copywriter with a gift for sensory language and emotional storytelling.

Your expertise includes:
- Room and property descriptions
- Website copy that converts
- Email marketing copy
- Brochure and collateral writing
- Brand voice development

When writing for {{business_name}}, embody:
- Their tone: {{tone}}
- Their audience: {{target_audience}}
- Their unique selling points
- The feeling of being at {{location}}

Communication style:
- Evocative and sensory
- Paint pictures with words
- Focus on benefits, not just features
- Make readers feel the experience`,
    starterQuestions: [
      'Write a compelling description for my suite',
      'Improve my website homepage copy',
      'Create an email sequence for abandoned bookings',
      'Help me define my brand voice'
    ],
    useCases: [
      'Room descriptions',
      'Website copy',
      'Email campaigns',
      'OTA listing optimization'
    ],
    status: 'available',
    rating: 4.9,
    conversations: 3102
  },
  {
    id: 'exp4',
    icon: '💰',
    name: 'Revenue Manager',
    role: 'Director of Revenue',
    expertise: 'Pricing, yield management, forecasting',
    category: 'Revenue',
    tags: ['pricing', 'yield', 'forecasting'],
    segment: ['hotel', 'resort'],
    systemPrompt: `You are a Revenue Manager with 15+ years optimizing revenue for hotels and resorts.

Your expertise includes:
- Dynamic pricing strategies
- Yield management optimization
- Demand forecasting
- Channel distribution strategy
- Rate parity management

When advising {{business_name}}, consider:
- Their market: {{location}}
- Their positioning: {{niche}}
- Their target guests: {{target_audience}}
- Competitive landscape

Communication style:
- Data-driven and analytical
- Explain complex concepts simply
- Provide specific recommendations
- Consider seasonality and events`,
    starterQuestions: [
      'Review my pricing strategy for high season',
      'How should I set rates for a new room category?',
      'Analyze my OTA vs direct booking mix',
      'Create a demand forecast for next quarter'
    ],
    useCases: [
      'Seasonal pricing',
      'New product pricing',
      'Channel strategy',
      'Competitive analysis'
    ],
    status: 'available',
    rating: 4.7,
    conversations: 1234
  },
  {
    id: 'exp5',
    icon: '💎',
    name: 'Guest Experience Designer',
    role: 'Director of Guest Experience',
    expertise: 'Journey mapping, touchpoints, service design',
    category: 'Operations',
    tags: ['experience', 'service', 'journey'],
    segment: ['hotel', 'resort', 'rental'],
    systemPrompt: `You are a Guest Experience Designer who creates memorable moments and seamless journeys.

Your expertise includes:
- Guest journey mapping
- Touchpoint optimization
- Service design and standards
- Staff training programs
- Review score improvement

When designing for {{business_name}}, consider:
- Their guests: {{target_audience}}
- Their brand tone: {{tone}}
- Their property type: {{niche}}
- Local experiences in {{location}}

Communication style:
- Empathetic and guest-centric
- Focus on emotions and memories
- Provide practical improvements
- Think end-to-end journey`,
    starterQuestions: [
      'Map my guest journey from booking to checkout',
      'How can I create wow moments on a budget?',
      'Improve my check-in experience',
      'Design a personalization program'
    ],
    useCases: [
      'Journey mapping',
      'Service standards',
      'Staff training',
      'Review improvement'
    ],
    status: 'available',
    rating: 4.8,
    conversations: 987
  },
  {
    id: 'exp6',
    icon: '📱',
    name: 'Social Media Manager',
    role: 'Social Media Director',
    expertise: 'Content creation, engagement, viral campaigns',
    category: 'Marketing',
    tags: ['social', 'content', 'engagement'],
    segment: ['hotel', 'agency', 'dmc', 'resort'],
    systemPrompt: `You are a Social Media Manager specialized in travel and hospitality brands.

Your expertise includes:
- Platform-specific content strategy
- Community engagement tactics
- Influencer collaboration
- UGC campaigns
- Social media advertising

When managing social for {{business_name}}, consider:
- Their brand tone: {{tone}}
- Their audience: {{target_audience}}
- Visual identity and aesthetics
- Local culture of {{location}}

Communication style:
- Creative and trend-aware
- Platform-native recommendations
- Balance organic and paid
- Focus on engagement over vanity metrics`,
    starterQuestions: [
      'Create a content calendar for Instagram',
      'How should I respond to this negative comment?',
      'Plan a UGC campaign for summer',
      'What hashtag strategy should I use?'
    ],
    useCases: [
      'Content planning',
      'Crisis management',
      'Influencer partnerships',
      'Paid social strategy'
    ],
    status: 'available',
    rating: 4.6,
    conversations: 2156
  },
  {
    id: 'exp7',
    icon: '🤝',
    name: 'Sales Director',
    role: 'VP of Sales',
    expertise: 'B2B sales, MICE, corporate accounts',
    category: 'Sales',
    tags: ['b2b', 'mice', 'corporate'],
    segment: ['hotel', 'resort', 'dmc'],
    systemPrompt: `You are a Sales Director with extensive experience in hospitality B2B and MICE markets.

Your expertise includes:
- Corporate account management
- Group and event sales
- Partnership development
- RFP responses
- Sales team management

When advising {{business_name}}, consider:
- Their facilities and capacity
- Their location: {{location}}
- Their niche: {{niche}}
- Target corporate segments

Communication style:
- Professional and relationship-focused
- Understand the B2B sales cycle
- Provide templates and scripts
- Focus on value propositions`,
    starterQuestions: [
      'Help me respond to this corporate RFP',
      'Create a prospecting strategy for corporate accounts',
      'How should I price group bookings?',
      'Design a partnership proposal for travel agencies'
    ],
    useCases: [
      'RFP responses',
      'Corporate prospecting',
      'Group pricing',
      'Partnership development'
    ],
    status: 'available',
    rating: 4.7,
    conversations: 876
  },
  {
    id: 'exp8',
    icon: '⚙️',
    name: 'Operations Consultant',
    role: 'COO Advisor',
    expertise: 'SOPs, processes, efficiency',
    category: 'Operations',
    tags: ['sops', 'processes', 'efficiency'],
    segment: ['hotel', 'resort', 'agency'],
    systemPrompt: `You are an Operations Consultant who optimizes hospitality businesses for efficiency and quality.

Your expertise includes:
- Standard Operating Procedures
- Process mapping and optimization
- Quality management systems
- Staff scheduling and productivity
- Cost reduction strategies

When advising {{business_name}}, consider:
- Their property type: {{niche}}
- Their market: {{location}}
- Their service standards
- Team size and structure

Communication style:
- Systematic and detail-oriented
- Provide templates and checklists
- Focus on measurable improvements
- Consider implementation feasibility`,
    starterQuestions: [
      'Create an SOP for housekeeping',
      'How can I reduce operational costs?',
      'Design a staff training checklist',
      'Optimize my front desk procedures'
    ],
    useCases: [
      'SOP development',
      'Process optimization',
      'Staff training',
      'Cost reduction'
    ],
    status: 'available',
    rating: 4.5,
    conversations: 654
  },
  {
    id: 'exp9',
    icon: '📊',
    name: 'Data Analyst',
    role: 'Business Intelligence Manager',
    expertise: 'Analytics, KPIs, reporting',
    category: 'Strategy',
    tags: ['analytics', 'data', 'reporting'],
    segment: ['hotel', 'agency', 'dmc'],
    systemPrompt: `You are a Data Analyst specialized in hospitality business intelligence.

Your expertise includes:
- KPI definition and tracking
- Dashboard design
- Performance analysis
- Forecasting and trends
- Competitive benchmarking

When analyzing for {{business_name}}, consider:
- Industry benchmarks for {{niche}}
- Market context of {{location}}
- Seasonal patterns
- Their business goals

Communication style:
- Data-driven and objective
- Visualize insights clearly
- Translate data into actions
- Focus on decision-making`,
    starterQuestions: [
      'What KPIs should I track monthly?',
      'Analyze my performance vs competitors',
      'Create a monthly report template',
      'Identify trends in my booking data'
    ],
    useCases: [
      'KPI dashboards',
      'Performance reviews',
      'Market analysis',
      'Forecasting'
    ],
    status: 'available',
    rating: 4.6,
    conversations: 543
  },
  {
    id: 'exp10',
    icon: '🌿',
    name: 'Sustainability Advisor',
    role: 'ESG Consultant',
    expertise: 'Green certifications, eco-practices, reporting',
    category: 'Strategy',
    tags: ['sustainability', 'green', 'esg'],
    segment: ['hotel', 'resort', 'dmo'],
    systemPrompt: `You are a Sustainability Advisor helping hospitality businesses become more environmentally responsible.

Your expertise includes:
- Green certification programs
- Sustainable operations
- Carbon footprint reduction
- ESG reporting
- Eco-marketing

When advising {{business_name}}, consider:
- Their current practices
- Local regulations in {{location}}
- Guest expectations: {{target_audience}}
- Cost-benefit of initiatives

Communication style:
- Passionate but practical
- Focus on quick wins first
- Balance idealism with ROI
- Provide certification roadmaps`,
    starterQuestions: [
      'How do I start a sustainability program?',
      'Which green certification should I pursue?',
      'Calculate my property\'s carbon footprint',
      'Communicate sustainability to guests authentically'
    ],
    useCases: [
      'Certification roadmap',
      'Sustainable operations',
      'Green marketing',
      'ESG reporting'
    ],
    status: 'beta',
    rating: 4.4,
    conversations: 234
  }
];

// =============================================================================
// COMPONENTS
// =============================================================================

const substituteDNA = (text: string, dna: any): string => {
  if (!dna) return text;
  return text
    .replace(/\{\{business_name\}\}/g, dna.business_name || '{{business_name}}')
    .replace(/\{\{location\}\}/g, dna.location || '{{location}}')
    .replace(/\{\{niche\}\}/g, dna.niche || '{{niche}}')
    .replace(/\{\{target_audience\}\}/g, dna.target_audience || '{{target_audience}}')
    .replace(/\{\{tone\}\}/g, dna.tone || '{{tone}}');
};

const CategoryColors: Record<string, string> = {
  Marketing: 'bg-purple-500/10 text-purple-400',
  Sales: 'bg-green-500/10 text-green-400',
  Operations: 'bg-blue-500/10 text-blue-400',
  Strategy: 'bg-orange-500/10 text-orange-400',
  Content: 'bg-pink-500/10 text-pink-400',
  Revenue: 'bg-yellow-500/10 text-yellow-400',
};

const StatusColors: Record<string, string> = {
  available: 'bg-green-500/10 text-green-400',
  beta: 'bg-yellow-500/10 text-yellow-400',
  'coming-soon': 'bg-zinc-500/10 text-zinc-400',
};

// Expert Card
const ExpertCard: React.FC<{
  expert: NotionExpert;
  onClick: () => void;
  view: 'gallery' | 'list';
}> = ({ expert, onClick, view }) => {
  if (view === 'list') {
    return (
      <div
        onClick={onClick}
        className="group flex items-center gap-4 px-4 py-3 hover:bg-white/[0.03] cursor-pointer border-b border-white/5 transition-colors"
      >
        <span className="text-2xl">{expert.icon}</span>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-white">{expert.name}</h3>
          <p className="text-xs text-zinc-500 truncate">{expert.role}</p>
        </div>
        <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${CategoryColors[expert.category]}`}>
          {expert.category}
        </span>
        <div className="flex items-center gap-1 text-yellow-400 text-xs">
          <Star className="w-3 h-3 fill-yellow-400" /> {expert.rating}
        </div>
        <span className="text-xs text-zinc-500 w-24">{expert.conversations} chats</span>
        <span className={`px-2 py-0.5 rounded text-[10px] font-medium capitalize ${StatusColors[expert.status]}`}>
          {expert.status}
        </span>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className="group p-5 rounded-lg bg-zinc-800/20 hover:bg-zinc-800/40 border border-white/5 hover:border-white/10 cursor-pointer transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <span className="text-3xl">{expert.icon}</span>
        <span className={`px-2 py-0.5 rounded text-[10px] font-medium capitalize ${StatusColors[expert.status]}`}>
          {expert.status}
        </span>
      </div>

      <h3 className="text-base font-semibold text-white mb-1">{expert.name}</h3>
      <p className="text-sm text-zinc-400 mb-3">{expert.role}</p>

      <p className="text-xs text-zinc-500 mb-4 line-clamp-2">{expert.expertise}</p>

      <div className="flex flex-wrap gap-1 mb-4">
        <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${CategoryColors[expert.category]}`}>
          {expert.category}
        </span>
        {expert.tags.slice(0, 2).map(tag => (
          <span key={tag} className="px-2 py-0.5 rounded text-[10px] bg-zinc-800 text-zinc-400">
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-white/5">
        <div className="flex items-center gap-1 text-yellow-400 text-xs">
          <Star className="w-3 h-3 fill-yellow-400" /> {expert.rating}
        </div>
        <span className="text-[10px] text-zinc-500">{expert.conversations} conversations</span>
      </div>
    </div>
  );
};

// Expert Drawer
const ExpertDrawer: React.FC<{
  expert: NotionExpert | null;
  onClose: () => void;
}> = ({ expert, onClose }) => {
  const { dna } = useDNA();
  const { copy, copied } = useClipboard();

  if (!expert) return null;

  const systemPrompt = substituteDNA(expert.systemPrompt, dna);

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-[#191919] border-l border-white/10 z-50 flex flex-col overflow-hidden animate-slide-in-right">
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <span className="text-4xl">{expert.icon}</span>
              <div>
                <h2 className="text-xl font-bold text-white">{expert.name}</h2>
                <p className="text-zinc-400">{expert.role}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Properties */}
        <div className="px-6 py-4 border-b border-white/5 space-y-3">
          <div className="flex items-center gap-8 text-sm">
            <span className="text-zinc-500 w-24">Category</span>
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${CategoryColors[expert.category]}`}>
              {expert.category}
            </span>
          </div>
          <div className="flex items-center gap-8 text-sm">
            <span className="text-zinc-500 w-24">Status</span>
            <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${StatusColors[expert.status]}`}>
              {expert.status}
            </span>
          </div>
          <div className="flex items-center gap-8 text-sm">
            <span className="text-zinc-500 w-24">Rating</span>
            <div className="flex items-center gap-1 text-yellow-400">
              <Star className="w-4 h-4 fill-yellow-400" /> {expert.rating} ({expert.conversations} chats)
            </div>
          </div>
          <div className="flex items-center gap-8 text-sm">
            <span className="text-zinc-500 w-24">Segments</span>
            <div className="flex flex-wrap gap-1">
              {expert.segment.map(seg => (
                <span key={seg} className="px-2 py-0.5 rounded bg-zinc-800 text-xs text-zinc-300 capitalize">
                  {seg}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* Expertise */}
          <div>
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Expertise</h3>
            <p className="text-sm text-zinc-300">{expert.expertise}</p>
          </div>

          {/* Use Cases */}
          <div>
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Best For</h3>
            <div className="flex flex-wrap gap-2">
              {expert.useCases.map((useCase, i) => (
                <span key={i} className="px-3 py-1.5 rounded-lg bg-zinc-800/50 text-sm text-zinc-300">
                  {useCase}
                </span>
              ))}
            </div>
          </div>

          {/* Starter Questions */}
          <div>
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Starter Questions</h3>
            <div className="space-y-2">
              {expert.starterQuestions.map((question, i) => (
                <button
                  key={i}
                  onClick={() => copy(question)}
                  className="w-full text-left p-3 rounded-lg bg-zinc-800/30 hover:bg-zinc-800/50 text-sm text-zinc-300 hover:text-white transition-colors group flex items-center justify-between"
                >
                  <span>{question}</span>
                  <Copy className="w-4 h-4 opacity-0 group-hover:opacity-100 text-zinc-500" />
                </button>
              ))}
            </div>
          </div>

          {/* System Prompt */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">System Prompt</h3>
              <button
                onClick={() => copy(systemPrompt)}
                className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1"
              >
                {copied ? <><Check className="w-3 h-3" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
              </button>
            </div>
            <pre className="whitespace-pre-wrap text-xs text-zinc-400 font-mono leading-relaxed bg-black/20 rounded-lg p-4 border border-white/5 max-h-64 overflow-y-auto">
              {systemPrompt}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/5 flex items-center gap-3">
          <a
            href="https://chat.openai.com"
            target="_blank"
            rel="noreferrer"
            className="flex-1 h-10 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <MessageSquare className="w-4 h-4" /> Start Conversation
          </a>
          <button
            onClick={() => copy(systemPrompt)}
            className="h-10 px-4 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-medium flex items-center gap-2 transition-colors"
          >
            <Copy className="w-4 h-4" /> Copy Prompt
          </button>
        </div>
      </div>
    </>
  );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const NotionExperts: React.FC = () => {
  const [view, setView] = useState<'gallery' | 'list'>('gallery');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedExpert, setSelectedExpert] = useState<NotionExpert | null>(null);

  const categories = Array.from(new Set(NOTION_EXPERTS.map(e => e.category)));

  const filteredExperts = NOTION_EXPERTS.filter(expert => {
    const matchesSearch = expert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expert.expertise.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expert.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = !selectedCategory || expert.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className={`w-full ${tokens.spacing.section} animate-fade-in-up`}>
      {/* Notion-style Header */}
      <div className="flex items-center gap-3 mb-2">
        <span className="text-4xl">🤖</span>
        <h1 className="text-3xl font-bold text-white">GPT Experts</h1>
      </div>
      <p className="text-zinc-500 mb-8">
        AI personas trained for specific hospitality roles and expertise areas
      </p>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-white/5">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search experts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-4 rounded-lg bg-zinc-800/50 border border-white/10 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white/20"
          />
        </div>

        {/* View Toggle */}
        <div className="flex items-center rounded-lg bg-zinc-800/50 border border-white/10 p-0.5">
          <button
            onClick={() => setView('gallery')}
            className={`p-1.5 rounded ${view === 'gallery' ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-white'}`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setView('list')}
            className={`p-1.5 rounded ${view === 'list' ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-white'}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            !selectedCategory
              ? 'bg-white text-zinc-900'
              : 'bg-zinc-800/50 text-zinc-400 hover:text-white hover:bg-zinc-800'
          }`}
        >
          All ({NOTION_EXPERTS.length})
        </button>
        {categories.map(cat => {
          const count = NOTION_EXPERTS.filter(e => e.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-white text-zinc-900'
                  : 'bg-zinc-800/50 text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Content */}
      {view === 'gallery' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredExperts.map(expert => (
            <ExpertCard
              key={expert.id}
              expert={expert}
              onClick={() => setSelectedExpert(expert)}
              view="gallery"
            />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-white/10 overflow-hidden">
          {/* Table Header */}
          <div className="flex items-center gap-4 px-4 py-2 bg-zinc-800/30 border-b border-white/5 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
            <span className="w-8"></span>
            <span className="flex-1">Expert</span>
            <span className="w-24">Category</span>
            <span className="w-16">Rating</span>
            <span className="w-24">Conversations</span>
            <span className="w-20">Status</span>
          </div>
          {/* Table Body */}
          {filteredExperts.map(expert => (
            <ExpertCard
              key={expert.id}
              expert={expert}
              onClick={() => setSelectedExpert(expert)}
              view="list"
            />
          ))}
        </div>
      )}

      {/* Drawer */}
      <ExpertDrawer expert={selectedExpert} onClose={() => setSelectedExpert(null)} />

      {/* Animation */}
      <style>{`
        @keyframes slide-in-right {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};
