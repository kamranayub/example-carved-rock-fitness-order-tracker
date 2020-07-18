import { useState, useEffect } from "react";

export function useHasCacheStorage(cacheName: string) {
  const [hasCache, setHasCache] = useState<boolean | null>(null);

  useEffect(() => {
    window?.caches?.has(cacheName).then((hasCacheStorage) => {
      setHasCache(hasCacheStorage);
    });
  }, [cacheName]);

  return hasCache;
}
