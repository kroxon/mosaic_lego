import { Square, SquareStack, RectangleHorizontal } from 'lucide-react';
import { BrickDimensions } from '../types';

interface ShapePickerProps {
  selectedDimensions: BrickDimensions;
  onShapeSelect: (dimensions: BrickDimensions) => void;
}

const SHAPES = [
  { name: '1×1', width: 1, height: 1, icon: Square },
  { name: '1×2', width: 1, height: 2, icon: RectangleHorizontal },
  { name: '1×3', width: 1, height: 3, icon: RectangleHorizontal },
  { name: '1×4', width: 1, height: 4, icon: RectangleHorizontal },
  { name: '2×2', width: 2, height: 2, icon: SquareStack },
  { name: '2×3', width: 2, height: 3, icon: RectangleHorizontal },
  { name: '2×4', width: 2, height: 4, icon: RectangleHorizontal },
];

export const ShapePicker = ({ selectedDimensions, onShapeSelect }: ShapePickerProps) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">Kształt</label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {SHAPES.map((shape) => {
          const Icon = shape.icon;
          const isSelected = selectedDimensions.width === shape.width && selectedDimensions.height === shape.height;
          
          return (
            <button
              key={`${shape.width}x${shape.height}`}
              type="button"
              onClick={() => onShapeSelect({ width: shape.width, height: shape.height })}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <Icon className="w-8 h-8 mb-2" strokeWidth={1.5} />
              <span className="text-sm font-medium text-gray-700">{shape.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
