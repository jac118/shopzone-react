import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ordersAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';

const STATUS_COLORS = {
  pending: '#d97706',
  processing: '#2563eb',
  shipped: '#7c3aed',
  delivered: '#16a34a',
  cancelled: '#dc2626',
};

function StatusBadge({ status = 'pending' }) {
  const bg = STATUS_COLORS[status] || '#6b7280';
  const txt = status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <span style={{
      background: bg, color: 'white',
      fontSize: '0.75rem', fontWeight: 700,
      padding: '0.25rem 0.75rem',
      borderRadius: '999px', display: 'inline-block'
    }}>
      {txt}
    </span>
  );
}

function OrderRow({ order, index }) {
  const bg = index % 2 === 0 ? 'white' : '#fafafa';
  const url = `http://localhost/ecommerce/public/order-confirm.php?id=${order.id}`;
  const date = new Date(order.created_at).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  });

  return (
    <tr style={{ borderBottom: '1px solid #f0f0f0', background: bg }}>
      <td style={{ padding: '0.9rem 1rem', fontWeight: 700 }}>#{order.id}</td>
      <td style={{ padding: '0.9rem 1rem', fontSize: '0.9rem', color: '#555' }}>{date}</td>
      <td style={{ padding: '0.9rem 1rem', fontSize: '0.9rem', color: '#555' }}>{order.item_count} item(s)</td>
      <td style={{ padding: '0.9rem 1rem', fontWeight: 700 }}>${parseFloat(order.total_price || 0).toFixed(2)}</td>
      <td style={{ padding: '0.9rem 1rem' }}><StatusBadge status={order.status} /></td>
      <td style={{ padding: '0.9rem 1rem' }}>
        <a href={url} style={{
          background: '#1a1a2e', color: 'white',
          padding: '0.35rem 0.85rem', borderRadius: '6px',
          fontSize: '0.82rem', fontWeight: 600,
          textDecoration: 'none', display: 'inline-block'
        }}>View</a>
      </td>
    </tr>
  );
}

export default function Orders() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    ordersAPI.getAll()
      .then((res) => setOrders(res.data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [navigate, user]);

  if (loading) return <Spinner />;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1rem' }}>
      <h2 style={{ fontSize: '1.6rem', color: '#1a1a2e', marginBottom: '1.5rem' }}>
        My Orders
      </h2>

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <p style={{ color: '#888', fontSize: '1.1rem', marginBottom: '1.5rem' }}>
            You have not placed any orders yet.
          </p>
          <Link to="/" style={{
            background: '#e94560', color: 'white',
            padding: '0.75rem 1.5rem', borderRadius: '8px',
            fontWeight: 600, textDecoration: 'none'
          }}>
            Start Shopping
          </Link>
        </div>
      ) : (
        <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#1a1a2e' }}>
                <th style={{ padding: '0.9rem 1rem', textAlign: 'left', color: 'white', fontSize: '0.875rem' }}>Order</th>
                <th style={{ padding: '0.9rem 1rem', textAlign: 'left', color: 'white', fontSize: '0.875rem' }}>Date</th>
                <th style={{ padding: '0.9rem 1rem', textAlign: 'left', color: 'white', fontSize: '0.875rem' }}>Items</th>
                <th style={{ padding: '0.9rem 1rem', textAlign: 'left', color: 'white', fontSize: '0.875rem' }}>Total</th>
                <th style={{ padding: '0.9rem 1rem', textAlign: 'left', color: 'white', fontSize: '0.875rem' }}>Status</th>
                <th style={{ padding: '0.9rem 1rem', textAlign: 'left', color: 'white', fontSize: '0.875rem' }}>Details</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, i) => (
                <OrderRow key={order.id} order={order} index={i} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
