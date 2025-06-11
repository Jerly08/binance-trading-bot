import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Header from './components/Header';
import ConfigForm from './components/ConfigForm';
import OrderList from './components/OrderList';

// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <Router>
      <Header />
      <main className="py-3">
        <Container>
          <Routes>
            <Route path="/" element={<ConfigForm />} />
            <Route path="/orders" element={<OrderList />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Container>
      </main>
    </Router>
  );
}

export default App;
