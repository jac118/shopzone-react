// src/pages/NotFound.jsx
import { Link } from 'react-router-dom';
export default function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '5rem 2rem' }}>
      <div style={{ fontSize: '8rem', fontWeight: 900, color: '#e94560', opacity: 0.15 }}>404</div>
      <h2 style={{ fontSize: '1.8rem', color: '#1a1a2e', marginBottom: '0.75rem' }}>Page Not Found</h2>
      <p style={{ color: '#666', marginBottom: '2rem' }}>The page you're looking for doesn't exist.</p>
      <Link to="/" style={{
        background: '#e94560', color: 'white', padding: '0.75rem 1.5rem',
        borderRadius: '8px', textDecoration: 'none', fontWeight: 600
      }}>
        🏠 Go Home
      </Link>
    </div>
  );
}
