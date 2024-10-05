import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    if (!role) {
      alert("Please select a role");
      return;
    }
    //API request
    console.log({ name, email, password });
    // Redirect the user to the login page after signup
    navigate("/login");
  };
  return (
    <Container className="mt-5 border border-dark-subtle p-4 rounded needs-validation">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <h3 className="text-center mb-4">Create a New Account</h3>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formEmail" className="mt-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formRole" className="mt-3">
              <Form.Label>Select Role</Form.Label>
              <div className="d-flex justify-content-between">
                <Form.Check
                  type="radio"
                  label="Administrator"
                  name="role"
                  value="Administrator"
                  onChange={(e) => setRole(e.target.value)}
                />
                <Form.Check
                  type="radio"
                  label="Vendor"
                  name="role"
                  value="Vendor"
                  onChange={(e) => setRole(e.target.value)}
                />
                <Form.Check
                  type="radio"
                  label="Customer Service Representative (CSR)"
                  name="role"
                  value="CSR"
                  onChange={(e) => setRole(e.target.value)}
                />
                <Form.Check
                  type="radio"
                  label="Customer"
                  name="role"
                  value="Customer"
                  onChange={(e) => setRole(e.target.value)}
                />
              </div>
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

            <Form.Group controlId="formConfirmPassword" className="mt-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </Form.Group>

            <div class="form-check mt-3">
              <input
                class="form-check-input"
                type="checkbox"
                value=""
                id="invalidCheck"
                required
              ></input>
              <label class="form-check-label" for="invalidCheck">
                Agree to terms and conditions
              </label>
              <div class="invalid-feedback">
                You must agree before submitting.
              </div>
            </div>

            <div className="d-grid gap-2">
              <Button
                variant="primary"
                type="submit"
                className="mt-3 justify-content-center"
              >
                Sign Up
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Signup;
