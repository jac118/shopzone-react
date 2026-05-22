// src/components/StarRating.jsx
export default function StarRating({ rating = 0, size = 16 }) {
  return (
    <span style={{ display: 'inline-flex', gap: '1px', fontSize: size }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          style={{
            color: star <= rating ? '#f59e0b'
                 : star - 0.5 <= rating ? '#f59e0b'
                 : '#d1d5db',
            opacity: star - 0.5 <= rating && star > rating ? 0.6 : 1,
          }}
        >
          {star <= rating ? '★' : star - 0.5 <= rating ? '★' : '☆'}
        </span>
      ))}
    </span>
  );
}
