import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

type Initializer<T> = T | (() => T);

const isBrowser = typeof window !== "undefined";

function resolveInitial<T>(initial: Initializer<T>): T {
  return typeof initial === "function" ? (initial as () => T)() : initial;
}

export function usePersistentState<T>(
  key: string,
  initial: Initializer<T>,
): [T, Dispatch<SetStateAction<T>>] {
  const initialRef = useRef(false);
  const [state, setState] = useState<T>(() => {
    if (!isBrowser) {
      return resolveInitial(initial);
    }

    const stored = window.localStorage.getItem(key);
    if (stored) {
      try {
        return JSON.parse(stored) as T;
      } catch (error) {
        console.warn(`Failed to parse localStorage key ${key}`, error);
      }
    }

    return resolveInitial(initial);
  });

  useEffect(() => {
    if (!isBrowser) return;
    if (!initialRef.current) {
      initialRef.current = true;
      return;
    }
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.warn(`Failed to persist localStorage key ${key}`, error);
    }
  }, [key, state]);

  return [state, setState];
}
