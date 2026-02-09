import React from 'react';
import { Button, Badge } from '../components/UI';
import { Task, ViewName, DNAParams } from '../types';
import { MOCK_TASKS } from '../constants';
import { ArrowRight, Zap, Map, Wand2, Calendar } from 'lucide-react';

interface DashboardProps {
    onOpenTask: (task: Task) => void;
    onNavigate: (view: ViewName) => void;
    dna: DNAParams;
}

export const Dashboard: React.FC<DashboardProps> = ({ onOpenTask, onNavigate, dna }) => {
  // Logic to find tasks
  const pendingTasks = MOCK_TASKS.filter(t => t.status !== 'completed');
  const priorityTask = pendingTasks[0];
  const nextTasks = pendingTasks.slice(1, 4); // Get next 3 tasks for the bottom grid

  // Fallback if no priority task
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
      )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] w-full max-w-5xl mx-auto px-4 md:px-0 transition-all duration-500">
      
      {/* 1. Greeting (Copilot Header) */}
      <div className="text-center mb-12 animate-fade-in-up">
        <h1 className="text-4xl md:text-6xl font-semibold text-white tracking-tight mb-4">
          Welcome, Admin.
        </h1>
        <p className="text-xl text-zinc-400 font-light">
          Here is your primary focus for today.
        </p>
      </div>

      {/* 2. Priority Focus (The "Input" Area equivalent) */}
      <div className="w-full mb-16 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
         <div 
            onClick={() => onOpenTask(priorityTask)}
            className="group relative w-full bg-[#18181B] hover:bg-[#27272A] border border-white/10 hover:border-violet-500/30 rounded-[32px] p-2 transition-all duration-300 shadow-2xl shadow-black/50 cursor-pointer"
         >
            {/* Glow backing */}
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 to-cyan-500/5 rounded-[32px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative rounded-[24px] px-8 py-10 md:px-12 md:py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                
                <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                         <Badge variant={priorityTask.type === 'review' ? 'warning' : 'neutral'}>
                            {priorityTask.type === 'review' ? 'PRIORITY' : 'NEXT ACTION'}
                         </Badge>
                         <span className="text-xs font-mono text-zinc-500">
                            {priorityTask.date}
                         </span>
                    </div>
                    
                    <div>
                        <h2 className="text-2xl md:text-3xl font-medium text-white leading-tight mb-2 group-hover:text-violet-100 transition-colors">
                            {priorityTask.title}
                        </h2>
                        <p className="text-zinc-400 text-base md:text-lg line-clamp-2 font-light">
                            {priorityTask.description}
                        </p>
                    </div>
                </div>

                <div className="shrink-0 self-end md:self-center">
                     <div className="rounded-full w-14 h-14 bg-white text-zinc-950 flex items-center justify-center transition-all group-hover:scale-110 group-hover:bg-violet-50 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                        <ArrowRight className="w-6 h-6" />
                     </div>
                </div>

            </div>
         </div>
      </div>

      {/* 3. Open Growth Plans (The "Suggestions" Cards) */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        
        {/* Next Tasks */}
        {nextTasks.map((task) => (
             <button 
                key={task.id}
                onClick={() => onOpenTask(task)}
                className="group relative text-left p-6 rounded-[24px] bg-zinc-900/40 border border-white/5 hover:bg-zinc-800/60 hover:border-white/10 transition-all duration-300 flex flex-col h-full min-h-[160px] hover:-translate-y-1"
             >
                <div className="mb-auto">
                    <div className="flex justify-between items-start mb-4">
                        <span className={`p-2.5 rounded-xl bg-zinc-800/50 text-zinc-400 group-hover:text-white group-hover:bg-zinc-700 transition-colors`}>
                            {task.type === 'execution' ? <Zap className="w-5 h-5" /> : <Map className="w-5 h-5" />}
                        </span>
                        {task.type === 'review' && <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_#F59E0B]" />}
                    </div>
                    <h3 className="text-sm md:text-base font-medium text-zinc-300 group-hover:text-white leading-snug pr-2">
                        {task.title}
                    </h3>
                </div>
                
                <div className="mt-6 flex items-center justify-between opacity-50 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs text-zinc-500 font-mono">{task.date}</span>
                </div>
             </button>
        ))}

        {/* Fillers to maintain grid balance if needed */}
        {nextTasks.length < 3 && (
             <button 
                onClick={() => onNavigate('gpt-tools')}
                className="group text-left p-6 rounded-[24px] bg-zinc-900/40 border border-white/5 hover:bg-zinc-800/60 hover:border-white/10 transition-all duration-300 flex flex-col h-full min-h-[160px] hover:-translate-y-1"
             >
                 <div className="mb-auto">
                    <div className="flex justify-between items-start mb-4">
                        <span className="p-2.5 rounded-xl bg-zinc-800/50 text-zinc-400 group-hover:text-white group-hover:bg-zinc-700 transition-colors">
                            <Wand2 className="w-5 h-5" />
                        </span>
                    </div>
                    <h3 className="text-sm md:text-base font-medium text-zinc-300 group-hover:text-white leading-snug">
                        Explore GPT Tools
                    </h3>
                 </div>
                 <div className="mt-6 flex items-center justify-between opacity-50 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs text-zinc-500 font-mono">INTELLIGENCE</span>
                </div>
             </button>
        )}
        
         {nextTasks.length < 2 && (
             <button 
                onClick={() => onNavigate('my-plan')}
                className="group text-left p-6 rounded-[24px] bg-zinc-900/40 border border-white/5 hover:bg-zinc-800/60 hover:border-white/10 transition-all duration-300 flex flex-col h-full min-h-[160px] hover:-translate-y-1"
             >
                 <div className="mb-auto">
                    <div className="flex justify-between items-start mb-4">
                        <span className="p-2.5 rounded-xl bg-zinc-800/50 text-zinc-400 group-hover:text-white group-hover:bg-zinc-700 transition-colors">
                            <Calendar className="w-5 h-5" />
                        </span>
                    </div>
                    <h3 className="text-sm md:text-base font-medium text-zinc-300 group-hover:text-white leading-snug">
                        View Full Strategy
                    </h3>
                 </div>
                 <div className="mt-6 flex items-center justify-between opacity-50 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs text-zinc-500 font-mono">PLANNING</span>
                </div>
             </button>
        )}

      </div>
      
    </div>
  );
};