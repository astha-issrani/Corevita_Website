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

  // Coupon state
  const [coupon, setCoupon] = useState(null); // { code, discountType, discountValue, discountAmount, message }

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

  // increment/decrement by the pack's bottle count (step), not by 1
  const updateQuantity = (packId, delta) => {
    setCartItems(prev => {
      const item = prev.find(i => i.packId === packId);
      if (!item) return prev;
      const step = item.packSize || 1;
      const newQty = item.quantity + (delta * step);
      if (newQty < step) return prev.filter(i => i.packId !== packId);
      return prev.map(i => i.packId === packId ? { ...i, quantity: newQty } : i);
    });
  };

  const clearCart = () => {
    setCartItems([]);
    setCoupon(null);
  };

  const applyCoupon = (couponData) => setCoupon(couponData);
  const removeCoupon = () => setCoupon(null);

  // cartCount = number of packs (not individual bottles)
  const cartCount = cartItems.reduce((sum, i) => sum + Math.round(i.quantity / (i.packSize || 1)), 0);
  const cartTotal = cartItems.reduce((sum, i) => sum + i.price * Math.round(i.quantity / (i.packSize || 1)), 0);
  const cartSavings = cartItems.reduce((sum, i) => sum + ((i.originalPrice || i.price) - i.price) * Math.round(i.quantity / (i.packSize || 1)), 0);

  // Final total after coupon
  const couponDiscount = coupon ? coupon.discountAmount : 0;
  const cartFinalTotal = Math.max(0, cartTotal - couponDiscount);

  return (
    <CartContext.Provider value={{
      cartItems, addToCart, removeFromCart, updateQuantity, clearCart,
      cartCount, cartTotal, cartSavings, cartFinalTotal,
      coupon, applyCoupon, removeCoupon,
      isCartOpen, setIsCartOpen
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);