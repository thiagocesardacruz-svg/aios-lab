-- ============================================================================
-- TravelTech AIOS - Initial Product Catalog
-- Version: 3.1
-- Created: 2026-02-09
-- ============================================================================

-- ============================================================================
-- AIOS BUNDLES (Subscription - Annual)
-- ============================================================================

INSERT INTO public.products (id, name, description, type, segment, price_type, price_usd) VALUES
('hotel-aios', 'Hotel AIOS', 'Complete AI system for hotels - includes all experts, prompts, tools, trails, SOPs, and AI Tutor', 'bundle', 'hotel', 'subscription', 19900),
('agency-aios', 'Agency AIOS', 'Complete AI system for travel agencies - includes all experts, prompts, tools, trails, SOPs, and AI Tutor', 'bundle', 'agency', 'subscription', 19900),
('dmc-aios', 'DMC AIOS', 'Complete AI system for DMCs and tour operators - includes all experts, prompts, tools, trails, SOPs, and AI Tutor', 'bundle', 'dmc', 'subscription', 19900),
('dmo-aios', 'DMO AIOS', 'Complete AI system for destinations and DMOs - includes all experts, prompts, tools, trails, SOPs, and AI Tutor', 'bundle', 'dmo', 'subscription', 19900);

-- ============================================================================
-- STANDALONE MODULES (One-Time - 12 months access)
-- ============================================================================

-- GPT Experts Packs
INSERT INTO public.products (id, name, description, type, segment, price_type, price_usd) VALUES
('hotel-experts', 'Hotel GPT Experts', 'Access to all GPT Expert assistants for hotels', 'standalone', 'hotel', 'one_time', 4900),
('agency-experts', 'Agency GPT Experts', 'Access to all GPT Expert assistants for travel agencies', 'standalone', 'agency', 'one_time', 4900),
('dmc-experts', 'DMC GPT Experts', 'Access to all GPT Expert assistants for DMCs', 'standalone', 'dmc', 'one_time', 4900),
('dmo-experts', 'DMO GPT Experts', 'Access to all GPT Expert assistants for DMOs', 'standalone', 'dmo', 'one_time', 4900);

-- Prompt Packs
INSERT INTO public.products (id, name, description, type, segment, price_type, price_usd) VALUES
('hotel-prompts', 'Hotel Prompt Pack', 'Complete prompt library for hotels', 'standalone', 'hotel', 'one_time', 3900),
('agency-prompts', 'Agency Prompt Pack', 'Complete prompt library for travel agencies', 'standalone', 'agency', 'one_time', 3900),
('dmc-prompts', 'DMC Prompt Pack', 'Complete prompt library for DMCs', 'standalone', 'dmc', 'one_time', 3900),
('dmo-prompts', 'DMO Prompt Pack', 'Complete prompt library for DMOs', 'standalone', 'dmo', 'one_time', 3900);

-- Cross-Segment Tools
INSERT INTO public.products (id, name, description, type, segment, price_type, price_usd) VALUES
('marketing-tools', 'Marketing Tools', 'AI tools for marketing across all tourism segments', 'standalone', 'all', 'one_time', 2900),
('finance-tools', 'Finance Tools', 'AI tools for finance and revenue management', 'standalone', 'all', 'one_time', 2900),
('operations-tools', 'Operations Tools', 'AI tools for operations optimization', 'standalone', 'all', 'one_time', 2900);

-- ============================================================================
-- PRODUCT ACCESS MATRIX
-- ============================================================================

-- Hotel AIOS Bundle - Full Access
INSERT INTO public.product_access (product_id, content_type, segment_filter) VALUES
('hotel-aios', 'experts', 'hotel'),
('hotel-aios', 'prompts', 'hotel'),
('hotel-aios', 'tools', 'all'),
('hotel-aios', 'trails', 'hotel'),
('hotel-aios', 'sops', 'hotel'),
('hotel-aios', 'tutor', 'all'),
('hotel-aios', 'guides', 'all');

-- Agency AIOS Bundle - Full Access
INSERT INTO public.product_access (product_id, content_type, segment_filter) VALUES
('agency-aios', 'experts', 'agency'),
('agency-aios', 'prompts', 'agency'),
('agency-aios', 'tools', 'all'),
('agency-aios', 'trails', 'agency'),
('agency-aios', 'sops', 'agency'),
('agency-aios', 'tutor', 'all'),
('agency-aios', 'guides', 'all');

-- DMC AIOS Bundle - Full Access
INSERT INTO public.product_access (product_id, content_type, segment_filter) VALUES
('dmc-aios', 'experts', 'dmc'),
('dmc-aios', 'prompts', 'dmc'),
('dmc-aios', 'tools', 'all'),
('dmc-aios', 'trails', 'dmc'),
('dmc-aios', 'sops', 'dmc'),
('dmc-aios', 'tutor', 'all'),
('dmc-aios', 'guides', 'all');

-- DMO AIOS Bundle - Full Access
INSERT INTO public.product_access (product_id, content_type, segment_filter) VALUES
('dmo-aios', 'experts', 'dmo'),
('dmo-aios', 'prompts', 'dmo'),
('dmo-aios', 'tools', 'all'),
('dmo-aios', 'trails', 'dmo'),
('dmo-aios', 'sops', 'dmo'),
('dmo-aios', 'tutor', 'all'),
('dmo-aios', 'guides', 'all');

-- Standalone GPT Experts
INSERT INTO public.product_access (product_id, content_type, segment_filter) VALUES
('hotel-experts', 'experts', 'hotel'),
('agency-experts', 'experts', 'agency'),
('dmc-experts', 'experts', 'dmc'),
('dmo-experts', 'experts', 'dmo');

-- Standalone Prompt Packs
INSERT INTO public.product_access (product_id, content_type, segment_filter) VALUES
('hotel-prompts', 'prompts', 'hotel'),
('agency-prompts', 'prompts', 'agency'),
('dmc-prompts', 'prompts', 'dmc'),
('dmo-prompts', 'prompts', 'dmo');

-- Cross-Segment Tools
INSERT INTO public.product_access (product_id, content_type, segment_filter) VALUES
('marketing-tools', 'tools', 'all'),
('finance-tools', 'tools', 'all'),
('operations-tools', 'tools', 'all');
