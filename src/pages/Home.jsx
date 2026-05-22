// src/pages/Home.jsx
import { useState, useEffect } from 'react';
import { productsAPI, categoriesAPI } from '../api/client';
import ProductCard from '../components/ProductCard';
import Spinner    from '../components/Spinner';

export default function Home() {
  const [products,   setProducts]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [search,     setSearch]     = useState('');
  const [searchInput,setSearchInput]= useState('');
  const [categoryId, setCategoryId] = useState(0);
  const [loading,    setLoading]    = useState(true);

  // Fetch categories once
  useEffect(() => {
    categoriesAPI.getAll()
      .then(res => setCategories(res.data.data))
      .catch(console.error);
  }, []);

  // Fetch products when filters change
  useEffect(() => {
    setLoading(true);
    const params = {};
    if (search)     params.search   = search;
    if (categoryId) params.category = categoryId;

    productsAPI.getAll(params)
      .then(res => setProducts(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [search, categoryId]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setCategoryId(0);
  };

  const handleCategory = (id) => {
    setCategoryId(id);
    setSearch('');
    setSearchInput('');
  };

  const clearFilters = () => {
    setSearch('');
    setSearchInput('');
    setCategoryId(0);
  };

  return (
    <div>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #e94560 100%)',
        color: 'white', padding: '4rem 2rem', textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '2.4rem', marginBottom: '0.5rem' }}>
          Find Everything You Need
        </h1>
        <p style={{ fontSize: '1.1rem', opacity: 0.85, marginBottom: '1.5rem' }}>
          Quality products at unbeatable prices
        </p>

        <form onSubmit={handleSearch} style={{
          display: 'flex', justifyContent: 'center',
          gap: '0.5rem', flexWrap: 'wrap'
        }}>
          <input
            type="text"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            placeholder="Search products..."
            style={{
              padding: '0.75rem 1rem', borderRadius: '8px',
              border: 'none', fontSize: '1rem',
              width: '340px', maxWidth: '100%'
            }}
          />
          <button type="submit" style={{
            background: '#e94560', color: 'white',
            border: 'none', padding: '0.75rem 1.5rem',
            borderRadius: '8px', fontSize: '1rem',
            fontWeight: 600, cursor: 'pointer'
          }}>
            Search
          </button>
        </form>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1rem' }}>

        {/* Category Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', margin: '1.5rem 0 1rem' }}>
          <button onClick={clearFilters} style={pillStyle(categoryId === 0 && !search)}>
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => handleCategory(cat.id)}
              style={pillStyle(categoryId === cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Results info */}
        {(search || categoryId > 0) && (
          <div style={{ marginBottom: '1rem', color: '#555', fontSize: '0.95rem' }}>
            {products.length} result(s)
            {search && <> for "<strong>{search}</strong>"</>}
            {categoryId > 0 && (
              <> in <strong>{categories.find(c => c.id === categoryId)?.name}</strong></>
            )}
            {' — '}
            <button onClick={clearFilters} style={{
              background: 'none', border: 'none',
              color: '#e94560', cursor: 'pointer',
              fontWeight: 600, padding: 0
            }}>
              Clear filters
            </button>
          </div>
        )}

        {/* Product Grid */}
        {loading ? (
          <Spinner />
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#888' }}>
            <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>😕 No products found.</p>
            <button onClick={clearFilters} style={{
              background: '#1a1a2e', color: 'white',
              border: 'none', padding: '0.75rem 1.5rem',
              borderRadius: '8px', cursor: 'pointer', fontWeight: 600
            }}>
              Browse All
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '1.5rem', paddingBottom: '3rem'
          }}>
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const pillStyle = (active) => ({
  padding: '0.4rem 1rem', borderRadius: '999px',
  border: '2px solid #1a1a2e',
  background: active ? '#1a1a2e' : 'transparent',
  color: active ? 'white' : '#1a1a2e',
  fontSize: '0.875rem', fontWeight: 600,
  cursor: 'pointer', transition: 'all 0.2s'
});
