/**
 * useLocalStorage Hook
 * Syncs state with localStorage for persistence
 * Following Dependency Inversion - abstracts storage details
 */

"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface UseLocalStorageOptions<T> {
  serializer?: (value: T) => string;
  deserializer?: (value: string) => T;
}

/**
 * Custom hook for syncing state with localStorage
 * Uses initialValue for SSR, then syncs with localStorage on client
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options?: UseLocalStorageOptions<T>
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const { serializer = JSON.stringify, deserializer = JSON.parse } =
    options || {};

  // Always start with initialValue to prevent hydration mismatch
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isHydrated, setIsHydrated] = useState(false);
  const isFirstRender = useRef(true);

  // Sync with localStorage after hydration (client-side only)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      try {
        const item = localStorage.getItem(key);
        if (item) {
          setStoredValue(deserializer(item));
        }
      } catch (error) {
        console.error(`Error reading localStorage key "${key}":`, error);
      }
      setIsHydrated(true);
    }
  }, [key, deserializer]);

  // Update localStorage when value changes (after hydration)
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(key, serializer(storedValue));
      } catch (error) {
        console.error(`Error writing localStorage key "${key}":`, error);
      }
    }
  }, [key, serializer, storedValue, isHydrated]);

  // Set value function
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        setStoredValue((prev) =>
          value instanceof Function ? value(prev) : value
        );
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key]
  );

  // Remove value from localStorage
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== "undefined") {
        localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  // Listen for storage changes from other tabs
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.newValue !== null) {
        try {
          setStoredValue(deserializer(event.newValue));
        } catch (error) {
          console.error(`Error parsing storage event for "${key}":`, error);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key, deserializer]);

  return [storedValue, setValue, removeValue];
}

export default useLocalStorage;
