import React, { useState } from 'react';
import { useDNA } from '../contexts/DNAContext';
import { useClipboard } from '../hooks/useClipboard';
import {
  Search,
  LayoutGrid,
  List,
  Filter,
  ChevronDown,
  Copy,
  Check,
  X,
  ExternalLink,
  Clock,
  User,
  Tag,
  Sparkles,
  Zap,
  FileText,
  MessageSquare,
  Mail,
  Instagram,
  Star,
  TrendingUp,
  Users,
  Target,
  Heart,
  Globe
} from 'lucide-react';
import { tokens } from '../components/UI';

// =============================================================================
// PROMPTS DATABASE (Notion-style)
// =============================================================================

interface NotionPrompt {
  id: string;
  icon: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  type: 'workflow' | 'script' | 'template';
  segment: string[];
  growthVertical: string;
  lastEdited: string;
  createdBy: string;
  usageCount: number;
  isFavorite?: boolean;
}

const NOTION_PROMPTS: NotionPrompt[] = [
  {
    id: '1',
    icon: '📸',
    title: 'Instagram Caption Generator',
    content: `You are a social media expert for {{business_name}}, a {{niche}} located in {{location}}.

Create 3 engaging Instagram captions for a post about [TOPIC].

Requirements:
- Tone: {{tone}}
- Target audience: {{target_audience}}
- Include relevant emojis
- Add a clear call-to-action
- Include 5-10 relevant hashtags
- Keep under 2,200 characters

Format each caption with:
1. Hook (first line that grabs attention)
2. Body (value or story)
3. CTA (what you want them to do)
4. Hashtags (separated)`,
    category: 'Marketing',
    tags: ['social', 'instagram', 'content'],
    type: 'workflow',
    segment: ['hotel', 'agency', 'dmc'],
    growthVertical: 'Brand Visibility',
    lastEdited: '2 hours ago',
    createdBy: 'TravelTech',
    usageCount: 1247,
    isFavorite: true
  },
  {
    id: '2',
    icon: '📧',
    title: 'Welcome Email Sequence',
    content: `You are an email marketing specialist for {{business_name}}.

Create a 3-email welcome sequence for new subscribers.

Context:
- Business: {{niche}} in {{location}}
- Audience: {{target_audience}}
- Tone: {{tone}}

Email 1 (Day 0): Welcome & Brand Story
Email 2 (Day 2): Value Proposition & Social Proof
Email 3 (Day 5): Special Offer & CTA

For each email provide:
- Subject line (A/B versions)
- Preview text
- Body copy
- CTA button text`,
    category: 'Marketing',
    tags: ['email', 'automation', 'nurture'],
    type: 'workflow',
    segment: ['hotel', 'agency', 'resort'],
    growthVertical: 'Customer Acquisition',
    lastEdited: '1 day ago',
    createdBy: 'TravelTech',
    usageCount: 892
  },
  {
    id: '3',
    icon: '⭐',
    title: 'Review Response Generator',
    content: `You are the Guest Relations Manager at {{business_name}}.

Write a personalized response to this guest review:
[PASTE REVIEW HERE]

Guidelines:
- Tone: {{tone}}
- Thank them specifically for what they mentioned
- Address any concerns professionally
- Invite them to return
- Keep it personal, not templated
- Sign with a name and title

If negative review:
- Acknowledge their frustration
- Apologize sincerely
- Offer to make it right (offline)
- Don't be defensive`,
    category: 'Operations',
    tags: ['reviews', 'reputation', 'guest-relations'],
    type: 'script',
    segment: ['hotel', 'resort', 'rental'],
    growthVertical: 'Guest Retention',
    lastEdited: '3 hours ago',
    createdBy: 'TravelTech',
    usageCount: 2341,
    isFavorite: true
  },
  {
    id: '4',
    icon: '🎯',
    title: 'Ideal Customer Profile Builder',
    content: `You are a marketing strategist helping {{business_name}} define their Ideal Customer Profile (ICP).

Based on this information:
- Business type: {{niche}}
- Location: {{location}}
- Current audience: {{target_audience}}

Create a detailed ICP including:

1. Demographics
   - Age range
   - Income level
   - Location/Origin
   - Occupation

2. Psychographics
   - Values & beliefs
   - Lifestyle
   - Travel motivations
   - Decision factors

3. Behavior Patterns
   - Booking lead time
   - Research channels
   - Price sensitivity
   - Loyalty indicators

4. Pain Points & Desires
   - What problems do they have?
   - What experience do they want?
   - What would make them choose you?

5. Where to Find Them
   - Online platforms
   - Publications they read
   - Events they attend`,
    category: 'Strategy',
    tags: ['icp', 'targeting', 'persona'],
    type: 'workflow',
    segment: ['hotel', 'agency', 'dmc', 'dmo'],
    growthVertical: 'Customer Acquisition',
    lastEdited: '5 hours ago',
    createdBy: 'TravelTech',
    usageCount: 567
  },
  {
    id: '5',
    icon: '💰',
    title: 'Upsell Script Generator',
    content: `You are a revenue optimization expert for {{business_name}}.

Create upsell scripts for the following scenarios:

Context:
- Business: {{niche}}
- Guest type: {{target_audience}}
- Tone: {{tone}}

Generate scripts for:

1. **At Booking** - Room upgrade offer
2. **Pre-Arrival** - Add-on services email
3. **Check-in** - In-person upgrade pitch
4. **During Stay** - Experience recommendations
5. **Check-out** - Future booking incentive

Each script should:
- Feel natural, not pushy
- Highlight value, not just price
- Include objection handling
- Have a clear call-to-action`,
    category: 'Sales',
    tags: ['upsell', 'revenue', 'scripts'],
    type: 'script',
    segment: ['hotel', 'resort'],
    growthVertical: 'Sales Conversion',
    lastEdited: '1 day ago',
    createdBy: 'TravelTech',
    usageCount: 1023
  },
  {
    id: '6',
    icon: '📊',
    title: 'Competitor Analysis Framework',
    content: `You are a competitive intelligence analyst for {{business_name}}.

Analyze this competitor: [COMPETITOR NAME/URL]

Create a comprehensive analysis covering:

1. **Positioning**
   - How do they describe themselves?
   - What's their unique value proposition?
   - Who's their target audience?

2. **Pricing Strategy**
   - Rate range
   - Packages offered
   - Discounting approach

3. **Online Presence**
   - Website quality (1-10)
   - Social media activity
   - Review scores & volume

4. **Strengths to Learn From**
   - What do they do well?
   - What do guests praise?

5. **Weaknesses to Exploit**
   - Where do they fall short?
   - What do guests complain about?

6. **Opportunities for {{business_name}}**
   - How can we differentiate?
   - What gaps can we fill?`,
    category: 'Strategy',
    tags: ['competitor', 'analysis', 'research'],
    type: 'workflow',
    segment: ['hotel', 'agency', 'dmc'],
    growthVertical: 'Data Intelligence',
    lastEdited: '2 days ago',
    createdBy: 'TravelTech',
    usageCount: 445
  },
  {
    id: '7',
    icon: '🏷️',
    title: 'Room Description Writer',
    content: `You are a hospitality copywriter for {{business_name}}.

Write compelling room/accommodation descriptions.

Property details:
- Type: {{niche}}
- Location: {{location}}
- Audience: {{target_audience}}
- Tone: {{tone}}

For this room: [ROOM NAME & FEATURES]

Create:

1. **Headline** (max 10 words)
   - Evocative, benefit-focused

2. **Short Description** (50 words)
   - For booking engines, OTAs

3. **Full Description** (150-200 words)
   - Sensory language
   - Paint a picture of the experience
   - Mention key amenities naturally
   - End with a soft CTA

4. **Bullet Points** (5-7)
   - Key features & amenities
   - Use icons/emojis

5. **SEO Meta Description** (155 chars)`,
    category: 'Content',
    tags: ['copywriting', 'rooms', 'descriptions'],
    type: 'template',
    segment: ['hotel', 'resort', 'rental'],
    growthVertical: 'Sales Conversion',
    lastEdited: '4 hours ago',
    createdBy: 'TravelTech',
    usageCount: 1876,
    isFavorite: true
  },
  {
    id: '8',
    icon: '📱',
    title: 'WhatsApp Quick Replies',
    content: `You are a guest communication specialist for {{business_name}}.

Create a set of WhatsApp quick reply templates.

Context:
- Business: {{niche}} in {{location}}
- Tone: {{tone}}
- Audience: {{target_audience}}

Create templates for:

1. **Greeting & Availability Check**
2. **Booking Confirmation**
3. **Pre-Arrival Information**
4. **Check-in Instructions**
5. **During Stay - Need Anything?**
6. **Restaurant/Activity Recommendation**
7. **Check-out Reminder**
8. **Post-Stay Thank You**
9. **Review Request**
10. **Special Offer/Promotion**

Each template:
- Max 160 characters when possible
- Include appropriate emoji
- Have [PLACEHOLDERS] for personalization
- Feel warm and personal`,
    category: 'Operations',
    tags: ['whatsapp', 'templates', 'communication'],
    type: 'script',
    segment: ['hotel', 'resort', 'rental', 'agency'],
    growthVertical: 'Operational Efficiency',
    lastEdited: '6 hours ago',
    createdBy: 'TravelTech',
    usageCount: 2156
  },
  {
    id: '9',
    icon: '🎨',
    title: 'Brand Voice Guidelines',
    content: `You are a brand strategist for {{business_name}}.

Create comprehensive Brand Voice Guidelines.

Current info:
- Business: {{niche}}
- Location: {{location}}
- Target audience: {{target_audience}}
- Desired tone: {{tone}}

Document structure:

1. **Brand Personality**
   - 5 adjectives that describe us
   - If our brand was a person...

2. **Voice Characteristics**
   - How we sound (tone)
   - How we don't sound (anti-tone)

3. **Writing Principles**
   - Dos and Don'ts
   - Word preferences
   - Phrases to use/avoid

4. **Channel Adaptations**
   - Website copy
   - Social media
   - Email
   - In-person

5. **Examples**
   - Before/After rewrites
   - Sample paragraphs`,
    category: 'Strategy',
    tags: ['brand', 'voice', 'guidelines'],
    type: 'workflow',
    segment: ['hotel', 'agency', 'dmc', 'dmo'],
    growthVertical: 'Brand Visibility',
    lastEdited: '1 week ago',
    createdBy: 'TravelTech',
    usageCount: 334
  },
  {
    id: '10',
    icon: '📈',
    title: 'Monthly Report Generator',
    content: `You are a business analyst for {{business_name}}.

Generate a monthly performance report based on these metrics:
[PASTE YOUR METRICS DATA]

Report structure:

1. **Executive Summary**
   - 3 key highlights
   - 1 main challenge
   - 1 recommendation

2. **Key Metrics Dashboard**
   - Occupancy / Bookings
   - Revenue / ADR
   - Review score
   - Direct vs OTA ratio

3. **Channel Performance**
   - By source (direct, Booking, Expedia, etc.)
   - Month-over-month change

4. **Guest Insights**
   - Top markets
   - Average stay length
   - Booking lead time

5. **Action Items**
   - What to continue
   - What to improve
   - What to test

Format with clear headers and bullet points.`,
    category: 'Operations',
    tags: ['reports', 'analytics', 'metrics'],
    type: 'template',
    segment: ['hotel', 'resort', 'agency'],
    growthVertical: 'Data Intelligence',
    lastEdited: '3 days ago',
    createdBy: 'TravelTech',
    usageCount: 678
  },
  {
    id: '11',
    icon: '🤝',
    title: 'Partnership Outreach Email',
    content: `You are a business development manager for {{business_name}}.

Write a partnership outreach email to: [PARTNER TYPE]

Context:
- Your business: {{niche}} in {{location}}
- Target audience overlap: {{target_audience}}
- Tone: {{tone}}

Create:

1. **Subject Line** (3 versions)
   - Intriguing but not clickbait

2. **Email Body**
   - Personal opening (research them)
   - Quick intro of who you are
   - Clear value proposition for THEM
   - Specific collaboration idea
   - Low-commitment next step

3. **Follow-up Email** (if no response)
   - Shorter, add new value

Keep under 150 words. Focus on mutual benefit.`,
    category: 'Sales',
    tags: ['partnerships', 'outreach', 'b2b'],
    type: 'script',
    segment: ['hotel', 'agency', 'dmc', 'dmo'],
    growthVertical: 'Customer Acquisition',
    lastEdited: '2 days ago',
    createdBy: 'TravelTech',
    usageCount: 423
  },
  {
    id: '12',
    icon: '🗓️',
    title: 'Content Calendar Generator',
    content: `You are a content strategist for {{business_name}}.

Create a 30-day content calendar.

Context:
- Business: {{niche}} in {{location}}
- Audience: {{target_audience}}
- Tone: {{tone}}
- Month: [SPECIFY MONTH]

For each day provide:

| Day | Platform | Content Type | Topic | Caption Hook | Hashtags |

Include mix of:
- Educational (tips, how-tos)
- Inspirational (quotes, stories)
- Promotional (offers, CTAs)
- Behind-the-scenes
- User-generated content
- Local highlights

Consider:
- Seasonal events
- Holidays
- Industry events
- Best posting times

Format as a table for easy use.`,
    category: 'Marketing',
    tags: ['content', 'calendar', 'social'],
    type: 'workflow',
    segment: ['hotel', 'agency', 'dmc', 'resort'],
    growthVertical: 'Brand Visibility',
    lastEdited: '1 day ago',
    createdBy: 'TravelTech',
    usageCount: 1534
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
};

const TypeIcons: Record<string, React.ReactNode> = {
  workflow: <Zap className="w-3 h-3" />,
  script: <FileText className="w-3 h-3" />,
  template: <MessageSquare className="w-3 h-3" />,
};

// Notion-style Prompt Card
const PromptCard: React.FC<{
  prompt: NotionPrompt;
  onClick: () => void;
  view: 'gallery' | 'list';
}> = ({ prompt, onClick, view }) => {
  const { dna } = useDNA();
  const { copy, copied } = useClipboard();

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    copy(substituteDNA(prompt.content, dna));
  };

  if (view === 'list') {
    return (
      <div
        onClick={onClick}
        className="group flex items-center gap-4 px-4 py-3 hover:bg-white/[0.03] cursor-pointer border-b border-white/5 transition-colors"
      >
        <span className="text-xl">{prompt.icon}</span>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-white truncate">{prompt.title}</h3>
        </div>
        <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${CategoryColors[prompt.category]}`}>
          {prompt.category}
        </span>
        <div className="flex items-center gap-1 text-zinc-500">
          {prompt.tags.slice(0, 2).map(tag => (
            <span key={tag} className="text-[10px] bg-zinc-800 px-1.5 py-0.5 rounded">{tag}</span>
          ))}
        </div>
        <span className="text-xs text-zinc-600 w-24">{prompt.lastEdited}</span>
        <button
          onClick={handleCopy}
          className="p-1.5 rounded hover:bg-white/10 text-zinc-500 hover:text-white opacity-0 group-hover:opacity-100 transition-all"
        >
          {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className="group p-4 rounded-lg bg-zinc-800/20 hover:bg-zinc-800/40 border border-white/5 hover:border-white/10 cursor-pointer transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-2xl">{prompt.icon}</span>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {prompt.isFavorite && <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />}
          <button
            onClick={handleCopy}
            className="p-1.5 rounded hover:bg-white/10 text-zinc-500 hover:text-white"
          >
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <h3 className="text-sm font-semibold text-white mb-2 leading-snug">{prompt.title}</h3>

      <div className="flex flex-wrap gap-1 mb-3">
        <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${CategoryColors[prompt.category]}`}>
          {prompt.category}
        </span>
        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-zinc-700/50 text-zinc-400 flex items-center gap-1">
          {TypeIcons[prompt.type]} {prompt.type}
        </span>
      </div>

      <div className="flex flex-wrap gap-1 mb-3">
        {prompt.tags.map(tag => (
          <span key={tag} className="text-[10px] text-zinc-500">#{tag}</span>
        ))}
      </div>

      <div className="flex items-center justify-between text-[10px] text-zinc-600 pt-2 border-t border-white/5">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" /> {prompt.lastEdited}
        </span>
        <span className="flex items-center gap-1">
          <TrendingUp className="w-3 h-3" /> {prompt.usageCount}
        </span>
      </div>
    </div>
  );
};

// Notion-style Prompt Drawer
const PromptDrawer: React.FC<{
  prompt: NotionPrompt | null;
  onClose: () => void;
}> = ({ prompt, onClose }) => {
  const { dna } = useDNA();
  const { copy, copied } = useClipboard();
  const [showPersonalized, setShowPersonalized] = useState(true);

  if (!prompt) return null;

  const content = showPersonalized ? substituteDNA(prompt.content, dna) : prompt.content;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-[#191919] border-l border-white/10 z-50 flex flex-col overflow-hidden animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{prompt.icon}</span>
            <div>
              <h2 className="text-lg font-semibold text-white">{prompt.title}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${CategoryColors[prompt.category]}`}>
                  {prompt.category}
                </span>
                <span className="text-xs text-zinc-500">{prompt.growthVertical}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Properties (Notion-style) */}
        <div className="px-6 py-4 border-b border-white/5 space-y-3">
          <div className="flex items-center gap-8 text-sm">
            <div className="flex items-center gap-2 text-zinc-500 w-28">
              <Tag className="w-4 h-4" /> Tags
            </div>
            <div className="flex flex-wrap gap-1">
              {prompt.tags.map(tag => (
                <span key={tag} className="px-2 py-0.5 rounded bg-zinc-800 text-xs text-zinc-300">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-8 text-sm">
            <div className="flex items-center gap-2 text-zinc-500 w-28">
              <Users className="w-4 h-4" /> Segments
            </div>
            <div className="flex flex-wrap gap-1">
              {prompt.segment.map(seg => (
                <span key={seg} className="px-2 py-0.5 rounded bg-zinc-800 text-xs text-zinc-300 capitalize">
                  {seg}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-8 text-sm">
            <div className="flex items-center gap-2 text-zinc-500 w-28">
              <Clock className="w-4 h-4" /> Edited
            </div>
            <span className="text-zinc-300">{prompt.lastEdited}</span>
          </div>
          <div className="flex items-center gap-8 text-sm">
            <div className="flex items-center gap-2 text-zinc-500 w-28">
              <User className="w-4 h-4" /> Created by
            </div>
            <span className="text-zinc-300">{prompt.createdBy}</span>
          </div>
        </div>

        {/* Toggle */}
        <div className="px-6 py-3 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <Sparkles className="w-4 h-4 text-violet-400" />
            Personalize with DNA
          </div>
          <button
            onClick={() => setShowPersonalized(!showPersonalized)}
            className={`w-10 h-5 rounded-full transition-colors ${showPersonalized ? 'bg-violet-500' : 'bg-zinc-700'}`}
          >
            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${showPersonalized ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <pre className="whitespace-pre-wrap text-sm text-zinc-300 font-mono leading-relaxed bg-black/20 rounded-lg p-4 border border-white/5">
            {content}
          </pre>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/5 flex items-center gap-3">
          <button
            onClick={() => copy(content)}
            className="flex-1 h-10 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-medium flex items-center justify-center gap-2 transition-colors"
          >
            {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Prompt</>}
          </button>
          <a
            href="https://chat.openai.com"
            target="_blank"
            rel="noreferrer"
            className="h-10 px-4 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-medium flex items-center gap-2 transition-colors"
          >
            <ExternalLink className="w-4 h-4" /> Open ChatGPT
          </a>
        </div>
      </div>
    </>
  );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const NotionPrompts: React.FC = () => {
  const [view, setView] = useState<'gallery' | 'list'>('gallery');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<NotionPrompt | null>(null);

  const categories = Array.from(new Set(NOTION_PROMPTS.map(p => p.category)));

  const filteredPrompts = NOTION_PROMPTS.filter(prompt => {
    const matchesSearch = prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = !selectedCategory || prompt.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className={`w-full ${tokens.spacing.section} animate-fade-in-up`}>
      {/* Notion-style Header */}
      <div className="flex items-center gap-3 mb-2">
        <span className="text-4xl">📚</span>
        <h1 className="text-3xl font-bold text-white">Prompts Database</h1>
      </div>
      <p className="text-zinc-500 mb-8">
        AI-powered templates personalized with your Business DNA
      </p>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-white/5">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search prompts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-4 rounded-lg bg-zinc-800/50 border border-white/10 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white/20"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <button className="h-9 px-3 rounded-lg bg-zinc-800/50 border border-white/10 text-sm text-zinc-300 flex items-center gap-2 hover:bg-zinc-800">
              <Filter className="w-4 h-4" />
              {selectedCategory || 'All Categories'}
              <ChevronDown className="w-3 h-3" />
            </button>
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
          All ({NOTION_PROMPTS.length})
        </button>
        {categories.map(cat => {
          const count = NOTION_PROMPTS.filter(p => p.category === cat).length;
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
          {filteredPrompts.map(prompt => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              onClick={() => setSelectedPrompt(prompt)}
              view="gallery"
            />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-white/10 overflow-hidden">
          {/* Table Header */}
          <div className="flex items-center gap-4 px-4 py-2 bg-zinc-800/30 border-b border-white/5 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
            <span className="w-8"></span>
            <span className="flex-1">Title</span>
            <span className="w-24">Category</span>
            <span className="w-32">Tags</span>
            <span className="w-24">Edited</span>
            <span className="w-10"></span>
          </div>
          {/* Table Body */}
          {filteredPrompts.map(prompt => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              onClick={() => setSelectedPrompt(prompt)}
              view="list"
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredPrompts.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-zinc-500">No prompts found matching your criteria.</p>
        </div>
      )}

      {/* Drawer */}
      <PromptDrawer prompt={selectedPrompt} onClose={() => setSelectedPrompt(null)} />

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
