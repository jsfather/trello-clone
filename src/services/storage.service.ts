/**
 * Storage Service
 * Handles all localStorage operations with type safety
 * Following Single Responsibility Principle
 */

import { Board } from "@/types";
import { STORAGE_KEYS, DEFAULT_BOARD } from "@/constants";

/**
 * Generic storage operations interface
 */
interface StorageService<T> {
  get: () => T | null;
  set: (data: T) => void;
  clear: () => void;
}

/**
 * Check if we're running in browser environment
 */
const isBrowser = (): boolean => typeof window !== "undefined";

/**
 * Creates a typed storage service for any data type
 */
function createStorageService<T>(key: string): StorageService<T> {
  return {
    get: (): T | null => {
      if (!isBrowser()) return null;

      try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
      } catch (error) {
        console.error(`Error reading from localStorage [${key}]:`, error);
        return null;
      }
    },

    set: (data: T): void => {
      if (!isBrowser()) return;

      try {
        localStorage.setItem(key, JSON.stringify(data));
      } catch (error) {
        console.error(`Error writing to localStorage [${key}]:`, error);
      }
    },

    clear: (): void => {
      if (!isBrowser()) return;

      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error(`Error clearing localStorage [${key}]:`, error);
      }
    },
  };
}

/**
 * Board storage service - specialized for Board operations
 */
export const boardStorage = {
  ...createStorageService<Board>(STORAGE_KEYS.BOARD),

  /**
   * Get board with fallback to default
   */
  getOrDefault: (): Board => {
    const stored = createStorageService<Board>(STORAGE_KEYS.BOARD).get();
    return stored || { ...DEFAULT_BOARD };
  },

  /**
   * Reset board to default state
   */
  reset: (): Board => {
    const defaultBoard = { ...DEFAULT_BOARD };
    createStorageService<Board>(STORAGE_KEYS.BOARD).set(defaultBoard);
    return defaultBoard;
  },
};

export default boardStorage;
