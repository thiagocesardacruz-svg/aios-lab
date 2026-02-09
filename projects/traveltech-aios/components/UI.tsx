import React, { ButtonHTMLAttributes, InputHTMLAttributes } from 'react';
import { LucideIcon, Check, Copy, Loader2 } from 'lucide-react';
import {
  cardClasses,
  sectionHeaderClasses,
  pageContainerClasses,
  iconContainerClasses,
  gradients,
} from '../lib/design-system';

// =============================================================================
// DESIGN TOKENS (Tailwind classes)
// =============================================================================

const tokens = {
  // Spacing
  spacing: {
    section: 'space-y-8',      // Between major sections
    group: 'space-y-6',        // Between groups within section
    items: 'space-y-4',        // Between items in a list
    inline: 'gap-3',           // Between inline elements
  },

  // Border radius
  radius: {
    sm: 'rounded-lg',          // 8px - small elements
    md: 'rounded-xl',          // 12px - inputs, buttons
    lg: 'rounded-2xl',         // 16px - cards
    xl: 'rounded-3xl',         // 24px - large cards, modals
    full: 'rounded-full',      // pills, avatars
  },

  // Typography
  text: {
    // Sizes
    xs: 'text-xs',             // 12px - labels, captions
    sm: 'text-sm',             // 14px - body small
    base: 'text-base',         // 16px - body
    lg: 'text-lg',             // 18px - subheadings
    xl: 'text-xl',             // 20px - headings
    '2xl': 'text-2xl',         // 24px - page titles
    '3xl': 'text-3xl',         // 30px - hero
    '4xl': 'text-4xl',         // 36px - display

    // Colors
    primary: 'text-white',
    secondary: 'text-zinc-400',
    tertiary: 'text-zinc-500',
    disabled: 'text-zinc-600',
    accent: 'text-violet-400',
  },

  // Backgrounds
  bg: {
    primary: 'bg-zinc-950',
    card: 'bg-zinc-900/50',
    elevated: 'bg-zinc-800/50',
    input: 'bg-zinc-900/50',
    hover: 'hover:bg-zinc-800/60',
  },

  // Borders
  border: {
    subtle: 'border-white/5',
    default: 'border-white/10',
    strong: 'border-white/20',
    focus: 'focus:border-violet-500/50',
    hover: 'hover:border-violet-500/30',
  },

  // Transitions
  transition: {
    fast: 'transition-all duration-200',
    default: 'transition-all duration-300',
    slow: 'transition-all duration-500',
  },
};

// =============================================================================
// BUTTON
// =============================================================================

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  icon: Icon,
  isLoading,
  disabled,
  ...props
}) => {
  const baseStyles = `
    inline-flex items-center justify-center font-medium
    ${tokens.radius.md} ${tokens.transition.default}
    disabled:opacity-50 disabled:cursor-not-allowed
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-950
  `;

  const variants = {
    primary: `
      bg-violet-600 hover:bg-violet-500 text-white
      shadow-[0_0_20px_rgba(139,92,246,0.3)]
      focus:ring-violet-500 border border-violet-500/20
    `,
    secondary: `
      bg-zinc-800 hover:bg-zinc-700 text-zinc-100
      border border-zinc-700 focus:ring-zinc-600
    `,
    ghost: `
      bg-transparent hover:bg-white/5
      text-zinc-400 hover:text-white
    `,
    danger: `
      bg-red-500/10 hover:bg-red-500/20 text-red-400
      border border-red-500/20 focus:ring-red-500
    `,
  };

  const sizes = {
    sm: 'h-8 px-3 text-xs gap-1.5',
    md: 'h-10 px-4 text-sm gap-2',
    lg: 'h-12 px-6 text-base gap-2',
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className={`${iconSizes[size]} animate-spin`} />}
      {!isLoading && Icon && <Icon className={iconSizes[size]} />}
      {children}
    </button>
  );
};

// =============================================================================
// BADGE
// =============================================================================

interface BadgeProps {
  variant?: 'success' | 'warning' | 'error' | 'neutral' | 'violet' | 'cyan';
  size?: 'sm' | 'md';
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  size = 'md',
  children,
}) => {
  const variants = {
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    error: 'bg-red-500/10 text-red-400 border-red-500/20',
    neutral: 'bg-zinc-800 text-zinc-400 border-zinc-700',
    violet: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-0.5 text-xs',
  };

  return (
    <span
      className={`
        inline-flex items-center font-medium border
        ${tokens.radius.full}
        ${variants[variant]}
        ${sizes[size]}
      `}
    >
      {children}
    </span>
  );
};

// =============================================================================
// INPUT
// =============================================================================

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  size = 'md',
  className = '',
  ...props
}) => {
  const sizes = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-11 px-4 text-sm',
    lg: 'h-13 px-4 text-base',
  };

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
          {label}
        </label>
      )}
      <input
        className={`
          ${tokens.bg.input} ${tokens.border.default} ${tokens.radius.md}
          ${sizes[size]} ${tokens.transition.default}
          text-white placeholder-zinc-600
          focus:outline-none ${tokens.border.focus} focus:ring-1 focus:ring-violet-500/50
          ${error ? 'border-red-500/50' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
};

// =============================================================================
// TEXTAREA
// =============================================================================

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
          {label}
        </label>
      )}
      <textarea
        className={`
          ${tokens.bg.input} ${tokens.border.default} ${tokens.radius.md}
          px-4 py-3 ${tokens.transition.default}
          text-white placeholder-zinc-600
          focus:outline-none ${tokens.border.focus} focus:ring-1 focus:ring-violet-500/50
          ${error ? 'border-red-500/50' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
};

// =============================================================================
// CARD
// =============================================================================

interface CardProps {
  children: React.ReactNode;
  padding?: 'sm' | 'md' | 'lg' | 'none';
  hover?: boolean;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  padding = 'md',
  hover = false,
  className = '',
  onClick,
}) => {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      onClick={onClick}
      className={`
        ${tokens.radius.lg} ${tokens.bg.card} border ${tokens.border.subtle}
        ${paddings[padding]}
        ${hover ? `${tokens.bg.hover} ${tokens.border.hover} cursor-pointer` : ''}
        ${tokens.transition.default}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

// =============================================================================
// ICON BOX
// =============================================================================

interface IconBoxProps {
  icon: LucideIcon;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'violet' | 'cyan' | 'emerald' | 'orange' | 'pink' | 'neutral';
  gradient?: boolean;
}

export const IconBox: React.FC<IconBoxProps> = ({
  icon: Icon,
  size = 'md',
  color = 'neutral',
  gradient = false,
}) => {
  const sizes = {
    sm: 'w-8 h-8 rounded-lg',
    md: 'w-10 h-10 rounded-xl',
    lg: 'w-12 h-12 rounded-xl',
    xl: 'w-16 h-16 rounded-2xl',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
  };

  const colors = {
    violet: 'bg-violet-500/10 text-violet-400',
    cyan: 'bg-cyan-500/10 text-cyan-400',
    emerald: 'bg-emerald-500/10 text-emerald-400',
    orange: 'bg-orange-500/10 text-orange-400',
    pink: 'bg-pink-500/10 text-pink-400',
    neutral: 'bg-zinc-800/50 text-zinc-400',
  };

  if (gradient) {
    return (
      <div
        className={`${sizes[size]} ${gradients.primary} flex items-center justify-center`}
      >
        <Icon className={`${iconSizes[size]} text-white`} />
      </div>
    );
  }

  return (
    <div
      className={`${sizes[size]} ${colors[color]} flex items-center justify-center border border-white/5`}
    >
      <Icon className={iconSizes[size]} />
    </div>
  );
};

// =============================================================================
// SECTION HEADER
// =============================================================================

interface SectionHeaderProps {
  title: string;
  action?: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, action }) => (
  <div className="flex items-center justify-between mb-4">
    <h3 className={sectionHeaderClasses}>{title}</h3>
    {action}
  </div>
);

// =============================================================================
// PAGE HEADER
// =============================================================================

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  icon: Icon,
  actions,
}) => (
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 animate-fade-in-up">
    <div className="flex items-center gap-3">
      {Icon && <IconBox icon={Icon} size="md" gradient />}
      <div>
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        {subtitle && <p className="text-zinc-500">{subtitle}</p>}
      </div>
    </div>
    {actions && <div className="flex items-center gap-3">{actions}</div>}
  </div>
);

// =============================================================================
// COPY BLOCK
// =============================================================================

interface CopyBlockProps {
  content: string;
  language?: string;
}

export const CopyBlock: React.FC<CopyBlockProps> = ({ content }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`relative group ${tokens.radius.md} overflow-hidden border ${tokens.border.default} bg-black/40`}>
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handleCopy}
          className={`p-2 ${tokens.radius.sm} bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white ${tokens.transition.default}`}
        >
          {copied ? (
            <Check className="w-4 h-4 text-emerald-500" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>
      </div>
      <pre className="p-4 text-sm font-mono text-zinc-300 overflow-x-auto whitespace-pre-wrap">
        {content}
      </pre>
    </div>
  );
};

// =============================================================================
// DIVIDER
// =============================================================================

export const Divider: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`h-px bg-white/5 ${className}`} />
);

// =============================================================================
// CHIP (for tags, selections)
// =============================================================================

interface ChipProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md';
}

export const Chip: React.FC<ChipProps> = ({
  label,
  selected = false,
  onClick,
  size = 'md',
}) => {
  const sizes = {
    sm: 'px-3 py-1 text-xs',
    md: 'px-4 py-2 text-sm',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        ${tokens.radius.md} font-medium ${tokens.transition.default}
        ${sizes[size]}
        ${
          selected
            ? 'bg-violet-500 text-white shadow-lg shadow-violet-500/25'
            : `${tokens.bg.elevated} text-zinc-300 hover:bg-zinc-700/50 border ${tokens.border.subtle}`
        }
      `}
    >
      {label}
    </button>
  );
};

// =============================================================================
// EXPORTS - Re-export design system utilities
// =============================================================================

export {
  cardClasses,
  sectionHeaderClasses,
  pageContainerClasses,
  iconContainerClasses,
  gradients,
  tokens,
};
