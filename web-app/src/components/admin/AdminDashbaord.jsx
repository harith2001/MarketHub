import React, { useState, useEffect } from "react";
import { Card, Row, Col, Container, Table, Dropdown, Button, InputGroup, FormControl, ProgressBar } from "react-bootstrap";
import { Line, Bar, Doughnut} from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, BarElement } from 'chart.js';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Header from "../../components/Header";
import { getAllOrders } from "../../api/order";
import { getAllActiveProducts } from "../../api/product";
import { getUsers } from "../../api/user";
import { useSearch } from "../../SearchContext";

// Register required chart elements
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, BarElement);

const AdminDashbaord = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [salesData, setSalesData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [recentSales, setRecentSales] = useState([]);
  const [latestOrders, setLatestOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showProducts, setShowProducts] = useState(null);
  const DEFAULT_SHIPPING_COST  = 20.00;

  useEffect(() => {
    // Fetch all data for dashboard
    const fetchDashboardCardData = async () => {
      try {
        const orders = await getAllOrders();
        const products = await getAllActiveProducts();
        const users = await getUsers();

        const activeUsers = users.filter(user => user.isActive === true);

        setTotalOrders(orders.length);
        console.log(totalOrders)
        setTotalProducts(products.length);
        setTotalUsers(activeUsers.length);
        
        // Calculate total revenue 
        const totalRevenue = orders
          .filter(order => order.status === 'Delivered' || order.status === 'Shipped')
          .reduce((acc, order) => acc + order.totalPrice, 0);
        setRevenue(totalRevenue);

        // Filter orders and show latest 5 orders
        setLatestOrders(orders.slice(0, 5)); 

        // sales data by day
        const salesByDay = orders
        .reduce((acc, order) => {
          const orderDay = new Date(order.orderDate).getDay();
          acc[orderDay] += order.totalPrice;
          return acc;
        }, new Array(7).fill(0)); //  array of 7 for days of the week
      setSalesData(salesByDay);

        // category data 
        const categoryCount = products.reduce((acc, product) => {
        acc[product.productType] = (acc[product.productType] || 0) + 1;
        return acc;
      }, {});
      
        // Set category data and labels for the chart
        const categories = Object.keys(categoryCount);
        const counts = Object.values(categoryCount);
        setCategoryData({ categories, counts });

      } catch (error) {
        console.error('Error fetching  data for dashboard :', error);
      }
    };

    fetchDashboardCardData();
  }, []);

    // Sales Chart Configuration
    const salesChart = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                label: 'Sales ($)',
                data: salesData,
                backgroundColor: 'rgba(6, 108, 219, 0.2)',
                borderColor: 'rgba(6, 108, 219, 1)',
                borderWidth: 3,
            },
        ],
    };

    // Products by Category Doughnut Chart Configuration
const categoryDoughnutChart = {
  labels: categoryData.categories,
  datasets: [
    {
      label: 'Products Sold by Category',
      data: categoryData.counts,
      backgroundColor: [
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(6, 108, 219, 0.6)',
      ],
      hoverBackgroundColor: [
        'rgba(255, 99, 132, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(75, 192, 192, 0.8)',
        'rgba(6, 108, 219, 0.8)',
      ],
      borderWidth: 1,
    },
  ],
};

// Doughnut chart options
const doughnutOptions = {
  plugins: {
    tooltip: {
      enabled: true,
      callbacks: {
        label: function (tooltipItem) {
          const total = tooltipItem.dataset.data.reduce((acc, val) => acc + val, 0);
          const currentValue = tooltipItem.raw;
          const percentage = ((currentValue / total) * 100).toFixed(2); // Calculate percentage
          const label = tooltipItem.label || '';
          return `${label}: ${percentage}% (${currentValue})`;
        },
      },
    },
  },
  maintainAspectRatio: true, // Ensure it stretches to fit container
};


  // View product details
  const handleShowProducts = (orderId) => {
    setShowProducts(showProducts === orderId ? null : orderId);
  };

  // Get progress based on status
  const getProgress = (status) => {
    switch (status) {
      case 'Processing':
        return 25;
      case 'Shipped':
        return 50;
      case 'Partially':
        return 75;
      case 'Delivered':
        return 100;
      default:
        return 0;
    }
  };

  // Filter the latest orders based on the search term
  const filteredOrders = latestOrders.filter(order =>
    order.customerId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // calculate total for each product
  const calculateProductTotal = (quantity, price) => {
    return quantity * price;
  };

  // calculate subtotal
  const calculateSubtotal = (items) => {
    return items.reduce((acc, product) => {
      return acc + calculateProductTotal(product.quantity, product.price);
    }, 0);
  };

  // calculate total order cost
  const calculateOrderTotal = (items) => {
    const subtotal = calculateSubtotal(items);
    return subtotal + DEFAULT_SHIPPING_COST;
  };
  
  return (
        <Container style={{ marginLeft: '200px', padding: '20px' }}>
      {/* Top Section */}
          <Header title="Admin Dashboard"></Header>

      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center shadow-sm" style={{ backgroundColor: '#fff3cd', borderColor: '#ffc107' }}>
            <Card.Body>
              <Card.Title className="text-warning">Users</Card.Title>
              <Card.Text><h4>{totalUsers}</h4></Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm" style={{ backgroundColor: '#d1ecf1', borderColor: '#17a2b8' }}>
            <Card.Body>
              <Card.Title className="text-info">Products</Card.Title>
              <Card.Text><h4>{totalProducts}</h4></Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm" style={{ backgroundColor: '#f8d7da', borderColor: '#dc3545' }}>
            <Card.Body>
              <Card.Title className="text-danger">Orders</Card.Title>
              <Card.Text><h4>{totalOrders}</h4></Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm" style={{ backgroundColor: '#d4edda', borderColor: '#28a745' }}>
            <Card.Body>
              <Card.Title className="text-success">Revenue</Card.Title>
              <Card.Text><h4>${revenue}</h4></Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Middle Section: Charts */}
      <Row className="mb-4">
        {/* Sales Analytics */}
        <Col md={6}>
          <Card className="shadow-sm mb-4" style={{ height: '400px' }}>
            <Card.Body>
              <Card.Title>Sales Analytics</Card.Title>
              <Line  className="mt-4" data={salesChart} />
            </Card.Body>
          </Card>
        </Col>

        {/* Products by Category */}
        <Col md={4}>
          <Card className="shadow-sm" style={{ height: '400px' }}>
            <Card.Body>
              <Card.Title>Products by Category</Card.Title>
              <div style={{ height: '80%', marginLeft: "40px", marginTop: "30px" }}>
              <Doughnut data={categoryDoughnutChart} options={doughnutOptions}/>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Recent Sales */}
        <Col md={2}>
          <Card className="shadow-sm mb-4" style={{ height: '400px' }}>
            <Card.Body>
              <Card.Title>Recent Sales</Card.Title>
              {recentSales.map((sale) => (
                <div key={sale.id} className="d-flex justify-content-between mb-3">
                  <div>
                    <p>{sale.id}</p>
                  </div>
                  <div className="ms-2">
                    <strong>${sale.amount}</strong>
                  </div>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>

       {/* Bottom Section: Latest Orders Table */}
      <Row>
        <Col>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Latest Orders</Card.Title>
              <Table striped hover responsive>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer ID</th>
                    <th>Amount ($)</th>
                    <th>Order Date</th>
                    <th>Status</th>
                    <th>Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <React.Fragment key={order.orderID}>
                      <tr>
                        <td>{order.orderID}</td>
                        <td>{order.customerId}</td>
                        <td>{order.totalPrice}</td>
                        <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                        <td>
                          <Button
                            style={{
                              backgroundColor:
                                order.status === 'Delivered' ? '#d4edda' :
                                order.status === 'Processing' ? '#fff3cd' :
                                order.status === 'Shipped' ? '#d1ecf1' : 
                                order.status === 'Partially' ? '#e5d1f1' : '#fff3cd',
                              color:
                                order.status === 'Delivered' ? '#155724' :
                                order.status === 'Processing' ? '#856404' :
                                order.status === 'Shipped' ? '#0c5460' :
                                order.status === 'Partially' ? '#7a18b5' : '#fff3cd',
                              border: 'none',
                              borderRadius: '20px',
                              width: '120px',
                            }}
                          >
                            {order.status}
                          </Button>
                        </td>
                        <td>
                          <ProgressBar
                            now={getProgress(order.status)}
                            label={`${getProgress(order.status)}%`}
                            style={{ color: '#066cdb', width: "160px" }}
                            className="me-2 flex-grow-1"
                          />
                        </td>
                        <td>
                          <Button
                            style={{ background: 'none', border: 'none', padding: 0 }}
                            onClick={() => handleShowProducts(order.orderID)}
                          >
                            {showProducts === order.orderID ? (
                              <i style={{ color: '#a8a9aa' }} className="bi bi-caret-up-square-fill"></i>
                            ) : (
                              <i style={{ color: '#a8a9aa' }} className="bi bi-caret-down-square-fill"></i>
                            )}
                          </Button>
                        </td>
                      </tr>
                      {showProducts === order.orderID && (
                        <tr>
                          <td colSpan="6">
                            <Table className="table-borderless">
                              <thead className="text-body-secondary">
                                <tr>
                                  <th>Product ID</th>
                                  <th>Product Name</th>
                                  <th>Product Category</th>
                                  <th>Quantity</th>
                                  <th>Total</th>
                                </tr>
                              </thead>
                              <tbody>
                                {order.items.map((product) => (
                            <tr key={product.productId}>
                              <td>
                                <img
                                  src={product.image}
                                  alt={product.productName}
                                  style={{ width: "50px" }}
                                />
                              </td>
                              <td>{product.productId}</td>
                              <td>{product.productName}</td>
                              <td>{product.quantity}</td>
                              <td>${product.price}</td>
                            </tr>
                          ))}
                          {/* Order Summary */}
                          <tr className="fw-bold">
                            <td colSpan="3"></td>
                            <td>Subtotal</td>
                            <td>${calculateSubtotal(order.items).toFixed(2)}</td>
                          </tr>
                          <tr className="fw-bold">
                            <td colSpan="3"></td>
                            <td>Shipping</td>
                            <td>${DEFAULT_SHIPPING_COST.toFixed(2)}</td>
                          </tr>
                          <tr className="fw-bold">
                            <td colSpan="3"></td>
                            <td>Total</td>
                            <td>${calculateOrderTotal(order.items).toFixed(2)}</td>
                          </tr>
                          {order.note && (
                            <tr>
                              <td colSpan="6">
                                <strong>Customer Note:</strong> {order.note}
                              </td>
                            </tr>
                          )}
                              </tbody>
                            </Table>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default AdminDashbaord