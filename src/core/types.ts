export type FluxSchedule = {
  from: string;
  to: string;
  timeZone?: string;
};

export type FluxTimeContext = {
  date: Date;
  hour: number;
  minute: number;
  timeZone?: string;
};

export type FluxOptions = {
  intensity?: number;
  color?: string;
  zIndex?: number;
  transitionDuration?: number;
  autoEnable?: boolean;
  respectReducedMotion?: boolean;
  id?: string;
  storageKey?: string;
  persist?: boolean;
  schedule?: FluxSchedule;
  shouldEnable?: (context: FluxTimeContext) => boolean;
};

export type FluxState = {
  enabled: boolean;
  intensity: number;
  color: string;
};

export type FluxController = {
  enable: () => void;
  disable: () => void;
  toggle: () => void;
  destroy: () => void;
  setIntensity: (value: number) => void;
  setColor: (value: string) => void;
  isEnabled: () => boolean;
  getState: () => FluxState;
  update: (options: Partial<FluxOptions>) => void;
};
