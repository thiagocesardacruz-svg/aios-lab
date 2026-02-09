import { LucideIcon } from 'lucide-react';

export type ViewName =
  | 'dashboard'
  | 'my-products'
  | 'dna'
  | 'my-plan'
  | 'goals'
  | 'gpt-experts'
  | 'gpt-tools'
  | 'prompt-library'
  | 'scripts'
  | 'docs'
  | 'platforms'
  | 'profile'
  | 'settings'
  | 'help';

export interface NavItem {
  id: ViewName;
  label: string;
  icon: LucideIcon;
  group: 'MAIN' | 'INTELLIGENCE' | 'RESOURCES' | 'ACCOUNT';
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  type: 'strategy' | 'execution' | 'review';
  date: string; // ISO date or "Today"
  promptTemplate?: string;
  externalLink?: string;
  externalLinkLabel?: string;
  checklist: { id: string; label: string; checked: boolean }[];
}

export interface PlatformStatus {
  id: string;
  name: string;
  status: 'connected' | 'disconnected' | 'error';
  iconUrl?: string; // Placeholder for logic
}

export interface DNAParams {
  companyName: string;
  industry: string;
  targetAudience: string;
  toneOfVoice: string;
}

export interface PromptItem {
  id: string;
  title: string;
  category: 'Marketing' | 'Sales' | 'Ops' | 'HR' | 'Legal';
  content: string;
  tags: string[];
  type: 'workflow' | 'script' | 'link';
  lastModified: string;
  author: string;
  isRecommended?: boolean;
}

export interface GPTResource {
  id: string;
  title: string;
  shortDescription: string;
  category: string;
  icon: LucideIcon;
  color: string; // Tailwind color class for icon bg
  externalUrl: string;
  details: {
    overview: string;
    whenToUse: string[];
    objectives: string[];
    requirements: string[];
    deliverables: string[];
  }
}

export interface TemplateResource {
  id: string;
  title: string;
  purpose: string;
  category: string;
  type: 'Script' | 'Document';
  prompt: string; // The raw prompt template
  instructions: {
    whenToUse: string;
    howToUse: string;
  };
  externalToolLink?: string;
}

export interface PlatformTool {
  id: string;
  title: string;
  platform: 'Instagram' | 'Google Business' | 'Booking.com' | 'LinkedIn' | 'TripAdvisor' | 'WhatsApp';
  category: 'Growth' | 'Content' | 'Support' | 'Sales';
  purpose: string;
  prompt: string;
  instructions: string;
}