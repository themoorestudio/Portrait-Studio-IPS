
import React from 'react';
import { CartItem } from '../types';
import { TAX_RATE } from '../constants';
import { XCircleIcon } from './Icon';

interface ShoppingCartProps {
  cart: CartItem[];
  removeFromCart: (itemId: string) => void;
  onClose: () => void;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ cart, removeFromCart, onClose }) => {
  const subtotal = cart.reduce((acc, item) => acc + item.product.price, 0);
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-gray-800 text-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-3xl font-bold text-gray-100">Your Order</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <XCircleIcon className="w-8 h-8"/>
          </button>
        </div>
        
        <div className="flex-grow overflow-y-auto p-6">
          {cart.length === 0 ? (
            <p className="text-gray-400 text-center py-10">Your cart is empty.</p>
          ) : (
            <ul className="divide-y divide-gray-700">
              {cart.map(item => (
                <li key={item.id} className="py-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img src={item.image.dataUrl} alt={item.image.name} className="w-20 h-20 object-cover rounded-md bg-gray-700" />
                    <div>
                      <p className="font-semibold text-lg">{item.product.name}</p>
                      <p className="text-sm text-gray-400">Image: {item.image.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <p className="text-lg font-mono">${item.product.price.toFixed(2)}</p>
                    <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-400 transition-colors">
                      <XCircleIcon className="w-6 h-6"/>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="p-6 border-t border-gray-700 bg-gray-900/50 rounded-b-lg">
          <div className="space-y-3">
            <div className="flex justify-between text-lg text-gray-300">
              <span>Subtotal</span>
              <span className="font-mono">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg text-gray-300">
              <span>Tax ({(TAX_RATE * 100).toFixed(0)}%)</span>
              <span className="font-mono">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-2xl font-bold text-white">
              <span>Total</span>
              <span className="font-mono">${total.toFixed(2)}</span>
            </div>
          </div>
           <button 
                onClick={onClose}
                className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 text-lg"
              >
                Return to Presentation
              </button>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
