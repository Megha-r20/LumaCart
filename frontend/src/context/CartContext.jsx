import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('cartItems');
    return saved ? JSON.parse(saved) : [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, qty = 1) => {
    setCartItems(prevItems => {
      const existItem = prevItems.find(x => x.product === (product._id || product.product));
      if (existItem) {
        return prevItems.map(x =>
          x.product === (product._id || product.product)
            ? { ...x, qty: Math.min(x.qty + qty, product.countInStock || 99) }
            : x
        );
      } else {
        return [
          ...prevItems,
          {
            product: product._id || product.product,
            name: product.name,
            image: product.images ? product.images[0] : product.image,
            price: product.price,
            countInStock: product.countInStock,
            qty
          }
        ];
      }
    });
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(x => x.product !== id));
  };

  const updateQuantity = (id, newQty) => {
    if (newQty <= 0) {
      removeFromCart(id);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.product === id ? { ...item, qty: Math.min(newQty, item.countInStock || 99) } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setDiscountPercent(0);
    setPromoCode('');
  };

  const applyPromoCode = (code) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'LUMA20') {
      setDiscountPercent(20);
      setPromoCode('LUMA20');
      return { success: true, message: '20% Promo discount applied!' };
    } else if (cleanCode === 'INTERN10') {
      setDiscountPercent(10);
      setPromoCode('INTERN10');
      return { success: true, message: '10% Internship promo applied!' };
    } else {
      return { success: false, message: 'Invalid coupon code' };
    }
  };

  // Price calculations
  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const discountPrice = (itemsPrice * discountPercent) / 100;
  const shippingPrice = itemsPrice > 5000 || itemsPrice === 0 ? 0 : 499.00;
  const taxPrice = Number((0.18 * (itemsPrice - discountPrice)).toFixed(2));
  const totalPrice = Number((itemsPrice - discountPrice + shippingPrice + taxPrice).toFixed(2));
  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyPromoCode,
        promoCode,
        discountPercent,
        itemsPrice,
        discountPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        totalItemsCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
