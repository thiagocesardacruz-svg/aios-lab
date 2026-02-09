import React, { useState } from 'react';
import {
  Target,
  TrendingUp,
  Users,
  Cog,
  BarChart3,
  Megaphone,
  DollarSign,
  Leaf,
  GraduationCap,
  Check,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Button, Card, IconBox, tokens } from '../components/UI';

// ============================================================================
// GROWTH VERTICALS DATA
// ============================================================================

interface Goal {
  id: string;
  label: string;
  description: string;
}

interface GrowthVertical {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  goals: Goal[];
}

const GROWTH_VERTICALS: GrowthVertical[] = [
  {
    id: 'customer_acquisition',
    name: 'Customer Acquisition',
    description: 'Attract new guests and expand your reach',
    icon: Target,
    color: 'violet',
    goals: [
      { id: 'increase_direct_bookings', label: 'Increase Direct Bookings', description: 'Reduce OTA dependency and boost direct revenue' },
      { id: 'improve_ota_visibility', label: 'Improve OTA Visibility', description: 'Better rankings on Booking, Expedia, etc.' },
      { id: 'expand_new_markets', label: 'Expand to New Markets', description: 'Reach international or untapped segments' },
      { id: 'boost_social_presence', label: 'Boost Social Media Presence', description: 'Grow followers and engagement' },
      { id: 'improve_seo', label: 'Improve SEO & Website Traffic', description: 'Rank higher on Google searches' },
    ],
  },
  {
    id: 'sales_conversion',
    name: 'Sales Conversion',
    description: 'Turn inquiries into confirmed bookings',
    icon: TrendingUp,
    color: 'cyan',
    goals: [
      { id: 'increase_upsell_rate', label: 'Increase Upsell Rate', description: 'More upgrades, add-ons, and packages' },
      { id: 'reduce_abandonment', label: 'Reduce Booking Abandonment', description: 'Convert more website visitors' },
      { id: 'improve_response_time', label: 'Improve Response Time', description: 'Faster replies to inquiries' },
      { id: 'personalize_offers', label: 'Personalize Offers', description: 'Tailored packages for each guest' },
      { id: 'optimize_pricing', label: 'Optimize Pricing Strategy', description: 'Dynamic pricing and promotions' },
    ],
  },
  {
    id: 'retention',
    name: 'Guest Retention',
    description: 'Build loyalty and repeat business',
    icon: Users,
    color: 'emerald',
    goals: [
      { id: 'launch_loyalty_program', label: 'Launch Loyalty Program', description: 'Reward returning guests' },
      { id: 'improve_guest_satisfaction', label: 'Improve Guest Satisfaction', description: 'Higher review scores' },
      { id: 'increase_repeat_bookings', label: 'Increase Repeat Bookings', description: 'More returning guests' },
      { id: 'win_back_campaigns', label: 'Win-Back Campaigns', description: 'Re-engage past guests' },
      { id: 'personalized_communication', label: 'Personalized Communication', description: 'Relevant emails and messages' },
    ],
  },
  {
    id: 'operational_efficiency',
    name: 'Operational Efficiency',
    description: 'Streamline processes and reduce costs',
    icon: Cog,
    color: 'orange',
    goals: [
      { id: 'automate_tasks', label: 'Automate Repetitive Tasks', description: 'Save time on manual work' },
      { id: 'improve_team_productivity', label: 'Improve Team Productivity', description: 'Better workflows and tools' },
      { id: 'reduce_operational_costs', label: 'Reduce Operational Costs', description: 'Cut unnecessary expenses' },
      { id: 'streamline_checkin', label: 'Streamline Check-in/Check-out', description: 'Faster guest processing' },
      { id: 'optimize_inventory', label: 'Optimize Inventory Management', description: 'Better stock control' },
    ],
  },
  {
    id: 'data_intelligence',
    name: 'Data Intelligence',
    description: 'Make decisions based on insights',
    icon: BarChart3,
    color: 'blue',
    goals: [
      { id: 'track_kpis', label: 'Track Key KPIs', description: 'Monitor performance metrics' },
      { id: 'understand_guest_behavior', label: 'Understand Guest Behavior', description: 'Analyze booking patterns' },
      { id: 'competitor_analysis', label: 'Competitor Analysis', description: 'Benchmark against rivals' },
      { id: 'forecast_demand', label: 'Forecast Demand', description: 'Predict occupancy trends' },
      { id: 'measure_roi', label: 'Measure Marketing ROI', description: 'Track campaign effectiveness' },
    ],
  },
  {
    id: 'brand_visibility',
    name: 'Brand Visibility',
    description: 'Strengthen your market presence',
    icon: Megaphone,
    color: 'pink',
    goals: [
      { id: 'build_brand_identity', label: 'Build Brand Identity', description: 'Consistent visual and voice' },
      { id: 'increase_media_coverage', label: 'Increase Media Coverage', description: 'PR and press mentions' },
      { id: 'influencer_partnerships', label: 'Influencer Partnerships', description: 'Collaborate with creators' },
      { id: 'content_marketing', label: 'Content Marketing', description: 'Blog, videos, storytelling' },
      { id: 'reputation_management', label: 'Reputation Management', description: 'Monitor and respond to reviews' },
    ],
  },
  {
    id: 'revenue_growth',
    name: 'Revenue Growth',
    description: 'Maximize profitability',
    icon: DollarSign,
    color: 'yellow',
    goals: [
      { id: 'increase_adr', label: 'Increase ADR', description: 'Higher average daily rate' },
      { id: 'improve_revpar', label: 'Improve RevPAR', description: 'Revenue per available room' },
      { id: 'diversify_revenue', label: 'Diversify Revenue Streams', description: 'F&B, spa, events, etc.' },
      { id: 'reduce_cancellations', label: 'Reduce Cancellations', description: 'Better policies and deposits' },
      { id: 'maximize_occupancy', label: 'Maximize Occupancy', description: 'Fill more rooms year-round' },
    ],
  },
  {
    id: 'sustainability',
    name: 'Sustainability',
    description: 'Eco-friendly practices and certifications',
    icon: Leaf,
    color: 'green',
    goals: [
      { id: 'reduce_carbon_footprint', label: 'Reduce Carbon Footprint', description: 'Lower environmental impact' },
      { id: 'get_certifications', label: 'Get Green Certifications', description: 'Eco-labels and awards' },
      { id: 'sustainable_sourcing', label: 'Sustainable Sourcing', description: 'Local and eco-friendly suppliers' },
      { id: 'waste_reduction', label: 'Waste Reduction', description: 'Recycling and composting' },
      { id: 'communicate_initiatives', label: 'Communicate Initiatives', description: 'Share your green story' },
    ],
  },
  {
    id: 'team_development',
    name: 'Team Development',
    description: 'Invest in your people',
    icon: GraduationCap,
    color: 'indigo',
    goals: [
      { id: 'improve_training', label: 'Improve Training Programs', description: 'Better onboarding and skills' },
      { id: 'reduce_turnover', label: 'Reduce Staff Turnover', description: 'Retain talented employees' },
      { id: 'boost_engagement', label: 'Boost Team Engagement', description: 'Motivated and happy staff' },
      { id: 'develop_leaders', label: 'Develop Future Leaders', description: 'Succession planning' },
      { id: 'improve_communication', label: 'Improve Internal Communication', description: 'Better team collaboration' },
    ],
  },
];

// ============================================================================
// COLOR UTILITIES
// ============================================================================

const getColorClasses = (color: string, selected: boolean) => {
  const colors: Record<string, { bg: string; border: string; text: string; icon: string }> = {
    violet: { bg: 'bg-violet-500/10', border: 'border-violet-500', text: 'text-violet-400', icon: 'text-violet-400' },
    cyan: { bg: 'bg-cyan-500/10', border: 'border-cyan-500', text: 'text-cyan-400', icon: 'text-cyan-400' },
    emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500', text: 'text-emerald-400', icon: 'text-emerald-400' },
    orange: { bg: 'bg-orange-500/10', border: 'border-orange-500', text: 'text-orange-400', icon: 'text-orange-400' },
    blue: { bg: 'bg-blue-500/10', border: 'border-blue-500', text: 'text-blue-400', icon: 'text-blue-400' },
    pink: { bg: 'bg-pink-500/10', border: 'border-pink-500', text: 'text-pink-400', icon: 'text-pink-400' },
    yellow: { bg: 'bg-yellow-500/10', border: 'border-yellow-500', text: 'text-yellow-400', icon: 'text-yellow-400' },
    green: { bg: 'bg-green-500/10', border: 'border-green-500', text: 'text-green-400', icon: 'text-green-400' },
    indigo: { bg: 'bg-indigo-500/10', border: 'border-indigo-500', text: 'text-indigo-400', icon: 'text-indigo-400' },
  };
  return colors[color] || colors.violet;
};

// ============================================================================
// COMPONENTS
// ============================================================================

interface VerticalCardProps {
  vertical: GrowthVertical;
  selectedGoals: string[];
  isExpanded: boolean;
  onToggleExpand: () => void;
  onToggleGoal: (goalId: string) => void;
}

const VerticalCard: React.FC<VerticalCardProps> = ({
  vertical,
  selectedGoals,
  isExpanded,
  onToggleExpand,
  onToggleGoal,
}) => {
  const Icon = vertical.icon;
  const colors = getColorClasses(vertical.color, isExpanded);
  const selectedCount = selectedGoals.filter(g =>
    vertical.goals.some(vg => vg.id === g)
  ).length;

  return (
    <div
      className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
        isExpanded
          ? `${colors.bg} ${colors.border} border-2`
          : 'bg-zinc-900/50 border-white/5 hover:border-white/10'
      }`}
    >
      {/* Header */}
      <button
        onClick={onToggleExpand}
        className="w-full p-4 flex items-center gap-4 text-left"
      >
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            isExpanded ? colors.bg : 'bg-zinc-800/50'
          }`}
        >
          <Icon className={`w-6 h-6 ${isExpanded ? colors.icon : 'text-zinc-400'}`} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold ${isExpanded ? 'text-white' : 'text-zinc-200'}`}>
            {vertical.name}
          </h3>
          <p className="text-sm text-zinc-500 truncate">{vertical.description}</p>
        </div>
        <div className="flex items-center gap-3">
          {selectedCount > 0 && (
            <span className={`text-sm font-medium ${colors.text}`}>
              {selectedCount} selected
            </span>
          )}
          <ChevronRight
            className={`w-5 h-5 text-zinc-500 transition-transform ${
              isExpanded ? 'rotate-90' : ''
            }`}
          />
        </div>
      </button>

      {/* Goals List */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-2 animate-fade-in-up">
          {vertical.goals.map((goal) => {
            const isSelected = selectedGoals.includes(goal.id);
            return (
              <button
                key={goal.id}
                onClick={() => onToggleGoal(goal.id)}
                className={`w-full p-3 rounded-xl text-left transition-all flex items-start gap-3 ${
                  isSelected
                    ? `${colors.bg} border ${colors.border}`
                    : 'bg-zinc-800/30 border border-transparent hover:bg-zinc-800/50'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    isSelected ? `${colors.border} ${colors.bg}` : 'border-zinc-600'
                  }`}
                >
                  {isSelected && <Check className={`w-3 h-3 ${colors.text}`} />}
                </div>
                <div>
                  <p className={`font-medium ${isSelected ? 'text-white' : 'text-zinc-300'}`}>
                    {goal.label}
                  </p>
                  <p className="text-sm text-zinc-500">{goal.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const Goals: React.FC = () => {
  const [expandedVertical, setExpandedVertical] = useState<string | null>('customer_acquisition');
  const [selectedGoals, setSelectedGoals] = useState<string[]>([
    'increase_direct_bookings',
    'improve_ota_visibility',
    'increase_upsell_rate',
    'launch_loyalty_program',
  ]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const toggleGoal = (goalId: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goalId) ? prev.filter((g) => g !== goalId) : [...prev, goalId]
    );
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const totalSelected = selectedGoals.length;

  return (
    <div className={`w-full ${tokens.spacing.section} animate-fade-in-up`}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Growth Goals</h1>
            <p className="text-zinc-500">Select your priorities to personalize AI recommendations</p>
          </div>
        </div>
      </div>

      {/* Summary Bar */}
      <div className="mb-6 p-4 rounded-2xl bg-zinc-900/50 border border-white/5 flex items-center justify-between">
        <div>
          <p className="text-sm text-zinc-500">Selected Goals</p>
          <p className="text-2xl font-bold text-white">{totalSelected}</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="text-emerald-400 text-sm flex items-center gap-1">
              <Check className="w-4 h-4" /> Saved
            </span>
          )}
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Goals'}
          </Button>
        </div>
      </div>

      {/* Tip */}
      <div className="mb-6 p-4 rounded-xl bg-violet-500/10 border border-violet-500/20">
        <p className="text-sm text-violet-300">
          <strong>Tip:</strong> Your selected goals help us prioritize content and suggestions.
          You can select multiple goals across different areas.
        </p>
      </div>

      {/* Verticals Grid */}
      <div className="space-y-3">
        {GROWTH_VERTICALS.map((vertical) => (
          <VerticalCard
            key={vertical.id}
            vertical={vertical}
            selectedGoals={selectedGoals}
            isExpanded={expandedVertical === vertical.id}
            onToggleExpand={() =>
              setExpandedVertical((prev) => (prev === vertical.id ? null : vertical.id))
            }
            onToggleGoal={toggleGoal}
          />
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-violet-500/10 to-cyan-500/10 border border-white/5 text-center">
        <h3 className="text-lg font-semibold text-white mb-2">
          AI will adapt to your goals
        </h3>
        <p className="text-zinc-400 mb-4">
          Prompts, experts, and recommendations will be prioritized based on your selections.
        </p>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save & Apply Goals'}
        </Button>
      </div>
    </div>
  );
};
