import { Square, SquareStack, RectangleHorizontal, Circle } from 'lucide-react';

interface ShapePickerProps {
  selectedShape: string;
  onShapeSelect: (shape: string) => void;
}

const SHAPES = [
  { name: '1×1', icon: Square, value: '1x1' },
  { name: '2×2', icon: SquareStack, value: '2x2' },
  { name: '2×4', icon: RectangleHorizontal, value: '2x4' },
  { name: 'Płytka 1×1', icon: Circle, value: 'plate-1x1' },
];

export const ShapePicker = ({ selectedShape, onShapeSelect }: ShapePickerProps) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">Kształt</label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {SHAPES.map((shape) => {
          const Icon = shape.icon;
          return (
            <button
              key={shape.value}
              type="button"
              onClick={() => onShapeSelect(shape.value)}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                selectedShape === shape.value
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
