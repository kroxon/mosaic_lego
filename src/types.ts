export interface Brick {
  id: string;
  shape: string;
  color: string;
  colorName: string;
  count: number;
}

export interface LegoColor {
  hex: string;
  name: string;
  category: string;
}

export type ViewMode = 'inventory' | 'studio';

export type GenerationMode = 'precise' | 'artistic';
