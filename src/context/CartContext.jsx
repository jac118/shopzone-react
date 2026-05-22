// src/context/CartContext.jsx
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { cartAPI } from '../api/client';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

const calcCount = (cartItems) =>
  cartItems.reduce((sum, item) => sum + item.quantity, 0);

export function CartProvider({ children }) {
  const { user }               = useAuth();
  const [items,  setItems]     = useState([]);
  const [total,  setTotal]     = useState(0);
  const [count,  setCount]     = useState(0);
  const [loading,setLoading]   = useState(false);

  // Fetch cart from API
  const fetchCart = useCallback(async () => {
    if (!user) { setItems([]); setTotal(0); setCount(0); return; }
    try {
      setLoading(true);
      const res = await cartAPI.get();
      const { items, total } = res.data.data;
      setItems(items);
      setTotal(total);
      setCount(calcCount(items));
    } catch (err) {
      console.error('Cart fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Reload cart when user logs in/out
  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    const res = await cartAPI.add({ product_id: productId, quantity });
    const { items, total, count } = res.data.data;
    setItems(items);
    setTotal(total);
    setCount(count);
  };

  const updateCart = async (productId, quantity) => {
    const res = await cartAPI.update({ product_id: productId, quantity });
    const { items, total, count } = res.data.data;
    setItems(items);
    setTotal(total);
    setCount(count);
  };

  const removeFromCart = async (productId) => {
    await cartAPI.remove({ product_id: productId });
    await fetchCart();
  };

  return (
    <CartContext.Provider value={{
      items, total, count, loading,
      fetchCart, addToCart, updateCart, removeFromCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext);
