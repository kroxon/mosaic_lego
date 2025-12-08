import { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Upload,
  Image as ImageIcon,
  Sparkles,
  Grid3x3,
  Download,
  Loader2,
  AlertTriangle,
  ShoppingCart,
  Package,
} from 'lucide-react';
import { useInventory } from '../context/InventoryContext';
import { processImage, getCroppedImg } from '../utils/imageUtils';
import { generateMosaic, MosaicResult } from '../services/mosaicGenerator';
import { getLegoColor } from '../data/legoColors';
import { ImageCropper, Area } from '../components/ImageCropper';

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
    inventory,
  } = useInventory();

  const [isDragging, setIsDragging] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCropping, setIsCropping] = useState(false);
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [mosaicResult, setMosaicResult] = useState<MosaicResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileUpload = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setTempImage(e.target?.result as string);
        setIsCropping(true);
        setMosaicResult(null); // Reset result on new image
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = async (croppedAreaPixels: Area) => {
    if (tempImage) {
      try {
        const croppedImage = await getCroppedImg(tempImage, croppedAreaPixels);
        setUploadedImage(croppedImage);
        setIsCropping(false);
        setTempImage(null);
      } catch (e) {
        console.error(e);
      }
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

  const handleGenerate = async () => {
    if (!uploadedImage) return;

    setIsGenerating(true);
    
    // Allow UI to update before heavy processing
    setTimeout(async () => {
      try {
        const pixels = await processImage(uploadedImage, mosaicWidth, mosaicHeight);
        const result = generateMosaic(
          pixels, 
          mosaicWidth, 
          mosaicHeight, 
          inventory, 
          generationMode === 'precise' // Precise = use inventory strictly
        );
        setMosaicResult(result);
      } catch (error) {
        console.error("Generation failed:", error);
        alert("Wystąpił błąd podczas generowania mozaiki.");
      } finally {
        setIsGenerating(false);
      }
    }, 100);
  };

  // Auto-regenerate when mode changes if we already have a result
  useEffect(() => {
    if (mosaicResult && uploadedImage) {
      handleGenerate();
    }
  }, [generationMode]);

  // Render mosaic to canvas when result changes
  useEffect(() => {
    if (mosaicResult && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Scale for better visibility
      const scale = Math.max(Math.floor(600 / mosaicWidth), 4); 
      canvas.width = mosaicWidth * scale;
      canvas.height = mosaicHeight * scale;

      // Clear
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw bricks
      mosaicResult.placedBricks.forEach(brick => {
        ctx.fillStyle = brick.colorHex;
        ctx.fillRect(
          brick.x * scale, 
          brick.y * scale, 
          brick.width * scale, 
          brick.height * scale
        );
        
        // Draw border for individual bricks
        ctx.strokeStyle = 'rgba(0,0,0,0.1)';
        ctx.lineWidth = 1;
        ctx.strokeRect(
          brick.x * scale, 
          brick.y * scale, 
          brick.width * scale, 
          brick.height * scale
        );

        // Draw studs (circles)
        ctx.fillStyle = 'rgba(0,0,0,0.1)';
        const studSize = scale * 0.6;
        
        for(let bx = 0; bx < brick.width; bx++) {
            for(let by = 0; by < brick.height; by++) {
                ctx.beginPath();
                ctx.arc(
                    (brick.x + bx) * scale + scale/2,
                    (brick.y + by) * scale + scale/2,
                    studSize / 2,
                    0,
                    Math.PI * 2
                );
                ctx.fill();
            }
        }
      });
    }
  }, [mosaicResult, mosaicWidth, mosaicHeight]);

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
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Szerokość (klocki)
                    </label>
                    <input
                      type="number"
                      min="4"
                      max="256"
                      value={mosaicWidth}
                      onChange={(e) => setMosaicWidth(Math.max(4, Math.min(256, parseInt(e.target.value) || 4)))}
                      className="w-20 px-2 py-1 text-sm border border-gray-300 rounded-md text-right"
                    />
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="128"
                    value={mosaicWidth}
                    onChange={(e) => setMosaicWidth(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Wysokość (klocki)
                    </label>
                    <input
                      type="number"
                      min="4"
                      max="256"
                      value={mosaicHeight}
                      onChange={(e) => setMosaicHeight(Math.max(4, Math.min(256, parseInt(e.target.value) || 4)))}
                      className="w-20 px-2 py-1 text-sm border border-gray-300 rounded-md text-right"
                    />
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="128"
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
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    generationMode === 'precise'
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Package className={`w-5 h-5 ${generationMode === 'precise' ? 'text-blue-600' : 'text-gray-500'}`} />
                    <p className={`font-bold text-sm ${generationMode === 'precise' ? 'text-blue-900' : 'text-gray-700'}`}>
                      Dostępne Klocki
                    </p>
                  </div>
                  <p className="text-xs text-gray-500">
                    Generuje mozaikę używając tylko tego, co masz w kolekcji.
                  </p>
                </button>

                <button
                  onClick={() => setGenerationMode('artistic')}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    generationMode === 'artistic'
                      ? 'border-purple-500 bg-purple-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className={`w-5 h-5 ${generationMode === 'artistic' ? 'text-purple-600' : 'text-gray-500'}`} />
                    <p className={`font-bold text-sm ${generationMode === 'artistic' ? 'text-purple-900' : 'text-gray-700'}`}>
                      Widok Idealny
                    </p>
                  </div>
                  <p className="text-xs text-gray-500">
                    Pokazuje najlepszy możliwy efekt bez limitu klocków.
                  </p>
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

              <div className="flex justify-center bg-gray-50 rounded-xl p-4 overflow-auto max-h-[600px]">
                {mosaicResult ? (
                  <canvas ref={canvasRef} className="shadow-lg rounded-sm" />
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                    <Grid3x3 className="w-16 h-16 mb-4 opacity-20" />
                    <p>Wgraj zdjęcie i kliknij "Generuj", aby zobaczyć wynik</p>
                  </div>
                )}
              </div>

              {mosaicResult && (
                <div className="mt-6 space-y-4">
                  <div className="flex justify-between text-sm text-gray-600 border-t pt-4">
                    <span>Wymiary: {mosaicWidth} × {mosaicHeight}</span>
                    <span>Użyte klocki: {mosaicResult.placedBricks.length}</span>
                  </div>
                  
                  {mosaicResult.missingBricks.size > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-800 flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 flex-shrink-0 text-red-600" />
                      <div className="flex-1">
                        <p className="font-bold text-red-900">Brakuje klocków w Twojej kolekcji!</p>
                        <p className="mb-2">Algorytm użył zastępczych kolorów lub pustych miejsc.</p>
                        <ul className="mt-1 list-disc list-inside text-red-700">
                          {Array.from(mosaicResult.missingBricks.entries()).slice(0, 5).map(([colorId, count]) => {
                             const color = getLegoColor(colorId);
                             return (
                               <li key={colorId}>
                                 {color?.name || `Color ${colorId}`}: {count} szt.
                               </li>
                             );
                          })}
                          {mosaicResult.missingBricks.size > 5 && <li>...i inne</li>}
                        </ul>
                        <button 
                          onClick={() => setGenerationMode('artistic')}
                          className="mt-3 text-sm font-semibold text-red-700 underline hover:text-red-900"
                        >
                          Przełącz na Widok Idealny, aby zobaczyć cel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Bill of Materials (BOM) */}
                  <div className="mt-8 border-t pt-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <ShoppingCart className="w-5 h-5" />
                      Lista Elementów (BOM)
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                      {Array.from(mosaicResult.placedBricks.reduce((acc, brick) => {
                        const key = `${brick.colorId}-${brick.width}x${brick.height}`;
                        acc.set(key, (acc.get(key) || 0) + 1);
                        return acc;
                      }, new Map<string, number>()).entries()).map(([key, count]) => {
                        const [colorId, dims] = key.split('-');
                        const color = getLegoColor(parseInt(colorId));
                        if (!color) return null;
                        
                        return (
                          <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex items-center gap-3">
                              <div 
                                className="w-8 h-8 rounded shadow-sm" 
                                style={{ backgroundColor: color.hex }}
                              />
                              <div>
                                <p className="font-semibold text-sm text-gray-900">{color.name}</p>
                                <p className="text-xs text-gray-500">{dims.replace('x', ' × ')}</p>
                              </div>
                            </div>
                            <span className="font-bold text-gray-700">{count} szt.</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {isCropping && tempImage && (
          <ImageCropper
            image={tempImage}
            aspectRatio={mosaicWidth / mosaicHeight}
            onCropComplete={handleCropComplete}
            onCancel={() => setIsCropping(false)}
          />
        )}
      </div>
    </div>
  );
};
