// src/components/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count }        = useCart();
  const navigate         = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav style={{
      background: '#1a1a2e', color: 'white',
      padding: '1rem 2rem', display: 'flex',
      justifyContent: 'space-between', alignItems: 'center',
      position: 'sticky', top: 0, zIndex: 100,
      boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
    }}>
      <Link to="/" style={{ color: '#e94560', fontWeight: 700, fontSize: '1.4rem', textDecoration: 'none' }}>
        🛒 ShopZone
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <Link to="/" style={navLink}>Home</Link>

        {user ? (
          <>
            <Link to="/cart" style={{ ...navLink, position: 'relative' }}>
              🛒 Cart
              {count > 0 && (
                <span style={{
                  background: '#e94560', color: 'white',
                  fontSize: '0.65rem', fontWeight: 700,
                  width: '18px', height: '18px', borderRadius: '50%',
                  display: 'inline-flex', alignItems: 'center',
                  justifyContent: 'center', position: 'absolute',
                  top: '-8px', right: '-10px'
                }}>
                  {count}
                </span>
              )}
            </Link>
            <Link to="/orders" style={navLink}>Orders</Link>
            <span style={{ color: '#aaa', fontSize: '0.9rem' }}>
              👤 {user.name.split(' ')[0]}
            </span>
            <button
              onClick={handleLogout}
              style={{
                background: 'transparent', border: '1px solid #e94560',
                color: '#e94560', padding: '0.3rem 0.9rem',
                borderRadius: '6px', cursor: 'pointer',
                fontSize: '0.875rem', fontWeight: 600
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login"    style={navLink}>Login</Link>
            <Link to="/register" style={{
              background: '#e94560', color: 'white',
              padding: '0.35rem 1rem', borderRadius: '6px',
              textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem'
            }}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

const navLink = {
  color: 'white', textDecoration: 'none',
  fontSize: '0.95rem', transition: 'color 0.2s'
};
