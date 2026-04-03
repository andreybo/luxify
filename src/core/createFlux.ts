import { DEFAULT_OPTIONS } from './constants';
import { ensureOverlay } from './overlay';
import { createScheduler, evaluateSchedule } from './scheduler';
import { readStoredState, removeStoredState, writeStoredState } from './storage';
import { clamp, isBrowser } from './utils';
import type { FluxController, FluxOptions, FluxState } from './types';

type ResolvedFluxOptions = Omit<
  FluxOptions,
  'intensity' | 'color' | 'zIndex' | 'transitionDuration' | 'autoEnable' | 'respectReducedMotion' | 'id' | 'storageKey' | 'persist'
> &
  typeof DEFAULT_OPTIONS;

const mergeOptions = (options: FluxOptions = {}): ResolvedFluxOptions => ({
  ...DEFAULT_OPTIONS,
  ...options,
  schedule: options.schedule,
  shouldEnable: options.shouldEnable
});

const computeInitialState = (options: ResolvedFluxOptions): FluxState => {
  const stored = options.persist ? readStoredState(options.storageKey) : null;
  const scheduled = evaluateSchedule(options);

  return {
    enabled:
      typeof stored?.enabled === 'boolean'
        ? stored.enabled
        : scheduled ?? options.autoEnable,
    intensity: clamp(
      typeof stored?.intensity === 'number' ? stored.intensity : options.intensity,
      0,
      1
    ),
    color: typeof stored?.color === 'string' ? stored.color : options.color
  };
};

export const createFlux = (input: FluxOptions = {}): FluxController => {
  let options = mergeOptions(input);
  let state = computeInitialState(options);
  let destroyed = false;
  let stopScheduler: (() => void) | null = null;
  const overlay = isBrowser()
    ? ensureOverlay({
        id: options.id,
        zIndex: options.zIndex,
        color: state.color,
        intensity: state.intensity,
        transitionDuration: options.transitionDuration,
        respectReducedMotion: options.respectReducedMotion
      })
    : null;

  const persistState = (): void => {
    if (!options.persist) {
      return;
    }

    writeStoredState(options.storageKey, state);
  };

  const syncOverlay = (): void => {
    overlay?.setColor(state.color);
    overlay?.setIntensity(state.intensity);
    overlay?.setEnabled(state.enabled);
    persistState();
  };

  const syncScheduler = (): void => {
    stopScheduler?.();
    stopScheduler = null;

    if (!isBrowser() || (!options.schedule && !options.shouldEnable)) {
      return;
    }

    stopScheduler = createScheduler(options, (enabled) => {
      state = { ...state, enabled };
      syncOverlay();
    });
  };

  syncOverlay();
  syncScheduler();

  return {
    enable() {
      if (destroyed) {
        return;
      }

      state = { ...state, enabled: true };
      syncOverlay();
    },
    disable() {
      if (destroyed) {
        return;
      }

      state = { ...state, enabled: false };
      syncOverlay();
    },
    toggle() {
      if (destroyed) {
        return;
      }

      state = { ...state, enabled: !state.enabled };
      syncOverlay();
    },
    destroy() {
      if (destroyed) {
        return;
      }

      destroyed = true;
      stopScheduler?.();
      stopScheduler = null;
      overlay?.release();
    },
    setIntensity(value) {
      if (destroyed) {
        return;
      }

      state = { ...state, intensity: clamp(value, 0, 1) };
      syncOverlay();
    },
    setColor(value) {
      if (destroyed) {
        return;
      }

      state = { ...state, color: value };
      syncOverlay();
    },
    isEnabled() {
      return state.enabled;
    },
    getState() {
      return { ...state };
    },
    update(nextOptions) {
      if (destroyed) {
        return;
      }

      const previousStorageKey = options.storageKey;
      options = mergeOptions({ ...options, ...nextOptions });
      state = {
        ...state,
        intensity:
          typeof nextOptions.intensity === 'number'
            ? clamp(nextOptions.intensity, 0, 1)
            : state.intensity,
        color: nextOptions.color ?? state.color,
        enabled:
          typeof nextOptions.autoEnable === 'boolean' && !options.schedule && !options.shouldEnable
            ? nextOptions.autoEnable
            : state.enabled
      };

      if (options.persist && previousStorageKey !== options.storageKey) {
        removeStoredState(previousStorageKey);
      }

      overlay?.updateOptions({
        zIndex: options.zIndex,
        transitionDuration: options.transitionDuration,
        respectReducedMotion: options.respectReducedMotion
      });
      syncOverlay();
      syncScheduler();
    }
  };
};
