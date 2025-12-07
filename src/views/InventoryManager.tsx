import { useState } from 'react';
import { ArrowRight, Package } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';
import { ShapePicker } from '../components/ShapePicker';
import { ColorPicker } from '../components/ColorPicker';
import { QuantityInput } from '../components/QuantityInput';
import { BrickList } from '../components/BrickList';

export const InventoryManager = () => {
  const { bricks, addBrick, updateBrick, deleteBrick, setCurrentView } = useInventory();

  const [selectedShape, setSelectedShape] = useState('1x1');
  const [selectedColor, setSelectedColor] = useState('#0055BF');
  const [selectedColorName, setSelectedColorName] = useState('Blue');
  const [quantity, setQuantity] = useState(100);

  const handleColorSelect = (color: string, name: string) => {
    setSelectedColor(color);
    setSelectedColorName(name);
  };

  const handleAddBrick = () => {
    addBrick({
      shape: selectedShape,
      color: selectedColor,
      colorName: selectedColorName,
      count: quantity,
    });
    setQuantity(100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Package className="w-12 h-12 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Mosaic Master</h1>
          </div>
          <p className="text-lg text-gray-600">
            Zarządzaj swoją kolekcją klocków LEGO
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Dodaj klocki do kolekcji
              </h2>

              <div className="space-y-6">
                <ShapePicker selectedShape={selectedShape} onShapeSelect={setSelectedShape} />

                <ColorPicker
                  selectedColor={selectedColor}
                  selectedColorName={selectedColorName}
                  onColorSelect={handleColorSelect}
                />

                <QuantityInput value={quantity} onChange={setQuantity} />

                <button
                  onClick={handleAddBrick}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-lg rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Dodaj do kolekcji
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Twoja kolekcja</h2>
                <span className="px-4 py-2 bg-blue-100 text-blue-700 font-semibold rounded-full">
                  {bricks.length} {bricks.length === 1 ? 'typ' : 'typy'}
                </span>
              </div>

              <div className="max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                <BrickList bricks={bricks} onUpdate={updateBrick} onDelete={deleteBrick} />
              </div>
            </div>

            <button
              onClick={() => setCurrentView('studio')}
              disabled={bricks.length === 0}
              className={`w-full py-4 font-bold text-lg rounded-xl transition-all duration-200 shadow-lg flex items-center justify-center gap-2 ${
                bricks.length > 0
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 hover:shadow-xl transform hover:-translate-y-0.5'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Przejdź do Studio
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
