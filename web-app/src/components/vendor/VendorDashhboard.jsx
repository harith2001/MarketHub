import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Button } from 'react-bootstrap';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, ArcElement, BarElement, Title } from 'chart.js';
import Header from '../../components/Header';
import { getAllOrders } from '../../api/order';
import { getAllActiveProducts } from '../../api/product';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, ArcElement, BarElement, Title);

const VendorDashhboard = ({ vendorId }) => {
  const [totalProducts, setTotalProducts] = useState(0); // Example data
  const [pendingOrders, setPendingOrders] = useState(0);
  const [completedOrders, setCompletedOrders] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [recentOrders, setRecentOrders] = useState([]);
  const [categorySalesData, setCategorySalesData] = useState({
    categories: [],
    sales: []
  });

  useEffect(() => {
    fetchVendorOrders(); // Fetch all orders for a specific vendor
  }, [vendorId]);

  const fetchVendorOrders = async () => {
    try {
      const orders = await getAllOrders(); // Fetch all orders
      const products = await getAllActiveProducts(); // fetch all products

      const vendorOrders = orders.filter(order =>
        order.items.some(item => item.vendorId === vendorId)
      );
      const vendorProducts = products.filter(product => product.vendorId === vendorId);

      // Calculate the totals for cards
      const pending = vendorOrders.filter(order => order.status === 'Pending').length;
      const completed = vendorOrders.filter(order => order.status === 'Completed').length;
      const totalRevenue = vendorOrders
        .filter(order => order.status === 'Completed')
        .reduce((acc, order) => acc + order.totalPrice, 0);

      setPendingOrders(pending);
      setCompletedOrders(completed);
      setRevenue(totalRevenue);
      setTotalProducts(vendorProducts.length);

      // Set recent 5 orders
      setRecentOrders(vendorOrders.slice(0, 5));

      // Sales by category
      const categorySalesMap = {};
      vendorOrders.forEach(order => {
        order.items.forEach(item => {
          if (item.vendorId === vendorId) {
            categorySalesMap[item.productName] = (categorySalesMap[item.productName] || 0) + item.price;
          }
        });
      });

      const categories = Object.keys(categorySalesMap);
      const sales = Object.values(categorySalesMap);

      setCategorySalesData({ categories, sales });
    } catch (error) {
      console.error('Error occured when fetching vendor orders:', error);
    }
  };

  // Sales chart configuration
  const salesChart = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Sales ($)',
        data: recentOrders.map(order => order.totalPrice),
        backgroundColor: 'rgba(6, 108, 219, 0.2)',
        borderColor: 'rgba(6, 108, 219, 1)',
        borderWidth: 4,
        fill: true,
      },
    ],
  };

  // Profit chart configuration
  const profitDoughnutChart = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Profit Distribution',
        data: recentOrders.map(order => order.totalPrice / 1.2),
        backgroundColor: [
        'rgba(255, 99, 132, 0.6)',
        'rgba(14, 193, 93  , 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(6, 108, 219, 0.6)',
        'rgba(151, 58, 208, 0.6)',
        'rgba(4, 66, 135, 0.6)',
        ],
        hoverBackgroundColor: [
        'rgba(255, 99, 132, 0.8)',
        'rgba(14, 193, 93 , 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(75, 192, 192, 0.8)',
        'rgba(6, 108, 219, 0.8)',
        'rgba(151, 58, 208, 0.8)',
        'rgba(4, 66, 135, 0.8)',
      ],
      },
    ],
  };
  
  // Sales by Category Bar Chart
  const categorySalesChart = {
    labels: categorySalesData.categories,
    datasets: [
      {
        label: 'Sales by Category',
        data: categorySalesData.sales,
        backgroundColor: 'rgba(6, 108, 219, 0.8)',
        borderWidth: 1,
      },
    ],
  };
    
    const doughnutOptions = {
    plugins: {
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const total = tooltipItem.dataset.data.reduce((acc, val) => acc + val, 0);
            const currentValue = tooltipItem.raw;
            const percentage = ((currentValue / total) * 100).toFixed(2); // Calculate percentage
            const label = tooltipItem.label || '';
            return `${label}: ${percentage}% (${currentValue}$)`;
          },
        },
      },
    },
  };

  const getStatusButtonStyle = (status) => {
    switch (status) {
      case "Delivered":
        return {
          backgroundColor: "#d4edda",
          color: "#155724",
          border: "none",
          borderRadius: "20px",
          width: "120px",
        };
      case "Cancelled":
        return {
          backgroundColor: "#f8d7da",
          color: "#721c24",
          border: "none",
          borderRadius: "20px",
          width: "100px",
        };
      case "Pending":
        return {
          backgroundColor: "#fff3cd",
          color: "#856404",
          border: "none",
          borderRadius: "20px",
          width: "120px",
        };
      case "Confirmed":
        return {
          backgroundColor: "#d1ecf1",
          color: "#0c5460",
          border: "none",
          borderRadius: "20px",
          width: "120px",
        };
      default:
        return {
          backgroundColor: "#f8f9fa",
          color: "#6c757d",
          border: "none",
          borderRadius: "20px",
          width: "120px",
        };
    }
  };
    
  return (
    <div style={{ marginLeft: '200px', padding: '20px' }}>
      <Header title="Dashbaord"></Header>
          <Row className="mb-4">
        {/* Cards */}
        <Col md={3} className='mt-4'>
          <Card className="bg-success bg-opacity-25 border border-success shadow-sm">
            <Card.Body>
              <Card.Title className="text-success pb-2">Total Products</Card.Title>
              <Card.Text>
                <h4>{totalProducts}</h4>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className='mt-4'>
          <Card className="bg-warning bg-opacity-25 border border-warning shadow-sm">
            <Card.Body>
              <Card.Title className="text-warning pb-2">Pending Orders</Card.Title>
              <Card.Text>
                <h4>{pendingOrders}</h4>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className='mt-4'>
          <Card className="bg-info bg-opacity-25 border border-info shadow-sm">
            <Card.Body>
              <Card.Title className="text-info pb-2">Completed Orders</Card.Title>
              <Card.Text>
                <h4>{completedOrders}</h4>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className='mt-4'>
          <Card className="bg-danger bg-opacity-25 border border-danger shadow-sm">
            <Card.Body>
              <Card.Title className="text-danger pb-2">Revenue</Card.Title>
              <Card.Text>
                <h4>${revenue}</h4>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Sales Chart */}
      <Row>
        <Col md={6} className='mt-4'>
          <Card className="mb-4 shadow-sm" style={{ height: '300px' }}>
          <h4 className='ms-4 mt-4'>Sales Trends</h4>
            <Card.Body style={{ height: '250px', width: '600px' }} className="d-flex flex-column justify-content-center  align-items-center">
              <Line data={salesChart}/>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className='mt-4'>
          <Card className="mb-4 shadow-sm" style={{ height: '300px' }}>
            <h4 className='ms-4 mt-4'>Sales by Category</h4>
            <Card.Body className="d-flex flex-column justify-content-center align-items-center">
              <Bar data={categorySalesChart} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className='mt-4'>
          <Card className="mb-4 shadow-sm" style={{ height: '300px' }}>
          <h4 className='ms-4 mt-4'>Profit Trends</h4>
            <Card.Body style={{ height: '200px'}} className="d-flex flex-column justify-content-center align-items-center">
                <Doughnut data={profitDoughnutChart} options={doughnutOptions} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

        {/* Recent Orders */}
      <Row>
        <Col>
          <Card className="shadow-sm mt-4">
            <Card.Body>
            <Card.Title>Recent Orders</Card.Title>
              <Table striped hover responsive>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Total ($)</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map(order => (
                    <tr key={order.orderID}>
                      <td>{order.orderID}</td>
                      <td>{order.customerId}</td>
                      <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                      <td>{order.totalPrice}</td>
                      <td>
                        <Button style={getStatusButtonStyle(order.status)} disabled>
                          {order.status}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default VendorDashhboard