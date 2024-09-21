import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    //API request to log the user in
    console.log({ email, password });
    //redirect the user
    navigate("/");
  };

  return (
    <Container
      fluid
      className="mt-5 px-3 border p-4 items-align-center justify-content-center rounded needs-validation"
    >
      <Row className="justify-content-center">
        <Col md={6} lg={4} className="border-end pe-4">
          <h2>Login</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formPassword" className="mt-3">
              <Form.Label>Password</Form.Label>
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
          </Form>
        </Col>

        <Col
          md={6}
          lg={4}
          className="d-flex flex-column align-items-center mx-5 justify-content-center bg-success p-2 text-dark bg-opacity-25"
        >
          <h3 className="text-center mb-4">New Here?</h3>
          <p>Create an account to get started with our services.</p>
          <Button
            variant="success"
            className="mt-3 btn-block"
            onClick={() => navigate("/sign-up")}
          >
            Create New Account
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Signin;
