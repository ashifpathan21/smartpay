import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set a timer to update the debounced value after a delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup function: cancels the timer if value changes again or component unmounts
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Only re-run if value or delay changes

  return debouncedValue;
}


