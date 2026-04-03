import type { FluxTimeContext } from './types';

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

export const isBrowser = (): boolean =>
  typeof window !== 'undefined' && typeof document !== 'undefined';

export const getTimeContext = (date: Date, timeZone?: string): FluxTimeContext => {
  if (!timeZone) {
    return {
      date,
      hour: date.getHours(),
      minute: date.getMinutes()
    };
  }

  const parts = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone
  }).formatToParts(date);

  const hour = Number(parts.find((part) => part.type === 'hour')?.value ?? 0);
  const minute = Number(parts.find((part) => part.type === 'minute')?.value ?? 0);

  return { date, hour, minute, timeZone };
};

export const parseTime = (value: string): number | null => {
  const match = /^([01]?\d|2[0-3]):([0-5]\d)$/.exec(value);

  if (!match) {
    return null;
  }

  return Number(match[1]) * 60 + Number(match[2]);
};
