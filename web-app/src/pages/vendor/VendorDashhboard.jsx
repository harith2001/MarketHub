import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Button } from 'react-bootstrap';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, ArcElement, BarElement, Title } from 'chart.js';
import Header from '../../components/Header';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, ArcElement, BarElement, Title);

const VendorDashhboard = () => {
    const [totalProducts, setTotalProducts] = useState(15); // Example data
  const [pendingOrders, setPendingOrders] = useState(5);
  const [completedOrders, setCompletedOrders] = useState(30);
  const [revenue, setRevenue] = useState(1500);

  // Sales data by category
  const [categorySalesData, setCategorySalesData] = useState({
    categories: ['Electronics', 'Clothing'],
    sales: [400, 350]
  });

  // Recent orders data
  const [recentOrders, setRecentOrders] = useState([
    { id: 'ORD123', customer: 'John Doe', date: '05-10-2024', total: 120.0, status: 'Pending' },
    { id: 'ORD124', customer: 'Jane Smith', date: '05-10-2024', total: 200.0, status: 'Delivered' },
    { id: 'ORD125', customer: 'Michael Brown', date: '05-10-2024', total: 75.0, status: 'Pending' },
  ]);

  // Sales and Profit data for chart
  const [salesData, setSalesData] = useState([100, 200, 150, 300, 400, 250, 450]);
  const [profitData, setProfitData] = useState([50, 120, 80, 200, 250, 150, 300]);

  useEffect(() => {
    // Fetch actual data from API if needed
  }, []);

  // Sales chart configuration
  const salesChart = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Sales ($)',
        data: salesData,
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
        data: profitData,
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
        {/* Overview Cards */}
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

      <Row>
        {/* Recent Orders */}
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
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{order.customer}</td>
                      <td>{order.date}</td>
                      <td>{order.total}</td>
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