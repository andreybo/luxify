import { useEffect, useState } from 'react';
import type { PropsWithChildren } from 'react';
import { createFlux } from '../core/createFlux';
import { FluxContext } from './context';
import type { FluxController, FluxOptions } from '../core/types';
import { createFallbackController } from './fallback';

export type FluxProviderProps = PropsWithChildren<{
  options?: FluxOptions;
}>;

export const FluxProvider = ({ children, options }: FluxProviderProps) => {
  const [controller, setController] = useState<FluxController>(() => createFallbackController());

  useEffect(() => {
    const nextController = createFlux(options);
    setController(nextController);

    return () => {
      nextController.destroy();
    };
  }, []);

  useEffect(() => {
    controller.update(options ?? {});
  }, [controller, options]);

  return <FluxContext.Provider value={controller}>{children}</FluxContext.Provider>;
};
