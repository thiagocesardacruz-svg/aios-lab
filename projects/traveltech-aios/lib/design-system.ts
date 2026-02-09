/**
 * TravelTech AIOS Design System
 *
 * Princípios:
 * 1. Consistência - Todos os elementos seguem os mesmos tokens
 * 2. Hierarquia - Espaçamentos e tamanhos criam hierarquia visual
 * 3. Acessibilidade - Contraste adequado e estados claros
 * 4. Responsividade - Mobile-first, adapta para desktop
 */

// =============================================================================
// SPACING SCALE (based on 4px grid)
// =============================================================================
export const spacing = {
  0: '0px',
  1: '4px',    // Micro spacing (icon gaps)
  2: '8px',    // Tight spacing (inline elements)
  3: '12px',   // Compact spacing (list items)
  4: '16px',   // Default spacing (card padding)
  5: '20px',   // Medium spacing
  6: '24px',   // Section padding
  8: '32px',   // Large spacing (between sections)
  10: '40px',  // XL spacing
  12: '48px',  // Page margins
  16: '64px',  // Hero sections
} as const;

// =============================================================================
// BORDER RADIUS
// =============================================================================
export const radius = {
  none: '0px',
  sm: '6px',     // Small elements (badges, chips)
  md: '8px',     // Default (inputs, small buttons)
  lg: '12px',    // Cards, larger buttons
  xl: '16px',    // Large cards, modals
  '2xl': '20px', // Hero cards
  '3xl': '24px', // Feature cards
  full: '9999px', // Pills, avatars
} as const;

// =============================================================================
// COLORS
// =============================================================================
export const colors = {
  // Brand
  violet: {
    50: '#f5f3ff',
    100: '#ede9fe',
    200: '#ddd6fe',
    300: '#c4b5fd',
    400: '#a78bfa',
    500: '#8b5cf6',  // Primary
    600: '#7c3aed',
    700: '#6d28d9',
    800: '#5b21b6',
    900: '#4c1d95',
  },
  cyan: {
    400: '#22d3ee',
    500: '#06b6d4',  // Accent
    600: '#0891b2',
  },

  // Semantic
  success: '#10b981',  // emerald-500
  warning: '#f59e0b',  // amber-500
  error: '#ef4444',    // red-500
  info: '#3b82f6',     // blue-500

  // Neutrals (zinc scale)
  bg: {
    primary: '#09090b',    // zinc-950 - Main background
    secondary: '#18181b',  // zinc-900 - Cards
    tertiary: '#27272a',   // zinc-800 - Elevated
    hover: '#3f3f46',      // zinc-700 - Hover states
  },
  border: {
    subtle: 'rgba(255,255,255,0.05)',   // Default borders
    default: 'rgba(255,255,255,0.10)',  // Visible borders
    strong: 'rgba(255,255,255,0.20)',   // Emphasized borders
  },
  text: {
    primary: '#fafafa',    // zinc-50 - Headers
    secondary: '#a1a1aa',  // zinc-400 - Body text
    tertiary: '#71717a',   // zinc-500 - Muted text
    disabled: '#52525b',   // zinc-600 - Disabled
  },
} as const;

// =============================================================================
// TYPOGRAPHY
// =============================================================================
export const typography = {
  // Font sizes with line heights
  xs: { size: '12px', lineHeight: '16px' },
  sm: { size: '14px', lineHeight: '20px' },
  base: { size: '16px', lineHeight: '24px' },
  lg: { size: '18px', lineHeight: '28px' },
  xl: { size: '20px', lineHeight: '28px' },
  '2xl': { size: '24px', lineHeight: '32px' },
  '3xl': { size: '30px', lineHeight: '36px' },
  '4xl': { size: '36px', lineHeight: '40px' },

  // Font weights
  weight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },

  // Letter spacing
  tracking: {
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
} as const;

// =============================================================================
// SHADOWS
// =============================================================================
export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  glow: {
    violet: '0 0 20px rgba(139, 92, 246, 0.3)',
    cyan: '0 0 20px rgba(6, 182, 212, 0.3)',
    white: '0 0 20px rgba(255, 255, 255, 0.2)',
  },
} as const;

// =============================================================================
// COMPONENT TOKENS
// =============================================================================

// Buttons
export const buttonTokens = {
  height: {
    sm: '32px',
    md: '40px',
    lg: '48px',
  },
  padding: {
    sm: '0 12px',
    md: '0 16px',
    lg: '0 24px',
  },
  fontSize: {
    sm: '12px',
    md: '14px',
    lg: '16px',
  },
  radius: radius.lg,
  variants: {
    primary: {
      bg: colors.violet[600],
      bgHover: colors.violet[500],
      text: '#ffffff',
      border: `1px solid ${colors.violet[400]}20`,
      shadow: shadows.glow.violet,
    },
    secondary: {
      bg: colors.bg.tertiary,
      bgHover: colors.bg.hover,
      text: colors.text.primary,
      border: `1px solid ${colors.border.default}`,
      shadow: 'none',
    },
    ghost: {
      bg: 'transparent',
      bgHover: 'rgba(255,255,255,0.05)',
      text: colors.text.secondary,
      border: 'none',
      shadow: 'none',
    },
  },
} as const;

// Cards
export const cardTokens = {
  padding: {
    sm: spacing[4],
    md: spacing[6],
    lg: spacing[8],
  },
  radius: {
    sm: radius.lg,
    md: radius.xl,
    lg: radius['2xl'],
  },
  bg: {
    default: 'rgba(24, 24, 27, 0.5)',     // zinc-900/50
    elevated: 'rgba(39, 39, 42, 0.5)',    // zinc-800/50
    interactive: 'rgba(24, 24, 27, 0.4)', // For hover cards
  },
  border: colors.border.subtle,
  borderHover: 'rgba(139, 92, 246, 0.3)', // violet-500/30
} as const;

// Inputs
export const inputTokens = {
  height: {
    sm: '36px',
    md: '44px',
    lg: '52px',
  },
  padding: '0 16px',
  radius: radius.xl,
  bg: 'rgba(24, 24, 27, 0.5)',
  border: colors.border.default,
  borderFocus: 'rgba(139, 92, 246, 0.5)',
  text: colors.text.primary,
  placeholder: colors.text.disabled,
} as const;

// Section spacing
export const sectionTokens = {
  gap: {
    tight: spacing[4],    // 16px - Between related items
    default: spacing[6],  // 24px - Between groups
    loose: spacing[8],    // 32px - Between sections
  },
  padding: {
    page: spacing[6],     // Page content padding
    card: spacing[6],     // Card internal padding
    modal: spacing[6],    // Modal padding
  },
} as const;

// =============================================================================
// TAILWIND CLASS HELPERS
// =============================================================================

/**
 * Standard card classes
 */
export const cardClasses = {
  base: 'rounded-2xl bg-zinc-900/50 border border-white/5',
  hover: 'hover:border-violet-500/30 hover:bg-zinc-800/60 transition-all duration-300',
  interactive: 'cursor-pointer hover:-translate-y-1',
  padding: {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  },
} as const;

/**
 * Standard section header classes
 */
export const sectionHeaderClasses = 'text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4';

/**
 * Standard page container classes
 */
export const pageContainerClasses = 'w-full max-w-6xl mx-auto space-y-8 animate-fade-in-up';

/**
 * Standard icon container classes
 */
export const iconContainerClasses = {
  sm: 'w-8 h-8 rounded-lg',
  md: 'w-10 h-10 rounded-xl',
  lg: 'w-12 h-12 rounded-xl',
  xl: 'w-16 h-16 rounded-2xl',
};

/**
 * Standard gradient backgrounds
 */
export const gradients = {
  primary: 'bg-gradient-to-br from-violet-500 to-cyan-500',
  subtle: 'bg-gradient-to-br from-violet-500/10 to-cyan-500/10',
  card: 'bg-gradient-to-r from-violet-500/5 to-cyan-500/5',
};
