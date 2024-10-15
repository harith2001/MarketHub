import React, { useState, useEffect } from 'react'
import { Dropdown } from 'react-bootstrap';
import { getStockStatus } from '../../api/product';

const Notification = ({ vendorId }) => {
  const [stockStatus, setStockStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStockStatus = async () => {
      try {
        const stockData = await getStockStatus(vendorId); // get stock
        setStockStatus(stockData);
      } catch (error) {
        console.error("Error fetching stock status:", error);
      } finally {
        setLoading(false); 
      }
    };

    fetchStockStatus();
  }, [vendorId]);

  return (
    <Dropdown align="end">
        <i className="bi bi-bell-fill" style={{ fontSize: '1.5rem', color: '#a8a9aa' }}></i>
      <Dropdown.Menu>
        {loading ? (
          <Dropdown.Item>Loading stock status...</Dropdown.Item>
        ) : stockStatus && stockStatus.length > 0 ? (
          stockStatus.map((product) => {
            let stockMessage = 'Out of Stock';

            if (product.stock > 10) {
              stockMessage = 'In Stock'; // message for normal stock
            } else if (product.stock > 0 && product.stock <= 10) {
              stockMessage = 'Low Stock'; // message for low stock
            }

            return (
              <Dropdown.Item key={product.productId}>
                Product ID: {product.productId} - Stock Status: {stockMessage}
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