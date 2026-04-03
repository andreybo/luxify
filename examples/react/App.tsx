import { FluxOverlay, FluxProvider, useFlux } from '../../src/react';

function Controls() {
  const flux = useFlux();

  return (
    <button onClick={() => flux.toggle()} type="button">
      Toggle warm filter
    </button>
  );
}

export function App() {
  return (
    <FluxProvider
      options={{
        persist: true,
        schedule: {
          from: '19:00',
          to: '07:00'
        }
      }}
    >
      <FluxOverlay intensity={0.22} color="#ffb76b" />
      <Controls />
    </FluxProvider>
  );
}
