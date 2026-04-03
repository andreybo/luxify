import { useContext, useEffect, useState } from 'react';
import { FluxContext } from './context';
import { createFlux } from '../core/createFlux';
import type { FluxController } from '../core/types';
import { createFallbackController } from './fallback';

let globalController: FluxController | null = null;

export const useFlux = (): FluxController => {
  const context = useContext(FluxContext);
  const [controller, setController] = useState<FluxController>(() =>
    context ?? globalController ?? createFallbackController()
  );

  useEffect(() => {
    if (context) {
      return;
    }

    if (!globalController) {
      globalController = createFlux();
    }

    setController(globalController);
  }, [context]);

  return context ?? controller;
};
