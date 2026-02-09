import React from 'react';
import { useDNA } from '../contexts/DNAContext';
import { Button, Badge, Card, IconBox, tokens } from '../components/UI';
import { Task, ViewName } from '../types';
import { MOCK_TASKS } from '../constants';
import {
  ArrowRight,
  Zap,
  Map,
  Wand2,
  Target,
  Sparkles,
  ChevronRight,
  MessageSquare,
  BarChart3
} from 'lucide-react';

interface DashboardProps {
  onOpenTask: (task: Task) => void;
  onNavigate: (view: ViewName) => void;
}

const QUICK_ACTIONS = [
  { id: 'prompt', icon: MessageSquare, label: 'Generate Response', view: 'prompt-library' as ViewName, color: 'violet' },
  { id: 'expert', icon: Sparkles, label: 'Ask Expert', view: 'gpt-experts' as ViewName, color: 'cyan' },
  { id: 'goals', icon: Target, label: 'View Goals', view: 'goals' as ViewName, color: 'emerald' },
  { id: 'analytics', icon: BarChart3, label: 'Analytics', view: 'my-plan' as ViewName, color: 'orange' },
];

export const Dashboard: React.FC<DashboardProps> = ({ onOpenTask, onNavigate }) => {
  const { dna } = useDNA();

  const pendingTasks = MOCK_TASKS.filter((t) => t.status !== 'completed');
  const priorityTask = pendingTasks[0];
  const nextTasks = pendingTasks.slice(1, 3);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (!priorityTask) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[70vh] text-center">
        <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-6 border border-white/5">
          <span className="text-4xl">🎉</span>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">All caught up!</h1>
        <p className="text-zinc-400 mb-8">You have completed all scheduled tasks for now.</p>
        <Button onClick={() => onNavigate('my-plan')}>View Future Plan</Button>
      </div>
    );
  }

  return (
    <div className={`w-full ${tokens.spacing.section} animate-fade-in-up`}>
      {/* Header with DNA context */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-zinc-500 text-sm mb-1">{greeting()}</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            {dna?.business_name || 'Welcome'}
          </h1>
          {dna?.location && (
            <p className="text-zinc-400 mt-1">
              {dna.niche} • {dna.location}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => onNavigate('dna')}>
            Edit DNA
          </Button>
          <Button onClick={() => onNavigate('goals')}>
            <Target className="w-4 h-4 mr-2" />
            Goals
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {QUICK_ACTIONS.map((action) => {
          const Icon = action.icon;
          const colorClasses: Record<string, string> = {
            violet: 'hover:border-violet-500/30 hover:bg-violet-500/5',
            cyan: 'hover:border-cyan-500/30 hover:bg-cyan-500/5',
            emerald: 'hover:border-emerald-500/30 hover:bg-emerald-500/5',
            orange: 'hover:border-orange-500/30 hover:bg-orange-500/5',
          };
          const iconColors: Record<string, string> = {
            violet: 'text-violet-400',
            cyan: 'text-cyan-400',
            emerald: 'text-emerald-400',
            orange: 'text-orange-400',
          };

          return (
            <button
              key={action.id}
              onClick={() => onNavigate(action.view)}
              className={`p-4 rounded-xl bg-zinc-900/30 border border-white/5 flex items-center gap-3 transition-all ${colorClasses[action.color]}`}
            >
              <Icon className={`w-5 h-5 ${iconColors[action.color]}`} />
              <span className="text-sm font-medium text-zinc-300">{action.label}</span>
            </button>
          );
        })}
      </div>

      {/* Priority Task */}
      <div>
        <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">
          Priority Focus
        </h2>
        <button
          onClick={() => onOpenTask(priorityTask)}
          className="group w-full text-left relative bg-zinc-900/40 hover:bg-zinc-800/60 border border-white/5 hover:border-violet-500/30 rounded-2xl p-6 md:p-8 transition-all duration-300"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 to-cyan-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <Badge variant={priorityTask.type === 'review' ? 'warning' : 'neutral'}>
                  {priorityTask.type === 'review' ? 'URGENT' : 'NEXT ACTION'}
                </Badge>
                <span className="text-xs font-mono text-zinc-500">{priorityTask.date}</span>
              </div>

              <h3 className="text-xl md:text-2xl font-semibold text-white mb-2 group-hover:text-violet-100 transition-colors">
                {priorityTask.title}
              </h3>
              <p className="text-zinc-400 line-clamp-2">{priorityTask.description}</p>
            </div>

            <div className="shrink-0 self-end md:self-center">
              <div className="w-12 h-12 rounded-full bg-white text-zinc-950 flex items-center justify-center transition-all group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </div>
        </button>
      </div>

      {/* Next Tasks + Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {nextTasks.map((task) => (
          <button
            key={task.id}
            onClick={() => onOpenTask(task)}
            className="group text-left p-5 rounded-2xl bg-zinc-900/40 border border-white/5 hover:bg-zinc-800/60 hover:border-white/10 transition-all duration-300 flex flex-col min-h-[140px]"
          >
            <div className="flex justify-between items-start mb-3">
              <span className="p-2 rounded-lg bg-zinc-800/50 text-zinc-400 group-hover:text-white transition-colors">
                {task.type === 'execution' ? (
                  <Zap className="w-4 h-4" />
                ) : (
                  <Map className="w-4 h-4" />
                )}
              </span>
              {task.type === 'review' && (
                <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_#F59E0B]" />
              )}
            </div>
            <h3 className="text-sm font-medium text-zinc-300 group-hover:text-white leading-snug flex-1">
              {task.title}
            </h3>
            <div className="flex items-center justify-between mt-4 opacity-50 group-hover:opacity-100 transition-opacity">
              <span className="text-xs text-zinc-500 font-mono">{task.date}</span>
              <ChevronRight className="w-4 h-4 text-zinc-500" />
            </div>
          </button>
        ))}

        {/* Explore Card */}
        <button
          onClick={() => onNavigate('prompt-library')}
          className="group text-left p-5 rounded-2xl bg-gradient-to-br from-violet-500/10 to-cyan-500/10 border border-violet-500/20 hover:border-violet-500/40 transition-all duration-300 flex flex-col min-h-[140px]"
        >
          <div className="flex justify-between items-start mb-3">
            <span className="p-2 rounded-lg bg-violet-500/20 text-violet-400">
              <Sparkles className="w-4 h-4" />
            </span>
          </div>
          <h3 className="text-sm font-medium text-white leading-snug flex-1">
            Explore Prompt Library
          </h3>
          <div className="flex items-center justify-between mt-4 opacity-70 group-hover:opacity-100 transition-opacity">
            <span className="text-xs text-violet-300">10 templates ready</span>
            <ChevronRight className="w-4 h-4 text-violet-400" />
          </div>
        </button>
      </div>

      {/* DNA Tip */}
      {dna && (
        <div className="p-4 rounded-xl bg-zinc-900/30 border border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
              <Wand2 className="w-4 h-4 text-violet-400" />
            </div>
            <div>
              <p className="text-sm text-zinc-300">
                All prompts are personalized for{' '}
                <span className="text-violet-400 font-medium">{dna.business_name}</span>
              </p>
              <p className="text-xs text-zinc-500">
                Tone: {dna.tone} • Audience: {dna.target_audience?.split(',')[0]}
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('dna')}
            className="text-xs text-zinc-400 hover:text-white transition-colors"
          >
            Edit →
          </button>
        </div>
      )}
    </div>
  );
};
