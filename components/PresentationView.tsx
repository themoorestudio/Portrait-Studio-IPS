import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { GoogleGenAI } from '@google/genai';
import { UploadedImage, Product, CartItem, RoomMockup } from '../types';
import { PRODUCTS } from '../constants';
import SideBySideView from './SideBySideView';
import { HeartIcon, CartIcon, HomeIcon, WandIcon } from './Icon';

// --- SUB-COMPONENTS (defined in-file to avoid adding new files) ---

// AI Room Generator Modal
const AiRoomGeneratorModal: React.FC<{
  onClose: () => void;
  onRoomGenerated: (imageDataUrl: string) => void;
}> = ({ onClose, onRoomGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a description for the room.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const fullPrompt = `A high-resolution, photorealistic image of a ${prompt}. The room should have a large, empty, well-lit wall, perfect for hanging a photograph. There should be no existing pictures or frames on the wall. The style should be modern and clean.`;
      
      const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: fullPrompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
        },
      });

      const base64ImageBytes = response.generatedImages[0].image.imageBytes;
      const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
      onRoomGenerated(imageUrl);
      onClose();
    } catch (err) {
      console.error('AI generation failed:', err);
      setError('Failed to generate room. Please check your API key and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 shadow-xl w-full max-w-lg text-white">
        <h3 className="text-2xl font-bold mb-4">Generate Room with AI</h3>
        <p className="text-gray-400 mb-4">Describe the room you want to create.</p>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., a bright, modern living room with a large sofa and a plant"
          className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          disabled={isLoading}
        />
        {error && <p className="text-red-500 mt-2">{error}</p>}
        <div className="flex justify-end gap-4 mt-6">
          <button onClick={onClose} disabled={isLoading} className="py-2 px-4 bg-gray-600 hover:bg-gray-500 rounded transition-colors">Cancel</button>
          <button onClick={handleGenerate} disabled={isLoading} className="py-2 px-6 bg-blue-600 hover:bg-blue-700 rounded transition-colors flex items-center gap-2">
            {isLoading ? 'Generating...' : 'Generate'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Room View Component
const RoomView: React.FC<{ image: UploadedImage; room: RoomMockup; size: string }> = ({ image, room, size }) => {
  const aspectRatio = useMemo(() => {
    const parts = size.split('x');
    if (parts.length >= 2) {
      const width = parseFloat(parts[0]);
      const height = parseFloat(parts[1]);
      if (!isNaN(width) && !isNaN(height) && width > 0 && height > 0) {
        return width / height; // CSS aspect-ratio is width / height
      }
    }
    return 1; // Default to square if size is invalid
  }, [size]);

  return (
    <div className="w-full h-full bg-black flex items-center justify-center relative">
      <img src={room.imageUrl} alt={room.name} className="max-w-full max-h-full object-contain" />
      <div
        className="absolute flex items-center justify-center"
        style={{
          top: room.artworkPlacement.top,
          left: room.artworkPlacement.left,
          width: room.artworkPlacement.width,
          height: room.artworkPlacement.height,
        }}
      >
        <div
          className="relative bg-white p-2"
          style={{
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            aspectRatio: `${aspectRatio}`,
            maxWidth: '100%',
            maxHeight: '100%',
          }}
        >
          <img src={image.dataUrl} alt={image.name} className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  );
};

// Product Modal Component
const ProductModal: React.FC<{
  image: UploadedImage;
  onAddToCart: (product: Product) => void;
  onClose: () => void;
}> = ({ image, onAddToCart, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
        <div className="bg-gray-800 rounded-lg p-6 shadow-xl w-full max-w-md">
            <h3 className="text-2xl font-bold mb-4 text-white">Add to Order</h3>
            <p className="text-gray-400 mb-6">Select a product for {image.name}:</p>
            <div className="space-y-2">
                {PRODUCTS.map(product => (
                    <button
                        key={product.id}
                        onClick={() => onAddToCart(product)}
                        className="w-full text-left p-4 bg-gray-700 hover:bg-blue-600 rounded-lg transition-all duration-200 flex justify-between items-center"
                    >
                        <span>
                            <span className="font-semibold">{product.name}</span>
                            <span className="text-gray-400 ml-2">({product.size})</span>
                        </span>
                        <span className="font-mono text-lg">${product.price.toFixed(2)}</span>
                    </button>
                ))}
            </div>
            <button
                onClick={onClose}
                className="mt-6 w-full bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded"
            >
                Cancel
            </button>
        </div>
    </div>
);

// Room Selector Panel Component
const RoomSelectorPanel: React.FC<{
  roomMockups: RoomMockup[];
  currentRoomId: string;
  onRoomSelect: (id: string) => void;
  onGenerateClick: () => void;
  selectedSize: string;
  onSizeChange: (size: string) => void;
}> = ({ roomMockups, currentRoomId, onRoomSelect, onGenerateClick, selectedSize, onSizeChange }) => (
    <div className="w-full bg-black/30 backdrop-blur-md p-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 overflow-x-auto flex-grow">
            {roomMockups.map(room => (
              <img
                key={room.id}
                src={room.imageUrl}
                alt={room.name}
                onClick={() => onRoomSelect(room.id)}
                className={`h-16 w-auto rounded cursor-pointer border-2 transition-all ${currentRoomId === room.id ? 'border-blue-500' : 'border-transparent opacity-60 hover:opacity-100'}`}
              />
            ))}
          </div>
          <button onClick={onGenerateClick} className="flex-shrink-0 flex items-center gap-2 py-2 px-4 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-colors">
            <WandIcon />
            <span>Generate Room</span>
          </button>
          <div className="flex-shrink-0">
             <select value={selectedSize} onChange={(e) => onSizeChange(e.target.value)} className="bg-gray-700 text-white p-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
               {PRODUCTS.filter(p => p.size.includes('x')).map(p => (
                 <option key={p.id} value={p.size}>{p.size}</option>
               ))}
             </select>
          </div>
        </div>
    </div>
);


// --- MAIN PRESENTATION VIEW ---

interface PresentationViewProps {
  images: UploadedImage[];
  setImages: React.Dispatch<React.SetStateAction<UploadedImage[]>>;
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  onExit: () => void;
  onViewCart: () => void;
  cartItemCount: number;
  roomMockups: RoomMockup[];
  addRoomMockup: (newRoom: Omit<RoomMockup, 'id' | 'name'>) => void;
}

const PresentationView: React.FC<PresentationViewProps> = ({ images, setImages, addToCart, onExit, onViewCart, cartItemCount, roomMockups, addRoomMockup }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSideBySide, setIsSideBySide] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showFilmstrip, setShowFilmstrip] = useState(true);
  const [isRoomView, setIsRoomView] = useState(false);
  const [currentRoomId, setCurrentRoomId] = useState<string>(roomMockups[0]?.id || '');
  const [showAiGenerator, setShowAiGenerator] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>(PRODUCTS[0]?.size || '8x10');

  const currentImage = images[currentIndex];
  const currentRoom = roomMockups.find(r => r.id === currentRoomId) || roomMockups[0];
  
  // Performance: Preload next and previous images
  useEffect(() => {
    if (images.length > 1) {
      const nextIndex = (currentIndex + 1) % images.length;
      const prevIndex = (currentIndex - 1 + images.length) % images.length;
      
      const nextImage = new Image();
      nextImage.src = images[nextIndex].dataUrl;
      
      const prevImage = new Image();
      prevImage.src = images[prevIndex].dataUrl;
    }
  }, [currentIndex, images]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const toggleFavorite = useCallback(() => {
    setImages(prevImages => 
        prevImages.map((img, index) => 
            index === currentIndex ? { ...img, isFavorite: !img.isFavorite } : img
        )
    );
  }, [currentIndex, setImages]);

  const handleAddToCart = (product: Product) => {
    addToCart({ image: currentImage, product });
    setShowProductModal(false);
  };

  const handleAiRoomGenerated = (imageDataUrl: string) => {
    const newRoomData = {
      imageUrl: imageDataUrl,
      artworkPlacement: { top: '25%', left: '30%', width: '40%', height: '40%' },
    };
    addRoomMockup(newRoomData);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showProductModal || showAiGenerator) return;
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'f') toggleFavorite();
      if (e.key === 'c') setIsSideBySide(prev => !prev);
      if (e.key === 'r') setIsRoomView(prev => !prev);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, toggleFavorite, showProductModal, showAiGenerator]);
  
  if (!currentImage) {
    return <div className="h-screen w-screen bg-black text-white flex items-center justify-center">Loading images...</div>
  }

  return (
    <div className="h-screen w-screen bg-black text-white flex flex-col overflow-hidden">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-20 p-4 flex justify-between items-center bg-gradient-to-b from-black/70 to-transparent">
        <button onClick={onExit} className="py-2 px-4 bg-gray-800/50 hover:bg-gray-700/70 rounded-lg backdrop-blur-sm transition-colors">End Session</button>
        <div className="text-lg font-semibold tabular-nums">
          {currentIndex + 1} / {images.length}
        </div>
        <button onClick={onViewCart} className="relative py-2 px-4 bg-blue-600/80 hover:bg-blue-500/80 rounded-lg backdrop-blur-sm transition-colors flex items-center gap-2">
          <CartIcon />
          <span>View Order</span>
          {cartItemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-sm font-bold">{cartItemCount}</span>
          )}
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center relative">
        {isRoomView && currentRoom ? (
          <RoomView image={currentImage} room={currentRoom} size={selectedSize} />
        ) : isSideBySide ? (
          <SideBySideView leftImage={currentImage} rightImage={images[(currentIndex + 1) % images.length]} />
        ) : (
          <div className="w-full h-full flex items-center justify-center p-4">
            <img src={currentImage.dataUrl} alt={currentImage.name} className="max-w-full max-h-full object-contain" />
          </div>
        )}
      </main>

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 z-20 flex flex-col items-center bg-gradient-to-t from-black/80 to-transparent pt-4">
        {isRoomView && 
            <RoomSelectorPanel 
                roomMockups={roomMockups}
                currentRoomId={currentRoomId}
                onRoomSelect={setCurrentRoomId}
                onGenerateClick={() => setShowAiGenerator(true)}
                selectedSize={selectedSize}
                onSizeChange={setSelectedSize}
            />
        }
         {showFilmstrip && !isRoomView && (
            <div className="w-full flex justify-center items-center gap-2 p-4 overflow-x-auto">
                {images.map((img, index) => (
                    <img
                        key={img.id}
                        src={img.dataUrl}
                        onClick={() => setCurrentIndex(index)}
                        className={`h-20 w-auto rounded-md object-cover cursor-pointer transition-all duration-300 border-2 ${index === currentIndex ? 'border-blue-500 scale-110' : 'border-transparent opacity-50 hover:opacity-100'}`}
                        alt={img.name}
                    />
                ))}
            </div>
        )}

        <div className="flex items-center space-x-4 bg-gray-800/50 p-3 rounded-full backdrop-blur-sm mb-4">
            <button onClick={handlePrev} className="p-2 rounded-full hover:bg-gray-700/70 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>

            <button onClick={toggleFavorite} className="p-2 rounded-full hover:bg-gray-700/70 transition-colors">
                <HeartIcon className="w-7 h-7" isFilled={currentImage.isFavorite} />
            </button>
            <button onClick={() => setIsSideBySide(!isSideBySide)} className={`p-2 rounded-full transition-colors ${isSideBySide ? 'bg-blue-600' : 'hover:bg-gray-700/70'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v12a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
                </svg>
            </button>
            <button onClick={() => setIsRoomView(!isRoomView)} className={`p-2 rounded-full transition-colors ${isRoomView ? 'bg-blue-600' : 'hover:bg-gray-700/70'}`}>
                <HomeIcon className="w-7 h-7" />
            </button>
            <button onClick={() => setShowProductModal(true)} className="p-2 rounded-full hover:bg-gray-700/70 transition-colors">
                 <CartIcon className="w-7 h-7" />
            </button>

            <button onClick={handleNext} className="p-2 rounded-full hover:bg-gray-700/70 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
        </div>
      </div>
      
      {showProductModal && <ProductModal image={currentImage} onAddToCart={handleAddToCart} onClose={() => setShowProductModal(false)} />}
      {showAiGenerator && <AiRoomGeneratorModal onClose={() => setShowAiGenerator(false)} onRoomGenerated={handleAiRoomGenerated} />}
    </div>
  );
};

export default PresentationView;