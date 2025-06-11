import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Card, Alert } from 'react-bootstrap';
import axios from 'axios';

// Create axios instance with base URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL
});

const ConfigForm = () => {
  const [config, setConfig] = useState({
    symbol: 'BTCUSDT',
    timeframe: '5m',
    plusDIThreshold: 25,
    minusDIThreshold: 20,
    adxMinimum: 20,
    takeProfitPercentage: 2,
    stopLossPercentage: 1,
    leverage: 10
  });
  
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch current configuration
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await api.get('/api/config');
        setConfig(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching configuration:', err);
        setError('Failed to load configuration');
        setLoading(false);
      }
    };
    
    fetchConfig();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Convert numeric values to numbers
    const parsedValue = ['symbol', 'timeframe'].includes(name) ? value : parseFloat(value);
    setConfig({
      ...config,
      [name]: parsedValue
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/config', config);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Error saving configuration:', err);
      setError('Failed to save configuration');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleReset = () => {
    setConfig({
      symbol: 'BTCUSDT',
      timeframe: '5m',
      plusDIThreshold: 25,
      minusDIThreshold: 20,
      adxMinimum: 20,
      takeProfitPercentage: 2,
      stopLossPercentage: 1,
      leverage: 10
    });
  };

  if (loading) {
    return <div>Loading configuration...</div>;
  }

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header as="h4">Strategy Configuration</Card.Header>
        <Card.Body>
          {saved && (
            <Alert variant="success">
              Configuration saved successfully!
            </Alert>
          )}
          {error && (
            <Alert variant="danger">
              {error}
            </Alert>
          )}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Symbol</Form.Label>
              <Form.Control 
                type="text" 
                name="symbol" 
                value={config.symbol} 
                onChange={handleChange} 
              />
              <Form.Text className="text-muted">
                Trading pair (e.g., BTCUSDT)
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Timeframe</Form.Label>
              <Form.Select 
                name="timeframe" 
                value={config.timeframe} 
                onChange={handleChange}
              >
                <option value="1m">1m</option>
                <option value="5m">5m</option>
                <option value="15m">15m</option>
                <option value="30m">30m</option>
                <option value="1h">1h</option>
                <option value="4h">4h</option>
                <option value="1d">1d</option>
              </Form.Select>
              <Form.Text className="text-muted">
                Chart timeframe
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>+DI Threshold</Form.Label>
              <Form.Control 
                type="number" 
                name="plusDIThreshold" 
                value={config.plusDIThreshold} 
                onChange={handleChange} 
                min="0" 
                max="100" 
                step="0.1"
              />
              <Form.Text className="text-muted">
                Positive Directional Indicator threshold
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>-DI Threshold</Form.Label>
              <Form.Control 
                type="number" 
                name="minusDIThreshold" 
                value={config.minusDIThreshold} 
                onChange={handleChange} 
                min="0" 
                max="100" 
                step="0.1"
              />
              <Form.Text className="text-muted">
                Negative Directional Indicator threshold
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>ADX Minimum</Form.Label>
              <Form.Control 
                type="number" 
                name="adxMinimum" 
                value={config.adxMinimum} 
                onChange={handleChange} 
                min="0" 
                max="100" 
                step="0.1"
              />
              <Form.Text className="text-muted">
                Average Directional Index minimum value
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Take Profit % </Form.Label>
              <Form.Control 
                type="number" 
                name="takeProfitPercentage" 
                value={config.takeProfitPercentage} 
                onChange={handleChange} 
                min="0.1" 
                step="0.1"
              />
              <Form.Text className="text-muted">
                Target profit percentage
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Stop Loss %</Form.Label>
              <Form.Control 
                type="number" 
                name="stopLossPercentage" 
                value={config.stopLossPercentage} 
                onChange={handleChange} 
                min="0.1" 
                step="0.1"
              />
              <Form.Text className="text-muted">
                Maximum loss percentage
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Leverage</Form.Label>
              <Form.Control 
                type="number" 
                name="leverage" 
                value={config.leverage} 
                onChange={handleChange} 
                min="1" 
                max="125" 
                step="1"
              />
              <Form.Text className="text-muted">
                Trading leverage multiplier
              </Form.Text>
            </Form.Group>

            <div className="d-flex justify-content-between">
              <Button variant="primary" type="submit">
                Save Configuration
              </Button>
              <Button variant="secondary" onClick={handleReset}>
                Reset to Default
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ConfigForm; 