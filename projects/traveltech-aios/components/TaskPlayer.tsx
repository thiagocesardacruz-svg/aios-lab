import React from 'react';
import { Task, DNAParams } from '../types';
import { X, ExternalLink, CheckCircle2, Circle, Wand2 } from 'lucide-react';
import { Button, Badge, CopyBlock } from './UI';

interface TaskPlayerProps {
  task: Task | null;
  onClose: () => void;
  dna: DNAParams;
}

export const TaskPlayer: React.FC<TaskPlayerProps> = ({ task, onClose, dna }) => {
  if (!task) return null;

  // Simple template engine to replace {{variable}} with DNA values
  const processTemplate = (template?: string) => {
    if (!template) return '';
    let result = template;
    result = result.replace('{{companyName}}', dna.companyName || '[Nome da Empresa]');
    result = result.replace('{{industry}}', dna.industry || '[Indústria]');
    result = result.replace('{{targetAudience}}', dna.targetAudience || '[Público]');
    result = result.replace('{{toneOfVoice}}', dna.toneOfVoice || '[Tom]');
    return result;
  };

  const finalPrompt = processTemplate(task.promptTemplate);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-2xl glass-panel-heavy rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-fade-in-up border border-white/10">
        
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-white/5">
          <div>
            <div className="flex items-center gap-3 mb-2">
                <Badge variant={task.status === 'completed' ? 'success' : task.type === 'review' ? 'warning' : 'neutral'}>
                    {task.type.toUpperCase()}
                </Badge>
                <span className="text-xs font-mono text-zinc-500">ID: {task.id.toUpperCase()}</span>
            </div>
            <h2 className="text-xl font-bold text-white leading-tight">{task.title}</h2>
          </div>
          <button onClick={onClose} className="p-2 text-zinc-500 hover:text-white transition-colors rounded-lg hover:bg-white/5">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          
          {/* Context */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Contexto</h3>
            <p className="text-zinc-300 leading-relaxed">{task.description}</p>
          </div>

          {/* The AI Engine (Super Prompt) */}
          {finalPrompt && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-violet-400 uppercase tracking-widest flex items-center gap-2">
                    <Wand2 className="w-3 h-3" />
                    AI Super Prompt
                </h3>
                <span className="text-[10px] text-zinc-600 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                    Configurado com {dna.companyName || 'Default'} DNA
                </span>
              </div>
              <CopyBlock content={finalPrompt} />
              <p className="text-[10px] text-zinc-500 italic">
                * Copie este prompt e cole no seu modelo de IA de preferência (ChatGPT, Claude, Gemini).
              </p>
            </div>
          )}

          {/* Action Link */}
          {task.externalLink && (
            <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 flex items-center justify-between">
                <div className="flex flex-col">
                    <span className="text-xs text-zinc-500">Ferramenta Externa</span>
                    <span className="font-medium text-zinc-300">Executar ação na plataforma</span>
                </div>
                <a 
                    href={task.externalLink} 
                    target="_blank" 
                    rel="noreferrer"
                >
                    <Button variant="secondary" size="sm" icon={ExternalLink}>
                        {task.externalLinkLabel || 'Abrir Link'}
                    </Button>
                </a>
            </div>
          )}

          {/* Checklist */}
          <div className="space-y-3">
             <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Definition of Done</h3>
             <div className="space-y-2">
                {task.checklist.map((item) => (
                    <label key={item.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 cursor-pointer border border-transparent hover:border-white/5 transition-all group">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${item.checked ? 'bg-emerald-500/20 border-emerald-500' : 'border-zinc-700 group-hover:border-zinc-500'}`}>
                            {item.checked && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                        </div>
                        <span className={`text-sm ${item.checked ? 'text-zinc-500 line-through' : 'text-zinc-300'}`}>
                            {item.label}
                        </span>
                        <input type="checkbox" className="hidden" defaultChecked={item.checked} />
                    </label>
                ))}
             </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/5 bg-black/20 flex justify-end gap-3 rounded-b-2xl">
            <Button variant="ghost" onClick={onClose}>Cancelar</Button>
            <Button variant="primary">Concluir Tarefa</Button>
        </div>

      </div>
    </div>
  );
};