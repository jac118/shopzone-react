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
