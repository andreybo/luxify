import type { FluxController } from '../core/types';

export const createFallbackController = (): FluxController => ({
  enable: () => undefined,
  disable: () => undefined,
  toggle: () => undefined,
  destroy: () => undefined,
  setIntensity: () => undefined,
  setColor: () => undefined,
  isEnabled: () => false,
  getState: () => ({ enabled: false, intensity: 0, color: '#000000' }),
  update: () => undefined
});
