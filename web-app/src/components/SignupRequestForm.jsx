import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { createUser } from '../api/user';

const SignupRequestForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Vendor'); 
  const [phoneNum, setPhoneNum] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); 
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); 
    setSuccessMessage(''); 

    try {
      const userData = { name, email, role, isActive: false };
      
      const response = await createUser(userData);
      console.log("User created successfully:", response);
      setSuccessMessage("Your request has been submitted successfully!");
      setName('');
      setEmail('');
      setRole('Vendor');
    } catch (error) {
      console.error("Error creating user:", error);
      setErrorMessage("There was an error submitting your request. Please try again.");
    }
  };

  return (
    <div>
      <div className="position-fixed top-0 w-100 p-3 text-center text-white" style={{ zIndex: 1000, backgroundColor: '#066cdb'}}>
        <h1>MarketHub</h1>
      </div>
      <Container className="position-absolute top-50 start-50 translate-middle w-50" style={{border: '2px solid #066cdb', borderRadius: '10px', padding: '20px', backgroundColor: '#f8f9fa' }}>
      <Row className="w-100 justify-content-center align-items-center">
        <Col md={6} className="border-end shadow-sm p-4 rounded needs-validation">
      <h4 className='mb-4'>Request an Account</h4>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formName">
          <Form.Control
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="formEmail" className="mt-3">
          <Form.Control
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
            </Form.Group>
        <Form.Group controlId="formPhhoneNum" className="mt-3">
          <Form.Control
            type="text"
            placeholder="Phone Number"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="formRole" className="mt-3">
          <Form.Control
                as="select"
                placeholder="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="Vendor">Vendor</option>
            <option value="CSR">Customer Service Representative (CSR)</option>
          </Form.Control>
              </Form.Group>
              <div class="d-grid gap-2">

        <Button variant="primary" type="submit" className="mt-3">
          Send Request
        </Button>
              </div>
          </Form>
        </Col>

        <Col md={6} className="d-none d-md-block">
          <img 
            src="/assets/images/carousel/image-6.jpg" 
            alt="Signup illustration" 
              className="img-fluid rounded" 
              style={{ maxWidth: '100%', maxHeight: '400px', marginLeft: '70px' }}
          />
        </Col>
         </Row>
      </Container>
    </div>

     
  );
};

export default SignupRequestForm;
