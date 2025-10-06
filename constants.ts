
import { Product, RoomMockup } from './types';

export const PRODUCTS: Product[] = [
  { id: 'prod_8x10_lustre', name: '8x10 Lustre Print', size: '8x10', price: 75 },
  { id: 'prod_11x14_lustre', name: '11x14 Lustre Print', size: '11x14', price: 150 },
  { id: 'prod_16x20_canvas', name: '16x20 Canvas Wrap', size: '16x20', price: 450 },
  { id: 'prod_20x30_canvas', name: '20x30 Canvas Wrap', size: '20x30', price: 750 },
  { id: 'prod_30x40_metal', name: '30x40 Metal Print', size: '30x40', price: 1200 },
  { id: 'prod_album', name: '10x10 Heirloom Album', size: '10x10 Album', price: 1500 },
];

export const TAX_RATE = 0.08; // 8% sales tax

export const ROOM_MOCKUPS: RoomMockup[] = [
  {
    id: 'room_living_1',
    name: 'Cozy Living Room',
    imageUrl: 'https://images.pexels.com/photos/1648771/pexels-photo-1648771.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1280&dpr=2',
    artworkPlacement: { top: '25%', left: '35%', width: '30%', height: '35%' },
  },
  {
    id: 'room_modern_2',
    name: 'Modern Grey Wall',
    imageUrl: 'https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1280&dpr=2',
    artworkPlacement: { top: '20%', left: '30%', width: '40%', height: '45%' },
  },
  {
    id: 'room_office_3',
    name: 'Home Office',
    imageUrl: 'https://images.pexels.com/photos/37347/office-sitting-room-executive-sitting.jpg?auto=compress&cs=tinysrgb&w=1920&h=1280&dpr=2',
    artworkPlacement: { top: '15%', left: '42%', width: '25%', height: '30%' },
  }
];
