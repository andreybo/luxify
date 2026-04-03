import { getTimeContext, parseTime } from './utils';
import type { FluxOptions } from './types';

export const evaluateSchedule = (options: Pick<FluxOptions, 'schedule' | 'shouldEnable'>): boolean | null => {
  const now = new Date();

  if (options.shouldEnable) {
    return options.shouldEnable(getTimeContext(now, options.schedule?.timeZone));
  }

  if (!options.schedule) {
    return null;
  }

  const fromMinutes = parseTime(options.schedule.from);
  const toMinutes = parseTime(options.schedule.to);

  if (fromMinutes === null || toMinutes === null) {
    return null;
  }

  const { hour, minute } = getTimeContext(now, options.schedule.timeZone);
  const currentMinutes = hour * 60 + minute;

  if (fromMinutes === toMinutes) {
    return true;
  }

  if (fromMinutes < toMinutes) {
    return currentMinutes >= fromMinutes && currentMinutes < toMinutes;
  }

  return currentMinutes >= fromMinutes || currentMinutes < toMinutes;
};

export const createScheduler = (
  options: Pick<FluxOptions, 'schedule' | 'shouldEnable'>,
  callback: (enabled: boolean) => void
): (() => void) | null => {
  const initial = evaluateSchedule(options);
  if (initial === null) {
    return null;
  }

  callback(initial);

  const intervalId = window.setInterval(() => {
    const value = evaluateSchedule(options);
    if (value !== null) {
      callback(value);
    }
  }, 60_000);

  return () => window.clearInterval(intervalId);
};
