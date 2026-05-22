// src/components/Spinner.jsx
export default function Spinner({ size = 'md' }) {
  const sizes = { sm: '20px', md: '40px', lg: '60px' };
  return (
    <div style={{
      display: 'flex', justifyContent: 'center',
      alignItems: 'center', padding: '2rem'
    }}>
      <div style={{
        width: sizes[size], height: sizes[size],
        border: '3px solid #f0f0f0',
        borderTop: '3px solid #e94560',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
