import { useState } from 'react';
import { getFromLocalStorage, setToLocalStorage } from '../utils/localStorage';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = getFromLocalStorage(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn("Error reading localStorage key:", key, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      setToLocalStorage(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn("Error setting localStorage key:", key, error);
    }
  };

  return [storedValue, setValue];
}
