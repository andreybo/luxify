import { createContext } from 'react';
import type { FluxController } from '../core/types';

export const FluxContext = createContext<FluxController | null>(null);
