
import React, { useState, useEffect } from 'react';
import { AppState, UploadedImage, CartItem, RoomMockup } from './types';
import { ROOM_MOCKUPS } from './constants';
import ImageUploader from './components/ImageUploader';
import PresentationView from './components/PresentationView';
import ShoppingCart from './components/ShoppingCart';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.SETUP);
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  
  const [roomMockups, setRoomMockups] = useState<RoomMockup[]>(() => {
    try {
      const savedRooms = localStorage.getItem('ips-room-mockups');
      // Combine default rooms with saved rooms, preventing duplicates
      if (savedRooms) {
        const parsedRooms: RoomMockup[] = JSON.parse(savedRooms);
        const combined = [...ROOM_MOCKUPS];
        parsedRooms.forEach(pRoom => {
          if (!combined.some(dRoom => dRoom.id === pRoom.id)) {
            combined.push(pRoom);
          }
        });
        return combined;
      }
    } catch (error) {
        console.error("Failed to parse rooms from localStorage", error);
    }
    return ROOM_MOCKUPS;
  });

  useEffect(() => {
    try {
        localStorage.setItem('ips-room-mockups', JSON.stringify(roomMockups));
    } catch (error) {
        console.error("Failed to save rooms to localStorage", error);
    }
  }, [roomMockups]);

  const addRoomMockup = (newRoom: Omit<RoomMockup, 'id' | 'name'>) => {
    setRoomMockups(prev => {
      const nextId = prev.filter(r => r.id.startsWith('ai-')).length + 1;
      const fullNewRoom: RoomMockup = {
        ...newRoom,
        id: `ai-room-${Date.now()}`,
        name: `AI Room ${nextId}`,
      };
      return [...prev, fullNewRoom];
    });
  };

  const handleImagesUploaded = (uploadedImages: UploadedImage[]) => {
    setImages(uploadedImages);
    setAppState(AppState.PRESENTATION);
  };

  const addToCart = (item: Omit<CartItem, 'id'>) => {
    setCart(prev => [...prev, { ...item, id: `${item.image.id}-${item.product.id}-${Date.now()}` }]);
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  };
  
  const resetSession = () => {
    setImages([]);
    setCart([]);
    setAppState(AppState.SETUP);
  };

  const renderContent = () => {
    switch (appState) {
      case AppState.SETUP:
        return <ImageUploader onImagesUploaded={handleImagesUploaded} />;
      case AppState.PRESENTATION:
        return (
          <PresentationView
            images={images}
            setImages={setImages}
            addToCart={addToCart}
            onExit={resetSession}
            onViewCart={() => setAppState(AppState.CART)}
            cartItemCount={cart.length}
            roomMockups={roomMockups}
            addRoomMockup={addRoomMockup}
          />
        );
      case AppState.CART:
        return (
          <>
            <PresentationView
              images={images}
              setImages={setImages}
              addToCart={addToCart}
              onExit={resetSession}
              onViewCart={() => setAppState(AppState.CART)}
              cartItemCount={cart.length}
              roomMockups={roomMockups}
              addRoomMockup={addRoomMockup}
            />
            <ShoppingCart 
              cart={cart} 
              removeFromCart={removeFromCart}
              onClose={() => setAppState(AppState.PRESENTATION)}
            />
          </>
        );
      default:
        return <ImageUploader onImagesUploaded={handleImagesUploaded} />;
    }
  };

  return <div className="h-screen bg-gray-900">{renderContent()}</div>;
};

export default App;
