import { useRef, useEffect } from 'react';

const useDebouncedEffect = (effect, deps, delay) => {
  const timeoutRef = useRef(null);

  useEffect(() => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(effect, delay);

    return () => clearTimeout(timeoutRef.current);
  }, [...deps, delay]);
};
