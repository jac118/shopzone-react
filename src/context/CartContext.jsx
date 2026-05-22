import { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../api/client';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user }             = useAuth();
  const [items,  setItems]   = useState([]);
  const [total,  setTotal]   = useState(0);
  const [count,  setCount]   = useState(0);
  const [loading,setLoading] = useState(false);

  const calcCount = (cartItems) => {
    if (!Array.isArray(cartItems)) return 0;
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  const fetchCart = async () => {
    if (!user) { setItems([]); setTotal(0); setCount(0); return; }
    try {
      setLoading(true);
      const res = await cartAPI.get();
      const data = res?.data?.data;
      const cartItems = Array.isArray(data?.items) ? data.items : [];
      setItems(cartItems);
      setTotal(data?.total ?? 0);
      setCount(calcCount(cartItems));
    } catch (err) {
      console.error('Cart fetch error:', err);
      setItems([]);
      setTotal(0);
      setCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCart(); }, [user]);

  const addToCart = async (productId, quantity = 1) => {
    const res = await cartAPI.add({ product_id: productId, quantity });
    const data = res?.data?.data;
    const cartItems = Array.isArray(data?.items) ? data.items : [];
    setItems(cartItems);
    setTotal(data?.total ?? 0);
    setCount(data?.count ?? calcCount(cartItems));
  };

  const updateCart = async (productId, quantity) => {
    const res = await cartAPI.update({ product_id: productId, quantity });
    const data = res?.data?.data;
    const cartItems = Array.isArray(data?.items) ? data.items : [];
    setItems(cartItems);
    setTotal(data?.total ?? 0);
    setCount(data?.count ?? calcCount(cartItems));
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

export const useCart = () => useContext(CartContext);
