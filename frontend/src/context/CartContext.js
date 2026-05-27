import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('corevita_cart');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('corevita_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.packId === item.packId && i.productId === item.productId);
      if (existing) {
        return prev.map(i => i.packId === item.packId && i.productId === item.productId
          ? { ...i, quantity: i.quantity + item.quantity }
          : i
        );
      }
      return [...prev, item];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (packId) => {
    setCartItems(prev => prev.filter(i => i.packId !== packId));
  };

  const updateQuantity = (packId, quantity) => {
    if (quantity < 1) return removeFromCart(packId);
    setCartItems(prev => prev.map(i => i.packId === packId ? { ...i, quantity } : i));
  };

  const clearCart = () => setCartItems([]);

  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const cartSavings = cartItems.reduce((sum, i) => sum + ((i.originalPrice || i.price) - i.price) * i.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems, addToCart, removeFromCart, updateQuantity, clearCart,
      cartCount, cartTotal, cartSavings, isCartOpen, setIsCartOpen
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
