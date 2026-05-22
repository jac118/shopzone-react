// src/components/ProductCard.jsx
import { Link } from 'react-router-dom';
import { useState } from 'react';
import StarRating from './StarRating';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const IMAGES_URL = import.meta.env.VITE_IMAGES_BASE_URL;

export default function ProductCard({ product }) {
  const { user }               = useAuth();
  const { addToCart }          = useCart();
  const [adding, setAdding]    = useState(false);
  const [added,  setAdded]     = useState(false);

  const imageUrl = `${IMAGES_URL}/${product.image}`;
  const rating   = product.rating ?? { average: 0, total: 0 };

  const handleAddToCart = async () => {
    if (!user) { window.location.href = '/login'; return; }
    try {
      setAdding(true);
      await addToCart(product.id, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      alert(err.response?.data?.message ?? 'Could not add to cart.');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div style={{
      background: 'white', borderRadius: '12px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
      overflow: 'hidden', display: 'flex',
      flexDirection: 'column',
      transition: 'transform 0.2s, box-shadow 0.2s',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.07)';
      }}
    >
      {/* Image */}
      <Link to={`/products/${product.id}`}>
        <div style={{ height: '200px', overflow: 'hidden', background: '#f0f0f0' }}>
          <img
            src={imageUrl}
            alt={product.name}
            onError={e => e.target.src = `${IMAGES_URL}/placeholder.jpg`}
            style={{
              width: '100%', height: '100%',
              objectFit: 'cover', transition: 'transform 0.3s'
            }}
          />
        </div>
      </Link>

      {/* Info */}
      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <span style={{
          fontSize: '0.75rem', textTransform: 'uppercase',
          letterSpacing: '0.05em', color: '#e94560',
          fontWeight: 700, marginBottom: '0.3rem'
        }}>
          {product.category_name}
        </span>

        {/* Star Rating */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.4rem' }}>
          <StarRating rating={parseFloat(rating.average)} size={13} />
          {rating.total > 0
            ? <span style={{ fontSize: '0.75rem', color: '#999' }}>({rating.total})</span>
            : <span style={{ fontSize: '0.75rem', color: '#ccc' }}>No reviews</span>
          }
        </div>

        <Link to={`/products/${product.id}`} style={{ textDecoration: 'none' }}>
          <h3 style={{
            fontSize: '0.95rem', fontWeight: 600,
            color: '#1a1a2e', marginBottom: '0.75rem', lineHeight: 1.4
          }}>
            {product.name}
          </h3>
        </Link>

        {/* Footer */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginTop: 'auto'
        }}>
          <span style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1a1a2e' }}>
            ${parseFloat(product.price).toFixed(2)}
          </span>

          {product.stock > 0 ? (
            <button
              onClick={handleAddToCart}
              disabled={adding}
              style={{
                background: added ? '#16a34a' : '#e94560',
                color: 'white', border: 'none',
                padding: '0.4rem 0.85rem', borderRadius: '8px',
                fontSize: '0.85rem', fontWeight: 600,
                cursor: adding ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s',
              }}
            >
              {adding ? '...' : added ? '✓ Added' : '+ Cart'}
            </button>
          ) : (
            <span style={{ color: '#999', fontSize: '0.85rem', fontStyle: 'italic' }}>
              Out of stock
            </span>
          )}
        </div>

        {product.stock > 0 && product.stock <= 5 && (
          <p style={{ color: '#d97706', fontSize: '0.78rem', marginTop: '0.4rem' }}>
            ⚠️ Only {product.stock} left!
          </p>
        )}
      </div>
    </div>
  );
}
