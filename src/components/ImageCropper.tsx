import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { ZoomIn, ZoomOut, Check, X } from 'lucide-react';

// Define types locally if not exported correctly by the library version
interface Point {
  x: number;
  y: number;
}

export interface Area {
  width: number;
  height: number;
  x: number;
  y: number;
}

interface ImageCropperProps {
  image: string;
  aspectRatio: number;
  onCropComplete: (croppedAreaPixels: Area) => void;
  onCancel: () => void;
}

export const ImageCropper = ({ image, aspectRatio, onCropComplete, onCancel }: ImageCropperProps) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropChange = (crop: Point) => {
    setCrop(crop);
  };

  const onZoomChange = (zoom: number) => {
    setZoom(zoom);
  };

  const onCropCompleteHandler = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = () => {
    if (croppedAreaPixels) {
      onCropComplete(croppedAreaPixels);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col h-[80vh]">
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          <h3 className="text-lg font-bold text-gray-900">Dopasuj obszar mozaiki</h3>
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="relative flex-1 bg-gray-900">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={aspectRatio}
            onCropChange={onCropChange}
            onCropComplete={onCropCompleteHandler}
            onZoomChange={onZoomChange}
            showGrid={true}
          />
        </div>

        <div className="p-6 bg-white border-t space-y-4">
          <div className="flex items-center gap-4">
            <ZoomOut className="w-5 h-5 text-gray-500" />
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <ZoomIn className="w-5 h-5 text-gray-500" />
          </div>

          <div className="flex gap-3 justify-end">
            <button
              onClick={onCancel}
              className="px-6 py-2 text-gray-700 font-semibold hover:bg-gray-100 rounded-lg transition-colors"
            >
              Anuluj
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Check className="w-5 h-5" />
              Zatwierdź obszar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
