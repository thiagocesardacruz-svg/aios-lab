import React from 'react';
import { NAV_ITEMS } from '../constants';
import { ViewName, NavItem } from '../types';
import { Plane, Hexagon } from 'lucide-react';

interface SidebarProps {
  currentView: ViewName;
  onNavigate: (view: ViewName) => void;
  isMobile?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  // Group items based on the new structure
  const groups = {
    MAIN: NAV_ITEMS.filter(i => i.group === 'MAIN'),
    INTELLIGENCE: NAV_ITEMS.filter(i => i.group === 'INTELLIGENCE'),
    RESOURCES: NAV_ITEMS.filter(i => i.group === 'RESOURCES'),
    ACCOUNT: NAV_ITEMS.filter(i => i.group === 'ACCOUNT'),
    NOTION: NAV_ITEMS.filter(i => i.group === 'NOTION'),
  };

  const NavGroup = ({ title, items }: { title: string, items: NavItem[] }) => (
    <div className="mb-6">
      <h3 className="px-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">{title}</h3>
      <div className="space-y-1">
        {items.map((item) => {
          const isActive = currentView === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 group relative
                ${isActive 
                  ? 'text-white bg-white/5' 
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }
              `}
            >
              {/* Active Indicator */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-cyan-500 rounded-r-full shadow-[0_0_10px_#06B6D4]" />
              )}
              
              <Icon className={`w-5 h-5 ${isActive ? 'text-violet-400' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <aside className="w-64 h-[calc(100vh-48px)] fixed left-6 top-6 glass-panel rounded-3xl flex flex-col hidden md:flex z-50">
      {/* Brand */}
      <div className="p-6 flex items-center gap-3 border-b border-white/5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
          <Plane className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-white font-bold text-sm leading-tight">Travel Tech</h1>
          <p className="text-xs text-cyan-400 font-mono tracking-wider">AI-OS v1.0</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6 px-2 custom-scrollbar">
        <NavGroup title="Main" items={groups.MAIN} />
        <NavGroup title="Intelligence" items={groups.INTELLIGENCE} />
        <NavGroup title="Resources" items={groups.RESOURCES} />
        <NavGroup title="Account" items={groups.ACCOUNT} />
        {groups.NOTION.length > 0 && (
          <NavGroup title="Notion (Test)" items={groups.NOTION} />
        )}
      </div>

      {/* Footer Profile */}
      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-black/20 border border-white/5">
            <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center">
                <Hexagon className="w-4 h-4 text-zinc-400" />
            </div>
            <div className="flex-1 overflow-hidden">
                <p className="text-xs font-medium text-white truncate">Admin User</p>
                <p className="text-[10px] text-emerald-500 truncate">● Online</p>
            </div>
        </div>
      </div>
    </aside>
  );
};

// Simple Mobile Bottom Nav
export const MobileNav: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
    // Show top items from different groups for mobile accessibility
    const mobileItems = [
        NAV_ITEMS.find(i => i.id === 'dashboard')!,
        NAV_ITEMS.find(i => i.id === 'my-plan')!,
        NAV_ITEMS.find(i => i.id === 'prompt-library')!,
        NAV_ITEMS.find(i => i.id === 'gpt-experts')!
    ];
    
    return (
        <nav className="fixed bottom-0 left-0 right-0 h-20 bg-zinc-950/90 backdrop-blur-xl border-t border-white/10 flex items-center justify-around px-2 md:hidden z-50">
            {mobileItems.map(item => {
                 const isActive = currentView === item.id;
                 const Icon = item.icon;
                 return (
                     <button 
                        key={item.id}
                        onClick={() => onNavigate(item.id)}
                        className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${isActive ? 'text-violet-400' : 'text-zinc-500'}`}
                     >
                         <Icon className={`w-6 h-6 ${isActive ? 'fill-violet-400/20' : ''}`} />
                         <span className="text-[10px] font-medium">{item.label}</span>
                     </button>
                 )
            })}
             <button 
                onClick={() => onNavigate('dashboard')} // Fallback menu
                className="flex flex-col items-center gap-1 p-2 rounded-xl text-zinc-500"
            >
                 <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
                    <span className="text-[10px]">...</span>
                 </div>
                 <span className="text-[10px] font-medium">Menu</span>
            </button>
        </nav>
    )
}