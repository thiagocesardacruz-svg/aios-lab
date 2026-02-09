import type { BusinessDNA } from './database.types';

/**
 * Substitutes DNA variables in a template string
 * Variables use the format {{variable_name}}
 */
export function substituteDNA(template: string, dna: Partial<BusinessDNA> | null): string {
  if (!dna) return template;

  return template
    .replace(/\{\{business_name\}\}/gi, dna.business_name || '[Your Business Name]')
    .replace(/\{\{location\}\}/gi, dna.location || '[Your Location]')
    .replace(/\{\{target_audience\}\}/gi, dna.target_audience || '[Your Target Audience]')
    .replace(/\{\{tone\}\}/gi, dna.tone || '[Your Brand Tone]')
    .replace(/\{\{primary_goal\}\}/gi, dna.primary_goal || '[Your Primary Goal]')
    .replace(/\{\{usp\}\}/gi, dna.usp || '[Your Unique Selling Proposition]')
    .replace(/\{\{team_size\}\}/gi, dna.team_size || '[Your Team Size]')
    .replace(/\{\{current_tools\}\}/gi, dna.current_tools || '[Your Current Tools]')
    .replace(/\{\{challenges\}\}/gi, dna.challenges || '[Your Main Challenges]');
}

/**
 * Extracts all DNA variables from a template
 */
export function extractDNAVariables(template: string): string[] {
  const matches = template.match(/\{\{(\w+)\}\}/g);
  if (!matches) return [];

  return [...new Set(matches.map(m => m.replace(/\{\{|\}\}/g, '')))];
}

/**
 * Checks if a template has any DNA variables
 */
export function hasDNAVariables(template: string): boolean {
  return /\{\{\w+\}\}/.test(template);
}

/**
 * Highlights DNA variables in a template for preview
 */
export function highlightDNAVariables(template: string): string {
  return template.replace(
    /\{\{(\w+)\}\}/g,
    '<span class="bg-violet-500/20 text-violet-300 px-1 rounded">{{$1}}</span>'
  );
}
