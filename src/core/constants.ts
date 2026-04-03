import type { FluxOptions } from './types';

export const DEFAULT_OPTIONS: Required<
  Pick<
    FluxOptions,
    | 'intensity'
    | 'color'
    | 'zIndex'
    | 'transitionDuration'
    | 'autoEnable'
    | 'respectReducedMotion'
    | 'id'
    | 'storageKey'
    | 'persist'
  >
> = {
  intensity: 0.22,
  color: '#ffb76b',
  zIndex: 2147483646,
  transitionDuration: 240,
  autoEnable: false,
  respectReducedMotion: true,
  id: 'luxify-overlay',
  storageKey: 'luxify',
  persist: false
};
