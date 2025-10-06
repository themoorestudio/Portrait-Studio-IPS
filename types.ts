
export interface UploadedImage {
  id: string;
  name: string;
  dataUrl: string;
  isFavorite: boolean;
}

export interface Product {
  id: string;
  name: string;
  size: string;
  price: number;
}

export interface CartItem {
  id: string;
  image: UploadedImage;
  product: Product;
}

export enum AppState {
  SETUP,
  PRESENTATION,
  CART,
}

export interface RoomMockup {
  id: string;
  name: string;
  imageUrl: string;
  // Position and size of the artwork frame as a percentage of the room image dimensions
  artworkPlacement: {
    top: string;
    left: string;
    width: string;
    height: string;
  };
}
