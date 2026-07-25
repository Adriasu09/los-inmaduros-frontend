import { useState, useEffect } from "react";

// Delays updating `value` until it stops changing for `delay` ms — the input
// stays responsive while expensive work (filtering, fetching) waits it out.
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
