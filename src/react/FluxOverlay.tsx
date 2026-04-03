import { useEffect } from 'react';
import { useFlux } from './useFlux';
import type { FluxOptions } from '../core/types';

export type FluxOverlayProps = Pick<
  FluxOptions,
  | 'intensity'
  | 'color'
  | 'zIndex'
  | 'transitionDuration'
  | 'respectReducedMotion'
  | 'autoEnable'
  | 'schedule'
  | 'shouldEnable'
>;

export const FluxOverlay = (props: FluxOverlayProps) => {
  const flux = useFlux();

  useEffect(() => {
    flux.update(props);
  }, [flux, props]);

  return null;
};
