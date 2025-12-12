import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface CompareProperty {
  id: string;
  title_en: string;
  title_fr: string;
  price: number;
  listing_type: string;
  bedrooms?: number;
  bathrooms?: number;
  property_size?: number;
  city: string;
  province: string;
  image_urls: string[];
  amenities?: string[];
}

interface CompareContextType {
  compareList: CompareProperty[];
  addToCompare: (property: CompareProperty) => void;
  removeFromCompare: (id: string) => void;
  clearCompare: () => void;
  isInCompare: (id: string) => boolean;
  maxCompare: number;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [compareList, setCompareList] = useState<CompareProperty[]>([]);
  const maxCompare = 4;

  const addToCompare = (property: CompareProperty) => {
    if (compareList.length >= maxCompare) return;
    if (compareList.some(p => p.id === property.id)) return;
    setCompareList(prev => [...prev, property]);
  };

  const removeFromCompare = (id: string) => {
    setCompareList(prev => prev.filter(p => p.id !== id));
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  const isInCompare = (id: string) => {
    return compareList.some(p => p.id === id);
  };

  return (
    <CompareContext.Provider value={{
      compareList,
      addToCompare,
      removeFromCompare,
      clearCompare,
      isInCompare,
      maxCompare
    }}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
}
