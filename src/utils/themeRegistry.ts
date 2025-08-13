/**
 * Theme Registry Utilities
 *
 * Manages the list of available themes (built-in and custom) with
 * localStorage persistence and change notifications.
 */

import type { Theme } from '../theme';

const STORAGE_KEY = 'evolve-theme-registry';
export const REGISTRY_CHANGED_EVENT = 'evolve-theme-registry-changed';

export interface ThemeRegistryEntry {
  id: string;
  name: string;
  builtIn: boolean;
}

interface ThemeRegistryState {
  themes: ThemeRegistryEntry[];
}

const BUILT_IN_THEMES: Array<{ id: Theme; name: string }> = [
  { id: 'system', name: 'System' },
  { id: 'high-contrast', name: 'High Contrast' },
  { id: 'dark', name: 'Dark' },
  { id: 'light', name: 'Light' },
  { id: 'startup', name: 'Startup' },
  { id: 'enterprise', name: 'Enterprise' }
];

let memoryState: ThemeRegistryState | null = null;

function dispatchRegistryChanged(): void {
  try {
    window.dispatchEvent(new CustomEvent(REGISTRY_CHANGED_EVENT));
  } catch {
    void 0;
  }
}

function loadState(): ThemeRegistryState {
  // Start with built-ins
  const base: ThemeRegistryState = {
    themes: BUILT_IN_THEMES.map((t) => ({ id: t.id, name: t.name, builtIn: true }))
  };

  // Try to merge in stored custom themes
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return base;
    const parsed = JSON.parse(raw) as ThemeRegistryState;
    if (!parsed || !Array.isArray(parsed.themes)) return base;
    const customs = parsed.themes.filter((t) => !t.builtIn);
    const merged: ThemeRegistryState = {
      themes: [...base.themes, ...customs]
    };
    return merged;
  } catch {
    // Fallback to in-memory state if available
    if (memoryState) return memoryState;
    return base;
  }
}

function saveState(state: ThemeRegistryState): void {
  // Never persist built-ins as modifiable entries; only store customs
  const toPersist: ThemeRegistryState = {
    themes: state.themes.filter((t) => !t.builtIn)
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toPersist));
  } catch {
    memoryState = toPersist;
  }
}

export function listThemes(): string[] {
  return loadState().themes.map((t) => t.id);
}

export function listThemeEntries(): ThemeRegistryEntry[] {
  return loadState().themes;
}

export function getThemeLabel(id: string): string {
  const entry = loadState().themes.find((t) => t.id === id);
  return entry?.name || id;
}

export function registerCustomTheme(id: string, name: string): void {
  const state = loadState();
  if (state.themes.some((t) => t.id === id)) {
    // If it exists and is built-in, do nothing; if custom, update name via rename
    if (!state.themes.find((t) => t.id === id)?.builtIn) {
      renameCustomTheme(id, name);
    }
    return;
  }
  state.themes.push({ id, name, builtIn: false });
  saveState(state);
  dispatchRegistryChanged();
}

export function renameCustomTheme(id: string, name: string): void {
  const state = loadState();
  const entry = state.themes.find((t) => t.id === id);
  if (!entry) return;
  if (entry.builtIn) return; // do not allow renaming built-ins
  entry.name = name;
  saveState(state);
  dispatchRegistryChanged();
}

export function unregisterCustomTheme(id: string): void {
  const state = loadState();
  const entry = state.themes.find((t) => t.id === id);
  if (!entry) return;
  if (entry.builtIn) return; // do not allow removing built-ins
  state.themes = state.themes.filter((t) => t.id !== id);
  saveState(state);
  dispatchRegistryChanged();
}

// Export a snapshot of the full registry (built-ins + customs)
export function getRegistrySnapshot(): ThemeRegistryEntry[] {
  return listThemeEntries().map((t) => ({ ...t }));
}

// Import a snapshot of custom themes into the registry
// mode: 'merge' updates existing customs and adds new ones; 'replaceCustom' clears customs first
export function importRegistrySnapshot(entries: ThemeRegistryEntry[], mode: 'merge' | 'replaceCustom' = 'merge'): void {
  const state = loadState();
  if (mode === 'replaceCustom') {
    state.themes = state.themes.filter((t) => t.builtIn);
  }
  // Merge custom entries
  entries.forEach((incoming) => {
    if (incoming.builtIn) return; // ignore built-in mutations
    const existing = state.themes.find((t) => t.id === incoming.id);
    if (!existing) {
      state.themes.push({ id: incoming.id, name: incoming.name, builtIn: false });
    } else if (!existing.builtIn) {
      existing.name = incoming.name;
    }
  });
  saveState(state);
  dispatchRegistryChanged();
}


