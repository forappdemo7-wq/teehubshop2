'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import toast from 'react-hot-toast';
import { CartItem } from '@/types';

interface CartContextType {
  items: CartItem[];
  addItem: (product: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Helper to show deduplicated toast
const showUniqueToast = (message: string, id: string) => {
  toast.dismiss(id);          // Remove any existing toast with same ID
  toast.success(message, { id }); // Show new one
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('cart');
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse cart', e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const addItem = useCallback((product: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    setItems(currentItems => {
      const existing = currentItems.find(item => item.id === product.id);
      const newQuantity = product.quantity || 1;
      
      if (existing) {
        setTimeout(() => {
          showUniqueToast(`Updated ${product.name} quantity`, `update-${product.id}`);
        }, 0);
        return currentItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + newQuantity }
            : item
        );
      }
      
      setTimeout(() => {
        showUniqueToast(`Added ${product.name} to cart`, `add-${product.id}`);
      }, 0);
      return [...currentItems, { ...product, quantity: newQuantity }];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    const item = items.find(i => i.id === id);
    if (item) {
      setTimeout(() => {
        showUniqueToast(`Removed ${item.name} from cart`, `remove-${id}`);
      }, 0);
    }
    setItems(currentItems => currentItems.filter(item => item.id !== id));
  }, [items]);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems(currentItems =>
      currentItems.map(item => (item.id === id ? { ...item, quantity } : item))
    );
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
    setTimeout(() => {
      showUniqueToast('Cart cleared', 'clear-cart');
    }, 0);
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!isLoaded) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}