import React, { useState, useMemo } from 'react';
import { AppProviders } from './contexts';
import { useAuth } from './contexts/AuthContext';
import { useDNA } from './contexts/DNAContext';
import { Sidebar, MobileNav } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { MyProducts } from './pages/MyProducts';
import { MyPlan } from './pages/MyPlan';
import { Personalize } from './pages/Personalize';
import { PromptLibrary } from './pages/PromptLibrary';
import { PlatformsHub } from './pages/PlatformsHub';
import { GPTDiscovery } from './pages/GPTDiscovery';
import { TemplateLibrary } from './pages/TemplateLibrary';
import { Login } from './pages/Login';
import { Onboarding } from './pages/Onboarding';
import { Goals } from './pages/Goals';
import { NotionPrompts } from './pages/NotionPrompts';
import { NotionExperts } from './pages/NotionExperts';
import { TaskPlayer } from './components/TaskPlayer';
import { ViewName, Task, DNAParams } from './types';
import { GPT_TOOLS_DATA, GPT_EXPERTS_DATA, SCRIPTS_DATA, DOCS_DATA, CINEMATIC_BACKGROUNDS } from './constants';

// Fallback for empty pages
const PlaceholderPage: React.FC<{ title: string, subtitle?: string }> = ({ title, subtitle }) => (
  <div className="flex flex-col items-center justify-center h-[60vh] text-zinc-500 animate-fade-in-up px-4 text-center">
    <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center mb-6">
        <span className="text-2xl">🚧</span>
    </div>
    <h2 className="text-2xl font-bold mb-2 text-zinc-300">{title}</h2>
    <p className="max-w-md text-zinc-500">{subtitle || 'This feature is coming soon in the next version of TravelTech AIOS.'}</p>
  </div>
);

// Main App Content (after auth)
const AppContent: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { dna, loading: dnaLoading, hasDNA } = useDNA();

  const [currentView, setCurrentView] = useState<ViewName>('dashboard');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Choose a random background on initial load
  const backgroundImage = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * CINEMATIC_BACKGROUNDS.length);
    return CINEMATIC_BACKGROUNDS[randomIndex];
  }, []);

  // Convert new DNA format to legacy format for compatibility
  const legacyDNA: DNAParams = {
    companyName: dna?.business_name || '',
    industry: dna?.segment || dna?.niche || '',
    targetAudience: dna?.target_audience || '',
    toneOfVoice: dna?.tone || ''
  };

  // Show loading
  if (authLoading || dnaLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-zinc-500 animate-pulse">Loading...</div>
      </div>
    );
  }

  // Show login if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-200">
        <div
          className="fixed inset-0 z-0 bg-cover bg-center opacity-20 pointer-events-none"
          style={{ backgroundImage: `url("${backgroundImage}")` }}
        />
        <div className="fixed inset-0 z-0 bg-gradient-to-b from-zinc-950/80 via-zinc-950/90 to-zinc-950 pointer-events-none" />
        <div className="relative z-10">
          <Login onSuccess={() => setShowOnboarding(true)} />
        </div>
      </div>
    );
  }

  // Show onboarding if no DNA
  if (!hasDNA || showOnboarding) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-200">
        <div
          className="fixed inset-0 z-0 bg-cover bg-center opacity-20 pointer-events-none"
          style={{ backgroundImage: `url("${backgroundImage}")` }}
        />
        <div className="fixed inset-0 z-0 bg-gradient-to-b from-zinc-950/80 via-zinc-950/90 to-zinc-950 pointer-events-none" />
        <div className="relative z-10">
          <Onboarding
            onComplete={() => setShowOnboarding(false)}
            onSkip={() => setShowOnboarding(false)}
          />
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (currentView) {
      // MAIN
      case 'dashboard':
        return <Dashboard onOpenTask={setSelectedTask} onNavigate={setCurrentView} />;
      case 'my-products':
        return <MyProducts onNavigate={setCurrentView} onOpenProduct={(id) => console.log('Open product:', id)} />;
      case 'dna':
        return <Personalize />;
      case 'my-plan':
        return <MyPlan onOpenTask={setSelectedTask} />;
      case 'goals':
        return <Goals />;

      // INTELLIGENCE
      case 'gpt-experts':
        return (
            <GPTDiscovery
                title="GPT Experts"
                subtitle="Specialized AI personas trained for high-level strategic roles."
                data={GPT_EXPERTS_DATA}
                type="Expert"
            />
        );
      case 'gpt-tools':
        return (
             <GPTDiscovery
                title="GPT Tools"
                subtitle="Tactical AI utilities for specific business outcomes."
                data={GPT_TOOLS_DATA}
                type="Tool"
            />
        );

      // RESOURCES
      case 'prompt-library':
        return <PromptLibrary />;
      case 'scripts':
        return (
            <TemplateLibrary
                title="Message Scripts"
                subtitle="Copy-paste communication templates optimized for conversions."
                data={SCRIPTS_DATA}
                dna={legacyDNA}
            />
        );
      case 'docs':
        return (
            <TemplateLibrary
                title="Docs & Policies"
                subtitle="Standard Operating Procedures and Legal Templates generator."
                data={DOCS_DATA}
                dna={legacyDNA}
            />
        );
      case 'platforms':
        return <PlatformsHub dna={legacyDNA} />;

      // ACCOUNT
      case 'profile':
        return <PlaceholderPage title="My Profile" subtitle="Manage your personal information and account preferences." />;
      case 'settings':
        return <PlaceholderPage title="Settings" subtitle="Global system settings, integrations and permissions." />;
      case 'help':
        return <PlaceholderPage title="Help Center" subtitle="Tutorials, FAQs and direct support from our team." />;

      // NOTION-STYLE (Test)
      case 'notion-prompts':
        return <NotionPrompts />;
      case 'notion-experts':
        return <NotionExperts />;

      default:
        return <Dashboard onOpenTask={setSelectedTask} onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-200 font-sans selection:bg-violet-500/30 selection:text-violet-200">

      {/* Cinematic Background - More visible */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center opacity-40 pointer-events-none transition-all duration-1000 ease-in-out"
        style={{ backgroundImage: `url("${backgroundImage}")` }}
      />
      {/* Lighter Overlay */}
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-zinc-900/70 via-zinc-900/75 to-zinc-900/90 pointer-events-none" />

      {/* Main Layout */}
      <div className="relative z-10 flex h-screen">
        <Sidebar currentView={currentView} onNavigate={setCurrentView} />

        {/* Content Area Shell - Internal scroll, full width */}
        <main className="flex-1 h-screen overflow-y-auto overflow-x-hidden transition-all duration-300 md:ml-[280px] pt-20 md:pt-8 pb-24 md:pb-8 px-4 md:px-8">
          {renderContent()}
        </main>

        <MobileNav currentView={currentView} onNavigate={setCurrentView} />
      </div>

      {/* Overlays */}
      <TaskPlayer
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
        dna={legacyDNA}
      />

    </div>
  );
};

// Root App with Providers
const App: React.FC = () => {
  return (
    <AppProviders>
      <AppContent />
    </AppProviders>
  );
};

export default App;
