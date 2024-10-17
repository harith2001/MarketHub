import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Toast } from 'react-bootstrap';
import { updateUser } from '../api/user';

const UserProfile = ({ user, show, onHide }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);
  
  const handleSave = async () => {
    try {
      // set the updated data
      const updatedData = {
        name,
        email
      };
      await updateUser(user.user_ID, updatedData); // call user update API
      // success toast message
      setToastMessage('User profile updated successfully!');
      setToastType('success');
      setShowToast(true);
      onHide(); // Close modal after saving
    } catch (error) {
      console.error("Error updating user:", error);
      // error toast message
      setToastMessage('Failed to update user profile.');
      setToastType('error');
      setShowToast(true);
    }
  };
    
  console.log("User profile: ", user);
  return (
    <>
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>User Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <Form>
          <Form.Group controlId="formUserId" className="mb-3">
            <div className="d-flex justify-content-between align-items-center">
            <Form.Label>User ID</Form.Label>
            <Form.Control type="text" style={{ width: '70%', pointerEvents: 'none' }} value={user?.user_ID || ''} readOnly />
            </div>
          </Form.Group>
          <Form.Group controlId="formName" className="mb-3">
            <div className="d-flex justify-content-between align-items-center">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ width: '70%' }} // Set the width for better layout
              />
            </div>
          </Form.Group>
          <Form.Group controlId="formEmail" className="mb-3">
            <div className="d-flex justify-content-between align-items-center">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '70%' }} // Set the width for better layout
              />
            </div>
          </Form.Group>
          <Form.Group controlId="formRole" className="mb-3">
            <div className="d-flex justify-content-between align-items-center">
              <Form.Label>Role</Form.Label>
              <Form.Control type="text" value={user?.role || ''} readOnly style={{ width: '70%', pointerEvents: 'none' }} />
            </div>
          </Form.Group>
          <Form.Group controlId="formStatus" className="mb-3">
            <div className="d-flex justify-content-between align-items-center">
              <Form.Label>Status</Form.Label>
              <Form.Control type="text" value={user?.isActive ? "Active" : "Inactive"} readOnly style={{ width: '70%', pointerEvents: 'none' }} />
            </div>
          </Form.Group>
          <Form.Group controlId="formCreatedDate" className="mb-3">
            <div className="d-flex justify-content-between align-items-center">
              <Form.Label>Created Date</Form.Label>
              <Form.Control type="text" value={new Date(user?.createdAt).toLocaleDateString()} readOnly style={{ width: '70%', pointerEvents: 'none' }} />
            </div>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-primary" onClick={onHide}>Cancel</Button>
        <Button variant="primary" onClick={handleSave}>Save Changes</Button>
      </Modal.Footer>
    </Modal>

    {/* Toast for notifications */}
      <Toast
        onClose={() => setShowToast(false)}
        show={showToast}
        delay={3000}
        autohide
        style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 1050 }}
        bg={toastType === 'success' ? 'success' : 'danger'}
      >
        <Toast.Body className="text-white">{toastMessage}</Toast.Body>
      </Toast>
    </>
  )
}

export default UserProfile