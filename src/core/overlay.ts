import { clamp, isBrowser } from './utils';

type OverlayOptions = {
  id: string;
  zIndex: number;
  color: string;
  intensity: number;
  transitionDuration: number;
  respectReducedMotion: boolean;
};

export type OverlayHandle = {
  element: HTMLDivElement;
  setEnabled: (enabled: boolean) => void;
  setIntensity: (value: number) => void;
  setColor: (value: string) => void;
  updateOptions: (options: Partial<OverlayOptions>) => void;
  release: () => void;
};

type OverlayRegistryEntry = {
  handle: OverlayHandle;
  refs: number;
};

const overlayRegistry = new Map<string, OverlayRegistryEntry>();

const applyTransition = (
  element: HTMLDivElement,
  duration: number,
  respectReducedMotion: boolean
): void => {
  const reducedMotion =
    respectReducedMotion &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  element.style.transition = reducedMotion
    ? 'none'
    : `opacity ${duration}ms ease, background-color ${duration}ms ease`;
};

export const ensureOverlay = (options: OverlayOptions): OverlayHandle | null => {
  if (!isBrowser()) {
    return null;
  }

  const existingEntry = overlayRegistry.get(options.id);
  if (existingEntry) {
    if (!document.body.contains(existingEntry.handle.element)) {
      overlayRegistry.delete(options.id);
    } else {
      existingEntry.refs += 1;
      existingEntry.handle.updateOptions(options);
      existingEntry.handle.setColor(options.color);
      existingEntry.handle.setIntensity(options.intensity);
      return existingEntry.handle;
    }
  }

  let element = document.getElementById(options.id) as HTMLDivElement | null;

  if (!element) {
    element = document.createElement('div');
    element.id = options.id;
    element.setAttribute('aria-hidden', 'true');
    element.dataset.pageFlux = 'true';
    document.body.appendChild(element);
  }

  Object.assign(element.style, {
    position: 'fixed',
    inset: '0',
    width: '100vw',
    height: '100vh',
    pointerEvents: 'none',
    zIndex: String(options.zIndex),
    backgroundColor: options.color,
    opacity: '0',
    margin: '0',
    padding: '0',
    border: '0',
    display: 'block',
    visibility: 'visible',
    mixBlendMode: 'normal',
    willChange: 'opacity, background-color'
  });

  applyTransition(element, options.transitionDuration, options.respectReducedMotion);

  const handle: OverlayHandle = {
    element,
    setEnabled(enabled) {
      element.style.opacity = enabled ? String(clamp(options.intensity, 0, 1)) : '0';
    },
    setIntensity(value) {
      options.intensity = clamp(value, 0, 1);
      element.style.opacity = element.style.opacity === '0' ? '0' : String(options.intensity);
    },
    setColor(value) {
      options.color = value;
      element.style.backgroundColor = value;
    },
    updateOptions(nextOptions) {
      if (typeof nextOptions.zIndex === 'number') {
        options.zIndex = nextOptions.zIndex;
        element.style.zIndex = String(nextOptions.zIndex);
      }

      if (typeof nextOptions.transitionDuration === 'number') {
        options.transitionDuration = nextOptions.transitionDuration;
      }

      if (typeof nextOptions.respectReducedMotion === 'boolean') {
        options.respectReducedMotion = nextOptions.respectReducedMotion;
      }

      applyTransition(element, options.transitionDuration, options.respectReducedMotion);
    },
    release() {
      const entry = overlayRegistry.get(options.id);
      if (!entry) {
        return;
      }

      entry.refs -= 1;
      if (entry.refs <= 0) {
        overlayRegistry.delete(options.id);
        if (element.parentNode) {
          element.parentNode.removeChild(element);
        }
      }
    }
  };

  overlayRegistry.set(options.id, {
    handle,
    refs: 1
  });

  return handle;
};
