import { useState, useEffect, useCallback, useRef } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const hasLoadedRef = useRef(false);
  const persistTimerRef = useRef<number | undefined>(undefined);

  const shouldUseRemote =
    typeof window !== 'undefined' &&
    // Cloudflare Pages sets this at build-time
    (import.meta as any).env?.PROD === true;

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let canceled = false;

    const load = async () => {
      // 1) Try remote (Cloudflare) first in production
      if (shouldUseRemote) {
        try {
          const res = await fetch(`/api/kv/${encodeURIComponent(key)}`, {
            method: 'GET',
            headers: { 'accept': 'application/json' }
          });

          if (res.ok) {
            const json = await res.json();
            if (!canceled) {
              setStoredValue(json as T);
              hasLoadedRef.current = true;
            }
            return;
          }
        } catch {
          // fall back to local
        }
      }

      // 2) Fallback to localStorage
      try {
        const item = window.localStorage.getItem(key);
        if (item && !canceled) {
          setStoredValue(JSON.parse(item));
        }
      } catch (error) {
        console.warn(`Error reading localStorage key "${key}":`, error);
      } finally {
        if (!canceled) hasLoadedRef.current = true;
      }
    };

    load();
    return () => {
      canceled = true;
    };
  }, [key]);

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    try {
      setStoredValue(prev => {
        const valueToStore = value instanceof Function ? value(prev) : value;
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
        return valueToStore;
      });
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key]);

  // Persist to remote in production (basic debounce)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!shouldUseRemote) return;
    if (!hasLoadedRef.current) return;

    if (persistTimerRef.current) {
      window.clearTimeout(persistTimerRef.current);
    }

    persistTimerRef.current = window.setTimeout(async () => {
      try {
        await fetch(`/api/kv/${encodeURIComponent(key)}`, {
          method: 'PUT',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(storedValue)
        });
      } catch {
        // ignore
      }
    }, 400);

    return () => {
      if (persistTimerRef.current) {
        window.clearTimeout(persistTimerRef.current);
      }
    };
  }, [key, storedValue, shouldUseRemote]);

  return [storedValue, setValue];
}
