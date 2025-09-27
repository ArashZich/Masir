import { useState, useCallback } from 'react';

export interface UseBooleanReturn {
  value: boolean;
  setValue: (value: boolean) => void;
  setTrue: () => void;
  setFalse: () => void;
  toggle: () => void;
}

export function useBoolean(initialValue: boolean = false, name?: string): UseBooleanReturn {
  const [value, setValue] = useState<boolean>(initialValue);

  const setTrue = useCallback(() => {
    if (name) console.log(`${name} set to true`);
    setValue(true);
  }, [name]);

  const setFalse = useCallback(() => {
    if (name) console.log(`${name} set to false`);
    setValue(false);
  }, [name]);

  const toggle = useCallback(() => {
    setValue(prev => {
      if (name) console.log(`${name} toggled to ${!prev}`);
      return !prev;
    });
  }, [name]);

  return {
    value,
    setValue,
    setTrue,
    setFalse,
    toggle,
  };
}