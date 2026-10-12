import { useEffect, useState } from "react";

export function useDebounce(value: string, delay: number): string {
    const [debouncedValue, setDebouncedValue] = useState<string>(value);
  
    useEffect(() => {
      // Set a timeout to update the debounced value
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
  
      // Cleanup timeout on value change or unmount
      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);
  
    return debouncedValue;
}