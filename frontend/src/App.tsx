import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CatalogPage from './pages/CatalogPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<CatalogPage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route
            path="/product/:rootbeerName/:rootbeerId/:currentRetailPrice"
            element={<ProductPage />}
          />
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
