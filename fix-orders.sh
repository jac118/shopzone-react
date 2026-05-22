#!/bin/bash
cat > /var/www/html/shopzone-react/src/pages/Orders.jsx << 'ENDOFFILE'
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ordersAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';

export default function Orders() {
  const { user }              = useAuth();
  const navigate              = useNavigate();
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    ordersAPI.getAll()
      .then(res => setOrders(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  const statusColors = {
    pending:    '#d97706',
    processing: '#2563eb',
    shipped:    '#7c3aed',
    delivered:  '#16a34a',
    cancelled:  '#dc2626',
  };

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });

  if (loading) return <Spinner />;

  return (
    <div style={{ maxWidth:'900px', margin:'0 auto', padding:'2rem 1rem' }}>
      <h2 style={{ fontSize:'1.6rem', color:'#1a1a2e', marginBottom:'1.5rem' }}>
        My Orders
      </h2>

      {orders.length === 0 ? (
        <div style={{ textAlign:'center', padding:'4rem 2rem' }}>
          <p style={{ color:'#888', fontSize:'1.1rem', marginBottom:'1.5rem' }}>
            You have not placed any orders yet.
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
        <div style={{
          background:'white', borderRadius:'12px',
          boxShadow:'0 2px 12px rgba(0,0,0,0.07)',
          overflow:'hidden'
        }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ background:'#1a1a2e' }}>
                {['Order #', 'Date', 'Items', 'Total', 'Status', 'Details'].map(h => (
                  <th key={h} style={{
                    padding:'0.9rem 1rem', textAlign:'left',
                    color:'white', fontSize:'0.875rem', fontWeight:600
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((order, i) => (
                <tr
                  key={order.id}
                  style={{
                    borderBottom:'1px solid #f0f0f0',
                    background: i % 2 === 0 ? 'white' : '#fafafa'
                  }}
                >
                  <td style={{ padding:'0.9rem 1rem', fontWeight:700 }}>
                    #{order.id}
                  </td>
                  <td style={{ padding:'0.9rem 1rem', fontSize:'0.9rem', color:'#555' }}>
                    {formatDate(order.created_at)}
                  </td>
                  <td style={{ padding:'0.9rem 1rem', fontSize:'0.9rem', color:'#555' }}>
                    {order.item_count} item(s)
                  </td>
                  <td style={{ padding:'0.9rem 1rem', fontWeight:700 }}>
                    ${parseFloat(order.total_price).toFixed(2)}
                  </td>
                  <td style={{ padding:'0.9rem 1rem' }}>
                    <span style={{
                      background: statusColors[order.status] || '#6b7280',
                      color:'white', fontSize:'0.75rem', fontWeight:700,
                      padding:'0.25rem 0.75rem', borderRadius:'999px',
                      display:'inline-block'
                    }}>
                      {capitalize(order.status)}
                    </span>
                  </td>
                  <td style={{ padding:'0.9rem 1rem' }}>
                    
                      href={`http://localhost/ecommerce/public/order-confirm.php?id=${order.id}`}
                      style={{
                        background:'#1a1a2e', color:'white',
                        padding:'0.35rem 0.85rem', borderRadius:'6px',
                        fontSize:'0.82rem', fontWeight:600,
                        textDecoration:'none', display:'inline-block'
                      }}
                    >
                      View
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
ENDOFFILE

echo "Orders.jsx written successfully!"
wc -l /var/www/html/shopzone-react/src/pages/Orders.jsx
