import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createFlux } from '../src/core/createFlux';

describe('createFlux', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    window.localStorage.clear();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('creates only one overlay per id', () => {
    const a = createFlux({ id: 'shared-overlay' });
    const b = createFlux({ id: 'shared-overlay' });

    expect(document.querySelectorAll('#shared-overlay')).toHaveLength(1);

    a.destroy();
    b.destroy();
  });

  it('persists state when enabled', () => {
    const flux = createFlux({ storageKey: 'flux-test', persist: true });

    flux.enable();
    flux.setIntensity(0.4);
    flux.setColor('#ffaa00');

    expect(window.localStorage.getItem('flux-test')).toContain('"enabled":true');
    expect(window.localStorage.getItem('flux-test')).toContain('"intensity":0.4');
    expect(window.localStorage.getItem('flux-test')).toContain('"color":"#ffaa00"');
    flux.destroy();
  });

  it('applies scheduling for overnight windows', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-04-03T20:30:00'));

    const flux = createFlux({
      schedule: {
        from: '19:00',
        to: '07:00'
      }
    });

    expect(flux.isEnabled()).toBe(true);
    flux.destroy();
  });

  it('creates a warm overlay with sane defaults', () => {
    const flux = createFlux();

    expect(flux.getState().intensity).toBeGreaterThan(0);
    expect(document.querySelector('#luxify-overlay')).not.toBeNull();
    flux.destroy();
  });
});
