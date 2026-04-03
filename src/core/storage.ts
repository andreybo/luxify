import { isBrowser } from './utils';
import type { FluxState } from './types';

type StorageShape = Partial<FluxState>;

export const readStoredState = (storageKey: string): StorageShape | null => {
  if (!isBrowser()) {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as StorageShape;
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
};

export const writeStoredState = (storageKey: string, state: FluxState): void => {
  if (!isBrowser()) {
    return;
  }

  try {
    window.localStorage.setItem(storageKey, JSON.stringify(state));
  } catch {
    // Ignore storage failures silently.
  }
};

export const removeStoredState = (storageKey: string): void => {
  if (!isBrowser()) {
    return;
  }

  try {
    window.localStorage.removeItem(storageKey);
  } catch {
    // Ignore storage failures silently.
  }
};
