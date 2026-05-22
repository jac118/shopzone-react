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
    } catch {
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
              <span>Total</span>
              <span>${parseFloat(total).toFixed(2)}</span>
            </div>

            <a
              href="http://localhost/ecommerce/public/checkout.php"
              style={{
                display:'block',
                width:'100%',
                textAlign:'center',
                background:'#e94560',
                color:'white',
                border:'none',
                borderRadius:'8px',
                padding:'0.8rem 1rem',
                fontSize:'1rem',
                fontWeight:700,
                textDecoration:'none',
                boxSizing:'border-box',
                marginBottom:'0.75rem'
              }}
            >
              Proceed to Checkout
            </a>

            <Link to="/" style={{
              display:'block',
              textAlign:'center',
              color:'#1a1a2e',
              fontWeight:600,
              fontSize:'0.9rem',
              textDecoration:'none'
            }}>
              Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
