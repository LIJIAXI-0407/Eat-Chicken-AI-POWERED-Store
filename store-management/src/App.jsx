import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Product from './pages/Product/Product';
import Order from './pages/Order/Order';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/product" element={<Product />} />
        <Route path="/order" element={<Order />} />
        <Route path="/" element={<Product />} />
      </Routes>
    </Router>
  );
}

export default App; 