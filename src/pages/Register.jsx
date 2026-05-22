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
