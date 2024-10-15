import { useState } from 'react';
import React from 'react';
import { useNavigate } from "react-router-dom";
import { Carousel, Form, Button, Card, Row, Col, Container } from 'react-bootstrap';
import { loginUser, getUserByEmail } from '../api/user';

const FirstPage = ({ setUserRole, setVendorId }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = { email, password };
      const response = await loginUser(userData);
        console.log("Login Successful: ", response);
        
        const user = await getUserByEmail(email);
        console.log("Fetched User: ", user);

      const userRole = user?.role; 
      const vendorID = user?.user_ID;
        setUserRole(userRole);
        console.log("user role: ", userRole)
        
        if (userRole === "Admin") {
            navigate("/admin/dashboard");
        }
        else if (userRole === "Vendor") {
          setVendorId(vendorID);
            navigate("/vendor/dashboard");
        }
        else if (userRole === "CSR") {
            navigate("/csr/dashboard");
        }
        else{
            setErrorMessage("Invalid user role");
        }
      
    } catch (error) {
      console.error("Login failed:", error);
      setErrorMessage("Invalid email or password. Please try again.");
    }
  };

  return (
      <div className="position-relative vh-100">
          <div className="position-fixed top-0 w-100 p-3 text-center text-white" style={{ zIndex: 1000, backgroundColor: '#066cdb'}}>
        <h1>MarketHub</h1>
      </div>
      <Carousel id="carouselExampleCaptions" controls={false} indicators={true} interval={4000} fade className="vh-100">
        {/* Carousel Item 1 */}
        <Carousel.Item style={{ backgroundColor: 'rgba(130, 234, 255, 0.8)', height: '100vh', position: 'relative' }}>
          <img
            className="d-block w-100 h-100"
            src="/assets/images/carousel/image-1.jpg" 
            alt="First slide"
          />
        </Carousel.Item>

        {/* Carousel Item 2 */}
        <Carousel.Item style={{ backgroundColor: 'rgba(130, 234, 255, 0.8)', height: '100vh', position: 'relative' }}>
          <img
            className="d-block w-100 h-100"
            src="/assets/images/carousel/image-2.jpg" 
            alt="Second slide"
          />
        </Carousel.Item>

        {/* Carousel Item 3 */}
        <Carousel.Item style={{ backgroundColor: 'rgba(255, 234, 255, 0.8)', height: '100vh', position: 'relative' }}>
          <img
            className="d-block w-100 h-100"
            src="/assets/images/carousel/image-3.jpg" 
            alt="Third slide"
          />
        </Carousel.Item>

        {/* Carousel Item 4 */}
        <Carousel.Item style={{ backgroundColor: 'rgba(130, 234, 255, 0.8)', height: '100vh', position: 'relative' }}>
          <img
            className="d-block w-100 h-100"
            src="/assets/images/carousel/image-4.jpg" 
            alt="Fourth slide"
          />
        </Carousel.Item>

        {/* Carousel Item 5 */}
        <Carousel.Item style={{ backgroundColor: 'rgba(130, 234, 255, 0.8)', height: '100vh', position: 'relative' }}>
          <img
            className="d-block w-100 h-100"
            src="/assets/images/carousel/image-5.jpg" 
            alt="Fifth slide"
          />
        </Carousel.Item>
      </Carousel>

      {/* Login Form Overlay */}
      <Container
        className="position-absolute top-50 start-50 translate-middle w-50"
        style={{ zIndex: '1', backgroundColor: 'rgba(6, 108, 219, 0.8', borderRadius: '10px', padding: '10px' }}
      >
        <Card className="p-4 shadow-lg">
          <Row className="align-items-center">
        <Col md={6} className="pe-4">
          <h3 className="mb-4">Welcome back!</h3>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formEmail">
                                  <Form.Control
                                      className='outline'
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formPassword" className="mt-3">
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <div class="d-grid gap-2">
              <Button variant="primary" type="submit" className="mt-3">
                Login
              </Button>
                              </div>
                              {errorMessage && (
                  <div className="text-danger text-center mt-3">{errorMessage}</div>
                )}
          </Form>
        </Col>

        <Col
          md={6}
                          className="d-flex flex-column align-items-center justify-content-center bg-opacity border rounded"
                          style={{backgroundColor: 'rgba(6, 108, 219, 0.6', padding: "30px"}}
        >
          <h3 className="text-center mb-4">New Here?</h3>
          <p>Request to start with a new account.</p>
          <Button
            className="mt-3 btn-block btn-light"
            onClick={() => navigate("/signup-request")}
          >
            Request New Account
          </Button>
        </Col>
      </Row>
        </Card>
      </Container>
    </div>
  );
};

export default FirstPage;
