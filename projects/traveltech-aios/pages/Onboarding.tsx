import React, { useState, useEffect, useCallback } from 'react';
import { useDNA } from '../contexts/DNAContext';
import { useProducts } from '../contexts/ProductsContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/UI';
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Building2,
  MapPin,
  Sparkles,
  Users,
  MessageSquare,
  Globe
} from 'lucide-react';

// ============================================================================
// CONSTANTS
// ============================================================================

// Languages available in the platform
const LANGUAGES = [
  { id: 'en', label: 'English', flag: '🇬🇧' },
  { id: 'pt', label: 'Português', flag: '🇧🇷' },
  { id: 'es', label: 'Español', flag: '🇪🇸' },
  { id: 'fr', label: 'Français', flag: '🇫🇷' },
  { id: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { id: 'it', label: 'Italiano', flag: '🇮🇹' },
  { id: 'ar', label: 'العربية', flag: '🇦🇪' },
];

// Segment is inferred from product, but we need labels
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

// Niche options per segment
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
  {
    id: 'professional',
    label: 'Professional & Formal',
    description: 'Clear, structured, business-oriented',
  },
  {
    id: 'warm',
    label: 'Warm & Welcoming',
    description: 'Friendly, approachable, hospitality-focused',
  },
  {
    id: 'luxury',
    label: 'Luxury & Exclusive',
    description: 'Refined, sophisticated, high-end',
  },
  {
    id: 'casual',
    label: 'Casual & Conversational',
    description: 'Relaxed, easy-going, authentic',
  },
];

// ============================================================================
// STORAGE KEY
// ============================================================================
const STORAGE_KEY = 'traveltech_onboarding_progress';

// ============================================================================
// TYPES
// ============================================================================
interface OnboardingData {
  language: string;
  business_name: string;
  country: string;
  city: string;
  niche: string;
  target_audience: string[];
  tone: string;
}

interface OnboardingProps {
  onComplete: () => void;
  onSkip?: () => void;
  segment?: string; // Inferred from product purchase
}

// ============================================================================
// COMPONENTS
// ============================================================================

// Chip component for multi-select
const Chip: React.FC<{
  label: string;
  selected: boolean;
  onClick: () => void;
}> = ({ label, selected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
      selected
        ? 'bg-violet-500 text-white shadow-lg shadow-violet-500/25'
        : 'bg-zinc-800/50 text-zinc-300 hover:bg-zinc-700/50 border border-white/5'
    }`}
  >
    {label}
  </button>
);

// Radio card for single-select with description
const RadioCard: React.FC<{
  label: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}> = ({ label, description, selected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-full p-4 rounded-2xl text-left transition-all ${
      selected
        ? 'bg-violet-500/10 border-2 border-violet-500'
        : 'bg-zinc-800/30 border border-white/5 hover:border-white/10'
    }`}
  >
    <div className="flex items-center gap-3">
      <div
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
          selected ? 'border-violet-500' : 'border-zinc-600'
        }`}
      >
        {selected && <div className="w-2.5 h-2.5 rounded-full bg-violet-500" />}
      </div>
      <div>
        <p className={`font-medium ${selected ? 'text-white' : 'text-zinc-300'}`}>
          {label}
        </p>
        <p className="text-sm text-zinc-500">{description}</p>
      </div>
    </div>
  </button>
);

// Language card for language selection
const LanguageCard: React.FC<{
  flag: string;
  label: string;
  selected: boolean;
  onClick: () => void;
}> = ({ flag, label, selected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`p-4 rounded-2xl text-center transition-all ${
      selected
        ? 'bg-violet-500/10 border-2 border-violet-500'
        : 'bg-zinc-800/30 border border-white/5 hover:border-white/10'
    }`}
  >
    <span className="text-3xl mb-2 block">{flag}</span>
    <p className={`text-sm font-medium ${selected ? 'text-white' : 'text-zinc-400'}`}>
      {label}
    </p>
  </button>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export const Onboarding: React.FC<OnboardingProps> = ({ onComplete, onSkip, segment: propSegment }) => {
  const { saveDNA } = useDNA();
  const { userProducts } = useProducts();
  const { updateUserLanguage } = useAuth();

  // Infer segment from product purchase (or use prop, or default to 'hotel')
  const segment = propSegment || userProducts?.[0]?.product_id?.split('-')[0] || 'hotel';

  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    language: '',
    business_name: '',
    country: '',
    city: '',
    niche: '',
    target_audience: [],
    tone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const totalSteps = 7; // Language, Name, Location, Niche, Audience, Tone, Summary
  const progress = ((currentStep + 1) / totalSteps) * 100;

  // Load saved progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const { step, formData, timestamp } = JSON.parse(saved);
        // Only restore if less than 24 hours old
        if (Date.now() - timestamp < 86400000) {
          setCurrentStep(step);
          setData(formData);
        }
      } catch (e) {
        console.error('Failed to restore onboarding progress:', e);
      }
    }
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        step: currentStep,
        formData: data,
        timestamp: Date.now(),
      })
    );
  }, [currentStep, data]);

  const updateField = useCallback(
    <K extends keyof OnboardingData>(field: K, value: OnboardingData[K]) => {
      setData((prev) => ({ ...prev, [field]: value }));
      setError('');
    },
    []
  );

  const toggleAudience = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      target_audience: prev.target_audience.includes(id)
        ? prev.target_audience.filter((a) => a !== id)
        : [...prev.target_audience, id],
    }));
    setError('');
  }, []);

  const canProceed = useCallback(() => {
    switch (currentStep) {
      case 0: // Language
        return data.language.length > 0;
      case 1: // Business Name
        return data.business_name.trim().length > 0;
      case 2: // Location (optional)
        return true;
      case 3: // Niche
        return data.niche.length > 0;
      case 4: // Target Audience
        return data.target_audience.length > 0;
      case 5: // Tone
        return data.tone.length > 0;
      case 6: // Summary
        return true;
      default:
        return false;
    }
  }, [currentStep, data]);

  const handleNext = async () => {
    if (!canProceed()) {
      setError('Please complete this step before continuing');
      return;
    }

    setError('');

    if (currentStep === totalSteps - 1) {
      await handleComplete();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      setError('');
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      const audienceLabels = data.target_audience
        .map((id) => AUDIENCES.find((a) => a.id === id)?.label || id)
        .join(', ');

      const toneLabel = TONES.find((t) => t.id === data.tone)?.label || data.tone;
      const nicheLabel = nicheOptions.find((n) => n.id === data.niche)?.label || data.niche;

      const location = data.city.trim()
        ? `${data.city.trim()}, ${data.country.trim()}`
        : data.country.trim();

      const { error: saveError } = await saveDNA({
        business_name: data.business_name,
        location,
        segment: segment as any,
        niche: nicheLabel,
        target_audience: audienceLabels,
        tone: toneLabel,
      });

      if (saveError) {
        setError(saveError.message);
      } else {
        // Clear saved progress
        localStorage.removeItem(STORAGE_KEY);
        // Save language preference to user profile
        await updateUserLanguage(data.language as 'en' | 'pt' | 'es' | 'fr' | 'de' | 'it' | 'ar');
        onComplete();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && canProceed()) {
      e.preventDefault();
      handleNext();
    }
  };

  // Get segment's niche options (segment is inferred from product)
  const nicheOptions = NICHES[segment] || [];
  const segmentLabel = SEGMENT_LABELS[segment] || segment;

  // Render step content
  const renderStep = () => {
    switch (currentStep) {
      // Step 0: Language
      case 0:
        return (
          <div className="animate-fade-in-up">
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center">
                <Globe className="w-8 h-8 text-violet-400" />
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-semibold text-white text-center mb-3">
              Choose your language
            </h1>
            <p className="text-zinc-400 text-center mb-8">
              Select the language for your AIOS experience
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {LANGUAGES.map((lang) => (
                <LanguageCard
                  key={lang.id}
                  flag={lang.flag}
                  label={lang.label}
                  selected={data.language === lang.id}
                  onClick={() => updateField('language', lang.id)}
                />
              ))}
            </div>
          </div>
        );

      // Step 1: Business Name
      case 1:
        return (
          <div className="animate-fade-in-up">
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center">
                <Building2 className="w-8 h-8 text-violet-400" />
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-semibold text-white text-center mb-3">
              What's your business name?
            </h1>
            <p className="text-zinc-400 text-center mb-8">
              This will personalize all your AI prompts
            </p>
            <input
              type="text"
              value={data.business_name}
              onChange={(e) => updateField('business_name', e.target.value)}
              placeholder="Hotel Belvedere & Spa"
              className="w-full px-6 py-4 rounded-2xl bg-zinc-900 border border-white/10 text-white text-lg placeholder-zinc-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all"
              autoFocus
              onKeyDown={handleKeyDown}
            />
          </div>
        );

      // Step 2: Location (text fields)
      case 2:
        return (
          <div className="animate-fade-in-up">
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center">
                <MapPin className="w-8 h-8 text-violet-400" />
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-semibold text-white text-center mb-3">
              Where is your business located?
            </h1>
            <p className="text-zinc-400 text-center mb-8">
              Location helps AI understand your market context
            </p>
            <div className="space-y-4">
              <input
                type="text"
                value={data.country}
                onChange={(e) => updateField('country', e.target.value)}
                placeholder="Country"
                className="w-full px-6 py-4 rounded-2xl bg-zinc-900 border border-white/10 text-white text-lg placeholder-zinc-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all"
                autoFocus
                onKeyDown={handleKeyDown}
              />
              <input
                type="text"
                value={data.city}
                onChange={(e) => updateField('city', e.target.value)}
                placeholder="City"
                className="w-full px-6 py-4 rounded-2xl bg-zinc-900 border border-white/10 text-white text-lg placeholder-zinc-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all"
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>
        );

      // Step 3: Niche (segment is implicit from product)
      case 3:
        return (
          <div className="animate-fade-in-up">
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-violet-400" />
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-semibold text-white text-center mb-3">
              What's your focus?
            </h1>
            <p className="text-zinc-400 text-center mb-8">
              As a <span className="text-violet-400">{segmentLabel}</span>, what's your specialty?
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              {nicheOptions.map((niche) => (
                <Chip
                  key={niche.id}
                  label={niche.label}
                  selected={data.niche === niche.id}
                  onClick={() => updateField('niche', niche.id)}
                />
              ))}
            </div>
          </div>
        );

      // Step 4: Target Audience
      case 4:
        return (
          <div className="animate-fade-in-up">
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center">
                <Users className="w-8 h-8 text-violet-400" />
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-semibold text-white text-center mb-3">
              Who are your main customers?
            </h1>
            <p className="text-zinc-400 text-center mb-8">
              Select all that apply
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              {AUDIENCES.map((aud) => (
                <Chip
                  key={aud.id}
                  label={aud.label}
                  selected={data.target_audience.includes(aud.id)}
                  onClick={() => toggleAudience(aud.id)}
                />
              ))}
            </div>
          </div>
        );

      // Step 5: Tone
      case 5:
        return (
          <div className="animate-fade-in-up">
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center">
                <MessageSquare className="w-8 h-8 text-violet-400" />
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-semibold text-white text-center mb-3">
              What tone should AI use?
            </h1>
            <p className="text-zinc-400 text-center mb-8">
              This defines your brand voice
            </p>
            <div className="space-y-3">
              {TONES.map((tone) => (
                <RadioCard
                  key={tone.id}
                  label={tone.label}
                  description={tone.description}
                  selected={data.tone === tone.id}
                  onClick={() => updateField('tone', tone.id)}
                />
              ))}
            </div>
          </div>
        );

      // Step 6: Summary
      case 6:
        const nicheLabel = nicheOptions.find((n) => n.id === data.niche)?.label || data.niche;
        const toneLabel = TONES.find((t) => t.id === data.tone)?.label || data.tone;
        const languageLabel = LANGUAGES.find((l) => l.id === data.language)?.label || data.language;
        const audienceLabels = data.target_audience
          .map((id) => AUDIENCES.find((a) => a.id === id)?.label || id)
          .join(', ');
        const locationDisplay = data.city.trim()
          ? `${data.city.trim()}, ${data.country.trim()}`
          : data.country.trim();

        return (
          <div className="animate-fade-in-up">
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
                <Check className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-semibold text-white text-center mb-3">
              Ready to go!
            </h1>
            <p className="text-zinc-400 text-center mb-8">
              Your AI workspace is personalized for:
            </p>

            <div className="bg-zinc-900/50 rounded-2xl border border-white/5 p-6 space-y-4">
              <div className="flex justify-between">
                <span className="text-zinc-500">Language</span>
                <span className="text-white">{languageLabel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Business</span>
                <span className="text-white font-medium">{data.business_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Location</span>
                <span className="text-white">{locationDisplay}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Type</span>
                <span className="text-white">{segmentLabel} - {nicheLabel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Audience</span>
                <span className="text-white text-right max-w-[200px]">{audienceLabels}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Tone</span>
                <span className="text-white">{toneLabel}</span>
              </div>
            </div>

            <p className="text-sm text-zinc-500 text-center mt-6">
              You can edit your DNA anytime in Settings.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Progress Bar */}
      <div className="w-full max-w-lg mb-12">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-zinc-500">Setup your AI workspace</span>
          <span className="text-sm text-zinc-500">
            Step {currentStep + 1} of {totalSteps}
          </span>
        </div>
        <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      <div className="w-full max-w-lg" key={currentStep}>
        {renderStep()}

        {error && (
          <p className="text-red-400 text-sm text-center mt-4">{error}</p>
        )}

        {/* Navigation */}
        <div className="flex gap-4 mt-8">
          {currentStep > 0 && (
            <button
              onClick={handleBack}
              className="flex-1 py-4 rounded-2xl bg-zinc-900 border border-white/5 text-zinc-400 hover:text-white hover:border-white/10 transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          )}
          <Button
            onClick={handleNext}
            disabled={loading || !canProceed()}
            className={`flex-1 py-4 ${currentStep === 0 ? 'w-full' : ''}`}
          >
            {loading ? (
              'Saving...'
            ) : currentStep === totalSteps - 1 ? (
              <>
                Start Using AIOS
                <Check className="w-4 h-4 ml-2" />
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Skip option */}
      {onSkip && (
        <button
          onClick={onSkip}
          className="mt-12 text-zinc-500 text-sm hover:text-zinc-400 transition-colors"
        >
          Skip for now (prompts won't be personalized)
        </button>
      )}

      {/* Preview footer */}
      {data.business_name && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-zinc-900/90 border border-white/5 backdrop-blur-sm">
          <p className="text-xs text-zinc-400">
            <span className="text-violet-400">{data.business_name}</span>
            {data.country && ` • ${data.city ? `${data.city}, ` : ''}${data.country}`}
          </p>
        </div>
      )}
    </div>
  );
};
