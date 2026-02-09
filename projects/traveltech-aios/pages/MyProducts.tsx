import React from 'react';
import { useProducts } from '../contexts/ProductsContext';
import { useDNA } from '../contexts/DNAContext';
import { Button, Badge } from '../components/UI';
import { ArrowRight, Plus, Sparkles, Clock, Star } from 'lucide-react';
import type { ViewName } from '../types';

const PRODUCT_ICONS: Record<string, string> = {
  hotel: '🏨',
  agency: '✈️',
  dmc: '🗺️',
  dmo: '🏛️',
  all: '🔧',
};

const PRODUCT_COLORS: Record<string, string> = {
  hotel: 'from-amber-500/20 to-orange-500/20 border-amber-500/20',
  agency: 'from-blue-500/20 to-cyan-500/20 border-blue-500/20',
  dmc: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/20',
  dmo: 'from-purple-500/20 to-pink-500/20 border-purple-500/20',
  all: 'from-zinc-500/20 to-zinc-600/20 border-zinc-500/20',
};

interface MyProductsProps {
  onNavigate: (view: ViewName) => void;
  onOpenProduct: (productId: string) => void;
}

export const MyProducts: React.FC<MyProductsProps> = ({ onNavigate, onOpenProduct }) => {
  const { userProducts, loading, canUpgrade } = useProducts();
  const { dna } = useDNA();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-zinc-500">Loading your products...</div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in-up">
      {/* Welcome Header */}
      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-semibold text-white mb-2">
          Welcome back{dna?.business_name ? `, ${dna.business_name}` : ''}
        </h1>
        <p className="text-zinc-400 text-lg">
          Here are your AI tools ready to use
        </p>
      </div>

      {/* Products Grid */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium text-zinc-300 flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-400" />
            My Products
          </h2>
          <span className="text-sm text-zinc-500">
            {userProducts.length} active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {userProducts.map((item) => {
            const segment = item.product?.segment || 'all';
            const icon = PRODUCT_ICONS[segment];
            const colorClass = PRODUCT_COLORS[segment];
            const isTrial = item.status === 'trial';
            const daysLeft = item.trial_ends_at
              ? Math.ceil((new Date(item.trial_ends_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
              : null;

            return (
              <button
                key={item.product_id}
                onClick={() => onOpenProduct(item.product_id)}
                className={`group relative text-left p-6 rounded-2xl bg-gradient-to-br ${colorClass} border hover:scale-[1.02] hover:shadow-xl transition-all duration-300`}
              >
                {/* Icon */}
                <div className="text-4xl mb-4">{icon}</div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-white mb-1">
                  {item.product?.name}
                </h3>
                <p className="text-sm text-zinc-400 capitalize mb-4">
                  {item.product?.type} • {segment}
                </p>

                {/* Trial Badge */}
                {isTrial && daysLeft !== null && (
                  <div className="flex items-center gap-1.5 text-amber-400 text-sm mb-4">
                    <Clock className="w-4 h-4" />
                    {daysLeft} days left in trial
                  </div>
                )}

                {/* Action */}
                <div className="flex items-center gap-2 text-white/80 group-hover:text-white transition-colors">
                  <span className="text-sm font-medium">Open</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>

                {/* Glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </button>
            );
          })}

          {/* Add More Products Card */}
          <button
            onClick={() => window.open('https://traveltech.digital/store', '_blank')}
            className="group relative p-6 rounded-2xl border-2 border-dashed border-zinc-700 hover:border-violet-500/50 hover:bg-violet-500/5 transition-all duration-300 flex flex-col items-center justify-center min-h-[200px]"
          >
            <div className="w-12 h-12 rounded-xl bg-zinc-800 group-hover:bg-violet-500/20 flex items-center justify-center mb-4 transition-colors">
              <Plus className="w-6 h-6 text-zinc-500 group-hover:text-violet-400 transition-colors" />
            </div>
            <span className="font-medium text-zinc-400 group-hover:text-white transition-colors">
              Add More Products
            </span>
            <span className="text-sm text-zinc-500 mt-1">
              Browse our store
            </span>
          </button>
        </div>
      </section>

      {/* Upgrade Banner */}
      {canUpgrade && (
        <section className="mb-12">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-cyan-500/10 border border-violet-500/20 p-6 md:p-8">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center shrink-0">
                  <Sparkles className="w-6 h-6 text-violet-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">
                    Upgrade to Full Access
                  </h3>
                  <p className="text-zinc-400 max-w-md">
                    You have standalone products. Get the complete AIOS bundle for
                    Experts + Prompts + Trails + SOPs + AI Tutor.
                  </p>
                  <p className="text-violet-400 text-sm mt-2">
                    Save 40% compared to buying separately
                  </p>
                </div>
              </div>

              <Button
                onClick={() => window.open('https://traveltech.digital/store', '_blank')}
                className="shrink-0"
              >
                See Offers
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Quick Actions */}
      <section>
        <h2 className="text-lg font-medium text-zinc-300 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <QuickActionCard
            icon="📚"
            label="Prompt Library"
            onClick={() => onNavigate('prompt-library')}
          />
          <QuickActionCard
            icon="🤖"
            label="GPT Experts"
            onClick={() => onNavigate('gpt-experts')}
          />
          <QuickActionCard
            icon="🔧"
            label="GPT Tools"
            onClick={() => onNavigate('gpt-tools')}
          />
          <QuickActionCard
            icon="⚙️"
            label="My DNA"
            onClick={() => onNavigate('dna')}
          />
        </div>
      </section>
    </div>
  );
};

interface QuickActionCardProps {
  icon: string;
  label: string;
  onClick: () => void;
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="p-4 rounded-xl bg-zinc-900/50 border border-white/5 hover:bg-zinc-800/50 hover:border-white/10 transition-all text-left group"
  >
    <span className="text-2xl mb-2 block">{icon}</span>
    <span className="text-sm text-zinc-400 group-hover:text-white transition-colors">
      {label}
    </span>
  </button>
);
