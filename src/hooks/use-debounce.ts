import { useEffect, useState } from "react";

// use debounce
export function useDebounce(value: string, delay: number) {
  // debounceValue
  const [debounceValue, setDebounceValue] = useState<string>(value);
  // effect
  useEffect(() => {
    // handler
    const handler = setTimeout(() => {
      setDebounceValue(value);
    }, delay);

    // cleanup
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  // return the value
  return debounceValue;
}
