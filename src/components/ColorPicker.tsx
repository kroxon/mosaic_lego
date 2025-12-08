import { LEGO_COLORS, COLOR_CATEGORIES } from '../data/legoColors';

interface ColorPickerProps {
  selectedColorId: number;
  onColorSelect: (colorId: number) => void;
}

export const ColorPicker = ({ selectedColorId, onColorSelect }: ColorPickerProps) => {
  const selectedColor = LEGO_COLORS.find(c => c.id === selectedColorId);

  return (
    <div className="space-y-4">
      <label className="block text-sm font-semibold text-gray-700">Kolor</label>

      {COLOR_CATEGORIES.map((category) => (
        <div key={category} className="space-y-2">
          <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            {category}
          </h4>
          <div className="flex flex-wrap gap-2">
            {LEGO_COLORS.filter((c) => c.category === category).map((color) => (
              <button
                key={color.id}
                type="button"
                onClick={() => onColorSelect(color.id)}
                className={`group relative w-10 h-10 rounded-lg transition-all duration-200 hover:scale-110 hover:shadow-lg ${
                  selectedColorId === color.id
                    ? 'ring-3 ring-blue-500 ring-offset-2 scale-105'
                    : 'ring-1 ring-gray-300'
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              >
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                  {color.name}
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}

      {selectedColor && (
        <div className="mt-2 text-sm text-gray-600">
          Wybrany kolor: <span className="font-semibold">{selectedColor.name}</span>
        </div>
      )}
    </div>
  );
};
