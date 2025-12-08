export interface BrickDimensions {
  width: number;
  height: number;
}

export interface LegoColor {
  id: number;
  name: string;
  hex: string;
  category: string;
  isLegacy?: boolean;
}

export interface InventoryItem {
  id: string;
  colorId: number;
  dimensions: BrickDimensions;
  quantity: number;
}

// Legacy support / UI helpers
export interface Brick extends InventoryItem {
  // Computed properties for UI
  colorHex: string;
  colorName: string;
}

export type ViewMode = 'inventory' | 'studio';

export type GenerationMode = 'precise' | 'artistic';
