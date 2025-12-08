import { LegoColor } from '../types';

// Official LEGO Color Palette (Solid Colors)
// IDs based on BrickLink / LDraw standard where possible
export const LEGO_COLORS: LegoColor[] = [
  // Blacks & Greys
  { id: 11, name: 'Black', hex: '#05131D', category: 'Blacks' },
  { id: 103, name: 'Light Grey', hex: '#9BA19D', category: 'Greys', isLegacy: true },
  { id: 86, name: 'Light Bluish Gray', hex: '#A0A5A9', category: 'Greys' },
  { id: 27, name: 'Dark Grey', hex: '#6D6E5C', category: 'Greys', isLegacy: true },
  { id: 85, name: 'Dark Bluish Gray', hex: '#6C6E68', category: 'Greys' },

  // Whites
  { id: 1, name: 'White', hex: '#FFFFFF', category: 'Whites' },
  { id: 49, name: 'Very Light Gray', hex: '#E4E8E8', category: 'Whites', isLegacy: true },

  // Reds
  { id: 5, name: 'Red', hex: '#C91A09', category: 'Reds' },
  { id: 59, name: 'Dark Red', hex: '#720E0F', category: 'Reds' },
  { id: 220, name: 'Coral', hex: '#FF698F', category: 'Reds' },
  { id: 2, name: 'Tan', hex: '#E4CD9E', category: 'Browns' }, // Often grouped with browns/sands

  // Browns & Tans
  { id: 69, name: 'Dark Tan', hex: '#958A73', category: 'Browns' },
  { id: 88, name: 'Reddish Brown', hex: '#582A12', category: 'Browns' },
  { id: 8, name: 'Brown', hex: '#583927', category: 'Browns', isLegacy: true },
  { id: 120, name: 'Dark Brown', hex: '#352100', category: 'Browns' },
  { id: 106, name: 'Fabulous', hex: '#CF9C82', category: 'Browns', isLegacy: true }, // Rare/Flesh
  { id: 28, name: 'Nougat', hex: '#D09168', category: 'Browns' },
  { id: 18, name: 'Medium Nougat', hex: '#CC702A', category: 'Browns' },
  { id: 212, name: 'Light Nougat', hex: '#F6D7B3', category: 'Browns' },

  // Yellows & Oranges
  { id: 3, name: 'Yellow', hex: '#F2CD37', category: 'Yellows' },
  { id: 24, name: 'Bright Light Yellow', hex: '#FFF03A', category: 'Yellows' },
  { id: 226, name: 'Cool Yellow', hex: '#FDF38C', category: 'Yellows' },
  { id: 4, name: 'Orange', hex: '#FE8A18', category: 'Oranges' },
  { id: 31, name: 'Medium Orange', hex: '#FFA70B', category: 'Oranges' },
  { id: 105, name: 'Bright Light Orange', hex: '#F8BB3D', category: 'Oranges' },
  { id: 38, name: 'Dark Orange', hex: '#A95500', category: 'Oranges' },
  { id: 191, name: 'Flame Yellowish Orange', hex: '#FCAC00', category: 'Oranges' },

  // Greens
  { id: 6, name: 'Green', hex: '#237841', category: 'Greens' },
  { id: 288, name: 'Dark Green', hex: '#184632', category: 'Greens' },
  { id: 37, name: 'Bright Green', hex: '#4B9F4A', category: 'Greens' },
  { id: 119, name: 'Lime', hex: '#BBE90B', category: 'Greens' },
  { id: 35, name: 'Olive Green', hex: '#9B9A5A', category: 'Greens' },
  { id: 158, name: 'Sand Green', hex: '#A0BCAC', category: 'Greens' },
  { id: 221, name: 'Bright Yellowish Green', hex: '#95B90B', category: 'Greens' }, // Spring Yellowish Green

  // Blues
  { id: 7, name: 'Blue', hex: '#0055BF', category: 'Blues' },
  { id: 63, name: 'Dark Blue', hex: '#0A3463', category: 'Blues' },
  { id: 42, name: 'Medium Blue', hex: '#5A93DB', category: 'Blues' },
  { id: 135, name: 'Sand Blue', hex: '#6074A1', category: 'Blues' },
  { id: 156, name: 'Medium Azure', hex: '#36AEBF', category: 'Blues' },
  { id: 153, name: 'Dark Azure', hex: '#078BC9', category: 'Blues' },
  { id: 212, name: 'Light Royal Blue', hex: '#87C0EA', category: 'Blues' }, // Bright Light Blue
  { id: 11, name: 'Earth Blue', hex: '#002541', category: 'Blues' }, // Maersk Blue-ish / Dark Blue variant

  // Purples & Pinks
  { id: 89, name: 'Dark Purple', hex: '#3F3691', category: 'Purples' },
  { id: 24, name: 'Purple', hex: '#81007B', category: 'Purples', isLegacy: true },
  { id: 154, name: 'Medium Lavender', hex: '#AC78BA', category: 'Purples' },
  { id: 157, name: 'Lavender', hex: '#E1D5ED', category: 'Purples' },
  { id: 222, name: 'Light Purple', hex: '#EE9DC3', category: 'Purples' }, // Bright Pink
  { id: 23, name: 'Pink', hex: '#FC97AC', category: 'Pinks', isLegacy: true },
  { id: 104, name: 'Bright Pink', hex: '#E4ADC8', category: 'Pinks' }, // Light Purple
  { id: 221, name: 'Dark Pink', hex: '#C870A0', category: 'Pinks' },
  { id: 5, name: 'Magenta', hex: '#923978', category: 'Pinks' },
];

export const COLOR_CATEGORIES = Array.from(new Set(LEGO_COLORS.map(c => c.category)));

export const getLegoColor = (id: number): LegoColor | undefined => {
  return LEGO_COLORS.find(c => c.id === id);
};

