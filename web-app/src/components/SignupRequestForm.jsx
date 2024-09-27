import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

const SignupRequestForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState('Vendor'); // Default role
  const [companyName, setCompanyName] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [experience, setExperience] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create the account request data to send to the backend
    const requestData = {
      name,
      email,
      phone_number: phoneNumber,
      role,
      company_name: role === 'Vendor' ? companyName : null, // Only for Vendors
      business_address: role === 'Vendor' ? businessAddress : null, // Only for Vendors
      experience: role === 'CSR' ? experience : null, // Only for CSRs
      additional_info: additionalInfo,
      requested_at: new Date().toISOString(),
      status: 'pending'
    };

    console.log('Request Data:', requestData);

    // Send requestData to the backend (replace with your API call)
    // Example: axios.post('/api/pending_requests', requestData)

    // Clear the form after submission
    setName('');
    setEmail('');
    setPhoneNumber('');
    setRole('Vendor');
    setCompanyName('');
    setBusinessAddress('');
    setExperience('');
    setAdditionalInfo('');
  };

  return (
    <Container className="mt-5">
      <h2>Request an Account</h2>
      <Form onSubmit={handleSubmit}>
        {/* Name */}
        <Form.Group controlId="formName" className="mt-3">
          <Form.Label>Full Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>

        {/* Email */}
        <Form.Group controlId="formEmail" className="mt-3">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        {/* Phone Number */}
        <Form.Group controlId="formPhoneNumber" className="mt-3">
          <Form.Label>Phone Number</Form.Label>
          <Form.Control
            type="tel"
            placeholder="Enter your phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </Form.Group>

        {/* Role Selection */}
        <Form.Group controlId="formRole" className="mt-3">
          <Form.Label>Select Role</Form.Label>
          <Form.Control
            as="select"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="Vendor">Vendor</option>
            <option value="CSR">Customer Service Representative (CSR)</option>
          </Form.Control>
        </Form.Group>

        {/* Vendor-specific Fields */}
        {role === 'Vendor' && (
          <>
            <Form.Group controlId="formCompanyName" className="mt-3">
              <Form.Label>Company Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your company name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required={role === 'Vendor'}
              />
            </Form.Group>

            <Form.Group controlId="formBusinessAddress" className="mt-3">
              <Form.Label>Business Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your business address"
                value={businessAddress}
                onChange={(e) => setBusinessAddress(e.target.value)}
                required={role === 'Vendor'}
              />
            </Form.Group>
          </>
        )}

        {/* CSR-specific Fields */}
        {role === 'CSR' && (
          <Form.Group controlId="formExperience" className="mt-3">
            <Form.Label>Experience (Optional)</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Describe your experience or qualifications"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
            />
          </Form.Group>
        )}

        {/* Additional Info */}
        <Form.Group controlId="formAdditionalInfo" className="mt-3">
          <Form.Label>Additional Information (Optional)</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Provide any additional information"
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
          />
        </Form.Group>

        {/* Submit Button */}
        <Button variant="primary" type="submit" className="mt-3">
          Send Request
        </Button>
      </Form>
    </Container>
  );
};

export default SignupRequestForm;
