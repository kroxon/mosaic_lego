import { useState, useRef } from 'react';
import {
  ArrowLeft,
  Upload,
  Image as ImageIcon,
  Sparkles,
  Grid3x3,
  Download,
  Loader2,
} from 'lucide-react';
import { useInventory } from '../context/InventoryContext';

export const MosaicStudio = () => {
  const {
    setCurrentView,
    mosaicWidth,
    mosaicHeight,
    setMosaicWidth,
    setMosaicHeight,
    generationMode,
    setGenerationMode,
    uploadedImage,
    setUploadedImage,
  } = useInventory();

  const [isDragging, setIsDragging] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileUpload(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 2000);
  };

  const gridCells = Array.from({ length: mosaicWidth * mosaicHeight });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-8">
          <button
            onClick={() => setCurrentView('inventory')}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Wróć do edycji kolekcji
          </button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Studio Mozaiki</h1>
          <p className="text-lg text-gray-600">
            Stwórz niesamowitą mozaikę z Twoich klocków
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Upload Zdjęcia
              </h2>

              <div
                onDrop={handleDrop}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-3 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                />

                {uploadedImage ? (
                  <div className="space-y-3">
                    <img
                      src={uploadedImage}
                      alt="Uploaded"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <p className="text-sm text-gray-600">Kliknij, aby zmienić zdjęcie</p>
                  </div>
                ) : (
                  <>
                    <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg font-medium text-gray-700 mb-2">
                      Wgraj zdjęcie lub przeciągnij tutaj
                    </p>
                    <p className="text-sm text-gray-500">PNG, JPG do 10MB</p>
                  </>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Grid3x3 className="w-5 h-5" />
                Wymiary
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Szerokość: {mosaicWidth} klocków
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="30"
                    value={mosaicWidth}
                    onChange={(e) => setMosaicWidth(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Wysokość: {mosaicHeight} klocków
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="30"
                    value={mosaicHeight}
                    onChange={(e) => setMosaicHeight(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Tryb Generowania
              </h2>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setGenerationMode('precise')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    generationMode === 'precise'
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Grid3x3 className="w-8 h-8 mx-auto mb-2" />
                  <p className="font-semibold text-sm">Precyzyjny</p>
                </button>

                <button
                  onClick={() => setGenerationMode('artistic')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    generationMode === 'artistic'
                      ? 'border-purple-500 bg-purple-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Sparkles className="w-8 h-8 mx-auto mb-2" />
                  <p className="font-semibold text-sm">Artystyczny</p>
                </button>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={!uploadedImage || isGenerating}
              className={`w-full py-4 font-bold text-lg rounded-xl transition-all duration-200 shadow-lg flex items-center justify-center gap-2 ${
                uploadedImage && !isGenerating
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:shadow-xl transform hover:-translate-y-0.5'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generowanie...
                </>
              ) : (
                'Generuj Mozaikę'
              )}
            </button>

            <button
              className="w-full py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Eksportuj / Drukuj
            </button>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
                Podgląd Mozaiki
              </h2>

              <div
                className="grid gap-0.5 bg-gray-200 p-0.5 rounded-lg mx-auto"
                style={{
                  gridTemplateColumns: `repeat(${mosaicWidth}, minmax(0, 1fr))`,
                  maxWidth: '100%',
                  aspectRatio: `${mosaicWidth} / ${mosaicHeight}`,
                }}
              >
                {gridCells.map((_, index) => (
                  <div
                    key={index}
                    className="bg-white aspect-square rounded-sm hover:bg-gray-50 transition-colors"
                  />
                ))}
              </div>

              <p className="text-center text-sm text-gray-500 mt-6">
                {mosaicWidth} × {mosaicHeight} = {mosaicWidth * mosaicHeight} klocków
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
