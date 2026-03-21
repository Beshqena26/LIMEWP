"use client";

import { useState, useEffect } from "react";

export function useSimulatedLoading<T>(
  loader: () => T,
  delay: number = 1500
): { data: T | null; isLoading: boolean } {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setData(loader());
      setIsLoading(false);
    }, delay);
    return () => clearTimeout(timer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { data, isLoading };
}
