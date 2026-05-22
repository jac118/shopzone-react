import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar        from './components/Navbar';
import Home          from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Login         from './pages/Login';
import Register      from './pages/Register';
import Cart          from './pages/Cart';
import Orders        from './pages/Orders';
import NotFound      from './pages/NotFound';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <div style={{ minHeight:'100vh', background:'#f4f6f8', display:'flex', flexDirection:'column' }}>
            <Navbar />
            <main style={{ flex:1 }}>
              <Routes>
                <Route path="/"             element={<Home />}          />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/login"        element={<Login />}         />
                <Route path="/register"     element={<Register />}      />
                <Route path="/cart"         element={<Cart />}          />
                <Route path="/orders"       element={<Orders />}        />
                <Route path="*"             element={<NotFound />}      />
              </Routes>
            </main>
            <footer style={{
              background:'#1a1a2e', color:'#aaa',
              textAlign:'center', padding:'1.2rem', fontSize:'0.85rem'
            }}>
              © {new Date().getFullYear()} ShopZone. All rights reserved.
            </footer>
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
