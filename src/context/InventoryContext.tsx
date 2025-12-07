import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Brick, ViewMode, GenerationMode } from '../types';

interface InventoryContextType {
  bricks: Brick[];
  currentView: ViewMode;
  mosaicWidth: number;
  mosaicHeight: number;
  generationMode: GenerationMode;
  uploadedImage: string | null;
  addBrick: (brick: Omit<Brick, 'id'>) => void;
  updateBrick: (id: string, count: number) => void;
  deleteBrick: (id: string) => void;
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
  const [bricks, setBricks] = useState<Brick[]>(() => {
    const saved = localStorage.getItem('mosaic-master-bricks');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentView, setCurrentView] = useState<ViewMode>('inventory');
  const [mosaicWidth, setMosaicWidth] = useState(16);
  const [mosaicHeight, setMosaicHeight] = useState(16);
  const [generationMode, setGenerationMode] = useState<GenerationMode>('precise');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('mosaic-master-bricks', JSON.stringify(bricks));
  }, [bricks]);

  const addBrick = (brick: Omit<Brick, 'id'>) => {
    const existingBrick = bricks.find(
      (b) => b.shape === brick.shape && b.color === brick.color
    );

    if (existingBrick) {
      updateBrick(existingBrick.id, existingBrick.count + brick.count);
    } else {
      const newBrick: Brick = {
        ...brick,
        id: `${Date.now()}-${Math.random()}`,
      };
      setBricks([...bricks, newBrick]);
    }
  };

  const updateBrick = (id: string, count: number) => {
    setBricks(bricks.map((brick) => (brick.id === id ? { ...brick, count } : brick)));
  };

  const deleteBrick = (id: string) => {
    setBricks(bricks.filter((brick) => brick.id !== id));
  };

  return (
    <InventoryContext.Provider
      value={{
        bricks,
        currentView,
        mosaicWidth,
        mosaicHeight,
        generationMode,
        uploadedImage,
        addBrick,
        updateBrick,
        deleteBrick,
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
