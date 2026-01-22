import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const VERSION = process.env.NEXT_PUBLIC_ASSET_VERSION || '1';

/**
 * Добавляет query-параметр версии к пути файла для CDN.
 * @example 'assets/audio/battle.ogg' -> 'assets/audio/battle.ogg?v=1715600000'
 */
export function v(path: string) {
  return `${path}?v=${VERSION}`;
}
