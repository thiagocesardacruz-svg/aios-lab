import React, { useState } from 'react';
import { useDNA } from '../contexts/DNAContext';
import { Button, Card, tokens } from '../components/UI';
import {
  Sparkles,
  Building2,
  MapPin,
  Users,
  MessageSquare,
  Tag,
  Pencil,
  X
} from 'lucide-react';

// ============================================================================
// CONSTANTS (same as onboarding)
// ============================================================================

const SEGMENT_LABELS: Record<string, string> = {
  hotel: 'Hotel',
  agency: 'Travel Agency',
  dmc: 'Tour Operator / DMC',
  dmo: 'Tourism Board / DMO',
  resort: 'Resort',
  tour_guide: 'Tour Guide',
  attraction: 'Attraction',
  rental: 'Vacation Rental',
};

const NICHES: Record<string, { id: string; label: string }[]> = {
  hotel: [
    { id: 'boutique', label: 'Boutique Hotel' },
    { id: 'business', label: 'Business Hotel' },
    { id: 'resort', label: 'Resort Hotel' },
    { id: 'all-inclusive', label: 'All-Inclusive' },
    { id: 'eco-lodge', label: 'Eco-Lodge' },
    { id: 'luxury', label: 'Luxury' },
    { id: 'family', label: 'Family Hotel' },
    { id: 'urban', label: 'Urban Lifestyle' },
  ],
  agency: [
    { id: 'luxury', label: 'Luxury Specialist' },
    { id: 'corporate', label: 'Corporate Travel' },
    { id: 'adventure', label: 'Adventure Travel' },
    { id: 'groups', label: 'Group Tours' },
    { id: 'online', label: 'Online OTA' },
    { id: 'weddings', label: 'Destination Weddings' },
    { id: 'mice', label: 'MICE & Events' },
  ],
  dmc: [
    { id: 'inbound', label: 'Inbound Leisure' },
    { id: 'outbound', label: 'Outbound' },
    { id: 'incentives', label: 'Incentives & MICE' },
    { id: 'adventure', label: 'Adventure & Eco' },
    { id: 'educational', label: 'Educational Tours' },
    { id: 'luxury-fit', label: 'Luxury FIT' },
  ],
  dmo: [
    { id: 'city', label: 'City Tourism Board' },
    { id: 'regional', label: 'Regional DMO' },
    { id: 'national', label: 'National Tourism' },
    { id: 'thematic', label: 'Thematic (Wine, Gastro)' },
  ],
  resort: [
    { id: 'beach', label: 'Beach Resort' },
    { id: 'ski', label: 'Ski Resort' },
    { id: 'spa', label: 'Spa & Wellness' },
    { id: 'golf', label: 'Golf Resort' },
    { id: 'family', label: 'Family Resort' },
    { id: 'adults', label: 'Adults-Only' },
  ],
  tour_guide: [
    { id: 'walking', label: 'Walking Tours' },
    { id: 'cultural', label: 'Cultural & Heritage' },
    { id: 'adventure', label: 'Adventure' },
    { id: 'food', label: 'Food & Wine' },
    { id: 'private', label: 'Private VIP' },
    { id: 'groups', label: 'Group Tours' },
  ],
  attraction: [
    { id: 'museum', label: 'Museum' },
    { id: 'theme-park', label: 'Theme Park' },
    { id: 'natural', label: 'Natural Site' },
    { id: 'cultural', label: 'Cultural Venue' },
    { id: 'entertainment', label: 'Entertainment' },
    { id: 'sports', label: 'Sports Venue' },
  ],
  rental: [
    { id: 'homes', label: 'Vacation Homes' },
    { id: 'apartments', label: 'Apartments' },
    { id: 'villas', label: 'Villas' },
    { id: 'glamping', label: 'Glamping' },
    { id: 'rural', label: 'Rural Tourism' },
  ],
};

const AUDIENCES = [
  { id: 'leisure', label: 'Leisure' },
  { id: 'business', label: 'Business' },
  { id: 'families', label: 'Families' },
  { id: 'couples', label: 'Couples' },
  { id: 'groups', label: 'Groups' },
  { id: 'luxury', label: 'Luxury' },
  { id: 'budget', label: 'Budget' },
  { id: 'adventure', label: 'Adventure' },
  { id: 'mice', label: 'MICE/Corporate' },
  { id: 'seniors', label: 'Senior Citizens' },
];

const TONES = [
  { id: 'professional', label: 'Professional & Formal', description: 'Clear, structured, business-oriented' },
  { id: 'warm', label: 'Warm & Welcoming', description: 'Friendly, approachable, hospitality-focused' },
  { id: 'luxury', label: 'Luxury & Exclusive', description: 'Refined, sophisticated, high-end' },
  { id: 'casual', label: 'Casual & Conversational', description: 'Relaxed, easy-going, authentic' },
];

// ============================================================================
// COMPONENTS
// ============================================================================

interface FieldCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  onEdit: () => void;
}

const FieldCard: React.FC<FieldCardProps> = ({ icon: Icon, label, value, onEdit }) => (
  <div className="p-4 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-white/10 transition-all group">
    <div className="flex items-start justify-between">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-zinc-800/50 flex items-center justify-center">
          <Icon className="w-5 h-5 text-zinc-400" />
        </div>
        <div>
          <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">{label}</p>
          <p className="text-white font-medium">{value || <span className="text-zinc-600 italic">Not set</span>}</p>
        </div>
      </div>
      <button
        onClick={onEdit}
        className="p-2 rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 opacity-0 group-hover:opacity-100 transition-all"
      >
        <Pencil className="w-4 h-4" />
      </button>
    </div>
  </div>
);

interface ChipSelectProps {
  options: { id: string; label: string }[];
  selected: string[];
  onChange: (selected: string[]) => void;
  multiple?: boolean;
}

const ChipSelect: React.FC<ChipSelectProps> = ({ options, selected, onChange, multiple = false }) => (
  <div className="flex flex-wrap gap-2">
    {options.map((opt) => {
      const isSelected = selected.includes(opt.id) || selected.includes(opt.label);
      return (
        <button
          key={opt.id}
          type="button"
          onClick={() => {
            if (multiple) {
              const newSelected = isSelected
                ? selected.filter((s) => s !== opt.id && s !== opt.label)
                : [...selected, opt.label];
              onChange(newSelected);
            } else {
              onChange([opt.label]);
            }
          }}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            isSelected
              ? 'bg-violet-500 text-white shadow-lg shadow-violet-500/25'
              : 'bg-zinc-800/50 text-zinc-300 hover:bg-zinc-700/50 border border-white/5'
          }`}
        >
          {opt.label}
        </button>
      );
    })}
  </div>
);

interface EditModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  onSave: () => void;
  saving?: boolean;
}

const EditModal: React.FC<EditModalProps> = ({ title, isOpen, onClose, children, onSave, saving }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-zinc-900 rounded-3xl border border-white/10 shadow-2xl animate-fade-in-up">
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <button onClick={onClose} className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
        <div className="flex justify-end gap-3 p-6 border-t border-white/5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
          >
            Cancel
          </button>
          <Button onClick={onSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const Personalize: React.FC = () => {
  const { dna, updateDNA } = useDNA();

  const [editField, setEditField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [editArray, setEditArray] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Parse current DNA values
  const segment = dna?.segment || 'hotel';
  const nicheOptions = NICHES[segment] || [];

  // Parse audience from comma-separated string
  const parseAudience = (str: string | undefined): string[] => {
    if (!str) return [];
    return str.split(',').map((s) => s.trim()).filter(Boolean);
  };

  const openEdit = (field: string) => {
    setEditField(field);
    setSaved(false);

    switch (field) {
      case 'business_name':
        setEditValue(dna?.business_name || '');
        break;
      case 'location':
        setEditValue(dna?.location || '');
        break;
      case 'niche':
        setEditArray(dna?.niche ? [dna.niche] : []);
        break;
      case 'target_audience':
        setEditArray(parseAudience(dna?.target_audience));
        break;
      case 'tone':
        setEditArray(dna?.tone ? [dna.tone] : []);
        break;
    }
  };

  const handleSave = async () => {
    if (!editField) return;

    setSaving(true);

    const updates: Record<string, any> = {};

    switch (editField) {
      case 'business_name':
        updates.business_name = editValue;
        break;
      case 'location':
        updates.location = editValue;
        break;
      case 'niche':
        updates.niche = editArray[0] || '';
        break;
      case 'target_audience':
        updates.target_audience = editArray.join(', ');
        break;
      case 'tone':
        updates.tone = editArray[0] || '';
        break;
    }

    await updateDNA(updates);

    setSaving(false);
    setSaved(true);
    setTimeout(() => {
      setEditField(null);
      setSaved(false);
    }, 500);
  };

  return (
    <div className={`max-w-4xl mx-auto ${tokens.spacing.section} animate-fade-in-up`}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Business DNA</h1>
            <p className="text-zinc-500">Your identity that powers all AI prompts</p>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="mb-6 p-4 rounded-xl bg-violet-500/10 border border-violet-500/20">
        <p className="text-sm text-violet-300">
          <strong>How it works:</strong> These values are injected into every AI-generated prompt using variables like{' '}
          <code className="px-1 py-0.5 rounded bg-violet-500/20 text-violet-200">{'{{business_name}}'}</code>. The more
          detailed your DNA, the better the AI understands your brand.
        </p>
      </div>

      {/* DNA Fields Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FieldCard
          icon={Building2}
          label="Business Name"
          value={dna?.business_name || ''}
          onEdit={() => openEdit('business_name')}
        />
        <FieldCard
          icon={MapPin}
          label="Location"
          value={dna?.location || ''}
          onEdit={() => openEdit('location')}
        />
        <FieldCard
          icon={Tag}
          label="Type & Niche"
          value={`${SEGMENT_LABELS[segment] || segment}${dna?.niche ? ` - ${dna.niche}` : ''}`}
          onEdit={() => openEdit('niche')}
        />
        <FieldCard
          icon={Users}
          label="Target Audience"
          value={dna?.target_audience || ''}
          onEdit={() => openEdit('target_audience')}
        />
        <div className="md:col-span-2">
          <FieldCard
            icon={MessageSquare}
            label="Tone of Voice"
            value={dna?.tone || ''}
            onEdit={() => openEdit('tone')}
          />
        </div>
      </div>

      {/* Preview Section */}
      <div className="mt-8 p-6 rounded-2xl bg-zinc-900/50 border border-white/5">
        <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">Prompt Preview</h3>
        <div className="p-4 rounded-xl bg-black/30 border border-white/5 font-mono text-sm">
          <p className="text-zinc-400">
            You are an AI assistant for{' '}
            <span className="text-violet-400">{dna?.business_name || '{{business_name}}'}</span>, a{' '}
            <span className="text-cyan-400">{dna?.niche || '{{niche}}'}</span> located in{' '}
            <span className="text-emerald-400">{dna?.location || '{{location}}'}</span>. Your target audience is{' '}
            <span className="text-orange-400">{dna?.target_audience || '{{target_audience}}'}</span>. Use a{' '}
            <span className="text-pink-400">{dna?.tone || '{{tone}}'}</span> tone in all communications.
          </p>
        </div>
      </div>

      {/* Edit Modals */}
      <EditModal
        title="Edit Business Name"
        isOpen={editField === 'business_name'}
        onClose={() => setEditField(null)}
        onSave={handleSave}
        saving={saving}
      >
        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          placeholder="Enter your business name"
          className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500/50"
          autoFocus
        />
      </EditModal>

      <EditModal
        title="Edit Location"
        isOpen={editField === 'location'}
        onClose={() => setEditField(null)}
        onSave={handleSave}
        saving={saving}
      >
        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          placeholder="City, Country"
          className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500/50"
          autoFocus
        />
      </EditModal>

      <EditModal
        title="Edit Niche"
        isOpen={editField === 'niche'}
        onClose={() => setEditField(null)}
        onSave={handleSave}
        saving={saving}
      >
        <p className="text-sm text-zinc-400 mb-4">
          Select your specialty as a <span className="text-violet-400">{SEGMENT_LABELS[segment]}</span>
        </p>
        <ChipSelect options={nicheOptions} selected={editArray} onChange={setEditArray} />
      </EditModal>

      <EditModal
        title="Edit Target Audience"
        isOpen={editField === 'target_audience'}
        onClose={() => setEditField(null)}
        onSave={handleSave}
        saving={saving}
      >
        <p className="text-sm text-zinc-400 mb-4">Select all that apply</p>
        <ChipSelect options={AUDIENCES} selected={editArray} onChange={setEditArray} multiple />
      </EditModal>

      <EditModal
        title="Edit Tone of Voice"
        isOpen={editField === 'tone'}
        onClose={() => setEditField(null)}
        onSave={handleSave}
        saving={saving}
      >
        <div className="space-y-3">
          {TONES.map((tone) => {
            const isSelected = editArray.includes(tone.label);
            return (
              <button
                key={tone.id}
                onClick={() => setEditArray([tone.label])}
                className={`w-full p-4 rounded-xl text-left transition-all ${
                  isSelected
                    ? 'bg-violet-500/10 border-2 border-violet-500'
                    : 'bg-zinc-800/30 border border-white/5 hover:border-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? 'border-violet-500' : 'border-zinc-600'
                    }`}
                  >
                    {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-violet-500" />}
                  </div>
                  <div>
                    <p className={`font-medium ${isSelected ? 'text-white' : 'text-zinc-300'}`}>{tone.label}</p>
                    <p className="text-sm text-zinc-500">{tone.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </EditModal>
    </div>
  );
};
