#!/bin/bash
echo "Fixing Orders.jsx..."
cat > /var/www/html/shopzone-react/src/pages/Orders.jsx << 'ENDORDERS'
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ordersAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';

export default function Orders() {
  const { user }              = useAuth();
  const navigate              = useNavigate();
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    ordersAPI.getAll()
      .then(res => setOrders(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  const statusColors = {
    pending:    '#d97706',
    processing: '#2563eb',
    shipped:    '#7c3aed',
    delivered:  '#16a34a',
    cancelled:  '#dc2626',
  };

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });

  if (loading) return <Spinner />;

  return (
    <div style={{ maxWidth:'900px', margin:'0 auto', padding:'2rem 1rem' }}>
      <h2 style={{ fontSize:'1.6rem', color:'#1a1a2e', marginBottom:'1.5rem' }}>
        My Orders
      </h2>

      {orders.length === 0 ? (
        <div style={{ textAlign:'center', padding:'4rem 2rem' }}>
          <p style={{ color:'#888', fontSize:'1.1rem', marginBottom:'1.5rem' }}>
            You have not placed any orders yet.
          </p>
          <Link to="/" style={{
            background:'#e94560', color:'white',
            padding:'0.75rem 1.5rem', borderRadius:'8px',
            fontWeight:600, textDecoration:'none'
          }}>
            Start Shopping
          </Link>
        </div>
      ) : (
        <div style={{
          background:'white', borderRadius:'12px',
          boxShadow:'0 2px 12px rgba(0,0,0,0.07)',
          overflow:'hidden'
        }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ background:'#1a1a2e' }}>
                {['Order #', 'Date', 'Items', 'Total', 'Status', 'Details'].map(h => (
                  <th key={h} style={{
                    padding:'0.9rem 1rem', textAlign:'left',
                    color:'white', fontSize:'0.875rem', fontWeight:600
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((order, i) => (
                <tr
                  key={order.id}
                  style={{
                    borderBottom:'1px solid #f0f0f0',
                    background: i % 2 === 0 ? 'white' : '#fafafa'
                  }}
                >
                  <td style={{ padding:'0.9rem 1rem', fontWeight:700 }}>
                    #{order.id}
                  </td>
                  <td style={{ padding:'0.9rem 1rem', fontSize:'0.9rem', color:'#555' }}>
                    {formatDate(order.created_at)}
                  </td>
                  <td style={{ padding:'0.9rem 1rem', fontSize:'0.9rem', color:'#555' }}>
                    {order.item_count} item(s)
                  </td>
                  <td style={{ padding:'0.9rem 1rem', fontWeight:700 }}>
                    ${parseFloat(order.total_price).toFixed(2)}
                  </td>
                  <td style={{ padding:'0.9rem 1rem' }}>
                    <span style={{
                      background: statusColors[order.status] || '#6b7280',
                      color:'white', fontSize:'0.75rem', fontWeight:700,
                      padding:'0.25rem 0.75rem', borderRadius:'999px',
                      display:'inline-block'
                    }}>
                      {capitalize(order.status)}
                    </span>
                  </td>
                  <td style={{ padding:'0.9rem 1rem' }}>
                    
                      href={`http://localhost/ecommerce/public/order-confirm.php?id=${order.id}`}
                      style={{
                        background:'#1a1a2e', color:'white',
                        padding:'0.35rem 0.85rem', borderRadius:'6px',
                        fontSize:'0.82rem', fontWeight:600,
                        textDecoration:'none', display:'inline-block'
                      }}
                    >
                      View
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
ENDORDERS
echo "Orders.jsx done: $(wc -l < /var/www/html/shopzone-react/src/pages/Orders.jsx) lines"

echo "Fixing Cart.jsx..."
cat > /var/www/html/shopzone-react/src/pages/Cart.jsx << 'ENDCART'
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';

const IMAGES_URL = import.meta.env.VITE_IMAGES_BASE_URL;

export default function Cart() {
  const { user }                                            = useAuth();
  const { items, total, loading, updateCart, removeFromCart } = useCart();
  const navigate                                            = useNavigate();
  const [updating, setUpdating]                             = useState(null);

  if (!user) {
    navigate('/login');
    return null;
  }

  if (loading) return <Spinner />;

  const handleUpdate = async (productId, quantity) => {
    try {
      setUpdating(productId);
      await updateCart(productId, quantity);
    } catch (err) {
      alert(err.response?.data?.message || 'Could not update cart.');
    } finally {
      setUpdating(null);
    }
  };

  const handleRemove = async (productId) => {
    try {
      setUpdating(productId);
      await removeFromCart(productId);
    } catch (err) {
      alert('Could not remove item.');
    } finally {
      setUpdating(null);
    }
  };

  const totalCount = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <div style={{ maxWidth:'1100px', margin:'0 auto', padding:'2rem 1rem' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
        <h2 style={{ fontSize:'1.6rem', color:'#1a1a2e' }}>Your Cart</h2>
        {items.length > 0 && (
          <span style={{ color:'#666', fontSize:'0.9rem' }}>
            {totalCount} item(s)
          </span>
        )}
      </div>

      {items.length === 0 ? (
        <div style={{ textAlign:'center', padding:'4rem 2rem' }}>
          <div style={{ fontSize:'4rem', marginBottom:'1rem' }}>🛒</div>
          <h3 style={{ fontSize:'1.3rem', color:'#1a1a2e', marginBottom:'0.5rem' }}>
            Your cart is empty
          </h3>
          <p style={{ color:'#888', marginBottom:'1.5rem' }}>
            Looks like you have not added anything yet.
          </p>
          <Link to="/" style={{
            background:'#e94560', color:'white',
            padding:'0.75rem 1.5rem', borderRadius:'8px',
            fontWeight:600, textDecoration:'none'
          }}>
            Start Shopping
          </Link>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:'2rem', alignItems:'start' }}>

          <div>
            {items.map(item => (
              <div key={item.product_id} style={{
                background:'white', borderRadius:'12px',
                padding:'1rem', marginBottom:'1rem',
                boxShadow:'0 2px 8px rgba(0,0,0,0.06)',
                display:'flex', alignItems:'center', gap:'1rem',
                opacity: updating === item.product_id ? 0.6 : 1,
                transition:'opacity 0.2s'
              }}>
                <div style={{
                  width:'80px', height:'80px', flexShrink:0,
                  borderRadius:'8px', overflow:'hidden', background:'#f0f0f0'
                }}>
                  <img
                    src={`${IMAGES_URL}/${item.image}`}
                    alt={item.name}
                    onError={e => { e.target.src = `${IMAGES_URL}/placeholder.jpg`; }}
                    style={{ width:'100%', height:'100%', objectFit:'cover' }}
                  />
                </div>

                <div style={{ flex:1 }}>
                  <h4 style={{ fontSize:'0.95rem', color:'#1a1a2e', marginBottom:'0.25rem' }}>
                    {item.name}
                  </h4>
                  <p style={{ fontSize:'0.85rem', color:'#777' }}>
                    ${parseFloat(item.price).toFixed(2)} each
                  </p>
                </div>

                <div style={{ display:'flex', alignItems:'center', border:'1px solid #ddd', borderRadius:'8px', overflow:'hidden' }}>
                  <button
                    onClick={() => handleUpdate(item.product_id, item.quantity - 1)}
                    disabled={updating === item.product_id}
                    style={{ padding:'0.4rem 0.7rem', background:'none', border:'none', fontSize:'1rem', cursor:'pointer' }}
                  >
                    -
                  </button>
                  <span style={{ padding:'0.4rem 0.6rem', fontWeight:600, minWidth:'30px', textAlign:'center' }}>
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => handleUpdate(item.product_id, item.quantity + 1)}
                    disabled={updating === item.product_id || item.quantity >= item.stock}
                    style={{ padding:'0.4rem 0.7rem', background:'none', border:'none', fontSize:'1rem', cursor:'pointer' }}
                  >
                    +
                  </button>
                </div>

                <div style={{ fontWeight:700, fontSize:'1.05rem', color:'#1a1a2e', minWidth:'70px', textAlign:'right' }}>
                  ${parseFloat(item.subtotal).toFixed(2)}
                </div>

                <button
                  onClick={() => handleRemove(item.product_id)}
                  disabled={updating === item.product_id}
                  style={{ background:'none', border:'none', color:'#e94560', cursor:'pointer', fontSize:'1.1rem', padding:'0.25rem' }}
                  title="Remove item"
                >
                  x
                </button>
              </div>
            ))}
          </div>

          <div style={{
            background:'white', borderRadius:'12px',
            padding:'1.5rem', boxShadow:'0 2px 12px rgba(0,0,0,0.08)',
            position:'sticky', top:'1rem'
          }}>
            <h3 style={{ fontSize:'1.2rem', color:'#1a1a2e', marginBottom:'1.2rem' }}>
              Order Summary
            </h3>

            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.75rem', fontSize:'0.95rem' }}>
              <span>Subtotal ({totalCount} items)</span>
              <span>${parseFloat(total).toFixed(2)}</span>
            </div>

            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.75rem', fontSize:'0.95rem' }}>
              <span>Shipping</span>
              <span style={{ color:'#16a34a' }}>Free</span>
            </div>

            <div style={{ borderTop:'1px solid #eee', margin:'1rem 0' }} />

            <div style={{ display:'flex', justifyContent:'space-between', fontSize:'1.15rem', fontWeight:700, color:'#1a1a2e', marginBottom:'1.25rem' }}>
