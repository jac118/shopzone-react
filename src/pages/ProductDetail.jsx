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
  }, [id, navigate]);

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
