import { Trash2, Edit3, Check } from 'lucide-react';
import { InventoryItem } from '../types';
import { getLegoColor } from '../data/legoColors';
import { useState } from 'react';

interface BrickListProps {
  inventory: InventoryItem[];
  onUpdate: (id: string, quantity: number) => void;
  onDelete: (id: string) => void;
}

export const BrickList = ({ inventory, onUpdate, onDelete }: BrickListProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<number>(0);

  const startEdit = (item: InventoryItem) => {
    setEditingId(item.id);
    setEditValue(item.quantity);
  };

  const saveEdit = (id: string) => {
    onUpdate(id, editValue);
    setEditingId(null);
  };

  if (inventory.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-lg">Brak klocków w kolekcji</p>
        <p className="text-sm mt-2">Dodaj swój pierwszy klocek, aby rozpocząć</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {inventory.map((item) => {
        const color = getLegoColor(item.colorId);
        if (!color) return null;

        return (
          <div
            key={item.id}
            className="flex items-center justify-between p-4 bg-white rounded-xl border-2 border-gray-100 hover:border-gray-200 transition-all"
          >
            <div className="flex items-center gap-4 flex-1">
              <div
                className="w-12 h-12 rounded-lg shadow-sm flex-shrink-0"
                style={{ backgroundColor: color.hex }}
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 truncate">
                  {item.dimensions.width}×{item.dimensions.height}
                </h4>
                <p className="text-sm text-gray-500">{color.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {editingId === item.id ? (
                <>
                  <input
                    type="number"
                    value={editValue}
                    onChange={(e) => setEditValue(parseInt(e.target.value) || 1)}
                    className="w-20 px-3 py-1 border-2 border-blue-500 rounded-lg focus:outline-none"
                    min="1"
                  />
                  <button
                    onClick={() => saveEdit(item.id)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <>
                  <span className="text-lg font-bold text-gray-900 min-w-[60px] text-right">
                    {item.quantity} szt.
                  </span>
                  <button
                    onClick={() => startEdit(item)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => onDelete(item.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
