/**
 * Project Filter - Shared helper for multi-project support
 *
 * Used by: clickup-sync, cycle-time, dashboard-unified, weekly-report
 *
 * Usage:
 *   import { loadCurrentProject, filterByProject, getProjectLabel, PROJECT_FIELD_ID, PROJECT_OPTIONS } from './lib/project-filter.mjs';
 *   tasks = filterByProject(tasks, 'traveltech');
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../../../..');

// ClickUp PROJECT_GOAL custom field
export const PROJECT_FIELD_ID = '66da50fb-4e96-4f2b-bdb2-4180e807699b';

// ClickUp dropdown option UUIDs
export const PROJECT_OPTIONS = {
  'AI OS V3.1 MVP': 'c9002fea-faca-485c-a10d-fe38431c1d72',
  'AIOS Framework': '457e8721-7ebb-4e7a-86ef-6dedd4a9478f',
  'Clawdbot Operations': '27ce6720-2e51-4d6d-b268-c5a42a780778',
  'Infrastructure': 'dc12ad34-2546-460f-b418-f461d7f2d15b',
  'Research & Planning': 'f678e62b-1e9f-4831-be10-7a47400d5bca'
};

// Friendly key → ClickUp option name(s)
const PROJECT_KEY_MAP = {
  'traveltech': ['AI OS V3.1 MVP'],
  'framework': ['AIOS Framework', 'Clawdbot Operations', 'Infrastructure', 'Research & Planning'],
  'all': null  // no filter
};

/**
 * Read current_project from .aios/projects.yaml
 */
export function loadCurrentProject() {
  const file = path.join(ROOT, '.aios/projects.yaml');
  if (!fs.existsSync(file)) return 'traveltech';
  const content = fs.readFileSync(file, 'utf-8');
  const match = content.match(/current_project:\s*"?([^"\n]+)"?/);
  return match ? match[1].trim() : 'traveltech';
}

/**
 * Filter ClickUp tasks by project key
 * @param {Array} tasks - ClickUp tasks with custom_fields
 * @param {string|null} projectKey - 'traveltech', 'framework', 'all', or null (no filter)
 * @returns {Array} filtered tasks
 */
export function filterByProject(tasks, projectKey) {
  if (!projectKey || projectKey === 'all') return tasks;

  const clickupNames = PROJECT_KEY_MAP[projectKey];
  if (!clickupNames) {
    // Try direct ClickUp name match
    const uuid = PROJECT_OPTIONS[projectKey];
    if (!uuid) return tasks;
    return tasks.filter(t => {
      const pf = t.custom_fields?.find(f => f.id === PROJECT_FIELD_ID);
      const val = pf?.type_config?.options?.find(o => o.id === pf?.value);
      return val?.id === uuid;
    });
  }

  const uuids = clickupNames.map(n => PROJECT_OPTIONS[n]).filter(Boolean);

  return tasks.filter(t => {
    const pf = t.custom_fields?.find(f => f.id === PROJECT_FIELD_ID);
    if (!pf?.value) return false;
    return uuids.includes(pf.value);
  });
}

/**
 * Get display label for project key
 */
export function getProjectLabel(projectKey) {
  if (!projectKey || projectKey === 'all') return 'All Projects';
  const labels = {
    'traveltech': 'TravelTech',
    'framework': 'AIOS Framework'
  };
  return labels[projectKey] || projectKey;
}

/**
 * Parse --project from CLI args
 */
export function parseProjectArg(args) {
  const arg = args.find(a => a.startsWith('--project='));
  return arg ? arg.split('=')[1] : null;
}
