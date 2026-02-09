-- ============================================================================
-- TravelTech AIOS - Add segment, niche, and extended fields to business_dna
-- Version: 3.1.1
-- Created: 2026-02-09
-- ============================================================================

-- Add segment field
ALTER TABLE public.business_dna
ADD COLUMN IF NOT EXISTS segment TEXT
CHECK (segment IN ('hotel', 'agency', 'dmc', 'dmo', 'resort', 'tour_guide', 'attraction', 'rental'));

-- Add niche field (segment-specific)
ALTER TABLE public.business_dna
ADD COLUMN IF NOT EXISTS niche TEXT;

-- Add extended field for progressive profiling (goals, identity, market, ops, financials, metrics)
ALTER TABLE public.business_dna
ADD COLUMN IF NOT EXISTS extended JSONB DEFAULT '{}';

-- Make primary_goal nullable (moving to extended.goals)
ALTER TABLE public.business_dna
ALTER COLUMN primary_goal DROP NOT NULL;

-- Create index on segment for filtering
CREATE INDEX IF NOT EXISTS idx_business_dna_segment ON public.business_dna(segment);

-- Comment explaining the extended field structure
COMMENT ON COLUMN public.business_dna.extended IS 'Progressive profiling data: goals (by vertical), identity, market, operations, financials, metrics';
