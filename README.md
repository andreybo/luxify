```
 ██╗     ██╗   ██╗██╗  ██╗██╗███████╗██╗   ██╗
 ██║     ██║   ██║╚██╗██╔╝██║██╔════╝╚██╗ ██╔╝
 ██║     ██║   ██║ ╚███╔╝ ██║█████╗   ╚████╔╝ 
 ██║     ██║   ██║ ██╔██╗ ██║██╔══╝    ╚██╔╝  
 ███████╗╚██████╔╝██╔╝ ██╗██║██║        ██║   
 ╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚═╝╚═╝        ╚═╝   
```

## Your Website's Night Light

**Stop hurting your eyes while browsing at night.** 

`luxify` transforms any website into a comfortable evening reading experience. Instead of fighting blue light with system settings, bring it right into your web app—instantly. No configuration nightmares. No broken layouts. Just warm, gentle browsing.

### The Problem

It's 10 PM. You're checking email, reading docs, or browsing your dashboard. Your eyes start burning. You reach for f.lux or Night Shift, but they're global, clunky, and don't work on everything. **What if your app could just... care about your eyes?**

### The Solution

`luxify` adds a warm overlay directly on top of your website. It's:

✨ **Effortless** — One line of code. No setup. No configuration.  
🎯 **Safe** — Doesn't break clicks, scrolling, modals, or forms.  
⚡ **Lightweight** — 1.2KB gzipped. TypeScript. Zero dependencies.  
🔄 **Smart** — Optional auto-scheduling (enable at sunset, disable at sunrise).  
♾️ **Works Everywhere** — Vanilla JS, React, Next.js, any framework.  

Ready to care about your users' eyes?

## Live Demo

See it in action at **[toopost.us](https://toopost.us/)** — toggle night mode directly in the app.

## Perfect For

**Reading-heavy websites** where users spend hours:

- 📚 **Documentation sites** (Think Docs, API references)
- 📝 **Blogs & content platforms** (Medium, Substack, news sites)
- 📊 **Dashboards & analytics** (Long evening work sessions)
- 💬 **Community forums & chat** (Discord, Slack web version)
- 🎓 **Learning platforms** (Courses, tutorials, coding challenges)

## Works Great With Light/Dark Themes

Already have a dark mode? `luxify` is the perfect companion. Layer it on top:

```tsx
import { useState } from 'react';
import { FluxProvider, FluxOverlay } from '@andrewbro/luxify/react';

export function App() {
  const [isDark, setIsDark] = useState(false);

  return (
    <div data-theme={isDark ? 'dark' : 'light'}>
      <FluxProvider>
        {/* Night mode layer on top of your existing theme */}
        <FluxOverlay 
          intensity={0.22} 
          color={isDark ? '#1a1a2e' : '#ffb76b'}
        />
        <YourApp />
      </FluxProvider>
    </div>
  );
}
```

Or auto-enable night mode in dark themes, disable in light:

```tsx
const [isDark, setIsDark] = useState(false);

<FluxOverlay 
  intensity={isDark ? 0.15 : 0}  // Subtle in dark mode, off in light
  autoEnable={isDark}
/>
```

## Installation

```bash
npm install @andrewbro/luxify
```

If you want the React API, install React 18+ in your app as usual.

## Quick start

### Vanilla JS

```ts
import { createFlux } from '@andrewbro/luxify';

const flux = createFlux({
  intensity: 0.25,
  color: '#ffb45c',
  autoEnable: true,
  persist: true
});

flux.enable();
flux.disable();
flux.toggle();
flux.setIntensity(0.4);
flux.setColor('#ff9f43');
flux.destroy();
```

### React

React exports live under `@andrewbro/luxify/react` to keep the core entry lightweight for non-React sites.

```tsx
import { FluxOverlay, FluxProvider } from '@andrewbro/luxify/react';

function App() {
  return (
    <FluxProvider options={{ persist: true }}>
      <FluxOverlay intensity={0.25} color="#ffb45c" />
      <Page />
    </FluxProvider>
  );
}
```

```tsx
import { useFlux } from '@andrewbro/luxify/react';

function Page() {
  const { toggle, setIntensity } = useFlux();

  return (
    <div>
      <button onClick={toggle}>Toggle night mode</button>
      <button onClick={() => setIntensity(0.35)}>Make it warmer</button>
    </div>
  );
}
```

## Next.js

Use the React API in a client component.

```tsx
'use client';

import { FluxOverlay, FluxProvider } from '@andrewbro/luxify/react';

export function NightLightShell({ children }: { children: React.ReactNode }) {
  return (
    <FluxProvider options={{ persist: true }}>
      <FluxOverlay
        intensity={0.22}
        color="#ffb76b"
        schedule={{ from: '19:00', to: '07:00', timeZone: 'Europe/Warsaw' }}
      />
      {children}
    </FluxProvider>
  );
}
```

## API

### `createFlux(options?)`

Creates a controller for a single overlay instance.

```ts
type FluxOptions = {
  intensity?: number;
  color?: string;
  zIndex?: number;
  transitionDuration?: number;
  autoEnable?: boolean;
  respectReducedMotion?: boolean;
  id?: string;
  storageKey?: string;
  persist?: boolean;
  schedule?: {
    from: string;
    to: string;
    timeZone?: string;
  };
  shouldEnable?: (context: {
    date: Date;
    hour: number;
    minute: number;
    timeZone?: string;
  }) => boolean;
};
```

Defaults:

- `intensity: 0.22`
- `color: '#ffb76b'`
- `zIndex: 2147483646`
- `transitionDuration: 240`
- `autoEnable: false`
- `respectReducedMotion: true`
- `id: 'luxify-overlay'`
- `storageKey: 'luxify'`
- `persist: false`

### Controller methods

- `enable()`
- `disable()`
- `toggle()`
- `destroy()`
- `setIntensity(value)`
- `setColor(color)`
- `isEnabled()`
- `getState()`
- `update(options)`

## Scheduling

Enable the overlay during the evening and disable it in the morning:

```ts
createFlux({
  schedule: {
    from: '19:00',
    to: '07:00'
  }
});
```

Use a callback for fully custom logic:

```ts
createFlux({
  shouldEnable: ({ hour }) => hour >= 19 || hour < 7
});
```

If you need a specific local clock instead of the browser default, pass `schedule.timeZone`.

## Customization

- Use `intensity` between `0` and `1`
- Use any valid CSS color for `color`
- Use `zIndex` if your app needs a custom stacking level
- Use `respectReducedMotion` to disable transitions for users who prefer reduced motion
- Use `persist: true` to store `enabled`, `intensity`, and `color` in `localStorage`

## Implementation notes

- The overlay uses `position: fixed`, `inset: 0`, `pointer-events: none`, and a very high `z-index`
- The library reuses the same DOM node per `id`, so repeated mounts do not create duplicate overlays
- DOM access happens only in the browser, making the package safe to import in SSR environments
- This is a page-level visual layer only, not a true monitor or operating-system night light

## Development

```bash
npm install
npm run build
npm run test
```
