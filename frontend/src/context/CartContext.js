import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

/** Drop malformed rows only — partial packs are allowed when removing individual bottles */
function sanitizeCartItems(items) {
  if (!Array.isArray(items) || items.length === 0) return [];
  return items.filter((item) => item?.groupId && item?.packId);
}

function loadCartFromStorage() {
  try {
    const saved = localStorage.getItem('corevita_cart');
    if (!saved) return [];
    return sanitizeCartItems(JSON.parse(saved));
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [cartItems, setCartItemsRaw] = useState(loadCartFromStorage);

  const setCartItems = (updater) => {
    setCartItemsRaw((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      return sanitizeCartItems(next);
    });
  };

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [coupon, setCoupon] = useState(null);

  useEffect(() => {
    localStorage.setItem('corevita_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Each pack explodes into individual bottle rows.
  // e.g. Buy 1+1 FREE → 2 rows: { bottleLabel: '#1 (Paid)', isFree: false }, { bottleLabel: 'FREE', isFree: true }
  const addToCart = (item) => {
    const packSize = item.packSize || item.quantity || 1;
    const half = packSize / 2;
    const pricePerBottle = parseFloat((item.price / (packSize / 2)).toFixed(2)); // paid bottles only
    const originalPerBottle = item.originalPrice
      ? parseFloat((item.originalPrice / packSize).toFixed(2))
      : pricePerBottle;

    const newRows = Array.from({ length: packSize }, (_, i) => {
      const isFree = i >= half;
      return {
        // unique id per bottle row
        packId: `${item.packId}_bottle_${i}`,
        groupId: item.packId,          // all bottles in same pack share groupId
        productId: item.productId,
        name: item.name,
        packLabel: item.packLabel,
        bottleIndex: i + 1,
        bottleLabel: isFree ? 'FREE Bottle' : `Bottle #${i + 1}`,
        isFree,
        price: isFree ? 0 : pricePerBottle,
        originalPrice: originalPerBottle,
        packSize,
        quantity: 1,
        autoRefill: item.autoRefill,
      };
    });

    setCartItems(prev => {
      // If same groupId already exists, remove old rows first (re-add)
      const withoutGroup = prev.filter(i => i.groupId !== item.packId);
      // Check if group already there — if so just increase by adding another set
      const existingGroup = prev.filter(i => i.groupId === item.packId);
      if (existingGroup.length > 0) {
        // Add another full pack set with offset ids
        const offset = existingGroup.length / packSize;
        const extraRows = Array.from({ length: packSize }, (_, i) => {
          const isFree = i >= half;
          return {
            packId: `${item.packId}_bottle_${offset * packSize + i}`,
            groupId: item.packId,
            productId: item.productId,
            name: item.name,
            packLabel: item.packLabel,
            bottleIndex: offset * packSize + i + 1,
            bottleLabel: isFree ? 'FREE Bottle' : `Bottle #${offset * packSize + i + 1}`,
            isFree,
            price: isFree ? 0 : pricePerBottle,
            originalPrice: originalPerBottle,
            packSize,
            quantity: 1,
            autoRefill: item.autoRefill,
          };
        });
        return [...prev, ...extraRows];
      }
      return [...withoutGroup, ...newRows];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (packId) => {
    setCartItems((prev) => {
      const target = prev.find((i) => i.packId === packId);
      if (!target?.groupId) return prev.filter((i) => i.packId !== packId);
      // Always remove the whole pack group — never leave orphan bottle rows
      return prev.filter((i) => i.groupId !== target.groupId);
    });
  };

  const removeBottle = (packId) => {
    setCartItems((prev) => prev.filter((i) => i.packId !== packId));
  };

  // Remove entire pack group
  const removeGroup = (groupId) => {
    setCartItems(prev => prev.filter(i => i.groupId !== groupId));
  };

  // For individual bottle rows, quantity is always 1; +/- adds/removes whole packs
  const updateQuantity = (groupId, delta) => {
    setCartItems(prev => {
      const group = prev.filter(i => i.groupId === groupId);
      if (!group.length) return prev;
      const packSize = group[0].packSize || 1;
      const half = packSize / 2;
      const pricePerBottle = group.find(b => !b.isFree)?.price || 0;
      const originalPerBottle = group[0].originalPrice || 0;
      const sample = group[0];

      if (delta > 0) {
        // Add one more pack set
        const offset = group.length / packSize;
        const extraRows = Array.from({ length: packSize }, (_, i) => {
          const isFree = i >= half;
          return {
            packId: `${groupId}_bottle_${offset * packSize + i}_${Date.now()}`,
            groupId,
            productId: sample.productId,
            name: sample.name,
            packLabel: sample.packLabel,
            bottleIndex: offset * packSize + i + 1,
            bottleLabel: isFree ? 'FREE Bottle' : `Bottle #${offset * packSize + i + 1}`,
            isFree,
            price: isFree ? 0 : pricePerBottle,
            originalPrice: originalPerBottle,
            packSize,
            quantity: 1,
            autoRefill: sample.autoRefill,
          };
        });
        return [...prev, ...extraRows];
      } else {
        // Remove last pack set
        if (group.length <= packSize) return prev.filter(i => i.groupId !== groupId);
        const toRemove = group.slice(-packSize).map(i => i.packId);
        return prev.filter(i => !toRemove.includes(i.packId));
      }
    });
  };

  const clearCart = () => { setCartItems([]); setCoupon(null); };
  const applyCoupon = (data) => setCoupon(data);
  const removeCoupon = () => setCoupon(null);

  // Totals — only count paid bottles for price
  const cartTotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const cartSavings = cartItems.reduce((sum, i) => sum + Math.max(0, (i.originalPrice - i.price) * i.quantity), 0);
  const couponDiscount = coupon ? coupon.discountAmount : 0;
  const cartFinalTotal = Math.max(0, cartTotal - couponDiscount);

  // Unique groups for display grouping (complete packs only)
  const cartGroups = cartItems.reduce((acc, item) => {
    if (!acc[item.groupId]) acc[item.groupId] = [];
    acc[item.groupId].push(item);
    return acc;
  }, {});

  const cartPackCount = Object.values(cartGroups).reduce((sum, group) => {
    const packSize = Number(group[0]?.packSize || 1);
    if (group.length % packSize !== 0) return sum;
    return sum + group.length / packSize;
  }, 0);

  const cartBottleCount = cartItems.length;

  return (
    <CartContext.Provider value={{
      cartItems, cartGroups, addToCart, removeFromCart, removeBottle, removeGroup, updateQuantity, clearCart,
      cartCount: cartBottleCount, cartBottleCount, cartPackCount, cartTotal, cartSavings, cartFinalTotal,
      coupon, applyCoupon, removeCoupon,
      isCartOpen, setIsCartOpen,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);