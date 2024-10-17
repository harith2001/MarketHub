import React, { useState, useEffect } from 'react'
import { Dropdown } from 'react-bootstrap';
import { getLowStockProducts } from '../../api/product';

const Notification = ({ vendorId }) => {
  const [stockStatus, setStockStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLowStockProducts = async () => {
      try {
        const stockData = await getLowStockProducts(vendorId); // get stock
        setStockStatus(stockData);
      } catch (error) {
        console.error("Error fetching stock status:", error);
      } finally {
        setLoading(false); 
      }
    };

    fetchLowStockProducts();
  }, [vendorId]);

  return (
    <Dropdown align="end">
        <i className="bi bi-bell-fill" style={{ fontSize: '1.5rem', color: '#a8a9aa' }}></i>
      <Dropdown.Menu>
        {loading ? (
          <Dropdown.Item>Loading stock status...</Dropdown.Item>
        ) : stockStatus ? (
          stockStatus.map((product) => {
            let stockMessage = 'is on low stock';
            return (
              <Dropdown.Item key={product.productId}>
                Product ID {product.productId} {stockMessage}
              </Dropdown.Item>
            );
          })
        ) : (
          <Dropdown.Item>No stock status available</Dropdown.Item>
        )}
      </Dropdown.Menu>
    </Dropdown>
  )
}

export default Notification