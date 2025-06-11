import React, { useState, useEffect } from 'react';
import { Container, Table, Card, Alert } from 'react-bootstrap';
import axios from 'axios';

// Create axios instance with base URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL
});

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/api/orders');
        setOrders(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders');
        setLoading(false);
      }
    };

    fetchOrders();
    // Refresh orders every 30 seconds
    const interval = setInterval(fetchOrders, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading) {
    return <div>Loading orders...</div>;
  }

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header as="h4">Simulated Orders</Card.Header>
        <Card.Body>
          {error && (
            <Alert variant="danger">
              {error}
            </Alert>
          )}
          
          {orders.length === 0 ? (
            <Alert variant="info">
              No orders have been placed yet. Waiting for signals...
            </Alert>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th>Action</th>
                  <th>Entry Price</th>
                  <th>TP Price</th>
                  <th>SL Price</th>
                  <th>Leverage</th>
                  <th>Timeframe</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr key={index} className={order.action === 'BUY' ? 'table-success' : 'table-danger'}>
                    <td>{order.symbol}</td>
                    <td>{order.action}</td>
                    <td>{parseFloat(order.price_entry).toFixed(2)}</td>
                    <td>{order.tp_price}</td>
                    <td>{order.sl_price}</td>
                    <td>{order.leverage}</td>
                    <td>{order.timeframe}</td>
                    <td>{formatDate(order.timestamp)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default OrderList; 