import { 
  LayoutDashboard, 
  Map, 
  Library, 
  MessageSquareText, 
  FileText, 
  Share2,
  Fingerprint,
  Bot,
  Wrench,
  User,
  Settings,
  HelpCircle,
  Target,
  Compass,
  Zap,
  Briefcase,
  Users,
  Search,
  PenTool
} from 'lucide-react';
import { NavItem, Task, PlatformStatus, PromptItem, GPTResource, TemplateResource, PlatformTool } from './types';

export const CINEMATIC_BACKGROUNDS = [
  // Iceland / Aurora (Mysterious, Tech)
  "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?q=80&w=2070&auto=format&fit=crop",
  // Bali / Jungle (Growth, Nature)
  "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2070&auto=format&fit=crop",
  // Desert / Dunes (Vastness, Strategy)
  "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=2070&auto=format&fit=crop",
  // Swiss Alps (Clarity, Cold)
  "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=2070&auto=format&fit=crop",
  // Kyoto / Japan (Tradition, Focus)
  "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070&auto=format&fit=crop",
  // Ocean / Maldives (Luxury, Calm)
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop",
  // Amalfi Coast (Vibrant, Travel)
  "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1887&auto=format&fit=crop",
  // Futuristic City / Tokyo (Tech, Speed)
  "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1974&auto=format&fit=crop"
];

export const NAV_ITEMS: NavItem[] = [
  // MAIN
  { id: 'dashboard', label: 'Home', icon: LayoutDashboard, group: 'MAIN' },
  { id: 'dna', label: 'DNA', icon: Fingerprint, group: 'MAIN' },
  { id: 'goals', label: 'Goals', icon: Target, group: 'MAIN' },
  { id: 'my-plan', label: 'My Plan', icon: Map, group: 'MAIN' },

  // INTELLIGENCE
  { id: 'gpt-experts', label: 'GPT Experts', icon: Bot, group: 'INTELLIGENCE' },
  { id: 'gpt-tools', label: 'GPT Tools', icon: Wrench, group: 'INTELLIGENCE' },

  // RESOURCES
  { id: 'prompt-library', label: 'Prompt Library', icon: Library, group: 'RESOURCES' },
  { id: 'scripts', label: 'Message Scripts', icon: MessageSquareText, group: 'RESOURCES' },
  { id: 'docs', label: 'Docs & Policies', icon: FileText, group: 'RESOURCES' },
  { id: 'platforms', label: 'Platforms', icon: Share2, group: 'RESOURCES' },

  // ACCOUNT
  { id: 'profile', label: 'My Profile', icon: User, group: 'ACCOUNT' },
  { id: 'settings', label: 'Settings', icon: Settings, group: 'ACCOUNT' },
  { id: 'help', label: 'Help Center', icon: HelpCircle, group: 'ACCOUNT' },
];

export const MOCK_TASKS: Task[] = [
  {
    id: 't1',
    title: 'Resposta à Review Crítica no TripAdvisor',
    description: 'Um cliente reclamou do ruído na obra vizinha. Precisamos responder com empatia e oferecer um voucher.',
    status: 'pending',
    type: 'review',
    date: 'Hoje',
    externalLink: 'https://tripadvisor.com',
    externalLinkLabel: 'Abrir TripAdvisor',
    promptTemplate: 'Atue como Gerente de Sucesso do Cliente da {{companyName}}. Escreva uma resposta empática para uma avaliação negativa sobre barulho de obra. O tom deve ser {{toneOfVoice}}. Ofereça um voucher de 15% na próxima estadia.',
    checklist: [
      { id: 'c1', label: 'Gerar resposta com IA', checked: false },
      { id: 'c2', label: 'Postar no portal', checked: false },
      { id: 'c3', label: 'Registrar ocorrência no CRM', checked: false }
    ]
  },
  {
    id: 't2',
    title: 'Campanha de E-mail: Feriado Prolongado',
    description: 'Criar e disparar sequência de 3 e-mails para base de leads frios focando no pacote de feriado.',
    status: 'in-progress',
    type: 'execution',
    date: 'Amanhã',
    promptTemplate: 'Atue como Head de Marketing da {{companyName}}. Crie uma sequência de 3 e-mails curtos e persuasivos para reativar leads antigos para o feriado. Foco em escassez. Público alvo: {{targetAudience}}.',
    checklist: [
      { id: 'c1', label: 'Validar copy', checked: true },
      { id: 'c2', label: 'Configurar automação', checked: false }
    ]
  }
];

export const PLATFORMS_DATA: PlatformStatus[] = [
  { id: 'p1', name: 'Instagram', status: 'connected' },
  { id: 'p2', name: 'Google Business', status: 'connected' },
  { id: 'p3', name: 'Booking.com', status: 'error' },
  { id: 'p4', name: 'Salesforce', status: 'disconnected' },
  { id: 'p5', name: 'WhatsApp API', status: 'connected' },
];

export const PLATFORM_TOOLS_DATA: PlatformTool[] = [
  {
    id: 'pt1',
    title: 'Instagram Bio Audit',
    platform: 'Instagram',
    category: 'Growth',
    purpose: 'SEO-optimize your bio to convert more visitors into followers.',
    instructions: 'Copy your current bio into the chat along with this prompt.',
    prompt: 'Act as a Social Media Strategist for {{companyName}}. Review my Instagram Bio for clarity, keyword optimization, and conversion. My target audience is {{targetAudience}}. Suggest 3 improved versions using emojis and strong CTAs.'
  },
  {
    id: 'pt2',
    title: 'Viral Reel Script',
    platform: 'Instagram',
    category: 'Content',
    purpose: 'Create a hook-heavy script for a 30-second Reel.',
    instructions: 'Use this for educational or behind-the-scenes content.',
    prompt: 'Create a 30-second Instagram Reel script for {{companyName}}. Topic: "3 hidden gems in our location". Structure: Hook (3s), Value (20s), Call to Action (7s). Tone: {{toneOfVoice}}.'
  },
  {
    id: 'pt3',
    title: 'Google Review Responder',
    platform: 'Google Business',
    category: 'Support',
    purpose: 'Generate professional responses to 5-star reviews to boost SEO.',
    instructions: 'Paste the customer review after the prompt.',
    prompt: 'Act as the Owner of {{companyName}}. Write a warm, grateful response to a 5-star Google Review. Mention specific keywords related to our industry: {{industry}}. Invite them back soon.'
  },
  {
    id: 'pt4',
    title: 'LinkedIn B2B Outreach',
    platform: 'LinkedIn',
    category: 'Sales',
    purpose: 'Connect with corporate event planners or HR managers.',
    instructions: 'Use this for connection requests (max 300 chars).',
    prompt: 'Write a personalized LinkedIn connection request message to an HR Director. Pitch {{companyName}} as the ideal venue for their next corporate retreat. Tone: Professional and Concise. No fluff.'
  },
  {
    id: 'pt5',
    title: 'Booking.com Description',
    platform: 'Booking.com',
    category: 'Content',
    purpose: 'Revamp room descriptions to focus on experience rather than just amenities.',
    instructions: 'Paste your room amenities list.',
    prompt: 'Rewrite a hotel room description for {{companyName}} on Booking.com. Instead of just listing amenities, describe the *experience* of staying there. Use sensory language. Tone: {{toneOfVoice}}.'
  },
  {
    id: 'pt6',
    title: 'TripAdvisor Crisis Management',
    platform: 'TripAdvisor',
    category: 'Support',
    purpose: 'Diplomatically handle a fake or unfair 1-star review.',
    instructions: 'Do not be defensive. State facts calmly.',
    prompt: 'Act as a Crisis Manager for {{companyName}}. Draft a response to an unfair 1-star review on TripAdvisor. The guest claims the pool was closed, but it was open. Politely correct the record without accusing the guest of lying. Maintain a {{toneOfVoice}} tone.'
  }
];

export const PROMPTS_DATA: PromptItem[] = [
  // Recommended
  {
    id: 'pr1',
    title: 'Instagram Caption Pro',
    category: 'Marketing',
    content: `You are a social media expert for {{business_name}}, a {{niche}} in {{location}}.

Create 3 engaging Instagram caption options for a post about [TOPIC].

Requirements:
- Use a {{tone}} tone that resonates with {{target_audience}}
- Include 3-5 relevant emojis
- Add a compelling call-to-action
- Include 5-8 relevant hashtags
- Keep it under 150 words

Format each option clearly numbered.`,
    tags: ['Social', 'Instagram'],
    type: 'workflow',
    lastModified: '2 mins ago',
    author: 'System AI',
    isRecommended: true
  },
  {
    id: 'pr2',
    title: 'TripAdvisor Review Response',
    category: 'Sales',
    content: `You are the Guest Relations Manager at {{business_name}}, a {{niche}} in {{location}}.

Write a professional response to this TripAdvisor review:
[PASTE REVIEW HERE]

Guidelines:
- Use a {{tone}} tone
- Thank the guest for their feedback
- Address specific points mentioned
- If negative, apologize and offer resolution
- Invite them to return
- Keep it under 150 words
- Sign with your name and title`,
    tags: ['Reviews', 'TripAdvisor'],
    type: 'script',
    lastModified: '1 hour ago',
    author: 'Head of Sales',
    isRecommended: true
  },
  {
    id: 'pr3',
    title: 'Upsell Email Sequence',
    category: 'Marketing',
    content: `You are the Revenue Manager at {{business_name}}.

Create a 3-email upsell sequence for guests who booked a standard room.

Target audience: {{target_audience}}
Tone: {{tone}}

Email 1 (Day of booking): Welcome + Room upgrade offer
Email 2 (3 days before): Experience packages (spa, dining, tours)
Email 3 (Day before): Last-minute add-ons

For each email include:
- Subject line (with emoji)
- Preview text
- Body copy (max 100 words)
- Clear CTA button text`,
    tags: ['Email', 'Revenue'],
    type: 'workflow',
    lastModified: 'Yesterday',
    author: 'Revenue Team',
    isRecommended: true
  },
  // List Items
  {
    id: 'pr4',
    title: 'Guest Complaint Handler',
    category: 'Ops',
    content: `You are the Front Office Manager at {{business_name}}.

A guest has complained about: [DESCRIBE COMPLAINT]

Draft a response that:
1. Acknowledges their frustration
2. Takes ownership of the issue
3. Explains what happened (if known)
4. Offers a specific resolution
5. Provides compensation if appropriate
6. Invites follow-up

Tone: {{tone}}, empathetic, solution-focused
Keep under 200 words.`,
    tags: ['Support', 'Operations'],
    type: 'script',
    lastModified: '3 days ago',
    author: 'Ops Manager'
  },
  {
    id: 'pr5',
    title: 'Welcome Email Sequence',
    category: 'Marketing',
    content: `You are the Marketing Manager at {{business_name}}, a {{niche}} in {{location}}.

Create a 3-part welcome email series for new newsletter subscribers.

Target: {{target_audience}}
Tone: {{tone}}

Email 1: Welcome + Brand story
Email 2: Exclusive tips/content for travelers
Email 3: Special offer for first booking

Include for each:
- Subject line
- Preview text
- Body (150 words max)
- CTA`,
    tags: ['Email', 'Automation'],
    type: 'script',
    lastModified: '1 week ago',
    author: 'Marketing Team'
  },
  {
    id: 'pr6',
    title: 'Booking.com Description Optimizer',
    category: 'Sales',
    content: `You are an OTA optimization specialist for {{business_name}}.

Rewrite this property description for Booking.com:
[PASTE CURRENT DESCRIPTION]

Optimize for:
- SEO keywords relevant to {{location}} and {{niche}}
- Appeal to {{target_audience}}
- Highlight unique selling points
- Use {{tone}} language
- Include amenities and nearby attractions
- Max 1000 characters

Also suggest:
- 5 photo caption ideas
- 3 FAQ questions to add`,
    tags: ['OTA', 'Booking.com'],
    type: 'workflow',
    lastModified: '2 weeks ago',
    author: 'Revenue Team'
  },
  {
    id: 'pr7',
    title: 'Competitor Analysis Report',
    category: 'Marketing',
    content: `You are a market research analyst for {{business_name}} in {{location}}.

Analyze these competitors: [LIST 3-5 COMPETITORS]

Create a report covering:
1. Pricing comparison (rate ranges)
2. Unique selling propositions
3. Online reputation (review scores)
4. Social media presence
5. Key differentiators
6. Opportunities for {{business_name}}

Format as a structured report with actionable recommendations.`,
    tags: ['Strategy', 'Research'],
    type: 'workflow',
    lastModified: 'Oct 12',
    author: 'System AI'
  },
  {
    id: 'pr8',
    title: 'LinkedIn Post Generator',
    category: 'Marketing',
    content: `You are the GM of {{business_name}}, posting on LinkedIn.

Create a thought leadership post about: [TOPIC]

Style:
- Professional but personable ({{tone}})
- Share industry insights or behind-the-scenes
- Include a hook in the first line
- Add 3-5 relevant hashtags
- End with a question to drive engagement
- 150-200 words max`,
    tags: ['Social', 'LinkedIn'],
    type: 'script',
    lastModified: 'Oct 10',
    author: 'Marketing Team'
  },
  {
    id: 'pr9',
    title: 'Staff Training SOP',
    category: 'HR',
    content: `You are the HR Manager at {{business_name}}.

Create a Standard Operating Procedure for: [PROCESS NAME]

Include:
1. Purpose and scope
2. Step-by-step instructions
3. Quality standards
4. Common mistakes to avoid
5. Performance metrics
6. Training checklist

Format for easy printing and posting in staff areas.
Tone: Clear, instructional, brand-aligned ({{tone}})`,
    tags: ['Training', 'SOP'],
    type: 'workflow',
    lastModified: 'Oct 8',
    author: 'HR Manager'
  },
  {
    id: 'pr10',
    title: 'WhatsApp Quick Replies',
    category: 'Sales',
    content: `You are the Reservations Manager at {{business_name}}.

Create 10 WhatsApp quick reply templates for common inquiries:

1. Availability check
2. Rate request
3. Booking confirmation
4. Check-in instructions
5. Directions/parking
6. Amenities info
7. Special requests
8. Cancellation policy
9. Payment options
10. Thank you / Post-stay

Keep each under 160 characters.
Tone: {{tone}}, helpful, concise.
Include 1 emoji per message.`,
    tags: ['WhatsApp', 'Templates'],
    type: 'script',
    lastModified: 'Oct 5',
    author: 'Front Office'
  },
];

export const GPT_TOOLS_DATA: GPTResource[] = [
  {
    id: 'tool1',
    title: 'Ideal Customer Profile Builder',
    shortDescription: 'Build Ideal Customer Profiles with neuroscience and psychology insights.',
    category: 'Strategy',
    icon: Target,
    color: 'text-red-500',
    externalUrl: 'https://chat.openai.com',
    details: {
      overview: 'Craft emotionally intelligent Ideal Customer Profiles using neuromarketing insights to enhance engagement and conversions.',
      whenToUse: [
        'Launching a new product or service.',
        'Refining marketing messages for better conversion.',
        'Entering a new market segment.'
      ],
      objectives: [
        'Define a clear, data-backed customer persona.',
        'Understand psychological triggers of your audience.',
        'Align team on who the target customer actually is.'
      ],
      requirements: [
        'Basic demographic data of current customers.',
        'List of pain points and desired solutions.',
        'Competitor analysis (optional).'
      ],
      deliverables: [
        'A comprehensive PDF Persona Profile.',
        'List of emotional triggers and keywords.',
        'Suggested value propositions.'
      ]
    }
  },
  {
    id: 'tool2',
    title: 'Customer Journey Map',
    shortDescription: 'Map the end-to-end travel experience to find friction points.',
    category: 'Strategy',
    icon: Compass,
    color: 'text-amber-500',
    externalUrl: 'https://chat.openai.com',
    details: {
      overview: 'Visualize the path your customer takes from awareness to post-trip loyalty, identifying key touchpoints for optimization.',
      whenToUse: [
        'Customer satisfaction scores are dropping.',
        'Designing a new service blueprint.',
        'Looking for upsell opportunities.'
      ],
      objectives: [
        'Identify friction points in the booking process.',
        'Optimize touchpoints for higher delight.',
        'Increase repeat booking rates.'
      ],
      requirements: ['Customer feedback logs.', 'Web analytics data.'],
      deliverables: ['Visual Journey Map (ASCII/Text)', 'List of improvement opportunities.']
    }
  },
  {
    id: 'tool3',
    title: 'Neuromarketing Tactics',
    shortDescription: 'Apply behavioral science to your sales copy.',
    category: 'Marketing',
    icon: Zap,
    color: 'text-violet-500',
    externalUrl: 'https://chat.openai.com',
    details: {
      overview: 'Refine your landing pages and emails using principles like Scarcity, Social Proof, and Framing.',
      whenToUse: ['Writing high-stakes sales copy.', 'Optimizing conversion rates.'],
      objectives: ['Boost conversion rates.', 'Reduce cart abandonment.'],
      requirements: ['Draft copy.', 'Conversion goals.'],
      deliverables: ['Revised copy variations.', 'Psychological rationale document.']
    }
  },
  {
    id: 'tool4',
    title: 'Sales Arguments Gen',
    shortDescription: 'Overcome objections with pre-made scripts.',
    category: 'Sales',
    icon: Briefcase,
    color: 'text-blue-500',
    externalUrl: 'https://chat.openai.com',
    details: {
      overview: 'Generate robust responses to common objections like "It is too expensive" or "Not now".',
      whenToUse: ['Training new sales staff.', 'Preparing for a difficult negotiation.'],
      objectives: ['Equip sales team with confidence.', 'Close more deals.'],
      requirements: ['List of common objections.', 'Product pricing/features.'],
      deliverables: ['Script playbook.', 'Objection handling matrix.']
    }
  }
];

export const GPT_EXPERTS_DATA: GPTResource[] = [
  {
    id: 'exp1',
    title: 'Senior Marketing Strategist',
    shortDescription: 'Expert in travel trends, seasonal campaigns, and brand positioning.',
    category: 'Marketing',
    icon: Users,
    color: 'text-emerald-500',
    externalUrl: 'https://chat.openai.com',
    details: {
      overview: 'Act as a CMO with 20 years of experience in the luxury travel sector.',
      whenToUse: ['Planning annual marketing calendar.', 'Rebranding.'],
      objectives: ['Strategic alignment.', 'High-level campaign ideation.'],
      requirements: ['Business goals.', 'Budget constraints.'],
      deliverables: ['Strategic roadmap.', 'Campaign concepts.']
    }
  },
  {
    id: 'exp2',
    title: 'SEO Specialist (Travel)',
    shortDescription: 'Focus on local SEO, travel blogs, and keyword dominance.',
    category: 'Marketing',
    icon: Search,
    color: 'text-cyan-500',
    externalUrl: 'https://chat.openai.com',
    details: {
      overview: 'Technical and content SEO expert specialized in destination marketing.',
      whenToUse: ['Traffic is dropping.', 'Launching a new blog.'],
      objectives: ['Increase organic reach.', 'Rank for destination keywords.'],
      requirements: ['Website URL.', 'Target keywords.'],
      deliverables: ['SEO Audit.', 'Content Plan.']
    }
  },
  {
    id: 'exp3',
    title: 'Copywriter (Hospitality)',
    shortDescription: 'Writes descriptions that make guests smell the coffee and feel the sheets.',
    category: 'Content',
    icon: PenTool,
    color: 'text-pink-500',
    externalUrl: 'https://chat.openai.com',
    details: {
      overview: 'Expert in sensory language and persuasive storytelling for hotels and tours.',
      whenToUse: ['Updating room descriptions.', 'Writing brochureware.'],
      objectives: ['Increase emotional connection.', 'Drive bookings.'],
      requirements: ['Room features.', 'Tone of voice guidelines.'],
      deliverables: ['Polished descriptions.', 'Taglines.']
    }
  }
];

export const SCRIPTS_DATA: TemplateResource[] = [
  {
    id: 'sc1',
    title: 'WhatsApp Welcome Message',
    purpose: 'Greet new leads instantly with a warm, professional tone.',
    category: 'Sales',
    type: 'Script',
    instructions: {
      whenToUse: 'Immediately after a new lead fills a form on the website.',
      howToUse: 'Copy the prompt, paste into ChatGPT, and use the output to configure your WhatsApp Business auto-reply.'
    },
    prompt: 'Act as a Sales Representative for {{companyName}}. Write a short, warm, and professional WhatsApp welcome message for a new lead who just inquired about a trip. Use the tone: {{toneOfVoice}}. End with an open question to start a conversation.'
  },
  {
    id: 'sc2',
    title: 'Cold Call - B2B Partnership',
    purpose: 'Script to break the ice with potential corporate partners.',
    category: 'Sales',
    type: 'Script',
    instructions: {
      whenToUse: 'When calling HR managers or Event Planners to offer corporate travel packages.',
      howToUse: 'Generate the script and practice reading it aloud. Keep it natural.'
    },
    prompt: 'Act as a Senior Sales Executive for {{companyName}}. Write a cold call script to pitch our corporate travel management services to an HR Director. The goal is to book a 15-min demo. Address pain points like cost control and employee safety. Tone: {{toneOfVoice}}.'
  },
  {
    id: 'sc3',
    title: 'Apology for Service Issue',
    purpose: 'De-escalate tension when something goes wrong (e.g., overbooking).',
    category: 'Support',
    type: 'Script',
    instructions: {
      whenToUse: 'When a client complains about a service failure via email or chat.',
      howToUse: 'Use this to draft a personalized apology that acknowledges the specific issue.'
    },
    prompt: 'Act as a Customer Success Manager for {{companyName}}. Write a sincere apology email to a client who experienced a transfer delay. Acknowledge the error, apologize without making excuses, and offer a compensation (e.g., free dinner). Tone: {{toneOfVoice}}.'
  },
  {
    id: 'sc4',
    title: 'Post-Trip Feedback Request',
    purpose: 'Encourage happy clients to leave a 5-star review.',
    category: 'Marketing',
    type: 'Script',
    instructions: {
      whenToUse: '24 hours after the client returns from their trip.',
      howToUse: 'Send via WhatsApp or Email.'
    },
    prompt: 'Act as a Marketing Specialist for {{companyName}}. Write a friendly message asking a client for feedback on their recent trip. If they enjoyed it, ask for a Google Review. Keep it short and sweet. Tone: {{toneOfVoice}}.'
  }
];

export const DOCS_DATA: TemplateResource[] = [
  {
    id: 'doc1',
    title: 'Partnership Agreement',
    purpose: 'Standard contract for new tour operators or agencies.',
    category: 'Legal',
    type: 'Document',
    instructions: {
      whenToUse: 'Onboarding a new B2B partner.',
      howToUse: 'Generate the clauses, review with a lawyer, and add to your standard contract template.'
    },
    prompt: 'Act as a Legal Consultant for {{companyName}} (Industry: {{industry}}). Draft the "Terms and Conditions" section for a Partnership Agreement with a local tour operator. Include clauses on payment terms (Net 30), liability insurance requirements, and cancellation policies. Tone: Formal and Protective.'
  },
  {
    id: 'doc2',
    title: 'SOP: Check-in Process',
    purpose: 'Step-by-step manual for front desk staff.',
    category: 'Operations',
    type: 'Document',
    instructions: {
      whenToUse: 'Training new receptionists or updating the operations manual.',
      howToUse: 'Generate the SOP and print it for the front desk binder.'
    },
    prompt: 'Act as an Operations Manager for {{companyName}}. Write a Standard Operating Procedure (SOP) for the "Guest Check-in Process". Include steps for verifying ID, processing payment, explaining amenities, and handling luggage. Format as a numbered list. Tone: Clear and Instructional.'
  },
  {
    id: 'doc3',
    title: 'Influencer Collaboration Contract',
    purpose: 'Agreement for social media influencers visiting the property.',
    category: 'Marketing',
    type: 'Document',
    instructions: {
      whenToUse: 'Before hosting an influencer for a complimentary stay.',
      howToUse: 'Send this to the influencer to sign before arrival.'
    },
    prompt: 'Act as a Marketing Director for {{companyName}}. Draft a simple agreement for an Influencer Collaboration. Define deliverables (e.g., 3 Stories, 1 Reel), usage rights of content, and what includes the complimentary stay (room + breakfast). Tone: Professional but modern.'
  },
  {
    id: 'doc4',
    title: 'Refund Policy',
    purpose: 'Clear policy text for the website and booking confirmations.',
    category: 'Finance',
    type: 'Document',
    instructions: {
      whenToUse: 'To display on the website footer and invoices.',
      howToUse: 'Generate the text and publish it on your policy page.'
    },
    prompt: 'Act as a Finance Manager for {{companyName}}. Write a clear and fair Refund Policy for our travel bookings. Define non-refundable deposits, cancellation windows (free up to 48h), and force majeure clauses. Tone: Transparent and Trustworthy.'
  }
];