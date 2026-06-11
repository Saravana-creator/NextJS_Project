"use client";

import { useState } from "react";

export function useLocalCrud<T extends { id: string }>(initialItems: T[]) {
  const [items, setItems] = useState(initialItems);

  return {
    items,
    create: (item: T) => setItems((current) => [item, ...current]),
    update: (id: string, next: Partial<T>) =>
      setItems((current) =>
        current.map((item) => (item.id === id ? { ...item, ...next } : item)),
      ),
    remove: (id: string) =>
      setItems((current) => current.filter((item) => item.id !== id)),
  };
}
