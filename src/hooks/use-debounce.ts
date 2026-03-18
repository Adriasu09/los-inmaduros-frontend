import { useState, useEffect } from "react";

/**
 * Retrasa la actualización de un valor hasta que el usuario deja de cambiarlo.
 * Útil para inputs de búsqueda: la UI responde inmediatamente pero
 * las operaciones costosas (filtrado, fetch) solo se ejecutan tras el delay.
 *
 * @param value - Valor a debouncear
 * @param delay - Tiempo de espera en ms (por defecto 300ms)
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
