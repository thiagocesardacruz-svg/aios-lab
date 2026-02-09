import React from 'react';
import { PageHeader, Badge } from '../components/UI';
import { Task } from '../types';
import { MOCK_TASKS } from '../constants';
import { Calendar, Circle, CheckCircle2 } from 'lucide-react';

interface MyPlanProps {
    onOpenTask: (task: Task) => void;
}

export const MyPlan: React.FC<MyPlanProps> = ({ onOpenTask }) => {
  return (
    <div className="w-full max-w-full mx-auto pb-20">
      <PageHeader 
        title="My Plan" 
        subtitle="Sua estratégia executável organizada cronologicamente." 
      />

      <div className="relative border-l border-white/10 ml-4 md:ml-8 space-y-12">
        {/* Day Group: Today */}
        <div className="relative pl-8 md:pl-12">
            <span className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-cyan-500 shadow-[0_0_10px_#06B6D4]" />
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cyan-500" />
                Hoje, 24 Out
            </h3>
            
            <div className="grid gap-4">
                {MOCK_TASKS.filter(t => t.date === 'Hoje').map(task => (
                    <TaskCard key={task.id} task={task} onClick={() => onOpenTask(task)} />
                ))}
            </div>
        </div>

         {/* Day Group: Tomorrow */}
         <div className="relative pl-8 md:pl-12">
            <span className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-zinc-700" />
            <h3 className="text-lg font-bold text-zinc-400 mb-6 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-zinc-600" />
                Amanhã
            </h3>
            
            <div className="grid gap-4">
                {MOCK_TASKS.filter(t => t.date === 'Amanhã').map(task => (
                    <TaskCard key={task.id} task={task} onClick={() => onOpenTask(task)} />
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

const TaskCard: React.FC<{ task: Task; onClick: () => void }> = ({ task, onClick }) => (
    <div 
        onClick={onClick}
        className="group relative p-6 rounded-2xl glass-panel border border-white/5 hover:border-violet-500/30 transition-all cursor-pointer hover:bg-white/[0.07]"
    >
        <div className="flex justify-between items-start mb-2">
            <Badge variant={task.type === 'execution' ? 'neutral' : 'warning'}>
                {task.type.toUpperCase()}
            </Badge>
            <div className={`w-5 h-5 rounded-full border border-zinc-700 flex items-center justify-center ${task.status === 'completed' ? 'bg-emerald-500/20 border-emerald-500' : ''}`}>
                {task.status === 'completed' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Circle className="w-3.5 h-3.5 text-zinc-700" />}
            </div>
        </div>
        <h4 className="text-lg font-semibold text-zinc-200 group-hover:text-white transition-colors mb-1">
            {task.title}
        </h4>
        <p className="text-sm text-zinc-500 line-clamp-2">
            {task.description}
        </p>
    </div>
);