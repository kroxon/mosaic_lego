import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { InventoryItem, ViewMode, GenerationMode } from '../types';

interface InventoryContextType {
  inventory: InventoryItem[];
  currentView: ViewMode;
  mosaicWidth: number;
  mosaicHeight: number;
  generationMode: GenerationMode;
  uploadedImage: string | null;
  addToInventory: (item: Omit<InventoryItem, 'id'>) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeFromInventory: (id: string) => void;
  setCurrentView: (view: ViewMode) => void;
  setMosaicWidth: (width: number) => void;
  setMosaicHeight: (height: number) => void;
  setGenerationMode: (mode: GenerationMode) => void;
  setUploadedImage: (image: string | null) => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within InventoryProvider');
  }
  return context;
};

export const InventoryProvider = ({ children }: { children: ReactNode }) => {
  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem('mosaic-lego-inventory-v2');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentView, setCurrentView] = useState<ViewMode>('inventory');
  
  const [mosaicWidth, setMosaicWidth] = useState(() => {
    const saved = localStorage.getItem('mosaic-lego-width');
    return saved ? parseInt(saved) : 48;
  });
  
  const [mosaicHeight, setMosaicHeight] = useState(() => {
    const saved = localStorage.getItem('mosaic-lego-height');
    return saved ? parseInt(saved) : 48;
  });

  const [generationMode, setGenerationMode] = useState<GenerationMode>('precise');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('mosaic-lego-inventory-v2', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('mosaic-lego-width', mosaicWidth.toString());
  }, [mosaicWidth]);

  useEffect(() => {
    localStorage.setItem('mosaic-lego-height', mosaicHeight.toString());
  }, [mosaicHeight]);

  const addToInventory = (item: Omit<InventoryItem, 'id'>) => {
    const existingItem = inventory.find(
      (i) => 
        i.colorId === item.colorId && 
        i.dimensions.width === item.dimensions.width && 
        i.dimensions.height === item.dimensions.height
    );

    if (existingItem) {
      updateQuantity(existingItem.id, existingItem.quantity + item.quantity);
    } else {
      const newItem: InventoryItem = {
        ...item,
        id: crypto.randomUUID(),
      };
      setInventory([...inventory, newItem]);
    }
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromInventory(id);
      return;
    }
    setInventory(inventory.map((item) => (item.id === id ? { ...item, quantity } : item)));
  };

  const removeFromInventory = (id: string) => {
    setInventory(inventory.filter((item) => item.id !== id));
  };

  return (
    <InventoryContext.Provider
      value={{
        inventory,
        currentView,
        mosaicWidth,
        mosaicHeight,
        generationMode,
        uploadedImage,
        addToInventory,
        updateQuantity,
        removeFromInventory,
        setCurrentView,
        setMosaicWidth,
        setMosaicHeight,
        setGenerationMode,
        setUploadedImage,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};
