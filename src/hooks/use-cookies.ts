import Cookies from "js-cookie";
import { useEffect, useState } from "react";

export function useCookies<T>(
  key: string,
  initialValue: T,
  opts?: Cookies.CookieAttributes
): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    const item = Cookies.get(key);
    return item ? JSON.parse(item) : initialValue;
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const item = Cookies.get(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [key]);

  const setValue = (value: T) => {
    // Save state
    setStoredValue(value);
    // Save to Cookies
    Cookies.set(key, JSON.stringify(value), opts);
  };

  return [storedValue, setValue];
}
