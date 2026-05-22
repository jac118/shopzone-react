#!/bin/bash
BASE="/var/www/html/shopzone-react/src"

echo "Building Login page..."
cat > "$BASE/pages/Login.jsx" << 'EOF'
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login }            = useAuth();
  const navigate             = useNavigate();
  const location             = useLocation();
  const from                 = location.state?.from || '/';

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('All fields are required.'); return; }
    try {
      setLoading(true);
      const user = await login(email, password);
      navigate(user.role === 'admin' ? '/' : from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message ?? 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display:'flex', justifyContent:'center',
      alignItems:'center', padding:'3rem 1rem',
      minHeight:'calc(100vh - 130px)'
    }}>
      <div style={{
        background:'white', padding:'2.5rem',
        borderRadius:'12px', width:'100%', maxWidth:'420px',
        boxShadow:'0 4px 20px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ fontSize:'1.6rem', color:'#1a1a2e', marginBottom:'1.5rem' }}>
          Welcome Back
        </h2>

        {error && (
          <div style={{
            background:'#fee2e2', color:'#b91c1c',
            padding:'0.85rem 1rem', borderRadius:'8px',
            marginBottom:'1rem', fontSize:'0.92rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom:'1.2rem' }}>
            <label style={labelStyle}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="john@example.com"
              style={inputStyle}
              required
            />
          </div>

          <div style={{ marginBottom:'1.2rem' }}>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Your password"
              style={inputStyle}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width:'100%', padding:'0.75rem',
              background: loading ? '#ccc' : '#e94560',
              color:'white', border:'none', borderRadius:'8px',
              fontSize:'1rem', fontWeight:600,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition:'background 0.2s'
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p style={{ marginTop:'1.2rem', textAlign:'center', fontSize:'0.9rem', color:'#555' }}>
          No account yet?{' '}
          <Link to="/register" style={{ color:'#e94560', fontWeight:600 }}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

const labelStyle = {
  display:'block', marginBottom:'0.4rem',
  fontWeight:600, fontSize:'0.9rem', color:'#333'
};
const inputStyle = {
  width:'100%', padding:'0.75rem 1rem',
  border:'1px solid #ddd', borderRadius:'8px',
  fontSize:'1rem', outline:'none',
  fontFamily:'inherit', boxSizing:'border-box'
};
EOF

echo "Building Register page..."
cat > "$BASE/pages/Register.jsx" << 'EOF'
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate     = useNavigate();

  const [form,    setForm]    = useState({ name:'', email:'', password:'', confirm:'' });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name || !form.email || !form.password || !form.confirm) {
      setError('All fields are required.'); return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.'); return;
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match.'); return;
    }

    try {
      setLoading(true);
      await register(form.name, form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message ?? 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display:'flex', justifyContent:'center',
      alignItems:'center', padding:'3rem 1rem',
      minHeight:'calc(100vh - 130px)'
    }}>
      <div style={{
        background:'white', padding:'2.5rem',
        borderRadius:'12px', width:'100%', maxWidth:'420px',
        boxShadow:'0 4px 20px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ fontSize:'1.6rem', color:'#1a1a2e', marginBottom:'1.5rem' }}>
          Create an Account
        </h2>

        {error && (
          <div style={{
            background:'#fee2e2', color:'#b91c1c',
            padding:'0.85rem 1rem', borderRadius:'8px',
            marginBottom:'1rem', fontSize:'0.92rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {[
            { label:'Full Name',        name:'name',     type:'text',     placeholder:'John Doe' },
            { label:'Email Address',    name:'email',    type:'email',    placeholder:'john@example.com' },
            { label:'Password',         name:'password', type:'password', placeholder:'Min. 8 characters' },
            { label:'Confirm Password', name:'confirm',  type:'password', placeholder:'Repeat password' },
          ].map(field => (
            <div key={field.name} style={{ marginBottom:'1.2rem' }}>
              <label style={labelStyle}>{field.label}</label>
              <input
                type={field.type}
                name={field.name}
                value={form[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                style={inputStyle}
                required
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            style={{
              width:'100%', padding:'0.75rem',
              background: loading ? '#ccc' : '#e94560',
              color:'white', border:'none', borderRadius:'8px',
              fontSize:'1rem', fontWeight:600,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ marginTop:'1.2rem', textAlign:'center', fontSize:'0.9rem', color:'#555' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color:'#e94560', fontWeight:600 }}>Login</Link>
        </p>
      </div>
    </div>
  );
}

const labelStyle = {
  display:'block', marginBottom:'0.4rem',
  fontWeight:600, fontSize:'0.9rem', color:'#333'
};
const inputStyle = {
  width:'100%', padding:'0.75rem 1rem',
  border:'1px solid #ddd', borderRadius:'8px',
  fontSize:'1rem', outline:'none',
  fontFamily:'inherit', boxSizing:'border-box'
};
EOF

echo "Building ProductDetail page..."
cat > "$BASE/pages/ProductDetail.jsx" << 'EOF'
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { productsAPI, reviewsAPI } from '../api/client';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import StarRating from '../components/StarRating';
import Spinner    from '../components/Spinner';

const IMAGES_URL = import.meta.env.VITE_IMAGES_BASE_URL;

export default function ProductDetail() {
  const { id }               = useParams();
  const { user }             = useAuth();
  const { addToCart }        = useCart();
  const navigate             = useNavigate();

  const [product,   setProduct]   = useState(null);
  const [reviews,   setReviews]   = useState([]);
  const [stats,     setStats]     = useState(null);
  const [quantity,  setQuantity]  = useState(1);
  const [loading,   setLoading]   = useState(true);
  const [adding,    setAdding]    = useState(false);
  const [added,     setAdded]     = useState(false);

  const [reviewForm, setReviewForm] = useState({ rating:0, title:'', body:'' });
  const [reviewError,  setReviewError]  = useState('');
  const [reviewSuccess,setReviewSuccess]= useState('');
  const [submitting,   setSubmitting]   = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      productsAPI.getById(id),
      reviewsAPI.getForProduct(id),
    ]).then(([productRes, reviewRes]) => {
      setProduct(productRes.data.data);
      setReviews(reviewRes.data.data.reviews);
      setStats(reviewRes.data.data.stats);
    }).catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) { navigate('/login'); return; }
    try {
      setAdding(true);
      await addToCart(product.id, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 2500);
    } catch (err) {
      alert(err.response?.data?.message ?? 'Could not add to cart.');
    } finally {
      setAdding(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewForm.rating) { setReviewError('Please select a rating.'); return; }
    if (!reviewForm.title)  { setReviewError('Title is required.'); return; }
    if (!reviewForm.body)   { setReviewError('Review text is required.'); return; }
    try {
      setSubmitting(true);
      setReviewError('');
      await reviewsAPI.submit({ product_id: id, ...reviewForm });
      setReviewSuccess('Review submitted! It will appear after approval.');
      setReviewForm({ rating:0, title:'', body:'' });
    } catch (err) {
      setReviewError(err.response?.data?.message ?? 'Could not submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Spinner />;
  if (!product) return null;

  const imageUrl = `${IMAGES_URL}/${product.image}`;
  const rating   = product.rating ?? { average:0, total:0 };

  return (
    <div style={{ maxWidth:'1100px', margin:'0 auto', padding:'2rem 1rem' }}>

      {/* Back link */}
      <Link to="/" style={{ color:'#e94560', fontSize:'0.9rem', fontWeight:600 }}>
        ← Back to Shop
      </Link>

      {/* Product Detail Grid */}
      <div style={{
        display:'grid', gridTemplateColumns:'1fr 1fr',
        gap:'2.5rem', marginTop:'1.5rem',
      }}>
        {/* Image */}
        <div>
          <img
            src={imageUrl}
            alt={product.name}
            onError={e => e.target.src = `${IMAGES_URL}/placeholder.jpg`}
            style={{
              width:'100%', borderRadius:'12px',
              objectFit:'cover', maxHeight:'420px'
            }}
          />
        </div>

        {/* Info */}
        <div>
          <span style={{
            fontSize:'0.75rem', textTransform:'uppercase',
            color:'#e94560', fontWeight:700, letterSpacing:'0.05em'
          }}>
            {product.category_name}
          </span>

          <h1 style={{ fontSize:'1.8rem', color:'#1a1a2e', margin:'0.5rem 0' }}>
            {product.name}
          </h1>

          {/* Rating summary */}
          {rating.total > 0 ? (
            <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'1rem' }}>
              <StarRating rating={parseFloat(rating.average)} size={18} />
              <span style={{ fontWeight:700, color:'#1a1a2e' }}>
                {parseFloat(rating.average).toFixed(1)}
              </span>
              <span style={{ color:'#999', fontSize:'0.875rem' }}>
                ({rating.total} review{rating.total > 1 ? 's' : ''})
              </span>
            </div>
          ) : (
            <p style={{ color:'#999', fontSize:'0.875rem', marginBottom:'1rem' }}>
              No reviews yet
            </p>
          )}

          <p style={{ fontSize:'2rem', fontWeight:700, color:'#e94560', marginBottom:'1rem' }}>
            ${parseFloat(product.price).toFixed(2)}
          </p>

          <p style={{ color:'#555', lineHeight:1.7, marginBottom:'1rem' }}>
            {product.description}
          </p>

          <p style={{ marginBottom:'1.2rem', fontSize:'0.9rem' }}>
            {product.stock > 0
              ? <span style={{ color:'#16a34a' }}>✅ In Stock ({product.stock} available)</span>
              : <span style={{ color:'#dc2626' }}>❌ Out of Stock</span>
            }
          </p>

          {product.stock > 0 && (
            <div style={{ display:'flex', gap:'1rem', alignItems:'center', marginBottom:'1rem' }}>
              <div style={{ display:'flex', alignItems:'center', border:'1px solid #ddd', borderRadius:'8px', overflow:'hidden' }}>
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  style={{ padding:'0.5rem 0.85rem', background:'none', border:'none', fontSize:'1.1rem', cursor:'pointer' }}
                >−</button>
                <span style={{ padding:'0.5rem 0.75rem', fontWeight:600 }}>{quantity}</span>
                <button
                  onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                  style={{ padding:'0.5rem 0.85rem', background:'none', border:'none', fontSize:'1.1rem', cursor:'pointer' }}
                >+</button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={adding}
                style={{
                  flex:1, padding:'0.75rem',
                  background: added ? '#16a34a' : '#e94560',
                  color:'white', border:'none', borderRadius:'8px',
                  fontSize:'1rem', fontWeight:600,
                  cursor: adding ? 'not-allowed' : 'pointer',
                  transition:'background 0.2s'
                }}
              >
                {adding ? 'Adding...' : added ? '✓ Added to Cart!' : '🛒 Add to Cart'}
              </button>
            </div>
          )}

          <Link to="/" style={{
            display:'inline-block', marginTop:'0.5rem',
            padding:'0.6rem 1.2rem', border:'2px solid #1a1a2e',
            borderRadius:'8px', color:'#1a1a2e', fontWeight:600,
            fontSize:'0.9rem'
          }}>
            ← Continue Shopping
          </Link>
        </div>
      </div>

      {/* Reviews Section */}
      <div style={{ marginTop:'3rem', paddingTop:'2rem', borderTop:'2px solid #f0f0f0' }}>
        <h2 style={{ fontSize:'1.4rem', color:'#1a1a2e', marginBottom:'1.5rem' }}>
          Customer Reviews
          {stats?.total > 0 && (
            <span style={{ fontSize:'1rem', color:'#999', fontWeight:400, marginLeft:'0.5rem' }}>
              ({stats.total})
            </span>
          )}
        </h2>

        {/* Rating Breakdown */}
        {stats?.total > 0 && (
          <div style={{
            display:'flex', gap:'2rem', alignItems:'center',
            background:'#f8f9fa', borderRadius:'12px',
            padding:'1.5rem', marginBottom:'2rem', flexWrap:'wrap'
          }}>
            <div style={{ textAlign:'center', minWidth:'100px' }}>
              <div style={{ fontSize:'3rem', fontWeight:900, color:'#1a1a2e', lineHeight:1 }}>
                {parseFloat(stats.average).toFixed(1)}
              </div>
              <StarRating rating={parseFloat(stats.average)} size={20} />
              <div style={{ fontSize:'0.8rem', color:'#999', marginTop:'4px' }}>
                {stats.total} review{stats.total > 1 ? 's' : ''}
              </div>
            </div>
            <div style={{ flex:1, minWidth:'200px' }}>
              {[5,4,3,2,1].map(num => {
                const key   = ['five','four','three','two','one'][5-num];
                const count = parseInt(stats[`${key}_star`]) || 0;
                const pct   = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                return (
                  <div key={num} style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'0.4rem' }}>
                    <span style={{ fontSize:'0.8rem', color:'#666', width:'30px', textAlign:'right' }}>{num} ★</span>
                    <div style={{ flex:1, height:'8px', background:'#e5e7eb', borderRadius:'999px', overflow:'hidden' }}>
                      <div style={{ width:`${pct}%`, height:'100%', background:'#f59e0b', borderRadius:'999px' }} />
                    </div>
                    <span style={{ fontSize:'0.8rem', color:'#999', width:'20px' }}>{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Review Form */}
        {user ? (
          <div style={{
            background:'white', border:'1px solid #e5e7eb',
            borderRadius:'12px', padding:'1.5rem', marginBottom:'2rem'
          }}>
            <h3 style={{ color:'#1a1a2e', marginBottom:'1rem' }}>Write a Review</h3>

            {reviewError && (
              <div style={{ background:'#fee2e2', color:'#b91c1c', padding:'0.75rem', borderRadius:'8px', marginBottom:'1rem', fontSize:'0.9rem' }}>
                {reviewError}
              </div>
            )}
            {reviewSuccess && (
              <div style={{ background:'#dcfce7', color:'#15803d', padding:'0.75rem', borderRadius:'8px', marginBottom:'1rem', fontSize:'0.9rem' }}>
                {reviewSuccess}
              </div>
            )}

            <form onSubmit={handleReviewSubmit}>
              {/* Star Picker */}
              <div style={{ marginBottom:'1rem' }}>
                <label style={{ display:'block', fontWeight:600, marginBottom:'0.5rem', fontSize:'0.9rem' }}>
                  Your Rating *
                </label>
                <div style={{ display:'flex', gap:'4px' }}>
                  {[1,2,3,4,5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewForm(p => ({ ...p, rating: star }))}
                      style={{
                        background:'none', border:'none', cursor:'pointer',
                        fontSize:'2rem', padding:'0',
                        color: star <= reviewForm.rating ? '#f59e0b' : '#d1d5db',
                        transition:'color 0.15s'
                      }}
                    >★</button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom:'1rem' }}>
                <label style={{ display:'block', fontWeight:600, marginBottom:'0.4rem', fontSize:'0.9rem' }}>
                  Review Title *
                </label>
                <input
                  type="text"
                  value={reviewForm.title}
                  onChange={e => setReviewForm(p => ({ ...p, title: e.target.value }))}
                  placeholder="Summarize your experience"
                  maxLength={150}
                  style={{
                    width:'100%', padding:'0.75rem', border:'1px solid #ddd',
                    borderRadius:'8px', fontSize:'1rem', boxSizing:'border-box',
                    fontFamily:'inherit'
                  }}
                />
              </div>

              <div style={{ marginBottom:'1rem' }}>
                <label style={{ display:'block', fontWeight:600, marginBottom:'0.4rem', fontSize:'0.9rem' }}>
                  Your Review *
                </label>
                <textarea
                  value={reviewForm.body}
                  onChange={e => setReviewForm(p => ({ ...p, body: e.target.value }))}
                  placeholder="Share your thoughts about this product..."
                  rows={4}
                  style={{
                    width:'100%', padding:'0.75rem', border:'1px solid #ddd',
                    borderRadius:'8px', fontSize:'1rem', boxSizing:'border-box',
                    fontFamily:'inherit', resize:'vertical'
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                style={{
                  padding:'0.75rem 1.5rem',
                  background: submitting ? '#ccc' : '#e94560',
                  color:'white', border:'none', borderRadius:'8px',
                  fontSize:'1rem', fontWeight:600,
                  cursor: submitting ? 'not-allowed' : 'pointer'
                }}
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        ) : (
          <div style={{
            background:'#f8f9fa', borderRadius:'8px',
            padding:'1rem 1.5rem', marginBottom:'1.5rem',
            color:'#666', fontSize:'0.95rem'
          }}>
            <Link to="/login" style={{ color:'#e94560', fontWeight:600 }}>Login</Link>
            {' '}to write a review.
          </div>
        )}

        {/* Reviews List */}
        <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
          {reviews.length === 0 ? (
            <p style={{ color:'#888', padding:'1rem 0' }}>
              No reviews yet. Be the first to share your thoughts!
            </p>
          ) : (
            reviews.map(review => (
              <div key={review.id} style={{
                background:'white', border:'1px solid #f0f0f0',
                borderRadius:'12px', padding:'1.25rem 1.5rem',
                boxShadow:'0 1px 4px rgba(0,0,0,0.05)'
              }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'0.5rem', marginBottom:'0.75rem' }}>
                  <div>
                    <StarRating rating={review.rating} size={14} />
                    <strong style={{ display:'block', fontSize:'0.975rem', color:'#1a1a2e', marginTop:'0.25rem' }}>
                      {review.title}
                    </strong>
                  </div>
                  {review.verified_purchase === 1 && (
                    <span style={{
                      background:'#dcfce7', color:'#15803d',
                      fontSize:'0.75rem', fontWeight:700,
                      padding:'0.2rem 0.6rem', borderRadius:'999px'
                    }}>
                      ✅ Verified Purchase
                    </span>
                  )}
                </div>
                <p style={{ color:'#555', fontSize:'0.9rem', lineHeight:1.7, marginBottom:'0.75rem' }}>
                  {review.body}
                </p>
                <div style={{ display:'flex', gap:'1rem', fontSize:'0.8rem', color:'#999' }}>
                  <span>👤 {review.reviewer_name}</span>
                  <span>{new Date(review.created_at).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' })}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
EOF

echo "Building Cart page..."
cat > "$BASE/pages/Cart.jsx" << 'EOF'
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';

const IMAGES_URL = import.meta.env.VITE_IMAGES_BASE_URL;

export default function Cart() {
  const { user }                                     = useAuth();
  const { items, total, loading, updateCart, removeFromCart } = useCart();
  const navigate                                     = useNavigate();
  const [updating, setUpdating]                      = useState(null);

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
      alert(err.response?.data?.message ?? 'Could not update cart.');
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

  return (
    <div style={{ maxWidth:'1100px', margin:'0 auto', padding:'2rem 1rem' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
        <h2 style={{ fontSize:'1.6rem', color:'#1a1a2e' }}>🛒 Your Cart</h2>
        {items.length > 0 && (
          <span style={{ color:'#666', fontSize:'0.9rem' }}>
            {items.reduce((s, i) => s + i.quantity, 0)} item(s)
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

          {/* Cart Items */}
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
                {/* Image */}
                <div style={{ width:'80px', height:'80px', flexShrink:0, borderRadius:'8px', overflow:'hidden', background:'#f0f0f0' }}>
                  <img
                    src={`${IMAGES_URL}/${item.image}`}
                    alt={item.name}
                    onError={e => e.target.src = `${IMAGES_URL}/placeholder.jpg`}
                    style={{ width:'100%', height:'100%', objectFit:'cover' }}
                  />
                </div>

                {/* Info */}
                <div style={{ flex:1 }}>
                  <h4 style={{ fontSize:'0.95rem', color:'#1a1a2e', marginBottom:'0.25rem' }}>
                    {item.name}
                  </h4>
                  <p style={{ fontSize:'0.85rem', color:'#777' }}>
                    ${parseFloat(item.price).toFixed(2)} each
                  </p>
                </div>

                {/* Quantity Controls */}
                <div style={{ display:'flex', alignItems:'center', border:'1px solid #ddd', borderRadius:'8px', overflow:'hidden' }}>
                  <button
                    onClick={() => handleUpdate(item.product_id, item.quantity - 1)}
                    disabled={updating === item.product_id}
                    style={{ padding:'0.4rem 0.7rem', background:'none', border:'none', fontSize:'1rem', cursor:'pointer' }}
                  >−</button>
                  <span style={{ padding:'0.4rem 0.6rem', fontWeight:600, minWidth:'30px', textAlign:'center' }}>
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => handleUpdate(item.product_id, item.quantity + 1)}
                    disabled={updating === item.product_id || item.quantity >= item.stock}
                    style={{ padding:'0.4rem 0.7rem', background:'none', border:'none', fontSize:'1rem', cursor:'pointer' }}
                  >+</button>
                </div>

                {/* Subtotal */}
                <div style={{ fontWeight:700, fontSize:'1.05rem', color:'#1a1a2e', minWidth:'70px', textAlign:'right' }}>
                  ${parseFloat(item.subtotal).toFixed(2)}
                </div>

                {/* Remove */}
                <button
                  onClick={() => handleRemove(item.product_id)}
                  disabled={updating === item.product_id}
                  style={{ background:'none', border:'none', color:'#e94560', cursor:'pointer', fontSize:'1.1rem', padding:'0.25rem' }}
                  title="Remove item"
                >✕</button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div style={{
            background:'white', borderRadius:'12px',
            padding:'1.5rem', boxShadow:'0 2px 12px rgba(0,0,0,0.08)',
            position:'sticky', top:'1rem'
          }}>
            <h3 style={{ fontSize:'1.2rem', color:'#1a1a2e', marginBottom:'1.2rem' }}>
              Order Summary
            </h3>

            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.75rem', fontSize:'0.95rem' }}>
              <span>Subtotal ({items.reduce((s,i) => s + i.quantity, 0)} items)</span>
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

            
              href="http://localhost/ecommerce/public/checkout.php"
              style={{
                display:'blo
