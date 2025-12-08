import { InventoryItem, LegoColor } from '../types';
import { LEGO_COLORS } from '../data/legoColors';
import { RGB, hexToRgb, colorDistance } from '../utils/colorUtils';

export interface MosaicPixel {
  x: number;
  y: number;
  colorId: number;
  isSubstituted: boolean; // True if we had to use a fallback color
  originalColorId: number; // The ideal color we wanted
}

export interface PlacedBrick {
  id: string; // Unique ID for rendering
  x: number;
  y: number;
  width: number;
  height: number;
  colorId: number;
  colorHex: string;
}

export interface MosaicResult {
  pixels: MosaicPixel[]; // The 1x1 color map
  placedBricks: PlacedBrick[]; // The optimized geometry
  usedInventory: Map<string, number>; // Inventory ID -> Count used
  missingBricks: Map<number, number>; // Color ID -> Count needed (if inventory was insufficient)
}

/**
 * Finds the closest LEGO color for a given RGB value.
 */
const findClosestColor = (target: RGB, availableColors: LegoColor[]): number => {
  let minDistance = Infinity;
  let closestColorId = availableColors[0].id;

  for (const color of availableColors) {
    const colorRgb = hexToRgb(color.hex);
    const distance = colorDistance(target, colorRgb);
    if (distance < minDistance) {
      minDistance = distance;
      closestColorId = color.id;
    }
  }

  return closestColorId;
};

/**
 * Core Mosaic Generation Logic
 */
export const generateMosaic = (
  pixels: RGB[],
  width: number,
  height: number,
  inventory: InventoryItem[],
  useInventoryOnly: boolean = true
): MosaicResult => {
  // 1. Prepare Inventory Map for fast lookup
  // Map<ColorID, Map<DimensionsKey, Quantity>>
  const inventoryMap = new Map<number, Map<string, number>>();
  
  inventory.forEach(item => {
    if (!inventoryMap.has(item.colorId)) {
      inventoryMap.set(item.colorId, new Map());
    }
    const dimKey = `${item.dimensions.width}x${item.dimensions.height}`;
    const currentQty = inventoryMap.get(item.colorId)!.get(dimKey) || 0;
    inventoryMap.get(item.colorId)!.set(dimKey, currentQty + item.quantity);
  });

  // 2. Color Mapping (Quantization)
  // We map each pixel to the best LEGO color.
  // If useInventoryOnly is true, we try to map to colors we HAVE first.
  // However, for the "Professional" look, we should first find the IDEAL color,
  // and then handle substitution if we run out of 1x1s (or larger).
  
  const mosaicPixels: MosaicPixel[] = [];
  const missingBricks = new Map<number, number>();
  
  // For now, we assume we can always fall back to 1x1.
  // If we don't have 1x1 of the ideal color, we find the next closest color we DO have.
  
  // Get all unique colors present in inventory to speed up search
  const inventoryColorIds = Array.from(inventoryMap.keys());
  const inventoryColors = LEGO_COLORS.filter(c => inventoryColorIds.includes(c.id));
  const allColors = LEGO_COLORS; // Or filter by "Active" colors if needed

  // Temporary map to track total stud usage during color mapping phase
  // We count total studs (area) to allow using larger bricks if 1x1s are missing.
  const tempInventoryCounts = new Map<number, number>();
  inventory.forEach(i => {
      const area = i.dimensions.width * i.dimensions.height;
      tempInventoryCounts.set(i.colorId, (tempInventoryCounts.get(i.colorId) || 0) + (i.quantity * area));
  });

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pixelIndex = y * width + x;
      const targetRgb = pixels[pixelIndex];
      
      // Find ideal color from ALL Lego colors
      const idealColorId = findClosestColor(targetRgb, allColors);
      
      let finalColorId = idealColorId;

      if (useInventoryOnly) {
        const currentStock = tempInventoryCounts.get(idealColorId) || 0;
        
        if (currentStock > 0) {
           tempInventoryCounts.set(idealColorId, currentStock - 1);
        } else {
           // We are out of ideal color. Find closest available.
           if (inventoryColors.length > 0) {
               finalColorId = findClosestColor(targetRgb, inventoryColors);
               const subStock = tempInventoryCounts.get(finalColorId) || 0;
               if (subStock > 0) {
                   tempInventoryCounts.set(finalColorId, subStock - 1);
               } else {
                   // We are out of the substitute too!
                   finalColorId = idealColorId;
                   missingBricks.set(finalColorId, (missingBricks.get(finalColorId) || 0) + 1);
               }
           } else {
               // No inventory at all
               missingBricks.set(finalColorId, (missingBricks.get(finalColorId) || 0) + 1);
           }
        }
      }

      mosaicPixels.push({
        x,
        y,
        colorId: finalColorId,
        isSubstituted: finalColorId !== idealColorId,
        originalColorId: idealColorId
      });
    }
  }

  // 3. Geometric Optimization (Greedy Packing)
  const placedBricks: PlacedBrick[] = [];
  const covered = new Array(width * height).fill(false);
  const usedInventory = new Map<string, number>();

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (covered[y * width + x]) continue;

      const currentColorId = mosaicPixels[y * width + x].colorId;
      const currentColorHex = LEGO_COLORS.find(c => c.id === currentColorId)?.hex || '#000000';

      // Try to fit the largest possible brick from inventory
      const availableShapes = inventoryMap.get(currentColorId);
      
      let bestBrick = { w: 1, h: 1, inventoryKey: '1x1' };
      let found = false;

      if (availableShapes && useInventoryOnly) {
          // Get shapes with qty > 0
          // We expand the shapes to include rotations
          const candidates: { w: number, h: number, area: number, key: string }[] = [];
          
          for (const [key, qty] of availableShapes.entries()) {
              if (qty > 0) {
                  const [w, h] = key.split('x').map(Number);
                  // Add original
                  candidates.push({ w, h, area: w * h, key });
                  // Add rotated if different
                  if (w !== h) {
                      candidates.push({ w: h, h: w, area: w * h, key });
                  }
              }
          }

          // Sort by area desc
          candidates.sort((a, b) => b.area - a.area);

          for (const candidate of candidates) {
              if (canFit(x, y, candidate.w, candidate.h, width, height, currentColorId, mosaicPixels, covered)) {
                  bestBrick = { w: candidate.w, h: candidate.h, inventoryKey: candidate.key };
                  found = true;
                  break;
              }
          }
      }

      if (!found && useInventoryOnly) {
          // Fallback to 1x1 if nothing fits (or inventory empty)
          bestBrick = { w: 1, h: 1, inventoryKey: '1x1' };
      }

      // Place the brick
      placedBricks.push({
          id: crypto.randomUUID(),
          x,
          y,
          width: bestBrick.w,
          height: bestBrick.h,
          colorId: currentColorId,
          colorHex: currentColorHex
      });

      // Mark covered
      for (let by = 0; by < bestBrick.h; by++) {
          for (let bx = 0; bx < bestBrick.w; bx++) {
              covered[(y + by) * width + (x + bx)] = true;
          }
      }
      
      // Decrement inventory and track usage
      if (useInventoryOnly && found) {
          // Decrement the actual inventory key (unrotated)
          const colorStock = inventoryMap.get(currentColorId);
          if (colorStock) {
              const currentQty = colorStock.get(bestBrick.inventoryKey) || 0;
              if (currentQty > 0) {
                  colorStock.set(bestBrick.inventoryKey, currentQty - 1);
                  
                  // Track usage
                  const usageKey = `${currentColorId}-${bestBrick.inventoryKey}`;
                  usedInventory.set(usageKey, (usedInventory.get(usageKey) || 0) + 1);
              }
          }
      }
    }
  }

  return {
    pixels: mosaicPixels,
    placedBricks,
    usedInventory,
    missingBricks
  };
};

// Helper to check if a brick fits at x,y with matching color
const canFit = (
    x: number, 
    y: number, 
    w: number, 
    h: number, 
    gridW: number, 
    gridH: number, 
    colorId: number, 
    pixels: MosaicPixel[], 
    covered: boolean[]
): boolean => {
    if (x + w > gridW || y + h > gridH) return false;

    for (let by = 0; by < h; by++) {
        for (let bx = 0; bx < w; bx++) {
            const idx = (y + by) * gridW + (x + bx);
            if (covered[idx]) return false;
            if (pixels[idx].colorId !== colorId) return false;
        }
    }
    return true;
};
